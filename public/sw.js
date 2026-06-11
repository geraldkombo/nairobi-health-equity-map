const CACHE = "khem-v3";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isMapTile = url.hostname.includes("tile") || url.hostname.includes("cartocdn") || url.hostname.includes("openstreetmap");
  if (isMapTile) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request);
      if (cached) return cached;
      try {
        const fetched = await fetch(e.request);
        if (url.origin === self.location.origin) cache.put(e.request, fetched.clone());
        return fetched;
      } catch {
        return new Response("Offline", { status: 408 });
      }
    })
  );
});
