/* === Boli Help — Service Worker (offline + cache) ===
   Strategia:
   - HTML: network-first (z fallbackiem do cache/offline)
   - CSS/JS/IMG/ICONS: cache-first (z odświeżaniem w tle)
   - Auto-clean starych cache po aktualizacji
   Uwaga: zaktualizuj VERSION gdy zmienisz zasoby.
*/
const VERSION = 'v12';
const CACHE_NAME = bolihelp-${VERSION};

// Zasoby krytyczne do działania offline
const CORE_ASSETS = [
  '/',                 // root (jeśli hosting serwuje index.html dla '/')
  '/index.html',
  '/gry.html',
  '/szczegoly.html',
  '/kobieta.html',
  '/mezczyzna.html',
  '/dziecko.html',
  '/manifest.json',

  // CSS / JS
  '/assets/style.css?v=10',
  '/assets/main.js?v=10',
  '/assets/games.js?v=4.0',

  // Ikony PWA
  '/icons/icon-192.png',
  '/icons/icon-512.png',

  // Grafiki fallback
  '/img/placeholder.png'
];

// Instalacja: precache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Aktywacja: sprzątanie starych cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('bolihelp-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Helper: czy to żądanie HTML typu „nawigacja”?
function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         (request.method === 'GET' && (request.headers.get('accept') || '').includes('text/html'));
}

// Główna strategia pobierania
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Tylko GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // 1) HTML — network-first z fallbackiem do cache (i na końcu do /index.html)
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          // Zapisz kopię do cache
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
          return res;
        })
        .catch(async () => {
          // Spróbuj z cache
          const cached = await caches.match(request);
          if (cached) return cached;
          // Ostateczny fallback do index.html (działa jak offline page)
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 2) Dla własnych statycznych zasobów (CSS, JS, IMG, IKONY, FONTS) — cache-first (z dogrywaniem)
  if (sameOrigin) {
    // Heurystyka po rozszerzeniach / typach
    const ext = url.pathname.split('.').pop();
    const isStatic = ['css', 'js', 'png', 'jpg', 'jpeg', 'webp', 'svg', 'gif', 'ico', 'woff', 'woff2', 'ttf', 'otf'].includes((ext || '').toLowerCase());

    if (isStatic) {
      event.respondWith(
        caches.match(request).then((cached) => {
          // Od razu zwracamy cache jeśli jest
          const fetchPromise = fetch(request).then((networkRes) => {
            // Odśwież cache
            if (networkRes && networkRes.status === 200) {
              const clone = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkRes;
          }).catch(() => null);

          // Jeśli mamy cache — zwracamy go natychmiast, równolegle odświeżając
          if (cached) return cached;

          // Jeśli nie mamy cache — czekamy na sieć lub fallback
          return fetchPromise.then((net) => {
            if (net) return net;
            // Fallback dla obrazków
            if (['png','jpg','jpeg','webp','gif','svg'].includes((ext || '').toLowerCase())) {
              return caches.match('/img/placeholder.png');
            }
            // Inne: spróbuj ogólnego cache lub nic
            return caches.match(request);
          });
        })
      );
      return;
    }
  }

  // 3) Inne (API / obce źródła) — network-first, a w razie braku sieci: cichy fallback z cache (jeśli kiedykolwiek się zapisało)
  event.respondWith(
    fetch(request).then((res) => {
      // Opcjonalnie: możesz cache'ować niektóre odpowiedzi zewnętrzne:
      // if (res && res.status === 200 && sameOrigin) { ... }
      return res;
    }).catch(() => caches.match(request))
  );
});

// (opcjonalne) Aktualizacja SW „na klik” – odbieranie wiadomości z klienta
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
