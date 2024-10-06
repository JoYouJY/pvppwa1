const CACHE_NAME = 'fa-rpg-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/version.json', // This file should always be revalidated
  '/TemplateData/style.css',
  '/index.js',
  '/reroute.js',
  '/Build/Build.data',
  '/Build/Build.framework.js',
  '/Build/Build.loader.js',
  '/Build/Build.wasm',
  '/TemplateData/android-chrome-192x192.png',
  '/TemplateData/android-chrome-512x512.png',
  '/TemplateData/apple-touch-icon.png',
  '/TemplateData/favicon.ico',
  '/manifest.json',
  '/TemplateData/unity-logo-dark.png',
  '/TemplateData/progress-bar-empty-dark.png',
  '/TemplateData/progress-bar-full-dark.png'
];

// During installation, cache important files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache.map(url => new Request(url, { credentials: 'same-origin' })));
    })
  );
  self.skipWaiting(); // Skip waiting, activate immediately after install
});

// Activate the service worker and remove old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Only keep the current version

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim clients to immediately take control of all open tabs
      return self.clients.claim();
    })
  );
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        // If we have a cached response, check if we should update it
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache); // Update cache
            });
          }
        });
        return response; // Return the cached response
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache); // Cache the new response
          });
        }
        return networkResponse; // Return network response
      });
    })
  );
});

// Listen for messages to skip waiting and immediately activate new service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting(); // Trigger skip waiting when message is received
  }
});
