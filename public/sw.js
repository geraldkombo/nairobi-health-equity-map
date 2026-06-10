const CACHE = "ke-health-v5";
const SHELL_ROUTES = [
  "/", 
  "/brief/", 
  "/compare/", 
  "/method/", 
  "/forum/", 
  "/dua/", 
  "/_not-found"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL_ROUTES))
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  // Network-first strategy for data, Cache-first for shell and tiles
  if (event.request.url.includes('/data/snapshots/') || event.request.url.includes('.pmtiles')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((response) => {
          return caches.open(CACHE).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      }).catch(() => caches.match('/_not-found'))
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
