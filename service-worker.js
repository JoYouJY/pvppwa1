const BASE_CACHE_NAME = 'fa-rpg-cache-v';
let CURRENT_CACHE_NAME = BASE_CACHE_NAME + '1';
const VERSION_FILE = '/version.json';

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
    fetch(VERSION_FILE)
      .then(response => response.json())
      .then(version => {
        CURRENT_CACHE_NAME = BASE_CACHE_NAME + version.version;
        return caches.open(CURRENT_CACHE_NAME);
      })
      .then(cache => {
        return cache.addAll(urlsToCache.map(url => new Request(url, {credentials: 'same-origin'})));
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith(BASE_CACHE_NAME) && cacheName !== CURRENT_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes(VERSION_FILE)) {
    // Always fetch the version file from the network
    event.respondWith(fetch(event.request));
    return;
  }

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
            caches.open(CURRENT_CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Check for updates
function checkForUpdates() {
  return fetch(VERSION_FILE, { cache: 'no-cache' })
    .then(response => response.json())
    .then(versionData => {
      if (CURRENT_CACHE_NAME !== BASE_CACHE_NAME + versionData.version) {
        return self.registration.update();
      }
    });
}
checkForUpdates();
// Periodically check for updates (e.g., every hour)
setInterval(checkForUpdates, 60 * 60 * 1000);