import type {IncomingMessage,ServerResponse} from 'node:http';
import {existsSync,mkdirSync,readFileSync,writeFileSync,readdirSync,realpathSync,lstatSync} from 'node:fs';
import {join,resolve,relative,isAbsolute,sep} from 'node:path';
import {readJson,sendJson} from './http/app';

type Agent={id:string;name:string;role:string;personality:string;provider:string;skills:string[]};
type Workspace={id:string;name:string;path:string};
type Skill={id:string;name:string;description:string;instructions:string};
const dir=process.env.HABBLAUD_AI_DATA_DIR||join(process.cwd(),'.habblaud-local');
const pathFile=join(dir,'agent-workbench.json');
const builtin:Skill[]=[
{id:'review',name:'Revisão de código',description:'Analisa código e sugere melhorias.',instructions:'Analise arquitetura, bugs, segurança e testes. Não afirme ter alterado arquivos.'},
{id:'docs',name:'Documentação',description:'Explica arquivos e prepara documentação.',instructions:'Documente em português, com exemplos e instruções para iniciantes.'},
{id:'tests',name:'Planejamento de testes',description:'Propõe cenários de teste.',instructions:'Identifique casos normais, limites, falhas e testes de regressão.'},
{id:'security',name:'Auditoria inicial',description:'Procura riscos e configurações perigosas.',instructions:'Identifique riscos com evidências; não execute nem modifique nada.'}
];
type Store={agents:Agent[];workspaces:Workspace[];skills:Skill[]};
const empty=():Store=>({agents:[],workspaces:[],skills:[...builtin]});
function load():Store {try {const s=JSON.parse(readFileSync(pathFile,'utf8'));return {agents:Array.isArray(s.agents)?s.agents:[],workspaces:Array.isArray(s.workspaces)?s.workspaces:[],skills:Array.isArray(s.skills)?s.skills:builtin};}catch{return empty();}}
function save(s:Store){mkdirSync(dir,{recursive:true});writeFileSync(pathFile,JSON.stringify(s,null,2),'utf8');}
const idOk=(s:unknown):s is string=>typeof s==='string'&&/^[a-z][a-z0-9_-]{1,39}$/.test(s);
const textOk=(s:unknown,n:number):s is string=>typeof s==='string'&&s.trim().length>0&&s.length<=n;
function validateWorkspace(p:string):string{
 if(!isAbsolute(p)||!existsSync(p))throw Error('A pasta precisa existir e ter caminho absoluto.');
 const real=realpathSync(p);
 if(!lstatSync(real).isDirectory())throw Error('O caminho não é uma pasta.');
 const low=real.toLowerCase();
 if(/^[a-z]:\\?$/i.test(real)||/^(\\\\|\/\/)/.test(real)||/\\windows(\\|$)/i.test(low)||/\\users(\\|$)/i.test(low)||/\\program files(\\|$)/i.test(low))throw Error('Selecione uma pasta de projeto específica, não uma raiz ou pasta de sistema.');
 return real;
}
function secureFile(base:string,rel:string):string{
 if(typeof rel!=='string'||rel.length>250||!rel||isAbsolute(rel)||rel.includes('\\')||rel.includes('\0'))throw Error('Caminho inválido.');
 const parts=rel.split('/');
 if(parts.some(p=>!p||p==='.'||p==='..'||p.startsWith('.')))throw Error('Arquivos ocultos e caminhos relativos especiais estão bloqueados.');
 if(parts.some(p=>/^(node_modules|dist|build|coverage|private|secrets?)$/i.test(p)||/^(\.env|.*\.key|.*\.pem|.*\.p12|.*\.pfx)$/i.test(p)))throw Error('Arquivo protegido.');
 const target=resolve(base,...parts);
 const canonical=realpathSync(target);
 if(relative(base,canonical).startsWith('..'+sep)||relative(base,canonical)==='..'||isAbsolute(relative(base,canonical)))throw Error('Acesso fora da pasta autorizada.');
 if(!lstatSync(canonical).isFile())throw Error('Selecione um arquivo.');
 return canonical;
}
export function createWorkbenchHandler(root:string){
 return (req:IncomingMessage,res:ServerResponse,url:URL):boolean=>{
 const p=url.pathname;
 if(p!=='/agent-market'&&!p.startsWith('/api/agent-workbench/'))return false;
 const ip=(req.socket.remoteAddress||'').replace(/^::ffff:/,'');
 if(ip!=='::1'&&!ip.startsWith('127.')){sendJson(res,403,{error:'Somente acesso local'});return true;}
 if(p==='/agent-market'){
  if(req.method!=='GET'){sendJson(res,405,{error:'Método não permitido'});return true;}
  const html=readFileSync(join(root,'community','agent-market.html'));
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; connect-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"});res.end(html);return true;
 }
 const action=p.split('/').pop();
 if(req.method==='GET'&&action==='catalog'){sendJson(res,200,load());return true;}
 if(req.method==='POST'&&['agents','skills','workspaces','inspect'].includes(action||'')){
  void(async()=>{try{
   const body=await readJson(req,12000) as Record<string,unknown>;
   const s=load();
   if(action==='agents'){
    if(!idOk(body.id)||!textOk(body.name,60)||!textOk(body.role,100)||!textOk(body.personality,1000)||!idOk(body.provider)||!Array.isArray(body.skills)||body.skills.length>12||!body.skills.every(id=>s.skills.some(x=>x.id===id)))throw Error('Dados do agente inválidos.');
    const agent:Agent={id:body.id,name:body.name,role:body.role,personality:body.personality,provider:body.provider,skills:body.skills as string[]};
    if(!s.agents.some(x=>x.id===agent.id)&&s.agents.length>=40)throw Error('Limite de 40 agentes.');
    s.agents=s.agents.filter(x=>x.id!==agent.id).concat(agent);save(s);sendJson(res,200,{ok:true});return;
   }
   if(action==='skills'){
    if(!idOk(body.id)||!textOk(body.name,70)||!textOk(body.description,200)||!textOk(body.instructions,3000))throw Error('Dados da skill inválidos.');
    const skill:Skill={id:body.id,name:body.name,description:body.description,instructions:body.instructions};
    if(!s.skills.some(x=>x.id===skill.id)&&s.skills.length>=100)throw Error('Limite de 100 skills.');
    s.skills=s.skills.filter(x=>x.id!==skill.id).concat(skill);save(s);sendJson(res,200,{ok:true});return;
   }
   if(action==='workspaces'){
    if(!idOk(body.id)||!textOk(body.name,80)||typeof body.path!=='string')throw Error('Dados da pasta inválidos.');
    const w:Workspace={id:body.id,name:body.name,path:validateWorkspace(body.path)};
    if(!s.workspaces.some(x=>x.id===w.id)&&s.workspaces.length>=20)throw Error('Limite de 20 pastas.');
    s.workspaces=s.workspaces.filter(x=>x.id!==w.id).concat(w);save(s);sendJson(res,200,{ok:true});return;
   }
   if(action==='inspect'){
    const w=s.workspaces.find(x=>x.id===body.workspace);
    if(!w)throw Error('Pasta não autorizada.');
    const base=validateWorkspace(w.path);
    if(body.mode==='list'){
      const files=readdirSync(base,{withFileTypes:true}).filter(x=>!x.name.startsWith('.')&&!/^(node_modules|dist|build|coverage|private|secrets?)$/i.test(x.name)).slice(0,100).map(x=>({name:x.name,type:x.isDirectory()?'pasta':x.isFile()?'arquivo':'outro'}));
      sendJson(res,200,{workspace:w.name,files});return;
    }
    if(body.mode==='read'){
      const target=secureFile(base,body.file as string);
      const stat=lstatSync(target);if(stat.size>100000)throw Error('Arquivo acima de 100 KB; leitura bloqueada.');
      const content=readFileSync(target,'utf8');
      if(content.includes('\uFFFD')||content.includes('\0'))throw Error('Somente arquivos de texto UTF-8.');
      sendJson(res,200,{workspace:w.name,file:body.file,content:content.slice(0,40000),truncated:content.length>40000});return;
    }
    throw Error('Operação não permitida.');
   }
  }catch(e){sendJson(res,400,{error:e instanceof Error?e.message:'Erro de validação'});}})();return true;
 }
 sendJson(res,405,{error:'Método não permitido'});return true;
 };
}
