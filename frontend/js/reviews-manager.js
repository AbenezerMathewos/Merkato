// ============================================================================
// MERKATO - Customer Reviews & Ratings Manager
// ============================================================================

(function(window) {
    'use strict';

    const REVIEWS_STORAGE_KEY = 'merkato_user_reviews';

    const INITIAL_SAMPLE_REVIEWS = [
        {
            id: 'rev_1',
            productId: 'buna',
            author: 'Almaz Tadesse',
            city: 'Addis Ababa',
            rating: 5,
            title: 'Unbelievable aroma and freshness!',
            comment: 'This Yirgacheffe roast is the freshest coffee I have tasted in years. Shipped within 3 hours in Bole.',
            date: '2026-08-15',
            verified: true,
            helpfulCount: 24
        },
        {
            id: 'rev_2',
            productId: 'mitad',
            author: 'Dawit Mengistu',
            city: 'Hawassa',
            rating: 5,
            title: 'Bakes perfect injera every time',
            comment: 'The digital temperature control maintains the heat without burning the eyes of the injera. Very energy efficient.',
            date: '2026-08-20',
            verified: true,
            helpfulCount: 19
        },
        {
            id: 'rev_3',
            productId: 'kemis',
            author: 'Sara Haile',
            city: 'Dire Dawa',
            rating: 4,
            title: 'Magnificent embroidery',
            comment: 'The craftsmanship on the tilet border is museum-quality. Sizing was exact according to the chart.',
            date: '2026-08-22',
            verified: true,
            helpfulCount: 15
        }
    ];

    class ReviewsManager {
        constructor() {
            this.reviews = this._loadReviews();
        }

        _loadReviews() {
            try {
                const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
                return stored ? JSON.parse(stored) : INITIAL_SAMPLE_REVIEWS;
            } catch (e) {
                return INITIAL_SAMPLE_REVIEWS;
            }
        }

        _saveReviews() {
            try {
                localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(this.reviews));
            } catch (e) {}
        }

        getProductReviews(productId) {
            return this.reviews.filter(r => r.productId === productId || productId === 'all');
        }

        getProductRatingSummary(productId) {
            const list = this.getProductReviews(productId);
            if (list.length === 0) {
                return { average: 5.0, count: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
            }

            const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            let total = 0;

            list.forEach(r => {
                const star = Math.min(5, Math.max(1, Math.round(r.rating)));
                breakdown[star] = (breakdown[star] || 0) + 1;
                total += r.rating;
            });

            return {
                average: (total / list.length).toFixed(1),
                count: list.length,
                breakdown
            };
        }

        addReview(reviewData) {
            const newRev = {
                id: 'rev_' + Date.now(),
                productId: reviewData.productId,
                author: reviewData.author || 'Anonymous Shopper',
                city: reviewData.city || 'Addis Ababa',
                rating: parseInt(reviewData.rating, 10) || 5,
                title: reviewData.title || '',
                comment: reviewData.comment || '',
                date: new Date().toISOString().split('T')[0],
                verified: true,
                helpfulCount: 0
            };

            this.reviews.unshift(newRev);
            this._saveReviews();
            return newRev;
        }

        voteHelpful(reviewId) {
            const rev = this.reviews.find(r => r.id === reviewId);
            if (rev) {
                rev.helpfulCount = (rev.helpfulCount || 0) + 1;
                this._saveReviews();
                return rev.helpfulCount;
            }
            return 0;
        }
    }

    window.MerkatoReviews = new ReviewsManager();

})(window);
