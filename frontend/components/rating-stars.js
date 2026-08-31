// Interactive Rating Stars Component
class MerkatoRatingComponent {
    constructor(elementId, initialRating = 5, onRate = null) {
        this.el = document.getElementById(elementId);
        this.rating = initialRating;
        this.onRate = onRate;
        this.render();
    }

    render() {
        if (!this.el) return;
        this.el.innerHTML = '';
        this.el.className = 'interactive-rating-stars';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.textContent = i <= this.rating ? '★' : '☆';
            star.style.cursor = 'pointer';
            star.style.fontSize = '22px';
            star.style.color = '#d4af37';
            star.style.transition = 'transform 0.15s ease';

            star.addEventListener('mouseenter', () => this._preview(i));
            star.addEventListener('mouseleave', () => this._preview(this.rating));
            star.addEventListener('click', () => {
                this.rating = i;
                this.render();
                if (typeof this.onRate === 'function') this.onRate(i);
            });

            this.el.appendChild(star);
        }
    }

    _preview(val) {
        const stars = this.el.querySelectorAll('span');
        stars.forEach((s, idx) => {
            s.textContent = (idx + 1) <= val ? '★' : '☆';
            s.style.transform = (idx + 1) === val ? 'scale(1.2)' : 'scale(1)';
        });
    }
}
if (typeof window !== 'undefined') window.MerkatoRating = MerkatoRatingComponent;
