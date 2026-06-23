require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Product = require('./models/Product');
const Feedback = require('./models/Feedback');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Multer Setup for Image Uploads (Cloudinary)
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'genge_pics',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'jfif', 'avif'],
  },
});
const upload = multer({ storage: storage });

// API Routes
// 1. Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Add a new product
app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Tafadhali pakia picha ya bidhaa.' });
        }

        const iconPath = req.file.path; // URL kutoka Cloudinary

        // Generate a unique ID for the product
        const id = 'p_' + Date.now();

        const newProduct = new Product({
            id: id,
            name: name,
            price: Number(price),
            category: category,
            icon: iconPath,
            isImage: true
        });

        await newProduct.save();
        res.status(201).json({ message: 'Bidhaa imepakiwa kikamilifu!', product: newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kuna tatizo wakati wa kupakia bidhaa.', error: err.message });
    }
});

// Seed Initial Data Endpoint (One-time use)
app.post('/api/seed', async (req, res) => {
    try {
        const products = req.body.products;
        await Product.insertMany(products);
        res.status(201).json({ message: 'Bidhaa za mwanzo zimewekwa kikamilifu!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. Post new feedback
app.post('/api/feedback', async (req, res) => {
    try {
        const { name, message } = req.body;
        const newFeedback = new Feedback({
            name: name || 'Mteja (Bila Jina)',
            message: message
        });
        await newFeedback.save();
        res.status(201).json({ message: 'Maoni yametumwa kikamilifu!' });
    } catch (err) {
        res.status(500).json({ message: 'Kosa wakati wa kutuma maoni.', error: err.message });
    }
});

// 4. Get all feedback
app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 5. Create a new order
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = new Order(orderData);
        await newOrder.save();
        res.status(201).json({ message: 'Oda imetumwa kikamilifu!', order: newOrder });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Kosa wakati wa kutuma oda.', error: err.message });
    }
});

// 6. Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ _id: -1 }); // Sort by creation time descending
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 6b. Get orders by customer phone number (flexible match: 07... or +25507...)
app.get('/api/orders/customer/:phone', async (req, res) => {
    try {
        const raw = req.params.phone.replace(/[\s\-]/g, '');
        // Build variants to match regardless of how number was stored
        const variants = [raw];
        if (raw.startsWith('0')) {
            variants.push('+255' + raw.slice(1)); // 07... → +25507...
        } else if (raw.startsWith('+255')) {
            variants.push('0' + raw.slice(4));    // +25507... → 07...
        } else if (raw.startsWith('255')) {
            variants.push('0' + raw.slice(3));    // 25507... → 07...
            variants.push('+' + raw);
        }
        const orders = await Order.find({ 'customer.phone': { $in: variants } }).sort({ _id: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 7. Update order status
app.patch('/api/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        console.log(`[PATCH] Updating order ${id} to status: ${status}`);
        
        // Prepare update object
        const updateData = { status: status };
        
        // If status is 'accepted', mark payment as 'paid'
        if (status === 'accepted') {
            updateData.paymentStatus = 'paid';
            console.log(`[PATCH] Setting paymentStatus to 'paid' for order ${id}`);
        } else if (status === 'rejected') {
            updateData.paymentStatus = 'failed';
            console.log(`[PATCH] Setting paymentStatus to 'failed' for order ${id}`);
        }
        
        console.log(`[PATCH] Update data:`, updateData);
        
        const order = await Order.findOneAndUpdate({ id: id }, updateData, { new: true });
        
        console.log(`[PATCH] Order after update:`, order);
        
        if (!order) {
            return res.status(404).json({ message: 'Oda haijapatikana.' });
        }
        res.json({ message: 'Hali ya oda imebadilishwa.', order });
    } catch (err) {
        console.error('[PATCH] Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// 8. Delete order
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const orderId = req.params.id;
        const result = await Order.findOneAndDelete({ id: orderId });
        if (!result) {
            return res.status(404).json({ message: 'Oda haijapatikana.' });
        }
        res.json({ message: 'Oda imefutwa kikamilifu.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
