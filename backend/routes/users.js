const express = require('express');
const storage = require('../config/storage');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        if (storage.isMongoConnected) {
            const users = await User.find({}).select('-password').sort({ joinDate: -1 });
            return res.json(users);
        } else {
            const users = storage.getAllUsers();
            return res.json(users);
        }
    } catch (error) {
        console.error('Get users error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Delete user (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const idParam = req.params.id;

        // Prevent admin from deleting themselves
        if (req.user._id.toString() === idParam.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own admin account' });
        }

        if (storage.isMongoConnected) {
            const user = await User.findById(idParam);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await user.deleteOne();
            return res.json({ message: 'User deleted successfully' });
        } else {
            const deleted = storage.deleteUser(idParam);
            if (!deleted) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.json({ message: 'User deleted successfully' });
        }
    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;