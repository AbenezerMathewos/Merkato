// Backend API & Payment Gateways Integration Test Suite
const assert = require('assert');
const http = require('http');
const path = require('path');
const express = require(path.join(__dirname, '../backend/node_modules/express'));
const cors = require(path.join(__dirname, '../backend/node_modules/cors'));

function runTests() {
    return new Promise((resolve, reject) => {
        console.log('🧪 Testing Backend API & Payment Gateways...');

        const app = express();
        app.use(cors());
        app.use(express.json());
        app.use(express.static(path.join(__dirname, '..', 'frontend')));

        // Mount routes
        app.use('/api/auth', require('../backend/routes/auth'));
        app.use('/api/products', require('../backend/routes/products'));
        app.use('/api/orders', require('../backend/routes/orders'));
        app.use('/api/users', require('../backend/routes/users'));
        app.use('/api/reviews', require('../backend/routes/reviews'));
        app.use('/api/payments', require('../backend/routes/payments'));
        app.use('/api/coupons', require('../backend/routes/coupons'));

        app.get('/api', (req, res) => {
            res.json({ status: 'online', version: '1.0.0' });
        });

        const PORT = 5099;
        const server = app.listen(PORT, async () => {
            function request(url, options = {}) {
                return new Promise((resP, rejP) => {
                    const req = http.request(url, options, (res) => {
                        let body = '';
                        res.on('data', chunk => body += chunk);
                        res.on('end', () => {
                            try {
                                resP({ status: res.statusCode, data: JSON.parse(body), raw: body });
                            } catch (e) {
                                resP({ status: res.statusCode, raw: body });
                            }
                        });
                    });
                    req.on('error', rejP);
                    if (options.body) req.write(options.body);
                    req.end();
                });
            }

            try {
                // 1. Root API
                const apiRes = await request(`http://localhost:${PORT}/api`);
                assert.strictEqual(apiRes.status, 200, 'Root API must return 200');
                assert.strictEqual(apiRes.data.status, 'online', 'Root API status should be online');

                // 2. Products Catalog
                const prodRes = await request(`http://localhost:${PORT}/api/products`);
                assert.strictEqual(prodRes.status, 200, 'Products endpoint must return 200');
                assert(Array.isArray(prodRes.data) && prodRes.data.length > 0, 'Products catalog must not be empty');

                // 3. Coupon Engine
                const couponRes = await request(`http://localhost:${PORT}/api/coupons/validate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: 'MERKATO2026', subtotal: 3500 })
                });
                assert.strictEqual(couponRes.status, 200, 'Valid coupon should return 200');
                assert.strictEqual(couponRes.data.coupon.discountAmount, 350, '10% coupon on 3500 must equal 350 ETB discount');

                // 4. Invalid Coupon Handling
                const badCoupon = await request(`http://localhost:${PORT}/api/coupons/validate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: 'FAKECODE', subtotal: 1000 })
                });
                assert.strictEqual(badCoupon.status, 404, 'Invalid coupon should return 404');

                // 5. Chapa Payment Webhook
                const webhookRes = await request(`http://localhost:${PORT}/api/payments/chapa/webhook`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tx_ref: 'CP-TEST-101', status: 'success' })
                });
                assert.strictEqual(webhookRes.status, 200, 'Chapa webhook endpoint should return 200');
                assert.strictEqual(webhookRes.data.status, 'success');

                // 6. Static Index serving
                const indexRes = await request(`http://localhost:${PORT}/index.html`);
                assert.strictEqual(indexRes.status, 200, 'Static frontend index.html must be served');
                assert(indexRes.raw.includes('MERKATO'), 'Index HTML must contain MERKATO branding');

                console.log('✅ Backend API & payment gateway tests passed!');
                server.close(() => resolve());
            } catch (err) {
                server.close(() => reject(err));
            }
        });
    });
}

module.exports = { runTests };
if (require.main === module) {
    runTests().catch(err => {
        console.error('❌ Backend test error:', err);
        process.exit(1);
    });
}
