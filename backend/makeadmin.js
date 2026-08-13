// Run with: node makeAdmin.js youremail@example.com
// Sets isAdmin: true for the given user's email in MongoDB.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const email = process.argv[2];

if (!email) {
    console.error('❌ Usage: node makeAdmin.js youremail@example.com');
    process.exit(1);
}

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB');

        const user = await User.findOneAndUpdate(
            { email },
            { isAdmin: true },
            { new: true }
        );

        if (!user) {
            console.error(`❌ No user found with email: ${email}`);
        } else {
            console.log(`✅ ${user.email} is now an admin (isAdmin: true)`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();