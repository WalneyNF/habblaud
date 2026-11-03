// Cadastro de provedores sem persistência de chaves: segredos exclusivamente em variáveis de ambiente.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Office } from './model/office';
import { readJson, sendJson } from './http/app';

type ProviderConfig = { id: string; name: string; protocol: 'openai' | 'ollama'; endpoint: string; model: string; keyEnv?: string };
type Message = { role: 'system' | 'user' | 'assistant'; content: string };
const dataDir = process.env.HABBLAUD_AI_DATA_DIR || join(process.cwd(), '.habblaud-local');
const file = join(dataDir, 'ai-providers.json');
const defaults: ProviderConfig[] = [
  { id:'ollama', name:'Ollama local', protocol:'ollama', endpoint:'http://127.0.0.1:11434', model:'qwen2.5-coder:3b' },
  { id:'openai', name:'OpenAI', protocol:'openai', endpoint:'https://api.openai.com/v1', model:'gpt-4.1-mini', keyEnv:'OPENAI_API_KEY' },
  { id:'gemini', name:'Google Gemini', protocol:'openai', endpoint:'https://generativelanguage.googleapis.com/v1beta/openai', model:'gemini-2.5-flash', keyEnv:'GEMINI_API_KEY' },
  { id:'groq', name:'Groq', protocol:'openai', endpoint:'https://api.groq.com/openai/v1', model:'llama-3.3-70b-versatile', keyEnv:'GROQ_API_KEY' },
  { id:'openrouter', name:'OpenRouter', protocol:'openai', endpoint:'https://openrouter.ai/api/v1', model:'openai/gpt-4.1-mini', keyEnv:'OPENROUTER_API_KEY' },
  { id:'opencode', name:'OpenCode (servidor compatível)', protocol:'openai', endpoint:'http://127.0.0.1:4096/v1', model:'modelo-configurado', keyEnv:'OPENCODE_API_KEY' }
];
const histories = new Map<string, Message[]>();
const validId = (s: unknown): s is string => typeof s === 'string' && /^[a-z][a-z0-9_-]{1,39}$/.test(s);
const validModel = (s: unknown): s is string => typeof s === 'string' && /^[\w.\-/:]{1,120}$/.test(s);
const local = (req: IncomingMessage) => { const ip=(req.socket.remoteAddress||'').replace(/^::ffff:/,''); return ip==='::1'||ip.startsWith('127.'); };
function validEndpoint(value: string): boolean {
  try { const u=new URL(value); if(u.username||u.password||u.search||u.hash) return false;
    if(u.protocol==='https:') return true;
    return u.protocol==='http:' && ['127.0.0.1','localhost','[::1]'].includes(u.hostname);
  } catch { return false; }
}
function load(): ProviderConfig[] {
  if (!existsSync(file)) return defaults;
  try { const x=JSON.parse(readFileSync(file,'utf8')); return Array.isArray(x)?x.filter(isValid).slice(0,40):defaults; } catch { return defaults; }
}
function isValid(x: any): x is ProviderConfig {
  return !!x && validId(x.id) && typeof x.name==='string' && x.name.length>0 && x.name.length<=60 &&
    (x.protocol==='openai'||x.protocol==='ollama') && typeof x.endpoint==='string' && validEndpoint(x.endpoint) &&
    validModel(x.model) && (x.keyEnv===undefined || (typeof x.keyEnv==='string' && /^[A-Z][A-Z0-9_]{2,79}$/.test(x.keyEnv)));
}
function save(items: ProviderConfig[]) { mkdirSync(dataDir,{recursive:true}); writeFileSync(file,JSON.stringify(items,null,2),'utf8'); }
const publicConfig=(x:ProviderConfig)=>({...x,configured:!x.keyEnv||!!process.env[x.keyEnv]});
function errorText(e: unknown) { return e instanceof Error?e.message:String(e); }
export function createLocalAiHandler(office: Office, root: string) {
  let seq=0;
  return (req: IncomingMessage,res: ServerResponse,url: URL): boolean => {
    const path=url.pathname;
    if(!['/ia-lab','/manual-ia','/api/local-ai/models','/api/local-ai/providers','/api/local-ai/chat'].includes(path)) return false;
    if(!local(req)){sendJson(res,403,{error:'Somente acesso local'});return true;}
    if(path==='/ia-lab'||path==='/manual-ia'){
      if(req.method!=='GET'){sendJson(res,405,{error:'Método não permitido'});return true;}
      const html=readFileSync(join(root,'community',path==='/ia-lab'?'ia-lab.html':'manual-ia.html'));
      res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Content-Length':html.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; connect-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"});
      res.end(html);return true;
    }
    if(path==='/api/local-ai/providers' && req.method==='GET'){sendJson(res,200,{providers:load().map(publicConfig)});return true;}
    if(path==='/api/local-ai/models' && req.method==='GET'){
      void (async()=>{try{const r=await fetch((process.env.HABBLAUD_OLLAMA_URL||'http://127.0.0.1:11434')+'/api/tags',{signal:AbortSignal.timeout(4000)});
      if(!r.ok) throw Error('Ollama HTTP '+r.status);
      const j=await r.json() as {models?:{name:string}[]};sendJson(res,200,{ollama:j.models?.map(x=>x.name)||[]});}
      catch(e){sendJson(res,200,{ollama:[],ollamaError:errorText(e)});}})();return true;
    }
    if(path==='/api/local-ai/providers' && req.method==='POST'){
      void(async()=>{try{
        const body=await readJson(req,4000) as Record<string,unknown>;
        // Nunca aceitar, gravar ou devolver credenciais.
        if('apiKey' in body||'key' in body||'token' in body||'secret' in body) {sendJson(res,400,{error:'Chaves devem ser configuradas apenas no .env'});return;}
        const cfg={id:body.id,name:body.name,protocol:body.protocol,endpoint:body.endpoint,model:body.model,keyEnv:body.keyEnv||undefined};
        if(!isValid(cfg)){sendJson(res,400,{error:'Configuração inválida. Use HTTPS para APIs externas.'});return;}
        const items=load();const idx=items.findIndex(x=>x.id===cfg.id);
        if(idx>=0)items[idx]=cfg;else items.push(cfg);
        if(items.length>40){sendJson(res,400,{error:'Máximo de 40 provedores'});return;}
        save(items);sendJson(res,200,{provider:publicConfig(cfg)});
      }catch(e){sendJson(res,400,{error:errorText(e)});}})();return true;
    }
    if(path==='/api/local-ai/chat' && req.method==='POST'){
      void(async()=>{let id='';try{
        const b=await readJson(req,12000) as Record<string,unknown>;
        const cfg=load().find(x=>x.id===b.provider);
        const prompt=typeof b.prompt==='string'?b.prompt.trim():'';
        if(!cfg||!prompt||prompt.length>8000){sendJson(res,400,{error:'Provedor ou mensagem inválida'});return;}
        if(cfg.keyEnv&&!process.env[cfg.keyEnv]){sendJson(res,400,{error:'Configure '+cfg.keyEnv+' no arquivo .env e reinicie o servidor'});return;}
        id='community:'+cfg.id+':'+cfg.model;
        if(office.get(id)?.status==='working'){sendJson(res,409,{error:'Agente ocupado'});return;}
        if(!office.get(id))office.addMain({id,provider:cfg.id==='ollama'?'ollama':'groq',account:'community-'+cfg.id,sessionId:id,cwd:root,role:cfg.name+' · '+cfg.model,startedAt:Date.now(),status:'idle'});
        const history=histories.get(id)||[];
        const messages:Message[]=[{role:'system',content:'Você é um assistente de programação. Responda em português brasileiro. Não afirme executar comandos nem editar arquivos.'},...history.slice(-12),{role:'user',content:prompt}];
        office.setStatus(id,'working');
        office.addActivity(id,{id:id+':prompt:'+ ++seq,kind:'prompt',icon:'💬',text:'Recebeu uma tarefa',detail:prompt.slice(0,300),at:Date.now()},true);
        const endpoint=cfg.protocol==='ollama'?new URL('/api/chat',cfg.endpoint+'/').href:cfg.endpoint.replace(/\/$/,'')+'/chat/completions';
        const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...(cfg.keyEnv?{Authorization:'Bearer '+process.env[cfg.keyEnv]}:{})},body:JSON.stringify({model:cfg.model,messages,stream:false}),signal:AbortSignal.timeout(120000)});
        if(!r.ok)throw Error('Provedor HTTP '+r.status);
        const data=await r.json() as any;
        const answer=cfg.protocol==='ollama'?data.message?.content:data.choices?.[0]?.message?.content;
        if(typeof answer!=='string')throw Error('Resposta inválida do provedor');
        histories.set(id,([...history,{role:'user',content:prompt},{role:'assistant',content:answer}] as Message[]).slice(-12));
        office.addActivity(id,{id:id+':answer:'+ ++seq,kind:'respond',icon:'📝',text:'Respondeu à tarefa',detail:answer.slice(0,300),at:Date.now()},true);
        office.setStatus(id,'idle');sendJson(res,200,{agentId:id,answer});
      }catch(e){if(id&&office.get(id)){office.setStatus(id,'idle');office.addActivity(id,{id:id+':error:'+ ++seq,kind:'error',icon:'⚠️',text:'Falha na consulta',detail:errorText(e).slice(0,200),at:Date.now(),error:true},true);}sendJson(res,502,{error:errorText(e)});}})();return true;
    }
    sendJson(res,405,{error:'Método não permitido'});return true;
  };
}
