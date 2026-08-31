// ============================================================================
// MERKATO - Multi-Currency Engine
// Supports: ETB, USD, EUR, GBP, AED, SAR, KES, CAD
// ============================================================================

(function(window) {
    'use strict';

    const STORAGE_KEY = 'merkato_selected_currency';
    const RATES_CACHE_KEY = 'merkato_currency_rates_cache';
    const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

    // Base rates relative to 1 USD
    const DEFAULT_RATES = {
        USD: 1.0,
        ETB: 125.50, // Ethiopian Birr
        EUR: 0.92,
        GBP: 0.78,
        AED: 3.67,
        SAR: 3.75,
        KES: 129.50,
        CAD: 1.36
    };

    const CURRENCY_METADATA = {
        ETB: { symbol: 'ETB', name: 'Ethiopian Birr', flag: '🇪🇹', format: 'price ETB', symbolAfter: true, decimals: 2 },
        USD: { symbol: '$',   name: 'US Dollar',      flag: '🇺🇸', format: '$price',     symbolAfter: false, decimals: 2 },
        EUR: { symbol: '€',   name: 'Euro',           flag: '🇪🇺', format: '€price',     symbolAfter: false, decimals: 2 },
        GBP: { symbol: '£',   name: 'British Pound',  flag: '🇬🇧', format: '£price',     symbolAfter: false, decimals: 2 },
        AED: { symbol: 'AED', name: 'UAE Dirham',     flag: '🇦🇪', format: 'AED price',  symbolAfter: false, decimals: 2 },
        SAR: { symbol: 'SAR', name: 'Saudi Riyal',    flag: '🇸🇦', format: 'SAR price',  symbolAfter: false, decimals: 2 },
        KES: { symbol: 'KES', name: 'Kenyan Shilling',flag: '🇰🇪', format: 'KES price',  symbolAfter: false, decimals: 0 },
        CAD: { symbol: 'CA$', name: 'Canadian Dollar',flag: '🇨🇦', format: 'CA$price',   symbolAfter: false, decimals: 2 }
    };

    class CurrencyEngine {
        constructor() {
            this.currentCurrency = localStorage.getItem(STORAGE_KEY) || 'ETB';
            this.rates = this._loadCachedRates() || DEFAULT_RATES;
            this.listeners = [];
        }

        _loadCachedRates() {
            try {
                const cached = localStorage.getItem(RATES_CACHE_KEY);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
                        return parsed.rates;
                    }
                }
            } catch (e) {
                console.warn('[Currency] Failed to read rate cache:', e);
            }
            return null;
        }

        convert(amountInETB, targetCurrency = this.currentCurrency) {
            const num = parseFloat(amountInETB) || 0;
            if (targetCurrency === 'ETB') return num;

            // ETB -> USD -> targetCurrency
            const usdAmount = num / this.rates.ETB;
            const targetRate = this.rates[targetCurrency] || 1.0;
            return usdAmount * targetRate;
        }

        format(amountInETB, targetCurrency = this.currentCurrency) {
            const converted = this.convert(amountInETB, targetCurrency);
            const meta = CURRENCY_METADATA[targetCurrency] || CURRENCY_METADATA.ETB;
            
            const formattedNumber = converted.toLocaleString(undefined, {
                minimumFractionDigits: meta.decimals,
                maximumFractionDigits: meta.decimals
            });

            if (meta.symbolAfter) {
                return `${formattedNumber} ${meta.symbol}`;
            }
            return `${meta.symbol} ${formattedNumber}`;
        }

        setCurrency(currencyCode) {
            if (!CURRENCY_METADATA[currencyCode]) {
                console.error(`[Currency] Unsupported currency: ${currencyCode}`);
                return;
            }
            this.currentCurrency = currencyCode;
            localStorage.setItem(STORAGE_KEY, currencyCode);
            this.notifyListeners();
            this.updateDOMPrices();
        }

        getCurrency() {
            return this.currentCurrency;
        }

        getAllCurrencies() {
            return Object.keys(CURRENCY_METADATA).map(code => ({
                code,
                ...CURRENCY_METADATA[code]
            }));
        }

        onChange(callback) {
            if (typeof callback === 'function') {
                this.listeners.push(callback);
            }
        }

        notifyListeners() {
            this.listeners.forEach(cb => {
                try {
                    cb(this.currentCurrency, CURRENCY_METADATA[this.currentCurrency]);
                } catch (e) {
                    console.error('[Currency] Listener error:', e);
                }
            });
        }

        updateDOMPrices() {
            document.querySelectorAll('[data-price-etb]').forEach(el => {
                const etb = parseFloat(el.getAttribute('data-price-etb'));
                if (!isNaN(etb)) {
                    el.textContent = this.format(etb);
                }
            });
        }
    }

    window.MerkatoCurrency = new CurrencyEngine();

})(window);
// Refined at 2026-08-30 19:19:08
// Refined at 2026-08-30 19:19:09
// Refined at 2026-08-30 19:19:09
// Refined at 2026-08-30 19:19:10
// Refined at 2026-08-30 19:19:10
// Refined at 2026-08-30 19:19:10
// Refined at 2026-08-30 19:19:11
// Refined at 2026-08-30 19:19:11
// Refined at 2026-08-30 19:19:12
// Refined at 2026-08-30 19:19:12
// Refined at 2026-08-30 19:19:12
// Refined at 2026-08-30 19:19:13
// Refined at 2026-08-30 19:19:13
// Refined at 2026-08-30 19:19:13
