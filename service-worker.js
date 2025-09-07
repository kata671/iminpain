/* Boli Help — service worker (offline + auto-update) */
const VER = 'v2025-09-07';
const CACHE_STATIC = bh-static-${VER};
const STATIC_ASSETS = [
  '/',                        // tylko jeśli serwujesz index pod /
  '/index.html',
  '/kobieta.html',
  '/mezczyzna.html',
  '/dziecko.html',
  '/szczegoly.html',
  '/assets/style.css?v=10',
  '/assets/main.js?v=10',
  '/assets/games.js?v=4.0',
  '/img/placeholder.png',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// — instalacja: cache podstawowych plików
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_STATIC).then((c) => c.addAll(STATIC_ASSETS)));
  self.skipWaiting(); // od razu przejdź do activate
});

// — aktywacja: usuń stare cache + włącz navigation preload
self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE_STATIC).map(k => caches.delete(k)));
      if (self.registration.navigationPreload) {
        try { await self.registration.navigationPreload.enable(); } catch {}
      }
      await self.clients.claim();
    })()
  );
});

// — fetch:
//   • HTML: network-first (z offline fallback do index.html)
//   • reszta: stale-while-revalidate
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const accept = req.headers.get('accept') || '';
  const isHTML = req.mode === 'navigate' || accept.includes('text/html');

  if (isHTML) {
    e.respondWith((async () => {
      try {
        const preload = await e.preloadResponse;
        if (preload) return preload;
        const net = await fetch(req);
        const copy = net.clone();
        caches.open(CACHE_STATIC).then(c => c.put(req, copy));
        return net;
      } catch {
        return (await caches.match(req)) || (await caches.match('/index.html'));
      }
    })());
    return;
  }

  // inne typy: SWR
  e.respondWith((async () => {
    const cached = await caches.match(req);
    const fetchAndPut = fetch(req).then(res => {
      if (req.method === 'GET' && res && res.status === 200) {
        const clone = res.clone();
        caches.open(CACHE_STATIC).then(c => c.put(req, clone));
      }
      return res;
    }).catch(() => cached); // w offline zostań przy cache
    return cached || fetchAndPut;
  })());
});

// — wiadomość z appki: SKIP_WAITING = natychmiastowa aktualizacja SW
self.addEventListener('message', (e) => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
