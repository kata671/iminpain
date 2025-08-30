const CACHE_NAME = 'bolihelp-v1';
const ASSETS = [
  './',
  './index.html',
  './kobieta.html',
  './mezczyzna.html',
  './dziecko.html',
  './szczegoly.html',
  './assets/style.css',
  './assets/main.js',
  './img/placeholder.png',
  './manifest.json'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME && caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res=>{
      return res || fetch(req).then(networkRes=>{
        if(req.method==='GET' && networkRes.status===200){
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then(c=>c.put(req, clone));
        }
        return networkRes;
      }).catch(()=>caches.match('./index.html'));
    })
  );
});
