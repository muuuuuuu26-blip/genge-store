require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Product = require('./models/Product');
const Feedback = require('./models/Feedback');
const Order = require('./models/Order');
const Package = require('./models/Package');

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

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'pics/'); // Save images to pics folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const initialProducts = [
    // --- MATUNDA ---
    { id: 'p1', name: 'Ndizi Mbivu (Kichane)', price: 1500, category: 'matunda', icon: 'pics/banana.jpg', isImage: true },
    { id: 'p2', name: 'Machungwa (5)', price: 1000, category: 'matunda', icon: 'pics/machungwa.jfif', isImage: true },
    { id: 'p3', name: 'Tufaha/Apple (1)', price: 700, category: 'matunda', icon: 'pics/aple.avif', isImage: true },
    { id: 'p4', name: 'Parachichi (1)', price: 1000, category: 'matunda', icon: 'pics/parachichi.jfif', isImage: true },
    { id: 'p5', name: 'Tikiti Maji (Zima)', price: 4000, category: 'matunda', icon: 'pics/tikiti.webp', isImage: true },
    { id: 'p40', name: 'Chenza (5)', price: 1000, category: 'matunda', icon: 'pics/chenza.webp', isImage: true },
    { id: 'p41', name: 'Embe Dodo (5)', price: 1500, category: 'matunda', icon: 'pics/embe dodo.jpg', isImage: true },
    { id: 'p42', name: 'Embe Tanga (5)', price: 2000, category: 'matunda', icon: 'pics/embe tanga.jfif', isImage: true },
    { id: 'p44', name: 'Fenesi (Kilo 1)', price: 2000, category: 'matunda', icon: 'pics/fenesi.jfif', isImage: true },
    { id: 'p45', name: 'Mananasi (1)', price: 1500, category: 'matunda', icon: 'pics/mananasi.jfif', isImage: true },
    { id: 'p46', name: 'Mapapai (1)', price: 2000, category: 'matunda', icon: 'pics/mapapai.jpg', isImage: true },
    { id: 'p47', name: 'Mapera (Fungu)', price: 1000, category: 'matunda', icon: 'pics/mapera.jpg', isImage: true },
    { id: 'p48', name: 'Nazi (1)', price: 500, category: 'matunda', icon: 'pics/coconut.webp', isImage: true },
    { id: 'p49', name: 'Passion Fruit (5)', price: 1000, category: 'matunda', icon: 'pics/passion.jfif', isImage: true },
    { id: 'p50', name: 'Peasi (3)', price: 1500, category: 'matunda', icon: 'pics/peasi.jfif', isImage: true },
    { id: 'p51', name: 'Stafeli (1)', price: 3000, category: 'matunda', icon: 'pics/stafeli.jpg', isImage: true },
    { id: 'p52', name: 'Strawberries (Fungu)', price: 3000, category: 'matunda', icon: 'pics/strawberries.jfif', isImage: true },
    { id: 'p53', name: 'Tende (Fungu)', price: 2000, category: 'matunda', icon: 'pics/Tende.jfif', isImage: true },
    { id: 'p54', name: 'Ubuyu (Fungu)', price: 500, category: 'matunda', icon: 'pics/ubuyu.jpg', isImage: true },
    { id: 'p55', name: 'Ukwaju (Fungu)', price: 500, category: 'matunda', icon: 'pics/ukwaju.jfif', isImage: true },
    { id: 'p56', name: 'Zabibu (Fungu)', price: 2500, category: 'matunda', icon: 'pics/zabibu.jfif', isImage: true },
    { id: 'p57', name: 'Zaituni (Fungu)', price: 2000, category: 'matunda', icon: 'pics/zaituni.jfif', isImage: true },
    { id: 'p58', name: 'Cherry (Fungu)', price: 3000, category: 'matunda', icon: 'pics/cherry.jpg', isImage: true },

    // --- MBOGAMBOGA ---
    { id: 'p6', name: 'Nyanya (Fungu)', price: 1000, category: 'mbogamboga', icon: 'pics/nyanya.jpg', isImage: true },
    { id: 'p7', name: 'Vitunguu Maji (Fungu)', price: 1000, category: 'mbogamboga', icon: 'pics/vitungu maji.jfif', isImage: true },
    { id: 'p7b', name: 'Vitunguu Swaumu (Fungu)', price: 1500, category: 'mbogamboga', icon: 'pics/vitungu swaumu.jfif', isImage: true },
    { id: 'p8', name: 'Hoho (3)', price: 500, category: 'mbogamboga', icon: 'pics/hoho1.jfif', isImage: true },
    { id: 'p9', name: 'Karoti (Fungu)', price: 1000, category: 'mbogamboga', icon: 'pics/karoti1.jpg', isImage: true },
    { id: 'p10', name: 'Mchicha (Fungu)', price: 500, category: 'mbogamboga', icon: 'pics/mchicha.jpg', isImage: true },
    { id: 'p31', name: 'Ndimu (5)', price: 500, category: 'mbogamboga', icon: 'pics/ndimu.jpg', isImage: true },
    { id: 'p32', name: 'Limau (5)', price: 500, category: 'mbogamboga', icon: 'pics/limau.jfif', isImage: true },
    { id: 'p33', name: 'Viazi Vitamu (Kg 1)', price: 1500, category: 'mbogamboga', icon: 'pics/viazi vitamu.jfif', isImage: true },
    { id: 'p34', name: 'Viazi Vikuu (Kg 1)', price: 2000, category: 'mbogamboga', icon: 'pics/viazi vikuu.jpg', isImage: true },
    { id: 'p35', name: 'Viazi Mviringo (Kg 1)', price: 1500, category: 'mbogamboga', icon: 'pics/viazi mviringo.jfif', isImage: true },
    { id: 'p36', name: 'Kabichi (Nusu)', price: 1000, category: 'mbogamboga', icon: 'pics/kabichi.jpg', isImage: true },
    { id: 'p37', name: 'Pilipili Kali (Fungu)', price: 500, category: 'mbogamboga', icon: 'pics/pilipili.jfif', isImage: true },
    { id: 'p59', name: 'Bilinganya (Fungu)', price: 1000, category: 'mbogamboga', icon: 'pics/bilinganya.jfif', isImage: true },
    { id: 'p60', name: 'Maboga (Nusu)', price: 1500, category: 'mbogamboga', icon: 'pics/maboga.jpg', isImage: true },
    { id: 'p61', name: 'Matango (3)', price: 1000, category: 'mbogamboga', icon: 'pics/matango.jpg', isImage: true },
    { id: 'p62', name: 'Matembele (Fungu)', price: 500, category: 'mbogamboga', icon: 'pics/matembele.webp', isImage: true },
    { id: 'p63', name: 'Mihogo (Kg 1)', price: 1500, category: 'mbogamboga', icon: 'pics/mihogo.jfif', isImage: true },
    { id: 'p64', name: 'Miwaa (Fungu)', price: 1000, category: 'mbogamboga', icon: 'pics/miwaa.jpeg', isImage: true },
    { id: 'p65', name: 'Nyanya Chungu (Fungu)', price: 500, category: 'mbogamboga', icon: 'pics/nyanya chungu.jpg', isImage: true },
    { id: 'p66', name: 'Spinachi (Fungu)', price: 500, category: 'mbogamboga', icon: 'pics/spinachi.jfif', isImage: true },
    { id: 'p67', name: 'Viazi Lishe (Kg 1)', price: 2000, category: 'mbogamboga', icon: 'pics/viazi lishe.jpeg', isImage: true },

    // --- MAFUTA ---
    { id: 'p38', name: 'Mafuta ya Alizeti (Lita 1)', price: 4500, category: 'mafuta', icon: 'pics/mafuta ya alizeti.webp', isImage: true },
    { id: 'p39', name: 'Mafuta ya Korie (Lita 1)', price: 5000, category: 'mafuta', icon: 'pics/mafuta ya korie.jfif', isImage: true },

    // --- NYAMA ---
    { id: 'p11', name: 'Kuku Mzima (Kisasa)', price: 8000, category: 'nyama', icon: 'images/kuku_mzima1.png', isImage: true },
    { id: 'p12', name: 'Kuku wa Kienyeji', price: 18000, category: 'nyama', icon: 'pics/kuku w kienyeji1.jfif', isImage: true },
    { id: 'p13', name: 'Soseji (Pakiti Kubwa)', price: 7000, category: 'nyama', icon: 'pics/sausages-with-different-flavors.avif', isImage: true },

    // --- SAMAKI ---
    { id: 'p14', name: 'Samaki Sato (Kilo 1)', price: 10000, category: 'samaki', icon: 'pics/samaki sato.jpeg', isImage: true },
    { id: 'p15', name: 'Sangara (Kilo 1)', price: 8000, category: 'samaki', icon: 'pics/samaki sangara.jpg', isImage: true },
    { id: 'p28', name: 'Samaki Changu (Kilo 1)', price: 7000, category: 'samaki', icon: 'pics/samaki changu.jfif', isImage: true },
    { id: 'p29', name: 'Samaki Taa (Kilo 1)', price: 6000, category: 'samaki', icon: 'pics/samaki taa.jfif', isImage: true },
    { id: 'p30', name: 'Samaki Kibua (Kilo 1)', price: 5000, category: 'samaki', icon: 'pics/samaki kibua.jfif', isImage: true },

    // --- NAFAKA ---
    { id: 'p16', name: 'Mchele Basmati (Kg 1)', price: 3500, category: 'nafaka', icon: 'pics/mchele basmati.jfif', isImage: true },
    { id: 'p17', name: 'Mchele wa Mbeya (Kg 1)', price: 2500, category: 'nafaka', icon: 'pics/mchele wa mbeya.jfif', isImage: true },
    { id: 'p18', name: 'Unga wa Sembe (Kg 1)', price: 2000, category: 'nafaka', icon: 'pics/unga wa sembe.jpg', isImage: true },
    { id: 'p19', name: 'Maharage (Kg 1)', price: 3000, category: 'nafaka', icon: 'pics/maharage.jfif', isImage: true },
    { id: 'p20', name: 'Unga wa Ngano (Kg 1)', price: 2500, category: 'nafaka', icon: 'pics/unga wa ngao.jpeg', isImage: true },
    { id: 'p21', name: 'Dengu (Kg 1)', price: 3500, category: 'nafaka', icon: 'pics/dengu.jfif', isImage: true },
    { id: 'p22', name: 'Karanga (Kg 1)', price: 4000, category: 'nafaka', icon: 'pics/karanga.jfif', isImage: true },
    { id: 'p23', name: 'Choroko (Kg 1)', price: 2500, category: 'nafaka', icon: 'pics/choroko.jfif', isImage: true },
    { id: 'p24', name: 'Kunde (Kg 1)', price: 2000, category: 'nafaka', icon: 'pics/kunde.jpg', isImage: true },
    { id: 'p25', name: 'Ulezi (Kg 1)', price: 2500, category: 'nafaka', icon: 'pics/ulezi.jpg', isImage: true },
    { id: 'p26', name: 'Mtama (Kg 1)', price: 2000, category: 'nafaka', icon: 'pics/mtama.jfif', isImage: true },
    { id: 'p27', name: 'Korosho (Kg 1)', price: 15000, category: 'nafaka', icon: 'pics/korosho.jfif', isImage: true },
    { id: 'p68', name: 'Njugu Mawe (Kg 1)', price: 3500, category: 'nafaka', icon: 'pics/njugu mawe.webp', isImage: true },
    { id: 'p69', name: 'Mbaazi (Kg 1)', price: 2500, category: 'nafaka', icon: 'pics/mbaazi.jfif', isImage: true },
    { id: 'p70', name: 'Uwele (Kg 1)', price: 2000, category: 'nafaka', icon: 'pics/uwele.jfif', isImage: true }
];

// API Routes
// 1. Get all products (with auto-seed if database is empty)
app.get('/api/products', async (req, res) => {
    try {
        let products = await Product.find();
        if (products.length === 0) {
            console.log('[AUTO-SEED] Seeding initial products into database...');
            products = await Product.insertMany(initialProducts);
        }
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1b. Get all pre-made packages
const initialPackages = [
    {
        id: 'pkg-1',
        title: 'Starter Pack',
        price: 55000,
        icon: 'images/namba1.png',
        isImage: true,
        features: [
            'Mchele Kg 5',
            'Unga wa Sembe Kg 5',
            'Mafuta Lita 3',
            'Sukari Kg 2',
            'Maharage Kg 2',
            'Vitunguu Kg 1',
            'Nyanya Kg 2',
            '<i>Motto: Mahitaji muhimu kwa wiki nzima.</i>'
        ]
    },
    {
        id: 'pkg-2',
        title: 'Family Essentials Pack',
        price: 110000,
        icon: 'images/namba2.png',
        isImage: true,
        features: [
            'Mchele Kg 10',
            'Unga wa Sembe Kg 10',
            'Mafuta Lita 5',
            'Sukari Kg 5',
            'Maharage Kg 5',
            'Vitunguu Kg 2',
            'Nyanya Kg 3',
            'Karoti Kg 2',
            '<i>Motto: Kila kitu muhimu kwa familia yako.</i>'
        ]
    },
    {
        id: 'pkg-3',
        title: 'Family Value Pack',
        price: 200000,
        icon: 'images/namba3.png',
        isImage: true,
        features: [
            'Mchele Kg 15',
            'Unga (Sembe + Dona) Kg 15',
            'Mafuta Lita 10',
            'Sukari Kg 5',
            'Maharage Kg 5',
            'Ngano Kg 5',
            'Nyama ya Ng\'ombe Kg 3',
            'Kuku Fresh 3',
            '<i>Motto: Thamani kubwa kwa matumizi makubwa.</i>'
        ]
    },
    {
        id: 'pkg-4',
        title: 'Premium Family Pack',
        price: 320000,
        icon: 'images/namba4.png',
        isImage: true,
        features: [
            'Mchele Kg 25',
            'Unga (Sembe + Dona) Kg 20',
            'Mafuta Lita 15',
            'Sukari Kg 10',
            'Maharage Kg 10',
            'Ngano Kg 10',
            'Nyama ya Ng\'ombe Kg 5',
            'Kuku Fresh 5',
            'Mayai Tray 2',
            '<i>Motto: Familia kubwa, mahitaji yote yamekamilika.</i>'
        ]
    },
    {
        id: 'pkg-5',
        title: 'Genge Royal Pack',
        price: 600000,
        icon: 'images/namba5.png',
        isImage: true,
        features: [
            'Mchele Kg 50',
            'Unga (Sembe + Dona) Kg 25',
            'Mafuta Lita 20',
            'Sukari Kg 15',
            'Maharage Kg 15',
            'Ngano Kg 15',
            'Nyama ya Ng\'ombe Kg 10',
            'Kuku Fresh 10',
            'Mayai Tray 5',
            'Chumvi Kg 2',
            '<i>Motto: Mwezi mzima bila wasiwasi wa sokoni.</i>'
        ]
    }
];

app.get('/api/packages', async (req, res) => {
    try {
        let packages = await Package.find();
        if (packages.length === 0) {
            // Auto-seed from initialPackages if DB empty
            packages = await Package.insertMany(initialPackages);
        }
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1c. Update a package
app.patch('/api/packages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const pkg = await Package.findOneAndUpdate({ id: id }, updates, { new: true });
        if (!pkg) return res.status(404).json({ message: 'Kifurushi hakijapatikana.' });
        res.json({ message: 'Kifurushi kimesasishwa.', package: pkg });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1d. Update product full details (Name, Category, Price)
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price } = req.body;
        const product = await Product.findOneAndUpdate(
            { id: id },
            { name, category, price: Number(price) },
            { new: true }
        );
        if (!product) return res.status(404).json({ message: 'Bidhaa haijapatikana.' });
        res.json({ message: 'Taarifa za bidhaa zimesasishwa.', product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1d-2. Update product price
app.patch('/api/products/:id/price', async (req, res) => {
    try {
        const { id } = req.params;
        const { price } = req.body;
        const product = await Product.findOneAndUpdate({ id: id }, { price: Number(price) }, { new: true });
        if (!product) return res.status(404).json({ message: 'Bidhaa haijapatikana.' });
        res.json({ message: 'Bei imebadilishwa.', product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 1e. Delete a product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Product.findOneAndDelete({ id: id });
        if (!result) return res.status(404).json({ message: 'Bidhaa haijapatikana.' });
        res.json({ message: 'Bidhaa imefutwa.' });
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

        const iconPath = 'pics/' + req.file.filename;

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

// 6. Get all paid orders (For Admin Panel)
app.get('/api/orders', async (req, res) => {
    try {
        // Return only orders where paymentStatus is 'paid'
        const orders = await Order.find({ paymentStatus: 'paid' }).sort({ _id: -1 });
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

// 9. Trigger Manual STK Push Request (HarakaPay Integration)
app.post('/api/orders/:id/stk-push', async (req, res) => {
    try {
        const { id } = req.params;
        const { phone, provider } = req.body;

        console.log(`[STK PUSH] Triggering STK push for order ${id} to ${phone}`);

        const order = await Order.findOne({ id: id });
        if (!order) {
            return res.status(404).json({ message: 'Oda haijapatikana.' });
        }

        let rawPhone = (phone || order.customer.phone || '').trim().replace(/[\s\-\+]/g, '');
        let targetPhone = rawPhone;
        if (targetPhone.startsWith('0')) {
            targetPhone = '255' + targetPhone.slice(1);
        } else if (!targetPhone.startsWith('255') && targetPhone.length === 9) {
            targetPhone = '255' + targetPhone;
        }

        const selectedProvider = provider || 'VodaCom M-Pesa';

        // Record STK push attempt
        order.lastStkPush = {
            phone: targetPhone,
            provider: selectedProvider,
            timestamp: new Date()
        };
        await order.save();

        const apiKey = process.env.HARAKAPAY_API_KEY;
        const baseUrl = process.env.HARAKAPAY_BASE_URL || 'https://harakapay.net';

        if (!apiKey) {
            console.log('[HARAKAPAY] API Key haijapatikana kwenye .env');
            return res.json({
                success: true,
                message: `Ombi la PIN limetumwa kwenye namba ${targetPhone}. Angalia simu yako.`,
                orderId: id,
                phone: targetPhone,
                provider: selectedProvider,
                mode: 'simulation'
            });
        }

        // ─── Tuma ombi kwa HarakaPay API (With 8s Timeout) ───────────────
        console.log(`[HARAKAPAY] Inatuma USSD push kwa ${targetPhone} kiasi TZS ${order.total}...`);

        const callbackUrl = `${req.protocol}://${req.get('host')}/api/harakapay/webhook`;

        const params = new URLSearchParams();
        params.append('phone', targetPhone);
        params.append('amount', order.total);
        params.append('description', `Malipo ya Oda ${order.id} - GENGE Delivery`);
        params.append('webhook_url', callbackUrl);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        let harakaText = '';
        let harakaResponse;

        try {
            harakaResponse = await fetch(`${baseUrl}/api/v1/collect`, {
                method: 'POST',
                headers: {
                    'X-API-Key': apiKey,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            harakaText = await harakaResponse.text();
            console.log('[HARAKAPAY RAW RESPONSE]:', harakaText);
        } catch (fetchErr) {
            clearTimeout(timeoutId);
            if (fetchErr.name === 'AbortError') {
                console.error('[HARAKAPAY TIMEOUT] Ombi limechelewa zaidi ya sekunde 8');
                return res.status(504).json({
                    success: false,
                    message: 'Mtandao wa HarakaPay unachukua muda mrefu kujibu. Angalia simu yako au tumia Lipa Namba (USSD).'
                });
            }
            throw fetchErr;
        }

        let harakaData;
        try {
            harakaData = JSON.parse(harakaText);
        } catch (jsonErr) {
            console.error('[HARAKAPAY JSON PARSE ERROR]:', jsonErr);
            return res.status(400).json({
                success: false,
                message: 'Jibu kutoka HarakaPay si la kueleweka. Jaribu tena baadaye.',
                raw: harakaText
            });
        }

        if (harakaData.success) {
            // Hifadhi HarakaPay Order ID kwenye oda yetu
            order.lastStkPush.harakaOrderId = harakaData.order_id;
            await order.save();

            return res.json({
                success: true,
                message: `✅ Ombi la PIN (STK Push) limetumwa kikamilifu kwenye namba ${targetPhone}. Angalia simu yako kuweka PIN.`,
                orderId: id,
                phone: targetPhone,
                provider: selectedProvider,
                harakaOrderId: harakaData.order_id,
                amount: harakaData.amount,
                netAmount: harakaData.net_amount
            });
        } else {
            console.error('[HARAKAPAY] Imefeli:', harakaData);
            return res.status(400).json({
                success: false,
                message: harakaData.error || harakaData.message || 'HarakaPay haikuweza kutuma ombi la PIN.',
            });
        }

    } catch (err) {
        console.error('[STK PUSH] Error:', err);
        res.status(500).json({ success: false, message: 'Kosa wakati wa kutuma STK Push.', error: err.message });
    }
});

// 10. HarakaPay Webhook — Inapokea matokeo ya malipo kutoka HarakaPay
app.post('/api/harakapay/webhook', async (req, res) => {
    try {
        console.log('[HARAKAPAY WEBHOOK RECEIVED]:', req.body);

        const { order_id, status, amount, net_amount, fee_amount } = req.body;

        // Tafuta oda inayohusiana na harakaOrderId hii
        const order = await Order.findOne({ 'lastStkPush.harakaOrderId': order_id });

        if (order) {
            if (status === 'completed') {
                order.paymentStatus = 'paid';
                order.status = 'confirmed';
                order.lastStkPush.completedAt = new Date();
                order.lastStkPush.amountPaid = net_amount;
                await order.save();
                console.log(`[HARAKAPAY] ✅ Oda ${order.id} IMELIPWA! Kiasi: TZS ${net_amount} (ada: TZS ${fee_amount})`);
            } else if (status === 'failed') {
                console.log(`[HARAKAPAY] ❌ Oda ${order.id} malipo YAMEFELI.`);
            }
        } else {
            console.log(`[HARAKAPAY] Oda yenye harakaOrderId=${order_id} haijapatikana.`);
        }

        // HarakaPay inahitaji jibu la 200 OK
        res.status(200).json({ received: true });

    } catch (err) {
        console.error('[HARAKAPAY WEBHOOK ERROR]:', err);
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
