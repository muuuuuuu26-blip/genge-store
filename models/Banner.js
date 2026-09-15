const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    tag: { type: String, default: 'OFISI & OFA MAALUM' },
    badgeColor: { type: String, default: '#10b981' },
    image: { type: String, required: true },
    btnText: { type: String, default: 'Nunua Sasa' },
    link: { type: String, default: '#vifurushi' },
    discountText: { type: String, default: '' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Banner', bannerSchema);
