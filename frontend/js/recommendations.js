// ============================================================================
// MERKATO - Smart Product Recommendations Engine
// ============================================================================

(function(window) {
    'use strict';

    const HISTORY_KEY = 'merkato_view_history';
    const MAX_HISTORY = 20;

    class RecommendationEngine {
        constructor() {
            this.catalog = [];
            this.history = this._loadHistory();
        }

        setCatalog(products) {
            if (Array.isArray(products)) {
                this.catalog = products;
            }
        }

        _loadHistory() {
            try {
                const stored = localStorage.getItem(HISTORY_KEY);
                return stored ? JSON.parse(stored) : [];
            } catch (e) {
                return [];
            }
        }

        recordView(productId, category) {
            this.history = this.history.filter(item => item.id !== productId);
            this.history.unshift({ id: productId, category: category, timestamp: Date.now() });
            if (this.history.length > MAX_HISTORY) {
                this.history = this.history.slice(0, MAX_HISTORY);
            }
            try {
                localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
            } catch (e) {}
        }

        getFrequentlyBoughtTogether(currentProductId) {
            // Rules for complementary Ethiopian products
            const complementMap = {
                'buna': ['mitad', 'berbere', 'teff'],
                'teff': ['mitad', 'berbere', 'buna'],
                'mitad': ['teff', 'buna', 'mesob'],
                'kemis': ['mesob', 'buna'],
                'berbere': ['teff', 'buna']
            };

            const suggestedIds = complementMap[currentProductId] || ['buna', 'teff', 'mitad'];
            return this.catalog.filter(p => suggestedIds.includes(p.id) && p.id !== currentProductId);
        }

        getCategoryRecommendations(category, excludeId = null, limit = 4) {
            return this.catalog
                .filter(p => (p.category === category || p.aisle === category) && p.id !== excludeId)
                .slice(0, limit);
        }

        getPersonalizedFeed(limit = 6) {
            if (this.history.length === 0) {
                // Fallback: return top popular items
                return this.catalog.slice(0, limit);
            }

            // Calculate category affinity weights
            const categoryScores = {};
            this.history.forEach((item, index) => {
                const recencyWeight = Math.max(1, 10 - index);
                categoryScores[item.category] = (categoryScores[item.category] || 0) + recencyWeight;
            });

            const topCategory = Object.keys(categoryScores).sort((a, b) => categoryScores[b] - categoryScores[a])[0];
            const viewedIds = new Set(this.history.map(h => h.id));

            // Return items matching preferred category that haven't been viewed recently
            const preferred = this.catalog.filter(p => (p.category === topCategory || p.aisle === topCategory) && !viewedIds.has(p.id));
            const others = this.catalog.filter(p => !preferred.includes(p) && !viewedIds.has(p.id));

            return [...preferred, ...others].slice(0, limit);
        }
    }

    window.MerkatoRecommendations = new RecommendationEngine();

})(window);
