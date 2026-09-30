// Offline: de site blijft leesbaar zonder internet. Eigen bestanden: eerst netwerk (altijd de nieuwste versie),
// bij geen of traag netwerk de bewaarde kopie. Lettertypen en Leaflet: uit de bewaarde kopie. Supabase en kaarttegels: nooit bewaren.
const VERSIE='nexus-1';
const KERN=['./','index.html','style.css','app.js','assets/kop/tower-bridge-croissant-900.webp','assets/group/groep-1000.webp','assets/group/groep.webp','assets/people/anke-daling-480.webp','assets/people/anne-van-kraaij-480.webp','assets/people/bas-post-480.webp','assets/people/david-van-maanen-480.webp','assets/people/emilie-tolhuisen-480.webp','assets/people/india-soeteman-480.webp','assets/people/jarno-ammerlaan-480.webp','assets/people/jeroen-heemskerk-480.webp','assets/people/jeroen-hutten-480.webp','assets/people/jim-van-aken-480.webp','assets/people/kelly-van-de-kletersteeg-480.webp','assets/people/lieke-schoenmakers-480.webp','assets/people/maria-luis-brandao-480.webp','assets/people/maurits-casteleijn-480.webp','assets/people/mitchel-ammerlaan-480.webp','assets/people/nick-eversdijk-480.webp','assets/people/richard-huisman-480.webp','assets/people/rico-romijn-480.webp','assets/people/robin-kruikenmeier-480.webp','assets/people/wout-nollen-480.webp'];
const WACHT=4000;
self.addEventListener('install',e=>e.waitUntil(caches.open(VERSIE).then(c=>c.addAll(KERN)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSIE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
if(u.origin===location.origin)return e.respondWith(netwerkEerst(r));
if(/(^|\.)fonts\.(googleapis|gstatic)\.com$|(^|\.)unpkg\.com$/.test(u.hostname))e.respondWith(bewaardEerst(r))});
async function bewaardEerst(r){const h=await caches.match(r);if(h)return h;const res=await fetch(r);if(res.ok){const c=await caches.open(VERSIE);c.put(r,res.clone())}return res}
async function netwerkEerst(r){const c=await caches.open(VERSIE),vers=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res});
const kopie=()=>c.match(r,{ignoreSearch:true}).then(h=>h||(r.mode==='navigate'?c.match('index.html'):undefined));
try{return await Promise.race([vers,new Promise((_,n)=>setTimeout(()=>n(new Error('traag')),WACHT))])}
catch(e){const h=await kopie();if(h)return h;return vers}}
