const mongoose = require('mongoose');
const Package = require('./models/Package');
require('dotenv').config();

const preMadePackages = [
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
            'Motto: Mahitaji muhimu kwa wiki nzima.'
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
            'Motto: Kila kitu muhimu kwa familia yako.'
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
            "Nyama ya Ng'ombe Kg 3",
            'Kuku Fresh 3',
            'Motto: Thamani kubwa kwa matumizi makubwa.'
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
            "Nyama ya Ng'ombe Kg 5",
            'Kuku Fresh 5',
            'Mayai Tray 2',
            'Motto: Familia kubwa, mahitaji yote yamekamilika.'
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
            "Nyama ya Ng'ombe Kg 10",
            'Kuku Fresh 10',
            'Mayai Tray 5',
            'Chumvi Kg 2',
            'Motto: Mwezi mzima bila wasiwasi wa sokoni.'
        ]
    }
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Clear existing packages
        await Package.deleteMany({});
        console.log('Cleared existing packages');

        // Insert new packages
        await Package.insertMany(preMadePackages);
        console.log('Successfully seeded packages!');
    } catch (err) {
        console.error('Error seeding packages:', err);
    } finally {
        mongoose.disconnect();
    }
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
