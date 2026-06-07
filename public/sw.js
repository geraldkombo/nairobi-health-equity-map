const CACHE = "ke-health-v3";
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
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
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
