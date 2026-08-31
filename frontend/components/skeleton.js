// Shimmer Skeleton Placeholder Component
class MerkatoSkeletonComponent {
    static renderCards(count = 4) {
        return Array.from({ length: count }).map(() => `
            <div class="skeleton-card" aria-hidden="true">
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-tag"></div>
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-title-short"></div>
                <div class="skeleton skeleton-price"></div>
                <div class="skeleton skeleton-btn"></div>
            </div>
        `).join('');
    }
}
if (typeof window !== 'undefined') window.MerkatoSkeleton = MerkatoSkeletonComponent;
