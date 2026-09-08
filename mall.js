// ==========================================================================
// GENGE MALL — JAVASCRIPT LOGIC & PRODUCT CATALOG
// ==========================================================================

const MALL_WHATSAPP_PHONE = '255799689961';
const MALL_CALL_PHONE = '+255692970687';

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

// App State
let currentDepartment = 'all';
let currentSubfilter = 'all';
let searchQuery = '';
let mallCart = [];

// Format Currency TZS
function formatTZS(amount) {
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);
}

// Initialize on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
    loadMallCartFromStorage();
    renderDepartmentPills();
    renderMallProducts();
    updateMallCartUI();
});

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

// Render Products to Grid
function renderMallProducts() {
    const grid = document.getElementById('mall-products-grid');
    const countEl = document.getElementById('results-count');
    const deptLabel = document.getElementById('active-dept-label');

    if (!grid) return;

    // Filter logic
    let filtered = mallProducts.filter(item => {
        // Department filter
        if (currentDepartment !== 'all' && item.dept !== currentDepartment) return false;

        // Subfilter (e.g. kupangisha vs kuuzwa)
        if (currentSubfilter !== 'all' && item.subType !== currentSubfilter) return false;

        // Search query filter
        if (searchQuery) {
            const matchTitle = item.title.toLowerCase().includes(searchQuery);
            const matchDesc = item.desc.toLowerCase().includes(searchQuery);
            const matchLoc = (item.location || '').toLowerCase().includes(searchQuery);
            const matchSpecs = (item.specs || []).join(' ').toLowerCase().includes(searchQuery);
            if (!matchTitle && !matchDesc && !matchLoc && !matchSpecs) return false;
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
        card.className = 'mall-card';

        // Specs list HTML
        const specsHtml = (item.specs || []).map(s => `<span class="spec-pill">${s}</span>`).join('');

        // Action Buttons based on product type
        let actionButtonsHtml = '';

        if (item.actionType === 'inquire') {
            // Real Estate: WhatsApp site visit + Call
            const waMsg = encodeURIComponent(`Habari Genge Mall, nimevutiwa na: ${item.title} ya ${formatTZS(item.price)} (${item.location}). Nahitaji kufanya ukaguzi wa eneo (Site Visit).`);
            actionButtonsHtml = `
                <div class="mall-card-actions">
                    <a href="https://wa.me/${MALL_WHATSAPP_PHONE}?text=${waMsg}" target="_blank" class="btn-card-wa">
                        <ion-icon name="logo-whatsapp"></ion-icon> Kagua WhatsApp
                    </a>
                    <a href="tel:${MALL_CALL_PHONE}" class="btn-card-call">
                        <ion-icon name="call-outline"></ion-icon> Piga Simu
                    </a>
                </div>
            `;
        } else if (item.actionType === 'car-inquire') {
            // Car: WhatsApp test drive + Call
            const waMsg = encodeURIComponent(`Habari Genge Mall, ninaulizia Gari: ${item.title} ya bei ${formatTZS(item.price)}. Nahitaji kuja kulikagua na kufanya test-drive.`);
            actionButtonsHtml = `
                <div class="mall-card-actions">
                    <a href="https://wa.me/${MALL_WHATSAPP_PHONE}?text=${waMsg}" target="_blank" class="btn-card-wa">
                        <ion-icon name="logo-whatsapp"></ion-icon> Fanya Ukaguzi
                    </a>
                    <a href="tel:${MALL_CALL_PHONE}" class="btn-card-call">
                        <ion-icon name="call-outline"></ion-icon> Piga Simu
                    </a>
                </div>
            `;
        } else {
            // Retail item (Clothes, Shoes, Beauty, Perfume, Electronics, Tools): Add to Cart + WhatsApp Buy
            const waMsg = encodeURIComponent(`Habari Genge Mall, nahitaji kuagiza: ${item.title} ya ${formatTZS(item.price)}.`);
            actionButtonsHtml = `
                <div class="mall-card-actions">
                    <a href="https://wa.me/${MALL_WHATSAPP_PHONE}?text=${waMsg}" target="_blank" class="btn-card-wa">
                        <ion-icon name="logo-whatsapp"></ion-icon> Agiza Moja kwa Moja
                    </a>
                    <button type="button" class="btn-card-cart" onclick="addToMallCart('${item.id}')">
                        <ion-icon name="cart-outline"></ion-icon> Weka Kapu
                    </button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="mall-card-img-wrap">
                <img src="${item.image}" alt="${item.title}" class="mall-card-img" onerror="this.src='pics/15.png'">
                <span class="mall-badge-tag ${item.badgeClass || ''}">${item.badge || 'GENGE MALL'}</span>
            </div>
            <div class="mall-card-body">
                <h3 class="mall-card-title">${item.title}</h3>
                <div class="mall-card-meta">
                    <ion-icon name="location-outline"></ion-icon>
                    <span>${item.location || 'Inapatikana Daresalaam'}</span>
                </div>
                <p class="mall-card-desc">${item.desc}</p>
                <div class="mall-card-specs">
                    ${specsHtml}
                </div>
                <div class="mall-card-pricing">
                    <span class="mall-price-label">Bei / Gharama:</span>
                    <div>
                        <span class="mall-price-amount">${formatTZS(item.price)}</span>
                        ${item.priceUnit ? `<span class="mall-price-unit"> ${item.priceUnit}</span>` : ''}
                    </div>
                </div>
                ${actionButtonsHtml}
            </div>
        `;

        grid.appendChild(card);
    });
}

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
