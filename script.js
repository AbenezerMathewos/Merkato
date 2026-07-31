// ========================================
// MERKATO - Complete JavaScript File
// Version: 2.0
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
    
    // Get user's name from email
    let userName = email.split('@')[0];
    userName = userName.replace(/[^a-zA-Z]/g, ' ');
    userName = userName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    if (!userName) userName = 'User';
    
    // Check if user already has saved data
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
// USER DISPLAY & DROPDOWN
// ========================================

// ========================================
// USER DISPLAY & DROPDOWN - FIXED
// ========================================

// ========================================
// USER DISPLAY & DROPDOWN - FIXED
// ========================================

function updateUserDisplay() {
    const userData = localStorage.getItem('merkatoUser');
    if (userData) {
        const user = JSON.parse(userData);
        currentUser = user;
        
        // Find the navigation container
        const nav = document.querySelector('.nav');
        if (!nav) return;
        
        // Remove existing user dropdown if any
        const existingUserDisplay = document.querySelector('.user-dropdown-container');
        if (existingUserDisplay) {
            existingUserDisplay.remove();
        }
        
        // Find and HIDE the "Sign In" link (keep it in DOM but hidden)
        const signInLink = nav.querySelector('.nav-login, a[href="login.html"]');
        if (signInLink) {
            signInLink.style.display = 'none';
        }
        
        // Find and REMOVE any standalone "Profile" link
        const profileLinks = nav.querySelectorAll('a[href="profile.html"]');
        profileLinks.forEach(link => {
            link.remove();
        });
        
        // Create user dropdown
        const userContainer = document.createElement('div');
        userContainer.className = 'user-dropdown-container';
        userContainer.style.cssText = `
            display: inline-block;
            position: relative;
            cursor: pointer;
        `;
        
        userContainer.innerHTML = `
            <div class="user-trigger" style="
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 18px;
                background: linear-gradient(135deg, #008000, #006600);
                color: #fff;
                border-radius: 50px;
                font-weight: 600;
                font-size: 14px;
                transition: all 0.3s ease;
                cursor: pointer;
                border: 2px solid #ffd700;
                box-shadow: 0 2px 10px rgba(0,128,0,0.3);
            ">
                <span style="font-size: 16px;">👤</span>
                <span class="user-name">${user.name}</span>
                <span style="font-size: 12px; transition: transform 0.3s ease;">▼</span>
            </div>
            <div class="user-dropdown" style="
                display: none;
                position: absolute;
                right: 0;
                top: 115%;
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 15px 50px rgba(0,0,0,0.2);
                min-width: 220px;
                border: 1px solid #e0e0e0;
                overflow: hidden;
                z-index: 1000;
                animation: dropdownFade 0.3s ease;
            ">
                <div style="
                    padding: 16px 20px;
                    border-bottom: 1px solid #f0f0f0;
                    background: linear-gradient(135deg, #f8fff8, #e8f5e9);
                ">
                    <div style="font-weight: 700;color: #1a1a2e;font-size: 16px;">${user.name}</div>
                    <div style="font-size: 12px;color: #888;margin-top: 2px;">${user.email}</div>
                </div>
                <a href="profile.html" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 20px;
                    color: #333;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    border-bottom: 1px solid #f5f5f5;
                    font-weight: 500;
                " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background=''">
                    <span style="font-size: 18px;">👤</span> My Profile
                </a>
                <a href="orders.html" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 20px;
                    color: #333;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    border-bottom: 1px solid #f5f5f5;
                    font-weight: 500;
                " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background=''">
                    <span style="font-size: 18px;">📦</span> My Orders
                </a>
                <a href="wishlist.html" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 20px;
                    color: #333;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    border-bottom: 1px solid #f5f5f5;
                    font-weight: 500;
                " onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background=''">
                    <span style="font-size: 18px;">❤️</span> My Wishlist
                </a>
                <a href="#" onclick="logoutUser(); return false;" style="
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 20px;
                    color: #d9534f;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    font-weight: 600;
                    border-top: 1px solid #f5f5f5;
                " onmouseover="this.style.background='#fff5f5'" onmouseout="this.style.background=''">
                    <span style="font-size: 18px;">🚪</span> Logout
                </a>
            </div>
        `;
        
        // Add dropdown animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes dropdownFade {
                from {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            .user-trigger:hover {
                transform: scale(1.03);
                box-shadow: 0 4px 15px rgba(0,128,0,0.4);
            }
            .user-dropdown a:hover {
                text-decoration: none !important;
            }
        `;
        document.head.appendChild(style);
        
        // Insert dropdown BEFORE the Sign In link (or at the end)
        if (signInLink) {
            nav.insertBefore(userContainer, signInLink);
        } else {
            nav.appendChild(userContainer);
        }
        
        // Toggle dropdown on click
        const trigger = userContainer.querySelector('.user-trigger');
        const dropdown = userContainer.querySelector('.user-dropdown');
        const arrow = trigger.querySelector('span:last-child');
        
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
            arrow.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userContainer.contains(e.target)) {
                dropdown.style.display = 'none';
                arrow.style.transform = 'rotate(0deg)';
            }
        });
        
    } else {
        // User is NOT logged in - show Sign In link
        const nav = document.querySelector('.nav');
        if (nav) {
            // Remove any existing dropdown
            const existingDropdown = document.querySelector('.user-dropdown-container');
            if (existingDropdown) {
                existingDropdown.remove();
            }
            
            // Show Sign In link
            const signInLink = nav.querySelector('.nav-login, a[href="login.html"]');
            if (signInLink) {
                signInLink.style.display = 'inline-block';
            }
        }
    }
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
        
        // Show Sign In link again
        const nav = document.querySelector('.nav');
        if (nav) {
            const signInLink = nav.querySelector('.nav-login, a[href="login.html"]');
            if (signInLink) {
                signInLink.style.display = 'inline-block';
            }
        }

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
    
    // Get orders from localStorage or create sample
    let orders = JSON.parse(localStorage.getItem('merkatoOrders')) || [];
    
    if (orders.length === 0) {
        // Sample orders for demo
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
    orders.forEach((order, index) => {
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
        
        // Reload page to update UI
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// ========================================
// PROFILE FUNCTIONS
// ========================================

function loadUserProfile() {
    const userData = localStorage.getItem('merkatoUser');
    if (!userData) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(userData);
    
    // Fill profile fields
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
        // If on profile page and not logged in, redirect
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
// CART SYSTEM (Keep all existing cart code)
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

function searchProducts() {
    const input = document.querySelector('.search-form input[type="search"]');
    if (!input) return;
    
    const filter = input.value.toUpperCase().trim();
    const productCards = document.querySelectorAll('.product-card');
    
    if (productCards.length === 0) return;
    
    let found = 0;
    
    productCards.forEach(card => {
        const title = card.querySelector('h3, h4');
        const aisle = card.querySelector('.aisle, .aisle-tag');
        let match = false;
        
        if (title) {
            const text = title.textContent.toUpperCase();
            if (text.includes(filter)) match = true;
        }
        
        if (aisle && !match) {
            const text = aisle.textContent.toUpperCase();
            if (text.includes(filter)) match = true;
        }
        
        if (filter === '') {
            card.style.display = '';
            found++;
        } else if (match) {
            card.style.display = '';
            found++;
        } else {
            card.style.display = 'none';
        }
    });
    
    let noResults = document.querySelector('.no-results');
    if (found === 0 && filter !== '') {
        if (!noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.style.cssText = 'text-align:center;padding:40px;color:#888;grid-column:1/-1;';
            noResults.innerHTML = '🔍 No products found for "<strong>' + input.value + '</strong>"';
            const grid = document.querySelector('.product-grid');
            if (grid) grid.appendChild(noResults);
        }
    } else if (noResults) {
        noResults.remove();
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
// DOM READY - Initialize Everything
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page Loaded:', window.location.pathname);
    
    loadCart();
    checkUserOnLoad();
    
    // Load profile data if on profile page
    if (window.location.pathname.includes('profile.html')) {
        loadUserProfile();
    }
    
    // Handle profile form submission
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
    
    const searchInput = document.querySelector('.search-form input[type="search"]');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchProducts);
    }
    
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