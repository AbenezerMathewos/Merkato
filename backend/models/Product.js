const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    aisle: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    image: { type: String, required: false },
    description: { type: String, required: false }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;