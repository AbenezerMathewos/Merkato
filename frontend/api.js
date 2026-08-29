// ========================================
// MERKATO - API Client & Data Layer
// ========================================

const API_URL = 'http://localhost:5000/api';

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Get token from localStorage
    const token = localStorage.getItem('merkatoToken');
    if (token && token !== 'null' && token !== 'undefined') {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        let result;
        const text = await response.text();
        try {
            result = JSON.parse(text);
        } catch (e) {
            result = { message: text };
        }

        if (!response.ok) {
            throw new Error(result.message || `Request failed with status ${response.status}`);
        }

        return result;
    } catch (error) {
        console.warn(`[API] Error on ${method} ${endpoint}:`, error.message);
        throw error;
    }
}

// ========================================
// AUTH API
// ========================================

async function registerUser(userData) {
    const result = await apiCall('/auth/register', 'POST', userData);
    if (result && result.token) {
        localStorage.setItem('merkatoToken', result.token);
        localStorage.setItem('merkatoUser', JSON.stringify(result));
        localStorage.setItem('merkatoUserData', JSON.stringify(result));
    }
    return result;
}

async function loginUser(credentials) {
    const result = await apiCall('/auth/login', 'POST', credentials);
    if (result && result.token) {
        localStorage.setItem('merkatoToken', result.token);
        localStorage.setItem('merkatoUser', JSON.stringify(result));
        localStorage.setItem('merkatoUserData', JSON.stringify(result));
    }
    return result;
}

async function getCurrentUser() {
    return apiCall('/auth/me', 'GET');
}

async function updateUserProfile(userData) {
    const result = await apiCall('/auth/profile', 'PUT', userData);
    if (result) {
        const currentUser = getCurrentUserData() || {};
        const updated = { ...currentUser, ...result };
        localStorage.setItem('merkatoUser', JSON.stringify(updated));
        localStorage.setItem('merkatoUserData', JSON.stringify(updated));
    }
    return result;
}

function logoutUser() {
    localStorage.removeItem('merkatoToken');
    localStorage.removeItem('merkatoUser');
    localStorage.removeItem('merkatoUserData');
    window.location.href = 'login.html';
}

// ========================================
// PRODUCTS API
// ========================================

async function getProducts(params = {}) {
    let query = '';
    const qParts = [];
    if (params.aisle && params.aisle !== 'all') qParts.push(`aisle=${encodeURIComponent(params.aisle)}`);
    if (params.search) qParts.push(`search=${encodeURIComponent(params.search)}`);
    if (qParts.length > 0) query = '?' + qParts.join('&');

    try {
        const products = await apiCall(`/products${query}`, 'GET');
        localStorage.setItem('merkatoProducts', JSON.stringify(products));
        return products;
    } catch (err) {
        console.warn('Falling back to locally cached products');
        const cached = localStorage.getItem('merkatoProducts');
        if (cached) return JSON.parse(cached);
        throw err;
    }
}

async function getProduct(idOrSlug) {
    try {
        return await apiCall(`/products/${idOrSlug}`, 'GET');
    } catch (err) {
        const cached = localStorage.getItem('merkatoProducts');
        if (cached) {
            const list = JSON.parse(cached);
            const found = list.find(p => p._id === idOrSlug || p.id === idOrSlug || p.slug === idOrSlug || p.name.toLowerCase().includes(idOrSlug.toLowerCase()));
            if (found) return found;
        }
        throw err;
    }
}

async function createProduct(productData) {
    return apiCall('/products', 'POST', productData);
}

async function updateProduct(id, productData) {
    return apiCall(`/products/${id}`, 'PUT', productData);
}

async function deleteProduct(id) {
    return apiCall(`/products/${id}`, 'DELETE');
}

// ========================================
// ORDERS API
// ========================================

async function createOrder(orderData) {
    return apiCall('/orders', 'POST', orderData);
}

async function getMyOrders() {
    return apiCall('/orders/myorders', 'GET');
}

async function getAllOrders() {
    return apiCall('/orders', 'GET');
}

async function getOrder(id) {
    return apiCall(`/orders/${id}`, 'GET');
}

async function updateOrderStatus(id, status) {
    return apiCall(`/orders/${id}/status`, 'PUT', { status });
}

async function cancelOrder(id) {
    return apiCall(`/orders/${id}/cancel`, 'PUT');
}

// ========================================
// USERS API (Admin)
// ========================================

async function getUsers() {
    return apiCall('/users', 'GET');
}

async function deleteUser(id) {
    return apiCall(`/users/${id}`, 'DELETE');
}

// ========================================
// REVIEWS API
// ========================================

async function getProductReviews(productId) {
    try {
        return await apiCall(`/reviews/product/${productId}`, 'GET');
    } catch (err) {
        const reviews = JSON.parse(localStorage.getItem('merkatoReviews') || '{}');
        return reviews[productId] || [];
    }
}

async function addProductReview(reviewData) {
    try {
        return await apiCall('/reviews', 'POST', reviewData);
    } catch (err) {
        // Fallback local
        const reviews = JSON.parse(localStorage.getItem('merkatoReviews') || '{}');
        if (!reviews[reviewData.productId]) reviews[reviewData.productId] = [];
        const localRev = {
            id: 'rev_' + Date.now(),
            ...reviewData,
            helpful: 0,
            notHelpful: 0,
            date: new Date().toLocaleDateString()
        };
        reviews[reviewData.productId].unshift(localRev);
        localStorage.setItem('merkatoReviews', JSON.stringify(reviews));
        return localRev;
    }
}

// ========================================
// CHECK IF USER IS LOGGED IN
// ========================================

function isLoggedIn() {
    const token = localStorage.getItem('merkatoToken');
    const user = localStorage.getItem('merkatoUser');
    return !!token && !!user;
}

function getCurrentUserData() {
    const user = localStorage.getItem('merkatoUser');
    if (!user) return null;
    try {
        return JSON.parse(user);
    } catch (e) {
        return null;
    }
}

function isAdmin() {
    const user = getCurrentUserData();
    return !!user && user.isAdmin === true;
}

function getAuthToken() {
    return localStorage.getItem('merkatoToken');
}

// ========================================
// COUPONS & PROMOTIONS API
// ========================================

async function validateCouponAPI(code, subtotal) {
    try {
        return await apiCall('/coupons/validate', 'POST', { code, subtotal });
    } catch (err) {
        // Local fallback validation
        const localCoupons = {
            'MERKATO2026': { discountType: 'percentage', discountValue: 10, minOrder: 1000, freeShipping: true, description: '10% OFF + Free Shipping' },
            'HABESHA15': { discountType: 'percentage', discountValue: 15, minOrder: 1500, freeShipping: false, description: '15% OFF Ethiopian Specialty' },
            'ENKUTATASH': { discountType: 'fixed', discountValue: 500, minOrder: 2000, freeShipping: false, description: '500 ETB Flat Discount' },
            'FREESHIP': { discountType: 'shipping', discountValue: 100, minOrder: 500, freeShipping: true, description: 'Free Delivery' }
        };
        const upper = String(code).trim().toUpperCase();
        const found = localCoupons[upper];
        if (found) {
            if (subtotal < found.minOrder) {
                throw new Error(`Minimum order of ${found.minOrder.toLocaleString()} ETB required`);
            }
            let discountAmount = 0;
            if (found.discountType === 'percentage') discountAmount = Math.round((subtotal * found.discountValue) / 100);
            else if (found.discountType === 'fixed') discountAmount = Math.min(found.discountValue, subtotal);
            return {
                success: true,
                message: `🎉 Promo code "${upper}" applied!`,
                coupon: { code: upper, ...found, discountAmount }
            };
        }
        throw new Error(err.message || 'Invalid promo code');
    }
}

async function getCouponsAPI() {
    try {
        return await apiCall('/coupons', 'GET');
    } catch (err) {
        return [
            { code: 'MERKATO2026', discountType: 'percentage', discountValue: 10, minOrder: 1000, freeShipping: true, description: '10% OFF + Free Express Shipping' },
            { code: 'HABESHA15', discountType: 'percentage', discountValue: 15, minOrder: 1500, freeShipping: false, description: '15% OFF Ethiopian Items' },
            { code: 'ENKUTATASH', discountType: 'fixed', discountValue: 500, minOrder: 2000, freeShipping: false, description: '500 ETB flat discount' },
            { code: 'FREESHIP', discountType: 'shipping', discountValue: 100, minOrder: 500, freeShipping: true, description: 'Free City Delivery' }
        ];
    }
}

// ========================================
// PAYMENTS API (Telebirr, Chapa, CBE)
// ========================================

async function requestTelebirrPinAPI(phone, amount) {
    return apiCall('/payments/telebirr/request', 'POST', { phone, amount });
}

async function verifyTelebirrPinAPI(transactionId, pin) {
    return apiCall('/payments/telebirr/verify', 'POST', { transactionId, pin });
}

async function initiateChapaPaymentAPI(paymentData) {
    return apiCall('/payments/chapa/initialize', 'POST', paymentData);
}

async function verifyChapaPaymentAPI(txRef) {
    return apiCall('/payments/chapa/verify', 'POST', { txRef });
}

async function verifyCbePaymentAPI(paymentData) {
    return apiCall('/payments/cbe/verify', 'POST', paymentData);
}