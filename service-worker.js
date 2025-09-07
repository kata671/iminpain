/* Boli Help — finalny Service Worker (offline fallback + cache) */
const CACHE_NAME = 'bolihelp-v13';

/* Zasoby do pre-cache — wpisz dokładnie takie ścieżki, jakie masz w repo */
const ASSETS = [
  '/',                   // root (dla GitHub Pages może być redirect, ale zostawiamy)
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/assets/style.css?v=10',
  '/assets/main.js?v=10',
  '/img/placeholder.png',
  '/img/kobieta-model1.png',
  '/img/mezczyzna-model1.png',
  '/img/dziecko-model1.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

/* Instalacja — pre-cache */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* Aktywacja — sprzątanie starych cache */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys
        .filter((k) => k !== CACHE_NAME)
        .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* Strategia:
   - dla nawigacji (HTML): network-first z fallbackiem do cache/offline.html
   - dla reszty (CSS/JS/IMG itp.): cache-first + dogrywanie do cache
*/
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const accept = req.headers.get('accept') || '';

  // 1) Nawigacje / strony HTML
  const isNavigate = req.mode === 'navigate' || accept.includes('text/html');
  if (isNavigate) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // Kopia do cache
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          return res;
        })
        .catch(async () => {
          // Najpierw strona z cache (jeśli mamy), a jak nie — offline.html
          const cached = await caches.match(req);
          return cached || caches.match('/offline.html');
        })
    );
    return;
  }

  // 2) Inne zasoby (CSS/JS/img) — cache-first
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req)
        .then((res) => {
          // tylko GET i 200 — zapisz do cache
          if (req.method === 'GET' && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() => {
          // awaryjnie, np. gdy obrazek nie dociągnie się offline
          if (accept.includes('image/')) return caches.match('/img/placeholder.png');
          return new Response('', { status: 504, statusText: 'Offline' });
        });
    })
  );
});

// Opcjonalnie: natychmiastowe przejęcie po SKIP_WAITING z klienta
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
