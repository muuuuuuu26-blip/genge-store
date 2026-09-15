const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'vendor'], default: 'customer' },
    
    // Vendor Specific Fields
    nidaOrTin: { type: String, default: '' },
    shopName: { type: String, default: '' },
    avatar: { type: String, default: 'pics/12.png' },
    bio: { type: String, default: 'Sisi ni wauzaji waaminifu katika Genge Mall.' },
    
    // Vendor Subscription Package
    package: {
        name: { type: String, default: 'Basic' },       // Basic, Silver, Gold
        price: { type: Number, default: 5000 },          // 5000, 10000, 15000
        maxProducts: { type: Number, default: 25 },      // 25, 45, 60
        status: { type: String, default: 'active' },     // active, expired
        durationDays: { type: Number, default: 30 },
        activatedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    },
    
    // Social Features
    followers: [{ type: String }], // Array of follower phone numbers
    following: [{ type: String }], // Array of vendor phone numbers customer follows
    
    // Account Status & Control (Super Admin)
    status: { type: String, enum: ['active', 'suspended', 'blocked'], default: 'active' },
    blockReason: { type: String, default: '' },
    
    createdAt: { type: Date, default: Date.now }
});

// Allow same phone to have multiple shops — uniqueness is per phone+shopName pair
userSchema.index({ phone: 1, shopName: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
