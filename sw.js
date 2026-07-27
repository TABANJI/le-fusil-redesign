const CACHE='lefusil-public-v2',SHELL=['./','./index.html','./offline.html','./css/global.css','./css/design-system.css','./assets/icons/favicon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('lefusil-public-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==location.origin||/\/admin(?:\.html|\/)|\/api\/|\/functions\/|\/rest\/v1\//.test(url.pathname))return;
  if(url.pathname.endsWith('/js/runtime-config.js')){event.respondWith(fetch(event.request,{cache:'no-store'}));return}
  if(event.request.mode==='navigate'){event.respondWith(fetch(event.request).catch(()=>caches.match('./offline.html')));return}
  if(/\.(?:css|js|svg|png|jpe?g|webp|woff2?)$/i.test(url.pathname))event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response})));
});
