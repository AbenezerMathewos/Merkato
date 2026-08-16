const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const storage = require('../config/storage');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'merkato_secret_fallback_key';
    return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        if (storage.isMongoConnected) {
            const userExists = await User.findOne({ email: email.toLowerCase() });
            if (userExists) {
                return res.status(400).json({ message: 'An account with this email already exists' });
            }

            const user = await User.create({
                name,
                email: email.toLowerCase(),
                password,
                phone: phone || '',
                address: address || ''
            });

            const token = generateToken(user._id);

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                isAdmin: user.isAdmin,
                joinDate: user.joinDate,
                token
            });
        } else {
            const existing = storage.findUserByEmail(email);
            if (existing) {
                return res.status(400).json({ message: 'An account with this email already exists' });
            }

            const user = storage.createUser({
                name,
                email: email.toLowerCase(),
                password,
                phone: phone || '',
                address: address || '',
                isAdmin: false
            });

            const token = generateToken(user._id);

            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                isAdmin: user.isAdmin,
                joinDate: user.joinDate,
                token
            });
        }
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: error.message || 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        if (storage.isMongoConnected) {
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = generateToken(user._id);

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                isAdmin: user.isAdmin,
                joinDate: user.joinDate,
                token
            });
        } else {
            const user = storage.findUserByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = generateToken(user._id);

            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                isAdmin: user.isAdmin,
                joinDate: user.joinDate,
                token
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: error.message || 'Login failed' });
    }
});

// Get current user
router.get('/me', protect, async (req, res) => {
    try {
        if (storage.isMongoConnected) {
            const user = await User.findById(req.user._id).select('-password');
            return res.json(user);
        } else {
            const user = storage.findUserById(req.user._id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            const { password, ...safeUser } = user;
            return res.json(safeUser);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, email, phone, address, password } = req.body;

        if (storage.isMongoConnected) {
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.name = name || user.name;
            user.email = email ? email.toLowerCase() : user.email;
            user.phone = phone !== undefined ? phone : user.phone;
            user.address = address !== undefined ? address : user.address;

            if (password) {
                user.password = password;
            }

            const updatedUser = await user.save();

            return res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                isAdmin: updatedUser.isAdmin,
                joinDate: updatedUser.joinDate
            });
        } else {
            const updatedUser = storage.updateUser(req.user._id, {
                name,
                email: email ? email.toLowerCase() : undefined,
                phone,
                address,
                password
            });

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            const { password: _, ...safeUser } = updatedUser;
            return res.json(safeUser);
        }
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;