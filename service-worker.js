// service-worker.js
const CACHE_NAME = 'bolihelp-v11'; // <- podbijaj wersję, gdy coś zmienisz
const ASSETS = [
  './',
  './index.html',
  './offline.html',
  './assets/style.css?v=10',
  './assets/main.js?v=10',
  './assets/games.js?v=4.0',
  './img/placeholder.png',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// HTML = network-first + fallback do offline.html
// reszta (CSS/JS/img) = cache-first
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  e.respondWith((async () => {
    try {
      if (isHTML) {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      }
      const cached = await caches.match(req);
      return cached || fetch(req);
    } catch {
      if (isHTML) return caches.match('./offline.html');
      return caches.match('./index.html');
    }
  })());
});
