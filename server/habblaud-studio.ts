import type { IncomingMessage, ServerResponse } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, relative, isAbsolute, sep } from 'node:path';
import { sendJson } from './http/app';

const contentTypes:Record<string,string>={js:'text/javascript',css:'text/css',ttf:'font/ttf'};
export function createStudioHandler(root:string){
 return (req:IncomingMessage,res:ServerResponse,url:URL):boolean=>{
  const p=url.pathname;
  if(p!=='/habblaud-studio'&&!p.startsWith('/habblaud-studio/'))return false;
  const ip=(req.socket.remoteAddress||'').replace(/^::ffff:/,'');
  if(ip!=='::1'&&!ip.startsWith('127.')){sendJson(res,403,{error:'Studio disponível somente no computador local'});return true;}
  if(req.method!=='GET'){sendJson(res,405,{error:'Método não permitido'});return true;}
  let target:string;
  let type:string;
  if(p==='/habblaud-studio'||p==='/habblaud-studio/'){
   target=join(root,'community','habblaud-studio.html');type='text/html';
  }else if(p==='/habblaud-studio/app.js'){
   target=join(root,'community','habblaud-studio.js');type='text/javascript';
  }else if(p.startsWith('/habblaud-studio/vs/')){
   const sub=p.slice('/habblaud-studio/'.length);
   if(!/^vs\/[a-zA-Z0-9_./-]+\.(js|css|ttf)$/.test(sub)||sub.split('/').includes('..')){sendJson(res,404,{error:'Recurso não encontrado'});return true;}
   const base=resolve(root,'node_modules','monaco-editor','min');
   target=resolve(base,sub);
   const rel=relative(base,target);
   if(rel==='..'||rel.startsWith('..'+sep)||isAbsolute(rel)){sendJson(res,404,{error:'Recurso não encontrado'});return true;}
   type=contentTypes[sub.split('.').pop()||'']||'application/octet-stream';
  }else{sendJson(res,404,{error:'Recurso não encontrado'});return true;}
  if(!existsSync(target)){sendJson(res,404,{error:'Recurso indisponível; execute npm install'});return true;}
  res.writeHead(200,{'Content-Type':type+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':p==='/habblaud-studio'||p==='/habblaud-studio/'?"default-src 'self'; script-src 'self' 'unsafe-eval' blob:; worker-src blob:; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; font-src 'self' data:; base-uri 'none'; form-action 'none'": "default-src 'none'"});
  res.end(readFileSync(target));return true;
 };
}
