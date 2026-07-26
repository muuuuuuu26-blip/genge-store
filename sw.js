const CACHE_NAME = 'genge-cache-v20'; // bump version kila unapobadilisha files

const urlsToCache = [
  '/',
  '/index.html',
  '/pics/12.png',
  '/pics/15.png'
];

// Install - cache msingi tu
self.addEventListener('install', event => {
  self.skipWaiting(); // activate mara moja bila kusubiri
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Activate - futa cache za zamani
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch - Network first kwa HTML, CSS na JS, cache first kwa picha
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // API requests: hata usiguse cache
  if (url.includes('/api/')) return;

  // HTML, CSS na JS: tafuta mtandaoni kwanza (fresh), cache kama backup tu
  if (event.request.mode === 'navigate' || url.endsWith('/') || url.endsWith('.html') || url.endsWith('.css') || url.includes('.js')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Vingine (picha): cache kwanza, mtandao kama backup
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
