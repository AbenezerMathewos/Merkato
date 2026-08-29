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

// Handle User Login form
async function handleLogin(event) {
    if (event) event.preventDefault();

    const email = document.getElementById('login-email')?.value.trim();
    const password = document.getElementById('login-password')?.value.trim();

    if (!email || !password) {
        showNotification('⚠️ Please enter both email and password');
        return;
    }

    try {
        const result = await loginUser({ email, password });
        if (result && result.token) {
            showNotification('✅ Welcome back, ' + (result.name || 'Shopper') + '!');
            setTimeout(() => {
                window.location.href = result.isAdmin ? 'admin.html' : 'index.html';
            }, 800);
        }
    } catch (error) {
        showNotification('❌ Login failed: ' + (error.message || 'Invalid email or password'));
    }
}

// Wires up the "Create Account" form on login.html
async function handleRegister(event) {
    if (event) event.preventDefault();

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

    try {
        const result = await registerUser({ name, email, password, phone, address: '' });
        if (result && result.token) {
            showNotification('🎉 Account created! Welcome, ' + name + '!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
        }
    } catch (error) {
        showNotification('❌ Registration failed: ' + (error.message || 'Error creating account'));
    }
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

async function loadOrders() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    const container = document.querySelector('.orders-container') || document.getElementById('ordersContainer');
    if (container) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#888;">
                <div style="font-size:36px;margin-bottom:10px;">📦</div>
                <p>Loading your orders...</p>
            </div>
        `;
    }

    let orders = [];
    try {
        const apiOrders = await getMyOrders();
        orders = apiOrders.map(o => ({
            ...o,
            id: o._id || o.id,
            date: new Date(o.createdAt || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            })
        }));
        localStorage.setItem('merkatoOrders', JSON.stringify(orders));
    } catch (err) {
        console.warn('Loading cached orders:', err);
        orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    }
    
    displayOrders(orders);
}

function displayOrders(orders) {
    const container = document.querySelector('.orders-container') || document.getElementById('ordersContainer');
    if (!container) return;
    
    if (!orders || orders.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px 20px;background:#fff;border-radius:12px;border:1px solid #e0e0e0;">
                <div style="font-size:64px;margin-bottom:20px;">📦</div>
                <h3 style="font-size:24px;color:#1a1a2e;margin-bottom:8px;">No Orders Yet</h3>
                <p style="color:#888;margin:0 0 20px;">Start shopping and your orders will appear here!</p>
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
        
        const canCancel = order.status === 'Processing';
        
        html += `
            <div class="order-card" style="
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
                        <strong class="order-id" style="color: #1a1a2e;">Order #${order.id}</strong>
                        <span style="color: #888;font-size:13px;margin-left:12px;">${order.date}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:10px;">
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
                    ${(order.items || []).map(item => `
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            padding: 6px 0;
                            border-bottom: 1px solid #f5f5f5;
                            font-size: 14px;
                        ">
                            <span>${escapeMarkup(item.name)} × ${item.quantity}</span>
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
                        <span style="color: #d9534f;">${(order.total || 0).toLocaleString()} ETB</span>
                    </div>
                    
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:15px;flex-wrap:wrap;gap:10px;">
                        <div style="font-size:13px;color:#888;">
                            ${order.tracking ? `📦 Tracking: <strong>${order.tracking}</strong>` : ''}
                        </div>
                        <div class="order-actions" style="display:flex;gap:8px;">
                            <button type="button" class="btn btn-secondary btn-sm track-btn" onclick="trackOrder('${order.id}')" style="padding:6px 14px;font-size:13px;">
                                📦 Track Order
                            </button>
                            ${canCancel ? `
                                <button type="button" class="btn btn-outline btn-sm" onclick="cancelCustomerOrder('${order.id}')" style="padding:6px 14px;font-size:13px;color:#d9534f;border-color:#d9534f;">
                                    ❌ Cancel Order
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

async function cancelCustomerOrder(orderId) {
    const confirmed = await showConfirmDialog({
        title: 'Cancel Order?',
        message: `Are you sure you want to cancel order #${orderId}? This action cannot be undone.`,
        icon: '📦',
        confirmText: 'Yes, Cancel Order',
        cancelText: 'Keep Order',
        confirmColor: '#dc2626'
    });

    if (!confirmed) return;

    try {
        await cancelOrder(orderId);
        showNotification('Order #' + orderId + ' cancelled successfully', 'info');
        await loadOrders();
    } catch (err) {
        showNotification('Could not cancel order: ' + err.message, 'error');
    }
}

// ========================================
// HIGH TIER ANIMATIONS & EFFECTS
// ========================================

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.product-card, .category-card, .testimonial, .trust-strip > div');
    
    // Add class for staggered reveal
    revealElements.forEach((el, index) => {
        el.classList.add('scroll-reveal');
        // Add left/right stagger for categories and trust strip
        if(el.classList.contains('category-card')) {
            el.style.transitionDelay = `${(index % 5) * 0.1}s`;
        }
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));
}

function initSparkEffect() {
    const canvas = document.getElementById('sparkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // Golden sparks
            this.color = `rgba(212, 175, 55, ${Math.random()})`;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * 6 - 3;
            this.life = 100;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size *= 0.95;
            this.life -= 2;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function createSparks(x, y, amount) {
        for (let i = 0; i < amount; i++) {
            particles.push(new Particle(x, y));
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].life <= 0 || particles[i].size <= 0.1) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }
    
    document.addEventListener('click', (e) => {
        createSparks(e.clientX, e.clientY, 15);
    });

    animate();
}

function initFloatingProfile() {
    const btn = document.getElementById('floatingProfileBtn');
    const menu = document.getElementById('floatingProfileMenu');
    const logoutBtn = document.getElementById('floatingLogout');
    
    if (!btn || !menu) return;
    
    // Hide if not logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        btn.style.display = 'none';
        menu.style.display = 'none';
        return;
    }
    
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove('active');
        }
    });

    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout(); // Reuse existing function
        });
    }
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
                <a href="product-detail.html?id=${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                </a>
                <div class="item-details">
                    <h3><a href="product-detail.html?id=${item.id}">${item.name}</a></h3>
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
// PROFESSIONAL NOTIFICATION & DIALOG SYSTEM
// ========================================

function getOrCreateToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    return container;
}

function showNotification(message, customType = null, customTitle = null, duration = 3500) {
    if (!message) return;

    const container = getOrCreateToastContainer();

    // Detect type and icons
    let type = customType || 'info';
    let icon = 'ℹ️';
    let title = customTitle || '';

    const cleanMsg = String(message).trim();

    if (!customType) {
        if (cleanMsg.includes('✅') || cleanMsg.toLowerCase().includes('success') || cleanMsg.includes('🎉') || cleanMsg.includes('added to cart') || cleanMsg.includes('added to wishlist')) {
            type = 'success';
            icon = '✓';
            if (!title) title = 'Success';
        } else if (cleanMsg.includes('❌') || cleanMsg.toLowerCase().includes('fail') || cleanMsg.toLowerCase().includes('error') || cleanMsg.toLowerCase().includes('cannot') || cleanMsg.toLowerCase().includes('removed')) {
            type = 'error';
            icon = '✕';
            if (!title) title = 'Notice';
        } else if (cleanMsg.includes('⚠️') || cleanMsg.toLowerCase().includes('please') || cleanMsg.toLowerCase().includes('required') || cleanMsg.toLowerCase().includes('missing') || cleanMsg.toLowerCase().includes('must')) {
            type = 'warning';
            icon = '!';
            if (!title) title = 'Attention';
        } else {
            type = 'info';
            icon = 'ℹ';
            if (!title) title = 'MERKATO';
        }
    }

    // Strip raw emojis from message if they start the text
    const displayMsg = cleanMsg.replace(/^[✅❌⚠️🎉ℹ️🗑️❤️🛒✨\s]+/, '').trim() || cleanMsg;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon-wrap">${icon}</div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${displayMsg}</div>
        </div>
        <button class="toast-close" title="Close">✕</button>
        <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    const progressBar = toast.querySelector('.toast-progress');

    progressBar.style.transition = `width ${duration}ms linear`;
    setTimeout(() => {
        progressBar.style.width = '0%';
    }, 20);

    let isDismissed = false;
    const dismiss = () => {
        if (isDismissed) return;
        isDismissed = true;
        toast.classList.add('toast-hide');
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 300);
    };

    closeBtn.addEventListener('click', dismiss);
    const timer = setTimeout(dismiss, duration);

    toast.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        progressBar.style.transition = 'none';
    });
}

// Professional Confirmation Modal (replaces crude browser confirm())
function showConfirmDialog({ title = 'Please Confirm', message = 'Are you sure you want to proceed?', icon = '❓', confirmText = 'Confirm', cancelText = 'Cancel', confirmColor = '#008000' }) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'pro-modal-overlay active';
        overlay.innerHTML = `
            <div class="pro-modal-card">
                <div class="pro-modal-icon">${icon}</div>
                <h3 class="pro-modal-title">${title}</h3>
                <p class="pro-modal-desc">${message}</p>
                <div class="pro-modal-actions">
                    <button type="button" class="btn-cancel" style="background:#f1f5f9;color:#475569;border:1px solid #cbd5e1;">${cancelText}</button>
                    <button type="button" class="btn-confirm" style="background:${confirmColor};color:#ffffff;border:none;">${confirmText}</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const cleanUp = (result) => {
            overlay.classList.remove('active');
            setTimeout(() => {
                if (overlay.parentElement) overlay.remove();
            }, 300);
            resolve(result);
        };

        overlay.querySelector('.btn-confirm').addEventListener('click', () => cleanUp(true));
        overlay.querySelector('.btn-cancel').addEventListener('click', () => cleanUp(false));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cleanUp(false);
        });
    });
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

async function clearWishlist() {
    if (wishlist.length === 0) {
        showNotification('Your wishlist is already empty', 'warning');
        return;
    }
    
    const confirmed = await showConfirmDialog({
        title: 'Clear Wishlist?',
        message: 'Are you sure you want to clear all saved items from your wishlist?',
        icon: '❤️',
        confirmText: 'Clear Wishlist',
        cancelText: 'Keep Items',
        confirmColor: '#dc2626'
    });

    if (confirmed) {
        wishlist = [];
        saveWishlist();
        updateWishlistButtons();
        showNotification('Wishlist cleared', 'info');
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
    const confirmed = await showConfirmDialog({
        title: 'Cancel Order?',
        message: `Are you sure you want to cancel order #${orderId}?`,
        icon: '📦',
        confirmText: 'Yes, Cancel Order',
        cancelText: 'Keep Order',
        confirmColor: '#dc2626'
    });

    if (!confirmed) return;
    
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
        
        showNotification('Order cancelled successfully', 'info');
        await loadOrders();
    } catch (error) {
        showNotification('Failed to cancel order: ' + error.message, 'error');
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
    let productId = urlParams.get('id');
    if (!productId && window.location.hash) {
        productId = window.location.hash.replace('#', '').trim();
    }
    if (!productId) {
        productId = 'prod_buna_1';
    }
    
    let product;
    try {
        const apiProduct = await getProduct(productId);
        if (apiProduct) {
            product = { ...apiProduct, id: apiProduct._id || apiProduct.id };
        }
    } catch (error) {
        console.warn('Direct product fetch error:', error);
    }

    if (!product) {
        try {
            const all = await getProducts();
            const found = all.find(p => 
                (p._id && p._id.toString() === productId.toString()) || 
                (p.id && p.id.toString() === productId.toString()) || 
                (p.slug && p.slug === productId) || 
                (p.name && p.name.toLowerCase().includes(productId.toLowerCase()))
            );
            if (found) product = { ...found, id: found._id || found.id };
        } catch(e) {}
    }
    
    if (!product) {
        container.innerHTML = `
            <div style="text-align:center;padding:60px;background:#fff;border-radius:12px;border:1px solid #e0e0e0;">
                <div style="font-size:48px;margin-bottom:15px;">❌</div>
                <h3 style="color:#1a1a2e;margin-bottom:8px;">Product not found</h3>
                <p style="color:#888;margin-bottom:20px;">The product you're looking for doesn't exist.</p>
                <a href="shop.html" class="btn btn-primary">← Back to Shop</a>
            </div>
        `;
        return;
    }
    
    renderProductDetail(product);
    initAddToCartButtons();
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

async function deleteProduct(id) {
    const confirmed = await showConfirmDialog({
        title: 'Delete Product?',
        message: 'Are you sure you want to delete this product from the inventory?',
        icon: '🗑️',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        confirmColor: '#dc2626'
    });

    if (!confirmed) return;
    
    let products = getAllProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem('merkatoProducts', JSON.stringify(products));
    
    loadAdminProducts();
    loadAdminStats();
    showNotification('Product deleted successfully', 'info');
}

async function deleteUser(email) {
    const confirmed = await showConfirmDialog({
        title: 'Remove User?',
        message: 'Are you sure you want to remove this user account?',
        icon: '👤',
        confirmText: 'Remove',
        cancelText: 'Cancel',
        confirmColor: '#dc2626'
    });

    if (!confirmed) return;
    
    let users = JSON.parse(localStorage.getItem('merkatoUsers')) || [];
    users = users.filter(u => u.email !== email);
    localStorage.setItem('merkatoUsers', JSON.stringify(users));
    
    loadAdminUsers();
    loadAdminStats();
    showNotification('User removed successfully', 'info');
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
    const order = orders.find(o => (o.id === orderId || o._id === orderId));
    if (!order) {
        showNotification('Order not found', 'error');
        return;
    }
    
    const statusColor = order.status === 'Delivered' ? '#10b981' :
                       order.status === 'Processing' ? '#f59e0b' :
                       order.status === 'Shipped' ? '#3b82f6' : '#ef4444';
    
    const itemsHtml = (order.items || []).map(item => `
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px;">
            <span>${escapeMarkup(item.name)} × ${item.quantity}</span>
            <strong>${(item.price * item.quantity).toLocaleString()} ETB</strong>
        </div>
    `).join('');

    const overlay = document.createElement('div');
    overlay.className = 'pro-modal-overlay active';
    overlay.innerHTML = `
        <div class="pro-modal-card" style="max-width:500px;text-align:left;">
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0;padding-bottom:12px;margin-bottom:16px;">
                <div>
                    <h3 style="margin:0;font-size:18px;color:#1a1a2e;">📦 Order #${order.id || order._id}</h3>
                    <small style="color:#64748b;">${order.date || new Date(order.createdAt || Date.now()).toLocaleDateString()}</small>
                </div>
                <span style="background:${statusColor}15;color:${statusColor};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">${order.status}</span>
            </div>

            <div style="max-height:200px;overflow-y:auto;margin-bottom:12px;">
                ${itemsHtml}
            </div>

            <div style="background:#f8fafc;border-radius:8px;padding:12px;font-size:13px;margin-bottom:16px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="color:#64748b;">Subtotal:</span>
                    <span>${(order.subtotal || 0).toLocaleString()} ETB</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="color:#64748b;">Shipping:</span>
                    <span>${order.shipping === 0 ? 'FREE' : (order.shipping || 0).toLocaleString() + ' ETB'}</span>
                </div>
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="color:#64748b;">VAT (15%):</span>
                    <span>${(order.tax || 0).toLocaleString()} ETB</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-weight:700;font-size:15px;color:#d9534f;border-top:1px solid #e2e8f0;padding-top:6px;margin-top:6px;">
                    <span>Total:</span>
                    <span>${(order.total || 0).toLocaleString()} ETB</span>
                </div>
            </div>

            ${order.customer ? `
                <div style="font-size:12px;color:#64748b;margin-bottom:16px;line-height:1.4;">
                    <strong>Shipping Address:</strong><br>
                    ${escapeMarkup(order.customer.name || '')} • ${escapeMarkup(order.customer.phone || '')}<br>
                    ${escapeMarkup(order.customer.address || '')}
                </div>
            ` : ''}

            <div style="display:flex;justify-content:flex-end;">
                <button type="button" class="btn btn-primary" onclick="this.closest('.pro-modal-overlay').remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.remove();
    });
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
    initScrollReveal();
    initSparkEffect();
    initFloatingProfile();

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

let telebirrTransactionId = null;

function initiatePaymentFlow() {
    if (selectedPayment === 'telebirr') {
        const subtotal = getCartTotal();
        const shipping = subtotal > 3000 ? 0 : 200;
        const tax = subtotal * 0.15;
        const total = subtotal + shipping + tax;
        
        document.getElementById('paymentInitial').style.display = 'none';
        document.getElementById('telebirrAmount').textContent = total.toLocaleString() + ' ETB';
        document.getElementById('telebirrPhoneState').style.display = 'block';
        
        // Auto-fill phone if available
        const phone = document.getElementById('phone')?.value;
        if (phone) {
            document.getElementById('telebirrPhoneInput').value = phone;
        }
    } else {
        processPayment();
    }
}

async function requestTelebirrPin() {
    const phone = document.getElementById('telebirrPhoneInput').value;
    if (!phone) {
        showNotification('⚠️ Please enter your phone number');
        return;
    }
    
    const subtotal = getCartTotal();
    const shipping = subtotal > 3000 ? 0 : 200;
    const tax = subtotal * 0.15;
    const total = subtotal + shipping + tax;
    
    const btn = document.getElementById('btnRequestPin');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    
    try {
        const response = await fetch('/api/payments/telebirr/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (JSON.parse(localStorage.getItem('merkatoUser'))?.token || '')
            },
            body: JSON.stringify({ phone, amount: total })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to request PIN');
        }
        
        telebirrTransactionId = data.transactionId;
        
        // Move to PIN state
        document.getElementById('telebirrPhoneState').style.display = 'none';
        document.getElementById('telebirrPinState').style.display = 'block';
        
        // In real app we wouldn't show this, but for demo:
        console.log("TEST PIN IS: " + data.testPin);
        showNotification('💬 SMS PIN Sent! (Check console for test pin: ' + data.testPin + ')');
        
    } catch (error) {
        console.error('Telebirr error:', error);
        showNotification('❌ ' + error.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '📩 Send SMS PIN';
    }
}

async function verifyTelebirrPin() {
    const pin = document.getElementById('telebirrPinInput').value;
    const errorDiv = document.getElementById('telebirrError');
    
    if (!pin || pin.length !== 4) {
        errorDiv.textContent = 'Please enter a valid 4-digit PIN';
        errorDiv.style.display = 'block';
        return;
    }
    
    errorDiv.style.display = 'none';
    const btn = document.getElementById('btnVerifyPin');
    btn.disabled = true;
    btn.textContent = 'Verifying...';
    
    try {
        const response = await fetch('/api/payments/telebirr/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (JSON.parse(localStorage.getItem('merkatoUser'))?.token || '')
            },
            body: JSON.stringify({ transactionId: telebirrTransactionId, pin })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Verification failed');
        }
        
        // Payment verified! Now process the actual order
        document.getElementById('telebirrPinState').style.display = 'none';
        processPayment();
        
    } catch (error) {
        console.error('Telebirr verification error:', error);
        errorDiv.textContent = '❌ ' + error.message;
        errorDiv.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '✅ Verify & Pay';
    }
}

function resetPaymentModal() {
    document.getElementById('telebirrPhoneState').style.display = 'none';
    document.getElementById('telebirrPinState').style.display = 'none';
    document.getElementById('paymentInitial').style.display = 'block';
    document.getElementById('telebirrPinInput').value = '';
    document.getElementById('telebirrError').style.display = 'none';
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

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

function initScrollReveal() {
    // Add scroll-reveal class to sections
    const revealTargets = document.querySelectorAll(
        '.product-card, .category-card, .testimonial, .featured-banner, ' +
        '.market-note, .newsletter, .brands-section, .trust-strip > div, ' +
        '.section-header'
    );

    revealTargets.forEach(el => {
        if (!el.classList.contains('scroll-reveal')) {
            el.classList.add('scroll-reveal');
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-scale').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// SKELETON LOADING
// ========================================

function showSkeletonLoading(container, count = 4) {
    if (!container) return;
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `
            <div class="skeleton-card">
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-text short"></div>
                <div class="skeleton skeleton-text long"></div>
                <div class="skeleton skeleton-text price"></div>
            </div>
        `;
    }
    container.innerHTML = html;
}

function hideSkeletonLoading(container) {
    if (!container) return;
    const skeletons = container.querySelectorAll('.skeleton-card');
    skeletons.forEach(s => s.remove());
}

// ========================================
// HAMBURGER MOBILE MENU
// ========================================

function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const btn = document.getElementById('hamburgerBtn');
    if (!nav || !btn) return;

    nav.classList.toggle('mobile-open');
    btn.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (nav.classList.contains('mobile-open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close menu when a nav link is clicked
document.addEventListener('click', function(e) {
    if (e.target.closest('.nav a')) {
        const nav = document.querySelector('.nav');
        const btn = document.getElementById('hamburgerBtn');
        if (nav && nav.classList.contains('mobile-open')) {
            nav.classList.remove('mobile-open');
            if (btn) btn.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// ========================================
// MINI CART DRAWER
// ========================================

function openCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (!overlay || !drawer) return;

    updateCartDrawerContent();
    overlay.classList.add('active');
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
    const overlay = document.getElementById('cartDrawerOverlay');
    const drawer = document.getElementById('cartDrawer');
    if (overlay) overlay.classList.remove('active');
    if (drawer) drawer.classList.remove('active');
    document.body.style.overflow = '';
}

function updateCartDrawerContent() {
    const itemsContainer = document.getElementById('cartDrawerItems');
    const footerContainer = document.getElementById('cartDrawerFooter');
    if (!itemsContainer || !footerContainer) return;

    const cart = JSON.parse(localStorage.getItem('merkatoCart')) || [];

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div style="text-align:center;padding:40px 20px;color:var(--gray);">
                <div style="font-size:48px;margin-bottom:12px;">🛒</div>
                <p style="font-size:15px;font-weight:600;">Your cart is empty</p>
                <p style="font-size:13px;margin-top:4px;">Start adding products to your cart!</p>
            </div>
        `;
        footerContainer.innerHTML = '';
        return;
    }

    let itemsHtml = '';
    let total = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity) || 1;
        const lineTotal = price * qty;
        total += lineTotal;

        itemsHtml += `
            <div class="cart-drawer-item">
                <img src="${item.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2230%22%3E🛒%3C/text%3E%3C/svg%3E'}" 
                     alt="${item.name || 'Product'}" loading="lazy">
                <div class="cart-drawer-item-info">
                    <div class="name">${item.name || 'Product'}</div>
                    <div class="meta">Qty: ${qty}</div>
                    <div class="price">${lineTotal.toLocaleString()} ETB</div>
                </div>
            </div>
        `;
    });

    itemsContainer.innerHTML = itemsHtml;

    footerContainer.innerHTML = `
        <div class="cart-drawer-total">
            <span>Subtotal</span>
            <span class="amount">${total.toLocaleString()} ETB</span>
        </div>
        <a href="cart.html" class="cart-drawer-btn">View Cart</a>
        <a href="checkout.html" class="cart-drawer-btn secondary">Checkout</a>
    `;
}

// ========================================
// SEARCH AUTOCOMPLETE / LIVE SUGGESTIONS
// ========================================

function initSearchAutocomplete() {
    const form = document.querySelector('.search-form');
    const input = form?.querySelector('input[type="search"]');
    if (!form || !input) return;

    // Create suggestions dropdown
    let suggestionsDiv = form.querySelector('.search-suggestions');
    if (!suggestionsDiv) {
        suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'search-suggestions';
        form.appendChild(suggestionsDiv);
    }

    let debounceTimer;

    input.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        const query = this.value.trim().toLowerCase();

        if (query.length < 2) {
            suggestionsDiv.classList.remove('active');
            return;
        }

        debounceTimer = setTimeout(() => {
            const products = JSON.parse(localStorage.getItem('merkatoProducts')) || [];
            const matches = products.filter(p =>
                (p.name && p.name.toLowerCase().includes(query)) ||
                (p.category && p.category.toLowerCase().includes(query)) ||
                (p.description && p.description.toLowerCase().includes(query))
            ).slice(0, 6);

            if (matches.length === 0) {
                suggestionsDiv.innerHTML = `
                    <div class="search-suggestion-item" style="color:var(--gray);justify-content:center;cursor:default;">
                        No products found
                    </div>
                `;
                suggestionsDiv.classList.add('active');
                return;
            }

            suggestionsDiv.innerHTML = matches.map(p => `
                <a href="product-detail.html?id=${p._id || p.id}" class="search-suggestion-item">
                    <img src="${p.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e0e0e0%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'}" 
                         alt="${p.name}" loading="lazy">
                    <div class="info">
                        <div class="name">${highlightMatch(p.name, query)}</div>
                        <div class="price">${(p.price || 0).toLocaleString()} ETB</div>
                    </div>
                </a>
            `).join('');
            suggestionsDiv.classList.add('active');
        }, 200);
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!form.contains(e.target)) {
            suggestionsDiv.classList.remove('active');
        }
    });

    // Close on Escape
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            suggestionsDiv.classList.remove('active');
        }
    });
}

function highlightMatch(text, query) {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<strong style="color:var(--primary)">$1</strong>');
}

// ========================================
// QUICK VIEW MODAL
// ========================================

function openQuickView(productId) {
    const products = JSON.parse(localStorage.getItem('merkatoProducts')) || [];
    const product = products.find(p => (p._id || p.id) == productId);
    if (!product) return;

    // Remove existing modal if any
    const existing = document.querySelector('.quickview-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'quickview-overlay';
    overlay.innerHTML = `
        <div class="quickview-card" style="position:relative;">
            <button class="quickview-close" onclick="closeQuickView()">✕</button>
            <img class="quickview-img" src="${product.image || ''}" alt="${product.name || ''}" loading="lazy">
            <div class="quickview-info">
                <div class="aisle-badge">${product.category || 'General'}</div>
                <h2>${product.name || 'Product'}</h2>
                <div class="price">${(product.price || 0).toLocaleString()} ETB</div>
                <div class="desc">${product.description || 'A quality product from MERKATO.'}</div>
                <div class="quickview-actions">
                    <button class="btn btn-primary" onclick="addToCart('${product._id || product.id}', '${(product.name || '').replace(/'/g, "\\'")}', '${product.price}', '${product.image || ''}'); closeQuickView(); showNotification('✅ Added to cart!');">
                        🛒 Add to Cart
                    </button>
                    <a href="product-detail.html?id=${product._id || product.id}" class="btn btn-outline">
                        View Details
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
        overlay.classList.add('active');
    });

    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeQuickView();
    });

    // Close on Escape
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeQuickView();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function closeQuickView() {
    const overlay = document.querySelector('.quickview-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
    document.body.style.overflow = '';
}

// ========================================
// PRODUCT CARD ENHANCEMENTS 
// (Quick actions + Add to Cart on cards)
// ========================================

function enhanceProductCards() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        // Skip if already enhanced
        if (card.dataset.enhanced) return;
        card.dataset.enhanced = 'true';

        const productId = card.dataset.productId;
        const productName = card.querySelector('h3 a')?.textContent?.trim() || 'Product';
        const productPrice = card.querySelector('.price')?.textContent?.replace(/[^0-9]/g, '') || '0';
        const productImage = card.querySelector('img')?.src || '';

        // Add quick action buttons (wishlist + quick view)
        const quickActionsDiv = document.createElement('div');
        quickActionsDiv.className = 'quick-actions';
        quickActionsDiv.innerHTML = `
            <button title="Quick View" onclick="event.preventDefault(); event.stopPropagation(); openQuickView('${productId}')">👁</button>
            <button title="Add to Wishlist" onclick="event.preventDefault(); event.stopPropagation(); toggleWishlist('${productId}', '${productName.replace(/'/g, "\\'")}', '${productPrice}', '${productImage}')">♡</button>
        `;
        card.appendChild(quickActionsDiv);

        // Add "Add to Cart" button at bottom
        const existingCartBtn = card.querySelector('.card-add-cart');
        if (!existingCartBtn) {
            const cartBtn = document.createElement('button');
            cartBtn.className = 'card-add-cart';
            cartBtn.textContent = '🛒 Add to Cart';
            cartBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                addToCart(productId, productName, productPrice, productImage);
                showNotification('✅ ' + productName + ' added to cart!');
                // Open cart drawer
                if (document.getElementById('cartDrawer')) {
                    openCartDrawer();
                }
            };
            card.appendChild(cartBtn);
        }

        // Add stock badge
        const existingBadge = card.querySelector('.stock-badge');
        if (!existingBadge) {
            const stock = parseInt(card.dataset.stock) || Math.floor(Math.random() * 20) + 1;
            const badge = document.createElement('span');
            if (stock > 5) {
                badge.className = 'stock-badge in-stock';
                badge.textContent = 'In Stock';
            } else if (stock > 0) {
                badge.className = 'stock-badge low-stock';
                badge.textContent = `Only ${stock} left`;
            } else {
                badge.className = 'stock-badge out-of-stock';
                badge.textContent = 'Out of Stock';
            }
            card.appendChild(badge);
        }
    });
}

// ========================================
// ENHANCED NAV CART LINK (Open Drawer)
// ========================================

function enhanceCartLink() {
    const cartLinks = document.querySelectorAll('.nav a[href="cart.html"]');
    cartLinks.forEach(link => {
        // Only intercept on non-cart pages  
        if (!window.location.pathname.includes('cart.html') && document.getElementById('cartDrawer')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                openCartDrawer();
            });
        }
    });
}

// ========================================
// INIT ALL NEW FEATURES ON PAGE LOAD
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Scroll reveal animations
    setTimeout(initScrollReveal, 100);

    // Search autocomplete
    initSearchAutocomplete();

    // Enhance product cards with quick actions
    setTimeout(enhanceProductCards, 300);

    // Cart drawer link enhancement
    setTimeout(enhanceCartLink, 200);
});

// ========================================
// PHASE 2: PRODUCT REVIEWS & RATINGS
// ========================================

async function loadReviews(productId) {
    const listContainer = document.getElementById('reviewsList');
    if (!listContainer) return;
    
    try {
        const response = await fetch('/api/reviews/product/' + productId);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        
        const reviews = await response.json();
        
        if (reviews.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center;padding:20px;color:#888;">No reviews yet. Be the first to review this product!</div>';
            return;
        }
        
        let html = '';
        reviews.forEach(r => {
            const date = new Date(r.createdAt || r.date).toLocaleDateString();
            const stars = '⭐'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            html += `
                <div style="border-bottom:1px solid #f0f0f0; padding: 15px 0;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span style="font-weight:600; color:#1a1a2e;">${escapeMarkup(r.userName)}</span>
                        <span style="color:#888; font-size:12px;">${date}</span>
                    </div>
                    <div style="margin-bottom:8px; font-size:14px;">${stars}</div>
                    <p style="color:#555; margin:0; font-size:15px; line-height:1.5;">${escapeMarkup(r.comment)}</p>
                </div>
            `;
        });
        
        listContainer.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading reviews:', error);
        listContainer.innerHTML = '<div style="text-align:center;padding:20px;color:#d9534f;">Failed to load reviews.</div>';
    }
}

async function submitReview(event, productId) {
    event.preventDefault();
    const statusDiv = document.getElementById('reviewStatus');
    
    const userJson = localStorage.getItem('merkatoUser');
    if (!userJson) {
        statusDiv.style.color = '#d9534f';
        statusDiv.innerHTML = 'You must be <a href="login.html" style="color:#d9534f;text-decoration:underline;">logged in</a> to write a review.';
        return;
    }
    
    const user = JSON.parse(userJson);
    const token = user.token || localStorage.getItem('merkatoToken');
    
    if (!token) {
        statusDiv.style.color = '#d9534f';
        statusDiv.innerHTML = 'Authentication error. Please log in again.';
        return;
    }
    
    const rating = document.getElementById('reviewRating').value;
    const comment = document.getElementById('reviewComment').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusDiv.innerHTML = '';
    
    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                productId: productId,
                rating: Number(rating),
                comment: comment
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit review');
        }
        
        statusDiv.style.color = '#008000';
        statusDiv.innerHTML = '✅ Review submitted successfully!';
        document.getElementById('reviewForm').reset();
        
        // Reload reviews
        loadReviews(productId);
        
    } catch (error) {
        console.error('Submit review error:', error);
        statusDiv.style.color = '#d9534f';
        statusDiv.innerHTML = '❌ ' + (error.message || 'Something went wrong');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';
    }
}

// =========================================================================
// 🇪🇹 MERKATO ADVANCED FEATURE SUITE (Localization, Coupons, Payments, AI, Search)
// =========================================================================

// -------------------------------------------------------------------------
// 1. BILINGUAL LOCALIZATION (English / አማርኛ)
// -------------------------------------------------------------------------

const MERKATO_I18N = {
    en: {
        nav_home: 'Home',
        nav_shop: 'Shop',
        nav_about: 'About',
        nav_contact: 'Contact',
        nav_faq: 'FAQ',
        nav_returns: 'Returns',
        nav_admin: 'Admin',
        nav_cart: 'Cart',
        nav_wishlist: 'Wishlist',
        nav_orders: 'My Orders',
        nav_signin: 'Sign In',
        top_bar_text: '✨ FREE EXPRESS SHIPPING ON ORDERS OVER 3,000 ETB • CODE: MERKATO2026',
        hero_tag: 'SUPERMARKET • ETHIOPIAN HERITAGE',
        hero_title: "Ethiopia's Premier Digital Supermarket",
        hero_sub: 'Connecting authentic local specialty coffee, traditional spices, handwoven textiles, and modern electronics.',
        btn_explore: '🛒 Explore Supermarket Floor',
        btn_weekly: '⭐ Weekly Habesha Specials',
        summary_title: '📋 Order Summary',
        summary_subtotal: 'Subtotal',
        summary_shipping: 'Shipping',
        summary_tax: 'Tax (VAT 15%)',
        summary_discount: 'Promo Discount',
        summary_total: 'Total',
        summary_free: 'FREE',
        checkout_btn: 'Proceed to Checkout →',
        promo_title: '🎁 Promo Code',
        promo_apply: 'Apply',
        payment_heading: 'Choose Payment Method',
        pay_telebirr: 'Telebirr / Mobile Money',
        pay_chapa: 'Chapa Gateway (Cards & Banks)',
        pay_cbe: 'CBE Direct Bank Transfer',
        pay_cod: 'Cash on Delivery',
        pay_proceed: 'Proceed to Payment',
        search_placeholder: 'Search fresh injera, roasted buna, berbere, electronics...',
        ai_title: 'Merkato AI Assistant',
        ai_greeting: 'Selam! 👋 I am your Merkato assistant. How can I help you find authentic Ethiopian goods or process your order today?'
    },
    am: {
        nav_home: 'ዋና ገጽ',
        nav_shop: 'ሱቅ / ምርቶች',
        nav_about: 'ስለ እኛ',
        nav_contact: 'ያግኙን',
        nav_faq: 'ተደጋጋሚ ጥያቄዎች',
        nav_returns: 'ምርት መመለስ',
        nav_admin: 'አስተዳዳሪ',
        nav_cart: 'ጋሪ',
        nav_wishlist: 'የምኞት ዝርዝር',
        nav_orders: 'ትዕዛዞቼ',
        nav_signin: 'ግባ / ተመዝገብ',
        top_bar_text: '✨ ከ 3,000 ብር በላይ ለሆኑ ትዕዛዞች ነጻ የትራንስፖርት አገልግሎት • ኩፖን: MERKATO2026',
        hero_tag: 'ሱፐርማርኬት • የኢትዮጵያ ባህላዊ ምርቶች',
        hero_title: 'የኢትዮጵያ ቀዳሚው ዲጂታል ሱፐርማርኬት',
        hero_sub: 'እውነተኛ የሀበሻ ቡና፣ የቅመማ ቅመም ዝግጅት፣ ባህላዊ አልባሳት እና ዘመናዊ ኤሌክትሮኒክስ በአንድ ቦታ።',
        btn_explore: '🛒 ሱፐርማርኬቱን ይጎብኙ',
        btn_weekly: '⭐ የሳምንቱ የሀበሻ ልዩ ቅናሾች',
        summary_title: '📋 የትዕዛዝ ማጠቃለያ',
        summary_subtotal: 'የዕቃዎች ድምር',
        summary_shipping: 'የትራንስፖርት ክፍያ',
        summary_tax: 'ተ.እ.ታ (VAT 15%)',
        summary_discount: 'የኩፖን ቅናሽ',
        summary_total: 'አጠቃላይ ድምር',
        summary_free: 'ነፃ',
        checkout_btn: 'ወደ ክፍያ ቀጥል →',
        promo_title: '🎁 የቅናሽ ኩፖን ኮድ',
        promo_apply: 'ተግብር',
        payment_heading: 'የክፍያ ዘዴ ይምረጡ',
        pay_telebirr: 'ቴሌብር (Telebirr)',
        pay_chapa: 'ቻፓ (Chapa - በካርድና በሁሉም ባንኮች)',
        pay_cbe: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
        pay_cod: 'ዕቃው ሲደርስ የሚከፈል (COD)',
        pay_proceed: 'ወደ ክፍያ ቀጥል',
        search_placeholder: 'የተፈጨ ቡና፣ በርበሬ፣ ምጣድ፣ ባህላዊ ልብስ ይፈልጉ...',
        ai_title: 'የመርካቶ ረዳት (AI)',
        ai_greeting: 'ሰላም! 👋 እኔ የመርካቶ ረዳት ነኝ። ዛሬ ምርጥ የሀበሻ ምርቶችን ለመምረጥ ወይም በትዕዛዝዎ ላይ ምን ልርዳዎት?'
    }
};

let currentLanguage = localStorage.getItem('merkatoLang') || 'en';

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('merkatoLang', lang);
    applyTranslations(lang);
    updateLanguageButtons();
}

function toggleLanguage() {
    const nextLang = currentLanguage === 'en' ? 'am' : 'en';
    setLanguage(nextLang);
    showNotification(nextLang === 'am' ? '🇪🇹 ቋንቋ ወደ አማርኛ ተቀይሯል' : '🇬🇧 Language switched to English');
}

function updateLanguageButtons() {
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
        btn.innerHTML = currentLanguage === 'en' ? '🇪🇹 አማርኛ' : '🇬🇧 English';
        btn.setAttribute('title', currentLanguage === 'en' ? 'ወደ አማርኛ ቀይር' : 'Switch to English');
    });
}

function applyTranslations(lang) {
    const dict = MERKATO_I18N[lang] || MERKATO_I18N.en;

    // Top bar
    const topBar = document.querySelector('.top-bar');
    if (topBar) {
        topBar.innerHTML = dict.top_bar_text;
    }

    // Nav links
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.includes('index.html') || href === '/') link.textContent = dict.nav_home;
        else if (href.includes('shop.html')) link.textContent = dict.nav_shop;
        else if (href.includes('about.html')) link.textContent = dict.nav_about;
        else if (href.includes('contact.html')) link.textContent = dict.nav_contact;
        else if (href.includes('faq.html')) link.textContent = dict.nav_faq;
        else if (href.includes('returns.html')) link.textContent = dict.nav_returns;
        else if (href.includes('admin.html')) link.textContent = dict.nav_admin;
        else if (href.includes('orders.html')) link.textContent = dict.nav_orders;
        else if (href.includes('login.html')) link.textContent = dict.nav_signin;
    });

    // Search input placeholders
    document.querySelectorAll('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]').forEach(input => {
        input.placeholder = dict.search_placeholder;
    });

    // Hero banner if present
    const heroTag = document.querySelector('.hero-tag');
    if (heroTag) heroTag.textContent = dict.hero_tag;
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = dict.hero_title;
    const heroSub = document.querySelector('.hero-subtitle');
    if (heroSub) heroSub.textContent = dict.hero_sub;
}

function createLanguageToggle() {
    // Inject language switcher into all navbars and headers if not present
    const navbars = document.querySelectorAll('.nav, .header-actions');
    navbars.forEach(nav => {
        if (!nav.querySelector('.lang-toggle-btn')) {
            const btn = document.createElement('button');
            btn.className = 'lang-toggle-btn';
            btn.type = 'button';
            btn.onclick = toggleLanguage;
            btn.innerHTML = currentLanguage === 'en' ? '🇪🇹 አማርኛ' : '🇬🇧 English';
            
            const themeToggleWrapper = nav.querySelector('.theme-toggle-wrapper');
            if (themeToggleWrapper) {
                themeToggleWrapper.parentNode.insertBefore(btn, themeToggleWrapper);
            } else {
                nav.appendChild(btn);
            }
        }
    });
}

// -------------------------------------------------------------------------
// 2. ADDIS ABABA SUB-CITIES & DELIVERY ZONE CALCULATOR
// -------------------------------------------------------------------------

const MERKATO_DELIVERY_ZONES = {
    'bole': { name: 'Bole Sub-City (ቦሌ)', fee: 150, time: '1-2 Hours' },
    'kirkos': { name: 'Kirkos / Kazanchis (ቂርቆስ)', fee: 150, time: '1-2 Hours' },
    'arada': { name: 'Arada / Piassa (አራዳ)', fee: 120, time: '1-2 Hours' },
    'yeka': { name: 'Yeka / Megenagna (የካ)', fee: 180, time: '2-3 Hours' },
    'cmc': { name: 'CMC / Ayat / Summit (ሲኤምሲ)', fee: 220, time: '2-3 Hours' },
    'gullele': { name: 'Gullele / Shiromeda (ጉለሌ)', fee: 180, time: '2-3 Hours' },
    'lideta': { name: 'Lideta / Mexico (ልደታ)', fee: 140, time: '1-2 Hours' },
    'nifas_silk': { name: 'Nifas Silk / Lafto (ንፋስ ስልክ)', fee: 200, time: '2-3 Hours' },
    'kolfe': { name: 'Kolfe Keranio / Merkato (ቆልፌ)', fee: 160, time: '1-2 Hours' },
    'akaki': { name: 'Akaki Kality (አቃቂ ቃሊቲ)', fee: 250, time: '3-4 Hours' },
    'hawassa': { name: 'Hawassa (Regional Express)', fee: 450, time: '24-48 Hours' },
    'adama': { name: 'Adama / Nazret (Regional Express)', fee: 350, time: '24 Hours' },
    'bahir_dar': { name: 'Bahir Dar (Regional Express)', fee: 500, time: '48 Hours' }
};

let selectedDeliveryZone = localStorage.getItem('merkatoDeliveryZone') || 'bole';

function getDeliveryZoneFee() {
    const zone = MERKATO_DELIVERY_ZONES[selectedDeliveryZone] || MERKATO_DELIVERY_ZONES['bole'];
    return zone.fee;
}

function setDeliveryZone(zoneKey) {
    if (MERKATO_DELIVERY_ZONES[zoneKey]) {
        selectedDeliveryZone = zoneKey;
        localStorage.setItem('merkatoDeliveryZone', zoneKey);
        if (window.location.pathname.includes('checkout.html')) {
            loadCheckoutSummary();
        } else if (window.location.pathname.includes('cart.html')) {
            updateCartSummary();
        }
    }
}

// -------------------------------------------------------------------------
// 3. ENHANCED COUPON & PROMO CODE ENGINE
// -------------------------------------------------------------------------

let appliedPromoData = JSON.parse(localStorage.getItem('merkatoActiveCoupon')) || null;

async function applyCouponCode(codeToApply = null) {
    const input = document.getElementById('promoInput') || document.getElementById('checkoutPromoInput');
    const code = codeToApply || (input ? input.value.trim() : '');
    
    if (!code) {
        showNotification('⚠️ Please enter a promo code');
        return;
    }

    const subtotal = getCartTotal();

    try {
        let result;
        if (typeof validateCouponAPI === 'function') {
            result = await validateCouponAPI(code, subtotal);
        } else {
            // Local evaluation
            const upper = code.toUpperCase();
            if (upper === 'MERKATO2026') {
                result = { success: true, coupon: { code: upper, discountType: 'percentage', discountValue: 10, discountAmount: Math.round(subtotal * 0.1), freeShipping: true, description: '10% OFF + Free Shipping' } };
            } else if (upper === 'HABESHA15') {
                result = { success: true, coupon: { code: upper, discountType: 'percentage', discountValue: 15, discountAmount: Math.round(subtotal * 0.15), freeShipping: false, description: '15% OFF Ethiopian Specialty' } };
            } else if (upper === 'ENKUTATASH') {
                result = { success: true, coupon: { code: upper, discountType: 'fixed', discountValue: 500, discountAmount: Math.min(500, subtotal), freeShipping: false, description: '500 ETB Flat Discount' } };
            } else if (upper === 'FREESHIP') {
                result = { success: true, coupon: { code: upper, discountType: 'shipping', discountValue: 100, discountAmount: 0, freeShipping: true, description: 'Free City Delivery' } };
            } else {
                throw new Error('Invalid or expired promo code');
            }
        }

        if (result && result.success) {
            appliedPromoData = result.coupon;
            localStorage.setItem('merkatoActiveCoupon', JSON.stringify(appliedPromoData));
            showNotification(`🎉 ${result.message || 'Promo code applied successfully!'}`);
            
            if (window.location.pathname.includes('cart.html')) {
                updateCartSummary();
            }
            if (window.location.pathname.includes('checkout.html')) {
                loadCheckoutSummary();
            }
        }
    } catch (err) {
        showNotification(`❌ ${err.message || 'Failed to apply promo code'}`);
    }
}

function removeCouponCode() {
    appliedPromoData = null;
    localStorage.removeItem('merkatoActiveCoupon');
    showNotification('ℹ️ Promo code removed');
    if (window.location.pathname.includes('cart.html')) {
        updateCartSummary();
    }
    if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutSummary();
    }
}

// Override / Enhance updateCartSummary to support discounts & zones
window.updateCartSummary = function() {
    const summaryContainer = document.querySelector('.cart-summary');
    if (!summaryContainer || cart.length === 0) return;

    const subtotal = getCartTotal();
    const baseShipping = getDeliveryZoneFee();
    
    let discountAmount = 0;
    let isFreeShipping = subtotal > 3000;

    if (appliedPromoData) {
        if (appliedPromoData.discountType === 'percentage') {
            discountAmount = Math.round((subtotal * appliedPromoData.discountValue) / 100);
        } else if (appliedPromoData.discountType === 'fixed') {
            discountAmount = Math.min(appliedPromoData.discountValue, subtotal);
        }
        if (appliedPromoData.freeShipping) {
            isFreeShipping = true;
        }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const shipping = isFreeShipping ? 0 : baseShipping;
    const tax = Math.round(discountedSubtotal * 0.15);
    const grandTotal = discountedSubtotal + shipping + tax;
    const count = getCartCount();

    const dict = MERKATO_I18N[currentLanguage] || MERKATO_I18N.en;

    let promoBadgeHtml = '';
    if (appliedPromoData) {
        promoBadgeHtml = `
            <div class="applied-coupon-pill">
                <span>🏷️ <strong>${escapeMarkup(appliedPromoData.code)}</strong> (-${discountAmount.toLocaleString()} ETB)</span>
                <button type="button" class="remove-coupon-btn" onclick="removeCouponCode()" title="Remove coupon">✕</button>
            </div>
        `;
    }

    summaryContainer.innerHTML = `
        <h2>${dict.summary_title}</h2>
        
        <div class="summary-row">
            <span class="label">${dict.summary_subtotal} (${count} items)</span>
            <span class="value">${subtotal.toLocaleString()} ETB</span>
        </div>

        ${discountAmount > 0 ? `
            <div class="summary-row discount">
                <span class="label">${dict.summary_discount}</span>
                <span class="value">-${discountAmount.toLocaleString()} ETB</span>
            </div>
        ` : ''}

        <div class="summary-row">
            <span class="label">${dict.summary_shipping} (${MERKATO_DELIVERY_ZONES[selectedDeliveryZone]?.name || 'City'})</span>
            <span class="value" style="color: ${shipping === 0 ? '#00b894' : '#d9534f'}">
                ${shipping === 0 ? dict.summary_free : shipping.toLocaleString() + ' ETB'}
            </span>
        </div>

        <div class="summary-row">
            <span class="label">${dict.summary_tax}</span>
            <span class="value">${tax.toLocaleString()} ETB</span>
        </div>
        
        <div class="free-shipping">
            ${shipping === 0 ? '🎉 <strong>FREE EXPRESS SHIPPING</strong> activated!' : '💡 Add <strong>' + Math.max(0, 3000 - subtotal).toLocaleString() + ' ETB</strong> more for free shipping!'}
        </div>
        
        <div class="summary-row total">
            <span class="label">${dict.summary_total}</span>
            <span class="value">${grandTotal.toLocaleString()} ETB</span>
        </div>

        ${promoBadgeHtml}
        
        <a href="checkout.html" class="checkout-btn" style="margin-top:14px;">${dict.checkout_btn}</a>
        
        <div class="promo-section" style="margin-top:15px;">
            <h3>${dict.promo_title}</h3>
            <div class="promo-input">
                <input type="text" placeholder="e.g. MERKATO2026, HABESHA15" id="promoInput" value="${appliedPromoData ? appliedPromoData.code : ''}">
                <button type="button" onclick="applyCouponCode()">${dict.promo_apply}</button>
            </div>
            <small style="color: #888; display: block; margin-top: 8px;">
                💡 Try: <strong style="color: #ffd700; cursor:pointer;" onclick="applyCouponCode('MERKATO2026')">MERKATO2026</strong> (10% OFF), <strong style="color: #ffd700; cursor:pointer;" onclick="applyCouponCode('HABESHA15')">HABESHA15</strong> (15% OFF), or <strong style="color: #ffd700; cursor:pointer;" onclick="applyCouponCode('ENKUTATASH')">ENKUTATASH</strong> (500 ETB)
            </small>
        </div>
        
        <a href="shop.html" class="continue-shopping">← Continue Shopping</a>
    `;
};

// Override / Enhance loadCheckoutSummary
window.loadCheckoutSummary = function() {
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
            sidebarContainer.innerHTML = `<div style="text-align:center;padding:20px;color:#888;"><p>Cart is empty</p></div>`;
        }
        return;
    }

    const subtotal = getCartTotal();
    const baseShipping = getDeliveryZoneFee();
    
    let discountAmount = 0;
    let isFreeShipping = subtotal > 3000;

    if (appliedPromoData) {
        if (appliedPromoData.discountType === 'percentage') {
            discountAmount = Math.round((subtotal * appliedPromoData.discountValue) / 100);
        } else if (appliedPromoData.discountType === 'fixed') {
            discountAmount = Math.min(appliedPromoData.discountValue, subtotal);
        }
        if (appliedPromoData.freeShipping) {
            isFreeShipping = true;
        }
    }

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const shipping = isFreeShipping ? 0 : baseShipping;
    const tax = Math.round(discountedSubtotal * 0.15);
    const grandTotal = discountedSubtotal + shipping + tax;
    const count = getCartCount();
    
    let itemsHtml = '';
    cart.forEach(item => {
        itemsHtml += `
            <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <span style="font-weight:600;">${escapeMarkup(item.name)}</span> × ${item.quantity}
                </div>
                <strong>${(item.price * item.quantity).toLocaleString()} ETB</strong>
            </li>
        `;
    });

    const dict = MERKATO_I18N[currentLanguage] || MERKATO_I18N.en;

    summaryContainer.innerHTML = `
        <ul style="list-style:none;padding:0;margin:0;">
            ${itemsHtml}
            ${discountAmount > 0 ? `
                <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;color:#008000;font-weight:600;">
                    <span>🏷️ Promo Discount (${appliedPromoData.code})</span>
                    <span>-${discountAmount.toLocaleString()} ETB</span>
                </li>
            ` : ''}
            <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;">
                <span>Delivery: <strong>${MERKATO_DELIVERY_ZONES[selectedDeliveryZone]?.name}</strong></span>
                <strong style="color:${shipping === 0 ? '#008000' : '#d9534f'};">${shipping === 0 ? 'FREE' : shipping.toLocaleString() + ' ETB'}</strong>
            </li>
            <li style="padding:8px 0;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;color:#666;">
                <span>Tax (VAT 15%)</span>
                <span>${tax.toLocaleString()} ETB</span>
            </li>
            <li style="padding:12px 0;font-size:20px;font-weight:700;color:#d9534f;display:flex;justify-content:space-between;border-top:2px solid #ddd;margin-top:5px;">
                <span>Grand Total:</span>
                <span style="font-size:24px;">${grandTotal.toLocaleString()} ETB</span>
            </li>
        </ul>
    `;
    
    if (sidebarContainer) {
        sidebarContainer.innerHTML = `
            <div class="summary-row">
                <span class="label">Subtotal (${count} items)</span>
                <span class="value">${subtotal.toLocaleString()} ETB</span>
            </div>
            ${discountAmount > 0 ? `
                <div class="summary-row discount">
                    <span class="label">Discount</span>
                    <span class="value">-${discountAmount.toLocaleString()} ETB</span>
                </div>
            ` : ''}
            <div class="summary-row">
                <span class="label">Shipping</span>
                <span class="value" style="color:${shipping === 0 ? '#008000' : '#d9534f'}">${shipping === 0 ? 'FREE' : shipping.toLocaleString() + ' ETB'}</span>
            </div>
            <div class="summary-row">
                <span class="label">Tax (15%)</span>
                <span class="value">${tax.toLocaleString()} ETB</span>
            </div>
            <div class="summary-row total">
                <span class="label">Total</span>
                <span class="value">${grandTotal.toLocaleString()} ETB</span>
            </div>
            
            <div class="promo-section" style="margin-top:15px;">
                <div class="promo-input">
                    <input type="text" placeholder="Promo code" id="checkoutPromoInput" value="${appliedPromoData ? appliedPromoData.code : ''}">
                    <button type="button" onclick="applyCouponCode(document.getElementById('checkoutPromoInput').value)">Apply</button>
                </div>
                ${appliedPromoData ? `
                    <div class="applied-coupon-pill" style="margin-top:8px;">
                        <span>🏷️ ${escapeMarkup(appliedPromoData.code)} applied</span>
                        <button type="button" class="remove-coupon-btn" onclick="removeCouponCode()">✕</button>
                    </div>
                ` : ''}
            </div>
        `;
    }
};

// -------------------------------------------------------------------------
// 4. CHAPA GATEWAY & CBE DIRECT BANK TRANSFER MODAL LOGIC
// -------------------------------------------------------------------------

let chapaTxRef = null;

window.selectPayment = function(method) {
    selectedPayment = method;
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
};

window.initiatePaymentFlow = function() {
    const subtotal = getCartTotal();
    let discountAmount = 0;
    let isFreeShipping = subtotal > 3000;
    if (appliedPromoData) {
        if (appliedPromoData.discountType === 'percentage') discountAmount = Math.round((subtotal * appliedPromoData.discountValue) / 100);
        else if (appliedPromoData.discountType === 'fixed') discountAmount = Math.min(appliedPromoData.discountValue, subtotal);
        if (appliedPromoData.freeShipping) isFreeShipping = true;
    }
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const shipping = isFreeShipping ? 0 : getDeliveryZoneFee();
    const tax = Math.round(discountedSubtotal * 0.15);
    const total = discountedSubtotal + shipping + tax;

    if (selectedPayment === 'telebirr') {
        document.getElementById('paymentInitial').style.display = 'none';
        if (document.getElementById('cbeState')) document.getElementById('cbeState').style.display = 'none';
        if (document.getElementById('chapaState')) document.getElementById('chapaState').style.display = 'none';
        document.getElementById('telebirrAmount').textContent = total.toLocaleString() + ' ETB';
        document.getElementById('telebirrPhoneState').style.display = 'block';
        const phone = document.getElementById('phone')?.value;
        if (phone) document.getElementById('telebirrPhoneInput').value = phone;
    } else if (selectedPayment === 'chapa') {
        document.getElementById('paymentInitial').style.display = 'none';
        if (document.getElementById('telebirrPhoneState')) document.getElementById('telebirrPhoneState').style.display = 'none';
        if (document.getElementById('cbeState')) document.getElementById('cbeState').style.display = 'none';
        
        let chapaBox = document.getElementById('chapaState');
        if (!chapaBox) {
            chapaBox = document.createElement('div');
            chapaBox.id = 'chapaState';
            chapaBox.innerHTML = `
                <div class="icon">💳</div>
                <h2 style="color:#5752da;">Chapa Secure Checkout</h2>
                <p>Pay securely with Visa, Mastercard, Telebirr, CBE Birr, or Awash.</p>
                <div class="chapa-preview-box">
                    <div style="font-size:26px;font-weight:800;color:#5752da;">${total.toLocaleString()} ETB</div>
                    <div class="chapa-supported-badges">
                        <span class="chapa-badge">📱 Telebirr</span>
                        <span class="chapa-badge">🏦 CBE Birr</span>
                        <span class="chapa-badge">💳 Visa / Master</span>
                        <span class="chapa-badge">🏛️ Awash / Amole</span>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="processChapaPaymentFlow()" style="background:#5752da;border-color:#5752da;width:100%;padding:14px;font-size:16px;">
                    🔒 Complete Payment with Chapa
                </button>
                <button class="btn btn-secondary" onclick="resetPaymentModal()" style="margin-top:10px;width:100%;">← Back</button>
            `;
            document.querySelector('.payment-modal .modal-content').appendChild(chapaBox);
        }
        chapaBox.style.display = 'block';
    } else if (selectedPayment === 'cbe') {
        document.getElementById('paymentInitial').style.display = 'none';
        if (document.getElementById('telebirrPhoneState')) document.getElementById('telebirrPhoneState').style.display = 'none';
        if (document.getElementById('chapaState')) document.getElementById('chapaState').style.display = 'none';

        let cbeBox = document.getElementById('cbeState');
        if (!cbeBox) {
            cbeBox = document.createElement('div');
            cbeBox.id = 'cbeState';
            cbeBox.innerHTML = `
                <div class="icon">🏛️</div>
                <h2 style="color:#4b145b;">CBE Direct Bank Transfer</h2>
                <p>Transfer the exact amount to MERKATO's official CBE account.</p>
                <div class="cbe-bank-card">
                    <div class="bank-name">🏦 Commercial Bank of Ethiopia</div>
                    <div class="acc-num">1000 4892 1093 8</div>
                    <div class="acc-holder">Account Name: <strong>MERKATO DIGITAL SUPERMARKET</strong></div>
                    <div style="margin-top:8px;font-size:13px;color:#ffd700;">Amount: <strong>${total.toLocaleString()} ETB</strong></div>
                </div>
                <div style="margin: 15px 0; text-align: left;">
                    <label style="font-size:13px;font-weight:600;display:block;margin-bottom:5px;">CBE Transaction Reference / Slip ID:</label>
                    <input type="text" id="cbeRefInput" placeholder="e.g. FT26084920X" class="form-control" style="font-size:16px;text-transform:uppercase;padding:10px;width:100%;box-sizing:border-box;">
                </div>
                <button class="btn btn-primary" onclick="verifyCbePaymentFlow()" style="background:#4b145b;border-color:#4b145b;width:100%;padding:14px;font-size:16px;">
                    ✅ Verify CBE Reference & Place Order
                </button>
                <button class="btn btn-secondary" onclick="resetPaymentModal()" style="margin-top:10px;width:100%;">← Back</button>
            `;
            document.querySelector('.payment-modal .modal-content').appendChild(cbeBox);
        }
        cbeBox.style.display = 'block';
    } else {
        processPayment();
    }
};

window.resetPaymentModal = function() {
    if (document.getElementById('telebirrPhoneState')) document.getElementById('telebirrPhoneState').style.display = 'none';
    if (document.getElementById('telebirrPinState')) document.getElementById('telebirrPinState').style.display = 'none';
    if (document.getElementById('chapaState')) document.getElementById('chapaState').style.display = 'none';
    if (document.getElementById('cbeState')) document.getElementById('cbeState').style.display = 'none';
    document.getElementById('paymentInitial').style.display = 'block';
};

window.processChapaPaymentFlow = async function() {
    showNotification('🔄 Initializing Chapa Secure Gateway...');
    if (document.getElementById('chapaState')) document.getElementById('chapaState').style.display = 'none';
    processPayment();
};

window.verifyCbePaymentFlow = async function() {
    const ref = document.getElementById('cbeRefInput')?.value?.trim();
    if (!ref || ref.length < 5) {
        showNotification('⚠️ Please enter a valid CBE transaction reference (e.g. FT2608...)');
        return;
    }
    showNotification(`🏦 Verifying CBE Reference: ${ref.toUpperCase()}...`);
    if (document.getElementById('cbeState')) document.getElementById('cbeState').style.display = 'none';
    processPayment();
};

// -------------------------------------------------------------------------
// 5. LIVE SEARCH AUTOCOMPLETE
// -------------------------------------------------------------------------

let searchDebounceTimer = null;

function initLiveSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"], .search-bar input, #searchInput, #headerSearch');

    searchInputs.forEach(input => {
        // Ensure wrapper exists
        let wrapper = input.closest('.live-search-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'live-search-wrapper';
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
        }

        let dropdown = wrapper.querySelector('.live-search-dropdown');
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'live-search-dropdown';
            wrapper.appendChild(dropdown);
        }

        input.addEventListener('input', function() {
            clearTimeout(searchDebounceTimer);
            const query = this.value.trim().toLowerCase();

            if (query.length < 2) {
                dropdown.classList.remove('active');
                dropdown.innerHTML = '';
                return;
            }

            searchDebounceTimer = setTimeout(() => {
                renderLiveSearchResults(query, dropdown);
            }, 250);
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
}

function renderLiveSearchResults(query, dropdown) {
    const allProducts = JSON.parse(localStorage.getItem('merkatoProducts')) || [];
    
    // Search by name, aisle, description, or amharic keywords
    const matches = allProducts.filter(p => {
        const name = (p.name || '').toLowerCase();
        const aisle = (p.aisle || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        return name.includes(query) || aisle.includes(query) || desc.includes(query);
    }).slice(0, 6);

    if (matches.length === 0) {
        dropdown.innerHTML = `
            <div style="padding: 12px; text-align: center; color: #888; font-size: 13px;">
                No matching products found for "<strong>${escapeMarkup(query)}</strong>"
            </div>
        `;
        dropdown.classList.add('active');
        return;
    }

    let html = '';
    matches.forEach(product => {
        const imgUrl = product.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80';
        html += `
            <div class="search-item" onclick="window.location.href='product-detail.html?id=${product.id || product._id}'">
                <img src="${escapeMarkup(imgUrl)}" alt="${escapeMarkup(product.name)}" class="search-item-img" onerror="this.src='images/day-and-night.gif'">
                <div class="search-item-info">
                    <div class="search-item-name">${escapeMarkup(product.name)}</div>
                    <div class="search-item-meta">
                        <span class="search-item-price">${(product.price || 0).toLocaleString()} ETB</span>
                        <span class="search-item-aisle">${escapeMarkup(product.aisle || 'STORE')}</span>
                    </div>
                </div>
                <button type="button" class="search-quick-add" onclick="event.stopPropagation(); quickAddFromSearch('${product.id || product._id}', '${escapeMarkup(product.name).replace(/'/g, "\\'")}', ${product.price || 0})">
                    + Add
                </button>
            </div>
        `;
    });

    dropdown.innerHTML = html;
    dropdown.classList.add('active');
}

function quickAddFromSearch(id, name, price) {
    if (typeof addToCart === 'function') {
        addToCart(id, name, price, 1);
        showNotification(`🛒 Added "${name}" to cart!`);
    }
}

// -------------------------------------------------------------------------
// 6. MERKATO AI HABESHA SHOPPING & RECIPE ASSISTANT WIDGET
// -------------------------------------------------------------------------

function initMerkatoAIWidget() {
    if (document.getElementById('merkatoAiWidget')) return;

    const widget = document.createElement('div');
    widget.id = 'merkatoAiWidget';
    widget.className = 'merkato-ai-widget';

    const dict = MERKATO_I18N[currentLanguage] || MERKATO_I18N.en;

    widget.innerHTML = `
        <button type="button" class="ai-fab-btn" id="aiFabBtn" onclick="toggleMerkatoAI()" title="Ask Merkato AI" aria-label="Merkato AI Assistant">
            🤖
        </button>

        <div class="ai-chat-card" id="aiChatCard">
            <div class="ai-chat-header">
                <h4>
                    <span>☕ ${dict.ai_title}</span>
                    <span class="badge">Habesha AI</span>
                </h4>
                <button type="button" class="ai-chat-close" onclick="toggleMerkatoAI()">✕</button>
            </div>

            <div class="ai-chat-body" id="aiChatBody">
                <div class="ai-msg bot">
                    ${dict.ai_greeting}
                    <div class="ai-chips-wrapper">
                        <button type="button" class="ai-chip-btn" onclick="handleAIChip('coffee')">☕ Best Coffee Roasts</button>
                        <button type="button" class="ai-chip-btn" onclick="handleAIChip('doro_wat')">🥘 Doro Wat Recipe Kit</button>
                        <button type="button" class="ai-chip-btn" onclick="handleAIChip('shipping')">🚚 Delivery Sub-Cities</button>
                        <button type="button" class="ai-chip-btn" onclick="handleAIChip('payment')">💳 Telebirr & CBE Help</button>
                    </div>
                </div>
            </div>

            <div class="ai-chat-footer">
                <input type="text" id="aiChatInput" class="ai-chat-input" placeholder="${dict.ai_placeholder}" onkeypress="if(event.key==='Enter') sendAIMessage()">
                <button type="button" class="ai-chat-send" onclick="sendAIMessage()">➤</button>
            </div>
        </div>
    `;

    document.body.appendChild(widget);
}

function toggleMerkatoAI() {
    const card = document.getElementById('aiChatCard');
    if (!card) return;
    card.classList.toggle('open');
    if (card.classList.contains('open')) {
        document.getElementById('aiChatInput')?.focus();
    }
}

function appendAIMessage(sender, text, htmlExtra = '') {
    const body = document.getElementById('aiChatBody');
    if (!body) return;

    const msg = document.createElement('div');
    msg.className = `ai-msg ${sender}`;
    msg.innerHTML = `${escapeMarkup(text)}${htmlExtra}`;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
}

function handleAIChip(topic) {
    if (topic === 'coffee') {
        appendAIMessage('user', 'Recommend the best Ethiopian coffee for me.');
        setTimeout(() => {
            const reply = "Ethiopia has the world's most distinct single-origin coffees! 🇪🇹\n\n• **Yirgacheffe Buna**: Bright floral notes, jasmine aroma, light-medium roast.\n• **Sidama Buna**: Rich berry fruitiness, smooth chocolate body.\n• **Harar Longberry**: Bold mocha spice profile for traditional jebena boiling.";
            const extra = `
                <div class="ai-chips-wrapper" style="margin-top:10px;">
                    <button type="button" class="ai-chip-btn" onclick="quickAddRecipeItem('Yirgacheffe Buna (ቡና)', 2500)">+ Add Yirgacheffe (2,500 ETB)</button>
                    <button type="button" class="ai-chip-btn" onclick="quickAddRecipeItem('Sidama Specialty Buna', 2800)">+ Add Sidama (2,800 ETB)</button>
                </div>
            `;
            appendAIMessage('bot', reply, extra);
        }, 400);
    } else if (topic === 'doro_wat') {
        appendAIMessage('user', 'What do I need to prepare traditional Doro Wat?');
        setTimeout(() => {
            const reply = "Here is the authentic Ethiopian Doro Wat Kit! 🥘\n\n1. Fresh Pure Berbere Spice (በርበሬ)\n2. Spiced Clarified Butter (ኒጥር ቅቤ - Niter Kibbeh)\n3. Mekelesha Special Spice Blend\n4. Korarima (Cardamom)";
            const extra = `
                <div style="margin-top:10px;padding:10px;background:rgba(0,128,0,0.1);border-radius:10px;">
                    <div style="font-weight:700;font-size:12px;color:#008000;margin-bottom:6px;">✨ Complete Doro Wat Spice Bundle (1,850 ETB)</div>
                    <button type="button" class="btn btn-sm btn-primary" style="font-size:11px;padding:6px 12px;width:100%;" onclick="quickAddDoroWatBundle()">🛒 Add All Spices to Cart</button>
                </div>
            `;
            appendAIMessage('bot', reply, extra);
        }, 400);
    } else if (topic === 'shipping') {
        appendAIMessage('user', 'Where do you deliver in Addis Ababa and Ethiopia?');
        setTimeout(() => {
            appendAIMessage('bot', "We offer 1-3 hour express delivery to all Addis Ababa sub-cities (Bole, Kazanchis, Arada, Yeka, CMC, Lideta, Kolfe) and 24-48h shipping across Ethiopia (Hawassa, Bahir Dar, Adama, Dire Dawa). All orders over 3,000 ETB receive FREE EXPRESS DELIVERY! 🚚");
        }, 400);
    } else if (topic === 'payment') {
        appendAIMessage('user', 'How can I pay for my order?');
        setTimeout(() => {
            appendAIMessage('bot', "We support 4 convenient payment methods:\n1. 📱 **Telebirr** (Instant SMS PIN verification)\n2. 💳 **Chapa Gateway** (Visa, Mastercard, CBE Birr, Awash)\n3. 🏛️ **CBE Direct Bank Transfer** (Acc: 1000489210938)\n4. 💵 **Cash on Delivery (COD)**");
        }, 400);
    }
}

function sendAIMessage() {
    const input = document.getElementById('aiChatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    appendAIMessage('user', text);
    input.value = '';

    const lower = text.toLowerCase();
    setTimeout(() => {
        if (lower.includes('buna') || lower.includes('coffee') || lower.includes('ቡና')) {
            handleAIChip('coffee');
        } else if (lower.includes('doro') || lower.includes('recipe') || lower.includes('shiro') || lower.includes('ቅመም') || lower.includes('spice')) {
            handleAIChip('doro_wat');
        } else if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('አዲስ አበባ') || lower.includes('ቦሌ')) {
            handleAIChip('shipping');
        } else if (lower.includes('telebirr') || lower.includes('cbe') || lower.includes('chapa') || lower.includes('ክፍያ') || lower.includes('ብር')) {
            handleAIChip('payment');
        } else if (lower.includes('selam') || lower.includes('hello') || lower.includes('hi') || lower.includes('ሰላም')) {
            appendAIMessage('bot', currentLanguage === 'am' ? 'ሰላም! ጤና ይስጥልኝ! በመርካቶ ምን ማዘዝ ወይም መፈለግ ይፈልጋሉ?' : 'Selam! How can I assist you with your shopping today?');
        } else {
            appendAIMessage('bot', currentLanguage === 'am' ? 
                `ለጥያቄዎ "${text}" እናመሰግናለን! በሱቃችን ውስጥ ከ 50+ በላይ የሀበሻ እና ዘመናዊ ምርቶች አሉ። ከላይ ያሉትን ፈጣን ምርጫዎች ወይም የፍለጋ ሳጥኑን መጠቀም ይችላሉ።` : 
                `Thank you for asking about "${text}". You can explore our catalog of authentic Ethiopian coffees, spices, artisanal items, and electronics. Feel free to use the search bar above or choose a quick option below!`
            );
        }
    }, 450);
}

function quickAddRecipeItem(name, price) {
    if (typeof addToCart === 'function') {
        addToCart('item_' + Date.now(), name, price, 1);
        showNotification(`🛒 Added "${name}" (${price.toLocaleString()} ETB) to cart!`);
    }
}

function quickAddDoroWatBundle() {
    if (typeof addToCart === 'function') {
        addToCart('sp_1', 'Traditional Pure Berbere (1kg)', 850, 1);
        addToCart('sp_2', 'Spiced Niter Kibbeh (ኒጥር ቅቤ)', 700, 1);
        addToCart('sp_3', 'Mekelesha & Korarima Blend', 300, 1);
        showNotification('🥘 Doro Wat Complete Spice Kit added to cart!');
    }
}

// -------------------------------------------------------------------------
// INITIALIZE ALL MERKATO ENHANCEMENTS AUTOMATICALLY
// -------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    createLanguageToggle();
    applyTranslations(currentLanguage);
    initLiveSearch();
    initMerkatoAIWidget();
});