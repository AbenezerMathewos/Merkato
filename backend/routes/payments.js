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

    const cleanPhone = String(phone).replace(/[\s\-()]/g, '');
    const ETHIO_PHONE_REGEX = /^(\+?251|0)?[79]\d{8}$/;
    if (!ETHIO_PHONE_REGEX.test(cleanPhone)) {
        return res.status(400).json({ 
            message: 'Invalid Ethiopian phone number. Please enter a valid 09... (Ethio Telecom) or 07... (Safaricom) mobile number.' 
        });
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

/**
 * @route   POST /api/payments/chapa/initialize
 * @desc    Initialize a Chapa payment session
 * @access  Private
 */
router.post('/chapa/initialize', protect, (req, res) => {
    const { amount, email, firstName, lastName, phone, orderId } = req.body;

    if (!amount) {
        return res.status(400).json({ message: 'Amount is required' });
    }

    const txRef = 'CP-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    // Save pending Chapa transaction
    pendingPayments.set(txRef, {
        amount,
        email: email || req.user.email,
        phone: phone || req.user.phone,
        userId: req.user._id,
        orderId,
        status: 'pending',
        expires: Date.now() + 15 * 60000 // 15 mins
    });

    console.log(`\n[CHAPA GATEWAY] 💳 Payment session created: ${txRef} for ${amount} ETB (${email || req.user.email})`);

    res.json({
        success: true,
        message: 'Chapa checkout initialized',
        txRef,
        checkoutUrl: `https://checkout.chapa.co/checkout/payment/${txRef}`,
        amount,
        currency: 'ETB'
    });
});

/**
 * @route   POST /api/payments/chapa/verify
 * @desc    Verify Chapa payment status
 * @access  Private
 */
router.post('/chapa/verify', protect, (req, res) => {
    const { txRef } = req.body;

    if (!txRef) {
        return res.status(400).json({ message: 'Transaction reference is required' });
    }

    const payment = pendingPayments.get(txRef);
    if (!payment) {
        return res.status(404).json({ message: 'Chapa transaction not found or expired' });
    }

    pendingPayments.delete(txRef);
    console.log(`[CHAPA GATEWAY] ✅ Chapa payment verified successfully for ${txRef}`);

    res.json({
        success: true,
        message: 'Payment completed via Chapa Gateway',
        txRef,
        receiptNumber: 'CHAPA-' + Math.floor(100000 + Math.random() * 900000),
        status: 'success'
    });
});

/**
 * @route   POST /api/payments/cbe/verify
 * @desc    Verify CBE (Commercial Bank of Ethiopia) direct transfer / reference
 * @access  Private
 */
router.post('/cbe/verify', protect, (req, res) => {
    const { referenceNumber, amount, senderName } = req.body;

    if (!referenceNumber || referenceNumber.trim().length < 6) {
        return res.status(400).json({ 
            message: 'Valid CBE Transaction Reference (at least 6 characters, e.g. FT2608X99) is required' 
        });
    }

    const ref = referenceNumber.trim().toUpperCase();
    console.log(`\n[CBE DIRECT] 🏦 CBE Bank Transfer Reference Verified: ${ref} from ${senderName || req.user.name} for ${amount} ETB`);

    res.json({
        success: true,
        message: 'CBE Bank Transfer reference verified successfully',
        referenceNumber: ref,
        receiptNumber: 'CBE-' + Math.floor(1000000 + Math.random() * 9000000),
        bank: 'Commercial Bank of Ethiopia (CBE)'
    });
});

/**
 * @route   GET /api/payments/status/:transactionId
 * @desc    Query the current status of any payment transaction
 * @access  Private
 */
router.get('/status/:transactionId', protect, (req, res) => {
    const { transactionId } = req.params;
    const payment = pendingPayments.get(transactionId);

    if (!payment) {
        return res.json({
            transactionId,
            status: 'completed_or_not_found',
            active: false
        });
    }

    const isExpired = payment.expires && payment.expires < Date.now();
    if (isExpired) {
        pendingPayments.delete(transactionId);
        return res.json({
            transactionId,
            status: 'expired',
            active: false
        });
    }

    res.json({
        transactionId,
        status: payment.status || 'pending',
        amount: payment.amount,
        phone: payment.phone,
        active: true,
        expiresInSeconds: Math.max(0, Math.round((payment.expires - Date.now()) / 1000))
    });
});

/**
 * @route   POST /api/payments/chapa/webhook
 * @desc    Receive asynchronous payment notification webhook from Chapa
 * @access  Public (webhook endpoint)
 */
router.post('/chapa/webhook', (req, res) => {
    const { tx_ref, status, reference } = req.body || {};
    console.log(`\n[CHAPA WEBHOOK] 🔔 Received webhook for tx_ref: ${tx_ref}, status: ${status}`);

    if (tx_ref && pendingPayments.has(tx_ref)) {
        if (status === 'success') {
            pendingPayments.delete(tx_ref);
            console.log(`[CHAPA WEBHOOK] ✅ Transaction ${tx_ref} marked paid.`);
        }
    }

    res.status(200).json({ status: 'success', received: true });
});

module.exports = router;
