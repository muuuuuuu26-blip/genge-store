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
    setupStkPushListeners();
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
    // Baada ya kurender, onyesha hali ya kapu kwa kila kadi
    refreshProductCardStates();
}

// Onyesha badge ya idadi na hali ya "imo kwenye kapu" kwenye kadi za bidhaa
function refreshProductCardStates() {
    const cards = document.querySelectorAll('.product-card-new');
    cards.forEach(card => {
        const btn = card.querySelector('.prod-add-btn');
        if (!btn) return;

        const onclickAttr = btn.getAttribute('onclick') || '';
        const match = onclickAttr.match(/addToCustomBuilder\(['"](.+?)['"]\)/);
        if (!match) return;
        const productId = match[1];

        const cartItem = customBuilderCart.find(i => i.id === productId);

        // Futa badge ya zamani
        const oldBadge = card.querySelector('.prod-card-badge');
        if (oldBadge) oldBadge.remove();

        if (cartItem && cartItem.quantity > 0) {
            card.classList.add('in-cart');
            const badge = document.createElement('div');
            badge.className = 'prod-card-badge';
            badge.textContent = cartItem.quantity;
            card.appendChild(badge);
        } else {
            card.classList.remove('in-cart');
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Cart Sidebar toggle
    const feedbackBtn = document.getElementById('open-feedback-btn');

    document.getElementById('cart-icon').addEventListener('click', () => {
        document.getElementById('cart-overlay').classList.add('active');
        if (feedbackBtn) feedbackBtn.style.display = 'none';
    });
    
    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-overlay').classList.remove('active');
        if (feedbackBtn) feedbackBtn.style.display = 'flex';
    });

    // Custom Builder Add to Main Cart
    document.getElementById('add-custom-btn').addEventListener('click', () => {
        document.getElementById('cart-overlay').classList.add('active');
        if (feedbackBtn) feedbackBtn.style.display = 'none';
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (mainCart.length > 0) {
            // Auto-fill inputs if data exists
            const savedName = localStorage.getItem('genge_customer_name') || '';
            const savedPhone = localStorage.getItem('genge_customer_phone') || '';
            const savedLocation = localStorage.getItem('genge_customer_location') || '';
            
            // Prioritize current reorder if available, otherwise use localStorage
            if (window.currentReorder && window.currentReorder.customer) {
                document.getElementById('c-name').value = window.currentReorder.customer.name || savedName;
                document.getElementById('c-phone').value = window.currentReorder.customer.phone || savedPhone;
                document.getElementById('c-location').value = window.currentReorder.customer.location || savedLocation;
            } else {
                document.getElementById('c-name').value = savedName;
                document.getElementById('c-phone').value = savedPhone;
                document.getElementById('c-location').value = savedLocation;
            }

            document.getElementById('checkout-modal').classList.add('active');
        } else {
            showToast('Kapu lako liko wazi!');
        }
    });
    
    // Close checkout modal
    document.getElementById('close-checkout').addEventListener('click', () => {
        document.getElementById('checkout-modal').classList.remove('active');
        if (feedbackBtn) feedbackBtn.style.display = 'flex';
    });
    
    // Handle order submission
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitOrder();
    });

    // Setup checkout modal provider card clicks
    const checkoutCards = document.querySelectorAll('#checkout-providers-grid .stk-provider-card');
    checkoutCards.forEach(card => {
        card.addEventListener('click', () => {
            checkoutCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Auto-detect provider in checkout form as user types phone number
    const cPhoneInput = document.getElementById('c-phone');
    if (cPhoneInput) {
        cPhoneInput.addEventListener('input', (e) => {
            autoSelectProviderByPhone(e.target.value.trim());
        });
    }

    // Handle Get Location
    const btnLocation = document.getElementById('btn-get-location');
    const locStatus = document.getElementById('location-status');
    const latInput = document.getElementById('c-lat');
    const lngInput = document.getElementById('c-lng');

    if (btnLocation) {
        btnLocation.addEventListener('click', () => {
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

// Submit Order to Server
async function submitOrder() {
    const name = document.getElementById('c-name').value;
    const phone = document.getElementById('c-phone').value;
    const location = document.getElementById('c-location').value;
    const lat = document.getElementById('c-lat').value;
    const lng = document.getElementById('c-lng').value;
    
    const selectedNetworkEl = document.querySelector('input[name="checkout_provider"]:checked');
    const paymentNetwork = selectedNetworkEl ? selectedNetworkEl.value : 'VodaCom M-Pesa';
    
    let totalAmount = 0;
    mainCart.forEach(item => totalAmount += item.price);
    
    const newOrder = {
        id: 'ORD-' + Date.now(),
        date: new Date().toLocaleString('sw-TZ'),
        customer: { 
            name, 
            phone, 
            location,
            gps: (lat && lng) ? { lat, lng } : null
        },
        paymentNetwork: paymentNetwork,
        items: mainCart,
        deliveryCharge: 0,
        paymentStatus: 'pending',
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
            // Save customer info to localStorage for history feature
            localStorage.setItem('genge_customer_name', name);
            localStorage.setItem('genge_customer_phone', phone);
            localStorage.setItem('genge_customer_location', location);

            // Clear cart and close modals
            mainCart = [];
            updateMainCartUI();
            document.getElementById('checkout-form').reset();
            
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

            document.getElementById('checkout-modal').classList.remove('active');
            document.getElementById('cart-overlay').classList.remove('active');
            
            showToast('Oda yako imetumwa kikamilifu!');

            // Open STK Push Modal to prompt payment immediately
            setTimeout(() => {
                openStkPushModal(newOrder.id, newOrder.total, phone);
            }, 500);
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
    refreshProductCardStates();
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
    refreshProductCardStates();
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
        btn.innerHTML = 'Fungua Kapu na Ulipie <ion-icon name="arrow-forward-outline"></ion-icon>';
        btn.disabled = false;
        alert.className = 'min-order-alert success';
        alert.innerHTML = 'Kiwango kimefikiwa! Kifurushi kipo tayari kwenye kapu.';
    } else if (customBuilderTotal > 0) {
        btn.innerHTML = 'Fungua Kapu na Ulipie <ion-icon name="arrow-forward-outline"></ion-icon>';
        btn.disabled = false;
        alert.className = 'min-order-alert';
        const remaining = 5000 - customBuilderTotal;
        alert.innerHTML = `Bado ${formatCurrency(remaining)} kufikisha kima cha chini (Tsh 5,000)`;
    } else {
        btn.innerHTML = 'Weka Kifurushi Kwenye Kapu';
        btn.disabled = true;
        alert.className = 'min-order-alert';
        alert.innerHTML = 'Bado Tsh 5,000/= kufikisha kima cha chini';
    }

    // Automatically sync to main cart
    syncCustomBuilderToMainCart();
}

function syncCustomBuilderToMainCart() {
    customBuilderTotal = customBuilderCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const customItemIndex = mainCart.findIndex(item => item.type === 'custom');

    if (customBuilderCart.length === 0) {
        if (customItemIndex > -1) {
            mainCart.splice(customItemIndex, 1);
        }
    } else {
        const details = customBuilderCart.map(i => `${i.quantity}x ${i.name}`).join(', ');
        
        const updatedItem = {
            cartId: customItemIndex > -1 ? mainCart[customItemIndex].cartId : Date.now().toString(),
            type: 'custom',
            title: 'Kifurushi Binafsi',
            price: customBuilderTotal,
            details: details,
            quantity: 1
        };

        if (customItemIndex > -1) {
            mainCart[customItemIndex] = updatedItem;
        } else {
            mainCart.push(updatedItem);
        }
    }

    updateMainCartUI();
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

// Remove from Main Cart
window.removeFromMainCart = function(cartId) {
    const item = mainCart.find(i => i.cartId === cartId);
    if (item && item.type === 'custom') {
        customBuilderCart = [];
        customBuilderTotal = 0;
        document.getElementById('custom-total').innerText = formatCurrency(0);
        
        const container = document.getElementById('custom-cart-items');
        if (container) container.innerHTML = '<p class="empty-msg">Hujachagua bidhaa yoyote bado.</p>';
        
        const btn = document.getElementById('add-custom-btn');
        const alert = document.getElementById('min-order-alert');
        if (btn) {
            btn.innerHTML = 'Weka Kifurushi Kwenye Kapu';
            btn.disabled = true;
        }
        if (alert) {
            alert.className = 'min-order-alert';
            alert.innerHTML = 'Bado Tsh 5,000/= kufikisha kima cha chini';
        }
    }
    mainCart = mainCart.filter(item => item.cartId !== cartId);
    updateMainCartUI();
    refreshProductCardStates();
};

// Update Main Cart UI
function updateMainCartUI() {
    const countEl = document.getElementById('cart-count');
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('main-cart-total');

    countEl.innerText = mainCart.length;

    const warningEl = document.getElementById('cart-min-warning');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (mainCart.length === 0) {
        container.innerHTML = '<p class="empty-msg">Kapu lako liko wazi.</p>';
        totalEl.innerText = formatCurrency(0);
        if (warningEl) warningEl.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = false;
        return;
    }

    container.innerHTML = '';
    let total = 0;
    let hasCustomItems = false;
    let customTotal = 0;

    mainCart.forEach(item => {
        total += item.price;
        if (item.type === 'custom' || item.type === 'product') {
            hasCustomItems = true;
            customTotal += item.price;
        }
        
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

    // Validation warning and button state
    if (hasCustomItems && customTotal < 5000) {
        const remaining = 5000 - customTotal;
        if (warningEl) {
            warningEl.innerHTML = `⚠️ Kifurushi chako binafsi hakijafikia Tsh 5,000. Bado Tsh ${formatCurrency(remaining)} ili kuagiza.`;
            warningEl.style.display = 'block';
        }
        if (checkoutBtn) checkoutBtn.disabled = true;
    } else {
        if (warningEl) warningEl.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = false;
    }
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
    if (status === 'processing') return { text: '👨‍🍳 Oda Yako Inaandaliwa', cls: 'badge-pending' };
    if (status === 'in_transit') return { text: '🛵 Oda Ipo Njiani Inakuja', cls: 'badge-pending' };
    if (status === 'delivered') return { text: '✅ Oda Imefikishwa Kikamilifu', cls: 'badge-accepted' };
    if (status === 'rejected') return { text: '❌ Oda Imekataliwa', cls: 'badge-rejected' };
    if (status === 'accepted') return { text: '✅ Imekubaliwa', cls: 'badge-accepted' };
    return { text: '⏳ Inasubiri Malipo', cls: 'badge-pending' };
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

        // STK Push Button for spotlight if payment is pending
        let stkSpotlightBtn = document.getElementById('stk-spotlight-btn');
        if (!stkSpotlightBtn) {
            stkSpotlightBtn = document.createElement('button');
            stkSpotlightBtn.id = 'stk-spotlight-btn';
            stkSpotlightBtn.className = 'stk-spotlight-btn';
            const spotlightFooter = document.querySelector('.spotlight-footer');
            if (spotlightFooter) spotlightFooter.appendChild(stkSpotlightBtn);
        }

        if (last.paymentStatus !== 'paid' && last.status !== 'rejected') {
            stkSpotlightBtn.style.display = 'inline-flex';
            stkSpotlightBtn.innerHTML = '<ion-icon name="phone-portrait-outline"></ion-icon> 📲 Lipia kwa Simu (STK Push)';
            stkSpotlightBtn.onclick = () => openStkPushModal(last.id, last.total, last.customer ? last.customer.phone : '');
        } else {
            stkSpotlightBtn.style.display = 'none';
        }

        lastSpotlight.style.display = 'block';
    } else {
        lastSpotlight.style.display = 'none';
    }

    // ── All orders list ───────────────────────────────────────────
    const listEl = document.getElementById('history-list');
    listEl.innerHTML = '';

    orders.forEach((order, idx) => {
        const sl = statusLabel(order.status);
        const isPendingPayment = order.paymentStatus !== 'paid' && order.status !== 'rejected';

        const stkButtonHtml = isPendingPayment 
            ? `<button class="stk-small-btn" onclick="openStkPushModal('${order.id}', ${order.total}, '${order.customer ? order.customer.phone : ''}')">
                 <ion-icon name="phone-portrait-outline"></ion-icon> 📲 Lipia kwa Simu
               </button>`
            : `<span class="payment-status-badge ${order.paymentStatus === 'paid' ? 'paid' : ''}">${order.paymentStatus === 'paid' ? '💳 Ililipwa' : ''}</span>`;

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
                <div class="history-card-actions">
                    ${stkButtonHtml}
                    <button class="reorder-small-btn" onclick="reorderOrder(${JSON.stringify(order).replace(/"/g, '&quot;')})">  
                        <ion-icon name="refresh-outline"></ion-icon> Agiza Tena
                    </button>
                </div>
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
    // "Endelea na Malipo" — open checkout directly
    document.getElementById('reorder-popup-checkout')?.addEventListener('click', () => {
        document.getElementById('reorder-popup').style.display = 'none';
        if (mainCart.length > 0) {
            document.getElementById('cart-overlay').classList.add('active');
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

// ============================================
// STK PUSH MANUAL LOGIC
// ============================================

let currentStkOrderId = null;
let currentStkTotal = 0;
let stkTimerInterval = null;

function setupStkPushListeners() {
    const closeBtn = document.getElementById('close-stk-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeStkPushModal);
    }

    const triggerBtn = document.getElementById('btn-trigger-stk');
    if (triggerBtn) {
        triggerBtn.addEventListener('click', triggerManualStkPush);
    }

    const resendBtn = document.getElementById('btn-resend-stk');
    if (resendBtn) {
        resendBtn.addEventListener('click', triggerManualStkPush);
    }

    // Provider radios styling toggle
    const providerCards = document.querySelectorAll('.stk-provider-card');
    providerCards.forEach(card => {
        card.addEventListener('click', () => {
            providerCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radio = card.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
        });
    });

    // Auto-detect provider based on phone number input
    const phoneInput = document.getElementById('stk-phone-input');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            autoSelectProviderByPhone(e.target.value.trim());
        });
    }

    // Close modal clicking outside
    const stkOverlay = document.getElementById('stk-modal-overlay');
    if (stkOverlay) {
        stkOverlay.addEventListener('click', (e) => {
            if (e.target.id === 'stk-modal-overlay') {
                closeStkPushModal();
            }
        });
    }
}

function autoSelectProviderByPhone(phone) {
    if (!phone) return;
    const clean = phone.replace(/[\s\-\+]/g, '');
    let prefix = '';
    if (clean.startsWith('255')) prefix = clean.slice(3, 5);
    else if (clean.startsWith('0')) prefix = clean.slice(1, 3);
    else prefix = clean.slice(0, 2);

    let selectedProvider = '';
    // Vodacom: 74, 75, 76, 79
    if (['74', '75', '76', '79'].includes(prefix)) selectedProvider = 'VodaCom M-Pesa';
    // Tigo: 71, 65, 67, 77
    else if (['71', '65', '67', '77'].includes(prefix)) selectedProvider = 'Tigo Pesa';
    // Airtel: 78, 68, 69
    else if (['78', '68', '69'].includes(prefix)) selectedProvider = 'Airtel Money';
    // Halotel: 62
    else if (['62'].includes(prefix)) selectedProvider = 'HaloPesa';

    if (selectedProvider) {
        ['checkout_provider', 'stk_provider'].forEach(groupName => {
            const radios = document.querySelectorAll(`input[name="${groupName}"]`);
            radios.forEach(radio => {
                if (radio.value === selectedProvider) {
                    radio.checked = true;
                    const card = radio.closest('.stk-provider-card');
                    if (card && card.parentElement) {
                        card.parentElement.querySelectorAll('.stk-provider-card').forEach(c => c.classList.remove('active'));
                        card.classList.add('active');
                    }
                }
            });
        });
    }
}

window.openStkPushModal = function(orderId, total, phone) {
    currentStkOrderId = orderId;
    currentStkTotal = total;

    document.getElementById('stk-order-id-display').textContent = orderId;
    document.getElementById('stk-amount-display').textContent = formatCurrency(total);
    document.getElementById('stk-ussd-amount').textContent = formatCurrency(total);

    const inputPhone = document.getElementById('stk-phone-input');
    const targetPhone = phone || localStorage.getItem('genge_customer_phone') || '';
    if (inputPhone) {
        inputPhone.value = targetPhone;
        autoSelectProviderByPhone(targetPhone);
    }

    // Hide live status & timer initially
    const liveStatus = document.getElementById('stk-live-status');
    if (liveStatus) liveStatus.style.display = 'none';
    if (stkTimerInterval) clearInterval(stkTimerInterval);

    const modal = document.getElementById('stk-modal-overlay');
    if (modal) {
        modal.style.display = 'flex';
        requestAnimationFrame(() => modal.classList.add('active'));
    }

    // Auto trigger STK push immediately so customer receives prompt without clicking extra buttons
    setTimeout(() => {
        triggerManualStkPush();
    }, 400);
};

window.closeStkPushModal = function() {
    const modal = document.getElementById('stk-modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
    if (stkTimerInterval) clearInterval(stkTimerInterval);
};

window.toggleUssdGuide = function() {
    const body = document.getElementById('stk-ussd-body');
    const chevron = document.getElementById('ussd-chevron');
    if (body) {
        if (body.style.display === 'none' || !body.style.display) {
            body.style.display = 'block';
            if (chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
            body.style.display = 'none';
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
    }
};

async function triggerManualStkPush() {
    if (!currentStkOrderId) return;

    const phoneInput = document.getElementById('stk-phone-input');
    const phone = phoneInput ? phoneInput.value.trim() : '';
    if (!phone) {
        showToast('Tafadhali ingiza namba ya simu ya kufanya malipo.');
        return;
    }

    const selectedProviderEl = document.querySelector('input[name="stk_provider"]:checked');
    const provider = selectedProviderEl ? selectedProviderEl.value : 'VodaCom M-Pesa';

    const triggerBtn = document.getElementById('btn-trigger-stk');
    if (triggerBtn) {
        triggerBtn.disabled = true;
        triggerBtn.innerHTML = '<ion-icon name="hourglass-outline"></ion-icon> Inatuma Ombi la PIN...';
    }

    try {
        const response = await fetch(API_URL + `/api/orders/${currentStkOrderId}/stk-push`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, provider })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            showToast('✅ STK Push imetumwa! Angalia simu yako kuingiza PIN.');
            showStkLiveStatus(phone, provider);
        } else {
            showToast('⚠️ ' + (data.message || 'Haikufanikiwa kutuma STK Push. Tumia Lipa Namba chini.'));
            showStkLiveStatus(phone, provider);
            if (typeof window.toggleUssdGuide === 'function') {
                const ussdBody = document.getElementById('stk-ussd-body');
                if (ussdBody && (ussdBody.style.display === 'none' || !ussdBody.style.display)) {
                    window.toggleUssdGuide();
                }
            }
        }
    } catch (err) {
        console.error('STK Push Error:', err);
        showToast('⚠️ Ombi linachukua muda. Angalia simu yako au tumia Lipa Namba.');
        showStkLiveStatus(phone, provider);
        if (typeof window.toggleUssdGuide === 'function') {
            const ussdBody = document.getElementById('stk-ussd-body');
            if (ussdBody && (ussdBody.style.display === 'none' || !ussdBody.style.display)) {
                window.toggleUssdGuide();
            }
        }
    } finally {
        if (triggerBtn) {
            triggerBtn.disabled = false;
            triggerBtn.innerHTML = '<ion-icon name="send-outline"></ion-icon> Tuma Notification ya PIN Sasa (STK Push)';
        }
    }
}

function showStkLiveStatus(phone, provider) {
    const liveStatus = document.getElementById('stk-live-status');
    if (!liveStatus) return;
    liveStatus.style.display = 'block';
    
    document.getElementById('stk-status-title').textContent = `Ombi la PIN Limetumwa! (${provider})`;
    document.getElementById('stk-status-desc').innerHTML = `Tafadhali angalia simu yako (<strong>${phone}</strong>). Utapokea ujumbe rasmi wa <strong>${provider}</strong> kwenye screen ya simu yako kuweka PIN.`;

    let seconds = 60;
    const timerEl = document.getElementById('stk-timer-countdown');
    if (timerEl) timerEl.textContent = seconds;

    if (stkTimerInterval) clearInterval(stkTimerInterval);
    stkTimerInterval = setInterval(() => {
        seconds--;
        if (timerEl) timerEl.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(stkTimerInterval);
            document.getElementById('stk-status-title').textContent = '⚠️ Bado Hujaweka PIN?';
            document.getElementById('stk-status-desc').innerHTML = 'Kama notification haikufika au ilipotea, unaweza kubonyeza kitufe hapa chini <strong>Kutuma Tena Push</strong> au tumia <strong>Lipa Namba (USSD)</strong>.';
        }
    }, 1000);
}
