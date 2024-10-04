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
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache.map(url => new Request(url, {credentials: 'same-origin'})));
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
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
      })
  );
});