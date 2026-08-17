const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Mock store for pending payments
const pendingPayments = new Map();

/**
 * @route   POST /api/payments/telebirr/request
 * @desc    Request a Telebirr payment (sends mock SMS PIN)
 * @access  Private
 */
router.post('/telebirr/request', protect, (req, res) => {
    const { phone, amount } = req.body;
    
    if (!phone || !amount) {
        return res.status(400).json({ message: 'Phone and amount are required' });
    }
    
    // Simulate telebirr API call latency
    setTimeout(() => {
        // Generate a 4-digit mock PIN
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        const transactionId = 'TB-' + Date.now();
        
        // Store the transaction details (In production, use Redis/DB)
        pendingPayments.set(transactionId, {
            phone,
            amount,
            pin,
            userId: req.user._id,
            expires: Date.now() + 5 * 60000 // 5 mins
        });
        
        console.log(`\n[TELEBIRR MOCK] 📱 SMS Sent to ${phone}:`);
        console.log(`[TELEBIRR MOCK] "Your MERKATO verification code is ${pin}. Amount: ${amount} ETB. Do not share this code."\n`);
        
        // Return transaction ID (PIN is logged to console for testing, never returned in real life)
        res.json({
            success: true,
            message: 'Verification code sent via SMS',
            transactionId,
            testPin: pin // Only exposing this for easy testing
        });
    }, 800);
});

/**
 * @route   POST /api/payments/telebirr/verify
 * @desc    Verify SMS PIN and process payment
 * @access  Private
 */
router.post('/telebirr/verify', protect, (req, res) => {
    const { transactionId, pin } = req.body;
    
    if (!transactionId || !pin) {
        return res.status(400).json({ message: 'Transaction ID and PIN are required' });
    }
    
    const payment = pendingPayments.get(transactionId);
    
    if (!payment) {
        return res.status(404).json({ message: 'Transaction not found or expired' });
    }
    
    if (payment.expires < Date.now()) {
        pendingPayments.delete(transactionId);
        return res.status(400).json({ message: 'Transaction expired. Please try again.' });
    }
    
    // Verify PIN
    setTimeout(() => {
        if (payment.pin === pin) {
            console.log(`[TELEBIRR MOCK] ✅ Payment of ${payment.amount} ETB from ${payment.phone} successful!`);
            pendingPayments.delete(transactionId);
            
            res.json({
                success: true,
                message: 'Payment verified and processed successfully',
                receiptNumber: 'REC-' + Math.floor(Math.random() * 1000000)
            });
        } else {
            console.log(`[TELEBIRR MOCK] ❌ Invalid PIN entered for ${payment.phone}`);
            res.status(400).json({ message: 'Invalid verification code' });
        }
    }, 1000);
});

module.exports = router;
