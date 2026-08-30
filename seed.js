const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const customProducts = [
    // --- MATUNDA ---
    { id: 'p1', name: 'Ndizi Mbivu (Kichane)', price: 1500, category: 'matunda', icon: 'pics/banana.jpg', isImage: true },
    { id: 'p2', name: 'Machungwa (5)', price: 1000, category: 'matunda', icon: 'pics/machungwa.jfif', isImage: true },
    { id: 'p3', name: 'Tufaha/Apple (1)', price: 700, category: 'matunda', icon: 'pics/aple.avif', isImage: true },
    { id: 'p4', name: 'Parachichi (1)', price: 1000, category: 'matunda', icon: 'pics/parachichi.jfif', isImage: true },
    { id: 'p5', name: 'Tikiti Maji (Zima)', price: 4000, category: 'matunda', icon: 'pics/tikiti.webp', isImage: true },
    { id: 'p40', name: 'Chenza (5)', price: 1000, category: 'matunda', icon: 'pics/chenza.webp', isImage: true },
    { id: 'p41', name: 'Embe Dodo (5)', price: 1500, category: 'matunda', icon: 'pics/embe dodo.jpg', isImage: true },
    { id: 'p42', name: 'Embe Tanga (5)', price: 2000, category: 'matunda', icon: 'pics/embe tanga.jfif', isImage: true },
    { id: 'p44', name: 'Fenesi (Kilo 1)', price: 2000, category: 'matunda', icon: 'pics/fenesi.jfif', isImage: true },
    { id: 'p45', name: 'Mananasi (1)', price: 1500, category: 'matunda', icon: 'pics/mananasi.jfif', isImage: true },
    { id: 'p46', name: 'Mapapai (1)', price: 2000, category: 'matunda', icon: 'pics/mapapai.jpg', isImage: true },
    { id: 'p47', name: 'Mapera (Fungu)', price: 1000, category: 'matunda', icon: 'pics/mapera.jpg', isImage: true },
    { id: 'p48', name: 'Nazi (1)', price: 500, category: 'matunda', icon: 'pics/coconut.webp', isImage: true },
    { id: 'p49', name: 'Passion Fruit (5)', price: 1000, category: 'matunda', icon: 'pics/passion.jfif', isImage: true },
    { id: 'p50', name: 'Peasi (3)', price: 1500, category: 'matunda', icon: 'pics/peasi.jfif', isImage: true },
    { id: 'p51', name: 'Stafeli (1)', price: 3000, category: 'matunda', icon: 'pics/stafeli.jpg', isImage: true },
    { id: 'p52', name: 'Strawberries (Fungu)', price: 3000, category: 'matunda', icon: 'pics/strawberries.jfif', isImage: true },
    { id: 'p53', name: 'Tende (Fungu)', price: 2000, category: 'matunda', icon: 'pics/Tende.jfif', isImage: true },
    { id: 'p54', name: 'Ubuyu (Fungu)', price: 500, category: 'matunda', icon: 'pics/ubuyu.jpg', isImage: true },
    { id: 'p55', name: 'Ukwaju (Fungu)', price: 500, category: 'matunda', icon: 'pics/ukwaju.jfif', isImage: true },
    { id: 'p56', name: 'Zabibu (Fungu)', price: 2500, category: 'matunda', icon: 'pics/zabibu.jfif', isImage: true },
    { id: 'p57', name: 'Zaituni (Fungu)', price: 2000, category: 'matunda', icon: 'pics/zaituni.jfif', isImage: true },
    { id: 'p58', name: 'Cherry (Fungu)', price: 3000, category: 'matunda', icon: 'pics/cherry.jpg', isImage: true },

    // --- MBOGAMBOGA ---
    { id: 'p6', name: 'Nyanya (Fungu)', price: 1000, category: 'mbogamboga', icon: 'pics/nyanya.jpg', isImage: true },
    { id: 'p7', name: 'Vitunguu Maji (Fungu)', price: 1000, category: 'mbogamboga', icon: 'pics/vitungu maji.jfif', isImage: true },
    { id: 'p7b', name: 'Vitunguu Swaumu (Fungu)', price: 1500, category: 'mbogamboga', icon: 'pics/vitungu swaumu.jfif', isImage: true },
    { id: 'p8', name: 'Hoho (3)', price: 500, category: 'mbogamboga', icon: 'pics/hoho1.jfif', isImage: true },
    { id: 'p9', name: 'Karoti (Fungu)', price: 1000, category: 'mbogamboga', icon: 'pics/karoti1.jpg', isImage: true },
    { id: 'p10', name: 'Mchicha (Fungu)', price: 500, category: 'mbogamboga', icon: 'pics/mchicha.jpg', isImage: true },
    { id: 'p31', name: 'Ndimu (5)', price: 500, category: 'mbogamboga', icon: 'pics/ndimu.jpg', isImage: true },
    { id: 'p32', name: 'Limau (5)', price: 500, category: 'mbogamboga', icon: 'pics/limau.jfif', isImage: true },
    { id: 'p33', name: 'Viazi Vitamu (Kg 1)', price: 1500, category: 'mbogamboga', icon: 'pics/viazi vitamu.jfif', isImage: true },
    { id: 'p34', name: 'Viazi Vikuu (Kg 1)', price: 2000, category: 'mbogamboga', icon: 'pics/viazi vikuu.jpg', isImage: true },
    { id: 'p35', name: 'Viazi Mviringo (Kg 1)', price: 1500, category: 'mbogamboga', icon: 'pics/viazi mviringo.jfif', isImage: true },
    { id: 'p36', name: 'Kabichi (Nusu)', price: 1000, category: 'mbogamboga', icon: 'pics/kabichi.jpg', isImage: true },
    { id: 'p37', name: 'Pilipili Kali (Fungu)', price: 500, category: 'mbogamboga', icon: 'pics/pilipili.jfif', isImage: true },
    { id: 'p59', name: 'Bilinganya (Fungu)', price: 1000, category: 'mbogamboga', icon: 'pics/bilinganya.jfif', isImage: true },
    { id: 'p60', name: 'Maboga (Nusu)', price: 1500, category: 'mbogamboga', icon: 'pics/maboga.jpg', isImage: true },
    { id: 'p61', name: 'Matango (3)', price: 1000, category: 'mbogamboga', icon: 'pics/matango.jpg', isImage: true },
    { id: 'p62', name: 'Matembele (Fungu)', price: 500, category: 'mbogamboga', icon: 'pics/matembele.webp', isImage: true },
    { id: 'p63', name: 'Mihogo (Kg 1)', price: 1500, category: 'mbogamboga', icon: 'pics/mihogo.jfif', isImage: true },
    { id: 'p64', name: 'Miwaa (Fungu)', price: 1000, category: 'mbogamboga', icon: 'pics/miwaa.jpeg', isImage: true },
    { id: 'p65', name: 'Nyanya Chungu (Fungu)', price: 500, category: 'mbogamboga', icon: 'pics/nyanya chungu.jpg', isImage: true },
    { id: 'p66', name: 'Spinachi (Fungu)', price: 500, category: 'mbogamboga', icon: 'pics/spinachi.jfif', isImage: true },
    { id: 'p67', name: 'Viazi Lishe (Kg 1)', price: 2000, category: 'mbogamboga', icon: 'pics/viazi lishe.jpeg', isImage: true },

    // --- MAFUTA ---
    { id: 'p38', name: 'Mafuta ya Alizeti (Lita 1)', price: 4500, category: 'mafuta', icon: 'pics/mafuta ya alizeti.webp', isImage: true },
    { id: 'p39', name: 'Mafuta ya Korie (Lita 1)', price: 5000, category: 'mafuta', icon: 'pics/mafuta ya korie.jfif', isImage: true },

    // --- NYAMA ---
    { id: 'p11', name: 'Kuku Mzima (Kisasa)', price: 8000, category: 'nyama', icon: 'images/kuku_mzima1.png', isImage: true },
    { id: 'p12', name: 'Kuku wa Kienyeji', price: 18000, category: 'nyama', icon: 'pics/kuku w kienyeji1.jfif', isImage: true },
    { id: 'p13', name: 'Soseji (Pakiti Kubwa)', price: 7000, category: 'nyama', icon: 'pics/sausages-with-different-flavors.avif', isImage: true },

    // --- SAMAKI ---
    { id: 'p14', name: 'Samaki Sato (Kilo 1)', price: 10000, category: 'samaki', icon: 'pics/samaki sato.jpeg', isImage: true },
    { id: 'p15', name: 'Sangara (Kilo 1)', price: 8000, category: 'samaki', icon: 'pics/samaki sangara.jpg', isImage: true },
    { id: 'p28', name: 'Samaki Changu (Kilo 1)', price: 7000, category: 'samaki', icon: 'pics/samaki changu.jfif', isImage: true },
    { id: 'p29', name: 'Samaki Taa (Kilo 1)', price: 6000, category: 'samaki', icon: 'pics/samaki taa.jfif', isImage: true },
    { id: 'p30', name: 'Samaki Kibua (Kilo 1)', price: 5000, category: 'samaki', icon: 'pics/samaki kibua.jfif', isImage: true },

    // --- NAFAKA ---
    { id: 'p16', name: 'Mchele Basmati (Kg 1)', price: 3500, category: 'nafaka', icon: 'pics/mchele basmati.jfif', isImage: true },
    { id: 'p17', name: 'Mchele wa Mbeya (Kg 1)', price: 2500, category: 'nafaka', icon: 'pics/mchele wa mbeya.jfif', isImage: true },
    { id: 'p18', name: 'Unga wa Sembe (Kg 1)', price: 2000, category: 'nafaka', icon: 'pics/unga wa sembe.jpg', isImage: true },
    { id: 'p19', name: 'Maharage (Kg 1)', price: 3000, category: 'nafaka', icon: 'pics/maharage.jfif', isImage: true },
    { id: 'p20', name: 'Unga wa Ngano (Kg 1)', price: 2500, category: 'nafaka', icon: 'pics/unga wa ngao.jpeg', isImage: true },
    { id: 'p21', name: 'Dengu (Kg 1)', price: 3500, category: 'nafaka', icon: 'pics/dengu.jfif', isImage: true },
    { id: 'p22', name: 'Karanga (Kg 1)', price: 4000, category: 'nafaka', icon: 'pics/karanga.jfif', isImage: true },
    { id: 'p23', name: 'Choroko (Kg 1)', price: 2500, category: 'nafaka', icon: 'pics/choroko.jfif', isImage: true },
    { id: 'p24', name: 'Kunde (Kg 1)', price: 2000, category: 'nafaka', icon: 'pics/kunde.jpg', isImage: true },
    { id: 'p25', name: 'Ulezi (Kg 1)', price: 2500, category: 'nafaka', icon: 'pics/ulezi.jpg', isImage: true },
    { id: 'p26', name: 'Mtama (Kg 1)', price: 2000, category: 'nafaka', icon: 'pics/mtama.jfif', isImage: true },
    { id: 'p27', name: 'Korosho (Kg 1)', price: 15000, category: 'nafaka', icon: 'pics/korosho.jfif', isImage: true },
    { id: 'p68', name: 'Njugu Mawe (Kg 1)', price: 3500, category: 'nafaka', icon: 'pics/njugu mawe.webp', isImage: true },
    { id: 'p69', name: 'Mbaazi (Kg 1)', price: 2500, category: 'nafaka', icon: 'pics/mbaazi.jfif', isImage: true },
    { id: 'p70', name: 'Uwele (Kg 1)', price: 2000, category: 'nafaka', icon: 'pics/uwele.jfif', isImage: true },
];

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log('Connected to MongoDB for Seeding');
    
    // Clear existing to avoid duplicates when re-seeding
    await Product.deleteMany({});
    
    await Product.insertMany(customProducts);
    console.log('Data seeded successfully!');
    mongoose.connection.close();
}).catch(err => {
    console.error('Error seeding data:', err);
});
