/* closed link: remove this site's offline copy and stop */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>{ e.waitUntil((async()=>{ const base=new URL(self.registration.scope).pathname;
  for(const k of await caches.keys()){ if(!/^formtrack-/.test(k)) continue; const c=await caches.open(k); for(const q of await c.keys()){ if(new URL(q.url).pathname.startsWith(base)) await c.delete(q); } }
  await self.registration.unregister(); const cl=await self.clients.matchAll(); cl.forEach(c=>c.navigate(c.url)); })()); });
