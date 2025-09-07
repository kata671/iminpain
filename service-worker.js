const CACHE_NAME = 'bolihelp-v10';
const ASSETS = [
  './',
  './index.html',
  './kobieta.html',
  './mezczyzna.html',
  './dziecko.html',
  './szczegoly.html',
  './assets/style.css?v=10',
  './assets/main.js?v=10',
  './assets/games.js?v=4.0',
  './img/placeholder.png',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalacja: pre-cache
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Aktywacja: cleanup starych cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first dla nawigacji (HTML), cache-first dla reszty
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const accept = req.headers.get('accept') || '';
  const isHTML = req.mode === 'navigate' || accept.includes('text/html');

  if (isHTML) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match('./index.html'))
        )
    );
  } else {
    e.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req)
          .then((res) => {
            // tylko GET + 200 do cache
            if (req.method === 'GET' && res.status === 200) {
              const copy = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => undefined);
      })
    );
  }
});
