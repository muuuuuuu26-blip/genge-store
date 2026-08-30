require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('Connected');
    try {
        const newOrder = new Order({
            id: 'ORD-' + Date.now(),
            date: new Date().toLocaleString('sw-TZ'),
            customer: { 
                name: 'Test', 
                phone: '123', 
                location: 'Mwenge',
                gps: null
            },
            items: [{ title: 'Test Item', price: 1000 }],
            total: 1000,
            status: 'pending'
        });
        await newOrder.save();
        console.log('Order saved successfully');
    } catch (err) {
        console.error('Save failed:', err);
    }
    mongoose.disconnect();
}).catch(err => {
    console.error('Connection failed:', err);
});
