// Accessible Accordion Component
class MerkatoAccordionComponent {
    constructor(accordionContainer) {
        this.container = typeof accordionContainer === 'string' ? document.getElementById(accordionContainer) : accordionContainer;
        if (!this.container) return;
        this.items = this.container.querySelectorAll('.accordion-item');
        this._init();
    }

    _init() {
        this.items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            if (!header || !content) return;

            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                item.classList.toggle('active', !isOpen);
                header.setAttribute('aria-expanded', !isOpen);
            });
        });
    }
}
if (typeof window !== 'undefined') window.MerkatoAccordion = MerkatoAccordionComponent;
