const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize express app
const app = express();

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Connect to MongoDB / Storage
connectDB();

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/payments', require('./routes/payments'));

// API status endpoint
app.get('/api', (req, res) => {
    res.json({
        status: 'online',
        message: '🛒 MERKATO - Ethiopian Digital Supermarket API is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            orders: '/api/orders',
            users: '/api/users',
            reviews: '/api/reviews',
            payments: '/api/payments'
        }
    });
});

// Global 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: `API endpoint ${req.originalUrl} not found` });
});

// For all other web requests, fallback to frontend index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(err.status || 500).json({ 
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`🛒 MERKATO Website & API Running`);
    console.log(`🚀 Port: ${PORT}`);
    console.log(`📍 Website URL: http://localhost:${PORT}`);
    console.log(`📍 API URL:     http://localhost:${PORT}/api`);
    console.log(`==============================================\n`);
});