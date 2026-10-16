const mongoose = require('mongoose');

const paymentIntentSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    paymentPhone: { type: String, required: true },
    shopName: { type: String, required: true },
    packageName: { type: String, required: true },
    amount: { type: Number, required: true },
    consumedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('PaymentIntent', paymentIntentSchema);
