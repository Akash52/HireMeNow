// This is a fallback service worker.
// The actual service worker is generated by the Vite PWA plugin.
// This file is used as a fallback in case the plugin-generated one fails.

const CACHE_NAME = 'hiremenow-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/tailwind.css',
  '/src/main.js',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first strategy with fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // For HTML files - network first, then cache
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If response is valid, clone and cache it
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // If fetch fails, try to get it from the cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For non-HTML resources - try cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return the cached response while also fetching from network to update cache
          const fetchPromise = fetch(event.request)
            .then(response => {
              // If response is valid, clone and update cache
              if (response && response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then(cache => cache.put(event.request, responseClone));
              }
              return response;
            })
            .catch(() => {
              console.log('Fetch failed; returning cached response instead.');
            });
            
          // Return the cached response immediately
          return cachedResponse;
        }
        
        // If no cached response, fetch from network
        return fetch(event.request)
          .then(response => {
            // If response is valid, clone and cache it
            if (response && response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
            }
            return response;
          });
      })
  );
});

// Handle offline messaging and custom offline page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
