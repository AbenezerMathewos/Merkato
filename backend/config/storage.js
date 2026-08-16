const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = path.join(__dirname, '..', 'data');
const dbFilePath = path.join(dataDir, 'db.json');

// Initial seed products
const initialProducts = [
    {
        _id: 'prod_buna_1',
        slug: 'buna',
        name: 'Yirgacheffe Buna (ቡና)',
        aisle: 'food',
        price: 2500,
        stock: 42,
        image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSIPbXV5JPWRjWxuMYmcLwLBV-CGnK49jwZQKjSpJcmp1K8BuzJ0Krlasb-g4QX-tds8dIe5QMDYQaO4No',
        description: 'Premium Ethiopian coffee beans from Yirgacheffe region with distinct floral and citrus notes.'
    },
    {
        _id: 'prod_berbere_2',
        slug: 'berbere',
        name: 'Pure Doro Berbere (በርበሬ)',
        aisle: 'food',
        price: 1750,
        stock: 85,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
        description: 'Traditional Ethiopian spice blend carefully sun-dried and ground for authentic Doro Wat.'
    },
    {
        _id: 'prod_teff_3',
        slug: 'teff',
        name: 'Magna White Teff (ነጭ ጤፍ)',
        aisle: 'food',
        price: 4200,
        stock: 110,
        image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTmen-7vCXbuZKkEhcbaLuaJygZg7U5V_IP6y75A4QpnABl-SS0OuWUQIxKGk2KbazWoq9XR2O1D4MM7zA',
        description: 'Premium grade iron-rich white teff grain harvested from Gojjam, ideal for soft, spongy Injera.'
    },
    {
        _id: 'prod_shiro_4',
        slug: 'shiro',
        name: 'Miten Shiro Powder (ሚተን ሽሮ)',
        aisle: 'food',
        price: 650,
        stock: 200,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
        description: 'Spiced roasted chickpea and split pea flour blend for quick, delicious Shiro Wat.'
    },
    {
        _id: 'prod_korerima_5',
        slug: 'korerima',
        name: 'Black Cardamom (ኮረሪማ)',
        aisle: 'food',
        price: 850,
        stock: 75,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
        description: 'Aromatic whole dried Ethiopian black cardamom pods for traditional coffee brewing and spiced stews.'
    },
    {
        _id: 'prod_kibe_6',
        slug: 'kibe',
        name: 'Traditional Kibe (የሀገር ቅቤ)',
        aisle: 'food',
        price: 2200,
        stock: 60,
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80',
        description: 'Clarified Ethiopian butter infused with kosseret, sacred basil, and korerima.'
    },
    {
        _id: 'prod_jebena_7',
        slug: 'jebena',
        name: 'Clay Jebena (ጀበና)',
        aisle: 'home',
        price: 850,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80',
        description: 'Handcrafted black earthenware clay pot crafted by local potters for the Ethiopian coffee ceremony.'
    },
    {
        _id: 'prod_sini_8',
        slug: 'sini',
        name: 'Sini Coffee Cups (ሲኒ)',
        aisle: 'home',
        price: 1200,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80',
        description: 'Traditional ceramic handleless coffee cups with iconic gold and green Ethiopian detailing (Set of 6).'
    },
    {
        _id: 'prod_rekebot_9',
        slug: 'rekebot',
        name: 'Wooden Rekebot (ረከቦት)',
        aisle: 'home',
        price: 6500,
        stock: 18,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80',
        description: 'Elegantly carved wooden coffee ceremony table with drawer storage for incense and sini cups.'
    },
    {
        _id: 'prod_kemis_10',
        slug: 'kemis',
        name: 'Habesha Kemis (ሀበሻ ቀሚስ)',
        aisle: 'apparel',
        price: 12000,
        stock: 25,
        image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcR9QX1QnkO_ENdrEH7dZ4K7fEr-dstVk1cPsyd4Kxzk3v2u8W3twSomdUhGSVDpDlKSUe9N25UkZTAWj9Q',
        description: 'Handwoven Shemma cotton traditional dress with intricate colorful Tibetan patterns on hem and neckline.'
    },
    {
        _id: 'prod_netela_11',
        slug: 'netela',
        name: 'Cotton Netela (ነጠላ)',
        aisle: 'apparel',
        price: 2800,
        stock: 40,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=300&q=80',
        description: 'Lightweight, two-layered handwoven cotton shawl with decorative bordered fringes.'
    },
    {
        _id: 'prod_gabi_12',
        slug: 'gabi',
        name: 'Heavy Cotton Gabi (ጋቢ)',
        aisle: 'apparel',
        price: 4500,
        stock: 35,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=300&q=80',
        description: 'Thick, warm four-layered cotton wrap ideal for chilly Ethiopian evenings.'
    },
    {
        _id: 'prod_mesob_13',
        slug: 'mesob',
        name: 'Woven Mesob (መሶብ)',
        aisle: 'crafts',
        price: 8500,
        stock: 12,
        image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQnIrZQ1DhdrYyq7pG1i-_pQ4k8GNt8zlv4ENn_a0gwk96LXs72qynHCu_qDwe0OU3lYvJULA3w1GpbdtM',
        description: 'Masterfully hand-woven straw and dried grass dining table with conical lid for communal dining.'
    },
    {
        _id: 'prod_barchuma_14',
        slug: 'barchuma',
        name: 'Wooden Barchuma (በርጩማ)',
        aisle: 'crafts',
        price: 3200,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80',
        description: 'Solid wood carved traditional Ethiopian three-legged coffee stool.'
    },
    {
        _id: 'prod_mitad_15',
        slug: 'mitad',
        name: 'Electric Mitad (ምጣድ)',
        aisle: 'electronics',
        price: 18500,
        stock: 15,
        image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRucOEkDP9JKh1WJNjrSBwmELxwAJFAyGxA_rOC6b1d-KuJXRmpRhFYMFQgzpiUrpnLInn2crhDdZEsflE',
        description: 'Energy-efficient electric clay grill specially engineered for baking authentic round Injera.'
    },
    {
        _id: 'prod_tv_16',
        slug: 'tv',
        name: '55" 4K Smart TV',
        aisle: 'electronics',
        price: 68000,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=300&q=80',
        description: 'Ultra-HD 4K Smart LED TV with built-in Wi-Fi, HDR10+, and streaming apps.'
    },
    {
        _id: 'prod_solar_17',
        slug: 'solar',
        name: 'Solar Power Station',
        aisle: 'electronics',
        price: 42000,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=300&q=80',
        description: 'Portable solar power generator with AC inverter, USB ports, and high-capacity lithium battery.'
    },
    {
        _id: 'prod_phone_18',
        slug: 'phone',
        name: '4G Dual-SIM Smartphone',
        aisle: 'electronics',
        price: 22500,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
        description: 'High performance 4G smartphone with 128GB storage, 6.5-inch HD display, and all-day battery.'
    }
];

class StorageEngine {
    constructor() {
        this.isMongoConnected = false;
        this.initLocalStore();
    }

    initLocalStore() {
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        if (!fs.existsSync(dbFilePath)) {
            const salt = bcrypt.genSaltSync(10);
            const adminPasswordHash = bcrypt.hashSync('admin123', salt);
            const userPasswordHash = bcrypt.hashSync('user123', salt);

            const initialData = {
                users: [
                    {
                        _id: 'user_admin_1',
                        name: 'MERKATO Admin',
                        email: 'admin@merkato.com',
                        password: adminPasswordHash,
                        phone: '+251 91 123 4567',
                        address: 'Bole, Addis Ababa, Ethiopia',
                        isAdmin: true,
                        joinDate: new Date().toISOString()
                    },
                    {
                        _id: 'user_admin_2',
                        name: 'MERKATO Admin 2',
                        email: 'adminmerkato@gmail.com',
                        password: adminPasswordHash,
                        phone: '+251 91 123 4567',
                        isAdmin: true,
                        joinDate: new Date().toISOString()
                    },
                    {
                        _id: 'user_customer_1',
                        name: 'Abebe Bikila',
                        email: 'user@merkato.com',
                        password: userPasswordHash,
                        phone: '+251 91 234 5678',
                        address: 'Kazanchis, Addis Ababa',
                        isAdmin: false,
                        joinDate: new Date().toISOString()
                    }
                ],
                products: initialProducts.map(p => ({
                    ...p,
                    createdAt: new Date().toISOString()
                })),
                orders: [
                    {
                        _id: 'ord_2026_001',
                        user: 'user_customer_1',
                        items: [
                            { name: 'Yirgacheffe Buna (ቡና)', quantity: 2, price: 2500, subtotal: 5000 },
                            { name: 'Electric Mitad (ምጣድ)', quantity: 1, price: 18500, subtotal: 18500 }
                        ],
                        customer: {
                            name: 'Abebe Bikila',
                            email: 'user@merkato.com',
                            phone: '+251 91 234 5678',
                            address: 'Kazanchis, Addis Ababa'
                        },
                        payment: 'telebirr',
                        subtotal: 23500,
                        shipping: 0,
                        tax: 3525,
                        total: 27025,
                        status: 'Processing',
                        tracking: 'ET-2026-0784-001',
                        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
                    },
                    {
                        _id: 'ord_2026_002',
                        user: 'user_customer_1',
                        items: [
                            { name: 'Sini Coffee Cups (ሲኒ)', quantity: 1, price: 1200, subtotal: 1200 },
                            { name: 'Magna White Teff (ነጭ ጤፍ)', quantity: 1, price: 4200, subtotal: 4200 }
                        ],
                        customer: {
                            name: 'Abebe Bikila',
                            email: 'user@merkato.com',
                            phone: '+251 91 234 5678',
                            address: 'Kazanchis, Addis Ababa'
                        },
                        payment: 'cod',
                        subtotal: 5400,
                        shipping: 0,
                        tax: 810,
                        total: 6210,
                        status: 'Delivered',
                        tracking: 'ET-2026-0784-002',
                        createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
                    }
                ],
                reviews: [
                    {
                        _id: 'rev_1',
                        productId: 'prod_buna_1',
                        userName: 'Almaz T.',
                        userEmail: 'almaz@example.com',
                        rating: 5,
                        comment: 'The aroma of this Yirgacheffe coffee is incredible! Truly authentic taste.',
                        verified: true,
                        helpful: 12,
                        notHelpful: 0,
                        createdAt: new Date().toISOString()
                    },
                    {
                        _id: 'rev_2',
                        productId: 'prod_teff_3',
                        userName: 'Dawit K.',
                        userEmail: 'dawit@example.com',
                        rating: 5,
                        comment: 'Best teff quality in Addis. Injera came out perfectly soft with beautiful eyes.',
                        verified: true,
                        helpful: 8,
                        notHelpful: 1,
                        createdAt: new Date().toISOString()
                    }
                ]
            };

            fs.writeFileSync(dbFilePath, JSON.stringify(initialData, null, 2), 'utf-8');
            console.log('📦 Local storage initialized with sample data at:', dbFilePath);
        }
    }

    readData() {
        try {
            const raw = fs.readFileSync(dbFilePath, 'utf-8');
            return JSON.parse(raw);
        } catch (err) {
            console.error('Error reading db.json, reinitializing...', err);
            this.initLocalStore();
            return JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
        }
    }

    writeData(data) {
        fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    // --- USER METHODS ---
    findUserByEmail(email) {
        const data = this.readData();
        return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    findUserById(id) {
        const data = this.readData();
        return data.users.find(u => u._id === id || u._id.toString() === id.toString());
    }

    getAllUsers() {
        const data = this.readData();
        return data.users.map(({ password, ...rest }) => rest);
    }

    createUser(userData) {
        const data = this.readData();
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(userData.password, salt);

        const newUser = {
            _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            phone: userData.phone || '',
            address: userData.address || '',
            isAdmin: !!userData.isAdmin,
            joinDate: new Date().toISOString()
        };

        data.users.push(newUser);
        this.writeData(data);
        return newUser;
    }

    updateUser(id, updates) {
        const data = this.readData();
        const index = data.users.findIndex(u => u._id === id || u._id.toString() === id.toString());
        if (index === -1) return null;

        const user = data.users[index];
        if (updates.name) user.name = updates.name;
        if (updates.email) user.email = updates.email;
        if (updates.phone !== undefined) user.phone = updates.phone;
        if (updates.address !== undefined) user.address = updates.address;
        if (updates.password) {
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(updates.password, salt);
        }

        data.users[index] = user;
        this.writeData(data);
        return user;
    }

    deleteUser(id) {
        const data = this.readData();
        const index = data.users.findIndex(u => u._id === id || u._id.toString() === id.toString());
        if (index === -1) return false;
        data.users.splice(index, 1);
        this.writeData(data);
        return true;
    }

    // --- PRODUCT METHODS ---
    getAllProducts() {
        const data = this.readData();
        return data.products;
    }

    findProductById(idOrSlug) {
        const data = this.readData();
        return data.products.find(p => 
            p._id === idOrSlug || 
            p._id.toString() === idOrSlug.toString() ||
            p.slug === idOrSlug ||
            p.name.toLowerCase().includes(idOrSlug.toLowerCase())
        );
    }

    createProduct(productData) {
        const data = this.readData();
        const slug = (productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) || 'product';
        const newProduct = {
            _id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            slug,
            name: productData.name,
            aisle: productData.aisle,
            price: Number(productData.price),
            stock: Number(productData.stock || 0),
            image: productData.image || '',
            description: productData.description || '',
            createdAt: new Date().toISOString()
        };
        data.products.unshift(newProduct);
        this.writeData(data);
        return newProduct;
    }

    updateProduct(id, updates) {
        const data = this.readData();
        const index = data.products.findIndex(p => p._id === id || p._id.toString() === id.toString());
        if (index === -1) return null;

        const product = data.products[index];
        if (updates.name !== undefined) product.name = updates.name;
        if (updates.aisle !== undefined) product.aisle = updates.aisle;
        if (updates.price !== undefined) product.price = Number(updates.price);
        if (updates.stock !== undefined) product.stock = Number(updates.stock);
        if (updates.image !== undefined) product.image = updates.image;
        if (updates.description !== undefined) product.description = updates.description;

        data.products[index] = product;
        this.writeData(data);
        return product;
    }

    deleteProduct(id) {
        const data = this.readData();
        const index = data.products.findIndex(p => p._id === id || p._id.toString() === id.toString());
        if (index === -1) return false;
        data.products.splice(index, 1);
        this.writeData(data);
        return true;
    }

    decrementStock(nameOrId, qty) {
        const data = this.readData();
        const product = data.products.find(p => 
            p._id === nameOrId || 
            p._id.toString() === nameOrId.toString() || 
            p.name === nameOrId
        );
        if (product) {
            product.stock = Math.max(0, product.stock - qty);
            this.writeData(data);
        }
    }

    // --- ORDER METHODS ---
    getAllOrders() {
        const data = this.readData();
        return data.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    getOrdersByUserId(userId) {
        const data = this.readData();
        return data.orders
            .filter(o => o.user === userId || o.user.toString() === userId.toString())
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    findOrderById(id) {
        const data = this.readData();
        return data.orders.find(o => o._id === id || o._id.toString() === id.toString() || o.id === id);
    }

    createOrder(orderData, userId) {
        const data = this.readData();
        const tracking = 'ET-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
        const newOrder = {
            _id: 'ord_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            user: userId,
            items: orderData.items || [],
            customer: orderData.customer || {},
            payment: orderData.payment || 'telebirr',
            subtotal: Number(orderData.subtotal),
            shipping: Number(orderData.shipping || 0),
            tax: Number(orderData.tax || 0),
            total: Number(orderData.total),
            status: 'Processing',
            tracking,
            createdAt: new Date().toISOString()
        };

        // Decrement stock for ordered items
        if (orderData.items && Array.isArray(orderData.items)) {
            for (const item of orderData.items) {
                this.decrementStock(item.name, item.quantity || 1);
            }
        }

        data.orders.unshift(newOrder);
        this.writeData(data);
        return newOrder;
    }

    updateOrderStatus(id, status) {
        const data = this.readData();
        const order = data.orders.find(o => o._id === id || o._id.toString() === id.toString());
        if (!order) return null;
        order.status = status;
        this.writeData(data);
        return order;
    }

    // --- REVIEW METHODS ---
    getReviews(productId) {
        const data = this.readData();
        return data.reviews.filter(r => r.productId === productId || r.product === productId);
    }

    addReview(reviewData) {
        const data = this.readData();
        const newReview = {
            _id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            productId: reviewData.productId,
            userName: reviewData.userName,
            userEmail: reviewData.userEmail || '',
            rating: Number(reviewData.rating),
            comment: reviewData.comment,
            verified: !!reviewData.verified,
            helpful: 0,
            notHelpful: 0,
            createdAt: new Date().toISOString()
        };
        data.reviews.unshift(newReview);
        this.writeData(data);
        return newReview;
    }

    voteReview(id, type) {
        const data = this.readData();
        const review = data.reviews.find(r => r._id === id || r._id.toString() === id.toString());
        if (!review) return null;
        if (type === 'helpful') review.helpful = (review.helpful || 0) + 1;
        if (type === 'notHelpful') review.notHelpful = (review.notHelpful || 0) + 1;
        this.writeData(data);
        return review;
    }
}

const storage = new StorageEngine();
module.exports = storage;
