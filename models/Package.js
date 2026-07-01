const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    icon: { type: String, required: true },
    isImage: { type: Boolean, default: true },
    features: [{ type: String }]
});

module.exports = mongoose.model('Package', packageSchema);
