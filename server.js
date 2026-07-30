require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const https = require('https');
const jwt = require('jsonwebtoken');
const Product = require('./models/Product');
const Feedback = require('./models/Feedback');
const Order = require('./models/Order');
const Package = require('./models/Package');

// Helper function to send Telegram notification to Admin when an order is created
function sendTelegramNotification(order) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return; // Telegram notification is optional if env vars are not set
    }

    try {
        const itemsList = (order.items || []).map(i => `• *${i.title}* (${i.details || 'Bidhaa'}) x${i.quantity || 1} - Tsh ${(i.price || 0).toLocaleString()}`).join('\n');
        
        let gpsText = '';
        if (order.customer && order.customer.gps && order.customer.gps.lat && order.customer.gps.lng) {
            gpsText = `\n📍 *GPS Map:* https://www.google.com/maps?q=${order.customer.gps.lat},${order.customer.gps.lng}`;
        }

        const networkInfo = order.paymentNetwork ? `\n💳 *Mtandao wa Malipo:* ${order.paymentNetwork}` : '';

        const message = 
            `🔔 *ODA MPYA YA GENGE!* 🛍️\n\n` +
            `🆔 *Oda ID:* \`${order.id}\`\n` +
            `👤 *Mteja:* ${order.customer?.name || 'Bila Jina'}\n` +
            `📞 *Simu:* ${order.customer?.phone || '-'}\n` +
            `📍 *Mahali:* ${order.customer?.location || '-'}${gpsText}\n\n` +
            `🛒 *Bidhaa Zilizowekwa:*\n${itemsList}\n\n` +
            `💰 *Jumla Kuu:* *Tsh ${(order.total || 0).toLocaleString()}/=*${networkInfo}\n` +
            `🗓️ *Tarehe:* ${order.date || new Date().toLocaleString()}`;

        const postData = JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });

        const req = https.request(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            res.on('data', () => {});
        });

        req.on('error', (e) => {
            console.error('[NOTIFICATION] Telegram Error:', e.message);
        });

        req.write(postData);
        req.end();
    } catch (err) {
        console.error('[NOTIFICATION] Error preparing Telegram alert:', err.message);
    }
}

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

// Admin Auth Middleware & Login Endpoint
const JWT_SECRET = process.env.JWT_SECRET || 'genge_secret_key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'genge_admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, message: 'Umefanikiwa kuingia!' });
    } else {
        res.status(401).json({ message: 'Jina au nywila (password) sio sahihi!' });
    }
});

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Muda wa kikao umeisha (Token expired), tafadhali ingia upya.' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Huna ruhusa ya kufikia huduma hii! (Unauthorized)' });
    }
};

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
app.post('/api/products', verifyAdmin, upload.single('image'), async (req, res) => {
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

// ==========================================
// PACKAGES API ROUTES
// ==========================================

// Get all packages
app.get('/api/packages', async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new package
app.post('/api/packages', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, price, features } = req.body;
        
        let iconPath = 'pics/15.png'; // Default image if none uploaded
        if (req.file) {
            iconPath = req.file.path;
        }

        const id = 'pkg_' + Date.now();

        // Features can be passed as JSON string or array, parse if string
        let parsedFeatures = [];
        if (features) {
            try {
                parsedFeatures = JSON.parse(features);
            } catch (e) {
                parsedFeatures = Array.isArray(features) ? features : [features];
            }
        }

        const newPackage = new Package({
            id: id,
            title: title,
            price: Number(price),
            icon: iconPath,
            isImage: true,
            features: parsedFeatures
        });

        await newPackage.save();
        res.status(201).json({ message: 'Kifurushi kimeongezwa kikamilifu!', package: newPackage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Kuna tatizo wakati wa kuongeza kifurushi.', error: err.message });
    }
});

// Update package
app.patch('/api/packages/:id', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, price, features } = req.body;
        
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (price !== undefined) updateData.price = Number(price);
        
        if (features !== undefined) {
            try {
                updateData.features = JSON.parse(features);
            } catch (e) {
                updateData.features = Array.isArray(features) ? features : [features];
            }
        }

        if (req.file) {
            updateData.icon = req.file.path;
            updateData.isImage = true;
        }

        const updatedPackage = await Package.findOneAndUpdate({ id: id }, updateData, { new: true });
        if (!updatedPackage) {
            return res.status(404).json({ message: 'Kifurushi hakijapatikana.' });
        }
        res.json({ message: 'Kifurushi kimesasishwa kikamilifu!', package: updatedPackage });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete package
app.delete('/api/packages/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Package.findOneAndDelete({ id: id });
        if (!result) {
            return res.status(404).json({ message: 'Kifurushi hakijapatikana.' });
        }
        res.json({ message: 'Kifurushi kimefutwa kikamilifu.' });
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
app.get('/api/feedback', verifyAdmin, async (req, res) => {
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

        // Send Telegram Notification to Admin if configured
        sendTelegramNotification(newOrder);

        res.status(201).json({ message: 'Oda imetumwa kikamilifu!', order: newOrder });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ message: 'Kosa wakati wa kutuma oda.', error: err.message });
    }
});

// 6. Get all orders
app.get('/api/orders', verifyAdmin, async (req, res) => {
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
app.patch('/api/orders/:id/status', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        console.log(`[PATCH] Updating order ${id} to status: ${status}`);
        
        // Prepare update object
        const updateData = { status: status };
        
        // Handle paymentStatus auto-update based on tracking status
        if (['accepted', 'processing', 'shipped', 'delivered'].includes(status)) {
            updateData.paymentStatus = 'paid';
            console.log(`[PATCH] Setting paymentStatus to 'paid' for order ${id} due to status: ${status}`);
        } else if (status === 'rejected') {
            updateData.paymentStatus = 'failed';
            console.log(`[PATCH] Setting paymentStatus to 'failed' for order ${id}`);
        } else if (status === 'pending') {
            updateData.paymentStatus = 'pending';
            console.log(`[PATCH] Setting paymentStatus to 'pending' for order ${id}`);
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
app.delete('/api/orders/:id', verifyAdmin, async (req, res) => {
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

// 8b. Update delivery charge & recalculate total
app.patch('/api/orders/:id/delivery', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveryCharge } = req.body;

        const order = await Order.findOne({ id: id });
        if (!order) {
            return res.status(404).json({ message: 'Oda haijapatikana.' });
        }

        const newDeliveryCharge = Number(deliveryCharge) || 0;
        // Recalculate: itemsTotal = current total minus old deliveryCharge
        const itemsTotal = order.total - (order.deliveryCharge || 0);
        const newTotal = itemsTotal + newDeliveryCharge;

        const updatedOrder = await Order.findOneAndUpdate(
            { id: id },
            { deliveryCharge: newDeliveryCharge, total: newTotal },
            { new: true }
        );

        console.log(`[PATCH] Delivery charge set to ${newDeliveryCharge} for order ${id}. New total: ${newTotal}`);
        res.json({ message: 'Ada ya usafiri imesasishwa.', order: updatedOrder });
    } catch (err) {
        console.error('[PATCH] Delivery charge error:', err);
        res.status(500).json({ message: err.message });
    }
});


// 9. Update product price / name / category
app.patch('/api/products/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { price, name, category } = req.body;
        const updateData = {};
        if (price !== undefined) updateData.price = Number(price);
        if (name !== undefined) updateData.name = name;
        if (category !== undefined) updateData.category = category;

        const product = await Product.findOneAndUpdate({ id: id }, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ message: 'Bidhaa haijapatikana.' });
        }
        res.json({ message: 'Bidhaa imesasishwa kikamilifu!', product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 10. Delete product
app.delete('/api/products/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Product.findOneAndDelete({ id: id });
        if (!result) {
            return res.status(404).json({ message: 'Bidhaa haijapatikana.' });
        }
        res.json({ message: 'Bidhaa imefutwa kikamilifu.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==========================================
// HARAKAPAY PAYMENT INTEGRATION API ROUTES
// ==========================================

// Initiate HarakaPay STK Push Payment Prompt
app.post('/api/payments/stkpush', async (req, res) => {
    try {
        const { orderId, phone, amount, network } = req.body;

        if (!phone || !amount) {
            return res.status(400).json({ message: 'Tafadhali weka namba ya simu na kiasi.' });
        }

        // Format phone number to international 255 format
        let cleanPhone = phone.replace(/\s+/g, '').replace(/[\+\-]/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '255' + cleanPhone.slice(1);
        }

        const apiKey = process.env.HARAKAPAY_API_KEY;
        const baseUrl = process.env.HARAKAPAY_BASE_URL || 'https://api.harakapay.com';

        console.log(`[HARAKAPAY STK] Initiating payment request for Order ${orderId}, Phone ${cleanPhone}, Amount ${amount} TZS`);

        // Prepare request payload for HarakaPay
        const payload = JSON.stringify({
            api_key: apiKey,
            phone_number: cleanPhone,
            amount: Number(amount),
            currency: 'TZS',
            reference: orderId || `ORD-${Date.now()}`,
            network: network || 'mobile_money',
            callback_url: `${req.protocol}://${req.get('host')}/api/payments/callback`
        });

        const urlParts = new URL(`${baseUrl}/v1/stkpush`);
        const options = {
            hostname: urlParts.hostname,
            port: urlParts.port || 443,
            path: urlParts.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'x-api-key': apiKey,
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const apiReq = https.request(options, (apiRes) => {
            let body = '';
            apiRes.on('data', (chunk) => body += chunk);
            apiRes.on('end', () => {
                console.log(`[HARAKAPAY API RESPONSE] Status: ${apiRes.statusCode}`, body);
                try {
                    const responseData = JSON.parse(body);
                    return res.json({
                        success: true,
                        message: 'Ombi la malipo limetumwa kwenye simu yako! Tafadhali ingiza PIN yako kwenye Pop-Up ya simu.',
                        reference: orderId,
                        data: responseData
                    });
                } catch (e) {
                    return res.json({
                        success: true,
                        message: 'Ombi la malipo limeandaliwa! Ingiza PIN kwenye simu yako kukamilisha.',
                        reference: orderId
                    });
                }
            });
        });

        apiReq.on('error', (err) => {
            console.error('[HARAKAPAY STK ERROR]', err.message);
            return res.json({
                success: true,
                message: 'Ombi la malipo la HarakaPay limetumwa kwa namba ' + cleanPhone + '. Weka PIN yako kukamilisha.',
                reference: orderId
            });
        });

        apiReq.write(payload);
        apiReq.end();

    } catch (err) {
        console.error('HarakaPay STK Error:', err);
        res.status(500).json({ message: 'Kosa wakati wa kuchakata malipo ya HarakaPay.', error: err.message });
    }
});

// HarakaPay Webhook Callback Endpoint
app.post('/api/payments/callback', async (req, res) => {
    try {
        console.log('[HARAKAPAY CALLBACK RECEIVED]', req.body);
        const { reference, order_id, status, payment_status } = req.body;
        const targetId = order_id || reference;

        const isSuccess = status === 'SUCCESS' || status === 'COMPLETED' || payment_status === 'paid' || status === 'paid';

        if (targetId) {
            const updatedOrder = await Order.findOneAndUpdate(
                { id: targetId },
                { paymentStatus: isSuccess ? 'paid' : 'failed' },
                { new: true }
            );

            if (updatedOrder && isSuccess) {
                console.log(`[HARAKAPAY] Order ${targetId} successfully marked as PAID`);
                sendTelegramNotification(updatedOrder);
            }
        }

        res.status(200).json({ received: true, status: 'acknowledged' });
    } catch (err) {
        console.error('[HARAKAPAY CALLBACK ERROR]', err);
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
