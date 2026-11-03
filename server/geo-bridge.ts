import type {IncomingMessage,ServerResponse} from 'node:http';
import {spawn} from 'node:child_process';
import {existsSync,readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {sendJson} from './http/app';
const root=resolve(process.env.GODS_EYE_ROOT||'D:/xampp2/htdocs/gods-eye-view-inspecao');
const tools=['get_earthquakes','get_active_fires','get_recent_launches'];
export function createGeoBridge(habblaudRoot:string){
 return (req:IncomingMessage,res:ServerResponse,url:URL):boolean=>{
  if(!['/geo-lab','/geo-mission','/roadmap.html','/api/geo/tools','/api/geo/query'].includes(url.pathname))return false;
  const ip=(req.socket.remoteAddress||'').replace(/^::ffff:/,'');
  if(ip!=='::1'&&!ip.startsWith('127.')){sendJson(res,403,{error:'Laboratório disponível apenas localmente'});return true;}
  if(url.pathname==='/geo-lab'||url.pathname==='/geo-mission'||url.pathname==='/roadmap.html'){if(req.method!=='GET'){sendJson(res,405,{error:'Método inválido'});return true;}res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; frame-src http://127.0.0.1:4173 http://localhost:4173; base-uri 'none'; form-action 'none'"});res.end(readFileSync(join(habblaudRoot,'community',url.pathname==='/geo-mission'?'geo-mission.html':url.pathname==='/roadmap.html'?'roadmap.html':'geo-lab.html')));return true;}
  if(url.pathname==='/api/geo/tools'){sendJson(res,200,{tools,configured:existsSync(join(root,'server','mcp','stdio.js')),root});return true;}
  if(req.method!=='POST'){sendJson(res,405,{error:'Método inválido'});return true;}
  void(async()=>{try{
   const chunks:Buffer[]=[];let size=0;for await(const chunk of req){const b=Buffer.from(chunk);size+=b.length;if(size>3000)throw Error('Entrada grande demais');chunks.push(b);}
   const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
   if(!tools.includes(body.tool))throw Error('Ferramenta não permitida');
   const args=body.tool==='get_earthquakes'?{min_magnitude:Math.max(2.5,Math.min(10,Number(body.minMagnitude)||4)),limit:Math.max(1,Math.min(30,Number(body.limit)||10))}:{limit:Math.max(1,Math.min(20,Number(body.limit)||10))};
   const result=await callMcp(body.tool,args);
   sendJson(res,200,{tool:body.tool,result});
  }catch(e){sendJson(res,502,{error:e instanceof Error?e.message:'Falha na ponte MCP'});}})();return true;
 };
}
export function callMcp(name:string,args:object):Promise<unknown>{
 return new Promise((ok,fail)=>{
  const file=join(root,'server','mcp','stdio.js');
  if(!existsSync(file)){fail(Error('God\'s Eye View não encontrado em '+root));return;}
  const child=spawn(process.execPath,[file,'--api-base','http://127.0.0.1:4173'],{cwd:root,stdio:['pipe','pipe','pipe'],windowsHide:true,env:{...process.env,NODE_ENV:'production'}});
  let finished=false;let buffer='';let errors='';const timer=setTimeout(()=>finish(Error('Tempo limite MCP (25s). Verifique se o Gods Eye View está rodando na porta 4173.')),25000);
  function finish(error?:Error,value?:unknown){if(finished)return;finished=true;clearTimeout(timer);child.kill();error?fail(error):ok(value);}
  child.on('error',e=>finish(e));child.stderr.on('data',d=>{errors+=String(d).slice(0,300)});
  child.on('exit',code=>{if(!finished)finish(Error('Servidor MCP encerrou: '+code+' '+errors.slice(0,200)))});
  function send(obj:unknown){child.stdin.write(JSON.stringify(obj)+'\n');}
  child.stdout.on('data',data=>{buffer+=String(data);if(buffer.length>1_000_000){finish(Error('Resposta muito grande'));return;}let idx;while((idx=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,idx);buffer=buffer.slice(idx+1);let msg:any;try{msg=JSON.parse(line)}catch{continue}
   if(msg.id===1){if(msg.error){finish(Error(JSON.stringify(msg.error)));return;}send({jsonrpc:'2.0',method:'notifications/initialized'});send({jsonrpc:'2.0',id:2,method:'tools/call',params:{name,arguments:args}});}
   if(msg.id===2){if(msg.error||msg.result?.isError)finish(Error(JSON.stringify(msg.error||msg.result).slice(0,500)));else finish(undefined,msg.result);return;}
  }});
  send({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'habblaud-geo-bridge',version:'0.1'}}});
 });
}
