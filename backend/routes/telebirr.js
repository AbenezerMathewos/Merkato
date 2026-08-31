const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Telebirr Integration Route for Ethiopian Supermarket Payments
router.post('/create-payment', async (req, res) => {
    try {
        const { orderId, amount, customerPhone, returnUrl } = req.body;

        if (!orderId || !amount || !customerPhone) {
            return res.status(400).json({ error: 'Missing required Telebirr payment parameters' });
        }

        const appId = process.env.TELEBIRR_APP_ID || 'MKT_APP_2026';
        const merchantCode = process.env.TELEBIRR_MERCHANT_CODE || 'MERKATO_ET';
        const outTradeNo = `MKT_${orderId}_${Date.now()}`;
        
        // Mock payload creation & signature for development
        const payload = {
            appId,
            outTradeNo,
            totalAmount: amount.toString(),
            shortCode: merchantCode,
            notifyUrl: `${req.protocol}://${req.get('host')}/api/telebirr/webhook`,
            returnUrl: returnUrl || 'https://merkato.com/order-confirmation.html',
            subject: `MERKATO Order #${orderId}`,
            timeoutExpress: '30m'
        };

        const mockPaymentUrl = `https://telebirr.ethiotelecom.et/checkout?tradeNo=${outTradeNo}&amount=${amount}`;

        res.json({
            success: true,
            tradeNo: outTradeNo,
            paymentUrl: mockPaymentUrl,
            message: 'Telebirr payment session initiated successfully'
        });
    } catch (err) {
        res.status(500).json({ error: 'Telebirr payment gateway error', details: err.message });
    }
});

router.post('/webhook', (req, res) => {
    console.log('[Telebirr Webhook Received]:', req.body);
    res.json({ code: 0, message: 'SUCCESS' });
});

module.exports = router;
