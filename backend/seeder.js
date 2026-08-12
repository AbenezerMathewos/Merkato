const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

// Load .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Sample products
const products = [
    {
        name: 'Yirgacheffe Buna (ቡና)',
        aisle: 'food',
        price: 2500,
        stock: 42,
        image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSIPbXV5JPWRjWxuMYmcLwLBV-CGnK49jwZQKjSpJcmp1K8BuzJ0Krlasb-g4QX-tds8dIe5QMDYQaO4No',
        description: 'Premium Ethiopian coffee beans from Yirgacheffe region'
    },
    {
        name: 'Pure Doro Berbere (በርበሬ)',
        aisle: 'food',
        price: 1750,
        stock: 85,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
        description: 'Traditional Ethiopian spice blend for Doro Wat'
    },
    {
        name: 'Magna White Teff (ነጭ ጤፍ)',
        aisle: 'food',
        price: 4200,
        stock: 110,
        image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTmen-7vCXbuZKkEhcbaLuaJygZg7U5V_IP6y75A4QpnABl-SS0OuWUQIxKGk2KbazWoq9XR2O1D4MM7zA',
        description: 'Premium grade white teff grain for Injera'
    },
    {
        name: 'Miten Shiro Powder (ሚተን ሽሮ)',
        aisle: 'food',
        price: 650,
        stock: 200,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
        description: 'Roasted chickpea flour for Shiro Wat'
    },
    {
        name: 'Black Cardamom (ኮረሪማ)',
        aisle: 'food',
        price: 850,
        stock: 75,
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
        description: 'Whole dried korerima pods for coffee and stews'
    },
    {
        name: 'Traditional Kibe (የሀገር ቅቤ)',
        aisle: 'food',
        price: 2200,
        stock: 60,
        image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=300&q=80',
        description: 'Spiced clarified butter for Ethiopian cuisine'
    },
    {
        name: 'Clay Jebena (ጀበና)',
        aisle: 'home',
        price: 850,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80',
        description: 'Traditional clay coffee pot'
    },
    {
        name: 'Sini Coffee Cups (ሲኒ)',
        aisle: 'home',
        price: 1200,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80',
        description: 'Traditional ceramic coffee cups set of 6'
    },
    {
        name: 'Wooden Rekebot (ረከቦት)',
        aisle: 'home',
        price: 6500,
        stock: 18,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80',
        description: 'Carved wooden coffee ceremony tray'
    },
    {
        name: 'Habesha Kemis (ሀበሻ ቀሚስ)',
        aisle: 'apparel',
        price: 12000,
        stock: 25,
        image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcR9QX1QnkO_ENdrEH7dZ4K7fEr-dstVk1cPsyd4Kxzk3v2u8W3twSomdUhGSVDpDlKSUe9N25UkZTAWj9Q',
        description: 'Traditional handwoven cotton dress'
    },
    {
        name: 'Cotton Netela (ነጠላ)',
        aisle: 'apparel',
        price: 2800,
        stock: 40,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=300&q=80',
        description: 'Traditional cotton scarf'
    },
    {
        name: 'Heavy Cotton Gabi (ጋቢ)',
        aisle: 'apparel',
        price: 4500,
        stock: 35,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=300&q=80',
        description: 'Warm 4-layer cotton wrap'
    },
    {
        name: 'Woven Mesob (መሶብ)',
        aisle: 'crafts',
        price: 8500,
        stock: 12,
        image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQnIrZQ1DhdrYyq7pG1i-_pQ4k8GNt8zlv4ENn_a0gwk96LXs72qynHCu_qDwe0OU3lYvJULA3w1GpbdtM',
        description: 'Traditional woven straw dining basket'
    },
    {
        name: 'Wooden Barchuma (በርጩማ)',
        aisle: 'crafts',
        price: 3200,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=300&q=80',
        description: 'Carved wooden coffee stool'
    },
    {
        name: 'Electric Mitad (ምጣድ)',
        aisle: 'electronics',
        price: 18500,
        stock: 15,
        image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRucOEkDP9JKh1WJNjrSBwmELxwAJFAyGxA_rOC6b1d-KuJXRmpRhFYMFQgzpiUrpnLInn2crhDdZEsflE',
        description: 'Electric Injera baking stove'
    },
    {
        name: '55" 4K Smart TV',
        aisle: 'electronics',
        price: 68000,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=300&q=80',
        description: 'Ultra-HD 4K Smart LED TV'
    },
    {
        name: 'Solar Power Station',
        aisle: 'electronics',
        price: 42000,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=300&q=80',
        description: 'Home solar power system'
    },
    {
        name: '4G Dual-SIM Smartphone',
        aisle: 'electronics',
        price: 22500,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
        description: 'Dual-SIM smartphone with 128GB storage'
    }
];

// Seed function
const seedProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️ Cleared existing products');

        // Insert new products
        await Product.insertMany(products);
        console.log(`✅ Added ${products.length} products to database`);

        // Exit
        process.exit();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Run the seeder
seedProducts();