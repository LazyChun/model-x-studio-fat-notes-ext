'use client';
import {flushSync} from 'react-dom';
import {useState, useRef, useEffect} from 'react';
import {ArrowUpRight, Box, Layers3, RotateCcw, Rotate3d, Plus, Minus, Maximize2, X, Crosshair, ChevronRight, CircleHelp, Expand, MoreHorizontal} from 'lucide-react';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
import {Slider} from '@/components/ui/slider';
import {Switch} from '@/components/ui/switch';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {parts,describePiece, type PartId} from './parts';
import VehicleScene, {type SceneHandle} from './vehicle-scene';
import {partField, partManual, partSpec, pieceLabel, useStudioI18n} from './i18n';
export default function Home(){
 const {t}=useStudioI18n();
 const [selected,setSelected]=useState<PartId>('body');
 const [canFullscreen,setCanFullscreen]=useState(false);
 const [compact,setCompact]=useState(false);const [toolsOpen,setToolsOpen]=useState(false);
 const [componentsOpen,setComponentsOpen]=useState(false);const [detailOpen,setDetailOpen]=useState(false);
 const [explode,setExplode]=useState(0); const [labels,setLabels]=useState(false); const [rotate,setRotate]=useState(false); const [isolated,setIsolated]=useState(false); const [help,setHelp]=useState(false);
 useEffect(()=>{setCanFullscreen(Boolean(document.fullscreenEnabled));const query=window.matchMedia('(max-width: 700px), (max-height: 500px)');const update=()=>{setCompact(query.matches);setComponentsOpen(!query.matches);setToolsOpen(false)};update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update)},[]);
 const [focusedMesh,setFocusedMesh]=useState('');
 const [catalog,setCatalog]=useState<{id:string;part:PartId;label:string}[]>([]);
 useEffect(()=>{fetch('/models/model-x-manifest.json').then(r=>r.json()).then(m=>setCatalog((m as {objects:{id:string;part:PartId;label:string}[]}).objects)).catch(()=>{});},[]);
 const [tab,setTab]=useState('overview'); const scene=useRef<SceneHandle|null>(null); const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:{signal:AbortSignal})=>unknown}}).modelContext;
  if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  try { Promise.resolve(context.registerTool({name:'explore_vehicle_component',description:'Select a Model X component, set its exploded view and optionally isolate it in the 3D study.',inputSchema:{type:'object',properties:{component:{type:'string',enum:parts.map(p=>p.id)},explosion:{type:'number',minimum:0,maximum:100},isolate:{type:'boolean'}},required:['component'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input:unknown){
    const v=input as {component:PartId;explosion?:number;isolate?:boolean};
    if(!v||!parts.some(p=>p.id===v.component)||(v.explosion!==undefined&&(typeof v.explosion!=='number'||!Number.isFinite(v.explosion)||v.explosion<0||v.explosion>100))||(v.isolate!==undefined&&typeof v.isolate!=='boolean'))throw new Error('Choose a valid component and an explosion value between 0 and 100.');
    flushSync(()=>{setSelected(v.component);setFocusedMesh('');setDetailOpen(true);setTab('overview');if(window.matchMedia('(max-width: 700px), (max-height: 500px)').matches){setComponentsOpen(false);setHelp(false)}if(v.explosion!==undefined)setExplode(v.explosion);if(v.isolate!==undefined)setIsolated(v.isolate)});
    const chosen=parts.find(p=>p.id===v.component)!;return {component:v.component,description:partField(v.component,'description',chosen.description)};
  }},{signal:lifecycle.signal})).catch(()=>{}); }catch{}
  return()=>lifecycle.abort();
 },[]);
 const part=parts.find(p=>p.id===selected)!; const piece=catalog.find(p=>p.id===focusedMesh);
 function select(id:PartId){setFocusedMesh('');setSelected(id);setTab('overview');setDetailOpen(true);if(compact){setComponentsOpen(false);setHelp(false);setToolsOpen(false)}}
 function toggleComponents(){setComponentsOpen(!componentsOpen);if(compact){setDetailOpen(false);setHelp(false);setToolsOpen(false)}}
 function toggleHelp(){setHelp(!help);if(compact){setComponentsOpen(false);setDetailOpen(false);setToolsOpen(false)}}

 const partName=partField(part.id,'name',part.name);
 const pieceCount=catalog.filter(p=>p.part===selected).length;
 return <main className="studio" ref={root}>
  <section className="stage-view" aria-label={t('stage.aria')}>
   <VehicleScene focusedMesh={focusedMesh} onInspect={setFocusedMesh} ref={scene} selected={selected} explode={explode} labels={labels} autoRotate={rotate} isolated={isolated} onSelect={select}/>
  </section>
  <div className="model-plaque"><span>T E S L A</span><h1>MODEL X</h1></div>
  {componentsOpen&&<aside className="components-panel floating-panel" aria-label={t('components.aria')}>
   <div className="panel-heading"><h2>{t('components.title')}</h2><button className="icon-button" onClick={()=>setComponentsOpen(false)} aria-label={t('components.hide')}><X size={14}/></button></div>
   <div className="parts-list">{parts.map((p,i)=><button key={p.id} onClick={()=>select(p.id)} className={'part-row '+(p.id===selected&&detailOpen?'selected':'')} aria-pressed={p.id===selected&&detailOpen}><span className="part-number">{String(i+1).padStart(2,'0')}</span><span>{partField(p.id,'name',p.name)}</span><ChevronRight size={13}/></button>)}</div>
  </aside>}
  <nav className="view-tools floating-panel" data-expanded={toolsOpen} aria-label={t('tools.aria')}>
   <button className={'tools-components '+(componentsOpen?'active':'')} title={t('tools.components')} onClick={toggleComponents} aria-label={t('tools.components.toggle')} aria-pressed={componentsOpen}><Layers3 size={18}/></button>
   <span/>
   <button className="tools-extra" title={t('tools.zoomIn')} onClick={()=>scene.current?.zoom(.85)} aria-label={t('tools.zoomIn')}><Plus size={18}/></button>
   <button className="tools-extra" title={t('tools.zoomOut')} onClick={()=>scene.current?.zoom(1.18)} aria-label={t('tools.zoomOut')}><Minus size={18}/></button>
   <button className="tools-reset" title={t('tools.reset')} onClick={()=>{setRotate(false);scene.current?.reset()}} aria-label={t('tools.reset')}><RotateCcw size={17}/></button>
   <button className={'tools-extra '+(rotate?'active':'')} title={t('tools.rotate')} onClick={()=>setRotate(!rotate)} aria-label={t('tools.rotate.toggle')} aria-pressed={rotate}><Rotate3d size={18}/></button>
   <span/>
   {canFullscreen&&<button className="tools-extra" title={t('tools.fullscreen')} onClick={()=>{if(document.fullscreenElement)document.exitFullscreen();else root.current?.requestFullscreen?.()}} aria-label={t('tools.fullscreen.toggle')}><Maximize2 size={17}/></button>}
   <button className="tools-extra" title={t('tools.about')} onClick={toggleHelp} aria-label={t('tools.about')} aria-expanded={help}><CircleHelp size={17}/></button>
   <button className="tools-more" title={t('tools.more')} onClick={()=>setToolsOpen(!toolsOpen)} aria-label={t('tools.more')} aria-expanded={toolsOpen}><MoreHorizontal size={20}/></button>
  </nav>
  {detailOpen&&<aside className="detail-panel floating-panel" aria-label={t('detail.aria')}>
   <div className="panel-heading"><span>{partField(part.id,'category',part.category)}{['battery','drive','suspension'].includes(selected)&&<span className="illustrative-badge">{t('detail.illustrative')}</span>}</span><button className="icon-button" onClick={()=>setDetailOpen(false)} aria-label={t('detail.close')}><X size={16}/></button></div>
   <div className="detail" aria-live="polite">
    <h2>{piece?pieceLabel(piece.label):partName}</h2>
    <Tabs value={tab} onValueChange={v=>setTab(String(v))}><TabsList variant="line" className="detail-tabs"><TabsTrigger value="overview">{t('detail.overview')}</TabsTrigger><TabsTrigger value="working">{t('detail.working')}</TabsTrigger></TabsList></Tabs>
    <p className="detail-copy">{piece&&tab==='overview'?describePiece(piece.label):tab==='overview'?partField(part.id,'description',part.description):partField(part.id,'principle',part.principle)}</p>
    <dl className="specs">{part.specs.map(([a,b],i)=><div key={a}><dt>{partSpec(part.id,i,0,a)}</dt><dd>{partSpec(part.id,i,1,b)}</dd></div>)}</dl>
    {catalog.some(p=>p.part===selected)&&<div className="piece-picker"><span>{t('detail.pieces')}</span><Select value={focusedMesh||'all'} onValueChange={value=>setFocusedMesh(value==='all'?'':String(value))}><SelectTrigger aria-label={t('detail.choose')}><SelectValue>{piece?pieceLabel(piece.label):t('detail.allPieces',{count:pieceCount})}</SelectValue></SelectTrigger><SelectContent alignItemWithTrigger={false}>{[{id:'all',label:t('detail.allInSystem')},...catalog.filter(p=>p.part===selected).map(p=>({id:p.id,label:pieceLabel(p.label)}))].map((p,i)=><SelectItem key={p.id} value={p.id}>{i?`${String(i).padStart(2,'0')} · `:''}{p.label}</SelectItem>)}</SelectContent></Select></div>}
    <button className={'isolate-button '+(isolated?'is-active':'')} onClick={()=>setIsolated(!isolated)}>{isolated?<Layers3 size={15}/>:<Crosshair size={15}/>} {isolated?t('detail.showAll'):focusedMesh?t('detail.isolatePiece'):t('detail.isolate')}</button>
    <a className="source-link" href={partManual(part.source)} target="_blank" rel="noreferrer">{t('detail.source')} <ArrowUpRight size={12}/></a>
   </div>
  </aside>}
  <div className="explode-dock floating-panel" aria-label={t('dock.aria')}>
   <button className={'assembly-button '+(explode===0?'active':'')} title={t('dock.assemble.title')} onClick={()=>{setExplode(0);setIsolated(false)}} aria-label={t('dock.assemble.aria')}><Box size={18}/><span>{t('dock.assemble')}</span></button>
   <div className="explode-control"><div className="slider-caption"><label id="explode-label">{t('dock.explode')}</label><output>{explode===100?t('dock.pieces',{count:catalog.length}):`${explode}%`}</output></div><Slider aria-labelledby="explode-label" value={[explode]} onValueChange={v=>setExplode(Array.isArray(v)?v[0]:v)} min={0} max={100}/></div>
   <button className={'assembly-button '+(explode===100?'active':'')} title={t('dock.all.title')} onClick={()=>{setExplode(100);setIsolated(false)}} aria-label={t('dock.all.aria')}><Expand size={18}/><span>{t('dock.all')}</span></button>
   <div className="dock-divider"/><label className="labels-toggle"><Switch checked={labels} onCheckedChange={setLabels} aria-label={t('dock.labels.aria')}/><span>{t('dock.labels')}</span></label>
  </div>
  {help&&<aside className="about-panel floating-panel" aria-label={t('about.aria')}><div className="panel-heading"><h2>{t('about.title')}</h2><button className="icon-button" onClick={()=>setHelp(false)} aria-label={t('about.close')}><X size={15}/></button></div><p>{t('about.controls')}</p><p>{t('about.before')} <a href="https://www.blendkit.com/asset-gallery-detail/983e8f94-5a56-44a4-94d9-eed5e4cdcd6c/" target="_blank" rel="noreferrer">cgi Moon</a>. {t('about.after',{count:catalog.length||334})}</p></aside>}
 </main>
}
