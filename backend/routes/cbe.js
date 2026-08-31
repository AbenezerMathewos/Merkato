const express = require('express');
const router = express.Router();

// Commercial Bank of Ethiopia (CBE Birr) API route
router.post('/verify-transaction', async (req, res) => {
    try {
        const { transactionReference, amount, orderId } = req.body;

        if (!transactionReference || !amount) {
            return res.status(400).json({ error: 'CBE transaction reference and amount required' });
        }

        // Mock verification logic against CBE core banking
        const isPatternValid = /^CBE[A-Z0-9]{8,12}$/i.test(transactionReference.trim());

        if (!isPatternValid && transactionReference.length < 6) {
            return res.status(400).json({ 
                verified: false, 
                error: 'Invalid CBE Birr transaction ID format. It should typically start with CBE or be 8+ alphanumeric characters.' 
            });
        }

        res.json({
            verified: true,
            transactionReference,
            orderId,
            verifiedAmount: amount,
            status: 'COMPLETED',
            timestamp: new Date().toISOString(),
            message: 'CBE Birr payment confirmed successfully'
        });
    } catch (err) {
        res.status(500).json({ error: 'CBE Birr verification failed', details: err.message });
    }
});

module.exports = router;
