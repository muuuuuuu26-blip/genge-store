/**
 * migrate_images.js
 * Inapakia picha zote za bidhaa kutoka folda la pics/ kwenda Cloudinary
 * kisha inabadilisha links zote kwenye database.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const Product = require('./models/Product');

// Sanidi Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function migrateImages() {
    console.log('==============================================');
    console.log('  GENGE - Uhamishaji wa Picha kwenda Cloudinary');
    console.log('==============================================\n');

    // Unganisha na MongoDB
    console.log('📡 Inaunganisha na MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB imeunganishwa!\n');

    // Pata bidhaa zote
    const products = await Product.find({});
    console.log(`📦 Bidhaa zilizopatikana: ${products.length}\n`);

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (const product of products) {
        const iconPath = product.icon;

        // Kama URL tayari ipo (ina http), ruka
        if (iconPath.startsWith('http')) {
            console.log(`⏭️  [RUKA] ${product.name} - tayari ina URL ya mtandaoni`);
            skipped++;
            continue;
        }

        // Tengeneza njia kamili ya faili
        const fullPath = path.join(__dirname, iconPath);

        // Angalia kama faili lipo
        if (!fs.existsSync(fullPath)) {
            console.log(`❌ [KOSA] ${product.name} - faili halipatikani: ${iconPath}`);
            failed++;
            continue;
        }

        try {
            // Pakia picha kwenye Cloudinary
            process.stdout.write(`⬆️  [INAPAKIA] ${product.name}...`);
            
            const result = await cloudinary.uploader.upload(fullPath, {
                folder: 'genge_pics',
                use_filename: false,
                unique_filename: true,
            });

            // Badilisha URL kwenye database
            await Product.findByIdAndUpdate(product._id, {
                icon: result.secure_url,
                isImage: true
            });

            console.log(` ✅ IMEPAKIA!`);
            updated++;

        } catch (err) {
            console.log(` ❌ KOSA: ${err.message}`);
            failed++;
        }
    }

    console.log('\n==============================================');
    console.log(`  MATOKEO:`);
    console.log(`  ✅ Zimepakiwa: ${updated}`);
    console.log(`  ⏭️  Zilirukwa:  ${skipped}`);
    console.log(`  ❌ Zilishindwa: ${failed}`);
    console.log('==============================================\n');

    await mongoose.connection.close();
    console.log('🔒 MongoDB imefungwa. Kazi imekamilika!');
}

migrateImages().catch(err => {
    console.error('❌ Kosa kubwa:', err);
    process.exit(1);
});
