// service-worker.js

// Define cache names
const staticCacheName = 'fitness-app-static-v1';
const dynamicCacheName = 'fitness-app-dynamic-v1';

// Assets to cache statically (e.g., icons, stylesheets, scripts)
const staticAssets = [
    '/',
    '/index.html',
    'src/css/styles.css',
    'src/js/app.js',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png',
    // Add other static assets here
];

// Install event: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCacheName)
            .then((cache) => {
                return cache.addAll(staticAssets);
            })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => {
                return Promise.all(keys
                    .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
                    .map((key) => caches.delete(key))
                );
            })
    );
});

// Fetch event: Serve from cache or fetch from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                return cachedResponse || fetch(event.request)
                    .then((networkResponse) => {
                        return caches.open(dynamicCacheName)
                            .then((cache) => {
                                cache.put(event.request, networkResponse.clone());
                                return networkResponse;
                            });
                    });
            })
            .catch(() => {
                // Handle offline scenarios (e.g., show a custom offline page)
                // You can customize this behavior based on your app's requirements
                // For now, let's return a simple offline message
                return new Response('Offline. Please check your connection.');
            })
    );
});
