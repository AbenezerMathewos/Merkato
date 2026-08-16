const mongoose = require('mongoose');
const storage = require('./storage');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.log('ℹ️ No MONGO_URI provided in environment. Using local persistent storage engine.');
        storage.isMongoConnected = false;
        return;
    }

    try {
        // Use Promise.race with a quick 1.5s timeout so startup is never delayed
        const connectPromise = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 1500,
            connectTimeoutMS: 1500
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('MongoDB connection timeout (1.5s)')), 1500)
        );

        const conn = await Promise.race([connectPromise, timeoutPromise]);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        storage.isMongoConnected = true;
    } catch (error) {
        console.warn(`⚠️ MongoDB not connected (${error.message}).`);
        console.log(`🚀 Running with MERKATO high-performance persistent JSON data engine.`);
        storage.isMongoConnected = false;
    }
};

module.exports = connectDB;