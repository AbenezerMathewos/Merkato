const express = require('express');
const router = express.Router();

const COUPONS_DATABASE = {
    'MERKATO2026': { discountType: 'percentage', value: 10, minOrder: 1000, maxDiscount: 500, description: '10% off for 2026 launch' },
    'ETHIOPIA':    { discountType: 'percentage', value: 15, minOrder: 2000, maxDiscount: 800, description: '15% national pride discount' },
    'FREESHIP':    { discountType: 'shipping',   value: 100, minOrder: 1500, maxDiscount: 300, description: 'Free Express Shipping' },
    'BUNA500':     { discountType: 'fixed',      value: 500, minOrder: 3000, maxDiscount: 500, description: '500 ETB off premium coffee' },
    'ENKUTATASH':  { discountType: 'percentage', value: 20, minOrder: 2500, maxDiscount: 1000, description: '20% Ethiopian New Year Special' }
};

router.post('/validate', (req, res) => {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: 'Please provide a coupon code' });

    const normalized = code.trim().toUpperCase();
    const coupon = COUPONS_DATABASE[normalized];

    if (!coupon) {
        return res.status(404).json({ valid: false, message: 'Invalid or expired coupon code' });
    }

    const orderTotal = parseFloat(subtotal) || 0;
    if (orderTotal < coupon.minOrder) {
        return res.status(400).json({
            valid: false,
            message: `Coupon requires a minimum subtotal of ${coupon.minOrder.toLocaleString()} ETB`
        });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
        discountAmount = Math.min((orderTotal * coupon.value) / 100, coupon.maxDiscount);
    } else if (coupon.discountType === 'fixed') {
        discountAmount = Math.min(coupon.value, orderTotal);
    } else if (coupon.discountType === 'shipping') {
        discountAmount = coupon.value; // Shipping discount
    }

    res.json({
        valid: true,
        code: normalized,
        discountType: coupon.discountType,
        discountValue: coupon.value,
        discountAmount: Math.round(discountAmount),
        description: coupon.description
    });
});

module.exports = router;
