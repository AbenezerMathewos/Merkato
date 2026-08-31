// ============================================================================
// MERKATO - Internationalization (i18n) Engine
// Supported: English (en), Amharic (am), Afaan Oromoo (om), Tigrinya (ti), Somali (so)
// ============================================================================

(function(window) {
    'use strict';

    const STORAGE_KEY = 'merkato_lang_preference';

    const TRANSLATIONS = {
        en: {
            brand_name: "MERKATO",
            tagline: "Ethiopian Digital Marketplace",
            home: "Home",
            shop: "Shop",
            about: "About",
            contact: "Contact",
            faq: "FAQ",
            returns: "Returns",
            admin: "Admin",
            cart: "Cart",
            wishlist: "Wishlist",
            orders: "My Orders",
            sign_in: "Sign In",
            search_placeholder: "Search coffee, teff, traditional clothes, electronics...",
            quick_add: "Quick Add",
            view_details: "View Details",
            add_to_cart: "Add to Cart",
            buy_now: "Buy Now",
            out_of_stock: "Out of Stock",
            free_shipping_notice: "FREE EXPRESS SHIPPING ON ORDERS OVER 3,000 ETB",
            hero_title: "Authentic Ethiopian Market, Delivered To Your Door",
            hero_subtitle: "From Yirgacheffe coffee to handwoven Habesha Kemis, discover the best of Ethiopia.",
            secure_payment: "100% Secure Payment",
            telebirr_cbe: "Telebirr & CBE Birr Supported",
            quality_guaranteed: "Quality Guaranteed",
            fast_delivery: "Same-Day Addis Delivery",
            categories: "Categories",
            food_spices: "Food & Spices",
            home_kitchen: "Home & Kitchen",
            apparel: "Apparel & Culture",
            crafts: "Traditional Crafts",
            electronics: "Electronics",
            recently_viewed: "Recently Viewed",
            customer_reviews: "Customer Reviews",
            copyright: "All rights reserved. MERKATO Supermarket Inc."
        },
        am: {
            brand_name: "መርካቶ",
            tagline: "የኢትዮጵያ ዲጂታል የገበያ አዳራሽ",
            home: "ዋና ገጽ",
            shop: "ሱቅ / መገበያያ",
            about: "ስለ እኛ",
            contact: "አግኙን",
            faq: "ተደጋጋሚ ጥያቄዎች",
            returns: "ዕቃ መመለስ",
            admin: "አስተዳዳሪ",
            cart: "ጋሪ",
            wishlist: "የምኞት ዝርዝር",
            orders: "የእኔ ትዕዛዞች",
            sign_in: "ግባ / ተመዝገብ",
            search_placeholder: "ቡና፣ ጤፍ፣ የሀበሻ ልብስ፣ ኤሌክትሮኒክስ ይፈልጉ...",
            quick_add: "ወደ ጋሪ ጨምር",
            view_details: "ዝርዝር ይመልከቱ",
            add_to_cart: "ወደ ጋሪ ጨምር",
            buy_now: "አሁኑኑ ግዛ",
            out_of_stock: "አልቋል",
            free_shipping_notice: "ከ 3,000 ብር በላይ ትዕዛዝ ነፃ ፈጣን ማድረሻ",
            hero_title: "ትክክለኛ የሀገር ውስጥ ምርቶች እስከ ደጃፍዎ",
            hero_subtitle: "ከይርጋጨፌ ቡና እስከ ምርጥ የሀበሻ ቀሚስ ድረስ ምርጥ የኢትዮጵያ ምርቶችን ይሸምቱ።",
            secure_payment: "100% አስተማማኝ ክፍያ",
            telebirr_cbe: "በቴሌብር እና በሲቢኢ ብር ክፍያ ይቀበላል",
            quality_guaranteed: "ጥራቱ የተረጋገጠ",
            fast_delivery: "በአዲስ አበባ በዕለቱ ማድረስ",
            categories: "ምድቦች",
            food_spices: "ምግብ እና ቅመማ ቅመም",
            home_kitchen: "የቤት እና ወጥ ቤት ዕቃዎች",
            apparel: "የባህል አልባሳት",
            crafts: "የእጅ ጥበባት",
            electronics: "ኤሌክትሮኒክስ",
            recently_viewed: "በቅርቡ የተመለከቷቸው",
            customer_reviews: "የደንበኞች አስተያየት",
            copyright: "መብቱ በሕግ የተጠበቀ ነው። መርካቶ ሱፐርማርኬት"
        },
        om: {
            brand_name: "MARKAATOO",
            tagline: "Gabaa Dijitaalaa Itoophiyaa",
            home: "Fuula Duraa",
            shop: "Suuqii",
            about: "Waa'ee Keenya",
            contact: "Nu Qunnamaa",
            faq: "Gaaffilee Yeroo Baay'ee",
            returns: "Meeshaa Deebisuu",
            admin: "Bulchaa",
            cart: "Gaarii",
            wishlist: "Hawwii Koo",
            orders: "Ajajawwan Koo",
            sign_in: "Seenaa",
            search_placeholder: "Buna, xaafii, uffata aadaa, elektirooniksii barbaadaa...",
            quick_add: "Dafii Dabali",
            view_details: "Bal'ina Ilaali",
            add_to_cart: "Gara Gaariitti Dabali",
            buy_now: "Amma Biti",
            out_of_stock: "Dhumateera",
            free_shipping_notice: "Ajaja Qarshii 3,000 oliif geejjibni tola",
            hero_title: "Oomishaalee Qulqulluu Itoophiyaa Balbala Keessanitti",
            hero_subtitle: "Buna Yirgaacaffee irraa hanga uffata aadaatti oomishaalee filatamoo bitadhaa.",
            secure_payment: "Kaffaltii Nageenyi Isaa Eegame",
            telebirr_cbe: "Telebirr fi CBE Birr ni fudhata",
            quality_guaranteed: "Qulqullinni Mirkanaa'e",
            fast_delivery: "Finfinnee Keessatti Guyyuma Sana",
            categories: "Kutaalee",
            food_spices: "Nyaata & Mi'eessituu",
            home_kitchen: "Mana & Kushiinaa",
            apparel: "Uffata Aadaa",
            crafts: "Hojii Harka",
            electronics: "Elektirooniksii",
            recently_viewed: "Dhiheenya Kan Ilaalaman",
            customer_reviews: "Yaada Maamiltootaa",
            copyright: "Mirgi hundaa eegamaadha. Markaatoo Supermarket."
        },
        ti: {
            brand_name: "መርካቶ",
            tagline: "ዲጂታል ዕዳጋ ኢትዮጵያ",
            home: "መበገሲ",
            shop: "ድኳን",
            about: "ብዛዕባና",
            contact: "ርኸቡና",
            faq: "ዝተደጋግሙ ሕቶታት",
            returns: "ምምላስ ኣቕሑ",
            admin: "ኣመሓዳሪ",
            cart: "ዓረብያ",
            wishlist: "ዝተመነኽዎ",
            orders: "ትእዛዛተይ",
            sign_in: "እተው",
            search_placeholder: "ቡን፣ ጣፍ፣ ባህላዊ ክዳውንቲ፣ ኤሌክትሮኒክስ ድለዩ...",
            quick_add: "ቀልጢፍካ ወስኽ",
            view_details: "ዝርዝር ርአ",
            add_to_cart: "ናብ ዓረብያ ወስኽ",
            buy_now: "ሕጂ ዓድግ",
            out_of_stock: "ተወዲኡ",
            free_shipping_notice: "ካብ 3,000 ብር ንላዕሊ ብነጻ ዝብጻሕ",
            hero_title: "ትክክለኛ ናይ ሃገርና ፍርያት ክሳብ ኣፍደገኹም",
            hero_subtitle: "ካብ ቡን ይርጋጨፈ ክሳብ ዝበለጸ ባህላዊ ክዳውንቲ ሸምቱ።",
            secure_payment: "100% ውሑስ ክፍሊት",
            telebirr_cbe: "ብቴሌብርን ሲቢኢ ብርን ክፍሊት ይቕበል",
            quality_guaranteed: "ጽሬቱ ዝተረጋገጸ",
            fast_delivery: "ኣብ ኣዲስ ኣበባ ኣብታ መዓልቲ",
            categories: "ምድባት",
            food_spices: "ምግብን ቀመማትን",
            home_kitchen: "ናይ ገዛን ክሽነን ኣቕሑ",
            apparel: "ባህላዊ ክዳውንቲ",
            crafts: "ስነ-ጥበብ ኢድ",
            electronics: "ኤሌክትሮኒክስ",
            recently_viewed: "ኣቐዲምኩም ዝረኣኹምዎ",
            customer_reviews: "ናይ ዓደግቲ ርእይቶ",
            copyright: "ኩሉ መሰል ብሕጊ ዝተሓለወ እዩ። መርካቶ ሱፐርማርኬት"
        }
    };

    class I18nEngine {
        constructor() {
            this.currentLang = localStorage.getItem(STORAGE_KEY) || 'en';
            this.translations = TRANSLATIONS;
        }

        t(key, fallback = '') {
            const langDict = this.translations[this.currentLang] || this.translations.en;
            return langDict[key] || this.translations.en[key] || fallback || key;
        }

        setLanguage(langCode) {
            if (!this.translations[langCode]) {
                console.warn(`[i18n] Unknown language: ${langCode}, falling back to English`);
                langCode = 'en';
            }
            this.currentLang = langCode;
            localStorage.setItem(STORAGE_KEY, langCode);
            document.documentElement.lang = langCode;
            
            // Set font class if needed (Ethiopic script styling)
            if (['am', 'ti'].includes(langCode)) {
                document.body.classList.add('lang-ethiopic');
            } else {
                document.body.classList.remove('lang-ethiopic');
            }

            this.translatePage();
            window.dispatchEvent(new CustomEvent('merkato:langchange', { detail: { lang: langCode } }));
        }

        getLanguage() {
            return this.currentLang;
        }

        translatePage() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                const translation = this.t(key);
                if (translation) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.placeholder = translation;
                    } else {
                        el.textContent = translation;
                    }
                }
            });
        }
    }

    window.MerkatoI18n = new I18nEngine();

    document.addEventListener('DOMContentLoaded', () => {
        window.MerkatoI18n.translatePage();
    });

})(window);
