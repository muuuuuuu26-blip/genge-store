require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    try {
        const orders = await Order.find().sort({ _id: -1 }).limit(5);
        console.log(JSON.stringify(orders, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
    mongoose.disconnect();
});
