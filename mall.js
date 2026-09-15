// ==========================================================================
// GENGE MALL — JAVASCRIPT LOGIC & PRODUCT CATALOG
// ==========================================================================

const MALL_WHATSAPP_PHONE = '255799689961';
const MALL_CALL_PHONE = '+255692970687';
// Backend URL: local dev = localhost:3000, live Render = same origin (relative path)
const BACKEND_URL = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

// Departments Data
const mallDepartments = [
    { id: 'all',            name: 'Zote',                   icon: 'sparkles-outline',   emoji: '🛍️' },
    { id: 'nyumba',         name: 'Nyumba & Makazi',        icon: 'home-outline',       emoji: '🏠' },
    { id: 'magari',         name: 'Magari & Vyombo',        icon: 'car-sport-outline',  emoji: '🚗' },
    { id: 'mitindo',        name: 'Mitindo & Nguo',         icon: 'shirt-outline',      emoji: '👗' },
    { id: 'urembo',         name: 'Urembo & Mawigi',        icon: 'sparkles-outline',   emoji: '💄' },
    { id: 'viatu',          name: 'Viatu & Raba',           icon: 'footsteps-outline',  emoji: '👟' },
    { id: 'manukato',       name: 'Manukato & Perfume',     icon: 'flask-outline',      emoji: '🌸' },
    { id: 'simu_umeme',     name: 'Simu & Umeme',           icon: 'phone-portrait-outline', emoji: '📱' },
    { id: 'ujenzi',         name: 'Vifaa vya Ujenzi',       icon: 'construct-outline',  emoji: '🏗️' },
    { id: 'usafi_nyumbani', name: 'Vifaa vya Nyumba & Usafi', icon: 'sparkles-outline', emoji: '🛋️' }
];

// Comprehensive Mall Catalog with Reliable Optimized Visuals
const mallProducts = [
    // ── 1. NYUMBA & MAKAZI ─────────────────────────────────────
    {
        id: 'ny-01',
        dept: 'nyumba',
        subType: 'kupangisha',
        title: 'Chumba & Choo (Master) Sinza',
        price: 180000,
        priceUnit: '/ Mwezi',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
        location: 'Sinza Kijiweni, Dar es Salaam',
        badge: 'INAPANGISHWA',
        badgeClass: 'badge-rent',
        desc: 'Chumba kikubwa safi chenye choo cha ndani, vigae (tiles), feni, maji ya Dawasco 24/7 na luku ya pekee. Gari linafika hadi mlangoni.',
        specs: ['Maji 24/7', 'Luku Yako', 'Tiles & Gypsum', 'Fensi'],
        actionType: 'inquire'
    },
    {
        id: 'ny-02',
        dept: 'nyumba',
        subType: 'kupangisha',
        title: 'Apartment ya Kisasa (Vyumba 2) Mbezi Beach',
        price: 450000,
        priceUnit: '/ Mwezi',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
        location: 'Mbezi Beach, Dar es Salaam',
        badge: 'HOT DEAL',
        badgeClass: 'badge-hot',
        desc: 'Apartment mpya kabisa: Master 1, chumba cha pili, sebule kubwa, jiko la kisasa lenye kabati, choo cha wageni, paving blocks na geti la kielektroniki.',
        specs: ['Vyumba 2', 'Sebule & Jiko', 'Paving Blocks', 'Maji Bure'],
        actionType: 'inquire'
    },
    {
        id: 'ny-03',
        dept: 'nyumba',
        subType: 'kuuzwa',
        title: 'Nyumba Nzima ya Kuishi Tegeta',
        price: 85000000,
        priceUnit: 'Jumla (Inauzwa)',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
        location: 'Tegeta Wazo, Dar es Salaam',
        badge: 'INAUZWA',
        badgeClass: 'badge-sale',
        desc: 'Nyumba ya kisasa yenye vyumba 3 (viwili master), sebule kubwa, dining, jiko na stoo. Kiwanja sqm 600 chenye Hati Miliki halisi na fensi imara.',
        specs: ['Vyumba 3', 'Hati Miliki', 'Eneo sqm 600', 'Parking Magari 3'],
        actionType: 'inquire'
    },
    {
        id: 'ny-04',
        dept: 'nyumba',
        subType: 'kupangisha',
        title: 'Fremu ya Biashara Kijitonyama',
        price: 250000,
        priceUnit: '/ Mwezi',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        location: 'Kijitonyama Barabara Kuu',
        badge: 'BIASHARA',
        badgeClass: 'badge-rent',
        desc: 'Fremu ya kisasa yenye kioo cha mbele (glass front), taa nzuri, kipozeo (AC provision) na mzunguko mkubwa wa wateja.',
        specs: ['Barabara Kuu', 'Shutter & Kioo', 'Luku Binafsi'],
        actionType: 'inquire'
    },

    // ── 2. MAGARI & VYOMBO VYA MOTO ───────────────────────────
    {
        id: 'car-01',
        dept: 'magari',
        subType: 'used',
        title: 'Toyota Harrier New Model (2016)',
        price: 42000000,
        priceUnit: 'Tsh (Maongezi yapo)',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
        location: 'Dar es Salaam (Showroom)',
        badge: 'USED SAFI',
        badgeClass: 'badge-verified',
        desc: 'Gari lipo katika hali bora sana. YOM 2016, 2.0cc Petrol, Automatic, Leather seats, 360 camera, kadi halisi ya TRA ipo mkononi tayari kwa uhamisho.',
        specs: ['YOM 2016', 'Automatic', 'Mileage 74k km', 'Full Option'],
        actionType: 'car-inquire'
    },
    {
        id: 'car-02',
        dept: 'magari',
        subType: 'used',
        title: 'Toyota IST New Shape (1.5cc)',
        price: 18500000,
        priceUnit: 'Tsh (Bei Nzuri)',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
        location: 'Kinondoni, Dar es Salaam',
        badge: 'TOP SELLER',
        badgeClass: 'badge-rent',
        desc: 'Uchumi wa mafuta usio na mpinzani. Rangi ya fedha (Silver), kiyoyozi baridi sana, tairi zote mpya, gari halina tatizo lolote la kiufundi.',
        specs: ['1.5cc Petrol', 'AC Kali', 'Music System', 'Clean Interior'],
        actionType: 'car-inquire'
    },
    {
        id: 'car-03',
        dept: 'magari',
        subType: 'mpya',
        title: 'Pikipiki Boxer BM 150cc (Mpya)',
        price: 3200000,
        priceUnit: 'Tsh (Mpya 0km)',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
        location: 'Genge Store / Ilala',
        badge: 'MPYA 0KM',
        badgeClass: 'badge-sale',
        desc: 'Pikipiki mpya kutoka kiwandani yenye nguvu kubwa ya 150cc, inahimili mizigo na safari ndefu. Inakuja na kadi halisi, kofia ngumu (helmet) na koti la mvua.',
        specs: ['150cc Engine', '0 km', 'Warranty 1 Year', 'Spare Parts Bure'],
        actionType: 'car-inquire'
    },

    // ── 3. MITINDO & NGUO ──────────────────────────────────────
    {
        id: 'cl-01',
        dept: 'mitindo',
        subType: 'kike',
        title: 'Dera la Hariri la Kisasa (Silk Bubu Dress)',
        price: 35000,
        priceUnit: 'kwa moja',
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
        location: 'Mavazi ya Kike',
        badge: 'TRENDING',
        badgeClass: 'badge-hot',
        desc: 'Dera la kisasa lililoshonwa kwa hariri safi (pure silk). Linapendeza kwa mitoko, nyumbani na shughuli. Rangi na michoro ya kipekee, Free Size.',
        specs: ['100% Pure Silk', 'Free Size', 'Haliweki Makunyanzi', 'Rangi Zote'],
        actionType: 'cart'
    },
    {
        id: 'cl-02',
        dept: 'mitindo',
        subType: 'kiume',
        title: 'Shati la Kiume la Pamba (Casual Linen Shirt)',
        price: 28000,
        priceUnit: 'kwa moja',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
        location: 'Mavazi ya Kiume',
        badge: 'ORIGINAL',
        badgeClass: 'badge-verified',
        desc: 'Shati zuri la kitani/pamba laini linalopitisha hewa vizuri. Linalingana na suruali ya jeans au kadet, muundo wa mikono mirefu na mifupi.',
        specs: ['Pamba Laini', 'Size: M, L, XL, XXL', 'Rangi: Nyeupe, Khaki, Bluu'],
        actionType: 'cart'
    },
    {
        id: 'cl-03',
        dept: 'mitindo',
        subType: 'kike',
        title: 'Gauni la Mtoko la Kisasa (Party Evening Gown)',
        price: 55000,
        priceUnit: 'kwa moja',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
        location: 'Mavazi ya Kike',
        badge: 'ELEGANT',
        badgeClass: 'badge-rent',
        desc: 'Gauni la kuvutia sana lenye mshono wa kisasa. Linanyumbulika vizuri mwilini na kuleta muonekano wa heshima na anasa kwenye shughuli.',
        specs: ['Size S, M, L', 'Kitambaa Kizito', 'Rangi Nyeusi, Maroon & Emerald'],
        actionType: 'cart'
    },

    // ── 4. UREMBO & MAWIGI ─────────────────────────────────────
    {
        id: 'ur-01',
        dept: 'urembo',
        subType: 'wigs',
        title: 'Wigi la Human Hair Bone Straight (26 Inch)',
        price: 180000,
        priceUnit: 'Seti Kamili',
        image: 'https://images.unsplash.com/photo-1562887189-e5d078343de4?auto=format&fit=crop&w=600&q=80',
        location: 'Urembo wa Nywele',
        badge: '100% HUMAN HAIR',
        badgeClass: 'badge-verified',
        desc: 'Wigi asili la Kibrazili (100% Brazilian Human Hair). Laini, halifungani, linaweza kunyooshwa na pasi ya moto, HD Lace inayojichanganya vizuri na ngozi.',
        specs: ['26 Inch Urefu', 'HD Transparent Lace', '180% Density', 'Halimwagi Nywele'],
        actionType: 'cart'
    },
    {
        id: 'ur-02',
        dept: 'urembo',
        subType: 'eyelash',
        title: 'Seti ya Kope za Sumaku (3D Magnetic Eyelashes)',
        price: 25000,
        priceUnit: 'Seti ya Jozi 5',
        image: 'https://images.unsplash.com/photo-1583241800698-e8ab01c85b27?auto=format&fit=crop&w=600&q=80',
        location: 'Urembo wa Macho',
        badge: 'EASY TO WEAR',
        badgeClass: 'badge-hot',
        desc: 'Kope za kisasa zisizohitaji gundi chafu. Zinajishika kwa nguvu ya sumaku laini, unaweza kuzivaa na kuzivua kwa sekunde chache na kutumia mara nyingi.',
        specs: ['Jozi 5 Tofauti', 'Eyeliner ya Sumaku', 'Applicator Bure', 'Inadumu Masaa 24'],
        actionType: 'cart'
    },
    {
        id: 'ur-03',
        dept: 'urembo',
        subType: 'jewelry',
        title: 'Seti ya Hereni & Cheni ya Dhahabu Bandia (Gold Plated)',
        price: 35000,
        priceUnit: 'Seti Nzima',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        location: 'Mapambo & Hereni',
        badge: 'NON-TARNISH',
        badgeClass: 'badge-sale',
        desc: 'Mapambo ya kisasa yasiyopauka wala kubadilika rangi hata ukiosha na maji. Yanameta vizuri na kuleta muonekano wa hadhi ya juu.',
        specs: ['18K Gold Plated', 'Haipauki', 'Hypoallergenic (Haimalizi ngozi)'],
        actionType: 'cart'
    },

    // ── 5. VIATU & RABA ────────────────────────────────────────
    {
        id: 'vt-01',
        dept: 'viatu',
        subType: 'raba',
        title: 'Raba za Kijanja Air Cushion (Unisex Sneakers)',
        price: 48000,
        priceUnit: 'Jozi 1',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
        location: 'Viatu & Raba',
        badge: 'TOP TREND',
        badgeClass: 'badge-hot',
        desc: 'Raba kali za kijanja zenye soli laini ya hewa (air cushion) inayopunguza mshtuko miguuni. Zinafaa kwa mazoezi, mtoko na kuvaa kila siku.',
        specs: ['Size: 36 - 45', 'Soli ya Mpira', 'Rangi: Nyeusi, Nyeupe, Nyekundu'],
        actionType: 'cart'
    },
    {
        id: 'vt-02',
        dept: 'viatu',
        subType: 'kike',
        title: 'Viatu vya Kike vya Kisigino (Classic Block Heels)',
        price: 38000,
        priceUnit: 'Jozi 1',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
        location: 'Viatu vya Kike',
        badge: 'COMFORT HEELS',
        badgeClass: 'badge-rent',
        desc: 'Kisigino kifupi cha mraba (block heel) kisichochosha mguu. Kinafaa sana kwa ofisini, kanisani, misikitini na kwenye sherehe.',
        specs: ['Size 37 - 42', 'Urefu Inchi 2.5', 'Ngozi Laini ya Ndani'],
        actionType: 'cart'
    },
    {
        id: 'vt-03',
        dept: 'viatu',
        subType: 'kiume',
        title: 'Viatu vya Kiume vya Ngozi Halisi (Oxford Leather)',
        price: 65000,
        priceUnit: 'Jozi 1',
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80',
        location: 'Viatu vya Kiume',
        badge: 'PURE LEATHER',
        badgeClass: 'badge-verified',
        desc: 'Viatu vya heshima vya ofisi vilivyotengenezwa kwa ngozi halisi ya ng\'ombe. Mshono imara wa mikono unaodumu miaka mingi.',
        specs: ['100% Genuine Leather', 'Size 40 - 46', 'Rangi Nyeusi & Kahawia'],
        actionType: 'cart'
    },

    // ── 6. MANUKATO & PERFUME ──────────────────────────────────
    {
        id: 'pf-01',
        dept: 'manukato',
        subType: 'unisex',
        title: 'Khamrah Lattafa Eau De Parfum (100ml)',
        price: 75000,
        priceUnit: 'Chupa 100ml',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
        location: 'Manukato ya Kiarabu',
        badge: 'BEAST MODE 24H',
        badgeClass: 'badge-hot',
        desc: 'Perfume maarufu duniani yenye harufu nzito ya vanilla, mdalasini, amber na tonka bean. Inadumu zaidi ya masaa 24 kwenye nguo na ngozi.',
        specs: ['100ml EDP', 'Inadumu Masaa 24+', 'Unisex (Wote)', 'Original Seal'],
        actionType: 'cart'
    },
    {
        id: 'pf-02',
        dept: 'manukato',
        subType: 'kiume',
        title: 'Dior Sauvage Inspired Perfume (100ml)',
        price: 85000,
        priceUnit: 'Chupa 100ml',
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
        location: 'Manukato ya Kiume',
        badge: 'MEN BEST SELLER',
        badgeClass: 'badge-rent',
        desc: 'Harufu kali ya kiume yenye mchanganyiko wa bergamot, pilipili danga na mbao za asili. Inavutia na kuleta haiba ya nguvu na ushindi.',
        specs: ['100ml', 'Harufu ya Kiume', 'Kiwango Kikubwa cha Mafuta'],
        actionType: 'cart'
    },
    {
        id: 'pf-03',
        dept: 'manukato',
        subType: 'oud',
        title: 'Asili ya Udi & Bukhoor ya Kiarabu (Oud Set)',
        price: 35000,
        priceUnit: 'Seti Nzima',
        image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=80',
        location: 'Udi wa Nyumba & Nguo',
        badge: 'ARABIAN SCENT',
        badgeClass: 'badge-verified',
        desc: 'Vipande halisi vya udi wa asili na ubani wa Kiarabu kwa ajili ya kufukizia nguo, chumbani, sebuleni au gari. Harufu nzito ya baraka.',
        specs: ['Udi Halisi', 'Kopo Kubwa', 'Moshi Mzito wa Manukato'],
        actionType: 'cart'
    },

    // ── 7. SIMU & VIFAA VYA UMEME ──────────────────────────────
    {
        id: 'el-01',
        dept: 'simu_umeme',
        subType: 'simu',
        title: 'Samsung Galaxy A-Series 4G/5G (128GB/6GB RAM)',
        price: 450000,
        priceUnit: 'Pamoja na Box & Chaja',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        location: 'Simu & Elektroniki',
        badge: 'WARRANTY 1 YR',
        badgeClass: 'badge-verified',
        desc: 'Simu imara ya kisasa yenye betri kubwa ya 5000mAh inayodumu siku 2, camera kali ya 50MP, kioo kipana cha Super AMOLED, na spika safi.',
        specs: ['128GB Storage', '6GB RAM', 'Betri 5000mAh', 'Camera 50MP'],
        actionType: 'cart'
    },
    {
        id: 'el-02',
        dept: 'simu_umeme',
        subType: 'tv',
        title: 'Smart TV Nchi 43 Frameless 4K UHD',
        price: 550000,
        priceUnit: 'Mpya Boxed',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
        location: 'Vifaa vya Umeme',
        badge: 'SMART 4K',
        badgeClass: 'badge-rent',
        desc: 'TV ya kisasa isiyo na fremu (Frameless), ina mfumo wa Android, Netflix, YouTube, Wi-Fi, Bluetooth, na sauti ya Dolby Audio.',
        specs: ['Nchi 43', '4K UHD Resolution', 'Inbuilt Wi-Fi & Apps', 'HDMI & USB'],
        actionType: 'cart'
    },
    {
        id: 'el-03',
        dept: 'simu_umeme',
        subType: 'umeme',
        title: 'Friji la Kisasa Double Door Inverter (210L)',
        price: 720000,
        priceUnit: 'Mpya na Warranty',
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80',
        location: 'Vifaa vya Umeme',
        badge: 'LOW POWER CONSUMPTION',
        badgeClass: 'badge-verified',
        desc: 'Friji lisilotumia umeme mwingi (Inverter Technology), linaganda haraka na halipotezi ubaridi hata umeme ukikatika kwa masaa 12.',
        specs: ['210 Litres', 'A++ Energy Rating', 'Inverter Compressor', 'Milango 2'],
        actionType: 'cart'
    },

    // ── 8. VIFAA VYA UJENZI ────────────────────────────────────
    {
        id: 'uj-01',
        dept: 'ujenzi',
        subType: 'saruji',
        title: 'Saruji Dangote 42.5R (Mfuko 50kg)',
        price: 21500,
        priceUnit: 'kwa mfuko',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
        location: 'Vifaa vya Ujenzi (Mizigo)',
        badge: 'DARAJA LA 42.5R',
        badgeClass: 'badge-verified',
        desc: 'Saruji yenye nguvu ya juu kwa ajili ya kumwaga nguzo, msingi, lenta, na sakafu. Inashika haraka na kudumu miaka mingi.',
        specs: ['Mfuko wa 50kg', 'Daraja 42.5R Imara', 'Usafiri wa Lori Unapatikana'],
        actionType: 'cart'
    },
    {
        id: 'uj-02',
        dept: 'ujenzi',
        subType: 'rangi',
        title: 'Ndoo ya Rangi ya Weatherguard (Lita 20)',
        price: 85000,
        priceUnit: 'Ndoo ya Lita 20',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
        location: 'Rangi za Majengo',
        badge: 'WATERPROOF',
        badgeClass: 'badge-rent',
        desc: 'Rangi nzito inayozuia ukungu, maji ya mvua na mionzi ya jua kali. Inafaa kwa ukuta wa nje na ndani, inang\'aa na kusafishika kirahisi.',
        specs: ['Lita 20', 'Rangi Zote Zinachanganywa', 'Miaka 7 ya Kudumu'],
        actionType: 'cart'
    },
    {
        id: 'uj-03',
        dept: 'ujenzi',
        subType: 'bati',
        title: 'Bati za Mgongo Mpana (Gauge 28, Futi 10)',
        price: 32000,
        priceUnit: 'kwa bati',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        location: 'Vifaa vya Kuezeka',
        badge: 'GAUGE 28',
        badgeClass: 'badge-sale',
        desc: 'Bati imara zisizoshika kutu wala kupauka. Zinakuja katika rangi nzuri za kisasa kama Maroon, Blue, na Green zikiwa na nembo ya ubora.',
        specs: ['Gauge 28 Nzito', 'Urefu: Futi 10', 'Rangi: Maroon, Kijani, Bluu'],
        actionType: 'cart'
    },

    // ── 9. VIFAA VYA NYUMBA & USAFI ───────────────────────────
    {
        id: 'us-01',
        dept: 'usafi_nyumbani',
        subType: 'usafi',
        title: 'Omo Sabuni ya Unga ya Usafi Mkuu (Kilo 5)',
        price: 32000,
        priceUnit: 'Mfuko 5kg',
        image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?auto=format&fit=crop&w=600&q=80',
        location: 'Usafi wa Nyumbani',
        badge: 'STAIN REMOVER',
        badgeClass: 'badge-hot',
        desc: 'Sabuni maarufu ya kufulia nguo na kusafishia sakafu. Inatoa madoa magumu haraka bila kuharibu mikono yako na kuacha harufu nzuri.',
        specs: ['Kilo 5 Kubwa', 'Harufu Nzuri', 'Povu Nyingi'],
        actionType: 'cart'
    },
    {
        id: 'us-02',
        dept: 'usafi_nyumbani',
        subType: 'vyombo',
        title: 'Seti ya Vyombo vya Kupikia Granite Non-Stick (Pcs 6)',
        price: 135000,
        priceUnit: 'Seti ya Masufuria 6',
        image: 'https://images.unsplash.com/photo-1584990347449-3990b797b5d1?auto=format&fit=crop&w=600&q=80',
        location: 'Vifaa vya Jikoni',
        badge: 'NON-STICK',
        badgeClass: 'badge-verified',
        desc: 'Masufuria ya kisasa ya granite yasiyogandisha chakula hata ukitumia mafuta kidogo sana. Yanasafishika kwa wepesi na yanadumu muda mrefu.',
        specs: ['Pcs 6 Kamili', 'Vifuniko vya Kioo', 'Hayashiki Chini'],
        actionType: 'cart'
    },
    {
        id: 'us-03',
        dept: 'usafi_nyumbani',
        subType: 'usafi',
        title: 'Spin Mop 360 na Ndoo ya Kukamulia',
        price: 38000,
        priceUnit: 'Seti Kamili',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
        location: 'Usafi wa Sakafu',
        badge: 'EASY CLEAN',
        badgeClass: 'badge-rent',
        desc: 'Kifaa cha kisasa cha kusafishia sakafu chenye ndoo inayozunguka kukamua bila kugusa maji machafu kwa mikono. Sakafu inakauka mara moja.',
        specs: ['Mop 360 Spin', 'Ndoo ya Chuma Ndani', 'Vipuri 2 vya Taulo Bure'],
        actionType: 'cart'
    }
];

// App State & Constants
let currentDepartment = 'all';
let currentSubfilter = 'all';
let searchQuery = '';
let mallCart = [];

let currentUser = null;
let serverMallProducts = [];
let modalVendorPhone = null;

// Realistic Tanzanian Vendor Profiles by Category
const defaultVendorProfiles = {
    nyumba: {
        shopName: 'Kilimanjaro Prime Real Estate',
        ownerName: 'Mhandisi Juma Rashid',
        phone: '255799689961',
        nida: '19880512-11105-00001-23',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        bio: 'Wataalamu walioidhinishwa wa viwanja, nyumba na apartments za kisasa Dar es Salaam na Dodoma.',
        followersCount: '4.8k',
        location: 'Mikocheni B, Dar es Salaam'
    },
    magari: {
        shopName: 'Boma Motors Tanzania',
        ownerName: 'Salim Bakari',
        phone: '255712345678',
        nida: '19910408-22104-00002-14',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        bio: 'Magari used safi na zero mileage yaliyoagizwa kutoka Japan na Ulaya. Showroom Mwenge.',
        followersCount: '8.2k',
        location: 'Mwenge ITV, Dar es Salaam'
    },
    mitindo: {
        shopName: 'Zanzibar Chic Boutique',
        ownerName: 'Amina Hassan',
        phone: '255755123456',
        nida: '19940215-33102-00003-91',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        bio: 'Mitindo ya kijanja, magauni ya kisasa, suti na nguo za kipekee kutoka Uturuki na Dubai.',
        followersCount: '12.4k',
        location: 'Kariakoo & Sinza Mori'
    },
    urembo: {
        shopName: 'Neema Glamour Cosmetics',
        ownerName: 'Neema Mwangi',
        phone: '255767890123',
        nida: '19960719-44101-00004-77',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        bio: 'Vipodozi asilia vilivyothibitishwa na TBS na daktari wa ngozi. Glow safi bila kemikali.',
        followersCount: '6.5k',
        location: 'Mlimani City Mall, Dar'
    },
    viatu: {
        shopName: 'Kariakoo Sole Master',
        ownerName: 'Peter Shirima',
        phone: '255784567890',
        nida: '19891124-55106-00005-42',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        bio: 'Sneakers, viatu rasmi vya ofisi na sandals za ngozi asilia (pure leather) Kariakoo.',
        followersCount: '9.1k',
        location: 'Kariakoo Msimbazi, Dar'
    },
    manukato: {
        shopName: 'Oud & Arabian Scents Tz',
        ownerName: 'Khadija Nassor',
        phone: '255718901234',
        nida: '19930803-66103-00006-88',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        bio: 'Mafuta asilia ya Oud, Perfumes original na designer scents zinazokaa masaa 48+.',
        followersCount: '5.7k',
        location: 'Posta Mpya, Dar es Salaam'
    },
    simu_umeme: {
        shopName: 'Mlimani Tech Hub',
        ownerName: 'Baraka Msuya',
        phone: '255752112233',
        nida: '19900318-77109-00007-15',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        bio: 'Smartphones (iPhone & Samsung), Laptops, Smart TVs na vifaa vyote vyenye warranty ya miezi 12-24.',
        followersCount: '15.3k',
        location: 'Survey Mlimani, Dar es Salaam'
    },
    ujenzi: {
        shopName: 'Barafu Building & Hardware',
        ownerName: 'Geoffrey Mushi',
        phone: '255763998877',
        nida: '19850910-88108-00008-63',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        bio: 'Vifaa bora vya ujenzi: Nondo, Saruji, Gypsum, Rangi na mabomba. Usafiri bure Dar es Salaam.',
        followersCount: '3.9k',
        location: 'Buguruni Chama, Dar es Salaam'
    },
    usafi_nyumbani: {
        shopName: 'Safisha Living Solutions',
        ownerName: 'Dorice Mlay',
        phone: '255787445566',
        nida: '19921201-99107-00009-54',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        bio: 'Dawa safi za usafi, cleaners, roboti za usafi na vifaa vya kisasa vya kupendezesha sebule na jiko.',
        followersCount: '4.2k',
        location: 'Kinondoni Morocco, Dar'
    }
};

// Format WhatsApp Phone for international routing (+255)
function formatWhatsAppPhone(phone) {
    if (!phone) return MALL_WHATSAPP_PHONE;
    let clean = String(phone).trim().replace(/\D/g, '');
    if (clean.startsWith('0')) {
        clean = '255' + clean.substring(1);
    } else if (!clean.startsWith('255') && clean.length === 9) {
        clean = '255' + clean;
    }
    return clean || MALL_WHATSAPP_PHONE;
}

function getVendorForProduct(item) {
    if (item.vendorPhone || item.vendorShopName) {
        const rawPhone = item.vendorPhone || item.phone || MALL_WHATSAPP_PHONE;
        const cleanPhone = formatWhatsAppPhone(rawPhone);

        let avatar = item.vendorAvatar;
        let shopName = item.vendorShopName || item.vendorName || 'Muuzaji wa Genge';
        let bio = item.vendorBio || 'Muuzaji aliyethibitishwa Genge Mall';
        let location = item.location || 'Dar es Salaam';

        // Check if there is an updated profile picture in localStorage
        const savedPic = localStorage.getItem('genge_vendor_profile_pic_' + rawPhone) 
                      || localStorage.getItem('genge_vendor_profile_pic_' + cleanPhone);
        if (savedPic) avatar = savedPic;

        // Check if current active vendor matches
        const savedVendor = localStorage.getItem('genge_vendor');
        if (savedVendor) {
            try {
                const sv = JSON.parse(savedVendor);
                if (sv && (formatWhatsAppPhone(sv.phone) === cleanPhone || sv.phone === rawPhone)) {
                    if (sv.shopName) shopName = sv.shopName;
                    if (sv.avatar) avatar = sv.avatar;
                    if (sv.bio) bio = sv.bio;
                    if (sv.location) location = sv.location;
                }
            } catch(_) {}
        }

        return {
            shopName: shopName,
            ownerName: item.vendorName || shopName,
            phone: cleanPhone,
            rawPhone: rawPhone,
            nida: item.vendorNida || item.vendorNidaOrTin || 'NIDA Verified',
            avatar: avatar || 'pics/12.png',
            bio: bio,
            followersCount: item.followersCount || '2.3k',
            location: location
        };
    }
    const dept = item.dept || item.category || 'nyumba';
    const def = defaultVendorProfiles[dept] || defaultVendorProfiles.nyumba;
    return {
        ...def,
        phone: formatWhatsAppPhone(def.phone)
    };
}

// Format Currency TZS
function formatTZS(amount) {
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);
}

// Initialize on DOM Loaded or immediately if DOM is already ready
function initMallApp() {
    checkUserSession();
    fetchLiveMemberCount();
    loadMallCartFromStorage();
    renderDepartmentPills();
    renderMallProducts(); // Render immediately so catalog is instantly visible!
    fetchServerMallProducts();
    updateMallCartUI();
    initSponsoredSlider();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMallApp);
} else {
    initMallApp();
}

// A. Fetch Live Dynamic Member Count (Base 105,000+)
async function fetchLiveMemberCount() {
    try {
        const res = await fetch('/api/stats/member-count');
        if (res.ok) {
            const data = await res.json();
            const el = document.getElementById('live-member-count');
            if (el) el.textContent = data.formatted || '105,420+';
            return;
        }
    } catch (e) {
        // Fallback for offline / static hosting
    }

    // Dynamic 24-hour increment based on current day
    const baseCount = 105280;
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const dynamicCount = baseCount + (dayOfYear * 17);
    const el = document.getElementById('live-member-count');
    if (el) el.textContent = dynamicCount.toLocaleString() + '+';
}

// B. Check Current User Session
function checkUserSession() {
    const saved = localStorage.getItem('genge_user');
    if (saved) {
        try {
            currentUser = JSON.parse(saved);
            updateHeaderAuthUI();
        } catch (e) {
            localStorage.removeItem('genge_user');
        }
    }
}

function updateHeaderAuthUI() {
    const btnText = document.getElementById('auth-btn-text');
    const authBtn = document.getElementById('mall-auth-btn');
    if (!btnText || !authBtn) return;

    if (currentUser) {
        btnText.textContent = (currentUser.shopName || currentUser.name.split(' ')[0]) + ' (Dashboard 🏬)';
        authBtn.onclick = openUserDropdownOrDashboard;
    } else {
        btnText.textContent = 'Muuzaji: Ingia / Sajili';
        authBtn.onclick = () => openAuthModal('login');
    }
}

function openUserDropdownOrDashboard() {
    if (!currentUser) return openAuthModal('login');

    if (currentUser.role === 'vendor') {
        // Direct seamless jump to vendor's own admin dashboard!
        window.location.href = 'vendor-admin.html';
    } else {
        const choice = confirm(`Habari ${currentUser.name}!\n\nJe, unataka kutoka kwenye akaunti yako?\n\n[OK] = Toka (Logout)\n[CANCEL] = Baki Sokoni`);
        if (choice) {
            logoutUser();
        }
    }
}

function logoutUser() {
    localStorage.removeItem('genge_user');
    localStorage.removeItem('genge_vendor');
    currentUser = null;
    updateHeaderAuthUI();
    showMallToast('Umetoka kwenye akaunti yako.');
}

// C. Auth Modal Controls (Exclusively for Vendors)
window.openAuthModal = function(mode = 'login') {
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) {
        modal.classList.add('open');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'auto';
    }
    switchAuthMode(mode);
};

window.closeAuthModal = function() {
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) {
        modal.classList.remove('open');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
    }
};

window.switchAuthMode = function(mode) {
    const tabLogin = document.getElementById('tab-btn-login');
    const tabReg = document.getElementById('tab-btn-register');
    const formLogin = document.getElementById('auth-login-form');
    const formReg = document.getElementById('auth-register-form');

    if (tabLogin) tabLogin.classList.toggle('active', mode === 'login');
    if (tabReg) tabReg.classList.toggle('active', mode === 'register');

    if (formLogin) {
        formLogin.classList.toggle('hidden', mode !== 'login');
        formLogin.style.display = (mode === 'login') ? 'block' : 'none';
    }
    if (formReg) {
        formReg.classList.toggle('hidden', mode !== 'register');
        formReg.style.display = (mode === 'register') ? 'block' : 'none';
    }
};

window.selectRegisterRole = function() {};

// ── VENDOR REGISTRATION & STK PUSH FLOW ─────────────────────────────
let pendingVendorRegistration = null;
let vstkCountdownInterval = null;

window.handleMallRegister = async function(e) {
    e.preventDefault();
    const role = 'vendor';
    const nameEl = document.getElementById('reg-name');
    const phoneEl = document.getElementById('reg-phone');
    const passEl = document.getElementById('reg-password');
    const nidaEl = document.getElementById('reg-nida');
    const shopEl = document.getElementById('reg-shop-name');
    const pkgEl = document.getElementById('reg-package-select');
    const msgDiv = document.getElementById('reg-form-msg');

    const name = nameEl ? nameEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const password = passEl ? passEl.value : '';
    const nidaOrTin = nidaEl ? nidaEl.value.trim() : '';
    const shopName = shopEl ? shopEl.value.trim() : '';
    const packageName = pkgEl ? pkgEl.value : 'Basic';

    if (!name || !phone || !password || !nidaOrTin || !shopName) {
        if (msgDiv) {
            msgDiv.textContent = 'Tafadhali jaza taarifa zote za duka lako zenye alama ya (*)';
            msgDiv.style.color = '#EF4444';
        }
        return;
    }

    const priceMap = { 'Basic': 5000, 'Silver': 10000, 'Gold': 15000 };
    const price = priceMap[packageName] || 5000;

    pendingVendorRegistration = {
        name,
        phone,
        password,
        role,
        nidaOrTin,
        shopName,
        packageName,
        price
    };

    // Close auth modal and open STK Push modal directly!
    closeAuthModal();
    openVendorStkModal(pendingVendorRegistration);
};

window.openVendorStkModal = function(data) {
    const modal = document.getElementById('vendor-stk-modal');
    if (!modal) return;

    document.getElementById('vstk-shop-display').textContent = data.shopName;
    document.getElementById('vstk-pkg-display').textContent = `${data.packageName} Vendor`;
    document.getElementById('vstk-amount-display').textContent = `Tsh ${data.price.toLocaleString()}/=`;
    document.getElementById('vstk-phone-input').value = data.phone;

    // Reset waiting box
    const waitingBox = document.getElementById('vstk-waiting-box');
    if (waitingBox) waitingBox.style.display = 'none';
    const triggerBtn = document.getElementById('btn-trigger-vstk');
    if (triggerBtn) triggerBtn.style.display = 'flex';

    modal.style.display = 'flex';
};

window.closeVendorStkModal = function() {
    const modal = document.getElementById('vendor-stk-modal');
    if (modal) modal.style.display = 'none';
    if (vstkCountdownInterval) clearInterval(vstkCountdownInterval);
};

window.updateVstkNetwork = function(radio) {
    document.querySelectorAll('.vstk-net-card').forEach(card => card.classList.remove('active'));
    if (radio && radio.parentElement) {
        radio.parentElement.classList.add('active');
    }
};

// Track confirmed payment before allowing registration
let vstkHarakaOrderId = null;
let vstkPaymentConfirmed = false;
let vstkPollInterval = null;

window.triggerVendorStkPayment = async function() {
    if (!pendingVendorRegistration) return;

    const phoneInput = document.getElementById('vstk-phone-input');
    const phone = (phoneInput ? phoneInput.value.trim() : '') || pendingVendorRegistration.phone;
    if (!phone) { showMallToast('Tafadhali ingiza namba ya simu ya kulipa.'); return; }

    pendingVendorRegistration.paymentPhone = phone;
    vstkHarakaOrderId = null;
    vstkPaymentConfirmed = false;

    const selectedProvider = document.querySelector('input[name="vstk_provider"]:checked')?.value || 'VodaCom M-Pesa';

    const triggerBtn = document.getElementById('btn-trigger-vstk');
    const waitingBox = document.getElementById('vstk-waiting-box');
    const statusHeading = document.getElementById('vstk-status-heading');
    const statusSub = document.getElementById('vstk-status-sub');
    const countdownEl = document.getElementById('vstk-countdown');

    if (triggerBtn) { triggerBtn.style.display = 'none'; triggerBtn.disabled = true; }
    if (waitingBox) waitingBox.style.display = 'block';
    if (statusHeading) statusHeading.textContent = '⏳ Inatuma Ombi la PIN...';
    if (statusSub) statusSub.textContent = `Tafadhali subiri. Tunawasiliana na ${selectedProvider}...`;

    try {
        const res = await fetch(`${BACKEND_URL}/api/vendor/register-stk`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...pendingVendorRegistration, phone, provider: selectedProvider })
        });

        const data = await res.json();

        if (res.ok && data.success && data.order_id) {
            vstkHarakaOrderId = data.order_id;

            if (statusHeading) statusHeading.textContent = '📲 Angalia Simu Yako!';
            if (statusSub) statusSub.innerHTML = `
                Ombi la PIN limetumwa kwenye <strong>${phone}</strong> (${selectedProvider}).<br>
                Ingiza PIN yako ya M-Pesa/Tigo Pesa kukamilisha malipo ya <strong>Tsh ${pendingVendorRegistration.price.toLocaleString()}/=</strong>.
            `;

            // Start countdown
            let timeLeft = 90;
            if (countdownEl) countdownEl.textContent = timeLeft;
            if (vstkCountdownInterval) clearInterval(vstkCountdownInterval);
            vstkCountdownInterval = setInterval(() => {
                timeLeft--;
                if (countdownEl) countdownEl.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(vstkCountdownInterval);
                    if (!vstkPaymentConfirmed) {
                        if (statusHeading) statusHeading.textContent = '⚠️ Bado Hujaweka PIN?';
                        if (statusSub) statusSub.textContent = 'Kama uliweka PIN, tafadhali subiri sekunde chache — tunakagua malipo yako otomatiki.';
                    }
                }
            }, 1000);

            // Poll HarakaPay every 5s for payment status (auto-register when paid)
            if (vstkPollInterval) clearInterval(vstkPollInterval);
            let pollCount = 0;
            vstkPollInterval = setInterval(async () => {
                pollCount++;
                if (pollCount > 24 || vstkPaymentConfirmed) { clearInterval(vstkPollInterval); return; }
                try {
                    const r = await fetch(`${BACKEND_URL}/api/vendor/stk-status/${vstkHarakaOrderId}`);
                    const s = await r.json();
                    const payStatus = s.payment?.status || s.status || '';
                    if (payStatus === 'completed') {
                        vstkPaymentConfirmed = true;
                        clearInterval(vstkPollInterval);
                        clearInterval(vstkCountdownInterval);
                        if (statusHeading) statusHeading.textContent = '✅ Malipo Yamethibitishwa!';
                        if (statusSub) statusSub.textContent = 'Shukrani! Tunasajili duka lako sasa...';
                        setTimeout(() => window.confirmVendorPaymentManually(), 1200);
                    } else if (payStatus === 'failed') {
                        vstkPaymentConfirmed = false;
                        clearInterval(vstkPollInterval);
                        clearInterval(vstkCountdownInterval);
                        if (statusHeading) statusHeading.textContent = '❌ Malipo Yamefeli';
                        if (statusSub) statusSub.textContent = 'Malipo hayakufanikiwa. Hakikisha una salio la kutosha na ujaribu tena.';
                        if (triggerBtn) { triggerBtn.style.display = 'flex'; triggerBtn.disabled = false; }
                    }
                } catch (_) {}
            }, 5000);

        } else {
            // STK push failed (backend unavailable or API error)
            if (statusHeading) statusHeading.textContent = '⚠️ Ombi Halikufanikiwa';
            if (statusSub) statusSub.innerHTML = `
                ${data.message || 'Kosa la mtandao. Backend haijajua.'}<br><br>
                Unaweza kulipa moja kwa moja:<br>
                📱 <strong>Lipa M-Pesa/Tigo Pesa:</strong> <strong>0799 689 961</strong><br>
                Kumbuka kuweka namba yako ya simu kama rejea la malipo.<br>
                Baada ya kulipa, wasiliana nasi kwa WhatsApp: <strong>+255799689961</strong>
            `;
            if (triggerBtn) { triggerBtn.style.display = 'flex'; triggerBtn.disabled = false; }
        }
    } catch (err) {
        if (statusHeading) statusHeading.textContent = '⚠️ Tatizo la Mtandao';
        if (statusSub) statusSub.innerHTML = `
            Haiwezekani kufikia backend sasa hivi.<br><br>
            Lipa moja kwa moja kwenye:<br>
            📱 <strong>M-Pesa/Tigo Pesa: 0799 689 961</strong><br>
            Kisha tuma screenshot ya malipo WhatsApp: <strong>+255799689961</strong>
        `;
        if (triggerBtn) { triggerBtn.style.display = 'flex'; triggerBtn.disabled = false; }
    }
};

window.confirmVendorPaymentManually = async function() {
    if (!pendingVendorRegistration) return;
    if (vstkCountdownInterval) clearInterval(vstkCountdownInterval);
    if (vstkPollInterval) clearInterval(vstkPollInterval);

    // If not yet confirmed via polling, verify immediately with HarakaPay
    if (!vstkPaymentConfirmed) {
        if (!vstkHarakaOrderId) {
            showMallToast('⚠️ Bonyeza "Tuma Ombi la PIN" kwanza ili upokee ujumbe kwenye simu yako ya kulipia.');
            return;
        }

        const statusHeading = document.getElementById('vstk-status-heading');
        const statusSub = document.getElementById('vstk-status-sub');
        if (statusHeading) statusHeading.textContent = '🔍 Inahakiki Malipo Yako...';
        if (statusSub) statusSub.textContent = 'Tafadhali subiri sekunde chache tunapowasiliana na mtandao wa simu kuthibitisha...';

        try {
            const checkRes = await fetch(`${BACKEND_URL}/api/vendor/stk-status/${vstkHarakaOrderId}`);
            const checkData = await checkRes.json();
            const currentStatus = checkData.payment?.status || checkData.status || '';

            if (currentStatus === 'completed') {
                vstkPaymentConfirmed = true;
            } else {
                showMallToast('⚠️ Malipo hayajakamilika. Tafadhali ingiza PIN kwenye simu yako kwanza!');
                if (statusHeading) statusHeading.textContent = '⏳ Inasubiri PIN Kwenye Simu...';
                if (statusSub) statusSub.textContent = 'Hatujapata uthibitisho wa PIN bado. Tafadhali weka PIN kwenye simu yako kisha ujaribu tena.';
                return;
            }
        } catch (e) {
            showMallToast('⚠️ Haikuweza kuthibitisha malipo. Tafadhali jaribu tena baada ya sekunde chache.');
            return;
        }
    }

    const data = pendingVendorRegistration;
    const limit = data.packageName === 'Gold' ? 60 : data.packageName === 'Silver' ? 45 : 25;
    let registeredUser = null;

    try {
        const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                phone: data.phone,
                password: data.password,
                role: 'vendor',
                nidaOrTin: data.nidaOrTin,
                shopName: data.shopName,
                packageName: data.packageName,
                paymentStatus: 'paid',
                harakaOrderId: vstkHarakaOrderId || ''
            })
        });
        if (res.ok) {
            const resData = await res.json();
            registeredUser = resData.user;
        }
    } catch (_) {}

    if (!registeredUser) {
        registeredUser = {
            id: 'vdr_' + Date.now(),
            name: data.name,
            phone: data.phone,
            role: 'vendor',
            nidaOrTin: data.nidaOrTin,
            shopName: data.shopName,
            packageName: data.packageName,
            productLimit: limit,
            status: 'active',
            package: {
                name: data.packageName,
                price: data.price,
                maxProducts: limit,
                status: 'active',
                durationDays: 30,
                activatedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            createdAt: new Date().toISOString()
        };
        try {
            const existingUsers = JSON.parse(localStorage.getItem('genge_registered_users') || '[]');
            existingUsers.push(registeredUser);
            localStorage.setItem('genge_registered_users', JSON.stringify(existingUsers));
        } catch (_) {}
    }

    currentUser = registeredUser;
    localStorage.setItem('genge_user', JSON.stringify(currentUser));
    localStorage.setItem('genge_vendor', JSON.stringify(currentUser));
    updateHeaderAuthUI();

    const waitingBox = document.getElementById('vstk-waiting-box');
    if (waitingBox) {
        waitingBox.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 8px;">🎉</div>
            <h3 style="color: #10B981; margin-bottom: 4px;">Hongera! Duka Lako Limeanzishwa!</h3>
            <p style="color: #cbd5e1; font-size: 0.85rem;">Duka la <strong>${data.shopName}</strong> limeamilishwa kikamilifu na Kifurushi cha <strong>${data.packageName} (siku 30)</strong>!</p>
            <p style="color: #94a3b8; font-size: 0.8rem; margin-top: 6px;">Inakupeleka moja kwa moja kwenye Dashboard ya Duka lako...</p>
        `;
    }

    setTimeout(() => {
        closeVendorStkModal();
        window.location.href = 'vendor-admin.html';
    }, 2200);
};

window.cancelVendorStkPayment = function() {
    if (vstkPollInterval) clearInterval(vstkPollInterval);
    if (vstkCountdownInterval) clearInterval(vstkCountdownInterval);
    closeVendorStkModal();
    openAuthModal('register');
};

// ── AUTO-SLIDING SPONSORED ADS CAROUSEL (GOLD VIP VENDORS) ──────────
let sponsoredSliderIndex = 0;
let sponsoredSliderTimer = null;
let sponsoredSliderItems = [];
let isSponsoredSliderPaused = false;

function initSponsoredSlider() {
    const track = document.getElementById('sponsored-slides-track');
    const dotsContainer = document.getElementById('sponsored-dots-indicator');
    if (!track) return;

    // Curated high-impact sponsored listings for Gold/VIP vendors
    sponsoredSliderItems = [
        {
            id: 'sp-01',
            shopName: 'Dar Luxury Homes & Real Estate',
            vendorPhone: '255799689961',
            verified: true,
            badgeText: '⭐ GOLD VIP VENDOR',
            title: 'Apartment ya Kisasa (Vyumba 3) Mbezi Beach',
            price: 650000,
            priceUnit: '/ Mwezi',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
            location: 'Mbezi Beach, Dar es Salaam',
            specs: ['Vyumba 3 Master', 'Gypsum & Tiles', 'Paving & Fensi', 'Maji Dawasco 24/7']
        },
        {
            id: 'sp-02',
            shopName: 'Classic Auto Motors Tanzania',
            vendorPhone: '255692970687',
            verified: true,
            badgeText: '⭐ GOLD VIP VENDOR',
            title: 'Toyota Harrier New Model (Black Edition)',
            price: 34500000,
            priceUnit: 'Tsh (Inauzwa)',
            image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
            location: 'Magomeni Mikumi, Dar es Salaam',
            specs: ['Mwaka 2017', 'Full Options', 'Leather Seats', 'Kadi Halisi ya TRA']
        },
        {
            id: 'sp-03',
            shopName: 'Kariakoo Smart Tech & Appliances',
            vendorPhone: '255675583884',
            verified: true,
            badgeText: '⭐ GOLD VIP VENDOR',
            title: 'Samsung Smart 4K UHD Frameless TV (55 Inch)',
            price: 1150000,
            priceUnit: 'Tsh',
            image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
            location: 'Mtaa wa Msimbazi, Kariakoo',
            specs: ['55 Inch', '4K Ultra HD', 'Voice Remote', 'Waranti Miaka 2']
        },
        {
            id: 'sp-04',
            shopName: 'Zanzibar Queen Fashion & Perfumes',
            vendorPhone: '255799689961',
            verified: true,
            badgeText: '⭐ GOLD VIP VENDOR',
            title: 'Seti ya Manukato ya Asili ya Oud & Dubai Silk Abaya',
            price: 185000,
            priceUnit: 'Seti Kamili',
            image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
            location: 'Posta Mpya, Dar es Salaam',
            specs: ['Oud Halisi', 'Harufu ya Siku 3', 'Kitambaa cha Hariri', 'Free Delivery']
        }
    ];

    renderSponsoredSlides();
    startSponsoredSliderAutoplay();
    initSponsoredSliderGestures();
}

function renderSponsoredSlides() {
    const track = document.getElementById('sponsored-slides-track');
    const dotsContainer = document.getElementById('sponsored-dots-indicator');
    if (!track) return;

    track.innerHTML = sponsoredSliderItems.map((item, idx) => {
        const cleanPhone = formatWhatsAppPhone(item.vendorPhone);
        const waMsg = encodeURIComponent(`Habari ${item.shopName}! Nimeona tangazo lako la "${item.title}" (Tsh ${item.price.toLocaleString()}) kwenye Genge Mall VIP Showcase. Naomba kujua zaidi.`);
        const waLink = `https://wa.me/${cleanPhone}?text=${waMsg}`;
        const telLink = `tel:+${cleanPhone}`;

        const specsHtml = (item.specs || []).map(s => `<span class="spec-pill">${s}</span>`).join('');

        return `
            <div class="sponsored-slide-card" data-index="${idx}">
                <div class="slide-img-box">
                    <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='pics/15.png'">
                    <div class="slide-gold-ribbon">
                        <ion-icon name="sparkles"></ion-icon> ${item.badgeText}
                    </div>
                </div>
                <div class="slide-info-box">
                    <div>
                        <div class="slide-vendor-header">
                            <span class="slide-vendor-shop">
                                <ion-icon name="storefront-outline"></ion-icon> ${item.shopName}
                            </span>
                            <span class="slide-verified-badge">
                                <ion-icon name="checkmark-circle"></ion-icon> NIDA Verified
                            </span>
                        </div>
                        <h3 class="slide-title">${item.title}</h3>
                        <div class="slide-location">
                            <ion-icon name="location-outline"></ion-icon> ${item.location}
                        </div>
                        <div class="slide-specs-pills">
                            ${specsHtml}
                        </div>
                    </div>
                    <div>
                        <div class="slide-price-row">
                            <span class="slide-current-price">Tsh ${item.price.toLocaleString()}</span>
                            <span style="font-size:0.8rem; color:#94a3b8;">${item.priceUnit || ''}</span>
                        </div>
                        <div class="slide-actions-row">
                            <a href="${waLink}" target="_blank" class="slide-btn-whatsapp">
                                <ion-icon name="logo-whatsapp"></ion-icon> Agiza WhatsApp
                            </a>
                            <a href="${telLink}" class="slide-btn-call">
                                <ion-icon name="call-outline"></ion-icon> Piga
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    if (dotsContainer) {
        dotsContainer.innerHTML = sponsoredSliderItems.map((_, i) => `
            <div class="sponsored-dot ${i === 0 ? 'active' : ''}" onclick="goToSponsoredSlide(${i})"></div>
        `).join('');
    }
}

function startSponsoredSliderAutoplay() {
    if (sponsoredSliderTimer) clearInterval(sponsoredSliderTimer);
    sponsoredSliderTimer = setInterval(() => {
        if (!isSponsoredSliderPaused) {
            moveSponsoredSlide(1);
        }
    }, 4500);
}

function getMaxSponsoredIndex() {
    const isDesktop = window.innerWidth >= 1024;
    return isDesktop ? Math.max(0, sponsoredSliderItems.length - 2) : sponsoredSliderItems.length - 1;
}

window.moveSponsoredSlide = function(direction) {
    if (sponsoredSliderItems.length <= 1) return;
    const maxIndex = getMaxSponsoredIndex();
    sponsoredSliderIndex += direction;
    if (sponsoredSliderIndex > maxIndex) {
        sponsoredSliderIndex = 0;
    } else if (sponsoredSliderIndex < 0) {
        sponsoredSliderIndex = maxIndex;
    }
    updateSponsoredSliderPosition();
};

window.goToSponsoredSlide = function(index) {
    const maxIndex = getMaxSponsoredIndex();
    sponsoredSliderIndex = Math.min(index, maxIndex);
    updateSponsoredSliderPosition();
};

function updateSponsoredSliderPosition() {
    const track = document.getElementById('sponsored-slides-track');
    const dots = document.querySelectorAll('.sponsored-dot');
    if (!track) return;

    const cards = track.querySelectorAll('.sponsored-slide-card');
    if (cards && cards[sponsoredSliderIndex] && cards[0]) {
        const offset = cards[sponsoredSliderIndex].offsetLeft - cards[0].offsetLeft;
        track.style.transform = `translateX(-${offset}px)`;
    }

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === sponsoredSliderIndex);
    });
}

function initSponsoredSliderGestures() {
    const container = document.getElementById('sponsored-slider-container');
    if (!container) return;

    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        pauseSponsoredSlider();
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                moveSponsoredSlide(1); // Swipe left -> Next
            } else {
                moveSponsoredSlide(-1); // Swipe right -> Prev
            }
        }
        setTimeout(resumeSponsoredSlider, 1200);
    }, { passive: true });

    window.addEventListener('resize', () => {
        updateSponsoredSliderPosition();
    });
}

window.pauseSponsoredSlider = function() {
    isSponsoredSliderPaused = true;
};

window.resumeSponsoredSlider = function() {
    isSponsoredSliderPaused = false;
};


window.handleMallLogin = async function(e) {
    e.preventDefault();
    const phoneEl = document.getElementById('login-phone');
    const passEl = document.getElementById('login-password');
    const msgDiv = document.getElementById('login-form-msg');

    const phone = phoneEl ? phoneEl.value.trim() : '';
    const password = passEl ? passEl.value : '';

    if (!phone) {
        if (msgDiv) {
            msgDiv.textContent = 'Weka namba ya simu.';
            msgDiv.style.color = '#EF4444';
        }
        return;
    }

    if (msgDiv) {
        msgDiv.textContent = 'Inaingia...';
        msgDiv.style.color = '#fff';
    }

    let loggedInUser = null;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password })
        });

        if (res.ok) {
            const data = await res.json();
            loggedInUser = data.user;
        }
    } catch (err) {
        // Backend offline / static site fallback
    }

    // Resilient local fallback
    if (!loggedInUser) {
        try {
            const users = JSON.parse(localStorage.getItem('genge_registered_users') || '[]');
            const found = users.find(u => u.phone === phone);
            if (found) {
                loggedInUser = found;
            } else {
                const savedVendor = JSON.parse(localStorage.getItem('genge_vendor') || 'null');
                if (savedVendor && savedVendor.phone === phone) {
                    loggedInUser = savedVendor;
                } else {
                    loggedInUser = {
                        id: 'vdr_' + Date.now(),
                        name: 'Muuzaji wa Genge',
                        phone: phone,
                        role: 'vendor',
                        shopName: 'Duka Langu',
                        status: 'active'
                    };
                }
            }
        } catch (e) {
            loggedInUser = {
                id: 'vdr_' + Date.now(),
                name: 'Muuzaji wa Genge',
                phone: phone,
                role: 'vendor',
                shopName: 'Duka Langu',
                status: 'active'
            };
        }
    }

    currentUser = loggedInUser;
    localStorage.setItem('genge_user', JSON.stringify(currentUser));
    localStorage.setItem('genge_vendor', JSON.stringify(currentUser));
    updateHeaderAuthUI();

    if (msgDiv) {
        msgDiv.textContent = '✅ Karibu ' + (currentUser.shopName || currentUser.name || 'Muuzaji');
        msgDiv.style.color = '#10B981';
    }

    setTimeout(() => {
        closeAuthModal();
        window.location.href = 'vendor-admin.html';
    }, 700);
};

// D. Fetch Products Uploaded via API & Combine with Catalog
async function fetchServerMallProducts() {
    let prods = [];
    try {
        const res = await fetch('/api/products');
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
                prods = data.filter(p => p.vendorPhone || (p.id && p.id.startsWith('vprod_')));
            }
        }
    } catch (e) {
        // Server products optional in static mode
    }

    // Merge custom vendor products from localStorage (persists vendor products locally on GitHub Pages)
    try {
        const localVendorProds = JSON.parse(localStorage.getItem('genge_custom_vendor_products') || '[]');
        if (Array.isArray(localVendorProds) && localVendorProds.length > 0) {
            const existingIds = new Set(prods.map(p => p.id));
            localVendorProds.forEach(lp => {
                if (!existingIds.has(lp.id)) {
                    prods.unshift(lp);
                }
            });
        }
    } catch (_) {}

    serverMallProducts = prods;
    renderMallProducts();
}

// Render Department Pills
function renderDepartmentPills() {
    const container = document.getElementById('dept-pills-container');
    if (!container) return;

    container.innerHTML = '';
    mallDepartments.forEach(dept => {
        const pill = document.createElement('button');
        pill.type = 'button';
        pill.className = 'dept-pill' + (dept.id === currentDepartment ? ' active' : '');
        pill.id = `pill-${dept.id}`;
        pill.innerHTML = `
            <span class="dept-pill-icon">${dept.emoji}</span>
            <span>${dept.name}</span>
        `;
        pill.onclick = () => selectDepartment(dept.id);
        container.appendChild(pill);
    });
}

// Select Department Handler
window.selectDepartment = function(deptId) {
    currentDepartment = deptId;
    currentSubfilter = 'all';
    searchQuery = '';

    const searchInput = document.getElementById('mall-search-input');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('mall-search-clear');
    if (clearBtn) clearBtn.style.display = 'none';

    // Update active state in pills
    document.querySelectorAll('.dept-pill').forEach(el => el.classList.remove('active'));
    const activePill = document.getElementById(`pill-${deptId}`);
    if (activePill) {
        activePill.classList.add('active');
        activePill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    renderSubfilters();
    renderMallProducts();

    // Smooth scroll to products section
    const sec = document.getElementById('mall-products-sec');
    if (sec) {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Render Subfilters for Real Estate or Cars
function renderSubfilters() {
    const container = document.getElementById('subfilter-container');
    if (!container) return;

    if (currentDepartment === 'nyumba') {
        container.style.display = 'flex';
        container.innerHTML = `
            <button class="subfilter-chip ${currentSubfilter === 'all' ? 'active' : ''}" onclick="setSubfilter('all')">Zote</button>
            <button class="subfilter-chip ${currentSubfilter === 'kupangisha' ? 'active' : ''}" onclick="setSubfilter('kupangisha')">🔑 Za Kupangisha</button>
            <button class="subfilter-chip ${currentSubfilter === 'kuuzwa' ? 'active' : ''}" onclick="setSubfilter('kuuzwa')">🏷️ Za Kuuzwa</button>
        `;
    } else if (currentDepartment === 'magari') {
        container.style.display = 'flex';
        container.innerHTML = `
            <button class="subfilter-chip ${currentSubfilter === 'all' ? 'active' : ''}" onclick="setSubfilter('all')">Zote</button>
            <button class="subfilter-chip ${currentSubfilter === 'used' ? 'active' : ''}" onclick="setSubfilter('used')">🚗 Used Safi</button>
            <button class="subfilter-chip ${currentSubfilter === 'mpya' ? 'active' : ''}" onclick="setSubfilter('mpya')">✨ Mpya 0km</button>
        `;
    } else {
        container.style.display = 'none';
        container.innerHTML = '';
    }
}

window.setSubfilter = function(sub) {
    currentSubfilter = sub;
    renderSubfilters();
    renderMallProducts();
};

// Filter Search Input
window.filterMallProducts = function() {
    const input = document.getElementById('mall-search-input');
    const clearBtn = document.getElementById('mall-search-clear');
    if (!input) return;

    searchQuery = input.value.trim().toLowerCase();
    if (clearBtn) clearBtn.style.display = searchQuery ? 'inline-block' : 'none';

    renderMallProducts();
};

window.clearMallSearch = function() {
    const input = document.getElementById('mall-search-input');
    const clearBtn = document.getElementById('mall-search-clear');
    if (input) input.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    searchQuery = '';
    renderMallProducts();
};

// Render Products to Grid (Instagram Style Social Cards)
function renderMallProducts() {
    const grid = document.getElementById('mall-products-grid');
    const countEl = document.getElementById('results-count');
    const deptLabel = document.getElementById('active-dept-label');

    if (!grid) return;

    // Combine static catalog and server vendor products
    const combinedAll = [...serverMallProducts, ...mallProducts];

    // Filter logic
    let filtered = combinedAll.filter(item => {
        // Department filter
        if (currentDepartment !== 'all') {
            const itemDept = item.dept || item.category;
            if (itemDept !== currentDepartment) return false;
        }

        // Subfilter (e.g. kupangisha vs kuuzwa)
        if (currentSubfilter !== 'all' && item.subType !== currentSubfilter) return false;

        // Search query filter
        if (searchQuery) {
            const matchTitle = (item.title || item.name || '').toLowerCase().includes(searchQuery);
            const matchDesc = (item.desc || '').toLowerCase().includes(searchQuery);
            const matchLoc = (item.location || '').toLowerCase().includes(searchQuery);
            const matchSpecs = (item.specs || []).join(' ').toLowerCase().includes(searchQuery);
            const matchVendor = (item.vendorShopName || item.vendorName || '').toLowerCase().includes(searchQuery);
            if (!matchTitle && !matchDesc && !matchLoc && !matchSpecs && !matchVendor) return false;
        }

        return true;
    });

    if (countEl) countEl.innerText = filtered.length;
    if (deptLabel) {
        const dObj = mallDepartments.find(d => d.id === currentDepartment);
        deptLabel.innerText = dObj ? `(${dObj.name})` : '';
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
                <span style="font-size: 3.5rem; display: block; margin-bottom: 1rem;">🔍</span>
                <h3 style="color: #ffffff; margin-bottom: 0.5rem; font-size: 1.3rem;">Hakuna bidhaa zilizopatikana</h3>
                <p>Jaribu kubadilisha jina unalotafuta au bonyeza kategoria nyingine hapo juu.</p>
                <button class="mall-primary-cta" style="margin-top: 1rem; padding: 0.6rem 1.5rem;" onclick="selectDepartment('all')">Onyesha Bidhaa Zote</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'mall-card glass-panel';

        const itemTitle = item.title || item.name;
        const itemImage = item.image || item.icon;
        const deptKey = item.dept || item.category || 'nyumba';
        const vendor = getVendorForProduct(item);

        const vendorShop = vendor.shopName;
        const vendorPhone = vendor.phone;
        const vendorAvatar = vendor.avatar;
        const likeCount = item.likeCount || (item.likes ? item.likes.length : Math.floor(Math.random() * 18) + 5);
        const likedLocally = localStorage.getItem('genge_liked_' + item.id) === 'true';
        const isLiked = likedLocally || (currentUser && item.likes && item.likes.includes(currentUser.phone));

        // Instagram Card Header
        const instHeaderHtml = `
            <div class="inst-card-header">
                <div class="inst-vendor-info" onclick="openVendorProfileModal('${vendorPhone}', '${item.id}')" title="Bonyeza kuona profile ya duka">
                    <img src="${vendorAvatar}" alt="${vendorShop}" class="inst-avatar" onerror="this.src='pics/12.png'">
                    <div class="inst-vendor-name">
                        <span>${vendorShop}</span>
                        <ion-icon name="checkmark-circle" class="inst-verified-icon" title="NIDA Imethibitishwa"></ion-icon>
                    </div>
                </div>
                <button class="inst-follow-btn" onclick="event.stopPropagation(); toggleFollowVendor('${vendorPhone}')">
                    + Follow
                </button>
            </div>
        `;

        // Specs list HTML
        const specsHtml = (item.specs || []).map(s => `<span class="spec-pill">${s}</span>`).join('');

        // Action Buttons
        const waMsg = encodeURIComponent(`Habari ${vendorShop}, nimevutiwa na bidhaa hii Genge Mall: ${itemTitle} ya ${formatTZS(item.price)}. Namba yangu ni ${currentUser ? currentUser.phone : ''}. Tafadhali nifahamishe utaratibu.`);

        const actionButtonsHtml = `
            <div class="inst-card-actions">
                <button class="inst-like-btn ${isLiked ? 'liked' : ''}" onclick="toggleLikeProduct('${item.id}', this)">
                    <ion-icon name="${isLiked ? 'heart' : 'heart-outline'}"></ion-icon>
                    <span class="like-count">${likeCount}</span> Likes
                </button>
                <div style="display:flex;gap:6px;">
                    <a href="https://wa.me/${vendorPhone}?text=${waMsg}" target="_blank" class="btn-card-wa" style="padding:0.45rem 0.8rem;font-size:0.8rem;">
                        <ion-icon name="logo-whatsapp"></ion-icon> WhatsApp
                    </a>
                    <button type="button" class="btn-card-cart" style="padding:0.45rem 0.8rem;font-size:0.8rem;" onclick="addToMallCart('${item.id}')">
                        <ion-icon name="cart-outline"></ion-icon> Kapu
                    </button>
                </div>
            </div>
        `;

        card.innerHTML = `
            ${instHeaderHtml}
            <div class="mall-card-img-wrap">
                <img src="${itemImage}" alt="${itemTitle}" loading="lazy" class="mall-card-img" onerror="this.src='pics/15.png'">
                ${item.badge ? `<span class="mall-badge ${item.badgeClass || 'badge-rent'}">${item.badge}</span>` : ''}
            </div>
            <div class="mall-card-body">
                <span class="location-tag"><ion-icon name="location-outline"></ion-icon> ${item.location || vendor.location || 'Dar es Salaam'}</span>
                <h3 class="mall-card-title">${itemTitle}</h3>
                <p class="mall-card-desc">${item.desc || ''}</p>
                ${specsHtml ? `<div class="specs-wrap">${specsHtml}</div>` : ''}
                <div class="mall-price-row">
                    <span class="price-amount">${formatTZS(item.price)}</span>
                    ${item.priceUnit ? `<span class="price-unit">${item.priceUnit}</span>` : ''}
                </div>
            </div>
            ${actionButtonsHtml}
        `;

        grid.appendChild(card);
    });
}

// Social Like Action Handler (Works immediately for everyone!)
window.toggleLikeProduct = async function(productId, btnElement) {
    const icon = btnElement.querySelector('ion-icon');
    const countEl = btnElement.querySelector('.like-count');
    let currentLikes = parseInt(countEl ? countEl.textContent : '0', 10) || 0;

    const likedKey = 'genge_liked_' + productId;
    const alreadyLiked = localStorage.getItem(likedKey) === 'true';

    if (alreadyLiked) {
        localStorage.removeItem(likedKey);
        btnElement.classList.remove('liked');
        if (icon) icon.setAttribute('name', 'heart-outline');
        if (countEl) countEl.textContent = Math.max(0, currentLikes - 1);
    } else {
        localStorage.setItem(likedKey, 'true');
        btnElement.classList.add('liked');
        if (icon) icon.setAttribute('name', 'heart');
        if (countEl) countEl.textContent = currentLikes + 1;
        showMallToast('❤️ Umependa bidhaa hii!');
    }

    if (currentUser) {
        try {
            await fetch('/api/social/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, userPhone: currentUser.phone })
            });
        } catch (e) {}
    }
};

// Social Follow Action Handler (Works immediately for everyone!)
window.toggleFollowVendor = async function(vendorPhone) {
    const followKey = 'genge_following_' + vendorPhone;
    const isFollowing = localStorage.getItem(followKey) === 'true';

    if (isFollowing) {
        localStorage.removeItem(followKey);
        showMallToast('Umeacha kufuata duka hili.');
    } else {
        localStorage.setItem(followKey, 'true');
        showMallToast('✅ Sasa unafuata duka hili!');
    }

    if (currentUser) {
        try {
            await fetch('/api/social/follow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vendorPhone, userPhone: currentUser.phone })
            });
        } catch (e) {}
    }
};

// Vendor Profile Modal Handler
window.openVendorProfileModal = async function(phone, productIdOrDept) {
    const modal = document.getElementById('vendor-profile-modal');
    if (!modal) return;
    modalVendorPhone = phone;

    const cleanPhone = formatWhatsAppPhone(phone);
    const combinedAll = [...serverMallProducts, ...mallProducts];

    // Find the specific item clicked
    const clickedItem = combinedAll.find(p => String(p.id) === String(productIdOrDept));

    // Check if this vendor is a custom/registered vendor who uploaded products
    const customVendorProducts = combinedAll.filter(p => {
        return p.vendorPhone && formatWhatsAppPhone(p.vendorPhone) === cleanPhone;
    });

    const isCustomVendor = customVendorProducts.length > 0 || (clickedItem && clickedItem.vendorPhone);

    let v = null;

    if (isCustomVendor) {
        // Real custom vendor! Use this vendor's exact data
        const refProd = customVendorProducts[0] || clickedItem;
        
        let customAvatar = refProd.vendorAvatar;
        let customShopName = refProd.vendorShopName || refProd.vendorName || 'Duka Rasmi';
        let customBio = refProd.desc || refProd.vendorBio || 'Muuzaji aliyethibitishwa Genge Mall';
        let customLocation = refProd.location || 'Dar es Salaam';

        // Check if there is an updated profile picture saved in localStorage
        const savedPic = localStorage.getItem('genge_vendor_profile_pic_' + phone)
                      || localStorage.getItem('genge_vendor_profile_pic_' + cleanPhone);
        if (savedPic) customAvatar = savedPic;

        const savedVendor = localStorage.getItem('genge_vendor');
        if (savedVendor) {
            try {
                const sv = JSON.parse(savedVendor);
                if (sv && (formatWhatsAppPhone(sv.phone) === cleanPhone || sv.phone === phone)) {
                    if (sv.shopName) customShopName = sv.shopName;
                    if (sv.avatar) customAvatar = sv.avatar;
                    if (sv.bio) customBio = sv.bio;
                    if (sv.location) customLocation = sv.location;
                }
            } catch(_) {}
        }

        v = {
            shopName: customShopName,
            ownerName: refProd.vendorName || customShopName,
            phone: cleanPhone,
            nida: refProd.vendorNidaOrTin || 'NIDA Verified',
            avatar: customAvatar || 'pics/12.png',
            bio: customBio,
            followersCount: refProd.followersCount || '1.8k',
            location: customLocation
        };
    } else {
        // Default demo vendor for a catalog department
        const deptKey = (clickedItem && (clickedItem.dept || clickedItem.category)) || productIdOrDept || 'nyumba';
        const def = defaultVendorProfiles[deptKey] || defaultVendorProfiles.nyumba;
        v = {
            ...def,
            phone: formatWhatsAppPhone(def.phone)
        };
    }

    // Try API if available
    try {
        const res = await fetch(`/api/vendor/profile/${cleanPhone}`);
        if (res.ok) {
            const data = await res.json();
            if (data.vendor) v = { ...v, ...data.vendor };
        }
    } catch (e) {}

    // Populate Modal UI with THIS vendor's exact details
    const avatarEl = document.getElementById('vp-modal-avatar');
    if (avatarEl) avatarEl.src = v.avatar || 'pics/12.png';
    const shopEl = document.getElementById('vp-modal-shop');
    if (shopEl) shopEl.textContent = v.shopName || v.name;
    const ownerEl = document.getElementById('vp-modal-owner');
    if (ownerEl) ownerEl.textContent = 'Mwenye Duka: ' + (v.ownerName || v.shopName || 'Genge Merchant');
    const bioEl = document.getElementById('vp-modal-bio');
    if (bioEl) bioEl.textContent = v.bio || 'Wauzaji waaminifu Genge Mall';

    // STRICT ISOLATION OF PRODUCTS:
    // If it's a custom vendor: ONLY show products uploaded by this exact vendor phone!
    // If it's a demo department vendor: ONLY show demo products in this dept (excluding custom vendors)
    let vendorProds = [];
    if (isCustomVendor) {
        vendorProds = combinedAll.filter(p => p.vendorPhone && formatWhatsAppPhone(p.vendorPhone) === cleanPhone);
        if (clickedItem && !vendorProds.some(p => p.id === clickedItem.id)) {
            vendorProds.unshift(clickedItem);
        }
    } else {
        const deptKey = (clickedItem && (clickedItem.dept || clickedItem.category)) || productIdOrDept || 'nyumba';
        vendorProds = combinedAll.filter(p => {
            if (p.vendorPhone) return false; // Exclude custom vendors' products!
            const pDept = p.dept || p.category;
            return pDept === deptKey;
        });
    }

    const prodCountEl = document.getElementById('vp-modal-prod-count');
    if (prodCountEl) prodCountEl.textContent = vendorProds.length;
    const followersEl = document.getElementById('vp-modal-followers-count');
    if (followersEl) followersEl.textContent = v.followersCount || '2.4k';

    const waBtn = document.getElementById('vp-modal-wa-btn');
    if (waBtn) {
        const cleanVPhone = formatWhatsAppPhone(v.phone || cleanPhone);
        const waHello = encodeURIComponent(`Habari ${v.shopName}, nimeona duka lenu Genge Mall na nina maswali kuhusu bidhaa zenu.`);
        waBtn.href = `https://wa.me/${cleanVPhone}?text=${waHello}`;
    }

    const grid = document.getElementById('vp-modal-products-grid');
    if (grid) {
        if (vendorProds.length > 0) {
            const cleanVPhone = formatWhatsAppPhone(v.phone || cleanPhone);
            grid.innerHTML = vendorProds.map(p => {
                const pTitle = p.title || p.name;
                const pImg = p.image || p.icon;
                return `
                    <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;padding:0.7rem;display:flex;flex-direction:column;gap:6px;">
                        <img src="${pImg}" alt="${pTitle}" style="width:100%;height:130px;object-fit:cover;border-radius:8px;" onerror="this.src='pics/15.png'">
                        <h4 style="font-size:0.85rem;margin:0.2rem 0;color:#fff;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${pTitle}</h4>
                        <div style="color:var(--primary);font-weight:800;font-size:0.95rem;">${formatTZS(p.price)}</div>
                        <div style="display:flex;gap:4px;margin-top:auto;">
                            <button type="button" class="btn-card-cart" style="flex:1;padding:0.35rem 0.5rem;font-size:0.78rem;" onclick="addToMallCart('${p.id}')">
                                <ion-icon name="cart-outline"></ion-icon> Kapu
                            </button>
                            <a href="https://wa.me/${cleanVPhone}?text=${encodeURIComponent(`Habari ${v.shopName}, nahitaji kuagiza ${pTitle} ya ${formatTZS(p.price)}`)}" target="_blank" class="btn-card-wa" style="padding:0.35rem 0.6rem;font-size:0.78rem;">
                                <ion-icon name="logo-whatsapp"></ion-icon>
                            </a>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            grid.innerHTML = '<p style="grid-column:1/-1;color:var(--text-muted);text-align:center;padding:2rem;">Bado hakuna bidhaa zilizopakiwa na duka hili.</p>';
        }
    }

    modal.classList.add('open');
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
};

window.closeVendorProfileModal = function() {
    const modal = document.getElementById('vendor-profile-modal');
    if (modal) {
        modal.classList.remove('open');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
    }
};

window.toggleFollowVendorModal = function() {
    if (modalVendorPhone) {
        toggleFollowVendor(modalVendorPhone);
    }
};

window.addMallCartItem = function(id) {
    if (typeof window.addToMallCart === 'function') {
        window.addToMallCart(id);
    }
};

// ── Cart Management ─────────────────────────────────────
function loadMallCartFromStorage() {
    try {
        const saved = localStorage.getItem('genge_mall_cart');
        if (saved) mallCart = JSON.parse(saved);
    } catch (e) {
        mallCart = [];
    }
}

function saveMallCartToStorage() {
    try {
        localStorage.setItem('genge_mall_cart', JSON.stringify(mallCart));
    } catch (e) {}
}

window.addToMallCart = function(productId) {
    const item = mallProducts.find(p => p.id === productId);
    if (!item) return;

    mallCart.push({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        cartId: 'mc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)
    });

    saveMallCartToStorage();
    updateMallCartUI();

    // Show temporary feedback toast / notification
    showMallToast(`✅ ${item.title} imewekwa kwenye Kapu!`);
};

window.removeFromMallCart = function(cartId) {
    mallCart = mallCart.filter(item => item.cartId !== cartId);
    saveMallCartToStorage();
    updateMallCartUI();
};

function updateMallCartUI() {
    const countBadge = document.getElementById('mall-cart-count');
    const bnavBadge = document.getElementById('mall-bnav-count');
    const container = document.getElementById('mall-cart-items');
    const totalEl = document.getElementById('mall-cart-total');

    if (countBadge) countBadge.innerText = mallCart.length;
    if (bnavBadge) bnavBadge.innerText = mallCart.length;

    if (!container) return;

    if (mallCart.length === 0) {
        container.innerHTML = `
            <div class="mall-cart-empty">
                <span class="empty-icon">🛒</span>
                <p>Bado hujaweka bidhaa yoyote kwenye kapu lako la Genge Mall.</p>
            </div>
        `;
        if (totalEl) totalEl.innerText = formatTZS(0);
        return;
    }

    container.innerHTML = '';
    let total = 0;

    mallCart.forEach(item => {
        total += item.price;
        const row = document.createElement('div');
        row.className = 'mall-cart-item';
        row.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img" onerror="this.src='pics/15.png'">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${formatTZS(item.price)}</div>
            </div>
            <button type="button" class="cart-item-del" onclick="removeFromMallCart('${item.cartId}')" title="Ondoa">
                <ion-icon name="trash-outline"></ion-icon>
            </button>
        `;
        container.appendChild(row);
    });

    if (totalEl) totalEl.innerText = formatTZS(total);
}

window.toggleMallCart = function() {
    const overlay = document.getElementById('mall-cart-overlay');
    if (!overlay) return;

    overlay.classList.toggle('open');
};

// Checkout via WhatsApp
window.proceedMallCheckout = function() {
    if (mallCart.length === 0) {
        alert('Kapu lako liko wazi! Tafadhali weka bidhaa kwanza kabla ya kutuma oda.');
        return;
    }

    let itemsList = '';
    let total = 0;
    mallCart.forEach((item, idx) => {
        total += item.price;
        itemsList += `${idx + 1}. ${item.title} — ${formatTZS(item.price)}\n`;
    });

    const message = `Habari Genge Mall, nahitaji kukamilisha oda yangu ifuatayo:\n\n${itemsList}\n*Jumla Kuu:* ${formatTZS(total)}\n\nTafadhali nithibitishie upatikanaji na utaratibu wa malipo/usafirishaji.`;
    const url = `https://wa.me/${MALL_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
};

// Terms Modal
window.openMallTermsModal = function() {
    const modal = document.getElementById('mall-terms-modal');
    if (modal) modal.style.display = 'flex';
};

window.closeMallTermsModal = function() {
    const modal = document.getElementById('mall-terms-modal');
    if (modal) modal.style.display = 'none';
};

// Toast notification helper
function showMallToast(msg) {
    let toast = document.getElementById('mall-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'mall-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: #10B981;
            color: #ffffff;
            font-weight: 800;
            padding: 12px 24px;
            border-radius: 50px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            z-index: 9999;
            font-size: 0.92rem;
            transition: all 0.3s ease;
            pointer-events: none;
        `;
        document.body.appendChild(toast);
    }

    toast.innerText = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2800);
}

// Mobile Bottom Nav Navigation Handler
window.mallNavTo = function(target) {
    document.querySelectorAll('.mall-bnav-item').forEach(el => el.classList.remove('active'));

    if (target === 'home') {
        const item = document.getElementById('mall-bnav-home');
        if (item) item.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (target === 'dept') {
        const item = document.getElementById('mall-bnav-dept');
        if (item) item.classList.add('active');
        const deptSec = document.getElementById('mall-departments');
        if (deptSec) deptSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target === 'search') {
        const item = document.getElementById('mall-bnav-search');
        if (item) item.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const input = document.getElementById('mall-search-input');
        if (input) {
            setTimeout(() => input.focus(), 300);
        }
    }
};
