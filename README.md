# 🛒 MERKATO - Ethiopian Digital Supermarket

> Ethiopia's premier digital marketplace connecting authentic local products with modern convenience.

![MERKATO Logo](images/day-and-night.gif)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Glossary/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 🌟 Live Demo

**🌐 Live Site:** [https://abenezermathewos.github.io/Merkato/](https://abenezermathewos.github.io/Merkato/)

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Pages Overview](#-pages-overview)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 📖 About the Project

MERKATO is a fully functional e-commerce platform built for the Ethiopian market. It combines traditional Ethiopian products (coffee, spices, textiles, crafts) with modern electronics, all in one digital marketplace.

The name "MERKATO" comes from the famous Merkato market in Addis Ababa, one of the largest open-air markets in Africa.

### 🎯 Mission

To empower Ethiopian artisans, farmers, and manufacturers by providing a trusted digital marketplace that connects authentic local products with consumers across Ethiopia and the world.

### ✨ Vision

To become Ethiopia's leading e-commerce platform, bridging tradition with technology while supporting local communities and preserving cultural heritage.

---

## 📸 Screenshots

*(Replace these placeholders with actual screenshots of the application)*

<div style="display: flex; gap: 10px; overflow-x: auto;">
  <img src="https://via.placeholder.com/400x250.png?text=Home+Page" alt="Home Page" width="400">
  <img src="https://via.placeholder.com/400x250.png?text=Product+Details" alt="Product Details" width="400">
  <img src="https://via.placeholder.com/400x250.png?text=Shopping+Cart" alt="Shopping Cart" width="400">
  <img src="https://via.placeholder.com/400x250.png?text=Mobile+View" alt="Mobile View" width="400">
</div>

---

## 🚀 Features

### 👤 User Features
- 🔐 **User Authentication** - Sign up, sign in, and profile management
- 🛒 **Shopping Cart** - Add, remove, and update quantities persistently
- ❤️ **Wishlist** - Save favorite products for later
- 📦 **Order Management** - View order history, track orders, cancel orders
- ⭐ **Product Reviews** - Rate and review products with star ratings
- 👍 **Helpful Votes** - Vote on reviews (helpful/not helpful)
- ✅ **Verified Purchase** - Verified badges for authentic reviews

### 🛍️ Shopping Experience
- 🔍 **Search Products** - Real-time search across all products
- 📊 **Filter & Sort** - Filter by aisle, price range, and sort options
- 📱 **Product Details** - View product descriptions, images, and reviews
- 📦 **Stock Status** - In stock, low stock, and out of stock indicators
- 📋 **Order Tracking** - Track order status with visual progress bar
- 🖨️ **Print Receipt** - Printable order receipts

### 💳 Payment & Checkout
- 💳 **Multiple Payment Methods** - Telebirr, Cash on Delivery, Credit/Debit Card
- 📋 **Order Summary** - Review order before payment
- ✅ **Order Confirmation** - Confirmation page with order details
- 🎟️ **Promo Codes** - Apply discount coupons
- 📧 **Newsletter** - Subscribe for updates and offers

### 👨‍💼 Admin Features
- 📊 **Dashboard** - View stats (products, orders, revenue, users)
- ➕ **Manage Products** - Add, edit, delete products
- 📋 **Order Management** - View and update order status
- 👤 **User Management** - View registered users

### 🎨 Design & Tech Features
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive** - Works on all devices (mobile, tablet, desktop)
- 🌐 **PWA Support** - Install as mobile app with offline fallback, sync & push notifications
- ⚡ **Performance Optimized** - Caching strategies via Service Worker
- 🎯 **Modern UI** - Clean, professional design with animations

---

## 🛠️ Technology Stack

### Frontend Core
| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic structure and content |
| **CSS3** | Custom variables, Flexbox, Grid, Animations |
| **JavaScript (ES6+)** | Interactivity, API requests, DOM manipulation |
| **localStorage** | Data persistence (client-side state management) |

### PWA Features
| Technology | Purpose |
|------------|---------|
| **Service Worker** | Caching, offline support, background sync |
| **Manifest.json** | App installation metadata |

### Deployment & Tools
| Platform | Purpose |
|----------|---------|
| **GitHub Pages** | Hosting & CI/CD |
| **Git** | Version Control |

---

## 📁 Project Structure

```text
Merkato/
├── frontend/
│   ├── index.html           # Landing page
│   ├── shop.html            # Product listing
│   ├── product-detail.html  # Single product view
│   ├── cart.html            # Shopping cart
│   ├── checkout.html        # Checkout process
│   ├── login.html           # Auth page
│   ├── profile.html         # User dashboard
│   ├── admin.html           # Admin dashboard
│   ├── style.css            # Main stylesheet
│   ├── script.js            # Main UI logic
│   ├── api.js               # API client & data layer
│   ├── sw.js                # Service Worker
│   ├── manifest.json        # PWA Manifest
│   └── images/              # Assets (icons, screenshots)
├── backend/                 # (Optional/Future) Node.js/Express API
└── README.md                # Project documentation
```

---

## 💻 Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- (Optional) A local web server extension like "Live Server" for VS Code

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbenezerMathewos/Merkato.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd Merkato
   ```

3. **Run the application:**
   - **Using VS Code:** Open the folder in VS Code, right-click `frontend/index.html` and select "Open with Live Server".
   - **Using Python:** 
     ```bash
     cd frontend
     python -m http.server 8000
     ```
     Then open `http://localhost:8000` in your browser.
   - **Directly:** Open `frontend/index.html` in your web browser (Note: some PWA/Service Worker features might not work properly via `file://` protocol).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

Abenezer Mathewos - [GitHub Profile](https://github.com/AbenezerMathewos)

Project Link: [https://github.com/AbenezerMathewos/Merkato](https://github.com/AbenezerMathewos/Merkato)
