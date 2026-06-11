// LSP D-Planner — Service Worker
// Cache-first strategy for offline use.
// Bump CACHE_VERSION when deploying a new app version to force cache refresh.

const CACHE_VERSION = 'lsp-dplanner-v2.9.1c';
const ASSETS = [
  '/LSP_D-planner/',
  '/LSP_D-planner/index.html'
];

// Install — pre-cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate — delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch — cache-first, fall back to network, then cached index
self.addEventListener('fetch', event => {
  // Only handle GET requests for our own origin
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    // ignoreSearch: true so cache-busted URLs (e.g. index.html?ts=123) still
    // hit the cached entry — important for test harnesses that append timestamps.
    caches.match(event.request, { ignoreSearch: true })
      .then(cached => {
        if (cached) return cached;
        return fetch(event.request)
          .then(response => {
            // Cache successful responses for our scope (store by pathname, no query)
            if (response.ok && url.pathname.startsWith('/LSP_D-planner/')) {
              const clone = response.clone();
              const cacheKey = new Request(url.origin + url.pathname);
              caches.open(CACHE_VERSION).then(cache => cache.put(cacheKey, clone));
            }
            return response;
          })
          .catch(() => caches.match('/LSP_D-planner/index.html', { ignoreSearch: true }));
      })
  );
});
