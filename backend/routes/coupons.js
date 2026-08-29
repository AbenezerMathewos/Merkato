const express = require('express');
const router = express.Router();

// Defined coupon database
const coupons = [
    {
        code: 'MERKATO2026',
        discountType: 'percentage',
        discountValue: 10,
        minOrder: 1000,
        freeShipping: true,
        description: '10% OFF + Free Express Shipping on orders over 1,000 ETB'
    },
    {
        code: 'HABESHA15',
        discountType: 'percentage',
        discountValue: 15,
        minOrder: 1500,
        freeShipping: false,
        description: '15% OFF on all Ethiopian Coffee, Spices & Cultural items'
    },
    {
        code: 'ENKUTATASH',
        discountType: 'fixed',
        discountValue: 500,
        minOrder: 2000,
        freeShipping: false,
        description: '500 ETB flat discount on orders over 2,000 ETB'
    },
    {
        code: 'FREESHIP',
        discountType: 'shipping',
        discountValue: 100,
        minOrder: 500,
        freeShipping: true,
        description: '100% Free delivery across all Addis Ababa sub-cities'
    }
];

/**
 * @route   POST /api/coupons/validate
 * @desc    Validate a promo code against current cart subtotal
 * @access  Public
 */
router.post('/validate', (req, res) => {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
        return res.status(400).json({ success: false, message: 'Please enter a promo code' });
    }

    const cleanCode = String(code).trim().toUpperCase();
    const coupon = coupons.find(c => c.code === cleanCode);

    if (!coupon) {
        return res.status(404).json({ success: false, message: 'Invalid or expired promo code' });
    }

    if (subtotal < coupon.minOrder) {
        return res.status(400).json({
            success: false,
            message: `Minimum order amount of ${coupon.minOrder.toLocaleString()} ETB required for code ${coupon.code}`
        });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
        discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    } else if (coupon.discountType === 'fixed') {
        discountAmount = Math.min(coupon.discountValue, subtotal);
    } else if (coupon.discountType === 'shipping') {
        discountAmount = 0; // handled via free shipping flag
    }

    return res.json({
        success: true,
        message: `🎉 Promo code "${coupon.code}" applied successfully!`,
        coupon: {
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discountAmount,
            freeShipping: coupon.freeShipping,
            description: coupon.description
        }
    });
});

/**
 * @route   GET /api/coupons
 * @desc    Get public active coupons
 * @access  Public
 */
router.get('/', (req, res) => {
    const publicList = coupons.map(({ code, discountType, discountValue, minOrder, freeShipping, description }) => ({
        code,
        discountType,
        discountValue,
        minOrder,
        freeShipping,
        description
    }));
    res.json(publicList);
});

module.exports = router;
