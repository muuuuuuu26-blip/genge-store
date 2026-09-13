const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    priceUnit: { type: String, default: 'Tsh' },
    category: { type: String, required: true },
    dept: { type: String, default: 'all' },
    subType: { type: String, default: '' },
    icon: { type: String, required: true },
    isImage: { type: Boolean, default: true },
    desc: { type: String, default: '' },
    location: { type: String, default: 'Tanzania' },
    specs: [{ type: String }],
    
    // Vendor Linkage
    vendorPhone: { type: String, default: '' },
    vendorName: { type: String, default: 'Genge Direct' },
    vendorShopName: { type: String, default: 'Genge Official' },
    vendorAvatar: { type: String, default: 'pics/12.png' },
    vendorNidaOrTin: { type: String, default: '' },
    isVendorActive: { type: Boolean, default: true },
    
    // Social Likes
    likes: [{ type: String }], // Array of user phone numbers who liked this product
    likeCount: { type: Number, default: 0 },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
