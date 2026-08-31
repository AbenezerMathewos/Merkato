// ============================================================================
// MERKATO - Privacy-Friendly E-Commerce Analytics Engine
// Tracks: pageviews, impressions, add_to_cart, purchases, searches
// ============================================================================

(function(window) {
    'use strict';

    const STORAGE_KEY = 'merkato_analytics_events';
    const SESSION_KEY = 'merkato_session_id';
    const MAX_STORED_EVENTS = 200;

    class AnalyticsEngine {
        constructor() {
            this.sessionId = this._getOrCreateSessionId();
            this.queue = this._loadStoredQueue();
            this.isFlushing = false;
            this._initAutoFlush();
        }

        _getOrCreateSessionId() {
            let sid = sessionStorage.getItem(SESSION_KEY);
            if (!sid) {
                sid = 'mk_sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
                sessionStorage.setItem(SESSION_KEY, sid);
            }
            return sid;
        }

        _loadStoredQueue() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                return stored ? JSON.parse(stored) : [];
            } catch (e) {
                return [];
            }
        }

        _persistQueue() {
            try {
                if (this.queue.length > MAX_STORED_EVENTS) {
                    this.queue = this.queue.slice(-MAX_STORED_EVENTS);
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
            } catch (e) {
                console.warn('[Analytics] Failed to save queue:', e);
            }
        }

        track(eventName, eventParams = {}) {
            const event = {
                id: 'evt_' + Math.random().toString(36).substring(2, 9),
                name: eventName,
                params: eventParams,
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                url: window.location.pathname + window.location.search,
                referrer: document.referrer || null,
                device: {
                    screen: `${window.innerWidth}x${window.innerHeight}`,
                    userAgent: navigator.userAgent
                }
            };

            this.queue.push(event);
            this._persistQueue();
            
            // Console preview in development
            if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
                console.log(`[📊 Analytics: ${eventName}]`, eventParams);
            }
        }

        // Convenience event trackers
        trackPageView(pageName) {
            this.track('page_view', { page_title: document.title, page_name: pageName });
        }

        trackProductView(productId, productName, price, category) {
            this.track('view_item', { item_id: productId, item_name: productName, price, category });
        }

        trackAddToCart(productId, productName, price, quantity = 1) {
            this.track('add_to_cart', { item_id: productId, item_name: productName, price, quantity, value: price * quantity });
        }

        trackSearch(query, resultCount) {
            this.track('search', { search_term: query, result_count: resultCount });
        }

        trackBeginCheckout(items, totalValue) {
            this.track('begin_checkout', { items_count: items.length, total_value: totalValue });
        }

        trackPurchase(orderId, totalValue, paymentMethod, items) {
            this.track('purchase', { transaction_id: orderId, value: totalValue, payment_type: paymentMethod, items_count: items.length });
        }

        _initAutoFlush() {
            window.addEventListener('beforeunload', () => {
                this._persistQueue();
            });
        }
    }

    window.MerkatoAnalytics = new AnalyticsEngine();

    // Auto track current page view
    document.addEventListener('DOMContentLoaded', () => {
        window.MerkatoAnalytics.trackPageView(window.location.pathname);
    });

})(window);
