const express = require('express');
const storage = require('../config/storage');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', protect, async (req, res) => {
    try {
        const { items, customer, payment, subtotal, shipping, tax, total } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order items are required' });
        }

        if (storage.isMongoConnected) {
            const tracking = 'ET-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
            const order = new Order({
                user: req.user._id,
                items,
                customer,
                payment: payment || 'telebirr',
                subtotal: Number(subtotal),
                shipping: Number(shipping || 0),
                tax: Number(tax || 0),
                total: Number(total),
                status: 'Processing',
                tracking
            });

            for (const item of items) {
                const product = await Product.findOne({
                    $or: [
                        { name: item.name },
                        { _id: item.id || item._id }
                    ]
                });
                if (product) {
                    product.stock = Math.max(0, product.stock - (item.quantity || 1));
                    await product.save();
                }
            }

            const createdOrder = await order.save();
            return res.status(201).json(createdOrder);
        } else {
            const createdOrder = storage.createOrder({
                items,
                customer,
                payment,
                subtotal,
                shipping,
                tax,
                total
            }, req.user._id);

            return res.status(201).json(createdOrder);
        }
    } catch (error) {
        console.error('Create order error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Get logged-in user orders
router.get('/myorders', protect, async (req, res) => {
    try {
        if (storage.isMongoConnected) {
            const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
            return res.json(orders);
        } else {
            const orders = storage.getOrdersByUserId(req.user._id);
            return res.json(orders);
        }
    } catch (error) {
        console.error('Get my orders error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Get all orders (admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        if (storage.isMongoConnected) {
            const orders = await Order.find({}).sort({ createdAt: -1 });
            return res.json(orders);
        } else {
            const orders = storage.getAllOrders();
            return res.json(orders);
        }
    } catch (error) {
        console.error('Get all orders error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const idParam = req.params.id;

        if (storage.isMongoConnected) {
            const order = await Order.findById(idParam);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                return res.status(403).json({ message: 'Not authorized to view this order' });
            }
            return res.json(order);
        } else {
            const order = storage.findOrderById(idParam);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                return res.status(403).json({ message: 'Not authorized to view this order' });
            }
            return res.json(order);
        }
    } catch (error) {
        console.error('Get order by id error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Update order status (admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        const idParam = req.params.id;

        if (storage.isMongoConnected) {
            const order = await Order.findById(idParam);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            order.status = status;
            const updatedOrder = await order.save();
            return res.json(updatedOrder);
        } else {
            const updatedOrder = storage.updateOrderStatus(idParam, status);
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }
            return res.json(updatedOrder);
        }
    } catch (error) {
        console.error('Update order status error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Cancel order (customer or admin)
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const idParam = req.params.id;

        if (storage.isMongoConnected) {
            const order = await Order.findById(idParam);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                return res.status(403).json({ message: 'Not authorized to cancel this order' });
            }
            if (order.status !== 'Processing') {
                return res.status(400).json({ message: `Order cannot be cancelled in '${order.status}' status` });
            }
            order.status = 'Cancelled';
            const updatedOrder = await order.save();
            return res.json(updatedOrder);
        } else {
            const order = storage.findOrderById(idParam);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                return res.status(403).json({ message: 'Not authorized to cancel this order' });
            }
            if (order.status !== 'Processing') {
                return res.status(400).json({ message: `Order cannot be cancelled in '${order.status}' status` });
            }
            const updatedOrder = storage.updateOrderStatus(idParam, 'Cancelled');
            return res.json(updatedOrder);
        }
    } catch (error) {
        console.error('Cancel order error:', error);
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;