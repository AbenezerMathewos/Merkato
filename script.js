// ========================================
// MERKATO - Complete JavaScript File
// Version: 2.0 (Reviews Fixed)
// ========================================

console.log('🛒 MERKATO JavaScript Loaded!');

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

function addReview(productId, userName, rating, comment) {
    if (!reviews[productId]) {
        reviews[productId] = [];
    }
    
    const newReview = {
        id: 'r' + Date.now(),
        userName: userName || 'Anonymous',
        rating: parseInt(rating),
        comment: comment.trim(),
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        verified: true,
        helpful: 0
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
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="font-weight:600;color:#1a1a2e;">${review.userName}</span>
                            ${review.verified ? '<span style="font-size:11px;background:#008000;color:#fff;padding:2px 8px;border-radius:12px;">✓ Verified</span>' : ''}
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
                ${review.helpful > 0 ? `
                    <div style="margin-top:8px;font-size:12px;color:#888;">
                        👍 ${review.helpful} people found this helpful
                    </div>
                ` : ''}
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
    
    let userName = 'Anonymous';
    const userData = localStorage.getItem('merkatoUser');
    if (userData) {
        const user = JSON.parse(userData);
        userName = user.name || 'Anonymous';
    }
    
    addReview(productId, userName, rating, comment);
    
    // Reset form
    ratingInput.value = 0;
    commentInput.value = '';
    selectedRatings[productId] = 0;
    resetStars(productId);
    
    displayReviews(productId);
    updateAverageRating(productId);
}

// ========================================
// DOM READY - Initialize Everything
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page Loaded:', window.location.pathname);
    
    loadCart();
    checkUserOnLoad();
    
    // ===== LOAD REVIEWS =====
    loadReviews();
    
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

    if (window.location.pathname.includes('profile.html')) {
        loadUserProfile();
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
    
    console.log('✅ MERKATO JavaScript Ready!');
});

console.log('🛒 MERKATO JavaScript Loaded!');
console.log('👤 Login system ready!');