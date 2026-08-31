// Accessible Dropdown Component
class MerkatoDropdownComponent {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.trigger = this.container ? this.container.querySelector('.dropdown-trigger') : null;
        this.menu = this.container ? this.container.querySelector('.dropdown-menu') : null;
        this._init();
    }

    _init() {
        if (!this.trigger || !this.menu) return;
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        document.addEventListener('click', () => this.close());
    }

    toggle() {
        const isOpen = this.menu.classList.contains('show');
        isOpen ? this.close() : this.open();
    }

    open() {
        this.menu.classList.add('show');
        this.trigger.setAttribute('aria-expanded', 'true');
    }

    close() {
        if (this.menu) {
            this.menu.classList.remove('show');
            this.trigger.setAttribute('aria-expanded', 'false');
        }
    }
}
if (typeof window !== 'undefined') window.MerkatoDropdown = MerkatoDropdownComponent;
