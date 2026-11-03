import {describe,it,expect,afterAll,beforeAll} from 'vitest';
import {createServer, type Server} from 'node:http';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';


const root=mkdtempSync(join(tmpdir(),'habblaud-review-'));
const workspace=join(root,'workspace');
const store=join(root,'agent-workbench.json');
mkdirSync(workspace);
const source=join(workspace,'example.js');
writeFileSync(source,'const answer = 42;\n');
writeFileSync(store,JSON.stringify({agents:[],skills:[],workspaces:[{id:'reviewtest',name:'Testes',path:workspace}]}));
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
let server:Server;let base='';
beforeAll(async()=>{
 process.env.HABBLAUD_AI_DATA_DIR=root;
 const {createWorkbenchHandler}=await import('./agent-workbench');
 const handler=createWorkbenchHandler(root);
 server=createServer((req,res)=>{handler(req,res,new URL(req.url||'/', 'http://localhost'));});
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
 const addr=server.address();if(!addr||typeof addr==='string')throw Error('No port');
 base='http://127.0.0.1:'+addr.port;
});
afterAll(async()=>{await new Promise<void>(resolve=>server.close(()=>resolve()));rmSync(root,{recursive:true,force:true});delete process.env.HABBLAUD_AI_DATA_DIR;});
async function post(action:string,body:object){
 const r=await fetch(base+'/api/agent-workbench/'+action,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 return {status:r.status,body:await r.json()};
}
describe('Code Review Center - revisão não destrutiva',()=>{
 it('lê hash real, valida diff e não modifica original',async()=>{
  const read=await post('inspect',{workspace:'reviewtest',mode:'read',file:'example.js'});
  expect(read.status).toBe(200);
  expect(read.body.sha256).toBe(hash('const answer = 42;\n'));
  const review=await post('review',{workspace:'reviewtest',file:'example.js',baselineSha256:read.body.sha256,proposed:'const answer = 43;\n'});
  expect(review.status).toBe(200);
  expect(review.body.changed).toBe(true);
  expect(review.body.persisted).toBe(false);
  expect(readFileSync(source,'utf8')).toBe('const answer = 42;\n');
 });
 it('rejeita hash obsoleto',async()=>{
  const r=await post('review',{workspace:'reviewtest',file:'example.js',baselineSha256:'0'.repeat(64),proposed:'teste'});
  expect(r.status).toBe(400);
 });
 it('bloqueia path traversal e arquivos secretos',async()=>{
  for(const file of ['../example.js','.env','../workspace/example.js']){
   const r=await post('review',{workspace:'reviewtest',file,baselineSha256:hash('const answer = 42;\n'),proposed:'x'});
   expect(r.status).toBe(400);
  }
 });
 it('limita tamanho de propostas',async()=>{
  const r=await post('review',{workspace:'reviewtest',file:'example.js',baselineSha256:hash('const answer = 42;\n'),proposed:'x'.repeat(9000)});
  expect(r.status).toBe(400);
 });
});
