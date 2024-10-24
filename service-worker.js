const CACHE_NAME = 'fa-rpg-cache-v1';
const urlsToCache = [
  '/Build/Build.data',
  '/Build/Build.framework.js',
  '/Build/Build.loader.js',
  '/Build/Build.wasm'
];

// Helper function to check if request is cacheable
function isCacheableRequest(request) {
  // Only cache GET requests
  if (request.method !== 'GET') return false;

  // Check if the URL is one we want to cache
  const url = new URL(request.url);
  
  // Don't cache data: URLs, chrome-extension: URLs, etc.
  if (!['http:', 'https:'].includes(url.protocol)) return false;

  return true;
}

// Helper function to safely cache a response
async function safeCachePut(cache, request, response) {
  try {
    if (!isCacheableRequest(request)) return;
    
    // Check if the response is valid for caching
    if (!response || response.status !== 200 || response.type === 'error') {
      return;
    }

    // Clone the response before caching
    const responseToCache = response.clone();
    await cache.put(request, responseToCache);
  } catch (error) {
    console.error('Cache put error:', error);
    // Continue without caching if there's an error
  }
}

// During installation, cache important files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        const cachePromises = urlsToCache.map(url => {
          const request = new Request(url, { credentials: 'same-origin' });
          return fetch(request)
            .then(response => {
              if (!response || response.status !== 200) {
                throw new Error(`Failed to fetch ${url}`);
              }
              return safeCachePut(cache, request, response);
            })
            .catch(error => {
              console.error(`Failed to cache ${url}:`, error);
            });
        });
        return Promise.all(cachePromises);
      })
  );
  self.skipWaiting();
});

// Activate the service worker and remove old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(async (cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          // Try to update cache in background if it's a cacheable request
          if (isCacheableRequest(event.request)) {
            fetch(event.request)
              .then(async (networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                  const cache = await caches.open(CACHE_NAME);
                  await safeCachePut(cache, event.request, networkResponse);
                }
              })
              .catch(error => {
                console.error('Background fetch failed:', error);
              });
          }
          return cachedResponse;
        }

        // If no cache, try network
        return fetch(event.request)
          .then(async (networkResponse) => {
            // Clone the response before using it
            const responseToCache = networkResponse.clone();

            // Cache the fetched response asynchronously
            if (isCacheableRequest(event.request)) {
              const cache = await caches.open(CACHE_NAME);
              await safeCachePut(cache, event.request, responseToCache);
            }

            return networkResponse;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            throw error;
          });
      })
  );
});

// Listen for messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});