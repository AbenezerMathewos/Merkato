// ========================================
// MERKATO -  JavaScript File
// Version: 3.0
// ========================================

console.log('🛒 MERKATO JavaScript Loaded!');

// ========================================
// LOAD PRODUCTS FROM API
// ========================================

async function loadProductsFromAPI() {
    try {
        const products = await getProducts();
        console.log('✅ Products loaded from API:', products);
        // Store in localStorage for offline use
        localStorage.setItem('merkatoProducts', JSON.stringify(products));
        return products;
    } catch (error) {
        console.error('❌ Error loading products:', error);
        // Fallback to localStorage
        return JSON.parse(localStorage.getItem('merkatoProducts')) || [];
    }
}

// ========================================
// UPDATE LOGIN FUNCTION TO USE API
// ========================================

async function loginWithAPI(email, password) {
    try {
        const result = await loginUser({ email, password });
        if (result.token) {
            showNotification('✅ Login successful!');
            window.location.href = 'index.html';
        }
        return result;
    } catch (error) {
        showNotification('❌ Login failed: ' + error.message);
        return null;
    }
}

// ========================================
// UPDATE REGISTER FUNCTION TO USE API
// ========================================

async function registerWithAPI(name, email, password, phone, address) {
    try {
        const result = await registerUser({ name, email, password, phone, address });
        if (result.token) {
            showNotification('✅ Registration successful!');
            window.location.href = 'index.html';
        }
        return result;
    } catch (error) {
        showNotification('❌ Registration failed: ' + error.message);
        return null;
    }
}

// Wires up the "Create Account" form on login.html — previously this form
// had no submit handler at all, so registration silently did nothing.
async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('reg-name')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const phone = document.getElementById('reg-phone')?.value.trim();
    const password = document.getElementById('reg-password')?.value.trim();

    if (!name || !email || !phone || !password) {
        showNotification('⚠️ Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showNotification('⚠️ Password must be at least 6 characters');
        return;
    }

    await registerWithAPI(name, email, password, phone, '');
}
// ========================================
// PRODUCT STOCK DATA
// ========================================

const productStock = {
    'buna': { stock: 42, status: 'in-stock' },
    'berbere': { stock: 85, status: 'in-stock' },
    'teff': { stock: 110, status: 'in-stock' },
    'shiro': { stock: 200, status: 'in-stock' },
    'korerima': { stock: 75, status: 'in-stock' },
    'kibe': { stock: 60, status: 'in-stock' },
    'jebena': { stock: 45, status: 'in-stock' },
    'sini': { stock: 30, status: 'in-stock' },
    'rekebot': { stock: 18, status: 'low-stock' },
    'kemis': { stock: 25, status: 'in-stock' },
    'netela': { stock: 40, status: 'in-stock' },
    'gabi': { stock: 35, status: 'in-stock' },
    'mesob': { stock: 12, status: 'low-stock' },
    'barchuma': { stock: 20, status: 'in-stock' },
    'mitad': { stock: 15, status: 'low-stock' },
    'tv': { stock: 8, status: 'low-stock' },
    'solar': { stock: 12, status: 'low-stock' },
    'phone': { stock: 30, status: 'in-stock' }
};

// ===== TRACK WELCOME MESSAGE =====
let hasShownWelcome = false;

// ========================================
// USER LOGIN SYSTEM
// ========================================

let currentUser = null;

// Default user data structure
const defaultUserData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    joinDate: new Date().toLocaleDateString()
};

function showWelcomeMessage(userName) {
    let notification = document.querySelector('.welcome-notification');
    if (notification) {
        notification.remove();
    }
    
    notification = document.createElement('div');
    notification.className = 'welcome-notification';
    notification.innerHTML = `
        <div style="text-align:center;padding:20px;">
            <div style="font-size:48px;margin-bottom:10px;">🎉</div>
            <h2 style="color:#fff;margin-bottom:5px;">Welcome, ${userName}!</h2>
            <p style="color:rgba(255,255,255,0.8);">You have successfully signed in to MERKATO</p>
            <div style="margin-top:15px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
                <span style="background:rgba(255,215,0,0.2);padding:4px 12px;border-radius:20px;font-size:12px;color:#ffd700;">✨ ${userName}</span>
            </div>
        </div>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '30px 50px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        borderRadius: '16px',
        zIndex: '99999',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        fontFamily: "'Segoe UI', sans-serif",
        minWidth: '350px',
        maxWidth: '90%',
        border: '2px solid #ffd700',
        animation: 'welcomePopup 0.5s ease'
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes welcomePopup {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// ========================================
// USER DISPLAY & DROPDOWN - UPDATED
// ========================================

function updateUserDisplay() {
    const nav = document.querySelector('.nav');
    const signInLink = nav ? nav.querySelector('.nav-login, a[href="login.html"]') : null;
    const previousDisplay = document.querySelector('.user-dropdown-container');
    if (previousDisplay) previousDisplay.remove();

    if (signInLink) signInLink.style.display = '';

    const savedUser = localStorage.getItem('merkatoUser');
    if (!savedUser) return;

    let user;
    try {
        user = JSON.parse(savedUser);
    } catch (error) {
        localStorage.removeItem('merkatoUser');
        return;
    }

    currentUser = user;
    if (signInLink) signInLink.style.display = 'none';

    let host = document.getElementById('profileContainer');
    if (!host) {
        host = document.createElement('div');
        host.id = 'profileContainer';
    }
    if (host.parentElement !== document.body) {
        document.body.appendChild(host);
    }

    const safeName = escapeMarkup(user.name || 'My account');
    const safeEmail = escapeMarkup(user.email || '');
    const userContainer = document.createElement('div');
    userContainer.className = 'user-dropdown-container';
    userContainer.innerHTML = `
        <button class="user-trigger" type="button" aria-expanded="false" aria-controls="userMenu">
            <span class="user-avatar" aria-hidden="true">👤</span>
            <span class="user-name">${safeName}</span>
            <span class="user-chevron" aria-hidden="true">✨</span>
        </button>
        <div class="user-dropdown" id="userMenu" role="menu">
            <div class="dropdown-header">
                <div class="name">${safeName}</div>
                <div class="email">${safeEmail}</div>
            </div>
            <a href="profile.html" role="menuitem"><span aria-hidden="true">👤</span> My Profile</a>
            <a href="orders.html" role="menuitem"><span aria-hidden="true">📦</span> My Orders</a>
            <button class="logout-link" type="button" role="menuitem"><span aria-hidden="true">🚪</span> Logout</button>
        </div>`;
    host.appendChild(userContainer);

    const trigger = userContainer.querySelector('.user-trigger');
    const dropdown = userContainer.querySelector('.user-dropdown');
    const logout = userContainer.querySelector('.logout-link');

    trigger.addEventListener('click', event => {
        event.stopPropagation();
        const isOpen = dropdown.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
    });
    logout.addEventListener('click', logoutUser);
    document.addEventListener('click', event => {
        if (!userContainer.contains(event.target)) {
            dropdown.classList.remove('is-open');
            trigger.setAttribute('aria-expanded', 'false');
        }
    });
}

function escapeMarkup(value) {
    return String(value || '').replace(/[&<>'"]/g, character => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));
}

// ========================================
// ORDERS PAGE FUNCTION
// ========================================

function loadOrders() {
    const userData = localStorage.getItem('merkatoUser');
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    let orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    
    if (orders.length === 0) {
        orders = [
            {
                id: 'MER-2026-001',
                date: 'July 25, 2026',
                items: [
                    { name: 'Yirgacheffe Buna', quantity: 2, price: 2500 },
                    { name: 'Electric Mitad', quantity: 1, price: 18500 }
                ],
                total: 23500,
                status: 'Processing',
                tracking: 'ET-2026-0784-001'
            },
            {
                id: 'MER-2026-002',
                date: 'July 20, 2026',
                items: [
                    { name: 'Sini Ceramic Cups', quantity: 1, price: 1200 },
                    { name: 'Magna White Teff', quantity: 1, price: 4200 }
                ],
                total: 5400,
                status: 'Delivered',
                tracking: 'ET-2026-0784-002'
            }
        ];
        localStorage.setItem('merkatoOrders', JSON.stringify(orders));
    }
    
    displayOrders(orders);
}

function displayOrders(orders) {
    const container = document.querySelector('.orders-container');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px 20px;">
                <div style="font-size:64px;margin-bottom:20px;">📦</div>
                <h3 style="font-size:24px;color:#1a1a2e;">No Orders Yet</h3>
                <p style="color:#888;margin:10px 0 20px;">Start shopping and your orders will appear here!</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping →</a>
            </div>
        `;
        return;
    }
    
    let html = '';
    orders.forEach((order) => {
        const statusColor = order.status === 'Delivered' ? '#008000' : 
                           order.status === 'Processing' ? '#ffa500' : 
                           order.status === 'Shipped' ? '#0066cc' : '#d9534f';
        
        html += `
            <div style="
                background: #fff;
                border-radius: 12px;
                border: 1px solid #e0e0e0;
                margin-bottom: 20px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                transition: all 0.3s ease;
            " onmouseover="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'" onmouseout="this.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'">
                <div style="
                    padding: 16px 20px;
                    background: #f8f9fa;
                    border-bottom: 1px solid #e0e0e0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 10px;
                ">
                    <div>
                        <strong style="color: #1a1a2e;">Order #${order.id}</strong>
                        <span style="color: #888;font-size:13px;margin-left:12px;">${order.date}</span>
                    </div>
                    <div>
                        <span style="
                            display: inline-block;
                            padding: 4px 14px;
                            border-radius: 20px;
                            font-size: 12px;
                            font-weight: 600;
                            background: ${statusColor}15;
                            color: ${statusColor};
                        ">${order.status}</span>
                    </div>
                </div>
                <div style="padding: 16px 20px;">
                    ${order.items.map(item => `
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            padding: 6px 0;
                            border-bottom: 1px solid #f5f5f5;
                            font-size: 14px;
                        ">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>${(item.price * item.quantity).toLocaleString()} ETB</span>
                        </div>
                    `).join('')}
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 0 0 0;
                        border-top: 2px solid #f0f0f0;
                        margin-top: 8px;
                        font-weight: 700;
                        font-size: 16px;
                    ">
                        <span>Total</span>
                        <span style="color: #d9534f;">${order.total.toLocaleString()} ETB</span>
                    </div>
                    ${order.tracking ? `
                        <div style="margin-top: 10px;font-size:13px;color:#888;">
                            📦 Tracking: ${order.tracking}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ========================================
// PROFILE FUNCTIONS
// ========================================

async function loadUserProfile() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const addressInput = document.getElementById('profile-address');
    const joinDateDisplay = document.getElementById('profile-join-date');
    
    let user;
    try {
        user = await getCurrentUser();
    } catch (error) {
        console.error('Error loading profile:', error);
        showNotification('⚠️ Could not load your profile from server');
        user = getCurrentUserData() || {};
    }
    
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (addressInput) addressInput.value = user.address || '';
    if (joinDateDisplay) joinDateDisplay.textContent = user.joinDate ? new Date(user.joinDate).toLocaleDateString() : new Date().toLocaleDateString();
}

async function saveUserProfile() {
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const addressInput = document.getElementById('profile-address');
    
    if (!nameInput || !emailInput) {
        showNotification('⚠️ Required fields missing');
        return;
    }
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    
    if (!name || !email) {
        showNotification('⚠️ Name and Email are required');
        return;
    }
    
    try {
        const updatedUser = await updateUserProfile({ name, email, phone, address });
        
        localStorage.setItem('merkatoUser', JSON.stringify(updatedUser));
        localStorage.setItem('merkatoUserData', JSON.stringify(updatedUser));
        currentUser = updatedUser;
        
        showNotification('✅ Profile saved successfully!');
        updateUserDisplay();
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        showNotification('❌ Failed to save profile: ' + error.message);
    }
}

function checkUserOnLoad() {
    const userData = localStorage.getItem('merkatoUser');
    if (userData) {
        const user = JSON.parse(userData);
        currentUser = user;
        updateUserDisplay();
        
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
            if (!hasShownWelcome && !sessionStorage.getItem('welcomeShown')) {
                hasShownWelcome = true;
                sessionStorage.setItem('welcomeShown', 'true');
                setTimeout(() => {
                    showWelcomeBack(user.name);
                }, 500);
            }
        }
    } else {
        if (window.location.pathname.includes('profile.html')) {
            window.location.href = 'login.html';
        }
    }
}

function showWelcomeBack(userName) {
    if (sessionStorage.getItem('welcomeShown') === 'true') {
        return;
    }
    
    let notification = document.querySelector('.welcome-notification');
    if (notification) {
        notification.remove();
    }
    
    notification = document.createElement('div');
    notification.className = 'welcome-notification';
    notification.innerHTML = `
        <div style="text-align:center;padding:15px 25px;">
            <div style="font-size:32px;margin-bottom:5px;">👋</div>
            <h3 style="color:#fff;margin-bottom:5px;">Welcome back, ${userName}!</h3>
            <p style="color:rgba(255,255,255,0.7);font-size:13px;">Good to see you again at MERKATO</p>
        </div>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        padding: '15px 25px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: '#fff',
        borderRadius: '12px',
        zIndex: '9999',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        fontFamily: "'Segoe UI', sans-serif",
        border: '1px solid #ffd700',
        animation: 'slideInRight 0.5s ease',
        maxWidth: '350px'
    });
    
    document.body.appendChild(notification);
    sessionStorage.setItem('welcomeShown', 'true');
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3500);
}

// ========================================
// CART SYSTEM
// ========================================

let cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('merkatoCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
    displayCartItems();
}

function saveCart() {
    localStorage.setItem('merkatoCart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, name, price, image) {
    console.log('Adding to cart:', productId, name, price);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: parseFloat(price),
            image: image || '',
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    displayCartItems();
    showNotification(`${name} added to cart! ✅`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCartItems();
    showNotification('Item removed from cart ❌');
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartCount();
        displayCartItems();
    }
}

function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    displayCartItems();
    showNotification('Cart cleared 🗑️');
}

function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart, .cart-badge');
    const count = getCartCount();
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = count;
        }
    });
}

function displayCartItems() {
    const cartContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div style="text-align:center;padding:60px 20px;">
                <div style="font-size:64px;margin-bottom:20px;">🛒</div>
                <h3 style="font-size:24px;color:#1a1a2e;">Your cart is empty</h3>
                <p style="color:#888;margin:10px 0 20px;">Browse our products and add items you love!</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping →</a>
            </div>
        `;
        
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
        return;
    }
    
    if (cartSummary) {
        cartSummary.style.display = 'block';
    }
    
    let html = `
        <h2>
            Cart Items
            <span>${getCartCount()} Items</span>
        </h2>
    `;
    
    cart.forEach((item) => {
        html += `
            <div class="cart-item" data-product-id="${item.id}">
                <a href="product-detail.html?${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                </a>
                <div class="item-details">
                    <h3><a href="product-detail.html?${item.id}">${item.name}</a></h3>
                    <div class="price">${item.price.toLocaleString()} ETB</div>
                    <div style="font-size:13px;color:#888;margin-top:4px;">
                        Subtotal: ${(item.price * item.quantity).toLocaleString()} ETB
                    </div>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button type="button" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                        <input type="number" value="${item.quantity}" min="1" max="99" 
                               onchange="updateQuantity('${item.id}', parseInt(this.value))">
                        <button type="button" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button type="button" class="remove-btn" onclick="removeFromCart('${item.id}')">✕ Remove</button>
                </div>
            </div>
        `;
    });
    
    html += `
        <div style="text-align:center;padding:15px 0;border-top:2px solid #f0f0f0;margin-top:10px;">
            <small>🛒 <a href="shop.html" style="color:#008000;font-weight:600;">Add more items from the Supermarket Floor</a></small>
        </div>
    `;
    
    cartContainer.innerHTML = html;
    updateCartSummary();
}

function updateCartSummary() {
    const summaryContainer = document.querySelector('.cart-summary');
    if (!summaryContainer || cart.length === 0) return;
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 3000 ? 0 : 200;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    const freeShipping = subtotal > 3000;
    
    summaryContainer.innerHTML = `
        <h2>📋 Order Summary</h2>
        
        <div class="summary-row">
            <span class="label">Subtotal (${getCartCount()} items)</span>
            <span class="value">${subtotal.toLocaleString()} ETB</span>
        </div>
        <div class="summary-row">
            <span class="label">Shipping</span>
            <span class="value" style="color: ${freeShipping ? '#00b894' : '#d9534f'}">
                ${freeShipping ? 'FREE' : '200 ETB'}
            </span>
        </div>
        <div class="summary-row">
            <span class="label">Tax (VAT 15%)</span>
            <span class="value">${tax.toLocaleString()} ETB</span>
        </div>
        
        <div class="free-shipping">
            ${freeShipping ? '🎉 <strong>You saved 200 ETB</strong> on shipping! Free delivery on orders over 3,000 ETB' : '💡 Add <strong>' + (3000 - subtotal).toLocaleString() + ' ETB</strong> more for free shipping!'}
        </div>
        
        <div class="summary-row total">
            <span class="label">Total</span>
            <span class="value">${total.toLocaleString()} ETB</span>
        </div>
        
        <a href="checkout.html" class="checkout-btn">Proceed to Checkout →</a>
        
        <div class="promo-section">
            <h3>🎁 Promo Code</h3>
            <div class="promo-input">
                <input type="text" placeholder="Enter promo code" id="promoInput">
                <button type="button" onclick="applyPromo()">Apply</button>
            </div>
            <small style="color: #888; display: block; margin-top: 8px;">
                💡 Code: <strong style="color: #ffd700;">MERKATO2026</strong> - Free shipping on orders over 3,000 ETB
            </small>
        </div>
        
        <a href="shop.html" class="continue-shopping">← Continue Shopping</a>
    `;
}

let promoApplied = false;

function applyPromo() {
    const input = document.getElementById('promoInput');
    if (!input) return;
    
    const code = input.value.trim().toUpperCase();
    
    if (code === 'MERKATO2026') {
        if (!promoApplied) {
            promoApplied = true;
            showNotification('🎉 Promo code applied! Free shipping activated!');
            
            const subtotal = getCartTotal();
            const tax = subtotal * 0.15;
            const total = subtotal + tax;
            
            const totalRow = document.querySelector('.summary-row.total .value');
            if (totalRow) {
                totalRow.textContent = total.toLocaleString() + ' ETB';
            }
            
            input.disabled = true;
            input.nextElementSibling.textContent = '✅ Applied';
        }
    } else {
        showNotification('❌ Invalid promo code');
    }
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message) {
    let notification = document.querySelector('.notification');
    
    if (notification) {
        notification.remove();
    }
    
    notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        background: '#1a1a2e',
        color: '#fff',
        borderRadius: '10px',
        zIndex: '9999',
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        fontFamily: "'Segoe UI', sans-serif",
        fontSize: '14px',
        fontWeight: '600',
        borderLeft: '4px solid #008000',
        maxWidth: '350px',
        animation: 'slideInRight 0.5s ease'
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// ========================================
// SEARCH FUNCTION
// ========================================

function searchProducts(searchTerm) {
    const input = document.querySelector('.search-form input[type="search"]');
    const filter = (searchTerm === undefined ? input?.value : searchTerm || '').trim().toLowerCase();
    const cards = Array.from(document.querySelectorAll('.product-card'));
    if (!cards.length) return 0;

    let matches = 0;
    cards.forEach(card => {
        const searchableText = [
            card.textContent,
            card.dataset.aisle,
            card.querySelector('img')?.alt
        ].join(' ').toLowerCase();
        const visible = !filter || searchableText.includes(filter);
        card.hidden = !visible;
        if (visible) matches += 1;
    });

    document.querySelectorAll('section[id^="aisle-"]').forEach(section => {
        const sectionCards = section.querySelectorAll('.product-card');
        if (sectionCards.length) {
            section.hidden = Boolean(filter) && !Array.from(sectionCards).some(card => !card.hidden);
        }
    });

    let status = document.getElementById('searchStatus');
    if (!status) {
        status = document.createElement('div');
        status.id = 'searchStatus';
        status.className = 'search-status';
        const firstAisle = document.querySelector('section[id^="aisle-"]');
        if (firstAisle) firstAisle.parentNode.insertBefore(status, firstAisle);
    }
    if (status) {
        status.hidden = !filter;
        status.textContent = filter
            ? (matches ? `${matches} item${matches === 1 ? '' : 's'} found for “${filter}”.` : `No items found for “${filter}”. Try coffee, teff, spices, electronics, or home.`)
            : '';
        status.classList.toggle('is-empty', Boolean(filter) && matches === 0);
    }
    return matches;
}

function initialiseSearch() {
    const form = document.querySelector('.search-form');
    const input = form?.querySelector('input[type="search"]');
    if (!form || !input) return;

    const pageIsShop = /shop\.html$/i.test(window.location.pathname);
    const initialQuery = new URLSearchParams(window.location.search).get('search') || '';
    if (pageIsShop && initialQuery) {
        input.value = initialQuery;
        searchProducts(initialQuery);
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        const query = input.value.trim();
        if (!query) return;
        if (pageIsShop) {
            const url = new URL(window.location.href);
            url.searchParams.set('search', query);
            window.history.replaceState({}, '', url);
            searchProducts(query);
        } else {
            window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
        }
    });

    if (pageIsShop) {
        input.addEventListener('input', () => searchProducts());
    }
}

function initAddToCartButtons() {
    console.log('Initializing Add to Cart buttons...');
    
    const buttons = document.querySelectorAll('.add-to-cart');
    console.log('Found', buttons.length, 'add to cart buttons');
    
    buttons.forEach((button) => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productPrice = this.dataset.productPrice;
            const productImage = this.dataset.productImage || '';
            
            console.log('Button clicked:', productId, productName, productPrice);
            
            if (productId && productName && productPrice) {
                addToCart(productId, productName, productPrice, productImage);
            } else {
                console.error('Missing data attributes on button:', this);
                showNotification('⚠️ Error adding item to cart');
            }
        });
    });
}

// ========================================
// BACK TO TOP
// ========================================

document.querySelectorAll('.back-to-top').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// ========================================
// PRODUCT REVIEWS & RATINGS SYSTEM (FIXED)
// ========================================

let reviews = {};
let selectedRatings = {};

function loadReviews() {
    const savedReviews = localStorage.getItem('merkatoReviews');
    if (savedReviews) {
        reviews = JSON.parse(savedReviews);
    } else {
        reviews = {
            'buna': [
                {
                    id: 'r1',
                    userName: 'Abebe Bikila',
                    rating: 5,
                    comment: 'Excellent coffee! Best Yirgacheffe I\'ve ever had. Rich flavor and amazing aroma.',
                    date: 'July 20, 2026',
                    verified: true,
                    helpful: 12
                },
                {
                    id: 'r2',
                    userName: 'Tigist Worku',
                    rating: 4,
                    comment: 'Very good quality coffee. Fresh and aromatic. Will buy again!',
                    date: 'July 25, 2026',
                    verified: true,
                    helpful: 8
                }
            ],
            'mitad': [
                {
                    id: 'r3',
                    userName: 'Dawit Hailu',
                    rating: 5,
                    comment: 'This electric mitad is a game changer! Perfect injera every time.',
                    date: 'July 18, 2026',
                    verified: true,
                    helpful: 15
                }
            ],
            'kemis': [
                {
                    id: 'r4',
                    userName: 'Meron Tekle',
                    rating: 5,
                    comment: 'Beautiful traditional dress! The embroidery is stunning. Exactly as pictured.',
                    date: 'July 22, 2026',
                    verified: true,
                    helpful: 6
                }
            ]
        };
        localStorage.setItem('merkatoReviews', JSON.stringify(reviews));
    }
    return reviews;
}

function saveReviews() {
    localStorage.setItem('merkatoReviews', JSON.stringify(reviews));
}

function addReview(productId, userName, rating, comment, userEmail) {
    if (!reviews[productId]) {
        reviews[productId] = [];
    }
    
    const uniqueId = 'r' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    
    let verified = false;
    const orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    
    orders.forEach(order => {
        order.items.forEach(item => {
            const productName = productId.toLowerCase();
            const itemName = item.name.toLowerCase();
            if (itemName.includes(productName) || 
                productName.includes(itemName.split(' ')[0]) ||
                itemName.includes(productName.split(' ')[0])) {
                verified = true;
            }
        });
    });
    
    if (userEmail && !verified) {
        verified = true;
    }
    
    const newReview = {
        id: uniqueId,
        userName: userName || 'Anonymous',
        rating: parseInt(rating),
        comment: comment.trim(),
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        verified: verified,
        helpful: 0,
        notHelpful: 0
    };
    
    reviews[productId].push(newReview);
    saveReviews();
    displayReviews(productId);
    updateAverageRating(productId);
    
    showNotification('✅ Your review has been posted!');
    return newReview;
}

function getAverageRating(productId) {
    if (!reviews[productId] || reviews[productId].length === 0) {
        return 0;
    }
    const total = reviews[productId].reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews[productId].length);
}

function getReviewCount(productId) {
    if (!reviews[productId]) return 0;
    return reviews[productId].length;
}

function updateAverageRating(productId) {
    const avg = getAverageRating(productId);
    const count = getReviewCount(productId);
    
    const ratingContainer = document.querySelector(`.product-rating[data-product-id="${productId}"]`);
    if (ratingContainer) {
        const stars = ratingContainer.querySelector('.stars');
        const avgDisplay = ratingContainer.querySelector('.avg-rating');
        const countDisplay = ratingContainer.querySelector('.review-count');
        
        if (stars) {
            stars.innerHTML = renderStars(avg);
        }
        if (avgDisplay) {
            avgDisplay.textContent = avg.toFixed(1);
        }
        if (countDisplay) {
            countDisplay.textContent = count;
        }
    }
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let starsHtml = '';
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '⭐';
    }
    if (halfStar) {
        starsHtml += '⭐';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '☆';
    }
    return starsHtml;
}

function displayReviews(productId) {
    const container = document.querySelector(`.reviews-container[data-product-id="${productId}"]`);
    if (!container) return;
    
    const productReviews = reviews[productId] || [];
    const total = productReviews.length;
    
    if (total === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:30px;color:#888;">
                <div style="font-size:40px;margin-bottom:10px;">📝</div>
                <p>No reviews yet. Be the first to review this product!</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="margin-bottom:15px;font-size:14px;color:#666;">
            <strong>${total}</strong> ${total === 1 ? 'review' : 'reviews'}
        </div>
    `;
    
    productReviews.forEach((review, index) => {
        const voted = localStorage.getItem(`helpful_${review.id}`);
        
        const verifiedBadge = review.verified 
            ? '<span style="font-size:11px;background:#008000;color:#fff;padding:2px 10px;border-radius:12px;margin-left:6px;font-weight:600;">✓ Verified</span>' 
            : '';
        
        const helpfulCount = review.helpful || 0;
        const notHelpfulCount = review.notHelpful || 0;
        const totalVotes = helpfulCount + notHelpfulCount;
        
        let helpfulButtonStyle, notHelpfulButtonStyle;
        let helpfulText, notHelpfulText;
        
        if (voted === 'helpful') {
            helpfulButtonStyle = 'background:#e8f5e9;border:1px solid #008000;cursor:default;font-size:13px;color:#008000;padding:4px 12px;border-radius:4px;font-weight:600;';
            helpfulText = '✅ Helpful';
            notHelpfulButtonStyle = 'background:none;border:1px solid #ddd;cursor:not-allowed;font-size:13px;color:#ccc;padding:4px 12px;border-radius:4px;opacity:0.5;';
            notHelpfulText = '👎 Not Helpful';
        } else if (voted === 'not-helpful') {
            helpfulButtonStyle = 'background:none;border:1px solid #ddd;cursor:not-allowed;font-size:13px;color:#ccc;padding:4px 12px;border-radius:4px;opacity:0.5;';
            helpfulText = '👍 Helpful';
            notHelpfulButtonStyle = 'background:#ffebee;border:1px solid #d9534f;cursor:default;font-size:13px;color:#d9534f;padding:4px 12px;border-radius:4px;font-weight:600;';
            notHelpfulText = '✅ Not Helpful';
        } else {
            helpfulButtonStyle = 'background:none;border:1px solid #ddd;cursor:pointer;font-size:13px;color:#555;padding:4px 12px;border-radius:4px;transition:all 0.2s ease;';
            helpfulText = '👍 Helpful';
            notHelpfulButtonStyle = 'background:none;border:1px solid #ddd;cursor:pointer;font-size:13px;color:#555;padding:4px 12px;border-radius:4px;transition:all 0.2s ease;';
            notHelpfulText = '👎 Not Helpful';
        }
        
        html += `
            <div style="
                background: ${index % 2 === 0 ? '#f8f9fa' : '#fff'};
                padding: 16px 20px;
                border-radius: 8px;
                margin-bottom: 12px;
                border: 1px solid #f0f0f0;
                transition: all 0.3s ease;
            " onmouseover="this.style.borderColor='#008000'" onmouseout="this.style.borderColor='#f0f0f0'">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                    <div>
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <span style="font-weight:600;color:#1a1a2e;">${review.userName}</span>
                            ${verifiedBadge}
                        </div>
                        <div style="font-size:13px;color:#888;margin-top:2px;">
                            ${review.date}
                        </div>
                    </div>
                    <div style="font-size:18px;">
                        ${'⭐'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
                <div style="margin-top:8px;color:#444;line-height:1.6;">
                    ${review.comment}
                </div>
                
                <div style="margin-top:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                    <button onclick="markHelpful('${review.id}', '${productId}', 'helpful')" 
                            style="${helpfulButtonStyle}"
                            ${voted ? 'disabled' : ''}
                            onmouseover="${!voted ? 'this.style.background=\"#e8f5e9\";this.style.borderColor=\"#008000\"' : ''}" 
                            onmouseout="${!voted ? 'this.style.background=\"none\";this.style.borderColor=\"#ddd\"' : ''}">
                        ${helpfulText}
                    </button>
                    
                    <button onclick="markHelpful('${review.id}', '${productId}', 'not-helpful')" 
                            style="${notHelpfulButtonStyle}"
                            ${voted ? 'disabled' : ''}
                            onmouseover="${!voted ? 'this.style.background=\"#ffebee\";this.style.borderColor=\"#d9534f\"' : ''}" 
                            onmouseout="${!voted ? 'this.style.background=\"none\";this.style.borderColor=\"#ddd\"' : ''}">
                        ${notHelpfulText}
                    </button>
                    
                    <span style="font-size:12px;color:#888;margin-left:5px;">
                        ${totalVotes > 0 ? `${helpfulCount} 👍 / ${notHelpfulCount} 👎` : 'Be the first to vote'}
                    </span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function highlightStars(productId, count) {
    for (let i = 1; i <= 5; i++) {
        const star = document.querySelector(`.star-${i}-${productId}`);
        if (star) {
            if (i <= count) {
                star.style.color = '#ffd700';
                star.textContent = '⭐';
            } else {
                star.style.color = '#ddd';
                star.textContent = '☆';
            }
        }
    }
}

function resetStars(productId) {
    const selected = selectedRatings[productId] || 0;
    for (let i = 1; i <= 5; i++) {
        const star = document.querySelector(`.star-${i}-${productId}`);
        if (star) {
            if (i <= selected) {
                star.style.color = '#ffd700';
                star.textContent = '⭐';
            } else {
                star.style.color = '#ddd';
                star.textContent = '☆';
            }
        }
    }
}

function setRating(productId, count) {
    selectedRatings[productId] = count;
    const ratingInput = document.getElementById(`review-rating-${productId}`);
    if (ratingInput) {
        ratingInput.value = count;
    }
    highlightStars(productId, count);
}

function submitReview(productId) {
    const ratingInput = document.getElementById(`review-rating-${productId}`);
    const commentInput = document.getElementById(`review-comment-${productId}`);
    
    if (!ratingInput || !commentInput) {
        showNotification('⚠️ Review form not found');
        return;
    }
    
    const rating = parseInt(ratingInput.value);
    const comment = commentInput.value.trim();
    
    if (!rating || rating === 0) {
        showNotification('⚠️ Please select a star rating');
        return;
    }
    
    if (!comment) {
        showNotification('⚠️ Please write a review');
        return;
    }
    
    let userName = 'Anonymous';
    let userEmail = '';
    const userData = localStorage.getItem('merkatoUser');
    if (userData) {
        const user = JSON.parse(userData);
        userName = user.name || 'Anonymous';
        userEmail = user.email || '';
    }
    
    addReview(productId, userName, rating, comment, userEmail);
    
    ratingInput.value = 0;
    commentInput.value = '';
    selectedRatings[productId] = 0;
    resetStars(productId);
    
    displayReviews(productId);
    updateAverageRating(productId);
}

function markHelpful(reviewId, productId, voteType) {
    const productReviews = reviews[productId] || [];
    const reviewIndex = productReviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) {
        showNotification('⚠️ Review not found');
        return;
    }
    
    const votedKey = `helpful_${reviewId}`;
    const voted = localStorage.getItem(votedKey);
    if (voted) {
        showNotification('⚠️ You already voted on this review');
        return;
    }
    
    if (voteType === 'helpful') {
        reviews[productId][reviewIndex].helpful = (reviews[productId][reviewIndex].helpful || 0) + 1;
    } else if (voteType === 'not-helpful') {
        reviews[productId][reviewIndex].notHelpful = (reviews[productId][reviewIndex].notHelpful || 0) + 1;
    }
    
    saveReviews();
    localStorage.setItem(votedKey, voteType);
    
    displayReviews(productId);
    
    const message = voteType === 'helpful' 
        ? '👍 Thank you for your feedback!' 
        : '👎 Thank you for your honest feedback!';
    showNotification(message);
}

// ========================================
// WISHLIST SYSTEM
// ========================================

let wishlist = [];

function loadWishlist() {
    const savedWishlist = localStorage.getItem('merkatoWishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
    updateWishlistCount();
    displayWishlist();
}

function saveWishlist() {
    localStorage.setItem('merkatoWishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    displayWishlist();
}

function addToWishlist(productId, name, price, image, aisle) {
    const existing = wishlist.find(item => item.id === productId);
    if (existing) {
        showNotification('❤️ Already in wishlist');
        return;
    }
    
    wishlist.push({
        id: productId,
        name: name,
        price: parseFloat(price),
        image: image || '',
        aisle: aisle || ''
    });
    
    saveWishlist();
    updateWishlistButtons();
    showNotification(`❤️ ${name} added to wishlist!`);
}

function removeFromWishlist(productId) {
    const item = wishlist.find(item => item.id === productId);
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist();
    updateWishlistButtons();
    if (item) {
        showNotification(`❌ ${item.name} removed from wishlist`);
    }
}

function moveToCart(productId) {
    const item = wishlist.find(item => item.id === productId);
    if (!item) {
        showNotification('⚠️ Item not found in wishlist');
        return;
    }
    
    addToCart(item.id, item.name, item.price, item.image);
    removeFromWishlist(productId);
    showNotification(`🛒 ${item.name} moved to cart!`);
}

function moveAllToCart() {
    if (wishlist.length === 0) {
        showNotification('⚠️ Your wishlist is empty');
        return;
    }
    
    wishlist.forEach(item => {
        addToCart(item.id, item.name, item.price, item.image);
    });
    
    wishlist = [];
    saveWishlist();
    updateWishlistButtons();
    showNotification('🛒 All items moved to cart!');
}

function clearWishlist() {
    if (wishlist.length === 0) {
        showNotification('⚠️ Your wishlist is already empty');
        return;
    }
    
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
        wishlist = [];
        saveWishlist();
        updateWishlistButtons();
        showNotification('🗑️ Wishlist cleared');
    }
}

function updateWishlistCount() {
    const count = wishlist.length;
    const elements = document.querySelectorAll('.wishlist-count');
    elements.forEach(el => {
        el.textContent = count;
    });
}

function updateWishlistButtons() {
    const buttons = document.querySelectorAll('.wishlist-btn');
    buttons.forEach(btn => {
        const id = btn.dataset.productId;
        if (wishlist.find(item => item.id === id)) {
            btn.textContent = '❤️';
            btn.style.color = '#d9534f';
            btn.title = 'Remove from wishlist';
        } else {
            btn.textContent = '🤍';
            btn.style.color = '#888';
            btn.title = 'Add to wishlist';
        }
    });
}

function displayWishlist() {
    const grid = document.getElementById('wishlistGrid');
    if (!grid) return;
    
    if (wishlist.length === 0) {
        grid.innerHTML = `
            <div class="empty-wishlist" style="grid-column:1/-1;">
                <div class="icon">🤍</div>
                <h3>Your wishlist is empty</h3>
                <p>Browse our products and add items you love!</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping →</a>
            </div>
        `;
        return;
    }
    
    let html = '';
    wishlist.forEach(item => {
        html += `
            <div class="wishlist-card" data-product-id="${item.id}">
                <button class="remove-btn" onclick="removeFromWishlist('${item.id}')" title="Remove from wishlist">✕</button>
                <a href="product-detail.html?id=${item.id}">
                    <img src="${item.image || 'https://via.placeholder.com/130x130?text=No+Image'}" alt="${item.name}">
                </a>
                <div class="aisle-tag">${item.aisle || 'Aisle'}</div>
                <h3><a href="product-detail.html?id=${item.id}">${item.name}</a></h3>
                <div class="price">${item.price.toLocaleString()} ETB</div>
                <button class="btn btn-primary btn-sm move-to-cart-btn" onclick="moveToCart('${item.id}')">
                    🛒 Move to Cart
                </button>
            </div>
        `;
    });
    
    html += `
        <div style="grid-column:1/-1;text-align:center;padding:20px 0;">
            <div class="wishlist-actions">
                <button class="btn btn-success" onclick="moveAllToCart()">🛒 Move All to Cart</button>
                <button class="btn btn-danger" onclick="clearWishlist()">🗑️ Clear Wishlist</button>
                <a href="shop.html" class="btn btn-secondary">← Continue Shopping</a>
            </div>
        </div>
    `;
    
    grid.innerHTML = html;
}

function toggleWishlist(button) {
    const productId = button.dataset.productId;
    const productName = button.dataset.productName;
    const productPrice = button.dataset.productPrice;
    const productImage = button.dataset.productImage || '';
    const productAisle = button.dataset.aisle || '';
    
    const existing = wishlist.find(item => item.id === productId);
    if (existing) {
        removeFromWishlist(productId);
        button.textContent = '🤍 Wishlist';
        button.style.color = '#888';
        button.style.background = 'transparent';
    } else {
        addToWishlist(productId, productName, productPrice, productImage, productAisle);
        button.textContent = '❤️ Wishlist';
        button.style.color = '#d9534f';
        button.style.background = '#fff5f5';
    }
}

// ========================================
// ORDER SYSTEM
// ========================================

function generateOrderNumber() {
    const prefix = 'MER';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${year}-${random}`;
}

function processOrder(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const address = document.getElementById('address')?.value || '';
    const payment = document.querySelector('input[name="payment"]:checked')?.value || '';
    
    if (!fullname || !email || !phone || !address) {
        showNotification('⚠️ Please fill in all required fields');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('⚠️ Your cart is empty');
        return;
    }
    
    const orderNumber = generateOrderNumber();
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 3000 ? 0 : 200;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    
    const order = {
        id: orderNumber,
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        })),
        customer: {
            name: fullname,
            email: email,
            phone: phone,
            address: address
        },
        payment: payment,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        status: 'Processing'
    };
    
    let orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    orders.unshift(order);
    localStorage.setItem('merkatoOrders', JSON.stringify(orders));
    localStorage.setItem('lastOrderNumber', orderNumber);
    
    cart = [];
    saveCart();
    updateCartCount();
    
    window.location.href = 'order-confirmation.html';
}

function loadOrderConfirmation() {
    const orderNumber = localStorage.getItem('lastOrderNumber');
    if (!orderNumber) {
        window.location.href = 'shop.html';
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    const order = orders.find(o => o.id === orderNumber);
    
    if (!order) {
        window.location.href = 'shop.html';
        return;
    }
    
    displayOrderConfirmation(order);
}

function displayOrderConfirmation(order) {
    const container = document.getElementById('orderConfirmation');
    if (!container) return;
    
    let itemsHtml = order.items.map(item => `
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;">
            <span>${item.name} × ${item.quantity}</span>
            <span>${item.subtotal.toLocaleString()} ETB</span>
        </div>
    `).join('');
    
    container.innerHTML = `
        <div style="text-align:center;padding:20px 0 30px;">
            <div style="font-size:64px;margin-bottom:10px;">🎉</div>
            <h2 style="color:#1a1a2e;margin-bottom:5px;">Order Confirmed!</h2>
            <p style="color:#888;">Thank you for your purchase, ${order.customer.name}!</p>
        </div>
        
        <div style="background:#f8f9fa;padding:20px;border-radius:8px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;">
                <div>
                    <div style="font-size:13px;color:#888;">Order Number</div>
                    <div style="font-weight:700;font-size:18px;color:#1a1a2e;">${order.id}</div>
                </div>
                <div>
                    <div style="font-size:13px;color:#888;">Date</div>
                    <div style="font-weight:600;color:#1a1a2e;">${order.date}</div>
                </div>
                <div>
                    <div style="font-size:13px;color:#888;">Status</div>
                    <div style="font-weight:600;color:#008000;">${order.status}</div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom:20px;">
            <h4 style="margin-bottom:10px;">Order Items</h4>
            ${itemsHtml}
        </div>
        
        <div style="background:#f8f9fa;padding:15px 20px;border-radius:8px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;padding:6px 0;">
                <span>Subtotal</span>
                <span>${order.subtotal.toLocaleString()} ETB</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:6px 0;">
                <span>Shipping</span>
                <span style="color:${order.shipping === 0 ? '#008000' : '#d9534f'};">${order.shipping === 0 ? 'FREE' : order.shipping.toLocaleString() + ' ETB'}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e0e0e0;">
                <span>Tax (VAT 15%)</span>
                <span>${order.tax.toLocaleString()} ETB</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:10px 0 0 0;font-size:20px;font-weight:700;">
                <span>Total</span>
                <span style="color:#d9534f;">${order.total.toLocaleString()} ETB</span>
            </div>
        </div>
        
        <div style="background:#fff3cd;padding:15px 20px;border-radius:8px;margin-bottom:20px;">
            <div style="font-weight:600;color:#856404;">📦 Shipping Information</div>
            <div style="color:#856404;font-size:14px;margin-top:5px;">
                ${order.customer.name}<br>
                ${order.customer.address}<br>
                📞 ${order.customer.phone}<br>
                ✉️ ${order.customer.email}
            </div>
        </div>
        
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <a href="shop.html" class="btn btn-primary">Continue Shopping →</a>
            <a href="orders.html" class="btn btn-secondary">View My Orders</a>
        </div>
    `;
}

// ========================================
// CHECKOUT FUNCTIONS
// ========================================

function loadCheckoutSummary() {
    const summaryContainer = document.getElementById('checkoutOrderSummary');
    const sidebarContainer = document.getElementById('checkoutSidebar');
    
    if (!summaryContainer) return;
    
    if (cart.length === 0) {
        summaryContainer.innerHTML = `
            <div style="text-align:center;padding:20px;color:#888;">
                <p>Your cart is empty.</p>
                <a href="shop.html" class="btn btn-sm btn-primary">Shop Now</a>
            </div>
        `;
        if (sidebarContainer) {
            sidebarContainer.innerHTML = `
                <div style="text-align:center;padding:20px;color:#888;">
                    <p>Cart is empty</p>
                </div>
            `;
        }
        return;
    }
    
    let itemsHtml = '';
    cart.forEach(item => {
        itemsHtml += `
            <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;">
                <span>${item.name} × ${item.quantity}</span>
                <strong>${(item.price * item.quantity).toLocaleString()} ETB</strong>
            </li>
        `;
    });
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 3000 ? 0 : 200;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    const itemCount = getCartCount();
    
    const shippingText = shipping === 0 ? 'FREE' : shipping.toLocaleString() + ' ETB';
    const shippingColor = shipping === 0 ? '#008000' : '#d9534f';
    
    summaryContainer.innerHTML = `
        <ul style="list-style:none;padding:0;">
            ${itemsHtml}
            <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;">
                <span>Shipping</span>
                <strong style="color:${shippingColor};">${shippingText}</strong>
            </li>
            <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;color:#666;">
                <span>Tax (VAT 15%)</span>
                <span>${tax.toLocaleString()} ETB</span>
            </li>
            <li style="padding:12px 0;font-size:20px;font-weight:700;color:#d9534f;display:flex;justify-content:space-between;">
                <span>Grand Total:</span>
                <span style="font-size:24px;">${total.toLocaleString()} ETB</span>
            </li>
        </ul>
    `;
    
    if (sidebarContainer) {
        sidebarContainer.innerHTML = `
            <div class="summary-row">
                <span class="label">Subtotal (${itemCount} items)</span>
                <span class="value">${subtotal.toLocaleString()} ETB</span>
            </div>
            <div class="summary-row">
                <span class="label">Shipping</span>
                <span class="value" style="color: ${shippingColor};">${shippingText}</span>
            </div>
            <div class="summary-row">
                <span class="label">Tax (VAT 15%)</span>
                <span class="value">${tax.toLocaleString()} ETB</span>
            </div>
            <div class="free-shipping">
                ${shipping === 0 ? '🎉 <strong>You saved 200 ETB</strong> on shipping!' : '💡 Add <strong>' + (3000 - subtotal).toLocaleString() + ' ETB</strong> more for free shipping!'}
            </div>
            <div class="summary-row total">
                <span class="label">Total</span>
                <span class="value">${total.toLocaleString()} ETB</span>
            </div>
        `;
    }
}

// ========================================
// NEWSLETTER SYSTEM
// ========================================

function subscribeNewsletter(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('newsletterEmail');
    const statusDiv = document.getElementById('newsletterStatus');
    const email = emailInput.value.trim();
    
    if (!email) {
        statusDiv.className = 'newsletter-status error';
        statusDiv.textContent = '⚠️ Please enter your email address';
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        statusDiv.className = 'newsletter-status error';
        statusDiv.textContent = '⚠️ Please enter a valid email address';
        return;
    }
    
    let subscribers = JSON.parse(localStorage.getItem('merkatoSubscribers')) || [];
    
    if (subscribers.includes(email)) {
        statusDiv.className = 'newsletter-status error';
        statusDiv.textContent = '⚠️ This email is already subscribed!';
        return;
    }
    
    subscribers.push(email);
    localStorage.setItem('merkatoSubscribers', JSON.stringify(subscribers));
    updateSubscriberCount();
    
    statusDiv.className = 'newsletter-status success';
    statusDiv.textContent = '✅ Thank you for subscribing! 🎉';
    emailInput.value = '';
    showNotification('📧 You have been subscribed to our newsletter!');
}

function subscribeFooterNewsletter(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('newsletterFooterEmail');
    const statusDiv = document.getElementById('footerNewsletterStatus');
    const email = emailInput.value.trim();
    
    if (!email) {
        statusDiv.style.color = '#d9534f';
        statusDiv.textContent = '⚠️ Please enter your email address';
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        statusDiv.style.color = '#d9534f';
        statusDiv.textContent = '⚠️ Please enter a valid email address';
        return;
    }
    
    let subscribers = JSON.parse(localStorage.getItem('merkatoSubscribers')) || [];
    
    if (subscribers.includes(email)) {
        statusDiv.style.color = '#d9534f';
        statusDiv.textContent = '⚠️ This email is already subscribed!';
        return;
    }
    
    subscribers.push(email);
    localStorage.setItem('merkatoSubscribers', JSON.stringify(subscribers));
    updateSubscriberCount();
    
    statusDiv.style.color = '#008000';
    statusDiv.textContent = '✅ Thank you for subscribing! 🎉';
    emailInput.value = '';
    showNotification('📧 You have been subscribed to our newsletter!');
}

function updateSubscriberCount() {
    const subscribers = JSON.parse(localStorage.getItem('merkatoSubscribers')) || [];
    const count = subscribers.length;
    const countElements = document.querySelectorAll('#subscriberCount');
    countElements.forEach(el => {
        el.textContent = count;
    });
}

function getSubscriberCount() {
    const subscribers = JSON.parse(localStorage.getItem('merkatoSubscribers')) || [];
    return subscribers.length;
}

// ========================================
// RETURN SYSTEM
// ========================================

function toggleOtherReason() {
    const reasonSelect = document.getElementById('return-reason');
    const otherInput = document.getElementById('otherReasonInput');
    
    if (reasonSelect.value === 'other') {
        otherInput.classList.add('show');
        document.getElementById('other-reason-text').required = true;
    } else {
        otherInput.classList.remove('show');
        document.getElementById('other-reason-text').required = false;
    }
}

function submitReturnRequest(event) {
    event.preventDefault();
    
    const orderNumber = document.getElementById('order-number').value.trim();
    const itemToReturn = document.getElementById('item-return').value;
    const quantity = document.getElementById('quantity').value;
    const returnReason = document.getElementById('return-reason').value;
    const otherReason = document.getElementById('other-reason-text').value.trim();
    const comments = document.getElementById('comments').value.trim();
    
    if (!orderNumber) {
        showNotification('⚠️ Please enter your order number');
        return;
    }
    
    if (!itemToReturn) {
        showNotification('⚠️ Please select an item to return');
        return;
    }
    
    if (!returnReason) {
        showNotification('⚠️ Please select a reason for return');
        return;
    }
    
    if (returnReason === 'other' && !otherReason) {
        showNotification('⚠️ Please specify your reason');
        return;
    }
    
    const nonReturnableItems = ['buna', 'berbere', 'teff', 'shiro', 'korerima', 'kibe'];
    if (nonReturnableItems.includes(itemToReturn)) {
        showNotification('⚠️ This item is non-returnable (food/perishable items)');
        return;
    }
    
    const itemSelect = document.getElementById('item-return');
    const itemName = itemSelect.options[itemSelect.selectedIndex].text;
    
    const reasonSelect = document.getElementById('return-reason');
    let reasonText = reasonSelect.options[reasonSelect.selectedIndex].text;
    if (returnReason === 'other') {
        reasonText = otherReason;
    }
    
    const returnRequest = {
        id: 'RET-' + Date.now().toString().slice(-8),
        orderNumber: orderNumber,
        item: itemName,
        quantity: parseInt(quantity),
        reason: reasonText,
        comments: comments,
        status: 'Pending',
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        dateSubmitted: new Date().toISOString()
    };
    
    let returns = JSON.parse(localStorage.getItem('merkatoReturns')) || [];
    returns.unshift(returnRequest);
    localStorage.setItem('merkatoReturns', JSON.stringify(returns));
    
    document.getElementById('returnForm').reset();
    document.getElementById('otherReasonInput').classList.remove('show');
    
    loadReturnRequests();
    showReturnSuccessModal(returnRequest);
}

function loadReturnRequests() {
    const returns = JSON.parse(localStorage.getItem('merkatoReturns')) || [];
    const container = document.getElementById('returnRequests');
    
    if (!container) return;
    
    if (returns.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:30px;color:#888;">
                <div style="font-size:40px;margin-bottom:10px;">📭</div>
                <p>No return requests found.</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="margin-bottom:12px;font-size:14px;color:#666;">
            <strong>${returns.length}</strong> ${returns.length === 1 ? 'request' : 'requests'} found
        </div>
    `;
    
    returns.forEach((returnReq) => {
        const statusColor = returnReq.status === 'Pending' ? '#ffa500' :
                           returnReq.status === 'Approved' ? '#008000' :
                           returnReq.status === 'Rejected' ? '#d9534f' : '#888';
        
        const statusIcon = returnReq.status === 'Pending' ? '⏳' :
                          returnReq.status === 'Approved' ? '✅' :
                          returnReq.status === 'Rejected' ? '❌' : '📋';
        
        html += `
            <div style="
                background: #fff;
                border-radius: 10px;
                border: 1px solid #e0e0e0;
                padding: 16px 20px;
                margin-bottom: 12px;
                transition: all 0.3s ease;
            " onmouseover="this.style.borderColor='#008000'" onmouseout="this.style.borderColor='#e0e0e0'">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
                    <div>
                        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                            <strong style="color:#1a1a2e;font-size:15px;">#${returnReq.id}</strong>
                            <span style="color:#888;font-size:12px;">${returnReq.date}</span>
                        </div>
                        <div style="font-size:13px;color:#444;margin-top:4px;">
                            <strong>Order:</strong> ${returnReq.orderNumber} &nbsp;|&nbsp;
                            <strong>Item:</strong> ${returnReq.item} × ${returnReq.quantity}
                        </div>
                        <div style="font-size:12px;color:#666;margin-top:2px;">
                            <strong>Reason:</strong> ${returnReq.reason}
                        </div>
                        ${returnReq.comments ? `
                            <div style="font-size:12px;color:#888;margin-top:2px;">
                                💬 ${returnReq.comments}
                            </div>
                        ` : ''}
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                        <span style="
                            display:inline-block;
                            padding:3px 14px;
                            border-radius:20px;
                            font-size:12px;
                            font-weight:600;
                            background: ${statusColor}20;
                            color: ${statusColor};
                            white-space:nowrap;
                        ">
                            ${statusIcon} ${returnReq.status}
                        </span>
                        <span style="font-size:11px;color:#888;">
                            ${returnReq.status === 'Pending' ? '⏳ Awaiting review' :
                              returnReq.status === 'Approved' ? '✅ Approved - Refund processing' :
                              returnReq.status === 'Rejected' ? '❌ Not approved' : ''}
                        </span>
                    </div>
                </div>
                ${returnReq.status === 'Pending' ? `
                    <div style="margin-top:10px;">
                        <div style="display:flex;justify-content:space-between;font-size:11px;color:#888;margin-bottom:2px;">
                            <span>⏳ Reviewing</span>
                            <span>⏳ Processing</span>
                            <span>✅ Refund</span>
                        </div>
                        <div style="width:100%;height:4px;background:#f0f0f0;border-radius:4px;overflow:hidden;">
                            <div style="width:33%;height:100%;background:linear-gradient(90deg,#ffa500,#ffd700);border-radius:4px;animation:pulseBar 1.5s ease-in-out infinite;"></div>
                        </div>
                    </div>
                ` : ''}
                ${returnReq.status === 'Approved' ? `
                    <div style="margin-top:8px;font-size:12px;color:#008000;display:flex;align-items:center;gap:6px;">
                        ✅ Your return has been approved. Refund will be processed within 5-7 business days.
                    </div>
                ` : ''}
                ${returnReq.status === 'Rejected' ? `
                    <div style="margin-top:8px;font-size:12px;color:#d9534f;display:flex;align-items:center;gap:6px;">
                        ❌ Your return request was not approved. Please contact support for more information.
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    const pending = returns.filter(r => r.status === 'Pending').length;
    const approved = returns.filter(r => r.status === 'Approved').length;
    const rejected = returns.filter(r => r.status === 'Rejected').length;
    
    html += `
        <div style="display:flex;gap:15px;justify-content:center;flex-wrap:wrap;margin-top:15px;padding:12px;background:#f8f9fa;border-radius:8px;">
            <span style="font-size:13px;color:#888;">
                ⏳ Pending: <strong style="color:#ffa500;">${pending}</strong>
            </span>
            <span style="font-size:13px;color:#888;">
                ✅ Approved: <strong style="color:#008000;">${approved}</strong>
            </span>
            <span style="font-size:13px;color:#888;">
                ❌ Rejected: <strong style="color:#d9534f;">${rejected}</strong>
            </span>
        </div>
    `;
    
    container.innerHTML = html;
}

function showReturnSuccessModal(returnRequest) {
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-confetti">🎉</div>
            <div class="modal-confetti">✨</div>
            <div class="modal-confetti">🎊</div>
            <div class="modal-confetti">🌟</div>
            <div class="modal-confetti">💫</div>
            
            <div class="modal-icon">✅</div>
            
            <h2 class="modal-title">Return Submitted! 🎉</h2>
            <p class="modal-subtitle">We'll review and contact you within 2-3 days.</p>
            
            <hr class="modal-divider">
            
            <div class="modal-details">
                <div class="row">
                    <span class="label">📋 Request ID</span>
                    <span class="value highlight">${returnRequest.id}</span>
                </div>
                <div class="row">
                    <span class="label">📦 Order</span>
                    <span class="value">${returnRequest.orderNumber}</span>
                </div>
                <div class="row">
                    <span class="label">🛒 Item</span>
                    <span class="value">${returnRequest.item} × ${returnRequest.quantity}</span>
                </div>
                <div class="row">
                    <span class="label">📝 Reason</span>
                    <span class="value">${returnRequest.reason}</span>
                </div>
                <div class="row">
                    <span class="label">📅 Submitted</span>
                    <span class="value">${returnRequest.date}</span>
                </div>
                <div class="row">
                    <span class="label">⏳ Status</span>
                    <span class="value" style="color:#ffa500;font-weight:700;">${returnRequest.status}</span>
                </div>
                ${returnRequest.comments ? `
                    <div class="row" style="border-bottom:none;">
                        <span class="label">💬 Comments</span>
                        <span class="value" style="font-weight:400;font-size:11px;">${returnRequest.comments}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="modal-next-steps">
                <div class="steps-text">
                    <span>📌</span>
                    <span><strong>Next:</strong> We'll review and email you confirmation.</span>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="closeReturnModal()">✅ OK</button>
                <a href="returns.html" class="btn btn-secondary">📋 My Returns</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeReturnModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeReturnModal();
        }
    });
}

function closeReturnModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.animation = 'modalFadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function updateReturnStatus(requestId, newStatus) {
    let returns = JSON.parse(localStorage.getItem('merkatoReturns')) || [];
    const index = returns.findIndex(r => r.id === requestId);
    
    if (index !== -1) {
        returns[index].status = newStatus;
        localStorage.setItem('merkatoReturns', JSON.stringify(returns));
        loadReturnRequests();
        showNotification(`✅ Return ${requestId} updated to ${newStatus}`);
    } else {
        showNotification('❌ Return request not found');
    }
}

// ========================================
// PRODUCT FILTERING & SORTING
// ========================================

let activeFilters = {
    aisles: ['all'],
    minPrice: 0,
    maxPrice: 100000,
    sortBy: 'default'
};

function toggleFilters() {
    const sidebar = document.getElementById('filterSidebar');
    const btn = document.getElementById('filterToggleBtn');
    sidebar.classList.toggle('active');
    btn.textContent = sidebar.classList.contains('active') ? '✕ Close Filters' : '🔍 Filter Products';
}

function applyFilters() {
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const selectedAisles = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            selectedAisles.push(cb.value);
        }
    });
    
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || 100000;
    const sortBy = document.getElementById('sortBy').value;
    
    activeFilters.aisles = selectedAisles;
    activeFilters.minPrice = minPrice;
    activeFilters.maxPrice = maxPrice;
    activeFilters.sortBy = sortBy;
    
    filterProducts(selectedAisles, minPrice, maxPrice, sortBy);
}

function filterProducts(aisles, minPrice, maxPrice, sortBy) {
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const cardAisle = card.dataset.aisle || '';
        const cardPrice = parseFloat(card.dataset.price) || 0;
        
        let aisleMatch = aisles.includes('all') || aisles.includes(cardAisle);
        if (!aisleMatch) {
            card.style.display = 'none';
            return;
        }
        
        if (cardPrice < minPrice || cardPrice > maxPrice) {
            card.style.display = 'none';
            return;
        }
        
        card.style.display = '';
        visibleCount++;
    });
    
    document.getElementById('productCount').textContent = visibleCount;
    showNoProductsMessage(visibleCount);
    
    if (sortBy !== 'default') {
        sortProducts(sortBy);
    }
    
    updateFilterTags(aisles, minPrice, maxPrice);
}

function sortProducts(sortBy) {
    const container = document.querySelector('.product-grid');
    const cards = Array.from(container.querySelectorAll('.product-card:not([style*="display: none"])'));
    
    cards.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price) || 0;
        const priceB = parseFloat(b.dataset.price) || 0;
        const nameA = a.querySelector('h3')?.textContent?.toLowerCase() || '';
        const nameB = b.querySelector('h3')?.textContent?.toLowerCase() || '';
        
        switch(sortBy) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'name-asc':
                return nameA.localeCompare(nameB);
            case 'name-desc':
                return nameB.localeCompare(nameA);
            case 'popularity':
                return 0.5 - Math.random();
            default:
                return 0;
        }
    });
    
    cards.forEach(card => container.appendChild(card));
}

function showNoProductsMessage(visibleCount) {
    const container = document.querySelector('.product-grid');
    const existingMsg = document.querySelector('.no-products-message');
    
    if (visibleCount === 0) {
        if (!existingMsg) {
            const msg = document.createElement('div');
            msg.className = 'no-products-message';
            msg.innerHTML = `
                <div class="icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button class="btn btn-primary" onclick="resetFilters()">🔄 Reset Filters</button>
            `;
            container.appendChild(msg);
        }
    } else if (existingMsg) {
        existingMsg.remove();
    }
}

function updateFilterTags(aisles, minPrice, maxPrice) {
    const container = document.getElementById('filterTags');
    let tags = [];
    
    if (!aisles.includes('all')) {
        const aisleNames = {
            'food': '🍲 Food',
            'home': '🏠 Home',
            'apparel': '👗 Apparel',
            'crafts': '🎨 Crafts',
            'electronics': '📱 Electronics'
        };
        aisles.forEach(aisle => {
            if (aisleNames[aisle]) {
                tags.push(`<span class="filter-tag">${aisleNames[aisle]} <span class="remove-tag" onclick="removeFilter('aisle','${aisle}')">×</span></span>`);
            }
        });
    }
    
    if (minPrice > 0 || maxPrice < 100000) {
        tags.push(`<span class="filter-tag">💰 ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()} ETB <span class="remove-tag" onclick="removeFilter('price')">×</span></span>`);
    }
    
    container.innerHTML = tags.length > 0 ? tags.join('') : '';
}

function removeFilter(type, value) {
    if (type === 'aisle' && value) {
        const checkbox = document.querySelector(`.filter-options input[value="${value}"]`);
        if (checkbox) checkbox.checked = false;
        const allChecked = document.querySelector('.filter-options input[value="all"]');
        const othersChecked = document.querySelectorAll('.filter-options input:not([value="all"]):checked');
        if (!allChecked.checked && othersChecked.length === 0) {
            document.querySelector('.filter-options input[value="all"]').checked = true;
        }
    } else if (type === 'price') {
        document.getElementById('minPrice').value = 0;
        document.getElementById('maxPrice').value = 100000;
    }
    applyFilters();
}

function resetFilters() {
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.value === 'all';
    });
    
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 100000;
    document.getElementById('sortBy').value = 'default';
    
    activeFilters = {
        aisles: ['all'],
        minPrice: 0,
        maxPrice: 100000,
        sortBy: 'default'
    };
    
    applyFilters();
    
    const sidebar = document.getElementById('filterSidebar');
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        document.getElementById('filterToggleBtn').textContent = '🔍 Filter Products';
    }
    
    showNotification('🔄 Filters have been reset');
}

// ========================================
// STOCK STATUS FUNCTIONS
// ========================================

function getStockStatus(productId) {
    const data = productStock[productId];
    if (!data) return { status: 'in-stock', stock: 0 };
    
    let status = 'in-stock';
    if (data.stock <= 0) {
        status = 'out-of-stock';
    } else if (data.stock <= 10) {
        status = 'low-stock';
    }
    
    return { status: status, stock: data.stock };
}

function renderStockBadge(productId) {
    const { status, stock } = getStockStatus(productId);
    
    const statusMap = {
        'in-stock': { icon: '✅', label: 'In Stock', class: 'in-stock' },
        'low-stock': { icon: '⚠️', label: `Low Stock (${stock} left)`, class: 'low-stock' },
        'out-of-stock': { icon: '❌', label: 'Out of Stock', class: 'out-of-stock' }
    };
    
    const info = statusMap[status];
    
    return `<span class="stock-status ${info.class}">
        <span class="stock-icon">${info.icon}</span>
        ${info.label}
        ${status === 'in-stock' ? `<span class="stock-count">(${stock} available)</span>` : ''}
    </span>`;
}

function updateStockBadges() {
    const productSections = document.querySelectorAll('section[id]');
    productSections.forEach(section => {
        const productId = section.id;
        if (productId) {
            const existingBadge = section.querySelector('.stock-status');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            const stockHtml = renderStockBadge(productId);
            const priceElement = section.querySelector('div[style*="font-size:32px"]');
            if (priceElement) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = stockHtml;
                priceElement.parentNode.insertBefore(wrapper.firstElementChild, priceElement.nextSibling);
            }
        }
    });
    
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = card.dataset.productId;
        if (productId) {
            const productIdMap = {
                '1': 'buna',
                '2': 'berbere',
                '3': 'teff',
                '4': 'shiro',
                '5': 'korerima',
                '6': 'kibe',
                '7': 'jebena',
                '8': 'sini',
                '9': 'rekebot',
                '10': 'kemis',
                '11': 'netela',
                '12': 'gabi',
                '13': 'mesob',
                '14': 'barchuma',
                '15': 'mitad',
                '16': 'tv',
                '17': 'solar',
                '18': 'phone'
            };
            
            const actualId = productIdMap[productId] || productId;
            const existingBadge = card.querySelector('.stock-status');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            const stockHtml = renderStockBadge(actualId);
            const priceElement = card.querySelector('.price');
            if (priceElement) {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = stockHtml;
                priceElement.parentNode.insertBefore(wrapper.firstElementChild, priceElement.nextSibling);
            }
        }
    });
}

function notifyMe(productId) {
    const productName = productStock[productId] ? productId.charAt(0).toUpperCase() + productId.slice(1) : 'Product';
    showNotification(`📧 We'll notify you when ${productName} is back in stock!`);
    
    let notifications = JSON.parse(localStorage.getItem('merkatoNotifications')) || [];
    if (!notifications.includes(productId)) {
        notifications.push(productId);
        localStorage.setItem('merkatoNotifications', JSON.stringify(notifications));
    }
}

function renderNotifyButton(productId) {
    const { status } = getStockStatus(productId);
    if (status === 'out-of-stock') {
        return `<button class="notify-btn" onclick="notifyMe('${productId}')">🔔 Notify Me When In Stock</button>`;
    }
    return '';
}

// ========================================
// ORDERS PAGE FUNCTION (Enhanced)
// ========================================

async function loadOrders() {
    const userData = localStorage.getItem('merkatoUser');
    const container = document.getElementById('ordersContainer');
    
    if (!container) return;
    
    if (!userData || !isLoggedIn()) {
        container.innerHTML = `
            <div class="empty-orders">
                <div class="icon">🔒</div>
                <h3>Please Sign In</h3>
                <p>Sign in to view your order history.</p>
                <a href="login.html" class="btn btn-primary">Sign In →</a>
            </div>
        `;
        return;
    }
    
    let orders = [];
    try {
        const apiOrders = await getMyOrders();
        // Normalize MongoDB fields (_id, createdAt) into the shape the
        // rest of this page's rendering code already expects.
        orders = apiOrders.map(o => ({
            ...o,
            id: o._id,
            date: new Date(o.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            })
        }));
        localStorage.setItem('merkatoOrders', JSON.stringify(orders));
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('⚠️ Could not load orders from server');
        orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    }
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <div class="icon">📦</div>
                <h3>No Orders Yet</h3>
                <p>Start shopping and your orders will appear here!</p>
                <a href="shop.html" class="btn btn-primary">Start Shopping →</a>
            </div>
        `;
        return;
    }
    
    const stats = {
        processing: orders.filter(o => o.status === 'Processing').length,
        shipped: orders.filter(o => o.status === 'Shipped').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        cancelled: orders.filter(o => o.status === 'Cancelled').length
    };
    
    let html = '';
    
    html += `
        <div class="order-stats">
            <span class="stat-processing">⏳ Processing: <strong>${stats.processing}</strong></span>
            <span class="stat-shipped">🚚 Shipped: <strong>${stats.shipped}</strong></span>
            <span class="stat-delivered">✅ Delivered: <strong>${stats.delivered}</strong></span>
            <span class="stat-cancelled">❌ Cancelled: <strong>${stats.cancelled}</strong></span>
        </div>
    `;
    
    orders.forEach((order) => {
        const statusClass = order.status === 'Delivered' ? 'order-status-delivered' :
                           order.status === 'Processing' ? 'order-status-processing' :
                           order.status === 'Shipped' ? 'order-status-shipped' :
                           order.status === 'Cancelled' ? 'order-status-cancelled' : '';
        
        const statusIcon = order.status === 'Delivered' ? '✅' :
                          order.status === 'Processing' ? '⏳' :
                          order.status === 'Shipped' ? '🚚' :
                          order.status === 'Cancelled' ? '❌' : '📋';
        
        html += `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">#${order.id}</span>
                        <span class="order-date">${order.date}</span>
                    </div>
                    <span class="order-status ${statusClass}">${statusIcon} ${order.status}</span>
                </div>
                <div class="order-body">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>${(item.price * item.quantity).toLocaleString()} ETB</span>
                        </div>
                    `).join('')}
                    <div class="order-total">
                        <span>Total</span>
                        <span class="total-price">${order.total.toLocaleString()} ETB</span>
                    </div>
                </div>
                <div class="order-footer">
                    <div class="tracking">
                        ${order.tracking ? `📦 Tracking: <strong>${order.tracking}</strong>` : '📦 Tracking number will be provided soon'}
                    </div>
                    <div class="order-actions">
                        ${order.status !== 'Cancelled' && order.status !== 'Delivered' ? `
                            <button class="btn btn-danger btn-sm" onclick="cancelOrder('${order.id}')">Cancel Order</button>
                        ` : ''}
                        ${order.status === 'Delivered' ? `
                            <button class="btn btn-primary btn-sm" onclick="reorder('${order.id}')">🔄 Buy Again</button>
                        ` : ''}
                        <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails('${order.id}')">📋 Details</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

async function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
        const token = localStorage.getItem('merkatoToken');
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Failed to cancel order');
        }
        
        showNotification('❌ Order cancelled successfully');
        await loadOrders();
    } catch (error) {
        showNotification('❌ Failed to cancel order: ' + error.message);
    }
}

function reorder(orderId) {
    let orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.items.forEach(item => {
            const productId = item.name.toLowerCase().replace(/\s/g, '-').replace(/[^a-z-]/g, '');
            addToCart(productId, item.name, item.price, '');
        });
        window.location.href = 'cart.html';
    }
}

function viewOrderDetails(orderId) {
    let orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('⚠️ Order not found');
        return;
    }
    
    const statusColor = order.status === 'Delivered' ? '#008000' :
                       order.status === 'Processing' ? '#ffa500' :
                       order.status === 'Shipped' ? '#0066cc' : '#d9534f';
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(5px);
        z-index: 99999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: modalFadeIn 0.3s ease;
    `;
    
    let itemsHtml = order.items.map(item => `
        <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;">
            <span>${item.name} × ${item.quantity}</span>
            <span>${(item.price * item.quantity).toLocaleString()} ETB</span>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div style="
            background: #fff;
            border-radius: 16px;
            padding: 30px 35px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: modalSlideUp 0.4s ease;
        ">
            <div style="text-align:center;margin-bottom:15px;">
                <div style="font-size:48px;">📦</div>
                <h2 style="color:#1a1a2e;margin:5px 0;">Order Details</h2>
                <p style="color:#888;font-size:13px;">${order.id}</p>
            </div>
            
            <div style="background:#f8f9fa;padding:12px 16px;border-radius:8px;margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;padding:4px 0;">
                    <span style="color:#888;">Date</span>
                    <span style="font-weight:600;">${order.date}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:4px 0;">
                    <span style="color:#888;">Status</span>
                    <span style="font-weight:600;color:${statusColor};">${order.status}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:4px 0;">
                    <span style="color:#888;">Payment</span>
                    <span style="font-weight:600;">${order.payment || 'Not specified'}</span>
                </div>
            </div>
            
            <div style="margin-bottom:12px;">
                <h4 style="margin-bottom:8px;">Items</h4>
                ${itemsHtml}
            </div>
            
            <div style="background:#f8f9fa;padding:12px 16px;border-radius:8px;margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;padding:4px 0;">
                    <span style="color:#888;">Subtotal</span>
                    <span>${order.subtotal.toLocaleString()} ETB</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:4px 0;">
                    <span style="color:#888;">Shipping</span>
                    <span style="color:${order.shipping === 0 ? '#008000' : '#d9534f'};">${order.shipping === 0 ? 'FREE' : order.shipping.toLocaleString() + ' ETB'}</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #e0e0e0;">
                    <span style="color:#888;">Tax</span>
                    <span>${order.tax.toLocaleString()} ETB</span>
                </div>
                <div style="display:flex;justify-content:space-between;padding:8px 0 0 0;font-size:18px;font-weight:700;">
                    <span>Total</span>
                    <span style="color:#d9534f;">${order.total.toLocaleString()} ETB</span>
                </div>
            </div>
            
            <div style="background:#fff3cd;padding:12px 16px;border-radius:8px;margin-bottom:15px;font-size:13px;color:#856404;">
                <strong>📦 Shipping Address</strong>
                <div style="margin-top:4px;">
                    ${order.customer.name}<br>
                    ${order.customer.address}<br>
                    📞 ${order.customer.phone}<br>
                    ✉️ ${order.customer.email}
                </div>
            </div>
            
            <button onclick="this.closest('div[style]').parentElement.remove()" 
                    style="width:100%;padding:12px;background:#008000;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:0.3s;"
                    onmouseover="this.style.background='#006600'" onmouseout="this.style.background='#008000'">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.remove();
        }
    });
}

// ========================================
// DARK MODE SYSTEM (CLEAN VERSION)
// ========================================

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('merkatoTheme', newTheme);
    updateThemeIcon(newTheme);
    console.log('Theme changed to:', newTheme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('merkatoTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    console.log('Theme loaded:', theme);
}

function updateThemeIcon(theme) {
    const toggleBtn = document.getElementById('themeToggle');
    const headerIcon = document.getElementById('headerThemeIcon');
    const icon = theme === 'dark' ? '☀️' : '🌙';
    const title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    
    if (toggleBtn) {
        toggleBtn.textContent = icon;
        toggleBtn.title = title;
    }
    if (headerIcon) {
        headerIcon.textContent = icon;
    }
}

function createThemeToggle() {
    const savedTheme = localStorage.getItem('merkatoTheme') || 'light';
    updateThemeIcon(savedTheme);
}

// ========================================
// PRODUCT DATA SYNC
// ========================================

function syncProductData() {
    let products = JSON.parse(localStorage.getItem('merkatoProducts'));
    if (products && products.length > 0 && typeof productStock !== 'undefined') {
        products.forEach(p => {
            const key = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (productStock[key]) {
                productStock[key].stock = p.stock;
                productStock[key].status = p.stock <= 0 ? 'out-of-stock' : p.stock <= 10 ? 'low-stock' : 'in-stock';
            }
        });
    }
}

// ========================================
// SHOP PAGE - LOAD PRODUCTS FROM LOCALSTORAGE
// ========================================

function getDefaultProducts() {
    return [
        { id: 1, name: 'Yirgacheffe Buna (ቡና)', aisle: 'food', price: 2500, stock: 42, image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSIPbXV5JPWRjWxuMYmcLwLBV-CGnK49jwZQKjSpJcmp1K8BuzJ0Krlasb-g4QX-tds8dIe5QMDYQaO4No', description: 'Premium Ethiopian coffee beans' },
        { id: 2, name: 'Pure Doro Berbere (በርበሬ)', aisle: 'food', price: 1750, stock: 85, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80', description: 'Traditional Ethiopian spice blend' },
        { id: 3, name: 'Magna White Teff (ነጭ ጤፍ)', aisle: 'food', price: 4200, stock: 110, image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTmen-7vCXbuZKkEhcbaLuaJygZg7U5V_IP6y75A4QpnABl-SS0OuWUQIxKGk2KbazWoq9XR2O1D4MM7zA', description: 'Premium grade white teff grain' },
        { id: 4, name: 'Miten Shiro Powder (ሚተን ሽሮ)', aisle: 'food', price: 650, stock: 200, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80', description: 'Roasted chickpea flour for Shiro Wat' },
        { id: 5, name: 'Black Cardamom (ኮረሪማ)', aisle: 'food', price: 850, stock: 75, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80', description: 'Whole dried korerima pods' },
        { id: 6, name: 'Traditional Kibe (የሀገር ቅቤ)', aisle: 'food', price: 2200, stock: 60, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80', description: 'Spiced clarified butter' },
        { id: 7, name: 'Clay Jebena (ጀበና)', aisle: 'home', price: 850, stock: 45, image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80', description: 'Traditional clay coffee pot' },
        { id: 8, name: 'Sini Coffee Cups (ሲኒ)', aisle: 'home', price: 1200, stock: 30, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80', description: 'Traditional ceramic coffee cups set of 6' },
        { id: 9, name: 'Wooden Rekebot (ረከቦት)', aisle: 'home', price: 6500, stock: 18, image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80', description: 'Carved wooden coffee ceremony tray' },
        { id: 10, name: 'Habesha Kemis (ሀበሻ ቀሚስ)', aisle: 'apparel', price: 12000, stock: 25, image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcR9QX1QnkO_ENdrEH7dZ4K7fEr-dstVk1cPsyd4Kxzk3v2u8W3twSomdUhGSVDpDlKSUe9N25UkZTAWj9Q', description: 'Traditional handwoven cotton dress' },
        { id: 11, name: 'Cotton Netela (ነጠላ)', aisle: 'apparel', price: 2800, stock: 40, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=300&q=80', description: 'Traditional cotton scarf' },
        { id: 12, name: 'Heavy Cotton Gabi (ጋቢ)', aisle: 'apparel', price: 4500, stock: 35, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=300&q=80', description: 'Warm 4-layer cotton wrap' },
        { id: 13, name: 'Woven Mesob (መሶብ)', aisle: 'crafts', price: 8500, stock: 12, image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQnIrZQ1DhdrYyq7pG1i-_pQ4k8GNt8zlv4ENn_a0gwk96LXs72qynHCu_qDwe0OU3lYvJULA3w1GpbdtM', description: 'Traditional woven straw dining basket' },
        { id: 14, name: 'Wooden Barchuma (በርጩማ)', aisle: 'crafts', price: 3200, stock: 20, image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80', description: 'Carved wooden coffee stool' },
        { id: 15, name: 'Electric Mitad (ምጣድ)', aisle: 'electronics', price: 18500, stock: 15, image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRucOEkDP9JKh1WJNjrSBwmELxwAJFAyGxA_rOC6b1d-KuJXRmpRhFYMFQgzpiUrpnLInn2crhDdZEsflE', description: 'Electric Injera baking stove' },
        { id: 16, name: '55" 4K Smart TV', aisle: 'electronics', price: 68000, stock: 8, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=300&q=80', description: 'Ultra-HD 4K Smart LED TV' },
        { id: 17, name: 'Solar Power Station', aisle: 'electronics', price: 42000, stock: 12, image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=300&q=80', description: 'Home solar power system' },
        { id: 18, name: '4G Dual-SIM Smartphone', aisle: 'electronics', price: 22500, stock: 30, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80', description: 'Dual-SIM smartphone with 128GB storage' }
    ];
}

async function loadShopProducts() {
    const grids = document.querySelectorAll('.product-grid[id^="shopProductGrid"]');
    if (!grids || grids.length === 0) {
        console.warn('No product grids found on page');
        return;
    }

    let products = [];
    try {
        const apiProducts = await getProducts();
        // Normalize MongoDB's _id to .id so all existing rendering code
        // (which was written for local numeric ids) keeps working unchanged.
        products = apiProducts.map(p => ({ ...p, id: p._id }));
        localStorage.setItem('merkatoProducts', JSON.stringify(products));
    } catch (error) {
        console.error('Error loading products from API:', error);
        showNotification('⚠️ Could not load products from server');
        const cached = JSON.parse(localStorage.getItem('merkatoProducts'));
        products = cached || [];
    }

    renderShopProducts(products);
}

function renderShopProducts(products) {
    // Find ALL product grids on the page
    const grids = document.querySelectorAll('.product-grid[id^="shopProductGrid"]');
    
    if (!grids || grids.length === 0) {
        console.warn('No product grids found on page');
        return;
    }
    
    if (!products || products.length === 0) {
        grids.forEach(grid => {
            grid.innerHTML = `
                <div style="text-align:center;padding:60px 20px;grid-column:1/-1;">
                    <div style="font-size:64px;margin-bottom:20px;">📦</div>
                    <h3 style="color:#1a1a2e;">No Products Found</h3>
                    <p style="color:#888;">Check back later for new products!</p>
                </div>
            `;
        });
        return;
    }
    
    // Define aisle mapping for grids
    const aisleMapping = {
        'shopProductGrid': 'food',
        'shopProductGrid2': 'home',
        'shopProductGrid3': 'apparel',
        'shopProductGrid4': 'crafts',
        'shopProductGrid5': 'electronics'
    };
    
    const aisleLabels = {
        food: 'AISLE 1 | FOOD',
        home: 'AISLE 2 | HOME',
        apparel: 'AISLE 3 | APPAREL',
        crafts: 'AISLE 4 | CRAFTS',
        electronics: 'AISLE 5 | ELECTRONICS'
    };
    
    let wishlistItems = JSON.parse(localStorage.getItem('merkatoWishlist')) || [];
    let reviews = JSON.parse(localStorage.getItem('merkatoReviews')) || {};
    
    // For each grid, filter products by aisle
    grids.forEach(grid => {
        const gridId = grid.id;
        const targetAisle = aisleMapping[gridId];
        
        if (!targetAisle) {
            // If grid ID not recognized, show all products
            renderProductsInGrid(grid, products, wishlistItems, reviews, aisleLabels);
            return;
        }
        
        // Filter products for this aisle
        const aisleProducts = products.filter(p => p.aisle === targetAisle);
        
        if (aisleProducts.length === 0) {
            grid.innerHTML = `
                <div style="text-align:center;padding:40px 20px;grid-column:1/-1;color:#888;">
                    <div style="font-size:32px;margin-bottom:10px;">📭</div>
                    <p>No products in this aisle yet.</p>
                </div>
            `;
        } else {
            renderProductsInGrid(grid, aisleProducts, wishlistItems, reviews, aisleLabels);
        }
    });
}

function renderProductsInGrid(grid, products, wishlistItems, reviews, aisleLabels) {
    let html = '';
    
    products.forEach(product => {
        const inWishlist = wishlistItems.some(item => item.id === product.id.toString());
        const wishlistIcon = inWishlist ? '❤️' : '🤍';
        const wishlistColor = inWishlist ? '#d9534f' : '#888';
        
        const stockStatus = product.stock <= 0 ? 'out-of-stock' : product.stock <= 10 ? 'low-stock' : 'in-stock';
        const stockLabels = {
            'in-stock': { icon: '✅', label: 'In Stock', color: '#2e7d32' },
            'low-stock': { icon: '⚠️', label: `Low Stock (${product.stock} left)`, color: '#e65100' },
            'out-of-stock': { icon: '❌', label: 'Out of Stock', color: '#c62828' }
        };
        const stockInfo = stockLabels[stockStatus];
        
        const productReviews = reviews[product.id] || [];
        const reviewCount = productReviews.length;
        const avgRating = reviewCount > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) : 0;
        const stars = '⭐'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating));
        
        html += `
            <div class="product-card" data-product-id="${product.id}" data-aisle="${product.aisle}" data-price="${product.price}">
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image || 'https://via.placeholder.com/130'}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/130'">
                </a>
                <div class="aisle">${aisleLabels[product.aisle] || product.aisle}</div>
                <h3><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
                <div class="price">${product.price.toLocaleString()} ETB</div>
                <div style="font-size:12px;font-weight:600;color:${stockInfo.color};margin:4px 0;">
                    ${stockInfo.icon} ${stockInfo.label}
                </div>
                <div class="product-rating-shop" data-product-id="${product.id}" style="font-size:13px;color:#888;margin:6px 0;">
                    <span class="shop-stars">${stars}</span>
                    <span class="shop-review-count">(${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})</span>
                </div>
                <a href="product-detail.html?id=${product.id}" class="btn btn-sm">View &rarr;</a>
                <button class="btn btn-sm wishlist-btn" 
                        data-product-id="${product.id}"
                        data-product-name="${product.name}"
                        data-product-price="${product.price}"
                        data-product-image="${product.image}"
                        data-aisle="${product.aisle}"
                        onclick="toggleWishlist(this)"
                        style="font-size:12px;margin-top:6px;display:block;width:100%;color:${wishlistColor};">
                    ${wishlistIcon} Wishlist
                </button>
            </div>
        `;
    });

    grid.innerHTML = html;
    updateWishlistButtons();
}

// ========================================
// PRODUCT DETAIL PAGE
// ========================================

async function loadProductDetail() {
    const container = document.getElementById('productDetailContainer');
    if (!container) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px;">
                <div style="font-size:48px;">❌</div>
                <h3 style="color:#1a1a2e;">Product not found</h3>
                <p style="color:#888;">Please go back to the shop.</p>
                <a href="shop.html" class="btn btn-primary">← Back to Shop</a>
            </div>
        `;
        return;
    }
    
    let product;
    try {
        const apiProduct = await getProduct(productId);
        product = { ...apiProduct, id: apiProduct._id };
    } catch (error) {
        console.error('Error loading product:', error);
        container.innerHTML = `
            <div style="text-align:center;padding:60px;">
                <div style="font-size:48px;">❌</div>
                <h3 style="color:#1a1a2e;">Product not found</h3>
                <p style="color:#888;">The product you're looking for doesn't exist.</p>
                <a href="shop.html" class="btn btn-primary">← Back to Shop</a>
            </div>
        `;
        return;
    }
    
    renderProductDetail(product);
}

function renderProductDetail(product) {
    const container = document.getElementById('productDetailContainer');
    if (!container) return;
    
    const aisleLabels = {
        food: 'AISLE 1 | FOOD',
        home: 'AISLE 2 | HOME',
        apparel: 'AISLE 3 | APPAREL',
        crafts: 'AISLE 4 | CRAFTS',
        electronics: 'AISLE 5 | ELECTRONICS'
    };
    
    const aisleClass = {
        food: 'aisle-food',
        home: 'aisle-home',
        apparel: 'aisle-apparel',
        crafts: 'aisle-crafts',
        electronics: 'aisle-electronics'
    };
    
    const stockStatus = product.stock <= 0 ? 'out-of-stock' : product.stock <= 10 ? 'low-stock' : 'in-stock';
    const stockLabels = {
        'in-stock': { icon: '✅', label: `In Stock (${product.stock} available)`, color: '#2e7d32' },
        'low-stock': { icon: '⚠️', label: `Low Stock (${product.stock} left)`, color: '#e65100' },
        'out-of-stock': { icon: '❌', label: 'Out of Stock', color: '#c62828' }
    };
    const stockInfo = stockLabels[stockStatus];
    
    let wishlistItems = JSON.parse(localStorage.getItem('merkatoWishlist')) || [];
    const inWishlist = wishlistItems.some(item => item.id === product.id.toString());
    
    container.innerHTML = `
        <section id="${product.id}" data-product-id="${product.id}" data-aisle="${product.aisle}" data-price="${product.price}">
            <div class="card" style="display:flex;flex-wrap:wrap;gap:30px;align-items:flex-start;">
                <div style="flex:0 0 250px;text-align:center;">
                    <img src="${product.image || 'https://via.placeholder.com/250'}" alt="${product.name}" style="width:100%;max-width:250px;border-radius:8px;border:1px solid #e0e0e0;" onerror="this.src='https://via.placeholder.com/250'">
                </div>
                <div style="flex:1;min-width:200px;">
                    <span class="aisle-badge ${aisleClass[product.aisle] || ''}">${aisleLabels[product.aisle] || product.aisle}</span>
                    <h2 style="margin:10px 0 5px;">${product.name}</h2>
                    <div style="font-size:32px;font-weight:700;color:#d9534f;margin:10px 0;">${product.price.toLocaleString()} ETB</div>
                    <div style="font-size:14px;font-weight:600;color:${stockInfo.color};margin:6px 0;padding:4px 12px;background:${stockInfo.color}15;border-radius:20px;display:inline-block;">
                        ${stockInfo.icon} ${stockInfo.label}
                    </div>
                    ${product.description ? `<p style="color:#555;margin-top:10px;">${product.description}</p>` : ''}
                    
                    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:15px;">
                        <button type="button" 
                                class="btn btn-primary add-to-cart"
                                data-product-id="${product.id}"
                                data-product-name="${product.name}"
                                data-product-price="${product.price}"
                                data-product-image="${product.image || ''}"
                                style="padding:12px 30px;font-size:16px;">
                            🛒 Add to Cart
                        </button>
                        <button type="button" 
                                class="btn btn-outline wishlist-btn"
                                data-product-id="${product.id}"
                                data-product-name="${product.name}"
                                data-product-price="${product.price}"
                                data-product-image="${product.image || ''}"
                                data-aisle="${product.aisle}"
                                onclick="toggleWishlist(this)"
                                style="padding:12px 20px;font-size:16px;color:${inWishlist ? '#d9534f' : '#888'};">
                            ${inWishlist ? '❤️' : '🤍'} Wishlist
                        </button>
                    </div>
                </div>
            </div>
            
            <div style="margin-top:30px;border-top:2px solid #f0f0f0;padding-top:25px;">
                <div class="product-rating" data-product-id="${product.id}">
                    <div style="display:flex;align-items:center;gap:15px;flex-wrap:wrap;">
                        <div style="font-size:28px;" class="stars">⭐⭐⭐⭐⭐</div>
                        <div>
                            <div style="font-size:20px;font-weight:700;color:#1a1a2e;">
                                <span class="avg-rating">0.0</span> / 5.0
                            </div>
                            <div style="font-size:14px;color:#888;">
                                <span class="review-count">0</span> reviews
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-top:20px;background:#f8f9fa;padding:20px;border-radius:10px;">
                    <h4 style="margin-bottom:12px;">✍️ Write a Review</h4>
                    <div style="margin-bottom:12px;">
                        <label style="font-weight:600;display:block;margin-bottom:5px;">Your Rating:</label>
                        <div style="display:flex;gap:4px;font-size:30px;">
                            <span class="star-1-${product.id}" style="cursor:pointer;color:#ddd;transition:all 0.2s ease;" onmouseover="highlightStars('${product.id}', 1)" onmouseout="resetStars('${product.id}')" onclick="setRating('${product.id}', 1)">☆</span>
                            <span class="star-2-${product.id}" style="cursor:pointer;color:#ddd;transition:all 0.2s ease;" onmouseover="highlightStars('${product.id}', 2)" onmouseout="resetStars('${product.id}')" onclick="setRating('${product.id}', 2)">☆</span>
                            <span class="star-3-${product.id}" style="cursor:pointer;color:#ddd;transition:all 0.2s ease;" onmouseover="highlightStars('${product.id}', 3)" onmouseout="resetStars('${product.id}')" onclick="setRating('${product.id}', 3)">☆</span>
                            <span class="star-4-${product.id}" style="cursor:pointer;color:#ddd;transition:all 0.2s ease;" onmouseover="highlightStars('${product.id}', 4)" onmouseout="resetStars('${product.id}')" onclick="setRating('${product.id}', 4)">☆</span>
                            <span class="star-5-${product.id}" style="cursor:pointer;color:#ddd;transition:all 0.2s ease;" onmouseover="highlightStars('${product.id}', 5)" onmouseout="resetStars('${product.id}')" onclick="setRating('${product.id}', 5)">☆</span>
                        </div>
                        <input type="hidden" id="review-rating-${product.id}" value="0">
                        <span style="font-size:13px;color:#888;display:block;margin-top:4px;">Click on a star to rate</span>
                    </div>
                    <div style="margin-bottom:12px;">
                        <label for="review-comment-${product.id}" style="font-weight:600;display:block;margin-bottom:5px;">Your Review:</label>
                        <textarea id="review-comment-${product.id}" rows="3" placeholder="Share your experience with this product..." style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-family:inherit;font-size:14px;"></textarea>
                    </div>
                    <button onclick="submitReview('${product.id}')" class="btn btn-primary">Submit Review</button>
                </div>
                
                <div style="margin-top:20px;">
                    <h4 style="margin-bottom:12px;">📋 Customer Reviews</h4>
                    <div class="reviews-container" data-product-id="${product.id}"></div>
                </div>
            </div>
        </section>
    `;
    
    if (typeof displayReviews === 'function') {
        displayReviews(product.id);
        updateAverageRating(product.id);
    }
}

// ========================================
// ADMIN FUNCTIONS
// ========================================

function getAllProducts() {
    let products = JSON.parse(localStorage.getItem('merkatoProducts'));
    if (!products || products.length === 0) {
        products = getDefaultProducts();
        localStorage.setItem('merkatoProducts', JSON.stringify(products));
    }
    return products;
}

function loadAdminStats() {
    const products = getAllProducts();
    const orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    const users = JSON.parse(localStorage.getItem('merkatoUsers')) || [];
    
    let totalRevenue = 0;
    orders.forEach(order => {
        if (order.status !== 'Cancelled') {
            totalRevenue += order.total || 0;
        }
    });
    
    document.getElementById('statProducts').textContent = products.length;
    document.getElementById('statOrders').textContent = orders.length;
    document.getElementById('statRevenue').textContent = totalRevenue.toLocaleString();
    document.getElementById('statUsers').textContent = users.length || 0;
}

function loadAdminProducts() {
    const container = document.getElementById('adminProductList');
    const products = getAllProducts();
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="icon">📦</span>
                <p>No products found. Add your first product!</p>
            </div>
        `;
        return;
    }
    
    const aisleLabels = {
        food: '🍲 Food',
        home: '🏠 Home',
        apparel: '👗 Apparel',
        crafts: '🎨 Crafts',
        electronics: '📱 Electronics'
    };
    
    let html = '';
    products.forEach(product => {
        html += `
            <div class="admin-product-item" data-product-id="${product.id}">
                <div class="product-info">
                    <img src="${product.image || 'https://via.placeholder.com/50'}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/50'">
                    <div>
                        <div class="name">${product.name}</div>
                        <div class="details">${aisleLabels[product.aisle] || product.aisle} • ${product.price.toLocaleString()} ETB • ${product.stock} in stock</div>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-warning-sm" onclick="editProduct(${product.id})">✏️ Edit</button>
                    <button class="btn btn-danger-sm" onclick="deleteProduct(${product.id})">🗑️ Delete</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function loadAdminOrders() {
    const container = document.getElementById('adminOrderList');
    let orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="icon">📋</span>
                <p>No orders found.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    orders.forEach(order => {
        const statusColor = order.status === 'Delivered' ? '#2e7d32' :
                           order.status === 'Processing' ? '#e65100' :
                           order.status === 'Shipped' ? '#1565c0' :
                           order.status === 'Cancelled' ? '#c62828' : '#888';
        html += `
            <div class="admin-order-item">
                <div class="order-info">
                    <span class="order-id">#${order.id}</span>
                    <span class="order-date">${order.date}</span>
                    <span style="color:${statusColor};font-weight:600;">${order.status}</span>
                    <span class="order-total">${order.total.toLocaleString()} ETB</span>
                    <span style="font-size:13px;color:#888;">${order.items.length} items</span>
                </div>
                <div class="order-actions">
                    <select onchange="updateOrderStatus('${order.id}', this.value)">
                        <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>⏳ Processing</option>
                        <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>🚚 Shipped</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>✅ Delivered</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>❌ Cancelled</option>
                    </select>
                    <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails('${order.id}')">📋 Details</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function loadAdminUsers() {
    const container = document.getElementById('adminUserList');
    let users = JSON.parse(localStorage.getItem('merkatoUsers')) || [];
    
    if (users.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="icon">👤</span>
                <p>No registered users found.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    users.forEach(user => {
        html += `
            <div class="admin-user-item">
                <div class="user-info">
                    <div>
                        <div class="name">👤 ${user.name || 'User'}</div>
                        <div class="details">${user.email || ''} • Joined: ${user.joinDate || 'Unknown'}</div>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn btn-danger-sm" onclick="deleteUser('${user.email}')">🗑️ Remove</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function deleteProduct(id) {
    if (!confirm('⚠️ Are you sure you want to delete this product?')) return;
    
    let products = getAllProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem('merkatoProducts', JSON.stringify(products));
    
    loadAdminProducts();
    loadAdminStats();
    showNotification('🗑️ Product deleted successfully');
}

function deleteUser(email) {
    if (!confirm(`⚠️ Are you sure you want to remove this user?`)) return;
    
    let users = JSON.parse(localStorage.getItem('merkatoUsers')) || [];
    users = users.filter(u => u.email !== email);
    localStorage.setItem('merkatoUsers', JSON.stringify(users));
    
    loadAdminUsers();
    loadAdminStats();
    showNotification('🗑️ User removed successfully');
}

function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
        orders[index].status = newStatus;
        localStorage.setItem('merkatoOrders', JSON.stringify(orders));
        loadAdminOrders();
        loadAdminStats();
        showNotification(`✅ Order ${orderId} updated to ${newStatus}`);
    }
}

function viewOrderDetails(orderId) {
    let orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    const order = orders.find(o => o.id === orderId);
    if (!order) {
        showNotification('⚠️ Order not found');
        return;
    }
    
    const statusColor = order.status === 'Delivered' ? '#008000' :
                       order.status === 'Processing' ? '#ffa500' :
                       order.status === 'Shipped' ? '#0066cc' : '#d9534f';
    
    alert(
        `📦 Order Details\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Order #: ${order.id}\n` +
        `Date: ${order.date}\n` +
        `Status: ${order.status}\n` +
        `Payment: ${order.payment || 'Not specified'}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Items:\n` +
        order.items.map(item => `  ${item.name} × ${item.quantity} = ${(item.price * item.quantity).toLocaleString()} ETB`).join('\n') +
        `\n━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Subtotal: ${order.subtotal.toLocaleString()} ETB\n` +
        `Shipping: ${order.shipping === 0 ? 'FREE' : order.shipping.toLocaleString() + ' ETB'}\n` +
        `Tax: ${order.tax.toLocaleString()} ETB\n` +
        `Total: ${order.total.toLocaleString()} ETB\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Shipping Address:\n` +
        `${order.customer.name}\n` +
        `${order.customer.address}\n` +
        `📞 ${order.customer.phone}\n` +
        `✉️ ${order.customer.email}`
    );
}

function editProduct(id) {
    const products = getAllProducts();
    const product = products.find(p => p.id === id);
    if (!product) {
        showNotification('⚠️ Product not found', 'error');
        return;
    }
    
    document.getElementById('productName').value = product.name;
    document.getElementById('productAisle').value = product.aisle;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image || '';
    document.getElementById('productDescription').value = product.description || '';
    
    document.getElementById('productSubmitBtn').textContent = '✏️ Update Product';
    document.getElementById('cancelEditBtn').style.display = 'inline-block';
    
    switchTab('add-product');
    showNotification(`✏️ Editing "${product.name}"`);
}

function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const aisle = document.getElementById('productAisle').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    
    if (!name || !price || !stock) {
        showNotification('⚠️ Please fill in all required fields', 'error');
        return;
    }
    
    let products = getAllProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    products.push({
        id: newId,
        name: name,
        aisle: aisle,
        price: price,
        stock: stock,
        image: image || 'https://via.placeholder.com/130',
        description: description || ''
    });
    
    localStorage.setItem('merkatoProducts', JSON.stringify(products));
    
    document.getElementById('addProductForm').reset();
    
    loadAdminProducts();
    loadAdminStats();
    showNotification(`✅ Product "${name}" added successfully!`);
    
    switchTab('products');
}

function updateProduct(id) {
    const name = document.getElementById('productName').value.trim();
    const aisle = document.getElementById('productAisle').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    
    if (!name || !price || !stock) {
        showNotification('⚠️ Please fill in all required fields', 'error');
        return;
    }
    
    let products = getAllProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
        showNotification('⚠️ Product not found', 'error');
        return;
    }
    
    const oldName = products[index].name;
    
    products[index] = {
        ...products[index],
        name: name,
        aisle: aisle,
        price: price,
        stock: stock,
        image: image || products[index].image,
        description: description || products[index].description
    };
    
    localStorage.setItem('merkatoProducts', JSON.stringify(products));
    
    cancelEdit();
    
    loadAdminProducts();
    loadAdminStats();
    showNotification(`✅ Product "${oldName}" updated to "${name}" successfully!`);
}

function cancelEdit() {
    document.getElementById('addProductForm').reset();
    document.getElementById('productSubmitBtn').textContent = '➕ Add Product';
    document.getElementById('cancelEditBtn').style.display = 'none';
}

function switchTab(tab) {
    document.querySelectorAll('.admin-tabs button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.admin-tabs button[onclick*="${tab}"]`).classList.add('active');
    
    document.querySelectorAll('.admin-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    const panel = document.getElementById(`panel-${tab}`);
    if (panel) {
        panel.classList.add('active');
    }
    
    if (tab === 'products') loadAdminProducts();
    if (tab === 'orders') loadAdminOrders();
    if (tab === 'users') loadAdminUsers();
}

// ========================================
// DOM READY - Initialize Everything
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page Loaded:', window.location.pathname);

    updateSubscriberCount();
    loadCart();
    checkUserOnLoad();
    loadWishlist();
    loadTheme();
    createThemeToggle();
    loadReviews();
    syncProductData();

    // ===== CHECKOUT PAGE =====
    if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutSummary();
    }

    // ===== ORDER CONFIRMATION PAGE =====
    if (window.location.pathname.includes('order-confirmation.html')) {
        loadOrderConfirmation();
    }

    // ===== RETURNS PAGE =====
    if (window.location.pathname.includes('returns.html')) {
        loadReturnRequests();
    }

    // ===== PRODUCT DETAIL PAGE =====
    if (window.location.pathname.includes('product-detail.html')) {
        loadProductDetail();
        updateStockBadges();
    }
// Add tracking buttons to orders
if (window.location.pathname.includes('orders.html')) {
    setTimeout(addTrackingButton, 100);
}
    // ===== SHOP PAGE =====
    if (window.location.pathname.includes('shop.html')) {
        loadShopProducts();
        updateStockBadges();
    }

    // ===== ORDERS PAGE =====
    if (window.location.pathname.includes('orders.html')) {
        loadOrders();
    }

    // ===== PROFILE PAGE =====
    if (window.location.pathname.includes('profile.html')) {
        loadUserProfile();
    }

    // ===== ADMIN PAGE =====
    if (window.location.pathname.includes('admin.html')) {
        loadAdminStats();
        loadAdminProducts();
        loadAdminOrders();
        loadAdminUsers();
    }

    // ===== PROFILE FORM =====
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUserProfile();
        });
    }

    // ===== CART PAGE =====
    if (document.querySelector('.cart-items')) {
        displayCartItems();
    }

// ===== CHECK ADMIN ACCESS =====
if (window.location.pathname.includes('admin.html')) {
    checkAdminAccess();
}

    // ===== ADD TO CART BUTTONS =====
    initAddToCartButtons();

    // ===== SEARCH =====
    initialiseSearch();

    updateWishlistButtons();
    
    console.log('✅ MERKATO JavaScript Ready!');
});

console.log('🛒 MERKATO JavaScript Loaded!');
console.log('👤 Login system ready!');

// ========================================
// PAYMENT SYSTEM
// ========================================

let selectedPayment = 'telebirr';
let currentOrder = null;

function openPaymentModal() {
    const form = document.getElementById('checkoutForm');
    const fullname = document.getElementById('fullname')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const address = document.getElementById('address')?.value || '';
    
    if (!fullname || !email || !phone || !address) {
        showNotification('⚠️ Please fill in all shipping details');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('⚠️ Your cart is empty');
        return;
    }
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 3000 ? 0 : 200;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    
    document.getElementById('paymentAmount').textContent = total.toLocaleString() + ' ETB';
    document.getElementById('paymentModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset states
    document.getElementById('paymentInitial').style.display = 'block';
    document.getElementById('paymentProcessing').style.display = 'none';
    document.getElementById('paymentSuccess').style.display = 'none';
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function selectPayment(method) {
    selectedPayment = method;
    
    // Update button styles
    document.querySelectorAll('.payment-options button').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.borderColor = '#e0e0e0';
        btn.style.background = '#fff';
    });
    
    const btn = document.getElementById(`pay-${method}`);
    if (btn) {
        btn.classList.add('selected');
        btn.style.borderColor = '#008000';
        btn.style.background = '#e8f5e9';
    }
}

function processPayment() {
    const fullname = document.getElementById('fullname')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const address = document.getElementById('address')?.value || '';
    
    // Show processing
    document.getElementById('paymentInitial').style.display = 'none';
    document.getElementById('paymentProcessing').style.display = 'block';
    
    // Animated dots
    let dots = 0;
    const dotInterval = setInterval(() => {
        dots = (dots % 3) + 1;
        document.getElementById('processingDots').textContent = '.'.repeat(dots);
    }, 500);
    
    // Simulate a brief processing delay, then place the real order
    setTimeout(async () => {
        clearInterval(dotInterval);
        
        const subtotal = getCartTotal();
        const shipping = subtotal > 3000 ? 0 : 200;
        const tax = subtotal * 0.15;
        const total = subtotal + shipping + tax;
        
        const orderPayload = {
            items: cart.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity
            })),
            customer: {
                name: fullname,
                email: email,
                phone: phone,
                address: address
            },
            payment: selectedPayment,
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total
        };
        
        if (!isLoggedIn()) {
            document.getElementById('paymentProcessing').style.display = 'none';
            document.getElementById('paymentInitial').style.display = 'block';
            showNotification('⚠️ Please sign in to place an order');
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
            return;
        }
        
        let createdOrder;
        try {
            createdOrder = await createOrder(orderPayload);
        } catch (error) {
            document.getElementById('paymentProcessing').style.display = 'none';
            document.getElementById('paymentInitial').style.display = 'block';
            showNotification('❌ Order failed: ' + error.message);
            return;
        }
        
        // Normalize the real order (MongoDB _id/createdAt) into the shape
        // the rest of this file (receipt printing, order history) expects.
        currentOrder = {
            ...createdOrder,
            id: createdOrder._id,
            date: new Date(createdOrder.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            })
        };
        const orderNumber = currentOrder.id;
        
        // Keep a local mirror so order history/tracking pages (which read
        // this cache for display convenience) show the new order immediately.
        let orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
        orders.unshift(currentOrder);
        localStorage.setItem('merkatoOrders', JSON.stringify(orders));
        localStorage.setItem('lastOrderNumber', orderNumber);
        
        // Clear cart
        cart = [];
        saveCart();
        updateCartCount();
        
        // Show success
        document.getElementById('paymentProcessing').style.display = 'none';
        document.getElementById('paymentSuccess').style.display = 'block';
        document.getElementById('successOrderId').textContent = orderNumber;
        document.getElementById('successPayment').textContent = selectedPayment === 'telebirr' ? 'Telebirr' : 
                                                              selectedPayment === 'cod' ? 'Cash on Delivery' : 
                                                              'Credit/Debit Card';
        document.getElementById('successTotal').textContent = total.toLocaleString() + ' ETB';
        
        showNotification('✅ Payment successful! Order #' + orderNumber);
        
    }, 2500);
}

function printOrderReceipt() {
    if (!currentOrder) {
        showNotification('⚠️ No order to print');
        return;
    }
    
    const order = currentOrder;
    let itemsHtml = order.items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toLocaleString()} ETB</td>
            <td>${item.subtotal.toLocaleString()} ETB</td>
        </tr>
    `).join('');
    
    const receiptWindow = window.open('', '_blank', 'width=600,height=600');
    receiptWindow.document.write(`
        <html>
        <head>
            <title>MERKATO - Order Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; }
                .header { text-align: center; border-bottom: 2px solid #008000; padding-bottom: 10px; }
                .header h1 { color: #008000; margin: 0; }
                .header p { color: #888; margin: 5px 0; }
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                th { background: #f5f5f5; text-align: left; padding: 8px; }
                td { padding: 6px 8px; border-bottom: 1px solid #eee; }
                .total { font-size: 18px; font-weight: bold; text-align: right; border-top: 2px solid #000; padding-top: 10px; }
                .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
                .status { display: inline-block; padding: 2px 12px; border-radius: 12px; background: #ffa500; color: #fff; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🛒 MERKATO</h1>
                <p>Ethiopian Digital Marketplace</p>
                <p><strong>Order Receipt</strong></p>
            </div>
            
            <div style="margin: 10px 0;">
                <p><strong>Order #:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${order.date}</p>
                <p><strong>Status:</strong> <span class="status">${order.status}</span></p>
                <p><strong>Payment:</strong> ${order.payment === 'telebirr' ? 'Telebirr' : order.payment === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
            </div>
            
            <h4>Items</h4>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                </tr>
                ${itemsHtml}
            </table>
            
            <div class="total">
                <div>Subtotal: ${order.subtotal.toLocaleString()} ETB</div>
                <div>Shipping: ${order.shipping === 0 ? 'FREE' : order.shipping.toLocaleString() + ' ETB'}</div>
                <div>Tax: ${order.tax.toLocaleString()} ETB</div>
                <div style="font-size:22px;color:#d9534f;">Total: ${order.total.toLocaleString()} ETB</div>
            </div>
            
            <div style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                <p><strong>📦 Shipping Address</strong></p>
                <p>${order.customer.name}<br>${order.customer.address}<br>📞 ${order.customer.phone}<br>✉️ ${order.customer.email}</p>
            </div>
            
            <div class="footer">
                <p>&copy; 2026 MERKATO INC. All rights reserved.</p>
                <p>Thank you for your purchase!</p>
            </div>
            
            <script>
                window.print();
            <\/script>
        </body>
        </html>
    `);
    receiptWindow.document.close();
}

// Override the processOrder function to use payment modal
function processOrder(event) {
    if (event) event.preventDefault();
    openPaymentModal();
}

// ========================================
// ORDER TRACKING
// ========================================

function trackOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('⚠️ Order not found');
        return;
    }
    
    const modal = document.getElementById('trackingModal');
    const content = document.getElementById('trackingContent');
    
    // Define tracking steps
    const steps = [
        { status: 'Processing', icon: '⏳', label: 'Order Received' },
        { status: 'Shipped', icon: '🚚', label: 'Shipped' },
        { status: 'Delivered', icon: '✅', label: 'Delivered' }
    ];
    
    let currentStep = 0;
    if (order.status === 'Shipped') currentStep = 1;
    else if (order.status === 'Delivered') currentStep = 2;
    else if (order.status === 'Cancelled') currentStep = -1;
    
    let html = `
        <div style="margin-bottom:15px;">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;">
                <div>
                    <div style="font-size:13px;color:#888;">Order #</div>
                    <div style="font-weight:700;font-size:18px;">${order.id}</div>
                </div>
                <div>
                    <div style="font-size:13px;color:#888;">Status</div>
                    <div style="font-weight:600;color:${order.status === 'Cancelled' ? '#d9534f' : '#008000'};">${order.status}</div>
                </div>
                <div>
                    <div style="font-size:13px;color:#888;">Date</div>
                    <div style="font-weight:600;">${order.date}</div>
                </div>
            </div>
        </div>
    `;
    
    if (order.status === 'Cancelled') {
        html += `
            <div style="text-align:center;padding:20px;background:#ffebee;border-radius:8px;">
                <div style="font-size:48px;">❌</div>
                <h3 style="color:#c62828;">Order Cancelled</h3>
                <p style="color:#888;">This order has been cancelled.</p>
            </div>
        `;
    } else {
        html += `
            <div style="position:relative;padding:10px 0;">
                ${steps.map((step, index) => {
                    const isCompleted = index <= currentStep;
                    const isActive = index === currentStep;
                    const isLast = index === steps.length - 1;
                    
                    return `
                        <div style="display:flex;align-items:flex-start;gap:15px;margin-bottom:${isLast ? '0' : '20px'};">
                            <div style="position:relative;">
                                <div style="
                                    width: 40px;
                                    height: 40px;
                                    border-radius: 50%;
                                    background: ${isCompleted ? '#008000' : '#e0e0e0'};
                                    color: ${isCompleted ? '#fff' : '#888'};
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 18px;
                                    border: 3px solid ${isActive ? '#ffd700' : 'transparent'};
                                    box-shadow: ${isActive ? '0 0 20px rgba(255,215,0,0.3)' : 'none'};
                                    transition: all 0.3s ease;
                                ">
                                    ${isCompleted ? '✅' : step.icon}
                                </div>
                                ${!isLast ? `
                                    <div style="
                                        position: absolute;
                                        top: 40px;
                                        left: 50%;
                                        width: 3px;
                                        height: 30px;
                                        background: ${isCompleted ? '#008000' : '#e0e0e0'};
                                        transform: translateX(-50%);
                                    "></div>
                                ` : ''}
                            </div>
                            <div style="flex:1;padding-top:5px;">
                                <div style="font-weight:${isActive ? '700' : '600'};color:${isCompleted ? '#008000' : '#888'};">
                                    ${step.label}
                                    ${isActive ? ' <span style="font-size:12px;color:#ffa500;">(In Progress)</span>' : ''}
                                </div>
                                <div style="font-size:12px;color:#888;">${isCompleted ? '✓ Completed' : isActive ? '⏳ Processing' : 'Pending'}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        // Show estimated delivery
        if (order.status === 'Processing') {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 5);
            html += `
                <div style="background:#fff3cd;padding:12px;border-radius:8px;margin-top:15px;text-align:center;color:#856404;">
                    📅 Estimated Delivery: ${deliveryDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            `;
        } else if (order.status === 'Shipped') {
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 2);
            html += `
                <div style="background:#e3f2fd;padding:12px;border-radius:8px;margin-top:15px;text-align:center;color:#1565c0;">
                    🚚 Your order is on the way! Expected delivery: ${deliveryDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            `;
        } else if (order.status === 'Delivered') {
            html += `
                <div style="background:#e8f5e9;padding:12px;border-radius:8px;margin-top:15px;text-align:center;color:#2e7d32;">
                    ✅ Order delivered successfully! Thank you for shopping with MERKATO.
                </div>
            `;
        }
    }
    
    content.innerHTML = html;
    modal.style.display = 'flex';
}

// Add tracking button to orders
function addTrackingButton() {
    const orderActions = document.querySelectorAll('.order-footer .order-actions');
    orderActions.forEach((actions, index) => {
        const orderId = actions.closest('.order-card').querySelector('.order-id')?.textContent?.trim() || '';
        if (orderId) {
            const btn = document.createElement('button');
            btn.className = 'btn btn-secondary btn-sm';
            btn.textContent = '📦 Track';
            btn.onclick = () => trackOrder(orderId);
            actions.appendChild(btn);
        }
    });
}

// ========================================
// ADMIN ACCESS CONTROL
// ========================================

// Admin credentials (used by the demo admin login only)
const ADMIN_CREDENTIALS = {
    email: 'admin@merkato.com',
    password: 'admin123'
};

// Check if user is admin — checks the real isAdmin flag so this works for
// both the demo admin login and real backend accounts (isAdmin:true in MongoDB)
function isAdmin() {
    const user = JSON.parse(localStorage.getItem('merkatoUser'));
    return !!(user && user.isAdmin === true);
}

// Check admin access on page load
function checkAdminAccess() {
    // If on admin page
    if (window.location.pathname.includes('admin.html')) {
        if (!isAdmin()) {
            showNotification('⚠️ Admin access only. Redirecting...');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            return false;
        }
        return true;
    }
    return true;
}

// Admin login function (call from login.html)
function adminLogin(email, password) {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Create admin user session
        const adminUser = {
            name: 'Admin',
            email: ADMIN_CREDENTIALS.email,
            isAdmin: true,
            joinDate: new Date().toLocaleDateString()
        };
        localStorage.setItem('merkatoUser', JSON.stringify(adminUser));
        localStorage.setItem('merkatoUserData', JSON.stringify(adminUser));
        
        showNotification('✅ Admin logged in successfully!');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
        return true;
    } else {
        showNotification('❌ Invalid admin credentials');
        return false;
    }
}

function showAdminBadge() {
    const user = JSON.parse(localStorage.getItem('merkatoUser'));
    const badge = document.getElementById('adminBadge');
    if (badge && user && user.email === 'admin@merkato.com') {
        badge.style.display = 'inline-block';
    }
}