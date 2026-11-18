/* Vitaba 3D: modelo interactivo de la banda (Three.js r128, global THREE)
   API: Vitaba3D.create(contenedor, opciones) -> {setView, setStrap, setExplode, playFilm, stopFilm, destroy}
*/
(function(){
'use strict';
const CSS=`
.v3d{position:relative;overflow:hidden;touch-action:pan-y;user-select:none;-webkit-user-select:none}
.v3d canvas{display:block;width:100%!important;height:100%!important;cursor:grab;outline:none}
.v3d canvas:active{cursor:grabbing}
.v3d-layer{position:absolute;inset:0;pointer-events:none}
.v3d-hs{position:absolute;transform:translate(-50%,-50%);pointer-events:auto;display:flex;align-items:center;gap:6px;transition:opacity .25s}
.v3d-hs button{all:unset;cursor:pointer;display:flex;align-items:center;gap:7px;background:rgba(11,14,42,.82);color:#fff;border:1px solid rgba(255,255,255,.18);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border-radius:999px;padding:4px 11px 4px 4px;font:600 12px/1.2 var(--f-body,system-ui,sans-serif);white-space:nowrap}
.v3d-hs button:focus-visible{outline:2px solid #F3B705;outline-offset:2px}
.v3d-hs i{width:18px;height:18px;border-radius:50%;background:#F3B705;box-shadow:0 0 0 4px rgba(242,183,5,.25);display:block;flex:none;position:relative}
.v3d-hs i::after{content:"";position:absolute;inset:-6px;border-radius:50%;border:2px solid rgba(242,183,5,.6);animation:v3dp 2s infinite}
@keyframes v3dp{from{transform:scale(.6);opacity:1}to{transform:scale(1.4);opacity:0}}
.v3d-hs.off{opacity:0;pointer-events:none}
.v3d-lb{position:absolute;transform:translate(0,-50%);background:rgba(11,14,42,.85);color:#fff;border-left:3px solid #F3B705;border-radius:6px;padding:5px 9px;font:600 11.5px/1.25 var(--f-body,system-ui,sans-serif);white-space:nowrap}
.v3d-lb.l{transform:translate(-100%,-50%);border-left:0;border-right:3px solid #F3B705;text-align:right}
.v3d-lb small{display:block;font-weight:500;opacity:.75}
.v3d-card{position:absolute;left:12px;right:12px;bottom:12px;max-width:340px;background:rgba(11,14,42,.9);color:#fff;border-radius:14px;padding:12px 14px;font:14px/1.45 var(--f-body,system-ui,sans-serif);pointer-events:auto;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.v3d-card b{display:block;color:#F3B705;font-size:13px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:2px}
.v3d-card button{all:unset;cursor:pointer;position:absolute;top:8px;right:10px;font-size:18px;opacity:.7}
.v3d-cap{position:absolute;left:0;right:0;bottom:54px;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;padding:0 18px;transition:opacity .35s}
.v3d-cap span{font:700 11px/1 var(--f-body,system-ui,sans-serif);letter-spacing:.14em;text-transform:uppercase;color:#F3B705;background:rgba(11,14,42,.75);padding:5px 9px;border-radius:999px}
.v3d-cap p{margin:0;font:600 clamp(14px,2.2vw,20px)/1.35 var(--f-body,system-ui,sans-serif);color:#fff;max-width:560px;text-wrap:balance;background:rgba(8,10,32,.78);padding:8px 14px;border-radius:12px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.v3d-notif{position:absolute;top:14px;left:50%;width:min(320px,calc(100% - 28px));transform:translate(-50%,-140%);transition:transform .5s cubic-bezier(.2,.9,.3,1.2);background:rgba(250,250,252,.96);color:#0B0E2A;border-radius:16px;padding:10px 12px;display:flex;gap:10px;align-items:center;box-shadow:0 12px 30px rgba(0,0,0,.35);font:13px/1.35 var(--f-body,system-ui,sans-serif)}
.v3d-notif.on{transform:translate(-50%,0)}
.v3d-notif .ap{width:34px;height:34px;border-radius:9px;background:#0B0E2A;color:#F3B705;display:grid;place-items:center;font:400 13px/1 var(--f-display,Impact,sans-serif);flex:none}
.v3d-notif b{display:block;font-size:13px}
.v3d-notif small{opacity:.6;font-size:11px}
.v3d-reads{position:absolute;top:16px;left:50%;transform:translateX(-50%);display:flex;gap:8px;transition:opacity .4s}
.v3d-reads div{background:rgba(11,14,42,.85);color:#fff;border-radius:12px;padding:7px 11px;text-align:center;font:600 11px/1.2 var(--f-body,system-ui,sans-serif)}
.v3d-reads b{display:block;font:400 20px/1.1 var(--f-display,Impact,sans-serif);color:#F3B705;letter-spacing:.02em}
.v3d-bar{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:10px;padding:10px 12px;background:linear-gradient(transparent,rgba(5,6,24,.75));pointer-events:auto}
.v3d-bar button{all:unset;cursor:pointer;width:34px;height:34px;border-radius:50%;background:#F3B705;color:#0B0E2A;display:grid;place-items:center;flex:none}
.v3d-bar button:focus-visible{outline:2px solid #fff;outline-offset:2px}
.v3d-track{flex:1;display:flex;gap:3px;height:6px;cursor:pointer}
.v3d-track i{flex:1;background:rgba(255,255,255,.25);border-radius:3px;overflow:hidden;display:block}
.v3d-track i b{display:block;height:100%;width:0;background:#F3B705}
.v3d-time{font:600 11px/1 var(--f-body,system-ui,sans-serif);color:#fff;font-variant-numeric:tabular-nums;min-width:62px;text-align:right}
.v3d-fallback{position:absolute;inset:0;display:grid;place-items:center;text-align:center;color:inherit;font:14px/1.4 var(--f-body,system-ui,sans-serif);padding:20px}
@media (prefers-reduced-motion: reduce){.v3d-hs i::after{animation:none}}
`;
function injectCSS(){if(document.getElementById('v3d-css'))return;const s=document.createElement('style');s.id='v3d-css';s.textContent=CSS;document.head.appendChild(s)}

const STRAPS={
  negro:{name:'Negro',color:'#1a1a1d',sheen:'#26262a'},
  arena:{name:'Arena',color:'#cbb896',sheen:'#5e5545'}
};
const VIEWS={
  frente:{az:.62,el:.3,dist:11.5,ty:.5,name:'3/4'},
  perfil:{az:Math.PI/2,el:.05,dist:11.5,ty:.4,name:'Perfil'},
  arriba:{az:.0001,el:1.3,dist:7.2,ty:2.5,name:'Arriba'},
  reverso:{az:.15,el:-.45,dist:7.5,ty:1.8,name:'Sensores'},
  explosion:{az:.0001,el:.2,dist:17,ty:3.7,name:'Por dentro'}
};
const HOTSPOTS=[
  {id:'sos',label:'Botón SOS',desc:'Mantén presionado 3 segundos: avisa a tus contactos de emergencia con tu ubicación.',pos:[.75,2.65,1.5],n:[0,0,1]},
  {id:'led',label:'Luz de estado',desc:'Una luz suave en vez de pantalla: amarilla al cargar, verde cuando todo va bien y roja si hay una alerta.',pos:[0,3.15,.78],n:[0,1,0]},
  {id:'sensor',label:'Sensor óptico',desc:'LED verdes y rojos que miden ritmo cardiaco, oxígeno, estrés (HRV) y una estimación de la presión.',pos:[0,2.13,0],n:[0,-1,0]},
  {id:'pins',label:'Pines de carga',desc:'Conector magnético: la banda carga en unas 2 horas y dura cerca de 2 días y medio.',pos:[-1.15,2.14,0],n:[0,-1,0]},
  {id:'strap',label:'Correa tejida',desc:'Tejido suave y transpirable, en negro o arena. Se lava y se cambia sin herramientas.',pos:[3.05,0,0],n:[1,0,0]},
  {id:'clasp',label:'Cierre ajustable',desc:'Se ajusta con una mano. Ideal si tienes poca fuerza o artritis.',pos:[0,-2.75,0],n:[0,-1,0]}
];
const PARTS=[
  {id:'shell',label:'Carcasa',sub:'Aluminio negro satinado',to:[0,3.6,0],side:1,w:1.25},
  {id:'battery',label:'Batería LiPo',sub:'3,7 V · 300 mAh',to:[0,2.7,0],side:-1,w:.8},
  {id:'pcb',label:'XIAO ESP32-S3',sub:'Procesador + Bluetooth',to:[0,1.85,0],side:1,w:.7},
  {id:'motor',label:'Motor de vibración',sub:'Recordatorios y alertas',to:[1.3,1.05,.0],side:1,w:.22},
  {id:'bmi',label:'Acelerómetro BMI160',sub:'Pasos, sueño y caídas',to:[-1.3,1.05,.0],side:-1,w:.15},
  {id:'max',label:'Sensor MAX30102',sub:'Corazón y oxígeno',to:[0,.42,0],side:1,w:.38}
];
const CHAPTERS=[
  {id:'intro',tag:'Vitava',text:'Una banda sin pantalla que cuida tu salud sin complicaciones.',dur:6},
  {id:'wear',tag:'Póntela',text:'Dos dedos por encima del hueso de la muñeca. Ajustada pero cómoda.',dur:7},
  {id:'measure',tag:'Mide sola',text:'Día y noche: corazón, oxígeno, presión estimada, estrés y sueño. Sin tocar nada.',dur:7.5},
  {id:'vibrate',tag:'Te recuerda',text:'Una vibración: toma agua. Dos vibraciones: hora de tu medicamento.',dur:6.5},
  {id:'alert',tag:'Avisa a tu familia',text:'Si algo no está bien, tu familia recibe la alerta en su celular.',dur:7},
  {id:'sos',tag:'SOS',text:'Mantén el botón 3 segundos y avisamos a tus contactos con tu ubicación.',dur:7},
  {id:'charge',tag:'Carga',text:'Conector magnético. Carga en unas 2 horas y dura cerca de 2 días y medio.',dur:6.5},
  {id:'inside',tag:'Por dentro',text:'Sensor óptico, acelerómetro, motor de vibración, batería y Bluetooth.',dur:7.5},
  {id:'outro',tag:'Vitava',text:'Medir para comprender, comprender para recomendar y recomendar para acompañar.',dur:6}
];

const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);

function create(container,opts={}){
  injectCSS();
  const T=window.THREE;
  container.classList.add('v3d');
  if(!T){container.innerHTML='<div class="v3d-fallback">No se pudo cargar el modelo 3D. Revisa tu conexión a internet.</div>';return null}
  const o=Object.assign({autoRotate:true,hotspots:true,view:'frente',strap:'negro',filmUI:false,interactive:true,onHotspot:null,transparent:true,preserve:false},opts);

  /* ---------- renderer ---------- */
  let renderer;
  try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:!!o.preserve})}catch(e){container.innerHTML='<div class="v3d-fallback">Tu navegador no puede mostrar el modelo 3D.</div>';return null}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
  renderer.setClearColor(0x000000,0);
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('tabindex','0');
  renderer.domElement.setAttribute('aria-label','Modelo 3D de la banda VitaBand. Arrastra para girarla.');
  const layer=document.createElement('div');layer.className='v3d-layer';container.appendChild(layer);

  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(32,1,.1,200);

  /* entorno de estudio para reflejos */
  const pmrem=new T.PMREMGenerator(renderer);
  const env=new T.Scene();env.background=new T.Color(0x060607);
  const soft=(w,h,c,i,p)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(i),side:T.DoubleSide}));m.position.set(p[0],p[1],p[2]);m.lookAt(0,0,0);env.add(m)};
  soft(12,7,0xffffff,1.0,[0,11,7]);soft(7,7,0xffffff,.55,[-11,3,2]);soft(6,8,0xfff0cc,.5,[11,4,-5]);soft(24,4,0xb0b4c4,.1,[0,-9,0]);soft(10,3,0xffffff,.45,[0,2,-12]);
  scene.environment=pmrem.fromScene(env,.04).texture;pmrem.dispose();

  scene.add(new T.HemisphereLight(0xffffff,0x26262b,.35));
  const key=new T.DirectionalLight(0xffffff,1.1);key.position.set(5,9,7);scene.add(key);
  const rim=new T.DirectionalLight(0xe6e9f5,.6);rim.position.set(-7,3,-7);scene.add(rim);

  /* ---------- materiales ---------- */
  /* tejido: textura generada (trama tipo nylon trenzado) */
  function weave(){const N=512,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d');
    g.fillStyle='#bdbdbd';g.fillRect(0,0,N,N);const C=16,cs=N/C;
    for(let i=0;i<C;i++)for(let j=0;j<C;j++){const x=i*cs,y=j*cs,h=((i+j)%2===0);
      const gr=h?g.createLinearGradient(x,y,x,y+cs):g.createLinearGradient(x,y,x+cs,y);
      gr.addColorStop(0,'#9a9a9a');gr.addColorStop(.25,'#ededed');gr.addColorStop(.55,'#ffffff');gr.addColorStop(1,'#8c8c8c');g.fillStyle=gr;
      if(h)g.fillRect(x-cs*.15,y+cs*.08,cs*1.3,cs*.84);else g.fillRect(x+cs*.08,y-cs*.15,cs*.84,cs*1.3);
      g.strokeStyle='rgba(0,0,0,.08)';g.lineWidth=1;for(let k=1;k<4;k++){g.beginPath();if(h){g.moveTo(x,y+cs*k/4);g.lineTo(x+cs,y+cs*k/4)}else{g.moveTo(x+cs*k/4,y);g.lineTo(x+cs*k/4,y+cs)}g.stroke()}}
    const im=g.getImageData(0,0,N,N),d=im.data;let seed=7;const r=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
    for(let k=0;k<d.length;k+=4){const n=(r()-.5)*22;d[k]=d[k+1]=d[k+2]=Math.max(0,Math.min(255,d[k]+n))}g.putImageData(im,0,0);
    const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=8;return t}
  const weaveTex=weave();weaveTex.encoding=T.sRGBEncoding;

  const M={
    strap:new T.MeshPhysicalMaterial({color:(STRAPS[o.strap]||STRAPS.negro).color,map:weaveTex,bumpMap:weaveTex,bumpScale:.018,roughnessMap:weaveTex,roughness:.95,metalness:0,sheen:new T.Color((STRAPS[o.strap]||STRAPS.negro).sheen),envMapIntensity:.45}),
    shell:new T.MeshPhysicalMaterial({color:0x141417,roughness:.42,metalness:.6,clearcoat:.15,clearcoatRoughness:.4,envMapIntensity:.8}),
    base:new T.MeshStandardMaterial({color:0x14162a,roughness:.65}),
    glass:new T.MeshPhysicalMaterial({color:0x07080f,roughness:.06,metalness:0,clearcoat:1}),
    accent:new T.MeshStandardMaterial({color:0xF3B705,emissive:0xF3B705,emissiveIntensity:.35,roughness:.4}),
    led:new T.MeshStandardMaterial({color:0x332a00,emissive:0xF3B705,emissiveIntensity:.9,roughness:.3}),
    gold:new T.MeshStandardMaterial({color:0xd8aa45,metalness:1,roughness:.25}),
    metal:new T.MeshStandardMaterial({color:0x5a5e69,metalness:.9,roughness:.28}),
    green:new T.MeshStandardMaterial({color:0x0a3,emissive:0x22ff66,emissiveIntensity:.2,roughness:.3}),
    red:new T.MeshStandardMaterial({color:0x600,emissive:0xff2a2a,emissiveIntensity:.15,roughness:.3}),
    pcb:new T.MeshStandardMaterial({color:0x1d5a43,roughness:.6}),
    chip:new T.MeshStandardMaterial({color:0x14151c,roughness:.35,metalness:.3}),
    batt:new T.MeshStandardMaterial({color:0xc4c8d4,metalness:.55,roughness:.38}),
    skin:new T.MeshPhysicalMaterial({color:0xdfe3f5,roughness:.22,metalness:0,clearcoat:.6,transparent:true,opacity:.26,depthWrite:false,envMapIntensity:1.1}),
    white:new T.MeshStandardMaterial({color:0xe9eaf0,roughness:.45}),
    cable:new T.MeshStandardMaterial({color:0x1a1b22,roughness:.6}),
    ring:new T.MeshBasicMaterial({color:0xF3B705,transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false})
  };

  Object.values(M).forEach(m=>{m.color&&m.color.convertSRGBToLinear();m.emissive&&m.emissive.convertSRGBToLinear()});
  const rr=(w,h,r)=>{const s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s};
  const roundBox=(w,d,h,r,mat)=>{const bev=Math.min(r,h/2-.001);const g=new T.ExtrudeGeometry(rr(w-2*bev,d-2*bev,Math.min(r,(Math.min(w,d)-2*bev)/2-.001)),{depth:Math.max(.001,h-2*bev),bevelEnabled:true,bevelThickness:bev,bevelSize:bev,bevelSegments:5,curveSegments:10});g.rotateX(-Math.PI/2);g.computeBoundingBox();const b=g.boundingBox;g.translate(-(b.min.x+b.max.x)/2,-(b.min.y+b.max.y)/2,-(b.min.z+b.max.z)/2);return new T.Mesh(g,mat)};

  /* ---------- la banda ---------- */
  const RX=3.0,RY=2.5,POD_Y=0,TH0=Math.PI/2,TSP=.56;
  const band=new T.Group();scene.add(band);
  const ell=th=>new T.Vector3(Math.cos(th)*RX,Math.sin(th)*RY,0);
  const nrm=th=>new T.Vector3(RY*Math.cos(th),RX*Math.sin(th),0).normalize();
  const SE=(u,n)=>Math.sign(u)*Math.pow(Math.abs(u),2/n);
  const STRAP={a:.74,b:.115,off:0,n:4};
  const sm=(a,b,x)=>{const k=clamp((x-a)/(b-a),0,1);return k*k*(3-2*k)};
  const modProf=t=>{t=clamp(t,0,1);const s=sm(0,.34,t)*sm(0,.34,1-t);return{a:STRAP.a+.005+.17*s,b:STRAP.b+.005+.19*s,off:-.065*s,n:4+2*s}};
  function sweep(th0,th1,steps,prof,closed,segs=48){
    const pos=[],idx=[],uv=[];const rings=closed?steps:steps+1;const UR=closed?15:3;
    const RR=closed?rings+1:rings;
    for(let r=0;r<RR;r++){const t=r/steps,th=th0+(th1-th0)*t,c=ell(th),n=nrm(th),P=prof(t);
      for(let j=0;j<segs;j++){const a=j/segs*Math.PI*2;const x=SE(Math.cos(a),P.n)*P.a,y=SE(Math.sin(a),P.n)*P.b+P.off;pos.push(c.x+n.x*y,c.y+n.y*y,x);uv.push(t*UR,j/segs*2)}}
    for(let r=0;r<RR-1;r++){const r2=r+1;for(let j=0;j<segs;j++){const j2=(j+1)%segs;const A=r*segs+j,B=r2*segs+j,C=r2*segs+j2,D=r*segs+j2;idx.push(A,D,B,B,D,C)}}
    if(!closed)[0,rings-1].forEach((r,k)=>{const ci=pos.length/3;let cx=0,cy=0,cz=0;for(let j=0;j<segs;j++){cx+=pos[(r*segs+j)*3];cy+=pos[(r*segs+j)*3+1];cz+=pos[(r*segs+j)*3+2]}pos.push(cx/segs,cy/segs,cz/segs);uv.push(0,0);
      for(let j=0;j<segs;j++){const j2=(j+1)%segs;if(k===0)idx.push(ci,r*segs+j,r*segs+j2);else idx.push(ci,r*segs+j2,r*segs+j)}});
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g}
  /* punto de la superficie del módulo: lado 1 = arriba (exterior), -1 = interior (piel) */
  const surf=(x,side)=>{const th=Math.acos(clamp(x/RX,-1,1));const t=(th-(TH0-TSP))/(2*TSP);const P=t>=0&&t<=1?modProf(t):STRAP;const n=nrm(th);return{p:ell(th).add(n.clone().multiplyScalar(P.off+side*P.b)),n:side>0?n:n.clone().negate(),P}};
  const orient=(obj,n)=>{obj.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n)};

  const strap=new T.Mesh(sweep(0,Math.PI*2,260,()=>STRAP,true),M.strap);band.add(strap);
  const clasp=roundBox(.5,1.5,.12,.05,M.metal);clasp.position.set(0,-RY-STRAP.b-.03,0);band.add(clasp);

  const pod=new T.Group();band.add(pod);
  const shell=new T.Group();pod.add(shell);
  shell.add(new T.Mesh(sweep(TH0-TSP,TH0+TSP,140,modProf,false),M.shell));shell.userData.ay=0;
  const TOP=surf(0,1).p.y,INNER=surf(0,-1).p.y,MID=(TOP+INNER)/2;shell.userData.ay=MID;
  /* luz de estado: una línea fina sobre el módulo */
  {const s1=surf(.62,1);const l=roundBox(.045,.42,.018,.008,M.led);l.position.copy(s1.p).add(s1.n.clone().multiplyScalar(.004));orient(l,s1.n);shell.add(l);HOTSPOTS.find(h=>h.id==='led').pos=[s1.p.x,s1.p.y+.02,.0];HOTSPOTS.find(h=>h.id==='led').n=[s1.n.x,s1.n.y,0]}
  var ledBar=null;
  /* logo grabado */
  const lc=document.createElement('canvas');lc.width=512;lc.height=128;const lx=lc.getContext('2d');
  const drawLogo=()=>{lx.clearRect(0,0,512,128);lx.fillStyle='rgba(200,203,215,.85)';lx.font='400 80px Anton, Impact, "Arial Narrow", sans-serif';lx.textAlign='center';lx.textBaseline='middle';
    if('letterSpacing' in lx)lx.letterSpacing='14px';lx.fillText('VITAVA',256,64)};
  drawLogo();
  const logoTex=new T.CanvasTexture(lc);logoTex.encoding=T.sRGBEncoding;logoTex.anisotropy=4;
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{drawLogo();logoTex.needsUpdate=true;dirty=true});
  {const s2=surf(-.32,1);const logo=new T.Mesh(new T.PlaneGeometry(.95,.24),new T.MeshBasicMaterial({map:logoTex,transparent:true,depthWrite:false}));
   const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),s2.n);const qx=new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),-Math.PI/2);logo.quaternion.copy(q).multiply(qx);logo.position.copy(s2.p).add(s2.n.clone().multiplyScalar(.004));logo.userData.skip=true;shell.add(logo)}
  /* botón SOS discreto en el costado + punto amarillo */
  const SIDE_Z=modProf(.5).a;
  const BTN=new T.Vector3(0,RY+modProf(.5).off,SIDE_Z);
  {const b=roundBox(.46,.07,.14,.06,M.shell);b.position.set(BTN.x,BTN.y,BTN.z+.012);shell.add(b);
   const d=new T.Mesh(new T.SphereGeometry(.035,16,12),M.accent);d.position.set(BTN.x+.36,BTN.y,BTN.z+.01);shell.add(d)}
  HOTSPOTS.find(h=>h.id==='sos').pos=[BTN.x,BTN.y,BTN.z+.08];
  /* sensor óptico en la cara interior */
  const glass=new T.Mesh(new T.CylinderGeometry(.34,.34,.03,48),M.glass);glass.position.set(0,INNER-.005,0);shell.add(glass);
  const leds=[];[[-.12,.08,M.green],[.12,.08,M.green],[0,-.13,M.red]].forEach(([x,z,m])=>{const l=new T.Mesh(new T.CylinderGeometry(.045,.045,.02,20),m);l.position.set(x,INNER-.02,z);shell.add(l);leds.push(l)});
  {const pd=new T.Mesh(new T.BoxGeometry(.1,.02,.1),M.chip);pd.position.set(0,INNER-.02,-.0);shell.add(pd)}
  HOTSPOTS.find(h=>h.id==='sensor').pos=[0,INNER-.04,0];
  const PIN=surf(-1.0,-1);
  [-.2,.2].forEach(z=>{const p=new T.Mesh(new T.CylinderGeometry(.05,.05,.04,20),M.gold);p.position.copy(PIN.p).add(PIN.n.clone().multiplyScalar(.005));p.position.z=z;orient(p,PIN.n);shell.add(p)});
  HOTSPOTS.find(h=>h.id==='pins').pos=[PIN.p.x,PIN.p.y-.04,0];HOTSPOTS.find(h=>h.id==='pins').n=[PIN.n.x,PIN.n.y,0];
  HOTSPOTS.find(h=>h.id==='strap').pos=[RX+STRAP.b+.02,0,0];
  HOTSPOTS.find(h=>h.id==='clasp').pos=[0,-RY-STRAP.b-.12,0];

  /* componentes internos */
  const inner={};
  const mk=(id,obj)=>{inner[id]=obj;obj.userData.home=obj.position.clone();obj.visible=false;pod.add(obj);return obj};
  {const g=new T.Group();g.add(new T.Mesh(new T.BoxGeometry(.7,.04,.55),M.pcb));const c=new T.Mesh(new T.BoxGeometry(.26,.05,.18),M.chip);c.position.y=.04;g.add(c);g.position.set(0,INNER+.08,0);mk('max',g)}
  {const g=roundBox(.26,.26,.07,.03,M.chip);g.position.set(-.55,MID-.08,.28);mk('bmi',g)}
  {const g=new T.Group();g.add(new T.Mesh(new T.CylinderGeometry(.2,.2,.1,32),M.metal));g.position.set(.6,MID-.08,.28);mk('motor',g)}
  {const g=new T.Group();g.add(new T.Mesh(new T.BoxGeometry(1.35,.04,1.1),M.pcb));const c=roundBox(.55,.55,.08,.02,M.metal);c.position.set(-.2,.06,0);g.add(c);const a=new T.Mesh(new T.BoxGeometry(.4,.02,.08),M.gold);a.position.set(.4,.03,-.38);g.add(a);g.position.set(0,MID+.02,0);mk('pcb',g)}
  {const g=roundBox(1.5,1.15,.14,.05,M.batt);g.position.set(0,TOP-.14,0);mk('battery',g)}
  shell.userData.home=shell.position.clone();inner.shell=shell;

  /* brazo para las animaciones */
  const arm=new T.Group();arm.visible=false;scene.add(arm);
  {/* antebrazo: perfil que se afina hacia la muñeca, sección ovalada */
   const pr=[];const L0=-15,L1=2.9;for(let k=0;k<=60;k++){const y=L0+(L1-L0)*k/60;let r;
     if(y<0){const u=(-y)/15;r=1+.26*Math.pow(u,.8)}else{const u=y/L1;r=1-.06*Math.sin(u*Math.PI)+.0*u}
     pr.push(new T.Vector2(r,y))}
   const lg=new T.LatheGeometry(pr,64);lg.rotateX(Math.PI/2);const fore=new T.Mesh(lg,M.skin);fore.scale.set(2.6,2.02,1);arm.add(fore);
   /* hueso de la muñeca */
   const bone=new T.Mesh(new T.SphereGeometry(.42,24,16),M.skin);bone.position.set(2.35,.6,1.2);arm.add(bone);
   /* mano: palma plana + dedos + pulgar */
   const palm=new T.Mesh(new T.SphereGeometry(1,48,32),M.skin);palm.scale.set(2.45,.88,2.55);palm.position.set(0,-.25,4.55);arm.add(palm);
   const cap=(r,len)=>{const g=new T.Group();const c=new T.Mesh(new T.CylinderGeometry(r,r*1.05,len,24),M.skin);c.rotation.x=Math.PI/2;c.position.z=len/2;g.add(c);const t=new T.Mesh(new T.SphereGeometry(r,24,16),M.skin);t.position.z=len;g.add(t);return g};
   [[-1.5,2.0,-.12],[-.52,2.45,-.04],[.48,2.6,.02],[1.45,2.3,.1]].forEach(([x,len,ry])=>{const f=cap(.38,len);f.position.set(x,-.32,6.1);f.rotation.y=ry;f.rotation.x=.1;arm.add(f)});
   const th=cap(.44,2.1);th.position.set(2.05,-.45,3.9);th.rotation.y=.75;th.rotation.x=.15;arm.add(th)}
  /* dedo para el SOS */
  const finger=new T.Group();finger.visible=false;scene.add(finger);
  {const c=new T.Mesh(new T.CylinderGeometry(.26,.31,4,32),M.skin);c.rotation.x=Math.PI/2;c.position.z=2;finger.add(c);const t=new T.Mesh(new T.SphereGeometry(.26,32,16),M.skin);t.scale.set(1,.9,1.15);finger.add(t)}
  /* conector de carga */
  const charger=new T.Group();charger.visible=false;scene.add(charger);
  {const h=roundBox(.55,1.0,.28,.1,M.white);charger.add(h);const r=roundBox(.4,.85,.03,.01,M.accent);r.position.y=-.15;charger.add(r);
   const cc=new T.CatmullRomCurve3([new T.Vector3(0,-.1,0),new T.Vector3(0,-.9,.3),new T.Vector3(.4,-2.2,1.6),new T.Vector3(1.2,-3.4,4.5)]);charger.add(new T.Mesh(new T.TubeGeometry(cc,40,.07,10,false),M.cable))}
  /* ondas de vibración */
  const rings=[0,1,2].map(()=>{const r=new T.Mesh(new T.RingGeometry(1,1.04,80),M.ring.clone());r.rotation.x=-Math.PI/2;r.position.y=TOP+.03;r.visible=false;scene.add(r);return r});
  /* sombra de contacto */
  const sc=document.createElement('canvas');sc.width=sc.height=128;{const g=sc.getContext('2d');const gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(0,0,0,.42)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,128,128)}
  const shadow=new T.Mesh(new T.PlaneGeometry(13,8),new T.MeshBasicMaterial({map:new T.CanvasTexture(sc),transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-RY-.45;scene.add(shadow);

  /* ---------- cámara orbital ---------- */
  const cam={az:VIEWS[o.view].az,el:VIEWS[o.view].el,dist:VIEWS[o.view].dist,ty:VIEWS[o.view].ty};
  let tween=null,explodeT=0,explodeTarget=0,idle=0,film=null,visible=true,dirty=true,destroyed=false;
  const applyCam=()=>{const ce=Math.cos(cam.el);const k=camera.aspect<1?1.1+.3*explodeT:(camera.aspect<1.25?1+.12*explodeT:1);const d=cam.dist*k;camera.position.set(Math.sin(cam.az)*ce*d,cam.ty+Math.sin(cam.el)*d,Math.cos(cam.az)*ce*d);camera.lookAt(0,cam.ty,0)};
  const goTo=(v,dur=1.1)=>{const from={...cam};let to={az:v.az,el:v.el,dist:v.dist,ty:v.ty};
    let d=to.az-from.az;d=((d+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;to.az=from.az+d;tween={from,to,t:0,dur};dirty=true};
  function setView(name){const v=VIEWS[name];if(!v)return;explodeTarget=name==='explosion'?1:0;goTo(v);idle=-6;updateHotspots(true)}
  function setStrap(k){if(!STRAPS[k])return;M.strap.color.set(STRAPS[k].color).convertSRGBToLinear();if(M.strap.sheen)M.strap.sheen.set(STRAPS[k].sheen).convertSRGBToLinear();dirty=true}
  function setExplode(b){explodeTarget=b?1:0;dirty=true}

  /* ---------- interacción ---------- */
  const ptrs=new Map();let lastPinch=0;
  const cv=renderer.domElement;
  if(o.interactive){
    cv.addEventListener('pointerdown',e=>{if(film)return;cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});tween=null;idle=-4});
    cv.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId)||film)return;const p=ptrs.get(e.pointerId);
      if(ptrs.size===1){cam.az-=(e.clientX-p.x)*.008;cam.el=clamp(cam.el+(e.clientY-p.y)*.006,-1.2,1.4);dirty=true}
      p.x=e.clientX;p.y=e.clientY;
      if(ptrs.size===2){const a=[...ptrs.values()];const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(lastPinch){cam.dist=clamp(cam.dist*lastPinch/d,5,26);dirty=true}lastPinch=d}});
    const up=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)lastPinch=0};
    cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
    cv.addEventListener('wheel',e=>{if(film||!o.wheelZoom)return;e.preventDefault();cam.dist=clamp(cam.dist*(1+e.deltaY*.001),5,26);dirty=true},{passive:false});
    cv.addEventListener('keydown',e=>{if(film)return;if(e.key==='ArrowLeft'){cam.az-=.2;dirty=true}if(e.key==='ArrowRight'){cam.az+=.2;dirty=true}if(e.key==='ArrowUp'){cam.el=clamp(cam.el+.15,-1.2,1.4);dirty=true}if(e.key==='ArrowDown'){cam.el=clamp(cam.el-.15,-1.2,1.4);dirty=true}idle=-4});
  }

  /* ---------- puntos de interés y etiquetas ---------- */
  const hsEls=[];let card=null;
  const v3=new T.Vector3(),n3=new T.Vector3(),cd=new T.Vector3();
  if(o.hotspots){HOTSPOTS.forEach(h=>{const el=document.createElement('div');el.className='v3d-hs off';el.innerHTML=`<button type="button" aria-label="${h.label}"><i></i>${h.label}</button>`;el.querySelector('button').addEventListener('click',()=>showCard(h));layer.appendChild(el);hsEls.push({h,el})})}
  function showCard(h){if(o.onHotspot){o.onHotspot(h);return}if(card)card.remove();card=document.createElement('div');card.className='v3d-card';card.innerHTML=`<button type="button" aria-label="Cerrar">×</button><b>${h.label}</b>${h.desc}`;card.querySelector('button').onclick=()=>{card.remove();card=null};layer.appendChild(card)}
  const lbEls=PARTS.map(p=>{const el=document.createElement('div');el.className='v3d-lb'+(p.side<0?' l':'');el.style.opacity=0;el.innerHTML=`${p.label}<small>${p.sub}</small>`;layer.appendChild(el);return{p,el}});
  const project=(x,y,z)=>{v3.set(x,y,z).project(camera);const w=container.clientWidth,h=container.clientHeight;return{x:(v3.x*.5+.5)*w,y:(-v3.y*.5+.5)*h,z:v3.z}};
  function updateHotspots(){const showHs=!film&&explodeT<.05&&o.hotspots;
    hsEls.forEach(({h,el})=>{if(!showHs){el.classList.add('off');return}
      v3.set(...h.pos);band.localToWorld(v3);n3.set(...h.n);cd.copy(camera.position).sub(v3).normalize();const facing=n3.dot(cd)>.12;
      const p=project(v3.x,v3.y,v3.z);el.style.left=p.x+'px';el.style.top=p.y+'px';el.classList.toggle('off',!facing||p.z>1)});
    lbEls.forEach(({p,el})=>{const ob=inner[p.id];if(!ob||explodeT<.6||(film&&film.cur&&film.cur.id!=='inside')&&film){el.style.opacity=0;return}
      v3.set(p.side*(p.w+.35),ob.userData.ay||0,0);ob.localToWorld(v3);const q=project(v3.x,v3.y,v3.z);el.style.left=q.x+'px';el.style.top=q.y+'px';el.style.opacity=Math.min(1,(explodeT-.6)*2.5)})}

  /* ---------- explosión ---------- */
  function applyExplode(e){const k=ease(e);PARTS.forEach(p=>{const ob=inner[p.id];if(!ob)return;const h=ob.userData.home;ob.position.set(h.x+p.to[0]*k,h.y+p.to[1]*k,h.z+p.to[2]*k);if(p.id!=='shell')ob.visible=e>.01});
  }

  /* ---------- película ---------- */
  let capEl=null,notifEl=null,readsEl=null,barEl=null;
  function filmDOM(){if(capEl)return;capEl=document.createElement('div');capEl.className='v3d-cap';capEl.style.opacity=0;capEl.innerHTML='<span></span><p></p>';layer.appendChild(capEl);
    notifEl=document.createElement('div');notifEl.className='v3d-notif';notifEl.innerHTML='<div class="ap">V</div><div><b></b><span></span><br><small>Vitava · ahora</small></div>';layer.appendChild(notifEl);
    readsEl=document.createElement('div');readsEl.className='v3d-reads';readsEl.style.opacity=0;readsEl.innerHTML='<div>Corazón<b data-r="fc">72</b></div><div>Oxígeno<b data-r="sp">97%</b></div><div>Presión<b data-r="bp">118/76</b></div>';layer.appendChild(readsEl)}
  function notif(on,title,text){if(on&&title){notifEl.querySelector('b').textContent=title;notifEl.querySelector('span').textContent=text}notifEl.classList.toggle('on',!!on)}
  function resetScene(){arm.visible=false;finger.visible=false;charger.visible=false;rings.forEach(r=>r.visible=false);band.position.set(0,0,0);band.rotation.set(0,0,0);pod.position.set(0,POD_Y,0);
    M.led.emissive.set(0xF3B705).convertSRGBToLinear();M.led.emissiveIntensity=.9;M.accent.emissiveIntensity=.35;leds.forEach(l=>l.material.emissiveIntensity=l.material===M.red?.15:.2);shadow.visible=true}
  const CH={
    intro:(t,c)=>{c.cam={az:lerp(-.5,1.3,ease(t)),el:.32,dist:lerp(15,12,ease(t)),ty:.5}},
    wear:(t,c)=>{arm.visible=true;shadow.visible=false;const k=ease(seg(t,.05,.7));band.position.z=lerp(11,0,k);band.rotation.z=lerp(-.25,0,k);arm.position.set(0,0,0);
      c.cam={az:lerp(1.2,1.05,t),el:lerp(.42,.3,t),dist:lerp(22,17,ease(t)),ty:lerp(.2,.4,t)}},
    measure:(t,c)=>{arm.visible=true;shadow.visible=false;const beat=Math.pow(Math.max(0,Math.sin(t*7.5*Math.PI*2*1.15)),8);
      M.green.emissiveIntensity=.4+beat*3.2;M.red.emissiveIntensity=.2+beat*1.6;
      c.cam={az:lerp(.9,.55,ease(t)),el:lerp(.55,.42,t),dist:lerp(13,11,ease(t)),ty:1.6};
      readsEl.style.opacity=t>.2&&t<.95?1:0;const fc=Math.round(70+Math.sin(t*12)*2);readsEl.querySelector('[data-r="fc"]').textContent=fc},
    vibrate:(t,c)=>{const on=(t>.15&&t<.3)||(t>.55&&t<.65)||(t>.72&&t<.82);pod.position.x=on?Math.sin(performance.now()*.12)*.05:0;pod.position.y=POD_Y+(on?Math.cos(performance.now()*.15)*.03:0);
      rings.forEach((r,i)=>{const ph=((t*3+i/3)%1);r.visible=on||ph<.5&&t>.15&&t<.9;r.scale.setScalar(1+ph*2.8);r.material.opacity=on?(1-ph)*.75:0});
      M.led.emissive.set(0x3fa9ff).convertSRGBToLinear();M.led.emissiveIntensity=on?2.4:.6;
      c.cam={az:lerp(.3,.65,t),el:lerp(.62,.5,t),dist:lerp(10,9.5,t),ty:2.2}},
    alert:(t,c)=>{const p=Math.pow(Math.max(0,Math.sin(t*Math.PI*10)),3);M.led.emissive.set(0xff3b3b).convertSRGBToLinear();M.led.emissiveIntensity=.8+p*2.5;
      if(t>.28)notif(true,'Ritmo cardiaco alto de Gloria','127 lpm sin actividad física a las 11:47. Toca para llamarle.');
      c.cam={az:lerp(-.4,.2,ease(t)),el:.45,dist:lerp(13,10.5,ease(t)),ty:1.6}},
    sos:(t,c)=>{finger.visible=true;const press=seg(t,.15,.3)-seg(t,.72,.85);const bw=new T.Vector3(BTN.x,BTN.y,BTN.z+.33);finger.position.set(bw.x,bw.y,bw.z+lerp(2.4,.0,ease(clamp(press,0,1))));
      const held=t>.3&&t<.72;M.accent.emissiveIntensity=held?1.2+Math.sin(t*60)*.6:.35;
      if(t>.7)notif(true,'SOS enviado','Avisamos a Laura y a Carlos con tu ubicación aproximada.');
      c.cam={az:lerp(.55,.35,t),el:.18,dist:lerp(9,7,ease(t)),ty:2.4}},
    charge:(t,c)=>{charger.visible=true;const k=ease(seg(t,.05,.35));charger.position.set(PIN.p.x,PIN.p.y-.17-lerp(2.5,0,k),0);
      const prog=seg(t,.4,.95);M.led.emissive.set(0xF3B705).convertSRGBToLinear();M.led.emissiveIntensity=.6+Math.abs(Math.sin(t*14))*1.6*(t>.38?1:0);
      c.cam={az:lerp(.5,.3,t),el:lerp(-.18,-.12,t),dist:lerp(8,7.4,t),ty:lerp(2.0,2.2,t)}},
    inside:(t,c)=>{explodeT=seg(t,.08,.5)-seg(t,.9,1)*1;if(explodeT<0)explodeT=0;c.cam={az:lerp(-.25,.25,t),el:.2,dist:17,ty:3.7}},
    outro:(t,c)=>{c.cam={az:lerp(.2,1.4,t),el:lerp(.25,.35,t),dist:lerp(12,13.5,t),ty:.5}}
  };
  function playFilm(ids,cb={}){filmDOM();const list=(ids&&ids.length?ids:CHAPTERS.map(c=>c.id)).map(id=>CHAPTERS.find(c=>c.id===id)).filter(Boolean);
    const total=list.reduce((a,c)=>a+c.dur,0);film={list,total,t:0,playing:true,cur:null,cb,last:performance.now()};
    if(o.filmUI)buildBar();hsEls.forEach(({el})=>el.classList.add('off'));if(card){card.remove();card=null}dirty=true;return film}
  function buildBar(){if(barEl)barEl.remove();barEl=document.createElement('div');barEl.className='v3d-bar';
    barEl.innerHTML=`<button type="button" aria-label="Pausa">${icon('pause')}</button><div class="v3d-track">${film.list.map(c=>`<i title="${c.tag}"><b></b></i>`).join('')}</div><span class="v3d-time">0:00</span>`;
    barEl.querySelector('button').onclick=()=>toggle();
    barEl.querySelector('.v3d-track').addEventListener('click',e=>{const r=e.currentTarget.getBoundingClientRect();const f=(e.clientX-r.left)/r.width;film.t=clamp(f,0,.999)*film.total;dirty=true});
    layer.appendChild(barEl)}
  const icon=n=>n==='play'?'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>':n==='replay'?'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
  function toggle(){if(!film)return;if(film.t>=film.total){film.t=0;film.playing=true}else film.playing=!film.playing;film.last=performance.now();if(barEl)barEl.querySelector('button').innerHTML=icon(film.playing?'pause':(film.t>=film.total?'replay':'play'));dirty=true}
  function stopFilm(){if(!film)return;film=null;resetScene();explodeTarget=0;explodeT=0;applyExplode(0);if(capEl){capEl.style.opacity=0;readsEl.style.opacity=0;notif(false)}if(barEl){barEl.remove();barEl=null}goTo(VIEWS.frente,.8);dirty=true}
  function stepFilm(dt){if(film.playing)film.t=Math.min(film.total,film.t+dt);let acc=0,cur=null,lt=0;for(const c of film.list){if(film.t<acc+c.dur||c===film.list[film.list.length-1]){cur=c;lt=clamp((film.t-acc)/c.dur,0,1);break}acc+=c.dur}
    if(cur!==film.cur){resetScene();notif(false);readsEl.style.opacity=0;if(cur.id!=='inside')explodeT=0;film.cur=cur;capEl.querySelector('span').textContent=cur.tag;capEl.querySelector('p').textContent=cur.text;film.cb.onChapter&&film.cb.onChapter(cur)}
    const ctx={cam:null};CH[cur.id](lt,ctx);if(ctx.cam)Object.assign(cam,ctx.cam);if(cur.id!=='inside')explodeT=0;applyExplode(explodeT);
    capEl.style.opacity=(lt>.04&&lt<.96)?1:0;
    if(barEl){let a=0;barEl.querySelectorAll('.v3d-track b').forEach((b,i)=>{const d=film.list[i].dur;b.style.width=clamp((film.t-a)/d,0,1)*100+'%';a+=d});const s=Math.floor(film.t),S=Math.floor(film.total);barEl.querySelector('.v3d-time').textContent=`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')} / ${Math.floor(S/60)}:${String(S%60).padStart(2,'0')}`}
    film.cb.onProgress&&film.cb.onProgress(film.t/film.total);
    if(film.t>=film.total&&film.playing){film.playing=false;if(barEl)barEl.querySelector('button').innerHTML=icon('replay');film.cb.onEnd&&film.cb.onEnd()}}

  /* ---------- bucle ---------- */
  function resize(){const w=container.clientWidth||300,h=container.clientHeight||300;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w/h<.8?40:32;camera.updateProjectionMatrix();dirty=true}
  const ro=new ResizeObserver(resize);ro.observe(container);resize();
  const io=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)last=performance.now()},{threshold:0});io.observe(container);
  let last=performance.now(),frameCB=null;
  function frame(now,manualDt){if(destroyed)return;if(manualDt==null)requestAnimationFrame(frame);
    const dt=manualDt!=null?manualDt:Math.min(.05,(now-last)/1000);last=now;
    if(!visible&&manualDt==null)return;
    if(film){stepFilm(dt);dirty=true}
    else{
      if(tween){tween.t+=dt/tween.dur;const k=ease(Math.min(1,tween.t));for(const key of['az','el','dist','ty'])cam[key]=lerp(tween.from[key],tween.to[key],k);if(tween.t>=1)tween=null;dirty=true}
      else if(o.autoRotate&&!ptrs.size){idle+=dt;if(idle>0){cam.az+=dt*.25*Math.min(1,idle);dirty=true}}
      if(Math.abs(explodeT-explodeTarget)>.001){explodeT+=Math.sign(explodeTarget-explodeT)*Math.min(Math.abs(explodeTarget-explodeT),dt*1.1);applyExplode(explodeT);dirty=true}
    }
    if(!dirty)return;dirty=false;applyCam();renderer.render(scene,camera);updateHotspots();frameCB&&frameCB()}
  if(!o.manual)requestAnimationFrame(frame);
  applyExplode(0);

  return{
    setView,setStrap,setExplode,playFilm,stopFilm,toggle,
    get playing(){return!!(film&&film.playing)},
    get filmState(){return film},
    /* render determinista para exportar vídeo */
    renderAt(dt){frame(performance.now(),dt)},
    canvas:renderer.domElement,
    ext:{T,scene,camera,renderer,band,pod,shell,inner,M,arm,finger,charger,leds,rings,shadow,key,rim,ell,nrm,project,PARTS,dims:{RX,RY,TOP,INNER,MID,BTN,PIN:PIN.p,SIDE_Z}},
    /* pasadas para dibujo: 'beauty' | 'normal' | 'mask' */
    snapshot(mode){const hidden=[];const prev=scene.overrideMaterial;
      if(mode!=='beauty'){scene.overrideMaterial=mode==='normal'?new T.MeshNormalMaterial():new T.MeshBasicMaterial({color:0xffffff});
        scene.traverse(ob=>{if(ob.visible&&(ob.userData.skip||ob===shadow||rings.includes(ob))){ob.visible=false;hidden.push(ob)}})}
      applyCam();renderer.render(scene,camera);const url=renderer.domElement.toDataURL('image/png');
      scene.overrideMaterial=prev;hidden.forEach(ob=>ob.visible=true);dirty=true;return url},
    points(){const out={};HOTSPOTS.forEach(h=>{v3.set(h.pos[0],h.pos[1],h.pos[2]);band.localToWorld(v3);const p=project(v3.x,v3.y,v3.z);out[h.id]=[p.x,p.y]});
      PARTS.forEach(p=>{const ob=inner[p.id];if(!ob)return;v3.set(0,ob.userData.ay||0,0);ob.localToWorld(v3);const q=project(v3.x,v3.y,v3.z);out['part_'+p.id]=[q.x,q.y]});
      [['top',[0,TOP,0]],['inner',[0,INNER,0]],['modL',[-RX*Math.cos(TH0-TSP),RY*Math.sin(TH0-TSP)+.12,0]],['modR',[RX*Math.cos(TH0-TSP),RY*Math.sin(TH0-TSP)+.12,0]],['modZp',[0,TOP-.15,SIDE_Z]],['modZm',[0,TOP-.15,-SIDE_Z]],['sZp',[RX+STRAP.b,0,STRAP.a]],['sZm',[RX+STRAP.b,0,-STRAP.a]],['strapR',[RX,0,0]],['strapB',[0,-RY,0]]].forEach(([k,pp])=>{v3.set(pp[0],pp[1],pp[2]);band.localToWorld(v3);const q=project(v3.x,v3.y,v3.z);out[k]=[q.x,q.y]});
      return out},
    setCam(c){Object.assign(cam,c);tween=null;dirty=true},
    setFov(f){camera.fov=f;camera.updateProjectionMatrix();dirty=true},
    proj(list){applyCam();camera.updateMatrixWorld();return list.map(p=>{v3.set(p[0],p[1],p[2]);band.localToWorld(v3);const q=project(v3.x,v3.y,v3.z);return[q.x,q.y]})},
    dims(){const mp=modProf(.5);return{RX,RY,b:STRAP.b,a:STRAP.a,TOP,INNER,SIDE_Z,xEnd:RX*Math.cos(TH0-TSP),yEnd:RY*Math.sin(TH0-TSP),clasp:-RY-STRAP.b-.15,modOff:mp.off,modB:mp.b}},
    setExplodeNow(e){explodeT=explodeTarget=e;applyExplode(e);dirty=true},
    destroy(){destroyed=true;ro.disconnect();io.disconnect();renderer.dispose();try{renderer.forceContextLoss()}catch(e){}container.innerHTML='';container.classList.remove('v3d')}
  };
}
window.Vitaba3D={create,STRAPS,VIEWS,CHAPTERS,HOTSPOTS,PARTS};
})();
