const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    icon: { type: String, required: true },
    isImage: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);
