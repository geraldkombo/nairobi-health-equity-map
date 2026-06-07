const CACHE = "ke-health-v4";
const TILE_CACHE = "ke-tiles-v1";
const BASE = self.location.pathname.replace(/\/sw\.js$/, "");

const SHELL = [
  BASE + "/",
  BASE + "/brief/",
  BASE + "/compare/",
  BASE + "/method/",
  BASE + "/forum/",
  BASE + "/dua/",
  BASE + "/brief.txt",
  BASE + "/compare.txt",
  BASE + "/method.txt",
  BASE + "/forum.txt",
  BASE + "/dua.txt",
];

const TILE_ORIGINS = ["https://basemaps.cartocdn.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(SHELL).catch(() => self.skipWaiting())
    )
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k !== TILE_CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  if (TILE_ORIGINS.some((o) => url.origin === o)) {
    e.respondWith(
      caches.open(TILE_CACHE).then((cache) =>
        cache.match(e.request).then((cached) => {
          const fetched = fetch(e.request)
            .then((r) => {
              cache.put(e.request, r.clone());
              return r;
            })
            .catch(() => cached);
          return cached || fetched;
        })
      )
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request)
        .then((r) => {
          caches.open(CACHE).then((cache) => cache.put(e.request, r.clone()));
          return r;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
