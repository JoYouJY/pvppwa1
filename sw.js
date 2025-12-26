const CACHE_NAME = 'farpg-cache-v1';

// List of files to cache immediately
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/game.html',
    '/TemplateData/style.css',
    '/TemplateData/favicon.ico',
    // Add your critical UI assets here
];

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force activation
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            // Clean up old caches that don't match our name
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== CACHE_NAME) {
                            return caches.delete(cache);
                        }
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // STRATEGY 1: CACHE FIRST (For Game Data & Assets)
    // If the request is for the 'Build' folder or media, use Cache. 
    // If not in cache, go to network.
    if (requestUrl.pathname.includes('/Build/') || 
        requestUrl.pathname.includes('/TemplateData/') ||
        requestUrl.pathname.endsWith('.mp4')) {
        
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse; // Return cached file (Instant load)
                }
                return fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return; 
    }

    // STRATEGY 2: NETWORK FIRST (For HTML, JSON, and Version Check)
    // Always try to get the fresh version from server. If offline, use cache.
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});