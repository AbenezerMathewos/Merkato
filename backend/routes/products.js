const express = require('express');
const storage = require('../config/storage');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Get all products (with optional query filters: aisle, search)
router.get('/', async (req, res) => {
    try {
        const { aisle, search } = req.query;

        if (storage.isMongoConnected) {
            let filter = {};
            if (aisle && aisle !== 'all') {
                filter.aisle = aisle;
            }
            if (search) {
                filter.name = { $regex: search, $options: 'i' };
            }
            const products = await Product.find(filter).sort({ createdAt: -1 });
            return res.json(products);
        } else {
            let products = storage.getAllProducts();
            if (aisle && aisle !== 'all') {
                products = products.filter(p => p.aisle === aisle);
            }
            if (search) {
                const q = search.toLowerCase();
                products = products.filter(p => 
                    p.name.toLowerCase().includes(q) || 
                    (p.description && p.description.toLowerCase().includes(q))
                );
            }
            return res.json(products);
        }
    } catch (error) {
        console.error('Get products error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Get single product by id or slug
router.get('/:id', async (req, res) => {
    try {
        const idParam = req.params.id;

        if (storage.isMongoConnected) {
            let product;
            if (idParam.match(/^[0-9a-fA-F]{24}$/)) {
                product = await Product.findById(idParam);
            }
            if (!product) {
                product = await Product.findOne({
                    $or: [
                        { name: { $regex: new RegExp('^' + idParam, 'i') } },
                        { description: { $regex: new RegExp(idParam, 'i') } }
                    ]
                });
            }
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.json(product);
        } else {
            const product = storage.findProductById(idParam);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.json(product);
        }
    } catch (error) {
        console.error('Get product error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Create product (admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const { name, aisle, price, stock, image, description } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ message: 'Product name and price are required' });
        }

        if (storage.isMongoConnected) {
            const product = new Product({
                name,
                aisle: aisle || 'food',
                price: Number(price),
                stock: Number(stock || 0),
                image: image || '',
                description: description || ''
            });

            const createdProduct = await product.save();
            return res.status(201).json(createdProduct);
        } else {
            const createdProduct = storage.createProduct({
                name,
                aisle: aisle || 'food',
                price: Number(price),
                stock: Number(stock || 0),
                image: image || '',
                description: description || ''
            });
            return res.status(201).json(createdProduct);
        }
    } catch (error) {
        console.error('Create product error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Update product (admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { name, aisle, price, stock, image, description } = req.body;
        const idParam = req.params.id;

        if (storage.isMongoConnected) {
            const product = await Product.findById(idParam);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            if (name !== undefined) product.name = name;
            if (aisle !== undefined) product.aisle = aisle;
            if (price !== undefined) product.price = Number(price);
            if (stock !== undefined) product.stock = Number(stock);
            if (image !== undefined) product.image = image;
            if (description !== undefined) product.description = description;

            const updatedProduct = await product.save();
            return res.json(updatedProduct);
        } else {
            const updatedProduct = storage.updateProduct(idParam, {
                name,
                aisle,
                price,
                stock,
                image,
                description
            });

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.json(updatedProduct);
        }
    } catch (error) {
        console.error('Update product error:', error);
        return res.status(500).json({ message: error.message });
    }
});

// Delete product (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const idParam = req.params.id;

        if (storage.isMongoConnected) {
            const product = await Product.findById(idParam);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            await product.deleteOne();
            return res.json({ message: 'Product removed successfully' });
        } else {
            const deleted = storage.deleteProduct(idParam);
            if (!deleted) {
                return res.status(404).json({ message: 'Product not found' });
            }
            return res.json({ message: 'Product removed successfully' });
        }
    } catch (error) {
        console.error('Delete product error:', error);
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;