const CACHE_NAME = 'genge-cache-v21';

// Install - activate immediately
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Activate - delete ALL old caches and take control of all clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - Network first (no-cache) for HTML/CSS/JS, cache for images
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // API requests: don't touch cache
  if (url.includes('/api/')) return;

  // HTML, CSS, JS and Navigation: ALWAYS fetch fresh from server
  if (event.request.mode === 'navigate' || url.includes('.html') || url.includes('.css') || url.includes('.js') || url.endsWith('/')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Images and icons: Cache first with network fallback
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
