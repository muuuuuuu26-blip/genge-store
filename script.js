// API Configuration
const API_URL = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

// Data
const preMadePackages = [
    {
        id: 'pkg-1',
        title: 'Starter Pack',
        price: 55000, // Bei ya makadirio, utabadilisha
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
            '<i>Motto: Mahitaji muhimu kwa wiki nzima.</i>'
        ]
    },
    {
        id: 'pkg-2',
        title: 'Family Essentials Pack',
        price: 110000, // Bei ya makadirio
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
            '<i>Motto: Kila kitu muhimu kwa familia yako.</i>'
        ]
    },
    {
        id: 'pkg-3',
        title: 'Family Value Pack',
        price: 200000, // Bei ya makadirio
        icon: 'images/namba3.png',
        isImage: true,
        features: [
            'Mchele Kg 15',
            'Unga (Sembe + Dona) Kg 15',
            'Mafuta Lita 10',
            'Sukari Kg 5',
            'Maharage Kg 5',
            'Ngano Kg 5',
            'Nyama ya Ng\'ombe Kg 3',
            'Kuku Fresh 3',
            '<i>Motto: Thamani kubwa kwa matumizi makubwa.</i>'
        ]
    },
    {
        id: 'pkg-4',
        title: 'Premium Family Pack',
        price: 320000, // Bei ya makadirio
        icon: 'images/namba4.png',
        isImage: true,
        features: [
            'Mchele Kg 25',
            'Unga (Sembe + Dona) Kg 20',
            'Mafuta Lita 15',
            'Sukari Kg 10',
            'Maharage Kg 10',
            'Ngano Kg 10',
            'Nyama ya Ng\'ombe Kg 5',
            'Kuku Fresh 5',
            'Mayai Tray 2',
            '<i>Motto: Familia kubwa, mahitaji yote yamekamilika.</i>'
        ]
    },
    {
        id: 'pkg-5',
        title: 'Genge Royal Pack',
        price: 600000, // Bei ya makadirio
        icon: 'images/namba5.png',
        isImage: true,
        features: [
            'Mchele Kg 50',
            'Unga (Sembe + Dona) Kg 25',
            'Mafuta Lita 20',
            'Sukari Kg 15',
            'Maharage Kg 15',
            'Ngano Kg 15',
            'Nyama ya Ng\'ombe Kg 10',
            'Kuku Fresh 10',
            'Mayai Tray 5',
            'Chumvi Kg 2',
            '<i>Motto: Mwezi mzima bila wasiwasi wa sokoni.</i>'
        ]
    }
];

// Shop Categories with representative images
const shopCategories = [
    { id: 'all',        name: 'Zote',            image: 'pics/15.png' },
    { id: 'matunda',    name: 'Matunda',         image: 'pics/banana.jpg' },
    { id: 'mbogamboga', name: 'Mboga Mboga',     image: 'pics/nyanya.jpg' },
    { id: 'nyama',      name: 'Nyama & Soseji',  image: 'pics/kuku%20w%20kienyeji1.jfif' },
    { id: 'samaki',     name: 'Samaki',          image: 'pics/samaki%20sangara.jpg' },
    { id: 'nafaka',     name: 'Nafaka',          image: 'pics/mchele%20basmati.jfif' },
    { id: 'mafuta',     name: 'Mafuta',          image: 'pics/mafuta%20ya%20alizeti.webp' },
    { id: 'vinywaji',   name: 'Vinywaji',        image: 'pics/coconut.webp' },
];

let customProducts = [];

// State
let mainCart = [];
let customBuilderCart = [];
let customBuilderTotal = 0;

// Format Currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    renderPreMadePackages();
    renderCategoryTiles('all');
    await loadProductsFromAPI();
    setupEventListeners();
    setupHistoryListeners();
});

// ============================================
// ORDERS PAGE - OPEN / CLOSE
// ============================================
window.openOrdersPage = function() {
    const overlay = document.getElementById('orders-page-overlay');
    overlay.classList.add('open');
    // Prevent main page scroll while orders page is open
    document.body.style.overflow = 'hidden';

    // Angalia kama amekaa zaidi ya sekunde 10 tangu afunge ukurasa wa oda
    const lastClosed = localStorage.getItem('genge_orders_closed_time');
    if (lastClosed) {
        const timeDiff = Date.now() - parseInt(lastClosed, 10);
        if (timeDiff > 10000) { // Sekunde 10 zimepita
            // Futa namba ili imtake aingize upya
            localStorage.removeItem('genge_customer_phone');
        }
        // Futa muda uliorekodiwa
        localStorage.removeItem('genge_orders_closed_time');
    }

    // Load orders when page opens
    const savedPhone = localStorage.getItem('genge_customer_phone');
    if (savedPhone) {
        const lookupInput = document.getElementById('lookup-phone');
        if (lookupInput) lookupInput.value = savedPhone;
        showHistoryState('loading');
        fetchOrderHistory(savedPhone);
    } else {
        showHistoryState('lookup');
    }
};

window.closeOrdersPage = function() {
    const overlay = document.getElementById('orders-page-overlay');
    overlay.classList.remove('open');
    // Restore main page scroll
    document.body.style.overflow = '';

    // Rekodi muda ambao ukurasa umefungwa (kwa ajili ya hesabu ya sekunde 10)
    localStorage.setItem('genge_orders_closed_time', Date.now().toString());
};


async function loadProductsFromAPI() {
    try {
        const res = await fetch(API_URL + '/api/products');
        if (res.ok) {
            customProducts = await res.json();
            renderCustomProducts('all');
        } else {
            console.error('Failed to fetch products');
        }
    } catch (error) {
        console.error('Error fetching products from server:', error);
        // Fallback or show error
    }
}

// Render Pre-made Packages
function renderPreMadePackages() {
    const grid = document.getElementById('packages-grid');
    grid.innerHTML = '';

    preMadePackages.forEach(pkg => {
        const card = document.createElement('div');
        card.className = 'package-card glass-panel';
        
        const featuresList = pkg.features.map(f => `<li><ion-icon name="checkmark-circle"></ion-icon> ${f}</li>`).join('');
        const iconHtml = pkg.isImage
            ? `<img src="${pkg.icon}" alt="${pkg.title}" class="pkg-img-photo">`
            : pkg.icon;

        card.innerHTML = `
            <div class="pkg-icon">${iconHtml}</div>
            <h3 class="pkg-title">${pkg.title}</h3>
            <div class="pkg-price">${formatCurrency(pkg.price)}</div>
            <ul class="pkg-features">
                ${featuresList}
            </ul>
            <button class="add-pkg-btn" onclick="addPreMadeToCart('${pkg.id}')">Ongeza Kwenye Kapu</button>
        `;
        grid.appendChild(card);
    });
}

// Render Category Tiles
function renderCategoryTiles(activeId) {
    const container = document.getElementById('categories-tiles');
    if (!container) return;
    container.innerHTML = '';
    shopCategories.forEach(cat => {
        const tile = document.createElement('div');
        tile.className = 'cat-tile' + (cat.id === activeId ? ' active' : '');
        tile.dataset.category = cat.id;
        tile.innerHTML = `
            <div class="cat-tile-img-wrap">
                <img src="${cat.image}" alt="${cat.name}" class="cat-tile-img" onerror="this.src='pics/15.png'">
            </div>
            <div class="cat-tile-name">${cat.name}</div>
        `;
        tile.addEventListener('click', () => {
            document.querySelectorAll('.cat-tile').forEach(t => t.classList.remove('active'));
            tile.classList.add('active');
            renderCustomProducts(cat.id);
        });
        container.appendChild(tile);
    });
}

// Render Custom Products (new card design)
function renderCustomProducts(category) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    const filtered = category === 'all'
        ? customProducts
        : customProducts.filter(p => p.category === category);

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="empty-msg" style="grid-column:1/-1;padding:2rem">Hakuna bidhaa katika kundi hili bado.</p>';
        return;
    }

    filtered.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card-new';
        const imgHtml = prod.isImage
            ? `<img src="${prod.icon}" alt="${prod.name}" class="prod-card-img" onerror="this.src='pics/15.png'">`
            : `<div class="prod-card-emoji">${prod.icon}</div>`;
        card.innerHTML = `
            <div class="prod-card-img-wrap">${imgHtml}</div>
            <div class="prod-card-body">
                <div class="prod-card-name">${prod.name}</div>
                <div class="prod-card-footer">
                    <span class="prod-card-price">${formatCurrency(prod.price)}</span>
                    <button class="prod-add-btn" onclick="addToCustomBuilder('${prod.id}')" title="Ongeza">
                        <ion-icon name="add-outline"></ion-icon>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Prepare checkout modal fields, handling normal and reorder checkouts
function prepareCheckoutFields() {
    const savedName = localStorage.getItem('genge_customer_name') || '';
    const savedPhone = localStorage.getItem('genge_customer_phone') || '';
    const savedLocation = localStorage.getItem('genge_customer_location') || '';
    
    const reorderLocGroup = document.getElementById('reorder-location-toggle-group');
    const sameLocCheckbox = document.getElementById('c-same-location');
    const locInput = document.getElementById('c-location');
    const latInput = document.getElementById('c-lat');
    const lngInput = document.getElementById('c-lng');
    const locStatus = document.getElementById('location-status');
    const btnLocation = document.getElementById('btn-get-location');

    // Reset location status and button appearance
    if (locStatus) locStatus.innerText = '';
    if (btnLocation) {
        btnLocation.style.borderColor = "var(--border)";
        btnLocation.style.color = "var(--text)";
        btnLocation.innerHTML = '<ion-icon name="location-outline"></ion-icon> Chukua Location Yangu ya Sasa';
    }

    if (window.currentReorder && window.currentReorder.customer) {
        document.getElementById('c-name').value = window.currentReorder.customer.name || savedName;
        document.getElementById('c-phone').value = window.currentReorder.customer.phone || savedPhone;
        locInput.value = window.currentReorder.customer.location || savedLocation;
        
        // Show same-location checkbox option for reorders
        if (reorderLocGroup) reorderLocGroup.style.display = 'block';
        if (sameLocCheckbox) sameLocCheckbox.checked = true;
        
        // Lock location field by default for reorders using previous location
        locInput.readOnly = true;
        locInput.style.backgroundColor = '#f3f4f6';
        locInput.style.cursor = 'not-allowed';
        
        // Set previous GPS coordinates if they exist
        if (window.currentReorder.customer.gps && window.currentReorder.customer.gps.lat && window.currentReorder.customer.gps.lng) {
            latInput.value = window.currentReorder.customer.gps.lat;
            lngInput.value = window.currentReorder.customer.gps.lng;
            if (locStatus) {
                locStatus.innerText = "✅ Itatumia location/GPS ya oda ya mwanzo.";
                locStatus.style.color = "green";
            }
        } else {
            latInput.value = '';
            lngInput.value = '';
            if (locStatus) {
                locStatus.innerText = "Oda ya mwanzo haina ramani (GPS). Unaweza kuchukua upya.";
                locStatus.style.color = "var(--text-muted)";
            }
        }
    } else {
        document.getElementById('c-name').value = savedName;
        document.getElementById('c-phone').value = savedPhone;
        locInput.value = savedLocation;
        locInput.readOnly = false;
        locInput.style.backgroundColor = '';
        locInput.style.cursor = '';
        
        if (reorderLocGroup) reorderLocGroup.style.display = 'none';
        if (sameLocCheckbox) sameLocCheckbox.checked = false;
        latInput.value = '';
        lngInput.value = '';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('ion-icon');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('name', 'close-outline');
            } else {
                icon.setAttribute('name', 'grid-outline');
            }
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('ion-icon').setAttribute('name', 'grid-outline');
            });
        });
    }

    // Cart Sidebar toggle
    document.getElementById('cart-icon').addEventListener('click', () => {
        document.getElementById('cart-overlay').classList.add('active');
    });
    
    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-overlay').classList.remove('active');
    });

    // Custom Builder Add to Main Cart
    document.getElementById('add-custom-btn').addEventListener('click', () => {
        if (customBuilderTotal >= 5000) {
            addCustomBundleToMainCart();
        }
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (mainCart.length > 0) {
            prepareCheckoutFields();
            document.getElementById('checkout-modal').classList.add('active');
        } else {
            showToast('Kapu lako liko wazi!');
        }
    });
    
    // Close checkout modal
    document.getElementById('close-checkout').addEventListener('click', () => {
        document.getElementById('checkout-modal').classList.remove('active');
        window.currentReorder = null;
        prepareCheckoutFields();
    });

    // Close M-Pesa modal (go back to checkout)
    document.getElementById('close-mpesa').addEventListener('click', () => {
        document.getElementById('mpesa-modal').classList.remove('active');
        document.getElementById('checkout-modal').classList.add('active');
    });

    // M-Pesa confirm button — submit order as PAID
    document.getElementById('mpesa-confirm-btn').addEventListener('click', () => {
        const btn = document.getElementById('mpesa-confirm-btn');
        btn.disabled = true;
        btn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon> Inatuma Oda...';
        submitOrder('paid').finally(() => {
            btn.disabled = false;
            btn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> Nimethibitisha Malipo — Tuma Oda';
        });
    });
    
    // Handle order submission — show M-Pesa modal first
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        showMpesaModal();
    });

    // Handle Same Location Checkbox
    const sameLocCheckbox = document.getElementById('c-same-location');
    if (sameLocCheckbox) {
        sameLocCheckbox.addEventListener('change', () => {
            const locInput = document.getElementById('c-location');
            const latInput = document.getElementById('c-lat');
            const lngInput = document.getElementById('c-lng');
            const locStatus = document.getElementById('location-status');
            const btnLoc = document.getElementById('btn-get-location');

            if (sameLocCheckbox.checked) {
                if (window.currentReorder && window.currentReorder.customer) {
                    locInput.value = window.currentReorder.customer.location || '';
                    locInput.readOnly = true;
                    locInput.style.backgroundColor = '#f3f4f6';
                    locInput.style.cursor = 'not-allowed';

                    if (window.currentReorder.customer.gps && window.currentReorder.customer.gps.lat && window.currentReorder.customer.gps.lng) {
                        latInput.value = window.currentReorder.customer.gps.lat;
                        lngInput.value = window.currentReorder.customer.gps.lng;
                        locStatus.innerText = "✅ Itatumia location/GPS ya oda ya mwanzo.";
                        locStatus.style.color = "green";
                    } else {
                        latInput.value = '';
                        lngInput.value = '';
                        locStatus.innerText = "Oda ya mwanzo haina ramani (GPS). Unaweza kuchukua upya.";
                        locStatus.style.color = "var(--text-muted)";
                    }
                }
            } else {
                locInput.readOnly = false;
                locInput.style.backgroundColor = '';
                locInput.style.cursor = '';
                latInput.value = '';
                lngInput.value = '';
                locStatus.innerText = '';

                if (btnLoc) {
                    btnLoc.style.borderColor = "var(--border)";
                    btnLoc.style.color = "var(--text)";
                    btnLoc.innerHTML = '<ion-icon name="location-outline"></ion-icon> Chukua Location Yangu ya Sasa';
                }
            }
        });
    }

    // Handle Get Location
    const btnLocation = document.getElementById('btn-get-location');
    const locStatus = document.getElementById('location-status');
    const latInput = document.getElementById('c-lat');
    const lngInput = document.getElementById('c-lng');

    if (btnLocation) {
        btnLocation.addEventListener('click', () => {
            // If they click to get current location, they are choosing a new/current spot
            if (sameLocCheckbox && sameLocCheckbox.checked) {
                sameLocCheckbox.checked = false;
                const locInput = document.getElementById('c-location');
                locInput.readOnly = false;
                locInput.style.backgroundColor = '';
                locInput.style.cursor = '';
            }

            if (!navigator.geolocation) {
                locStatus.innerText = "Kivinjari chako hakikubali kuchukua location.";
                locStatus.style.color = "red";
                return;
            }

            locStatus.innerText = "Inatafuta location...";
            locStatus.style.color = "var(--primary)";

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    latInput.value = lat;
                    lngInput.value = lng;
                    
                    locStatus.innerText = `✅ Location imechukuliwa kikamilifu!`;
                    locStatus.style.color = "green";
                    btnLocation.style.borderColor = "green";
                    btnLocation.style.color = "green";
                    btnLocation.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> Tayari';
                },
                (error) => {
                    locStatus.innerText = "Tumeshindwa kuchukua location. Tafadhali ruhusu (allow) kwenye browser.";
                    locStatus.style.color = "red";
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
            );
        });
    }
}

// Show M-Pesa Payment Modal
function showMpesaModal() {
    // Calculate total from mainCart
    let totalAmount = 0;
    mainCart.forEach(item => totalAmount += item.price);
    const formatted = formatCurrency(totalAmount);

    // Update amount displays
    document.getElementById('mpesa-amount').innerText = formatted;
    document.getElementById('mpesa-amount-vodacom').innerText = formatted;
    document.getElementById('mpesa-amount-tigo').innerText = formatted;
    document.getElementById('mpesa-amount-airtel').innerText = formatted;

    // Close checkout, open mpesa
    document.getElementById('checkout-modal').classList.remove('active');
    resetMpesaModal();
    document.getElementById('mpesa-modal').classList.add('active');
}

// Submit Order to Server
async function submitOrder(paymentStatus = 'pending') {
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    const location = document.getElementById('c-location').value;
    const lat = document.getElementById('c-lat').value;
    const lng = document.getElementById('c-lng').value;
    
    let totalAmount = 0;
    mainCart.forEach(item => totalAmount += item.price);
    
    // Check same location checkbox
    const sameLocCheckbox = document.getElementById('c-same-location');
    const sameLocGroup = document.getElementById('reorder-location-toggle-group');
    let finalLocation = location;
    
    if (sameLocCheckbox && sameLocCheckbox.checked && sameLocGroup && sameLocGroup.style.display !== 'none') {
        if (!finalLocation.startsWith('[Sehemu ileile]')) {
            finalLocation = '[Sehemu ileile] ' + finalLocation;
        }
    }
    
    const newOrder = {
        id: 'ORD-' + Date.now(),
        date: new Date().toLocaleString('sw-TZ'),
        customer: { 
            name, 
            phone, 
            location: finalLocation,
            gps: (lat && lng) ? { lat, lng } : null
        },
        items: mainCart,
        deliveryCharge: 0,
        paymentStatus: paymentStatus,
        total: totalAmount,
        status: 'pending' // pending, accepted, rejected
    };
    
    try {
        const response = await fetch(API_URL + '/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOrder)
        });

        if (response.ok) {
            // Save customer info to localStorage for history feature (save original location text without badge)
            localStorage.setItem('genge_customer_name', name);
            localStorage.setItem('genge_customer_phone', phone);
            localStorage.setItem('genge_customer_location', location);

            // Clear cart and close modals
            mainCart = [];
            updateMainCartUI();
            document.getElementById('checkout-form').reset();
            window.currentReorder = null;
            prepareCheckoutFields();
            
            // EXPLICITLY clear hidden GPS inputs
            document.getElementById('c-lat').value = '';
            document.getElementById('c-lng').value = '';
            
            // Reset location status text
            document.getElementById('location-status').innerText = '';
            const btnLocation = document.getElementById('btn-get-location');
            if (btnLocation) {
                btnLocation.style.borderColor = "var(--border)";
                btnLocation.style.color = "var(--text)";
                btnLocation.innerHTML = '<ion-icon name="location-outline"></ion-icon> Chukua Location Yangu ya Sasa';
            }

            document.getElementById('mpesa-modal').classList.remove('active');
            document.getElementById('checkout-modal').classList.remove('active');
            document.getElementById('cart-overlay').classList.remove('active');
            
            if (paymentStatus === 'paid') {
                showToast('✅ Asante! Oda yako imetumwa. Tutakufikia hivi karibuni!');
            } else {
                showToast('Oda yako imetumwa kikamilifu!');
            }
        } else {
            const result = await response.json();
            showToast('Kosa: ' + result.message);
        }
    } catch (error) {
        console.error('Error submitting order:', error);
        showToast('Kuna tatizo la mtandao wakati wa kutuma oda.');
    }
}

// Add Item to Custom Builder
window.addToCustomBuilder = function(productId) {
    const product = customProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = customBuilderCart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        customBuilderCart.push({ ...product, quantity: 1 });
    }

    updateCustomBuilderUI();
    showToast(`${product.name} imeongezwa!`);
};

// Remove/Decrease from Custom Builder
window.removeFromCustomBuilder = function(productId) {
    const itemIndex = customBuilderCart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        if (customBuilderCart[itemIndex].quantity > 1) {
            customBuilderCart[itemIndex].quantity -= 1;
        } else {
            customBuilderCart.splice(itemIndex, 1);
        }
    }
    updateCustomBuilderUI();
};

// Update Custom Builder UI
function updateCustomBuilderUI() {
    const container = document.getElementById('custom-cart-items');
    
    if (customBuilderCart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Hujachagua bidhaa yoyote bado.</p>';
        customBuilderTotal = 0;
    } else {
        container.innerHTML = '';
        customBuilderTotal = 0;

        customBuilderCart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            customBuilderTotal += itemTotal;

            const el = document.createElement('div');
            el.className = 'custom-item';
            const miniIcon = item.isImage
                ? `<img src="${item.icon}" alt="${item.name}" class="cart-mini-img">`
                : item.icon;
            el.innerHTML = `
                <div class="custom-item-info">
                    <span class="custom-item-name">${miniIcon} ${item.name}</span>
                    <span>${item.quantity} x ${formatCurrency(item.price)}</span>
                </div>
                <div class="custom-item-controls">
                    <button onclick="removeFromCustomBuilder('${item.id}')"><ion-icon name="remove-outline"></ion-icon></button>
                    <span>${item.quantity}</span>
                    <button onclick="addToCustomBuilder('${item.id}')"><ion-icon name="add-outline"></ion-icon></button>
                </div>
            `;
            container.appendChild(el);
        });
    }

    document.getElementById('custom-total').innerText = formatCurrency(customBuilderTotal);

    // Check minimum requirement
    const btn = document.getElementById('add-custom-btn');
    const alert = document.getElementById('min-order-alert');
    
    if (customBuilderTotal >= 5000) {
        btn.disabled = false;
        alert.className = 'min-order-alert success';
        alert.innerHTML = 'Kiwango kimefikiwa! Unaweza kuongeza kwenye kapu.';
    } else {
        btn.disabled = true;
        alert.className = 'min-order-alert';
        const remaining = 5000 - customBuilderTotal;
        alert.innerHTML = `Bado ${formatCurrency(remaining)} kufikisha kima cha chini (Tsh 5,000)`;
    }
}

// Add Pre-made package to Main Cart
window.addPreMadeToCart = function(pkgId) {
    const pkg = preMadePackages.find(p => p.id === pkgId);
    if (!pkg) return;

    const cartItem = {
        cartId: Date.now().toString(), // unique id for cart
        type: 'premade',
        title: pkg.title,
        price: pkg.price,
        details: 'Kifurushi Kilichoandaliwa',
        quantity: 1
    };

    mainCart.push(cartItem);
    updateMainCartUI();
    showToast(`${pkg.title} imeongezwa kwenye kapu!`);
};

// Add Custom Bundle to Main Cart
function addCustomBundleToMainCart() {
    if (customBuilderTotal < 5000) return;

    // Create a string of items
    const details = customBuilderCart.map(i => `${i.quantity}x ${i.name}`).join(', ');

    const cartItem = {
        cartId: Date.now().toString(),
        type: 'custom',
        title: 'Kifurushi Binafsi',
        price: customBuilderTotal,
        details: details,
        quantity: 1
    };

    mainCart.push(cartItem);
    
    // Clear builder
    customBuilderCart = [];
    updateCustomBuilderUI();
    
    updateMainCartUI();
    showToast('Kifurushi chako kimeongezwa kwenye kapu!');
    
    // Open sidebar
    document.getElementById('cart-overlay').classList.add('active');
}

// Remove from Main Cart
window.removeFromMainCart = function(cartId) {
    mainCart = mainCart.filter(item => item.cartId !== cartId);
    updateMainCartUI();
};

// Update Main Cart UI
function updateMainCartUI() {
    const countEl = document.getElementById('cart-count');
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('main-cart-total');

    countEl.innerText = mainCart.length;

    if (mainCart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Kapu lako liko wazi.</p>';
        totalEl.innerText = formatCurrency(0);
        return;
    }

    container.innerHTML = '';
    let total = 0;

    mainCart.forEach(item => {
        total += item.price;
        const el = document.createElement('div');
        el.className = 'cart-package';
        el.innerHTML = `
            <div class="cart-pkg-header">
                <span class="cart-pkg-title">${item.title}</span>
                <button class="remove-pkg" onclick="removeFromMainCart('${item.cartId}')"><ion-icon name="trash-outline"></ion-icon></button>
            </div>
            <div class="cart-pkg-details">${item.details}</div>
            <div class="cart-pkg-price">${formatCurrency(item.price)}</div>
        `;
        container.appendChild(el);
    });

    totalEl.innerText = formatCurrency(total);
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Feedback Logic ---
const openFeedbackBtn = document.getElementById('open-feedback-btn');
const closeFeedbackBtn = document.getElementById('close-feedback');
const feedbackModal = document.getElementById('feedback-modal');
const feedbackForm = document.getElementById('feedback-form');
const feedbackStatus = document.getElementById('feedback-status');

if (openFeedbackBtn && feedbackModal && closeFeedbackBtn) {
    openFeedbackBtn.addEventListener('click', () => {
        feedbackModal.classList.add('active');
    });

    closeFeedbackBtn.addEventListener('click', () => {
        feedbackModal.classList.remove('active');
        feedbackStatus.innerText = '';
    });
}

if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        feedbackStatus.innerText = 'Inatuma...';
        feedbackStatus.style.color = '#fff';

        const formData = new FormData(feedbackForm);
        const data = {
            name: formData.get('name'),
            message: formData.get('message')
        };

        try {
            const response = await fetch(API_URL + '/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                feedbackStatus.innerText = '✅ Maoni yako yametumwa kikamilifu. Asante!';
                feedbackStatus.style.color = '#10B981'; // Green
                feedbackForm.reset();
                setTimeout(() => {
                    feedbackModal.classList.remove('active');
                    feedbackStatus.innerText = '';
                }, 3000);
            } else {
                feedbackStatus.innerText = '❌ Kosa: ' + result.message;
                feedbackStatus.style.color = '#EF4444'; // Red
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            feedbackStatus.innerText = '❌ Tatizo la mtandao.';
            feedbackStatus.style.color = '#EF4444';
        }
    });
}

// ============================================
// ORDER HISTORY & RE-ORDER
// ============================================

function setupHistoryListeners() {
    // Phone lookup form
    const lookupForm = document.getElementById('lookup-form');
    if (lookupForm) {
        lookupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('lookup-phone').value.trim();
            if (phone) {
                localStorage.setItem('genge_customer_phone', phone);
                showHistoryState('loading');
                fetchOrderHistory(phone);
            }
        });
    }

    // Logout / switch account
    const logoutBtn = document.getElementById('history-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('genge_customer_name');
            localStorage.removeItem('genge_customer_phone');
            const lookupInput = document.getElementById('lookup-phone');
            if (lookupInput) lookupInput.value = '';
            showHistoryState('lookup');
        });
    }

    // Try again button (no orders found)
    const tryAgainBtn = document.getElementById('try-again-btn');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', () => {
            showHistoryState('lookup');
        });
    }

    // Refresh button in dashboard
    const refreshBtn = document.getElementById('history-refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const savedPhone = localStorage.getItem('genge_customer_phone');
            if (savedPhone) {
                showHistoryState('loading');
                fetchOrderHistory(savedPhone);
            }
        });
    }
}

function showHistoryState(state) {
    const lookup    = document.getElementById('history-lookup');
    const dashboard = document.getElementById('history-dashboard');
    const empty     = document.getElementById('history-empty');
    const loading   = document.getElementById('history-loading');

    // Hide all first
    if (lookup)    { lookup.style.display    = 'none'; }
    if (dashboard) { dashboard.style.display = 'none'; }
    if (empty)     { empty.style.display     = 'none'; }
    if (loading)   { loading.style.display   = 'none'; }

    // Show the correct one
    if (state === 'lookup'    && lookup)    lookup.style.display    = 'block';
    if (state === 'dashboard' && dashboard) dashboard.style.display = 'block';
    if (state === 'empty'     && empty)     empty.style.display     = 'flex';
    if (state === 'loading'   && loading)   loading.style.display   = 'flex';
}

async function fetchOrderHistory(phone) {
    // Show loading spinner
    showHistoryState('loading');

    const btn = document.getElementById('lookup-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon> Inatafuta...';
    }

    try {
        const res = await fetch(API_URL + '/api/orders/customer/' + encodeURIComponent(phone));
        if (!res.ok) throw new Error('Kosa la seva: ' + res.status);
        const orders = await res.json();

        if (!Array.isArray(orders) || orders.length === 0) {
            showHistoryState('empty');
        } else {
            renderOrderHistory(orders);
            showHistoryState('dashboard');
        }
    } catch (err) {
        console.error('Error fetching history:', err);
        // Clear saved phone if server unreachable so user can retry
        showHistoryState('lookup');
        showToast('❌ Tatizo la mtandao. Hakikisha server inafanya kazi.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<ion-icon name="search-outline"></ion-icon> Tafuta Oda Zangu';
        }
    }
}

function statusLabel(status) {
    if (status === 'accepted') return { text: '✅ Imekubaliwa', cls: 'badge-accepted' };
    if (status === 'rejected') return { text: '❌ Imekataliwa', cls: 'badge-rejected' };
    return { text: '⏳ Inasubiri', cls: 'badge-pending' };
}

function renderOrderHistory(orders) {
    const savedName  = localStorage.getItem('genge_customer_name')  || '';
    const savedPhone = localStorage.getItem('genge_customer_phone') || '';

    // Greeting bar
    if (savedName) {
        document.getElementById('greeting-avatar').textContent = savedName.charAt(0).toUpperCase();
        document.getElementById('greeting-name').textContent  = 'Karibu tena, ' + savedName + '!';
    } else {
        document.getElementById('greeting-name').textContent  = 'Karibu tena!';
    }
    document.getElementById('greeting-phone').textContent = '📞 ' + savedPhone;

    // ── Last order spotlight ──────────────────────────────────────
    const last = orders[0];
    const lastSpotlight = document.getElementById('last-order-spotlight');
    if (last) {
        const sl = statusLabel(last.status);
        document.getElementById('last-order-status').textContent = sl.text;
        document.getElementById('last-order-status').className   = 'order-status-badge ' + sl.cls;
        document.getElementById('last-order-id').textContent   = last.id;
        document.getElementById('last-order-date').textContent  = '🗓 ' + last.date;
        document.getElementById('last-order-total').textContent = formatCurrency(last.total);

        const itemsEl = document.getElementById('last-order-items');
        itemsEl.innerHTML = last.items.map(i =>
            `<div class="spotlight-item"><ion-icon name="checkmark-circle-outline"></ion-icon> ${i.title} — <em>${i.details || ''}</em></div>`
        ).join('');

        document.getElementById('reorder-last-btn').onclick = () => reorderOrder(last);
        lastSpotlight.style.display = 'block';
    } else {
        lastSpotlight.style.display = 'none';
    }

    // ── All orders list ───────────────────────────────────────────
    const listEl = document.getElementById('history-list');
    listEl.innerHTML = '';

    orders.forEach((order, idx) => {
        const sl = statusLabel(order.status);
        const card = document.createElement('div');
        card.className = 'history-card glass-panel';
        card.innerHTML = `
            <div class="history-card-header">
                <div class="history-card-left">
                    <span class="history-order-id">${order.id}</span>
                    <span class="history-order-date">🗓 ${order.date}</span>
                </div>
                <span class="order-status-badge ${sl.cls}">${sl.text}</span>
            </div>
            <div class="history-card-items">
                ${order.items.map(i => `<span class="history-item-chip">${i.title}</span>`).join('')}
            </div>
            <div class="history-card-footer">
                <span class="history-card-total">${formatCurrency(order.total)}</span>
                <button class="reorder-small-btn" onclick="reorderOrder(${JSON.stringify(order).replace(/"/g, '&quot;')})">  
                    <ion-icon name="refresh-outline"></ion-icon> Agiza Tena
                </button>
            </div>
        `;
        listEl.appendChild(card);
    });
}

window.reorderOrder = function(order) {
    if (!order || !order.items || order.items.length === 0) {
        showToast('Oda hii haina bidhaa.');
        return;
    }

    // Add items to main cart
    order.items.forEach(item => {
        mainCart.push({
            cartId:   Date.now().toString() + Math.random().toString(36).slice(2),
            type:     item.type    || 'reorder',
            title:    item.title   || 'Bidhaa',
            price:    item.price   || 0,
            details:  item.details || '',
            quantity: item.quantity || 1
        });
    });
    updateMainCartUI();

    // Save customer info from this order so checkout can pre-fill it
    if (order.customer) {
        window.currentReorder = order;
    }

    // Fill popup with item list
    const popupItems = document.getElementById('reorder-popup-items');
    if (popupItems) {
        popupItems.innerHTML = order.items.map(i =>
            `<div class="reorder-popup-item">
                <ion-icon name="checkmark-circle-outline"></ion-icon>
                <span>${i.title}</span>
                <strong>${formatCurrency(i.price)}</strong>
            </div>`
        ).join('');
    }

    // Show popup
    const popup = document.getElementById('reorder-popup');
    if (popup) {
        popup.style.display = 'flex';
        popup.style.opacity = '0';
        requestAnimationFrame(() => { popup.style.opacity = '1'; });
    }
};

// Reorder Popup Buttons
document.addEventListener('DOMContentLoaded', () => {
    // "Endelea na Malipo" — skip cart sidebar, open checkout modal directly with pre-filled data
    document.getElementById('reorder-popup-checkout')?.addEventListener('click', () => {
        document.getElementById('reorder-popup').style.display = 'none';
        closeOrdersPage(); // Close the orders history overlay

        if (mainCart.length > 0) {
            // Pre-fill checkout fields from saved customer data or current reorder
            const savedName     = localStorage.getItem('genge_customer_name')     || '';
            const savedPhone    = localStorage.getItem('genge_customer_phone')    || '';
            const savedLocation = localStorage.getItem('genge_customer_location') || '';

            if (window.currentReorder && window.currentReorder.customer) {
                document.getElementById('c-name').value     = window.currentReorder.customer.name     || savedName;
                document.getElementById('c-phone').value    = window.currentReorder.customer.phone    || savedPhone;
                document.getElementById('c-location').value = window.currentReorder.customer.location || savedLocation;
            } else {
                document.getElementById('c-name').value     = savedName;
                document.getElementById('c-phone').value    = savedPhone;
                document.getElementById('c-location').value = savedLocation;
            }

            // Open checkout modal directly (bypass cart sidebar)
            document.getElementById('checkout-modal').classList.add('active');
        } else {
            showToast('Kapu lako liko wazi!');
        }
    });

    // "Ongeza Bidhaa Zaidi" — close popup, close history page, scroll to products
    document.getElementById('reorder-popup-close')?.addEventListener('click', () => {
        document.getElementById('reorder-popup').style.display = 'none';
        if(typeof closeOrdersPage === 'function') {
            closeOrdersPage();
        }
        document.getElementById('custom-builder')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Close popup clicking outside
    document.getElementById('reorder-popup')?.addEventListener('click', (e) => {
        if (e.target.id === 'reorder-popup') {
            document.getElementById('reorder-popup').style.display = 'none';
        }
    });
});


// =============================================
// M-PESA 2-STEP FLOW
// =============================================
const networkConfig = {
    vodacom: { label: 'M-Pesa',      color: '#e60000', bgClass: 'selected-vodacom', badgeStyle: 'background:#e60000;' },
    tigo:    { label: 'Tigo Pesa',   color: '#00aaff', bgClass: 'selected-tigo',    badgeStyle: 'background:#00aaff;' },
    airtel:  { label: 'Airtel Money',color: '#ff6600', bgClass: 'selected-airtel',  badgeStyle: 'background:#ff6600;' }
};

function selectNetwork(network) {
    const cfg = networkConfig[network];

    // Hide step 1, show step 2 and footer
    document.getElementById('mpesa-step-1').style.display = 'none';
    document.getElementById('mpesa-step-2').style.display = 'block';
    document.getElementById('mpesa-footer').style.display = 'block';

    // Show correct steps, hide others
    ['vodacom','tigo','airtel'].forEach(n => {
        document.getElementById('steps-' + n).style.display = (n === network) ? 'block' : 'none';
    });

    // Update selected badge
    const badge = document.getElementById('mpesa-selected-badge');
    badge.textContent = cfg.label;
    badge.style.cssText = cfg.badgeStyle + 'color:white;';
}

function goBackToNetworks() {
    document.getElementById('mpesa-step-1').style.display = 'block';
    document.getElementById('mpesa-step-2').style.display = 'none';
    document.getElementById('mpesa-footer').style.display = 'none';
}

// Reset mpesa modal to step 1 when opened
function resetMpesaModal() {
    document.getElementById('mpesa-step-1').style.display = 'block';
    document.getElementById('mpesa-step-2').style.display = 'none';
    document.getElementById('mpesa-footer').style.display = 'none';
}
