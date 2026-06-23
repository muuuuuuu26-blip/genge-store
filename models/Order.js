const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    cartId: String,
    type: String,
    title: String,
    price: Number,
    details: String,
    quantity: Number
});

const orderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        location: { type: String, required: true },
        gps: {
            lat: String,
            lng: String
        }
    },
    items: [itemSchema],
    deliveryCharge: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentStatus: { type: String, default: 'pending' }, // pending, paid, failed
    status: { type: String, default: 'pending' } // pending, accepted, rejected
});

module.exports = mongoose.model('Order', orderSchema);
