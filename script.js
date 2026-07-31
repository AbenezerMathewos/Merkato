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
    
    currentUser = {
        name: userName,
        email: email
    };
    
    localStorage.setItem('merkatoUser', JSON.stringify(currentUser));
    
    // ===== RESET FLAGS =====
    hasShownWelcome = false;
    sessionStorage.removeItem('welcomeShown');
    
    showWelcomeMessage(userName);
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

function updateUserDisplay() {
    const userData = localStorage.getItem('merkatoUser');
    if (userData) {
        const user = JSON.parse(userData);
        currentUser = user;
        
        const loginLinks = document.querySelectorAll('.nav a[href="login.html"]');
        loginLinks.forEach(link => {
            if (!link.classList.contains('user-display')) {
                link.textContent = `👤 ${user.name}`;
                link.classList.add('user-display');
                link.href = '#';
                link.onclick = function(e) {
                    e.preventDefault();
                    showNotification(`👋 Logged in as ${user.name}`);
                };
            }
        });
    }
}

function logoutUser() {
    localStorage.removeItem('merkatoUser');
    currentUser = null;
    sessionStorage.removeItem('welcomeShown');
    hasShownWelcome = false;
    
    const userLinks = document.querySelectorAll('.user-display');
    userLinks.forEach(link => {
        link.textContent = 'Sign In';
        link.href = 'login.html';
        link.classList.remove('user-display');
        link.onclick = null;
    });
    
    showNotification('👋 You have been logged out');
}

function checkUserOnLoad() {
    const userData = localStorage.getItem('merkatoUser');
    if (userData) {
        const user = JSON.parse(userData);
        currentUser = user;
        updateUserDisplay();
        
        // ===== SHOW WELCOME BACK ONLY ONCE =====
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
            if (!hasShownWelcome && !sessionStorage.getItem('welcomeShown')) {
                hasShownWelcome = true;
                sessionStorage.setItem('welcomeShown', 'true');
                setTimeout(() => {
                    showWelcomeBack(user.name);
                }, 500);
            }
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
// CART SYSTEM (keep your existing cart code)
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