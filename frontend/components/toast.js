// Accessible Toast Notification Component
class MerkatoToastComponent {
    static show(message, type = 'success', duration = 4000) {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.style.setProperty('--duration', `${duration}ms`);
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || '🔔'}</span>
            <div class="toast-body">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close">✕</button>
            <div class="toast-progress"></div>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('toast-hiding');
                setTimeout(() => toast.remove(), 320);
            }
        }, duration);
    }
}
if (typeof window !== 'undefined') window.MerkatoToast = MerkatoToastComponent;
