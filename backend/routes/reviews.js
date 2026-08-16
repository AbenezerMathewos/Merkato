const express = require('express');
const storage = require('../config/storage');
const Review = require('../models/Review');

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        if (storage.isMongoConnected) {
            const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });
            return res.json(reviews);
        } else {
            const reviews = storage.getReviews(productId);
            return res.json(reviews);
        }
    } catch (error) {
        console.error('Get reviews error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Add review
router.post('/', async (req, res) => {
    try {
        const { productId, userName, userEmail, rating, comment, verified } = req.body;

        if (!productId || !userName || !rating || !comment) {
            return res.status(400).json({ message: 'Product ID, user name, rating, and comment are required' });
        }

        if (storage.isMongoConnected) {
            const review = new Review({
                product: productId,
                user: req.body.userId || '640000000000000000000001',
                userName,
                rating: Number(rating),
                comment,
                verified: !!verified
            });
            const createdReview = await review.save();
            return res.status(201).json(createdReview);
        } else {
            const createdReview = storage.addReview({
                productId,
                userName,
                userEmail,
                rating: Number(rating),
                comment,
                verified: !!verified
            });
            return res.status(201).json(createdReview);
        }
    } catch (error) {
        console.error('Add review error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Vote helpful / not helpful
router.put('/:id/vote', async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body; // 'helpful' or 'notHelpful'

        if (storage.isMongoConnected) {
            const review = await Review.findById(id);
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }
            if (type === 'helpful') review.helpful = (review.helpful || 0) + 1;
            if (type === 'notHelpful') review.notHelpful = (review.notHelpful || 0) + 1;
            const updatedReview = await review.save();
            return res.json(updatedReview);
        } else {
            const updatedReview = storage.voteReview(id, type);
            if (!updatedReview) {
                return res.status(404).json({ message: 'Review not found' });
            }
            return res.json(updatedReview);
        }
    } catch (error) {
        console.error('Vote review error:', error);
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
