/* FormTrack offline service worker – 2026.10.24-1909 */
const CACHE='formtrack-2026.10.24-1909';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const page = r.mode==='navigate' || /\/(index\.html)?$/.test(new URL(r.url).pathname);
  e.respondWith(caches.open(CACHE).then(async c=>{
    if(page){ /* app page: always try the newest version first, fall back to the saved copy offline */
      try{ const res=await fetch(r,{cache:'no-store'}); if(res&&res.ok){ c.put('./index.html',res.clone()); return res; } }catch(err){}
      return (await c.match('./index.html')) || (await c.match(r,{ignoreSearch:true})) || Response.error();
    }
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{ if(res && (res.ok || res.type==='opaque')) c.put(r,res.clone()); return res; }).catch(()=>hit);
    return hit || net;
  }));
});
