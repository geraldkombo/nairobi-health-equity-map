const CACHE = "ke-health-v2";
const STATIC_EXT = /\.(js|css|json|geojson|svg|png|jpg)$/;
const SHELL_PAGES = ["/", "/brief", "/compare", "/method", "/forum", "/dua", "/brief.txt", "/compare.txt", "/method.txt", "/forum.txt", "/dua.txt"];

self.addEventListener("install", (e) => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const path = url.pathname.replace(/\/kenya-health-equity-map/, "") || "/";

  if (STATIC_EXT.test(url.pathname)) {
    e.respondWith(
      caches.open(CACHE).then((cache) =>
        fetch(e.request)
          .then((r) => (cache.put(e.request, r.clone()), r))
          .catch(() => cache.match(e.request))
      )
    );
    return;
  }

  if (SHELL_PAGES.includes(path) || path === "/") {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          const copy = r.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, copy));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).catch(() => caches.match("/")))
  );
});
