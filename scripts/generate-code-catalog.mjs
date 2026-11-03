// Catálogo estático de código do Habblaud; não executa arquivos analisados.
// Walney Moreira Klein - walneyk@hotmail.com
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, relative, extname, resolve } from 'node:path';
const root=resolve(process.cwd());
const output=join(root,'manuais','catalogo-codigo.html');
const included=['server','client/src','shared','community','mod','integrations','scripts'];
const excluded=new Set(['node_modules','dist','build','coverage','.git','.habblaud-local','private','secrets','vendor']);
const allowed=new Set(['.ts','.tsx','.js','.jsx','.mjs','.css','.html','.json','.md']);
const files=[];
function walk(dir,depth=0){
 if(depth>12)return;
 for(const entry of readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
  if(entry.name.startsWith('.')||excluded.has(entry.name))continue;
  const abs=join(dir,entry.name);
  if(entry.isDirectory())walk(abs,depth+1);
  else if(entry.isFile()&&allowed.has(extname(entry.name).toLowerCase())){
   const size=statSync(abs).size;
   if(size>250000)continue;
   const path=relative(root,abs).replaceAll('\\','/');
   if(/(^|\/)(package-lock\.json|.*\.min\.js|.*\.map)$/.test(path))continue;
   const code=readFileSync(abs,'utf8');
   if(code.includes('\0'))continue;
   const symbols=[];
   const regex=/\b(?:export\s+)?(?:async\s+)?(?:function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)|\bexport\s+(?:const|let)\s+([A-Za-z_$][\w$]*)/g;
   for(const m of code.matchAll(regex)){if(symbols.length>=30)break;symbols.push(m[1]||m[2]);}
   const imports=[...code.matchAll(/(?:from\s*|import\s*\(|require\s*\()\s*['"]([^'"]+)['"]/g)].slice(0,30).map(m=>m[1]);
   files.push({path,size,lines:code.split(/\r?\n/).length,symbols:[...new Set(symbols)],imports:[...new Set(imports)]});
  }
 }
}
for(const dir of included){const abs=join(root,dir);try{if(statSync(abs).isDirectory())walk(abs)}catch{}}
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const data=JSON.stringify(files).replaceAll('<','\\u003c').replaceAll('>','\\u003e').replaceAll('&','\\u0026');
const rows=files.map((f,i)=>'<tr data-i="'+i+'"><td><code>'+escape(f.path)+'</code></td><td>'+f.lines+'</td><td>'+escape(f.symbols.join(', ')||'—')+'</td><td>'+escape(f.imports.join(', ')||'—')+'</td></tr>').join('');
const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Habblaud · Catálogo de código</title><style>body{margin:0;background:#0c1422;color:#eaf1fb;font:14px/1.5 system-ui}header{background:#17374c;padding:30px 5%}main{padding:20px 4%}a{color:#8be8d0}input{width:100%;box-sizing:border-box;padding:13px;background:#1d3046;color:white;border:1px solid #55718b;border-radius:8px;font:16px system-ui}table{width:100%;border-collapse:collapse;margin-top:15px}td,th{text-align:left;border-bottom:1px solid #34475e;padding:9px;vertical-align:top;overflow-wrap:anywhere}tr:nth-child(even){background:#142235}code{color:#9ad5ff}small{color:#b4c8d8}footer{padding:20px;text-align:center}#count{margin-top:12px}</style></head><body><header><h1>Explorador de código · Habblaud</h1><p>Inventário gerado a partir de arquivos locais: caminhos, linhas, símbolos e imports. Não executa o código nem lê segredos.</p><a href="index.html">Voltar à Academia</a></header><main><label for="search">Pesquisar arquivo, função, classe ou dependência</label><input id="search" type="search" placeholder="Ex.: agent-workbench, createWorkbenchHandler, theme, api..."><div id="count" role="status"></div><table><thead><tr><th>Arquivo</th><th>Linhas</th><th>Símbolos detectados</th><th>Imports detectados</th></tr></thead><tbody id="items">${rows}</tbody></table><p><small>Este inventário é uma análise textual aproximada. Nem todo símbolo ou dependência é detectável por expressão regular; não substitui análise TypeScript nem revisão humana. Para atualizar, execute node scripts/generate-code-catalog.mjs na raiz do repositório.</small></p></main><footer>Walney Moreira Klein · walneyk@hotmail.com</footer><script>const data=${data};const q=document.getElementById('search'),rows=[...document.querySelectorAll('#items tr')],count=document.getElementById('count');function update(){const term=q.value.trim().toLowerCase();let shown=0;for(const row of rows){const f=data[Number(row.dataset.i)];const hay=[f.path,...f.symbols,...f.imports].join(' ').toLowerCase();const match=hay.includes(term);row.hidden=!match;if(match)shown++}count.textContent=shown+' de '+data.length+' arquivos'}q.addEventListener('input',update);update()</script></body></html>`;
mkdirSync(join(root,'manuais'),{recursive:true});writeFileSync(output,html,'utf8');console.log('Catálogo gerado:',files.length,'arquivos,',output);
