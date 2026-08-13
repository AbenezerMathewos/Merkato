// ========================================
// MERKATO - Service Worker
// ========================================

const CACHE_NAME = 'merkato-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/shop.html',
    '/product-detail.html',
    '/cart.html',
    '/checkout.html',
    '/login.html',
    '/admin.html',
    '/orders.html',
    '/wishlist.html',
    '/about.html',
    '/contact.html',
    '/faq.html',
    '/returns.html',
    '/profile.html',
    '/order-confirmation.html',
    '/style.css',
    '/script.js',
    '/manifest.json'
];

// Install service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // Cache each file individually so one failed fetch
                // (e.g. a missing file, or a dev-server quirk) doesn't
                // abort the whole install with an uncaught rejection.
                return Promise.all(
                    urlsToCache.map(url =>
                        cache.add(url).catch(error => {
                            console.warn('Could not cache', url, error);
                        })
                    )
                );
            })
    );
});

// Fetch from cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Update service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});