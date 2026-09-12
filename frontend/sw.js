// ========================================
// MERKATO - Service Worker v3
// ========================================

const CACHE_VERSION = 'v3';
const STATIC_CACHE  = `merkato-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `merkato-dynamic-${CACHE_VERSION}`;
const API_CACHE     = `merkato-api-${CACHE_VERSION}`;

const STATIC_FILES = [
    '/', '/index.html', '/shop.html', '/product-detail.html',
    '/cart.html', '/checkout.html', '/login.html', '/admin.html',
    '/orders.html', '/wishlist.html', '/about.html', '/contact.html',
    '/faq.html', '/returns.html', '/profile.html', '/order-confirmation.html',
    '/artisans.html', '/404.html', '/style.css', '/script.js', '/api.js', '/manifest.json',
];

const API_ORIGIN  = 'https://merkato-backend.onrender.com';
const OFFLINE_PAGE = '/404.html';

// ─── INSTALL: pre-cache static assets ────────────────────────────
self.addEventListener('install', event => {
    console.log(`[SW] Installing ${STATIC_CACHE}`);
    self.skipWaiting();
    event.waitUntil(
        caches.open(STATIC_CACHE).then(cache => {
            return cache.addAll(STATIC_FILES).catch(err => {
                console.warn('[SW] Pre-cache warning (some assets may be dynamic):', err);
            });
        })
    );
});

// ─── ACTIVATE: clean up obsolete caches ──────────────────────────
self.addEventListener('activate', event => {
    const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log(`[SW] Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// ─── FETCH: cache-first with network fallback & offline support ───
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;

    // Do not intercept external API calls to Render or third parties
    if (event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseClone = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/404.html');
                }
            });
        })
    );
});

// Background sync stub
self.addEventListener('sync', event => {
    if (event.tag === 'sync-orders') {
        console.log('[Service Worker] Syncing offline orders...');
        // event.waitUntil(syncOrdersFunction());
    }
});

// Push notification stub
self.addEventListener('push', event => {
    console.log('[Service Worker] Push Received.');
    const title = 'Merkato Update';
    const options = {
        body: event.data ? event.data.text() : 'New notification from Merkato',
        icon: 'images/icon-192x192.png',
        badge: 'images/icon-72x72.png'
    };
    event.waitUntil(self.registration.showNotification(title, options));
});