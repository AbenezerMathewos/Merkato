const express = require('express');
const router = express.Router();

const ARTISANS = [
    {
        id: 'art_1',
        name: 'W/ro Tsehaynesh Gebre',
        craft: 'Traditional Handloom Weaving (ሸማ)',
        region: 'Gamo Highlands / Chencha, SNNPR',
        experienceYears: 28,
        rating: 4.9,
        productsCount: 14,
        bio: 'Preserving 4 generations of Dorze cotton spinning and intricate Habesha Kemis tilet embroidery.',
        avatar: 'images/artisans/tsehaynesh.jpg',
        featuredProduct: 'Habesha Kemis (Royal Gold Tilet)'
    },
    {
        id: 'art_2',
        name: 'Ato Bekele Tolosa',
        craft: 'Hand-Carved Mesob & Bamboo Craft (መሶብ)',
        region: 'Jimma, Oromia',
        experienceYears: 22,
        rating: 4.8,
        productsCount: 9,
        bio: 'Master craftsman creating sustainable bamboo mesobs colored with 100% natural vegetable dyes.',
        avatar: 'images/artisans/bekele.jpg',
        featuredProduct: 'Woven Harari & Jimma Mesob'
    },
    {
        id: 'art_3',
        name: 'W/ro Martha Alemayehu',
        craft: 'Organic Spice Blending (በርበሬ & ሚጥሚጣ)',
        region: 'Mojo / Debre Zeit, Oromia',
        experienceYears: 16,
        rating: 5.0,
        productsCount: 12,
        bio: 'Sun-dried Mareko red peppers hand-ground with 14 indigenous Ethiopian spices and herbs.',
        avatar: 'images/artisans/martha.jpg',
        featuredProduct: 'Royal Shiro & Berbere Blend'
    }
];

router.get('/', (req, res) => {
    const { region } = req.query;
    if (region && region !== 'all') {
        const filtered = ARTISANS.filter(a => a.region.toLowerCase().includes(region.toLowerCase()));
        return res.json({ success: true, count: filtered.length, artisans: filtered });
    }
    res.json({ success: true, count: ARTISANS.length, artisans: ARTISANS });
});

router.post('/apply', (req, res) => {
    const { name, phone, craft, region, description } = req.body;
    if (!name || !phone || !craft) {
        return res.status(400).json({ error: 'Name, phone number, and craft specialty are required.' });
    }

    res.status(201).json({
        success: true,
        applicationId: 'ART_APP_' + Date.now(),
        message: 'Thank you for applying to become a verified MERKATO Artisan! Our coordinator will contact you in 48 hours.'
    });
});

module.exports = router;
