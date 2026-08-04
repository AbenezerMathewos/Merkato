// ========================================
// MERKATO - Complete JavaScript File
// Version: 2.0 (Reviews Fixed)
// ========================================

console.log('🛒 MERKATO JavaScript Loaded!');
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

function loginUser() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    if (!emailInput || !passwordInput) return false;
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
        showNotification('⚠️ Please enter email and password');
        return false;
    }
    
    let userName = email.split('@')[0];
    userName = userName.replace(/[^a-zA-Z]/g, ' ');
    userName = userName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    if (!userName) userName = 'User';
    
    let userData = localStorage.getItem('merkatoUserData');
    let userProfile = null;
    
    if (userData) {
        userProfile = JSON.parse(userData);
    } else {
        userProfile = {
            name: userName,
            email: email,
            phone: '',
            address: '',
            joinDate: new Date().toLocaleDateString()
        };
    }
    
    currentUser = {
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        joinDate: userProfile.joinDate || new Date().toLocaleDateString()
    };
    
    localStorage.setItem('merkatoUser', JSON.stringify(currentUser));
    localStorage.setItem('merkatoUserData', JSON.stringify(currentUser));
    
    hasShownWelcome = false;
    sessionStorage.removeItem('welcomeShown');
    
    showWelcomeMessage(currentUser.name);
    updateUserDisplay();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
    
    return true;
}

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
// LOGOUT FUNCTION
// ========================================

function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('merkatoUser');
        localStorage.removeItem('merkatoUserData');
        currentUser = null;
        sessionStorage.removeItem('welcomeShown');
        hasShownWelcome = false;
        
        showNotification('👋 You have been logged out successfully!');
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
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

function loadUserProfile() {
    const userData = localStorage.getItem('merkatoUser');
    if (!userData) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(userData);
    
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const addressInput = document.getElementById('profile-address');
    const joinDateDisplay = document.getElementById('profile-join-date');
    
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (addressInput) addressInput.value = user.address || '';
    if (joinDateDisplay) joinDateDisplay.textContent = user.joinDate || new Date().toLocaleDateString();
}

function saveUserProfile() {
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
    
    const userData = {
        name: name,
        email: email,
        phone: phone,
        address: address,
        joinDate: new Date().toLocaleDateString()
    };
    
    localStorage.setItem('merkatoUser', JSON.stringify(userData));
    localStorage.setItem('merkatoUserData', JSON.stringify(userData));
    currentUser = userData;
    
    showNotification('✅ Profile saved successfully!');
    updateUserDisplay();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
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
                <a href="product-detail.html#${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                </a>
                <div class="item-details">
                    <h3><a href="product-detail.html#${item.id}">${item.name}</a></h3>
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
    
    // Generate UNIQUE ID for each review
    const uniqueId = 'r' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    
    // Check if user has purchased this product
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
        id: uniqueId,  // ← UNIQUE ID for every review
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
        // Check if user already voted
        const voted = localStorage.getItem(`helpful_${review.id}`);
        
        const verifiedBadge = review.verified 
            ? '<span style="font-size:11px;background:#008000;color:#fff;padding:2px 10px;border-radius:12px;margin-left:6px;font-weight:600;">✓ Verified</span>' 
            : '';
        
        // Helpful and Not Helpful counts
        const helpfulCount = review.helpful || 0;
        const notHelpfulCount = review.notHelpful || 0;
        const totalVotes = helpfulCount + notHelpfulCount;
        
        // Button styles based on vote status
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
                
                <!-- ===== HELPFUL / NOT HELPFUL BUTTONS ===== -->
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

// ===== FIXED STAR RATING FUNCTIONS =====

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
    
    // Get user info
    let userName = 'Anonymous';
    let userEmail = '';
    const userData = localStorage.getItem('merkatoUser');
    if (userData) {
        const user = JSON.parse(userData);
        userName = user.name || 'Anonymous';
        userEmail = user.email || '';
    }
    
    // Pass userEmail to addReview
    addReview(productId, userName, rating, comment, userEmail);
    
    // Reset form
    ratingInput.value = 0;
    commentInput.value = '';
    selectedRatings[productId] = 0;
    resetStars(productId);
    
    // Update display
    displayReviews(productId);
    updateAverageRating(productId);
}

// ========================================
// DOM READY - Initialize Everything
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page Loaded:', window.location.pathname);

    updateSubscriberCount();
    loadCart();
    checkUserOnLoad();

    // ===== LOAD WISHLIST =====
    loadWishlist();

    // ===== LOAD REVIEWS =====
    loadReviews();

    // ===== CHECKOUT PAGE =====
    if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutSummary();
    }

    // ===== ORDER CONFIRMATION PAGE =====
    if (window.location.pathname.includes('order-confirmation.html')) {
        loadOrderConfirmation();
    }

    // Load return requests if on returns page
if (window.location.pathname.includes('returns.html')) {
    loadReturnRequests();
}
    // ===== DISPLAY REVIEWS ON PRODUCT DETAIL PAGE =====
    if (window.location.pathname.includes('product-detail.html')) {
        const productSections = document.querySelectorAll('section[id]');
        productSections.forEach(section => {
            const productId = section.id;
            if (productId) {
                displayReviews(productId);
                updateAverageRating(productId);
            }
        });
    }

    // Update stock badges
if (window.location.pathname.includes('product-detail.html')) {
    updateStockBadges();
}
if (window.location.pathname.includes('shop.html')) {
    updateStockBadges();
}

    // ===== UPDATE SHOP PAGE RATINGS =====
    if (window.location.pathname.includes('shop.html')) {
        updateShopRatings();
    }

    if (window.location.pathname.includes('profile.html')) {
        loadUserProfile();
    }

    // Check if on shop page and apply initial filters
if (window.location.pathname.includes('shop.html')) {
    // Apply filters on page load
    setTimeout(() => {
        applyFilters();
    }, 100);
}

    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUserProfile();
        });
    }

    if (document.querySelector('.cart-items')) {
        displayCartItems();
    }

    initAddToCartButtons();
    initialiseSearch();

    const loginForm = document.querySelector('form[action="index.html"]');
    if (loginForm && window.location.pathname.includes('login.html')) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginUser();
        });
    }
    
    // ===== UPDATE WISHLIST BUTTONS =====
    updateWishlistButtons();
    
    console.log('✅ MERKATO JavaScript Ready!');
});

console.log('🛒 MERKATO JavaScript Loaded!');
console.log('👤 Login system ready!');

// ========================================
// SHOP PAGE - DISPLAY RATINGS
// ========================================

function updateShopRatings() {
    const ratingElements = document.querySelectorAll('.product-rating-shop');
    
    ratingElements.forEach(element => {
        const productId = element.dataset.productId;
        if (productId) {
            const avg = getAverageRating(productId);
            const count = getReviewCount(productId);
            
            const starsSpan = element.querySelector('.shop-stars');
            const countSpan = element.querySelector('.shop-review-count');
            
            if (starsSpan) {
                starsSpan.textContent = renderStars(avg);
            }
            if (countSpan) {
                countSpan.textContent = `(${count} ${count === 1 ? 'review' : 'reviews'})`;
            }
        }
    });
}

// ========================================
// HELPFUL VOTES SYSTEM
// ========================================

function markHelpful(reviewId, productId, voteType) {
    const productReviews = reviews[productId] || [];
    const reviewIndex = productReviews.findIndex(r => r.id === reviewId);
    
    if (reviewIndex === -1) {
        showNotification('⚠️ Review not found');
        return;
    }
    
    // Check if user already voted on THIS review
    const votedKey = `helpful_${reviewId}`;
    const voted = localStorage.getItem(votedKey);
    if (voted) {
        showNotification('⚠️ You already voted on this review');
        return;
    }
    
    // Update vote count
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
    // Check if already in wishlist
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
    
    // Add to cart
    addToCart(item.id, item.name, item.price, item.image);
    
    // Remove from wishlist
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
    
    // Clear wishlist
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
                <a href="product-detail.html#${item.id}">
                    <img src="${item.image || 'https://via.placeholder.com/130x130?text=No+Image'}" alt="${item.name}">
                </a>
                <div class="aisle-tag">${item.aisle || 'Aisle'}</div>
                <h3><a href="product-detail.html#${item.id}">${item.name}</a></h3>
                <div class="price">${item.price.toLocaleString()} ETB</div>
                <button class="btn btn-primary btn-sm move-to-cart-btn" onclick="moveToCart('${item.id}')">
                    🛒 Move to Cart
                </button>
            </div>
        `;
    });
    
    // Add action buttons at bottom
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
    
    // Check if already in wishlist
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
    
    // Get form data
    const fullname = document.getElementById('fullname')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const address = document.getElementById('address')?.value || '';
    const payment = document.querySelector('input[name="payment"]:checked')?.value || '';
    
    // Validate
    if (!fullname || !email || !phone || !address) {
        showNotification('⚠️ Please fill in all required fields');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('⚠️ Your cart is empty');
        return;
    }
    
    // Generate order number
    const orderNumber = generateOrderNumber();
    
    // Calculate totals
    const subtotal = getCartTotal();
    const shipping = subtotal > 3000 ? 0 : 200;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    
    // Create order object
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
    
    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    orders.unshift(order); // Add to beginning
    localStorage.setItem('merkatoOrders', JSON.stringify(orders));
    
    // Save order number for confirmation page
    localStorage.setItem('lastOrderNumber', orderNumber);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    // Redirect to confirmation page
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
    
    // Display order details
    displayOrderConfirmation(order);
}

function displayOrderConfirmation(order) {
    const container = document.getElementById('orderConfirmation');
    if (!container) return;
    
    const statusColor = '#008000';
    
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
    // Update order summary on checkout page
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
    
    // Build order items list
    let itemsHtml = '';
    cart.forEach(item => {
        itemsHtml += `
            <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;">
                <span>${item.name} × ${item.quantity}</span>
                <strong>${(item.price * item.quantity).toLocaleString()} ETB</strong>
            </li>
        `;
    });
    
    // Calculate totals
    const subtotal = getCartTotal();
    const shipping = subtotal > 3000 ? 0 : 200;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    const itemCount = getCartCount();
    
    const shippingText = shipping === 0 ? 'FREE' : shipping.toLocaleString() + ' ETB';
    const shippingColor = shipping === 0 ? '#008000' : '#d9534f';
    
    // Update main summary
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
    
    // Update sidebar
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
    
    // Get form data
    const fullname = document.getElementById('fullname')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const address = document.getElementById('address')?.value || '';
    const payment = document.querySelector('input[name="payment"]:checked')?.value || '';
    
    // Validate
    if (!fullname || !email || !phone || !address) {
        showNotification('⚠️ Please fill in all required fields');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('⚠️ Your cart is empty');
        return;
    }
    
    // Generate order number
    const orderNumber = generateOrderNumber();
    
    // Calculate totals
    const subtotal = getCartTotal();
    const shipping = subtotal > 3000 ? 0 : 200;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    
    // Create order object
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
    
    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    orders.unshift(order); // Add to beginning
    localStorage.setItem('merkatoOrders', JSON.stringify(orders));
    
    // Save order number for confirmation page
    localStorage.setItem('lastOrderNumber', orderNumber);
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    // Redirect to confirmation page
    showNotification('✅ Order placed successfully! Redirecting...');
    setTimeout(() => {
        window.location.href = 'order-confirmation.html';
    }, 1000);
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
// NEWSLETTER SYSTEM
// ========================================

function subscribeNewsletter(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('newsletterEmail');
    const statusDiv = document.getElementById('newsletterStatus');
    const email = emailInput.value.trim();
    
    // Validate email
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
    
    // Check if already subscribed
    let subscribers = JSON.parse(localStorage.getItem('merkatoSubscribers')) || [];
    
    if (subscribers.includes(email)) {
        statusDiv.className = 'newsletter-status error';
        statusDiv.textContent = '⚠️ This email is already subscribed!';
        return;
    }
    
    // Add to subscribers
    subscribers.push(email);
    localStorage.setItem('merkatoSubscribers', JSON.stringify(subscribers));
    
    // Update count
    updateSubscriberCount();
    
    // Show success
    statusDiv.className = 'newsletter-status success';
    statusDiv.textContent = '✅ Thank you for subscribing! 🎉';
    
    // Clear input
    emailInput.value = '';
    
    // Show notification
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
// ADD TO DOM READY SECTION
// ========================================

updateSubscriberCount();

// ========================================
// RETURN SYSTEM - COMPLETE
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
    
    // Get form data
    const orderNumber = document.getElementById('order-number').value.trim();
    const itemToReturn = document.getElementById('item-return').value;
    const quantity = document.getElementById('quantity').value;
    const returnReason = document.getElementById('return-reason').value;
    const otherReason = document.getElementById('other-reason-text').value.trim();
    const comments = document.getElementById('comments').value.trim();
    
    // Validate
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
    
    // Check if item is non-returnable
    const nonReturnableItems = ['buna', 'berbere', 'teff', 'shiro', 'korerima', 'kibe'];
    if (nonReturnableItems.includes(itemToReturn)) {
        showNotification('⚠️ This item is non-returnable (food/perishable items)');
        return;
    }
    
    // Get item name
    const itemSelect = document.getElementById('item-return');
    const itemName = itemSelect.options[itemSelect.selectedIndex].text;
    
    // Get reason text
    const reasonSelect = document.getElementById('return-reason');
    let reasonText = reasonSelect.options[reasonSelect.selectedIndex].text;
    if (returnReason === 'other') {
        reasonText = otherReason;
    }
    
    // Create return request
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
    
    // Save to localStorage
    let returns = JSON.parse(localStorage.getItem('merkatoReturns')) || [];
    returns.unshift(returnRequest); // Add to beginning
    localStorage.setItem('merkatoReturns', JSON.stringify(returns));
    
    // Reset form
    document.getElementById('returnForm').reset();
    document.getElementById('otherReasonInput').classList.remove('show');
    
    // Update returns display
    loadReturnRequests();
    
    // Show creative modal
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
                <!-- Progress bar for pending -->
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
    
    // Add summary stats
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

function submitReturnRequest(event) {
    event.preventDefault();
    
    // Get form data
    const orderNumber = document.getElementById('order-number').value.trim();
    const itemToReturn = document.getElementById('item-return').value;
    const quantity = document.getElementById('quantity').value;
    const returnReason = document.getElementById('return-reason').value;
    const otherReason = document.getElementById('other-reason-text').value.trim();
    const comments = document.getElementById('comments').value.trim();
    
    // Validate
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
    
    // Check if "Other" reason is selected and filled
    if (returnReason === 'other' && !otherReason) {
        showNotification('⚠️ Please specify your reason');
        return;
    }
    
    // Check if item is non-returnable
    const nonReturnableItems = ['buna', 'berbere', 'teff', 'shiro', 'korerima', 'kibe'];
    if (nonReturnableItems.includes(itemToReturn)) {
        showNotification('⚠️ This item is non-returnable (food/perishable items)');
        return;
    }
    
    // Get item name
    const itemSelect = document.getElementById('item-return');
    const itemName = itemSelect.options[itemSelect.selectedIndex].text;
    
    // Get reason text
    const reasonSelect = document.getElementById('return-reason');
    let reasonText = reasonSelect.options[reasonSelect.selectedIndex].text;
    if (returnReason === 'other') {
        reasonText = otherReason;
    }
    
    // Create return request
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
    
    // Save to localStorage
    let returns = JSON.parse(localStorage.getItem('merkatoReturns')) || [];
    returns.push(returnRequest);
    localStorage.setItem('merkatoReturns', JSON.stringify(returns));
    
    // Reset form
    document.getElementById('returnForm').reset();
    document.getElementById('otherReasonInput').classList.remove('show');
    
    // Show creative modal instead of alert
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
    
    let html = '';
    returns.forEach((returnReq, index) => {
        const statusColor = returnReq.status === 'Pending' ? '#ffa500' :
                           returnReq.status === 'Approved' ? '#008000' :
                           returnReq.status === 'Rejected' ? '#d9534f' : '#888';
        
        html += `
            <div style="
                background: #fff;
                border-radius: 10px;
                border: 1px solid #e0e0e0;
                padding: 16px 20px;
                margin-bottom: 12px;
                transition: all 0.3s ease;
            " onmouseover="this.style.borderColor='#008000'" onmouseout="this.style.borderColor='#e0e0e0'">
                <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                    <div>
                        <strong style="color:#1a1a2e;">#${returnReq.id}</strong>
                        <span style="color:#888;font-size:13px;margin-left:10px;">${returnReq.date}</span>
                    </div>
                    <div>
                        <span style="
                            display:inline-block;
                            padding:2px 12px;
                            border-radius:12px;
                            font-size:12px;
                            font-weight:600;
                            background: ${statusColor}20;
                            color: ${statusColor};
                        ">${returnReq.status}</span>
                    </div>
                </div>
                <div style="margin-top:8px;font-size:14px;color:#444;">
                    <strong>Order:</strong> ${returnReq.orderNumber} &nbsp;|&nbsp;
                    <strong>Item:</strong> ${returnReq.item} × ${returnReq.quantity}
                </div>
                <div style="font-size:13px;color:#666;margin-top:4px;">
                    <strong>Reason:</strong> ${returnReq.reason}
                </div>
                ${returnReq.comments ? `<div style="font-size:13px;color:#888;margin-top:4px;">📝 ${returnReq.comments}</div>` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ========================================
// RETURN SUCCESS MODAL
// ========================================

function showReturnSuccessModal(returnRequest) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-box">
            <!-- Confetti Emojis -->
            <div class="modal-confetti">🎉</div>
            <div class="modal-confetti">✨</div>
            <div class="modal-confetti">🎊</div>
            <div class="modal-confetti">🌟</div>
            <div class="modal-confetti">💫</div>
            
            <!-- Icon -->
            <div class="modal-icon">✅</div>
            
            <!-- Title -->
            <h2 class="modal-title">Return Submitted! 🎉</h2>
            <p class="modal-subtitle">We'll review and contact you within 2-3 days.</p>
            
            <hr class="modal-divider">
            
            <!-- Details -->
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
            
            <!-- Next Steps -->
            <div class="modal-next-steps">
                <div class="steps-text">
                    <span>📌</span>
                    <span><strong>Next:</strong> We'll review and email you confirmation.</span>
                </div>
            </div>
            
            <!-- Buttons -->
            <div class="modal-actions">
                <button class="btn btn-primary" onclick="closeReturnModal()">✅ OK</button>
                <a href="returns.html" class="btn btn-secondary">📋 My Returns</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeReturnModal();
        }
    });
    
    // Close on Escape key
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

// ========================================
// ADMIN - RETURN STATUS MANAGEMENT
// ========================================

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
    // Get selected aisles
    const checkboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const selectedAisles = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            selectedAisles.push(cb.value);
        }
    });
    
    // Get price range
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || 100000;
    
    // Get sort option
    const sortBy = document.getElementById('sortBy').value;
    
    // Update active filters
    activeFilters.aisles = selectedAisles;
    activeFilters.minPrice = minPrice;
    activeFilters.maxPrice = maxPrice;
    activeFilters.sortBy = sortBy;
    
    // Filter products
    filterProducts(selectedAisles, minPrice, maxPrice, sortBy);
}

function filterProducts(aisles, minPrice, maxPrice, sortBy) {
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    productCards.forEach(card => {
        const cardAisle = card.dataset.aisle || '';
        const cardPrice = parseFloat(card.dataset.price) || 0;
        const cardName = card.querySelector('h3')?.textContent || '';
        
        // Check aisle filter
        let aisleMatch = aisles.includes('all') || aisles.includes(cardAisle);
        if (!aisleMatch) {
            card.style.display = 'none';
            return;
        }
        
        // Check price filter
        if (cardPrice < minPrice || cardPrice > maxPrice) {
            card.style.display = 'none';
            return;
        }
        
        // Product passes all filters
        card.style.display = '';
        visibleCount++;
    });
    
    // Update count
    document.getElementById('productCount').textContent = visibleCount;
    
    // Show/hide no results message
    showNoProductsMessage(visibleCount);
    
    // Sort products
    if (sortBy !== 'default') {
        sortProducts(sortBy);
    }
    
    // Update filter tags
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
                // Simulate popularity (random order)
                return 0.5 - Math.random();
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
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
        // Check if all are unchecked
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
    // Reset checkboxes
    document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.value === 'all';
    });
    
    // Reset price
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 100000;
    
    // Reset sort
    document.getElementById('sortBy').value = 'default';
    
    // Reset active filters
    activeFilters = {
        aisles: ['all'],
        minPrice: 0,
        maxPrice: 100000,
        sortBy: 'default'
    };
    
    // Apply
    applyFilters();
    
    // Close mobile filter sidebar
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
    // Update on product detail page
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
    
    // Update on shop page
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
    
    // Save notification request
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