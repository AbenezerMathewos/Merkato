// ============================================================================
// MERKATO - PWA Install Prompt & Network Status Monitor
// ============================================================================

(function(window) {
    'use strict';

    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPromotion();
    });

    function showInstallPromotion() {
        const existingBanner = document.getElementById('pwaInstallBanner');
        if (existingBanner) return;

        const banner = document.createElement('div');
        banner.id = 'pwaInstallBanner';
        banner.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            max-width: 420px;
            margin: 0 auto;
            background: #1a1a2e;
            color: #fff;
            padding: 16px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            border: 1px solid #ffd700;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            z-index: 10000;
            font-family: inherit;
            animation: slideUp 0.4s ease;
        `;

        banner.innerHTML = `
            <div style="display:flex;align-items:center;gap:12px;">
                <span style="font-size:28px;">📱</span>
                <div>
                    <strong style="color:#ffd700;display:block;font-size:14px;">Install MERKATO App</strong>
                    <span style="font-size:12px;color:rgba(255,255,255,0.8);">Shop faster offline & get order alerts</span>
                </div>
            </div>
            <div style="display:flex;gap:8px;">
                <button id="pwaInstallBtn" style="background:#0a5c36;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:bold;cursor:pointer;font-size:13px;">Install</button>
                <button id="pwaDismissBtn" style="background:transparent;color:rgba(255,255,255,0.6);border:none;cursor:pointer;font-size:16px;">✕</button>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('pwaInstallBtn').addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('[PWA] User accepted install');
                }
                deferredPrompt = null;
            }
            banner.remove();
        });

        document.getElementById('pwaDismissBtn').addEventListener('click', () => {
            banner.remove();
        });
    }

    // Network status listener
    window.addEventListener('offline', () => {
        if (window.mktoast) {
            window.mktoast('⚠️ You are currently offline. You can still browse cached items!', 'warning', 5000);
        }
    });

    window.addEventListener('online', () => {
        if (window.mktoast) {
            window.mktoast('🟢 You are back online!', 'success', 3000);
        }
    });

})(window);
