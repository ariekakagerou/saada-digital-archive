const CACHE_NAME = "saada-pwa-v1";
const STATIC_ASSETS = [
    "/",
    "/offline",
    "/manifest.json",
    "/logo-assaadah.jpg",
    "/file.svg",
    "/globe.svg"
];

// Install: Pre-cache static shell
self.addEventListener("install", (event) => {
    console.log("[PWA SW] Installing Service Worker...");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[PWA SW] Pre-caching app shell");
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                console.warn("[PWA SW] Some static assets failed to pre-cache:", err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
    console.log("[PWA SW] Activating Service Worker...");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("[PWA SW] Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Caching strategies
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignore non-GET requests, chrome extensions, and backend API endpoints
    if (
        request.method !== "GET" ||
        url.protocol.startsWith("chrome-extension") ||
        url.pathname.startsWith("/api/") ||
        url.port === "5000" // Backend API server
    ) {
        return;
    }

    // 1. Navigation requests (HTML Pages) -> Network First with Cache & Offline Fallback
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    console.log("[PWA SW] Network failed, looking up cache for:", request.url);
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Fallback to offline page
                    console.log("[PWA SW] Returning offline page fallback");
                    return caches.match("/offline");
                })
        );
        return;
    }

    // 2. Static Assets (JS, CSS, Images, Fonts) -> Stale-While-Revalidate / Cache First
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Ignore network failure for background revalidation
                });

            return cachedResponse || fetchPromise;
        })
    );
});
