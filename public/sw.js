const CACHE = "ke-health-v1";
const STATIC_EXT = /\.(js|css|json|geojson|svg|png|jpg)$/;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (!STATIC_EXT.test(url.pathname)) return;
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      fetch(e.request)
        .then((r) => (cache.put(e.request, r.clone()), r))
        .catch(() => cache.match(e.request))
    )
  );
});
