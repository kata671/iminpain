const CACHE_NAME = 'bolihelp-v11';
const ASSETS = [
  './',
  './index.html',
  './kobieta.html',
  './mezczyzna.html',
  './dziecko.html',
  './szczegoly.html',
  './offline.html',             // <-- nowość
  './assets/style.css?v=10',
  './assets/main.js?v=10',
  './assets/a2hs.js?v=1',       // <-- nowość (jeśli dodałaś)
  './img/placeholder.png',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Instalacja: cache podstawowych zasobów
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

// Aktywacja: czyszczenie starych cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Strategia: network-first dla HTML, fallback do offline.html
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const accept = req.headers.get('accept') || '';
  const isHTML = req.mode === 'navigate' || accept.includes('text/html');

  if (isHTML) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match('./offline.html'))
        )
    );
  } else {
    e.respondWith(
      caches.match(req).then((r) => {
        return (
          r ||
          fetch(req)
            .then((res) => {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(req, clone));
              return res;
            })
            .catch(() => caches.match('./img/placeholder.png'))
        );
      })
    );
  }
});
