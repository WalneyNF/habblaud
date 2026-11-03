// Extensão comunitária: agentes conversacionais Ollama/Groq, sem acesso a arquivos ou shell.
import type { IncomingMessage, ServerResponse } from 'node:http';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Office } from './model/office';
import { readJson, sendJson } from './http/app';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
const sessions = new Map<string, ChatMessage[]>();
const MAX_MESSAGES = 12;
const MAX_PROMPT = 8000;
const OLLAMA = process.env.HABBLAUD_OLLAMA_URL || 'http://127.0.0.1:11434';
const GROQ = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.HABBLAUD_GROQ_MODEL || 'llama-3.3-70b-versatile';
const allowed = (req: IncomingMessage) => {
  const a = (req.socket.remoteAddress || '').replace(/^::ffff:/, '');
  return a === '::1' || a.startsWith('127.');
};
const jsonText = (s: string) => s.slice(0, 300);
export function createLocalAiHandler(office: Office, root: string) {
  let seq = 0;
  return (req: IncomingMessage, res: ServerResponse, url: URL): boolean => {
    const path = url.pathname;
    if (path !== '/ia-lab' && path !== '/manual-ia' && !path.startsWith('/api/local-ai/')) return false;
    if (!allowed(req)) { sendJson(res, 403, { error: 'Acesso somente local' }); return true; }
    if (path === '/ia-lab' || path === '/manual-ia') {
      if (req.method !== 'GET') { sendJson(res, 405, { error: 'Método inválido' }); return true; }
      const html = readFileSync(join(root, 'community', path === '/ia-lab' ? 'ia-lab.html' : 'manual-ia.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': html.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'self'; connect-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'" });
      res.end(html); return true;
    }
    if (path === '/api/local-ai/models' && req.method === 'GET') {
      void (async () => {
        try {
          const response = await fetch(OLLAMA + '/api/tags', { signal: AbortSignal.timeout(5000) });
          if (!response.ok) throw new Error('Ollama HTTP ' + response.status);
          const data = await response.json() as { models?: Array<{name:string}> };
          sendJson(res, 200, { ollama: data.models?.map(m => m.name) ?? [], groq: !!process.env.GROQ_API_KEY, groqModel: GROQ_MODEL });
        } catch (e) { sendJson(res, 200, { ollama: [], ollamaError: String(e), groq: !!process.env.GROQ_API_KEY, groqModel: GROQ_MODEL }); }
      })(); return true;
    }
    if (path === '/api/local-ai/chat' && req.method === 'POST') {
      void (async () => {
        let id = '';
        try {
          const b = await readJson(req, 12000) as Record<string, unknown>;
          const provider = b.provider === 'groq' ? 'groq' : b.provider === 'ollama' ? 'ollama' : '';
          const model = typeof b.model === 'string' ? b.model : '';
          const prompt = typeof b.prompt === 'string' ? b.prompt.trim() : '';
          if (!provider || !prompt || prompt.length > MAX_PROMPT || !/^[\w.:-]{1,100}$/.test(model)) { sendJson(res, 400, { error: 'Parâmetros inválidos' }); return; }
          if (provider === 'groq' && (!process.env.GROQ_API_KEY || model !== GROQ_MODEL)) { sendJson(res, 400, { error: 'Groq não configurado ou modelo inválido' }); return; }
          if (provider === 'ollama') {
            const r = await fetch(OLLAMA + '/api/tags', { signal: AbortSignal.timeout(5000) });
            if (!r.ok || !(await r.json() as {models?:Array<{name:string}>}).models?.some(m => m.name === model)) { sendJson(res, 400, { error: 'Modelo Ollama não instalado' }); return; }
          }
          id = 'community:' + provider + ':' + model;
          if (office.get(id)?.status === 'working') { sendJson(res, 409, { error: 'Agente ocupado; aguarde a resposta' }); return; }
          if (!office.get(id)) {
            office.addMain({ id, provider, account: 'community-' + provider, sessionId: id, cwd: root, role: provider.toUpperCase() + ' · ' + model, startedAt: Date.now(), status: 'idle' });
          }
          const history = sessions.get(id) ?? [];
          const messages: ChatMessage[] = [{ role: 'system', content: 'Você é um assistente de programação. Responda em português brasileiro. Não afirme ter executado ações no computador.' }, ...history.slice(-MAX_MESSAGES), { role: 'user', content: prompt }];
          office.setStatus(id, 'working');
          office.addActivity(id, { id: id + ':prompt:' + (++seq), kind: 'prompt', icon: '💬', text: 'Recebeu uma tarefa', detail: jsonText(prompt), at: Date.now() }, true);
          const response = await fetch(provider === 'ollama' ? OLLAMA + '/api/chat' : GROQ, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...(provider === 'groq' ? { Authorization: 'Bearer ' + process.env.GROQ_API_KEY } : {}) },
            body: JSON.stringify(provider === 'ollama' ? { model, messages, stream: false } : { model, messages, stream: false }),
            signal: AbortSignal.timeout(120000),
          });
          const result = await response.json() as Record<string, any>;
          if (!response.ok) throw new Error('API HTTP ' + response.status + ': ' + JSON.stringify(result).slice(0, 350));
          const answer = provider === 'ollama' ? result.message?.content : result.choices?.[0]?.message?.content;
          if (typeof answer !== 'string') throw new Error('Resposta sem texto');
          sessions.set(id, ([...history, {role:'user',content:prompt}, {role:'assistant',content:answer}] as ChatMessage[]).slice(-MAX_MESSAGES));
          office.addActivity(id, { id: id + ':answer:' + (++seq), kind: 'respond', icon: '📝', text: 'Respondeu à tarefa', detail: jsonText(answer), at: Date.now() }, true);
          office.setStatus(id, 'idle');
          sendJson(res, 200, { agentId: id, answer });
        } catch (e) {
          if (id && office.get(id)) { office.addActivity(id, { id: id + ':error:' + (++seq), kind:'error', icon:'⚠️', text:'Falha na consulta', detail: jsonText(String(e)), at:Date.now(), error:true }, true); office.setStatus(id, 'idle'); }
          sendJson(res, 502, { error: String(e) });
        }
      })(); return true;
    }
    sendJson(res, 404, { error: 'Rota não encontrada' }); return true;
  };
}
