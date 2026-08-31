// ============================================================================
// MERKATO - Interactive AI Customer Support Chat Widget
// ============================================================================

(function(window) {
    'use strict';

    const BOT_RESPONSES = [
        {
            keywords: ['delivery', 'shipping', 'where', 'deliver', 'ማድረሻ', 'መቼ'],
            response: "🚚 We offer Same-Day Delivery in Addis Ababa for orders placed before 2:00 PM! Regional deliveries across Ethiopia take 2-4 business days. Delivery is FREE on orders above 3,000 ETB."
        },
        {
            keywords: ['payment', 'telebirr', 'cbe', 'birr', 'bank', 'ክፍያ', 'ቴሌብር'],
            response: "💳 We accept Telebirr, CBE Birr, Chapa, Bank Transfer (CBE, Awash, Dashen), and Cash on Delivery (Addis Ababa only)."
        },
        {
            keywords: ['return', 'refund', 'exchange', 'መመለስ', 'ገንዘብ'],
            response: "🔄 We offer a 30-Day Hassle-Free Return policy on all eligible items. Visit our Returns page or contact us with your Order ID for instant return processing."
        },
        {
            keywords: ['artisan', 'sell', 'vendor', 'ባለሙያ', 'መሸጥ'],
            response: "🎨 Are you an Ethiopian artisan or farmer? We'd love to have you on MERKATO! Visit our 'Artisans' page to submit your application and reach thousands of customers."
        },
        {
            keywords: ['coffee', 'buna', 'teff', 'ቅመም', 'ቡና', 'ጤፍ'],
            response: "☕ All our coffee (Yirgacheffe, Sidama, Harar) is 100% single-origin and freshly sourced from local Ethiopian co-ops! Our Magna White Teff is thoroughly cleaned and stone-milled."
        }
    ];

    const DEFAULT_RESPONSE = "👋 Thank you for messaging MERKATO! For specialized assistance, you can also reach our Addis Ababa team directly at +251 11 123 4567 or support@merkato.com.";

    class ChatWidget {
        constructor() {
            this.isOpen = false;
            this.messages = [
                { sender: 'bot', text: 'ሰላም! Welcome to MERKATO. How can I assist your shopping today? 😊', time: 'Just now' }
            ];
        }

        getReply(userMessage) {
            const lower = userMessage.toLowerCase();
            for (const item of BOT_RESPONSES) {
                if (item.keywords.some(k => lower.includes(k))) {
                    return item.response;
                }
            }
            return DEFAULT_RESPONSE;
        }
    }

    window.MerkatoChat = new ChatWidget();

})(window);
