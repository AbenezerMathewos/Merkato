const express = require('express');
const router = express.Router();

router.get('/dashboard-summary', (req, res) => {
    res.json({
        period: '30_days',
        currency: 'ETB',
        metrics: {
            totalRevenue: 2458900,
            revenueGrowthPercentage: 24.8,
            totalOrders: 482,
            averageOrderValue: 5101,
            activeCustomers: 1240,
            repeatCustomerRate: '42.5%'
        },
        topSellingProducts: [
            { id: 'buna', name: 'Yirgacheffe Buna Grade 1', unitsSold: 340, revenue: 850000 },
            { id: 'mitad', name: 'Digital Electric Mitad', unitsSold: 42, revenue: 777000 },
            { id: 'teff', name: 'Magna White Teff (50kg)', unitsSold: 98, revenue: 411600 },
            { id: 'kemis', name: 'Habesha Kemis Traditional', unitsSold: 28, revenue: 336000 }
        ],
        salesByRegion: {
            'Addis Ababa (Bole)': 42,
            'Addis Ababa (Yeka)': 18,
            'Addis Ababa (Kirkos)': 14,
            'Hawassa': 9,
            'Adama': 7,
            'Other Regions': 10
        },
        paymentMethodBreakdown: {
            'Telebirr': '54%',
            'CBE Birr': '26%',
            'Cash on Delivery': '12%',
            'Bank Transfer': '8%'
        }
    });
});

module.exports = router;
