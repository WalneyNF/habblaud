'use strict';
const $=id=>document.getElementById(id);
const state={editor:null,original:'',file:'',workspace:'',model:null};
const status=message=>{$('status').textContent=message;};
async function api(path,data){
 const response=await fetch(path,{method:data?'POST':'GET',headers:{'Content-Type':'application/json'},body:data?JSON.stringify(data):undefined});
 const result=await response.json();
 if(!response.ok)throw Error(result.error||'Erro HTTP '+response.status);
 return result;
}
function changed(){return !!state.editor&&state.editor.getValue()!==state.original;}
function refreshDirty(){
 const dirty=changed();$('notice').textContent=dirty?'● Rascunho alterado — não salvo no disco':'';
 $('download').disabled=!state.file;$('restore').disabled=!dirty;
}
async function openFile(name){
 if(changed()&&!confirm('Seu rascunho não foi salvo. Descartar alterações e abrir outro arquivo?'))return;
 try{
  status('Lendo '+name+'...');
  const data=await api('/api/agent-workbench/inspect',{workspace:state.workspace,mode:'read',file:name});
  if(data.truncated)throw Error('Arquivo truncado; edição bloqueada.');
  const ext=name.split('.').pop().toLowerCase();
  const langs={js:'javascript',jsx:'javascript',ts:'typescript',tsx:'typescript',html:'html',css:'css',json:'json',py:'python',php:'php',md:'markdown',sql:'sql',xml:'xml',yaml:'yaml',yml:'yaml'};
  const language=langs[ext]||'plaintext';
  if(state.model)state.model.dispose();
  state.model=monaco.editor.createModel(data.content,language);
  state.editor.setModel(state.model);
  state.original=data.content;state.file=name;
  $('filename').textContent=name;
  document.querySelectorAll('#files button').forEach(b=>b.classList.toggle('active',b.dataset.file===name));
  refreshDirty();status('Arquivo carregado. Edite e use Baixar versão editada para exportar.');
 }catch(e){status('Erro: '+e.message);}
}
async function list(){
 if(changed()&&!confirm('Descartar rascunho e mudar de pasta?')){$('workspace').value=state.workspace;return;}
 state.workspace=$('workspace').value;state.file='';state.original='';
 if(state.model){state.model.dispose();state.model=null;}
 state.editor.setModel(null);$('filename').textContent='Nenhum arquivo';refreshDirty();
 $('files').replaceChildren();
 if(!state.workspace){status('Cadastre uma pasta no Marketplace de Agentes.');return;}
 try{
  const data=await api('/api/agent-workbench/inspect',{workspace:state.workspace,mode:'list'});
  for(const file of data.files){
   const b=document.createElement('button');b.textContent=(file.type==='pasta'?'▸ ':'◇ ')+file.name;
   b.dataset.file=file.name;
   if(file.type==='pasta'){b.disabled=true;b.title='Navegação por subpastas virá em outra versão';}
   else b.addEventListener('click',()=>openFile(file.name));
   $('files').append(b);
  }
  status(data.files.length+' itens encontrados. Apenas arquivos permitidos podem ser abertos.');
 }catch(e){status('Erro: '+e.message);}
}
function download(){
 if(!state.file||!state.editor)return;
 const blob=new Blob([state.editor.getValue()],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');
 a.href=url;a.download=state.file.split('/').pop();a.click();
 setTimeout(()=>URL.revokeObjectURL(url),2000);
 status('Arquivo exportado pelo navegador. O original no workspace não foi modificado.');
}
window.addEventListener('beforeunload',e=>{if(changed()){e.preventDefault();e.returnValue='';}});
$('workspace').addEventListener('change',list);
$('refresh').addEventListener('click',list);
$('download').addEventListener('click',download);
$('restore').addEventListener('click',()=>{if(state.editor&&confirm('Reverter alterações do rascunho?')){state.editor.setValue(state.original);refreshDirty();}});
require.config({paths:{vs:'/habblaud-studio/vs'}});
require(['vs/editor/editor.main'],async()=>{
 try{
  state.editor=monaco.editor.create($('editor'),{theme:'vs-dark',automaticLayout:true,minimap:{enabled:false},fontSize:14,wordWrap:'on',readOnly:false});
  state.editor.onDidChangeModelContent(refreshDirty);
  const catalog=await api('/api/agent-workbench/catalog');
  const select=$('workspace');
  for(const w of catalog.workspaces||[]){const o=document.createElement('option');o.value=w.id;o.textContent=w.name;select.append(o);}
  if(!select.options.length){status('Nenhum workspace cadastrado. Abra /agent-market para adicionar um.');return;}
  await list();
 }catch(e){status('Falha ao inicializar Studio: '+e.message);}
},err=>status('Falha ao carregar Monaco: '+String(err)));
