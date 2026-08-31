// Tab Container Component with Indicator
class MerkatoTabsComponent {
    constructor(tabsContainer) {
        this.container = typeof tabsContainer === 'string' ? document.getElementById(tabsContainer) : tabsContainer;
        if (!this.container) return;
        this.buttons = this.container.querySelectorAll('[data-tab-target]');
        this._init();
    }

    _init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-tab-target');
                this.activate(targetId, btn);
            });
        });
    }

    activate(targetId, activeBtn) {
        this.buttons.forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');

        document.querySelectorAll('[data-tab-content]').forEach(panel => {
            panel.classList.toggle('active', panel.id === targetId);
        });
    }
}
if (typeof window !== 'undefined') window.MerkatoTabs = MerkatoTabsComponent;
