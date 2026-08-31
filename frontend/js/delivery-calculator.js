// ============================================================================
// MERKATO - Ethiopian Delivery & Sub-City Estimator
// ============================================================================

(function(window) {
    'use strict';

    const DELIVERY_ZONES = {
        // Addis Ababa Sub-Cities
        "Bole":          { name: "Bole (ቦሌ)",           fee: 150, daysMin: 0, daysMax: 1, freeThreshold: 3000 },
        "Yeka":          { name: "Yeka (የካ)",           fee: 180, daysMin: 0, daysMax: 1, freeThreshold: 3000 },
        "Kirkos":        { name: "Kirkos (ቂርቆስ)",       fee: 150, daysMin: 0, daysMax: 1, freeThreshold: 3000 },
        "Arada":         { name: "Arada (አራዳ)",         fee: 150, daysMin: 0, daysMax: 1, freeThreshold: 3000 },
        "Gullele":       { name: "Gullele (ጉለሌ)",       fee: 200, daysMin: 0, daysMax: 1, freeThreshold: 3000 },
        "Lideta":        { name: "Lideta (ልደታ)",         fee: 160, daysMin: 0, daysMax: 1, freeThreshold: 3000 },
        "Nifas_Silk":    { name: "Nifas Silk (ንፋስ ስልክ)", fee: 180, daysMin: 0, daysMax: 1, freeThreshold: 3000 },
        "Kolfe":         { name: "Kolfe Keranio (ኮልፌ)", fee: 220, daysMin: 1, daysMax: 2, freeThreshold: 3500 },
        "Akaki_Kality":  { name: "Akaki Kality (አቃቂ)",   fee: 250, daysMin: 1, daysMax: 2, freeThreshold: 4000 },
        "Addis_Ketema":  { name: "Addis Ketema (አዲስ ከተማ)",fee: 140, daysMin: 0, daysMax: 1, freeThreshold: 3000 },

        // Regional Hubs
        "Adama":         { name: "Adama / Nazret (አዳማ)", fee: 400, daysMin: 1, daysMax: 2, freeThreshold: 6000 },
        "Hawassa":       { name: "Hawassa (ሀዋሳ)",       fee: 550, daysMin: 2, daysMax: 3, freeThreshold: 7500 },
        "Bahir_Dar":     { name: "Bahir Dar (ባሕር ዳር)",   fee: 600, daysMin: 2, daysMax: 4, freeThreshold: 8000 },
        "Gondar":        { name: "Gondar (ጎንደር)",       fee: 650, daysMin: 2, daysMax: 4, freeThreshold: 8000 },
        "Dire_Dawa":     { name: "Dire Dawa (ድሬዳዋ)",     fee: 600, daysMin: 2, daysMax: 3, freeThreshold: 8000 },
        "Mekelle":       { name: "Mekelle (መቐለ)",       fee: 700, daysMin: 3, daysMax: 5, freeThreshold: 9000 },
        "Jimma":         { name: "Jimma (ጅማ)",           fee: 500, daysMin: 2, daysMax: 3, freeThreshold: 7000 }
    };

    class DeliveryCalculator {
        constructor() {
            this.zones = DELIVERY_ZONES;
        }

        getZones() {
            return Object.keys(this.zones).map(key => ({
                id: key,
                ...this.zones[key]
            }));
        }

        calculate(zoneId, orderSubtotal) {
            const zone = this.zones[zoneId] || this.zones["Bole"];
            const subtotal = parseFloat(orderSubtotal) || 0;
            const isFree = subtotal >= zone.freeThreshold;
            const finalFee = isFree ? 0 : zone.fee;

            const today = new Date();
            const minDate = new Date(today);
            minDate.setDate(today.getDate() + zone.daysMin);

            const maxDate = new Date(today);
            maxDate.setDate(today.getDate() + zone.daysMax);

            return {
                zoneName: zone.name,
                fee: finalFee,
                isFreeDelivery: isFree,
                originalFee: zone.fee,
                freeThresholdRemaining: isFree ? 0 : Math.max(0, zone.freeThreshold - subtotal),
                estimatedDeliveryWindow: `${zone.daysMin === 0 ? 'Today' : zone.daysMin + ' day(s)'} - ${zone.daysMax} day(s)`
            };
        }
    }

    window.MerkatoDelivery = new DeliveryCalculator();

})(window);
