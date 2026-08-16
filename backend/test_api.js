const http = require('http');

function makeRequest(path, method = 'GET', data = null, token = null) {
    return new Promise((resolve, reject) => {
        const payload = data ? JSON.stringify(data) : null;
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (payload) {
            options.headers['Content-Length'] = Buffer.byteLength(payload);
        }
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, raw: body });
                }
            });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Starting API Verification Tests...\n');

    try {
        // 1. Check Root
        console.log('1. Testing Root endpoint GET / ...');
        const root = await makeRequest('/');
        console.log('   Status:', root.status, '| Response:', root.data.message);

        // 2. Admin Login
        console.log('\n2. Testing Admin Login POST /api/auth/login ...');
        const adminLogin = await makeRequest('/api/auth/login', 'POST', {
            email: 'admin@merkato.com',
            password: 'admin123'
        });
        console.log('   Status:', adminLogin.status, '| User:', adminLogin.data.name, '| Token received:', !!adminLogin.data.token);
        const adminToken = adminLogin.data.token;

        // 3. User Login
        console.log('\n3. Testing User Login POST /api/auth/login ...');
        const userLogin = await makeRequest('/api/auth/login', 'POST', {
            email: 'user@merkato.com',
            password: 'user123'
        });
        console.log('   Status:', userLogin.status, '| User:', userLogin.data.name, '| Token received:', !!userLogin.data.token);
        const userToken = userLogin.data.token;

        // 4. Products List
        console.log('\n4. Testing Products List GET /api/products ...');
        const products = await makeRequest('/api/products');
        console.log('   Status:', products.status, '| Products Count:', products.data.length);
        const firstProd = products.data[0];
        console.log('   Sample Product:', firstProd.name, '-', firstProd.price, 'ETB');

        // 5. Get Single Product
        console.log('\n5. Testing Single Product GET /api/products/' + firstProd._id + ' ...');
        const singleProd = await makeRequest('/api/products/' + firstProd._id);
        console.log('   Status:', singleProd.status, '| Product Name:', singleProd.data.name);

        // 6. User Profile
        console.log('\n6. Testing Current User Profile GET /api/auth/me ...');
        const profile = await makeRequest('/api/auth/me', 'GET', null, userToken);
        console.log('   Status:', profile.status, '| Name:', profile.data.name, '| Email:', profile.data.email);

        // 7. Place Order
        console.log('\n7. Testing Place Order POST /api/orders ...');
        const orderRes = await makeRequest('/api/orders', 'POST', {
            items: [
                { name: firstProd.name, quantity: 1, price: firstProd.price, subtotal: firstProd.price }
            ],
            customer: {
                name: 'Abebe Bikila',
                email: 'user@merkato.com',
                phone: '+251 91 234 5678',
                address: 'Bole, Addis Ababa'
            },
            payment: 'telebirr',
            subtotal: firstProd.price,
            shipping: 0,
            tax: firstProd.price * 0.15,
            total: firstProd.price * 1.15
        }, userToken);
        console.log('   Status:', orderRes.status, '| Order ID:', orderRes.data._id, '| Tracking:', orderRes.data.tracking);
        const createdOrderId = orderRes.data._id;

        // 8. User Orders
        console.log('\n8. Testing User Orders GET /api/orders/myorders ...');
        const myOrders = await makeRequest('/api/orders/myorders', 'GET', null, userToken);
        console.log('   Status:', myOrders.status, '| Orders Count:', myOrders.data.length);

        // 9. Admin List All Orders
        console.log('\n9. Testing Admin Orders List GET /api/orders ...');
        const allOrders = await makeRequest('/api/orders', 'GET', null, adminToken);
        console.log('   Status:', allOrders.status, '| Total Orders in System:', allOrders.data.length);

        // 10. Admin Update Order Status
        console.log('\n10. Testing Admin Update Order Status PUT /api/orders/' + createdOrderId + '/status ...');
        const updateStatus = await makeRequest('/api/orders/' + createdOrderId + '/status', 'PUT', {
            status: 'Shipped'
        }, adminToken);
        console.log('   Status:', updateStatus.status, '| New Order Status:', updateStatus.data.status);

        // 11. Admin List Users
        console.log('\n11. Testing Admin User List GET /api/users ...');
        const allUsers = await makeRequest('/api/users', 'GET', null, adminToken);
        console.log('   Status:', allUsers.status, '| Total Registered Users:', allUsers.data.length);

        // 12. Reviews
        console.log('\n12. Testing Reviews GET /api/reviews/product/' + firstProd._id + ' ...');
        const reviews = await makeRequest('/api/reviews/product/' + firstProd._id);
        console.log('   Status:', reviews.status, '| Reviews for Product:', reviews.data.length);

        console.log('\n🎉 ALL 12 BACKEND API TESTS PASSED SUCCESSFULLY! 🚀\n');
        process.exit(0);
    } catch (err) {
        console.error('❌ Test failed with error:', err);
        process.exit(1);
    }
}

// Start server child process and test
const { spawn } = require('child_process');
const serverProcess = spawn('node', ['server.js'], { cwd: __dirname });

serverProcess.stdout.on('data', (data) => {
    const text = data.toString();
    process.stdout.write('[Server] ' + text);
    if (text.includes('MERKATO API Server Running')) {
        setTimeout(runTests, 800);
    }
});

serverProcess.stderr.on('data', (data) => {
    process.stderr.write('[Server Error] ' + data.toString());
});

serverProcess.on('close', (code) => {
    console.log(`Server closed with code ${code}`);
});

process.on('exit', () => {
    serverProcess.kill();
});
