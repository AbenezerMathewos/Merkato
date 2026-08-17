const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Review = require('./models/Review');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedDatabase = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('MONGO_URI is not defined in .env');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing database
        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();
        await Review.deleteMany();
        console.log('Data cleared.');

        // Load data from db.json if exists
        const dbPath = path.join(__dirname, 'data', 'db.json');
        if (fs.existsSync(dbPath)) {
            const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            
            if (data.users && data.users.length > 0) {
                // map _id to keep string ids? Wait, Mongoose uses ObjectIds. 
                // To keep it simple, we will just let Mongoose generate new ObjectIds 
                // but for products we should probably keep their slugs since frontend uses them.
                
                // For users, insert raw objects but remove string _ids so mongo generates ObjectIds
                const usersToInsert = data.users.map(u => {
                    const { _id, ...rest } = u;
                    return rest;
                });
                await User.insertMany(usersToInsert);
                console.log('Users imported.');
            }

            if (data.products && data.products.length > 0) {
                const productsToInsert = data.products.map(p => {
                    const { _id, ...rest } = p;
                    return rest;
                });
                await Product.insertMany(productsToInsert);
                console.log('Products imported.');
            }
            
            // Orders and reviews are harder to map because they have string references to old IDs.
            // For a fresh seed, just having users and products is sufficient.
        }

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
