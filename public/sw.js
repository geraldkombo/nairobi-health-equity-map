const CACHE = "ke-health-v7";
const DATA_CACHE = "ke-data-v2";
const BASE = self.location.pathname.replace(/\/sw\.js$/, "");

const APP_ROUTES = [
  BASE + "/",
  BASE + "/brief",
  BASE + "/compare",
  BASE + "/method",
  BASE + "/forum",
  BASE + "/dua",
  BASE + "/sitemap.xml",
  BASE + "/manifest.json",
  BASE + "/icon.svg",
  BASE + "/icons/icon-192x192.png",
  BASE + "/icons/icon-512x512.png",
];

const DATA_ROUTES = [
  BASE + "/data/snapshots/counties.json",
  BASE + "/data/snapshots/county_indicators.json",
  BASE + "/data/snapshots/facilities.json",
];

async function cacheAsset(cache, url) {
  try {
    const res = await fetch(url);
    if (res.ok) cache.put(url, res);
  } catch (e) {}
}

async function cacheAssetsList(cache, urls) {
  for (const url of urls) {
    await cacheAsset(cache, url);
  }
}

async function cachePageAssets(cache) {
  try {
    const res = await fetch(BASE + "/");
    if (!res.ok) return;
    const html = await res.text();
    const assets = [];
    const scriptRe = /<(script|link)[^>]+(src|href)=["']([^"']+)["']/gi;
    let m;
    while ((m = scriptRe.exec(html)) !== null) {
      const url = m[3];
      if (url.startsWith("/_next/") || url.startsWith(BASE + "/_next/")) {
        const full = url.startsWith("/") ? url : "/" + url;
        assets.push(full.startsWith(BASE) ? full : BASE + full);
      }
    }
    for (const url of [...new Set(assets)]) {
      await cacheAsset(cache, url);
    }
  } catch (e) {}
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await cacheAssetsList(cache, APP_ROUTES);
      await cachePageAssets(cache);
    }).then(() => {
      return caches.open(DATA_CACHE).then((dataCache) => {
        return Promise.allSettled(
          DATA_ROUTES.map((url) =>
            fetch(url).then((res) => {
              if (res.ok) dataCache.put(url, res);
            }).catch(() => {})
          )
        );
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE && k !== DATA_CACHE).map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const path = url.pathname;

  if (path.startsWith(BASE + "/data/") || path.includes(".pmtiles")) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          return cached || fetch(event.request).then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          }).catch(() => cached);
        });
      })
    );
    return;
  }

  if (event.request.mode === "navigate") {
    const stripped = new URL(event.request.url);
    stripped.search = "";
    const strippedReq = new Request(stripped.toString(), { headers: event.request.headers });
    event.respondWith(
      caches.open(CACHE).then((cache) => {
        return cache.match(strippedReq).then((cached) => {
          return cached || fetch(event.request).then((response) => {
            if (response.ok) cache.put(strippedReq, response.clone());
            return response;
          }).catch(() => cache.match(BASE + "/"));
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request).then((response) => {
        if (response.ok) {
          caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
        }
        return response;
      });
      return cached || fetched;
    })
  );
});
