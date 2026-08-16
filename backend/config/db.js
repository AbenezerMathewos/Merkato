const mongoose = require('mongoose');
const storage = require('./storage');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.log('ℹ️ No MONGO_URI provided in environment. Using local persistent storage engine.');
        storage.isMongoConnected = false;
        return;
    }

    try {
        // Set short timeout so the server boot is not delayed
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 3000,
            connectTimeoutMS: 3000
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        storage.isMongoConnected = true;
    } catch (error) {
        console.warn(`⚠️ MongoDB connection not available (${error.message}).`);
        console.log(`🚀 Seamlessly running with MERKATO persistent JSON data engine.`);
        storage.isMongoConnected = false;
    }
};

module.exports = connectDB;