const CACHE_NAME = "ke-health-rescue-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      return self.registration.unregister();
    }).then(() => {
      return self.clients.claim().then(() => {
        self.clients.matchAll({ type: "window" }).then((clients) => {
          clients.forEach((client) => {
            client.navigate(client.url);
          });
        });
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
