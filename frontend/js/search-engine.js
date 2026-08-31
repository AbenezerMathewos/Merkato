// ============================================================================
// MERKATO - Client-Side Fuzzy Search Engine
// ============================================================================

(function(window) {
    'use strict';

    class SearchEngine {
        constructor() {
            this.index = [];
            this.searchHistory = this._loadHistory();
        }

        _loadHistory() {
            try {
                return JSON.parse(localStorage.getItem('merkato_recent_searches') || '[]');
            } catch (e) {
                return [];
            }
        }

        indexProducts(products) {
            this.index = products.map(p => ({
                id: p.id,
                name: p.name || '',
                nameAm: p.nameAm || '',
                category: p.category || p.aisle || '',
                description: p.description || '',
                price: p.price || 0,
                image: p.image || '',
                // Normalized search blob
                searchString: `${p.name} ${p.nameAm} ${p.category} ${p.aisle} ${p.description}`.toLowerCase()
            }));
        }

        search(query, options = {}) {
            const q = (query || '').trim().toLowerCase();
            if (!q) return [];

            this._saveSearchTerm(q);

            const limit = options.limit || 10;
            const category = options.category;

            let results = this.index;

            if (category && category !== 'all') {
                results = results.filter(item => item.category.toLowerCase() === category.toLowerCase());
            }

            // Score matches
            const scored = results.map(item => {
                let score = 0;
                const nameLower = item.name.toLowerCase();

                if (nameLower === q) score += 100;
                else if (nameLower.startsWith(q)) score += 50;
                else if (nameLower.includes(q)) score += 30;
                else if (item.searchString.includes(q)) score += 15;

                return { item, score };
            });

            return scored
                .filter(res => res.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, limit)
                .map(res => res.item);
        }

        _saveSearchTerm(term) {
            if (term.length < 2) return;
            this.searchHistory = this.searchHistory.filter(t => t !== term);
            this.searchHistory.unshift(term);
            if (this.searchHistory.length > 8) this.searchHistory.pop();
            try {
                localStorage.setItem('merkato_recent_searches', JSON.stringify(this.searchHistory));
            } catch (e) {}
        }

        getRecentSearches() {
            return this.searchHistory;
        }

        getTrendingKeywords() {
            return ['Yirgacheffe Buna', 'Electric Mitad', 'Magna Teff', 'Habesha Kemis', 'Berbere Spice', 'Mesob Basket', 'Solar Generator'];
        }
    }

    window.MerkatoSearch = new SearchEngine();

})(window);
