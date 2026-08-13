// ========================================
// MERKATO - API Client
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
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Something went wrong');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ========================================
// AUTH API
// ========================================

async function registerUser(userData) {
    return apiCall('/auth/register', 'POST', userData);
}

async function loginUser(credentials) {
    const result = await apiCall('/auth/login', 'POST', credentials);
    if (result.token) {
        localStorage.setItem('merkatoToken', result.token);
        localStorage.setItem('merkatoUser', JSON.stringify(result));
    }
    return result;
}

async function getCurrentUser() {
    return apiCall('/auth/me', 'GET');
}

async function updateUserProfile(userData) {
    return apiCall('/auth/profile', 'PUT', userData);
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

async function getProducts() {
    return apiCall('/products', 'GET');
}

async function getProduct(id) {
    return apiCall(`/products/${id}`, 'GET');
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

async function getOrder(id) {
    return apiCall(`/orders/${id}`, 'GET');
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
// CHECK IF USER IS LOGGED IN
// ========================================

function isLoggedIn() {
    const token = localStorage.getItem('merkatoToken');
    return !!token;
}

function getCurrentUserData() {
    const user = localStorage.getItem('merkatoUser');
    return user ? JSON.parse(user) : null;
}

function isAdmin() {
    const user = getCurrentUserData();
    return user && user.isAdmin === true;
}