const CACHE_NAME = 'fa-rpg-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
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

self.addEventListener('install', (event) => {
  event.waitUntil(
<<<<<<< HEAD
    fetch(VERSION_FILE, { cache: 'no-cache' })
      .then(response => response.json())
      .then(version => {
        CURRENT_CACHE_NAME = BASE_CACHE_NAME + version.version;
        return caches.open(CURRENT_CACHE_NAME);
      })
      .then(cache => {
=======
    caches.open(CACHE_NAME)
      .then((cache) => {
>>>>>>> parent of 0e4cb56 (add version checking for update pwa)
        return cache.addAll(urlsToCache.map(url => new Request(url, {credentials: 'same-origin'})));
      })
      .then(() => self.skipWaiting())
  );
});

<<<<<<< HEAD
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all([
        cacheNames.map(cacheName => {
          if (cacheName.startsWith(BASE_CACHE_NAME) && cacheName !== CURRENT_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
        self.clients.claim()
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes(VERSION_FILE)) {
    event.respondWith(fetch(event.request));
    return;
  }

=======
self.addEventListener('fetch', (event) => {
>>>>>>> parent of 0e4cb56 (add version checking for update pwa)
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        if (networkResponse.ok) {
          const clonedResponse = networkResponse.clone();
          caches.open(CURRENT_CACHE_NAME).then(cache => {
            cache.put(event.request, clonedResponse);
          });
          return networkResponse;
        }
<<<<<<< HEAD
        throw new Error('Network response was not ok.');
=======
        return fetch(event.request).then(
          (response) => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
>>>>>>> parent of 0e4cb56 (add version checking for update pwa)
      })
      .catch(() => caches.match(event.request))
  );
<<<<<<< HEAD
});

self.addEventListener('message', (event) => {
  if (event.data === 'checkForUpdates') {
    checkForUpdates();
  }
});

function checkForUpdates() {
  return fetch(VERSION_FILE, { cache: 'no-cache' })
    .then(response => response.json())
    .then(versionData => {
      const newCacheName = BASE_CACHE_NAME + versionData.version;
      if (CURRENT_CACHE_NAME !== newCacheName) {
        CURRENT_CACHE_NAME = newCacheName;
        return self.registration.update();
      }
    });
}
=======
});
>>>>>>> parent of 0e4cb56 (add version checking for update pwa)
