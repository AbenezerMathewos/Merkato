// One-time setup: creates (or upgrades) a real admin account so the
// "Admin Login" demo button on login.html works against your real backend.
//
// Run with: node seedAdmin.js
//
// Creates: admin@merkato.com / admin123  (isAdmin: true)
// If that email already exists, it's promoted to isAdmin: true instead
// of creating a duplicate.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const ADMIN_EMAIL = 'admin@merkato.com';
const ADMIN_PASSWORD = 'admin123';

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📦 Connected to MongoDB');

        let user = await User.findOne({ email: ADMIN_EMAIL });

        if (user) {
            user.isAdmin = true;
            await user.save();
            console.log(`✅ ${ADMIN_EMAIL} already existed — promoted to admin.`);
        } else {
            user = await User.create({
                name: 'Admin',
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD, // hashed automatically by the User model's pre-save hook
                isAdmin: true
            });
            console.log(`✅ Created admin account: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
})();