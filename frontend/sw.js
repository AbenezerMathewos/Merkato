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
    // Cache-first strategy for static assets
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // Offline fallback for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match('/offline.html');
                    }
                });
            })
    );
});

// Update service worker & clean up old caches
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
        }).then(() => self.clients.claim())
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