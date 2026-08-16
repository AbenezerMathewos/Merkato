const jwt = require('jsonwebtoken');
const storage = require('../config/storage');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({ message: 'Not authorized, invalid token' });
            }

            const secret = process.env.JWT_SECRET || 'merkato_secret_fallback_key';
            const decoded = jwt.verify(token, secret);

            if (storage.isMongoConnected) {
                req.user = await User.findById(decoded.id).select('-password');
            } else {
                const user = storage.findUserById(decoded.id);
                if (user) {
                    const { password, ...userWithoutPassword } = user;
                    req.user = userWithoutPassword;
                }
            }

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            return next();
        } catch (error) {
            console.error('Auth verification error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    return res.status(401).json({ message: 'Not authorized, no token provided' });
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
};

module.exports = { protect, admin };