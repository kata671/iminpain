/* Boli Help – Service Worker (offline fallback) */
const CACHE_NAME = 'bolihelp-v13';

const ASSETS = [
  '/',                // root
  '/index.html',
  '/offline.html',
  '/quizy.html',
  '/manifest.json',
  '/assets/style.css?v=10',
  '/assets/main.js?v=10',
  '/assets/quiz.js?v=1',
  '/img/placeholder.png',
  '/img/kobieta-model1.png',
  '/img/mezczyzna-model1.png',
  '/img/dziecko-model1.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

/* install – pre-cache */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* activate – cleanup */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* fetch */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const accept = req.headers.get('accept') || '';

  // Nawigacje (HTML) – network-first z fallbackiem do cache/offline.html
  const isNavigate = req.mode === 'navigate' || accept.includes('text/html');
  if (isNavigate) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, clone));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || caches.match('/offline.html');
        })
    );
    return;
  }

  // Inne zasoby (CSS/JS/IMG) – cache-first z dogrywką
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          if (req.method === 'GET' && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, clone));
          }
          return res;
        })
        .catch(() => {
          if (accept.includes('image/')) return caches.match('/img/placeholder.png');
          return new Response('', { status: 504, statusText: 'Offline' });
        });
    })
  );
});
