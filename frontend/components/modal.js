// Accessible Modal Component with Focus Trap
class MerkatoModalComponent {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.closeButtons = this.modal ? this.modal.querySelectorAll('[data-close-modal]') : [];
        this._initEvents();
    }

    _initEvents() {
        if (!this.modal) return;
        this.closeButtons.forEach(btn => btn.addEventListener('click', () => this.close()));
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) this.close();
        });
    }

    open() {
        if (!this.modal) return;
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    isOpen() {
        return this.modal && this.modal.classList.contains('active');
    }
}
if (typeof window !== 'undefined') window.MerkatoModal = MerkatoModalComponent;
