// ==========================================================================
// GENGE MALL VENDOR PORTAL JAVASCRIPT
// ==========================================================================

const API_URL = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';
let currentVendor = null;
const vendorNativeFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) => {
    const requestUrl = typeof input === 'string' ? input : input.url;
    if (!new URL(requestUrl, window.location.href).pathname.startsWith('/api/')) {
        return vendorNativeFetch(input, init);
    }

    const token = currentVendor?.sessionToken || '';
    if (!token) return vendorNativeFetch(input, init);

    const headers = new Headers(input instanceof Request ? input.headers : undefined);
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    headers.set('Authorization', `Bearer ${token}`);
    return vendorNativeFetch(input, { ...init, headers });
};

function normalizeVendorPhone(phone) {
    let clean = String(phone || '').replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '255' + clean.substring(1);
    else if (!clean.startsWith('255') && clean.length === 9) clean = '255' + clean;
    return clean;
}

function getCurrentVendorShopName() {
    return String(currentVendor && (currentVendor.shopName || currentVendor.name) || '').trim();
}

function matchesCurrentVendorProduct(product) {
    return normalizeVendorPhone(product.vendorPhone) === normalizeVendorPhone(currentVendor && currentVendor.phone) &&
        String(product.vendorShopName || '').trim().toLowerCase() === getCurrentVendorShopName().toLowerCase();
}

function getVendorProfilePicStorageKey(vendor) {
    const phone = normalizeVendorPhone(vendor && vendor.phone);
    const shopName = String(vendor && (vendor.shopName || vendor.name) || '').trim();
    return `genge_vendor_profile_pic_${phone}_${encodeURIComponent(shopName.toLowerCase())}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const departmentSelect = document.getElementById('vp-dept');
    const vehicleListingSelect = document.getElementById('vp-vehicle-listing-type');
    if (departmentSelect) departmentSelect.addEventListener('change', updateVendorVehicleFields);
    if (vehicleListingSelect) vehicleListingSelect.addEventListener('change', updateVendorVehicleFields);
    updateVendorVehicleFields();

    const resetMatch = window.location.hash.match(/^#reset=([A-Za-z0-9_-]{43})$/);
    if (resetMatch) {
        showVendorPasswordReset(resetMatch[1]);
        return;
    }
    if (window.location.hash === '#enter-reset-code') {
        showVendorPasswordReset();
        return;
    }
    checkSavedVendorSession();
});

function updateVendorVehicleFields() {
    const department = document.getElementById('vp-dept');
    const listingType = document.getElementById('vp-vehicle-listing-type');
    const vehicleFields = document.getElementById('vp-vehicle-fields');
    const saleConditionGroup = document.getElementById('vp-vehicle-sale-condition-group');
    const rentalClassGroup = document.getElementById('vp-vehicle-rental-class-group');
    const saleCondition = document.getElementById('vp-vehicle-sale-condition');
    const rentalClass = document.getElementById('vp-vehicle-rental-class');
    const fixedPriceControls = document.getElementById('vp-fixed-price-controls');
    const priceInput = document.getElementById('vp-price');
    const priceNote = document.getElementById('vp-price-negotiable-note');
    if (!department || !listingType || !vehicleFields || !fixedPriceControls || !priceInput) return;

    const isVehicle = department.value === 'magari';
    const isRental = isVehicle && listingType.value === 'rental';
    vehicleFields.style.display = isVehicle ? 'block' : 'none';
    saleConditionGroup.style.display = isVehicle && !isRental ? '' : 'none';
    rentalClassGroup.style.display = isRental ? 'block' : 'none';
    saleCondition.required = isVehicle && !isRental;
    rentalClass.required = isRental;
    fixedPriceControls.style.display = isRental ? 'none' : '';
    priceInput.required = !isRental;
    priceNote.style.display = isRental ? 'block' : 'none';
    if (isRental) priceInput.value = '';
}

let vendorPasswordResetToken = null;
let vendorPasswordResetCodeVerified = false;

function showVendorPasswordReset(token) {
    vendorPasswordResetToken = token || null;
    vendorPasswordResetCodeVerified = false;
    const codeFields = document.getElementById('vendor-password-reset-code-fields');
    const passwordFields = document.getElementById('vendor-password-reset-password-fields');
    const phoneInput = document.getElementById('vendor-reset-phone');
    const codeInput = document.getElementById('vendor-reset-code');
    const verifyButton = document.getElementById('vendor-password-reset-verify');
    const submitButton = document.getElementById('vendor-password-reset-submit');
    const passwordInputs = [
        document.getElementById('vendor-new-password'),
        document.getElementById('vendor-confirm-password')
    ];

    document.getElementById('vendor-password-reset-form').reset();
    document.getElementById('vendor-password-reset-message').textContent = '';
    codeFields.style.display = vendorPasswordResetToken ? 'none' : 'block';
    passwordFields.style.display = vendorPasswordResetToken ? 'block' : 'none';
    phoneInput.disabled = Boolean(vendorPasswordResetToken);
    codeInput.disabled = Boolean(vendorPasswordResetToken);
    passwordInputs.forEach(input => { input.disabled = !vendorPasswordResetToken; });
    verifyButton.style.display = vendorPasswordResetToken ? 'none' : '';
    submitButton.style.display = '';
    submitButton.disabled = false;
    submitButton.textContent = 'Hifadhi nenosiri jipya';
    document.getElementById('vendor-login-overlay').classList.add('hidden');
    document.getElementById('vendor-dashboard-content').classList.add('hidden');
    document.getElementById('vendor-password-reset-overlay').style.display = 'flex';
}

function showVendorRecoveryHelp(event) {
    if (event) event.preventDefault();
    const phone = document.getElementById('vlogin-phone').value.trim();
    const shopName = document.getElementById('vlogin-shop-name').value.trim();
    const accountDetails = [
        phone ? `Namba ya simu iliyosajiliwa: ${phone}.` : 'Nitaeleza namba ya simu iliyosajiliwa.',
        shopName ? `Jina la duka: ${shopName}.` : ''
    ].filter(Boolean).join(' ');
    const message = `Habari Genge Mall. Nimesahau nenosiri la akaunti yangu ya mfanyabiashara. ${accountDetails} Ninatuma ombi hili kutoka kwenye namba yangu ya WhatsApp iliyosajiliwa. Tafadhali nisaidieni kuthibitisha umiliki na kunitumia msimbo wa kuweka nenosiri jipya. Situmi nenosiri au PIN hapa. Baada ya WhatsApp kufunguka, nitabonyeza Tuma ili ombi lifike.`;
    const whatsappUrl = `https://wa.me/255692970687?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

function handleVendorPasswordRecovery(event) {
    showVendorRecoveryHelp(event);
}

async function verifyVendorPasswordResetCode() {
    const phone = document.getElementById('vendor-reset-phone').value.trim();
    const code = document.getElementById('vendor-reset-code').value.trim();
    const message = document.getElementById('vendor-password-reset-message');
    const verifyButton = document.getElementById('vendor-password-reset-verify');

    message.textContent = '';
    if (!phone || !/^\d{8}$/.test(code)) {
        message.style.color = '#ef4444';
        message.textContent = 'Weka namba ya simu iliyosajiliwa na msimbo wa tarakimu 8.';
        return;
    }

    verifyButton.disabled = true;
    verifyButton.textContent = 'Inathibitisha...';
    try {
        const response = await fetch(API_URL + '/api/auth/vendor/password-reset/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, code })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Msimbo haujathibitishwa.');

        vendorPasswordResetCodeVerified = true;
        document.getElementById('vendor-password-reset-code-fields').style.display = 'none';
        document.getElementById('vendor-password-reset-password-fields').style.display = 'block';
        document.getElementById('vendor-new-password').disabled = false;
        document.getElementById('vendor-confirm-password').disabled = false;
        message.style.color = '#10b981';
        message.textContent = 'Msimbo umethibitishwa. Sasa weka nenosiri jipya.';
    } catch (error) {
        console.error('Vendor password reset code verification failed:', error);
        message.style.color = '#ef4444';
        message.textContent = error.message || 'Imeshindikana kuthibitisha msimbo.';
    } finally {
        verifyButton.disabled = false;
        verifyButton.textContent = 'Thibitisha msimbo';
    }
}

async function submitVendorPasswordReset(event) {
    event.preventDefault();
    const message = document.getElementById('vendor-password-reset-message');
    const submitButton = document.getElementById('vendor-password-reset-submit');
    const password = document.getElementById('vendor-new-password').value;
    const confirmPassword = document.getElementById('vendor-confirm-password').value;

    message.textContent = '';
    if (!vendorPasswordResetToken && !vendorPasswordResetCodeVerified) {
        message.style.color = '#ef4444';
        message.textContent = 'Thibitisha kwanza msimbo uliotumwa kupitia WhatsApp.';
        return;
    }
    if (password !== confirmPassword) {
        message.textContent = 'Manenosiri hayalingani.';
        return;
    }
    if (password.length < 8 || password.length > 128) {
        message.textContent = 'Nenosiri liwe na herufi 8 hadi 128.';
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Inahifadhi...';
    try {
        const response = await fetch(API_URL + '/api/auth/vendor/password-reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vendorPasswordResetToken
                ? { token: vendorPasswordResetToken, password }
                : {
                    phone: document.getElementById('vendor-reset-phone').value.trim(),
                    code: document.getElementById('vendor-reset-code').value.trim(),
                    password
                })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Imeshindikana kuhifadhi nenosiri jipya.');

        message.style.color = '#10b981';
        message.textContent = data.message;
        vendorPasswordResetToken = null;
        vendorPasswordResetCodeVerified = false;
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        document.getElementById('vendor-password-reset-form').reset();
        document.getElementById('vendor-password-reset-code-fields').style.display = 'none';
        document.getElementById('vendor-password-reset-password-fields').style.display = 'none';
        document.getElementById('vendor-reset-phone').disabled = true;
        document.getElementById('vendor-reset-code').disabled = true;
        document.getElementById('vendor-new-password').disabled = true;
        document.getElementById('vendor-confirm-password').disabled = true;
        submitButton.style.display = 'none';
    } catch (error) {
        console.error('Vendor password reset failed:', error);
        message.style.color = '#ef4444';
        message.textContent = error.message || 'Imeshindikana kuweka nenosiri jipya. Jaribu tena.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Hifadhi nenosiri jipya';
    }
}

function returnToVendorLogin() {
    vendorPasswordResetToken = null;
    vendorPasswordResetCodeVerified = false;
    document.getElementById('vendor-password-reset-form').reset();
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    document.getElementById('vendor-password-reset-overlay').style.display = 'none';
    document.getElementById('vendor-password-reset-message').textContent = '';
    showLoginOverlay();
}

async function checkSavedVendorSession() {
    let saved = localStorage.getItem('genge_vendor');
    if (!saved) {
        // Fallback to genge_user in case login occurred from mall.html
        saved = localStorage.getItem('genge_user');
    }
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed && (parsed.role === 'vendor' || parsed.shopName)) {
                currentVendor = parsed;
                currentVendor.role = 'vendor';
                if (!currentVendor.sessionToken) {
                    throw new Error('Tafadhali ingia tena ili kuthibitisha akaunti ya muuzaji.');
                }
                const sessionResponse = await fetch(API_URL + '/api/vendor/session', {
                    headers: { Authorization: `Bearer ${currentVendor.sessionToken}` }
                });
                if (!sessionResponse.ok) {
                    throw new Error('Session ya muuzaji imeisha. Ingia tena.');
                }
                localStorage.setItem('genge_vendor', JSON.stringify(currentVendor));
                showDashboard();
                fetchVendorProfile();
                return;
            }
        } catch (e) {
            localStorage.removeItem('genge_vendor');
            localStorage.removeItem('genge_user');
        }
    }
    showLoginOverlay();
}

function showLoginOverlay() {
    document.getElementById('vendor-login-overlay').classList.remove('hidden');
    document.getElementById('vendor-dashboard-content').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('vendor-login-overlay').classList.add('hidden');
    document.getElementById('vendor-dashboard-content').classList.remove('hidden');
    updateVendorUI();
}

async function handleVendorLogin(e) {
    e.preventDefault();
    const phone = document.getElementById('vlogin-phone').value;
    const password = document.getElementById('vlogin-password').value;
    const shopName = document.getElementById('vlogin-shop-name').value.trim();
    const errDiv = document.getElementById('vlogin-error');
    if (!shopName) {
        errDiv.textContent = 'Weka jina la duka kama ulivyosajili.';
        return;
    }
    const submitButton = e.currentTarget.querySelector('button[type="submit"]');
    errDiv.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Inathibitisha...';

    try {
        await authenticateVendorLogin(phone, password, shopName);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Ingia Kwenye Dashboard ya Duka ›';
    }
}

async function authenticateVendorLogin(phone, password, shopName = '') {
    const errDiv = document.getElementById('vlogin-error');
    errDiv.textContent = '';
    const shopList = document.getElementById('vlogin-shop-list');
    if (shopList) {
        shopList.replaceChildren();
        shopList.hidden = true;
    }

    try {
        const res = await fetch(API_URL + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password, shopName })
        });

        const data = await res.json();

        if (!res.ok) {
            errDiv.textContent = data.message || 'Kosa wakati wa kuingia.';
            return;
        }

        if (data.multiShop) {
            if (!shopList) {
                errDiv.textContent = 'Kuna maduka mengi yanayotumia taarifa hizi. Tafadhali ingia kupitia Genge Mall ili uchague duka.';
                return;
            }
            const heading = document.createElement('p');
            heading.textContent = 'Chagua duka unalotaka kuingia:';
            shopList.appendChild(heading);
            (data.shops || []).forEach(shop => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'vendor-btn-primary';
                button.textContent = `${shop.shopName} (${shop.package})`;
                button.addEventListener('click', () => loginVendorToShop(phone, password, shop.shopName, button));
                shopList.appendChild(button);
            });
            shopList.hidden = false;
            return;
        }

        if (data.user.role !== 'vendor') {
            errDiv.textContent = 'Akaunti hii ni ya Mnunuzi. Ingia na akaunti ya Muuzaji.';
            return;
        }

        currentVendor = { ...data.user, sessionToken: data.sessionToken };
        localStorage.setItem('genge_vendor', JSON.stringify(currentVendor));
        showDashboard();
        fetchVendorProfile();
    } catch (err) {
        errDiv.textContent = err.message || 'Imefeli kuunganisha na server. Jaribu tena.';
    }
}

async function loginVendorToShop(phone, password, shopName, button) {
    const errDiv = document.getElementById('vlogin-error');
    button.disabled = true;
    try {
        const res = await fetch(API_URL + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password, shopName })
        });
        const data = await res.json();
        if (!res.ok) {
            errDiv.textContent = data.message || 'Kosa wakati wa kuingia.';
            button.disabled = false;
            return;
        }
        if (!data.user || data.user.role !== 'vendor') {
            errDiv.textContent = 'Akaunti hii si ya muuzaji.';
            button.disabled = false;
            return;
        }
        currentVendor = { ...data.user, sessionToken: data.sessionToken };
        localStorage.setItem('genge_vendor', JSON.stringify(currentVendor));
        showDashboard();
        fetchVendorProfile();
    } catch (err) {
        console.error('Error logging into selected vendor shop:', err);
        errDiv.textContent = 'Imefeli kuunganisha na server. Jaribu tena.';
        button.disabled = false;
    }
}

function toggleVendorPasswordVisibility(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input || !button) return;
    const showPassword = input.type === 'password';
    input.type = showPassword ? 'text' : 'password';
    button.setAttribute('aria-pressed', String(showPassword));
    button.setAttribute('aria-label', showPassword ? 'Ficha neno la siri' : 'Onyesha neno la siri');
    const icon = button.querySelector('ion-icon');
    if (icon) icon.setAttribute('name', showPassword ? 'eye-off-outline' : 'eye-outline');
}

window.toggleVendorPasswordVisibility = toggleVendorPasswordVisibility;

function handleVendorLogout() {
    localStorage.removeItem('genge_vendor');
    currentVendor = null;
    showLoginOverlay();
}

async function fetchVendorProfile() {
    if (!currentVendor) return;
    let prods = [];
    try {
        const shopName = encodeURIComponent(getCurrentVendorShopName());
        const res = await fetch(API_URL + `/api/vendor/profile/${currentVendor.phone}?shopName=${shopName}`);
        if (res.ok) {
            const data = await res.json();
            currentVendor = { ...currentVendor, ...data.vendor };
            localStorage.setItem('genge_vendor', JSON.stringify(currentVendor));
            if (Array.isArray(data.products)) {
                prods = data.products;
            }
        }
    } catch (e) {
        console.warn('Backend unavailable, using local cache:', e);
    }

    // Merge locally saved custom products for this vendor (guarantees persistence)
    try {
        const allLocal = JSON.parse(localStorage.getItem('genge_custom_vendor_products') || '[]');
        const myLocal = allLocal.filter(matchesCurrentVendorProduct);
        const existingIds = new Set(prods.map(p => p.id || p._id));
        myLocal.forEach(p => {
            if (!existingIds.has(p.id)) {
                prods.unshift(p);
            }
        });
    } catch (_) {}

    updateVendorUI();
    renderVendorProducts(prods);
}

function updateVendorUI() {
    if (!currentVendor) return;

    const shopName = currentVendor.shopName || currentVendor.name || 'Duka Langu';
    document.getElementById('display-shop-name').textContent = shopName;
    document.getElementById('display-nida-tin').textContent = currentVendor.nidaOrTin || 'NIDA Verified';
    document.getElementById('display-vendor-phone').textContent = currentVendor.phone || '';

    // Populate profile editor fields
    const editShop = document.getElementById('vp-edit-shop-name');
    const editBio  = document.getElementById('vp-edit-bio');
    const editLoc  = document.getElementById('vp-edit-location');
    const editPhone= document.getElementById('vp-edit-phone');
    if (editShop) editShop.value = shopName;
    if (editBio)  editBio.value  = currentVendor.bio || '';
    if (editLoc)  editLoc.value  = currentVendor.location || '';
    if (editPhone)editPhone.value = currentVendor.phone || '';

    // Load saved profile picture
    const savedPic = localStorage.getItem(getVendorProfilePicStorageKey(currentVendor));
    const avatarEl = document.getElementById('vp-profile-avatar');
    if (avatarEl) {
        let curAvatar = savedPic || currentVendor.avatar;
        if (!curAvatar || curAvatar.includes('12.png')) {
            curAvatar = 'mall/genge-mall-logo.jpg';
        }
        avatarEl.src = curAvatar;
    }

    const pkg = currentVendor.package || { name: 'Basic', price: 5000, maxProducts: 25 };
    const pkgName = pkg.name || 'Basic';
    document.getElementById('display-pkg-name').textContent = pkgName + ' Vendor';
    document.getElementById('display-pkg-price').textContent = `Tsh ${(pkg.price || 5000).toLocaleString()}/mwezi`;
    document.getElementById('display-max-count').textContent = pkg.maxProducts || 25;

    // Quick stats
    const statsEl = { products: document.getElementById('vstat-products'), followers: document.getElementById('vstat-followers'), days: document.getElementById('vstat-days'), pkgLevel: document.getElementById('vstat-pkg-level') };
    if (statsEl.followers) statsEl.followers.textContent = currentVendor.followersCount || (currentVendor.followers ? currentVendor.followers.length : 0);
    if (statsEl.pkgLevel) statsEl.pkgLevel.textContent = pkgName;

    // Subscription countdown
    const activatedAt = pkg.activatedAt ? new Date(pkg.activatedAt) : null;
    const expiresAt = pkg.expiresAt ? new Date(pkg.expiresAt) : null;
    const now = new Date();

    if (expiresAt) {
        const msLeft = expiresAt.getTime() - now.getTime();
        const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));

        const daysEl = document.getElementById('countdown-days');
        const statusEl = document.getElementById('countdown-status-text');
        const ringEl = document.getElementById('countdown-ring');
        const statsDaysEl = document.getElementById('vstat-days');

        if (daysEl) daysEl.textContent = daysLeft;
        if (statsDaysEl) statsDaysEl.textContent = daysLeft;

        if (daysLeft <= 0) {
            if (statusEl) statusEl.textContent = '🔴 Kimeisha!';
            if (ringEl) ringEl.style.borderColor = '#ef4444';
            if (daysEl) daysEl.style.color = '#ef4444';
        } else if (daysLeft <= 7) {
            if (statusEl) statusEl.textContent = '🟡 Karibu Kuisha';
            if (ringEl) ringEl.style.borderColor = '#f59e0b';
            if (daysEl) daysEl.style.color = '#f59e0b';
        } else {
            if (statusEl) statusEl.textContent = '🟢 Imebaki';
            if (ringEl) ringEl.style.borderColor = '#10b981';
            if (daysEl) daysEl.style.color = '#10b981';
        }

        // Timeline bar
        const timelineRow = document.getElementById('pkg-timeline-row');
        if (timelineRow && activatedAt) {
            const totalDays = (pkg.durationDays || 30) * 24 * 60 * 60 * 1000;
            const usedMs = now.getTime() - activatedAt.getTime();
            const pct = Math.min(100, Math.max(0, Math.round((usedMs / totalDays) * 100)));
            timelineRow.style.display = 'flex';
            document.getElementById('pkg-start-date').textContent = activatedAt.toLocaleDateString('sw-TZ');
            document.getElementById('pkg-end-date').textContent = expiresAt.toLocaleDateString('sw-TZ');
            const fill = document.getElementById('pkg-timeline-fill');
            if (fill) fill.style.width = pct + '%';
        }
    }
}

// ── VENDOR PRODUCT SLIDER ──────────────────────────────────────
let vendorSliderIndex = 0;
let vendorSliderTimer = null;
let vendorSliderProducts = [];

function renderVendorProducts(products) {
    const container = document.getElementById('vendor-products-container');
    vendorSliderProducts = products;
    const usedCount = products.length;
    const maxCount = (currentVendor && currentVendor.package ? currentVendor.package.maxProducts : 25) || 25;

    document.getElementById('display-used-count').textContent = usedCount;
    document.getElementById('badge-limit-left').textContent = `Bidhaa zilizosalia: ${Math.max(0, maxCount - usedCount)}`;

    const percentage = Math.min(100, Math.round((usedCount / maxCount) * 100));
    const fill = document.getElementById('usage-progress-fill');
    if (fill) fill.style.width = percentage + '%';

    const vsP = document.getElementById('vstat-products');
    if (vsP) vsP.textContent = usedCount;

    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;color:#64748b;padding:2rem;">
                <ion-icon name="bag-handle-outline" style="font-size:3rem;margin-bottom:0.5rem;display:block;"></ion-icon>
                <p>Bado hujaweka bidhaa yoyote sokoni Genge Mall.<br>
                <small>Tumia fomu upande wa kushoto kuanza kupakia bidhaa.</small></p>
            </div>`;
        return;
    }

    if (products.length === 1) {
        // Single product — simple card, no slider
        const p = products[0];
        container.innerHTML = buildVpsCard(p);
        return;
    }

    // Multiple products — build auto-slider
    vendorSliderIndex = 0;
    if (vendorSliderTimer) clearInterval(vendorSliderTimer);

    const cardsHtml = products.map(p => buildVpsCard(p)).join('');
    const dotsHtml  = products.map((_, i) => `<button class="vps-dot ${i === 0 ? 'active' : ''}" onclick="goVendorSlide(${i})"></button>`).join('');

    container.innerHTML = `
        <div class="vendor-products-slider-wrap">
            <div class="vps-track" id="vps-track">${cardsHtml}</div>
        </div>
        <div class="vps-nav-row">
            <button class="vps-nav-btn" onclick="moveVendorSlide(-1)">
                <ion-icon name="chevron-back-outline"></ion-icon>
            </button>
            <div class="vps-dots" id="vps-dots">${dotsHtml}</div>
            <span class="vps-counter" id="vps-counter">1 / ${products.length}</span>
            <button class="vps-nav-btn" onclick="moveVendorSlide(1)">
                <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
        </div>
    `;

    updateVendorSliderUI();
    vendorSliderTimer = setInterval(() => moveVendorSlide(1), 3500);
}

function buildVpsCard(p) {
    const img   = p.image || p.icon || 'mall/genge-mall-logo.jpg';
    const title = p.name || p.title || 'Bidhaa';
    const price = p.priceUnit === 'Bei kwa makubaliano'
        ? 'Bei kwa makubaliano'
        : `Tsh ${(p.price || 0).toLocaleString()}`;
    const loc   = p.location || '';
    const id    = p.id || p._id || '';
    return `
        <div class="vps-card">
            <div class="vps-card-inner">
                <img src="${img}" alt="${title}" class="vps-card-img" onerror="this.src='mall/genge-mall-logo.jpg'">
                <div class="vps-card-body">
                    <div class="vps-card-title">${title}</div>
                    <div class="vps-card-meta"><ion-icon name="location-outline" style="font-size:0.8rem;vertical-align:middle;"></ion-icon> ${loc}</div>
                    <div class="vps-card-price">${price}</div>
                    <div class="vps-card-actions">
                        <button class="vps-share-btn" onclick="shareVendorProduct('${id}', '${title.replace(/'/g, "\\'")}', ${p.price || 0}, ${p.priceUnit === 'Bei kwa makubaliano'})">
                            <ion-icon name="share-social-outline"></ion-icon> Shiriki
                        </button>
                        <button class="vps-delete-btn" onclick="deleteVendorProduct('${id}')">
                            <ion-icon name="trash-outline"></ion-icon> Futa
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
}

function moveVendorSlide(dir) {
    const n = vendorSliderProducts.length;
    if (n < 2) return;
    vendorSliderIndex = (vendorSliderIndex + dir + n) % n;
    updateVendorSliderUI();
}

function goVendorSlide(idx) {
    vendorSliderIndex = idx;
    updateVendorSliderUI();
    if (vendorSliderTimer) { clearInterval(vendorSliderTimer); vendorSliderTimer = setInterval(() => moveVendorSlide(1), 3500); }
}

function updateVendorSliderUI() {
    const track = document.getElementById('vps-track');
    if (track) track.style.transform = `translateX(-${vendorSliderIndex * 100}%)`;
    const dots = document.querySelectorAll('.vps-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === vendorSliderIndex));
    const counter = document.getElementById('vps-counter');
    if (counter) counter.textContent = `${vendorSliderIndex + 1} / ${vendorSliderProducts.length}`;
}

// ── SMART IMAGE COMPRESSOR (Browser-side Canvas Compression) ───────
// Converts 5MB-10MB phone camera images into ~40KB-80KB high quality web images
function compressImageFile(file, maxWidth = 600, quality = 0.75) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = function(e) {
            const img = new Image();
            img.onerror = reject;
            img.onload = function() {
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // Return compressed JPEG data URL
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ── PROFILE PICTURE CHANGE (Saves to MongoDB) ────────────────────
async function handleProfilePicChange(input) {
    if (!input.files || !input.files[0] || !currentVendor) return;
    const file = input.files[0];
    showProfileMsg('⏳ Inabana na kuhifadhi picha...', '#38bdf8');

    try {
        const compressedBase64 = await compressImageFile(file, 400, 0.8);
        const avatarEl = document.getElementById('vp-profile-avatar');
        if (avatarEl) avatarEl.src = compressedBase64;

        // Save directly to MongoDB database!
        const res = await fetch(API_URL + '/api/vendor/profile/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: currentVendor.phone,
                currentShopName: getCurrentVendorShopName(),
                avatar: compressedBase64
            })
        });
        const data = await res.json();
        if (!res.ok) {
            if (avatarEl) avatarEl.src = currentVendor.avatar || 'mall/genge-mall-logo.jpg';
            showProfileMsg('❌ ' + (data.message || 'Kosa wakati wa kuhifadhi picha.'), '#ef4444');
            return;
        }

        currentVendor = { ...currentVendor, ...data.user };
        localStorage.setItem('genge_vendor', JSON.stringify(currentVendor));
        localStorage.setItem(getVendorProfilePicStorageKey(currentVendor), compressedBase64);
        showProfileMsg('✅ Picha ya profile imehifadhiwa kwenye database!', '#10B981');
    } catch (err) {
        console.error('Error uploading profile pic:', err);
        const avatarEl = document.getElementById('vp-profile-avatar');
        if (avatarEl) avatarEl.src = currentVendor.avatar || 'mall/genge-mall-logo.jpg';
        showProfileMsg('❌ Kosa wakati wa kupakia picha.', '#ef4444');
    }
}

// ── SAVE VENDOR PROFILE (Saves to MongoDB) ────────────────────────
async function saveVendorProfile() {
    if (!currentVendor) return;

    const shopName = (document.getElementById('vp-edit-shop-name').value || '').trim();
    const bio      = (document.getElementById('vp-edit-bio').value || '').trim();
    const location = (document.getElementById('vp-edit-location').value || '').trim();

    if (!shopName) {
        showProfileMsg('⚠️ Jina la duka haliwezi kuwa tupu.', '#f59e0b');
        return;
    }

    showProfileMsg('⏳ Inahifadhi kwenye database...', '#38bdf8');

    // Save directly to MongoDB database!
    try {
        const res = await fetch(API_URL + '/api/vendor/profile/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                phone: currentVendor.phone,
                currentShopName: getCurrentVendorShopName(),
                shopName,
                bio,
                location
            })
        });
        const data = await res.json();
        if (!res.ok) {
            showProfileMsg('❌ ' + (data.message || 'Kosa wakati wa kuhifadhi taarifa.'), '#ef4444');
            return;
        }

        currentVendor = { ...currentVendor, ...data.user, shopName, bio, location };
        localStorage.setItem('genge_vendor', JSON.stringify(currentVendor));
        updateVendorUI();
        showProfileMsg('✅ Taarifa zimehifadhiwa kwenye database!', '#10B981');
    } catch (err) {
        console.error('Error updating vendor profile:', err);
        showProfileMsg('❌ Kosa la mtandao wakati wa kuhifadhi taarifa.', '#ef4444');
    }
}

function showProfileMsg(msg, color) {
    const el = document.getElementById('profile-save-msg');
    if (!el) return;
    el.textContent = msg;
    el.style.color = color;
    setTimeout(() => { el.textContent = ''; }, 4000);
}

// ── PRODUCT UPLOAD (Compresses and Saves to MongoDB) ─────────────
async function handleProductUpload(e) {
    e.preventDefault();
    const msgDiv = document.getElementById('upload-msg');
    msgDiv.textContent = '';
    msgDiv.style.color = '#fff';

    if (!currentVendor) {
        msgDiv.textContent = '⚠️ Hujatambuliwa kama muuzaji. Tafadhali ingia kwanza kwenye akaunti ya duka lako.';
        msgDiv.style.color = '#EF4444';
        showLoginOverlay();
        return;
    }

    const name = document.getElementById('vp-name').value;
    const dept = document.getElementById('vp-dept').value;
    const priceInput = document.getElementById('vp-price');
    const vehicleListingType = document.getElementById('vp-vehicle-listing-type').value;
    const isVehicleRental = dept === 'magari' && vehicleListingType === 'rental';
    const saleCondition = document.getElementById('vp-vehicle-sale-condition').value;
    const rentalClass = document.getElementById('vp-vehicle-rental-class').value;
    const price = isVehicleRental ? 0 : Number(priceInput.value);
    const location = document.getElementById('vp-location').value;
    const desc = document.getElementById('vp-desc').value;
    const fileInput = document.getElementById('vp-image');

    if (!fileInput.files || fileInput.files.length === 0) {
        msgDiv.textContent = 'Tafadhali chagua picha ya bidhaa.';
        msgDiv.style.color = '#EF4444';
        return;
    }

    const file = fileInput.files[0];
    const submitBtn = document.getElementById('upload-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Inabana na kupakia picha...';

    try {
        // Compress image to max 600px width and 0.75 quality (~40-80KB)
        let compressedBase64 = '';
        let compressedImage;
        try {
            compressedBase64 = await compressImageFile(file, 600, 0.75);
        } catch (imgErr) {
            console.warn('Canvas compression failed, reading as standard DataURL:', imgErr);
            compressedBase64 = await new Promise((resolve, reject) => {
                const fr = new FileReader();
                fr.onload = () => resolve(fr.result);
                fr.onerror = reject;
                fr.readAsDataURL(file);
            });
        }
        compressedImage = await (await fetch(compressedBase64)).blob();

        const imageExtensions = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
            'image/gif': 'gif'
        };
        const imageExtension = imageExtensions[compressedImage.type];
        if (!imageExtension) {
            throw new Error('Aina ya picha haikubaliki. Tumia JPEG, PNG au WebP.');
        }
        if (compressedImage.size > 5 * 1024 * 1024) {
            throw new Error('Picha ni kubwa kuliko 5 MB. Chagua picha ndogo zaidi.');
        }

        const payload = {
            name: name.trim(),
            category: dept,
            dept: dept,
            subType: dept === 'magari' ? (isVehicleRental ? 'kupangisha' : saleCondition) : '',
            price,
            priceUnit: isVehicleRental ? 'Bei kwa makubaliano' : 'Tsh',
            location: location || 'Dar es Salaam',
            desc: desc || '',
            specs: isVehicleRental
                ? [`Aina ya huduma: ${rentalClass === 'mizigo' ? 'Gari la mizigo' : 'Gari la abiria binafsi (Special Hire)'}`]
                : [],
            vendorPhone: currentVendor.phone,
            vendorName: currentVendor.name || '',
            vendorShopName: currentVendor.shopName || currentVendor.name || 'Duka Langu',
            vendorAvatar: (currentVendor.avatar && !currentVendor.avatar.includes('12.png')) 
                          ? currentVendor.avatar 
                          : (localStorage.getItem(getVendorProfilePicStorageKey(currentVendor)) || 'mall/genge-mall-logo.jpg'),
            vendorNidaOrTin: currentVendor.nidaOrTin || '',
        };

        const formData = new FormData();
        ["name", "category", "dept", "subType", "price", "location", "desc", "vendorPhone"].forEach(key => {
            formData.append(key, String(payload[key] ?? ''));
        });
        if (payload.specs.length > 0) formData.append("specs", payload.specs.join(","));
        formData.append("shopName", payload.vendorShopName);
        formData.append("image", compressedImage, `product.${imageExtension}`);

        // Post multipart form data to MongoDB!
        let serverProduct = null;
        try {
            const res = await fetch(API_URL + '/api/vendor/products', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                msgDiv.textContent = data.message || '⚠️ Kosa wakati wa kupakia.';
                msgDiv.style.color = '#EF4444';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> Chapisha Bidhaa Sokoni Genge Mall';
                return;
            }

            serverProduct = data.product;
        } catch (netErr) {
            console.error('Vendor product upload request failed:', netErr);
        }

        // Cache locally to guarantee instant display on slider and mall
        const finalProd = serverProduct || {
            id: 'vprod_' + Date.now(),
            ...payload,
            icon: compressedBase64,
            isImage: true,
            isVendorActive: true,
            createdAt: new Date().toISOString()
        };

        let cachedLocally = false;
        try {
            const allLocal = JSON.parse(localStorage.getItem('genge_custom_vendor_products') || '[]');
            allLocal.unshift(finalProd);
            localStorage.setItem('genge_custom_vendor_products', JSON.stringify(allLocal));
            cachedLocally = true;
        } catch (cacheErr) {
            console.error('Unable to cache vendor product locally:', cacheErr);
        }

        if (!serverProduct) {
            msgDiv.textContent = cachedLocally
                ? 'Bidhaa imehifadhiwa kwenye kifaa hiki pekee; haijachapishwa kwenye Genge Mall. Hakikisha intaneti na seva vinafanya kazi, kisha jaribu tena.'
                : 'Seva haikupatikana, na bidhaa haikuweza kuhifadhiwa kwenye kifaa hiki. Hakikisha intaneti inafanya kazi, kisha jaribu tena.';
            msgDiv.style.color = '#F59E0B';
            if (cachedLocally) await fetchVendorProfile();
            return;
        }

        const shareUrl = getProductShareUrl(finalProd.id, currentVendor.phone);
        const shopDisplayName = currentVendor.shopName || currentVendor.name || 'Duka Langu';
        const priceLabel = finalProd.priceUnit === 'Bei kwa makubaliano'
            ? 'Bei kwa makubaliano'
            : `Tsh ${Number(finalProd.price).toLocaleString()}`;
        const shareText = `Habari! Nimechapisha bidhaa mpya "${finalProd.name}" kwa ${priceLabel} kwenye duka langu la ${shopDisplayName} ndani ya Genge Mall.\nBofya link hii kujua zaidi:\n${shareUrl}`;

        msgDiv.innerHTML = `
            <div style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.35);border-radius:14px;padding:1.1rem;margin-top:0.8rem;text-align:left;">
                <div style="color:#34d399;font-weight:800;font-size:0.95rem;margin-bottom:4px;">✅ Bidhaa imechapishwa kikamilifu Genge Mall!</div>
                <div style="font-size:0.8rem;color:#cbd5e1;margin-bottom:12px;">Shiriki sasa kwenye mitandao ya kijamii ili wateja waje moja kwa moja kwenye duka lako:</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <a href="https://wa.me/?text=${encodeURIComponent(shareText)}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:#25D366;color:#fff;text-decoration:none;font-weight:700;font-size:0.82rem;padding:7px 14px;border-radius:8px;">
                        <ion-icon name="logo-whatsapp" style="font-size:1.1rem;"></ion-icon> Shiriki WhatsApp
                    </a>
                    <button type="button" onclick="shareVendorProduct('${finalProd.id}', '${finalProd.name.replace(/'/g, "\\'")}', ${finalProd.price}, ${finalProd.priceUnit === 'Bei kwa makubaliano'})" style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.25);font-weight:700;font-size:0.82rem;padding:7px 14px;border-radius:8px;cursor:pointer;">
                        <ion-icon name="share-social-outline" style="font-size:1.1rem;"></ion-icon> Mitandao Zaidi...
                    </button>
                    <button type="button" onclick="copyDirectLink('${shareUrl}', this)" style="display:inline-flex;align-items:center;gap:6px;background:#10b981;color:#fff;border:none;font-weight:700;font-size:0.82rem;padding:7px 14px;border-radius:8px;cursor:pointer;">
                        <ion-icon name="copy-outline" style="font-size:1.1rem;"></ion-icon> <span>Nakili Link</span>
                    </button>
                </div>
            </div>
        `;
        document.getElementById('vendor-product-form').reset();
        updateVendorVehicleFields();
        await fetchVendorProfile();

    } catch (err) {
        console.error('Error uploading product:', err);
        msgDiv.textContent = '❌ Hitilafu wakati wa kupakia: ' + (err.message || 'Jaribu tena.');
        msgDiv.style.color = '#EF4444';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> Chapisha Bidhaa Sokoni Genge Mall';
    }
}

async function deleteVendorProduct(id) {
    if (!confirm('Je, una uhakika unataka kufuta bidhaa hii sokoni?')) return;
    try {
        const response = await fetch(API_URL + `/api/vendor/products/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Server imeshindwa kufuta bidhaa.');
    } catch (e) {
        console.error('Vendor product deletion failed:', e);
    }

    // Also remove from localStorage
    try {
        const existing = JSON.parse(localStorage.getItem('genge_custom_vendor_products') || '[]');
        const filtered = existing.filter(p => !((p.id === id || p._id === id) && matchesCurrentVendorProduct(p)));
        localStorage.setItem('genge_custom_vendor_products', JSON.stringify(filtered));
    } catch (_) {}

    fetchVendorProfile();
}

function openUpgradePackageModal() {
    document.getElementById('upgrade-modal').classList.add('open');
}

function closeUpgradePackageModal() {
    document.getElementById('upgrade-modal').classList.remove('open');
}

function requestPackageUpgrade(pkgName, price, maxProducts) {
    alert(`Ombi la kuboresha kifurushi cha ${pkgName} (Tsh ${price.toLocaleString()}) limetumwa kwa Utawala wa Genge! Tafadhali fanya malipo kwa M-Pesa/Tigo Pesa namba +255 799 689 961.`);
    closeUpgradePackageModal();
}

// ── SHARING SYSTEM (Deep-Linking to Mall) ─────────────────────────
let activeShareData = null;

function getProductShareUrl(productId, vendorPhone) {
    const origin = (window.location.origin && window.location.origin !== 'null' && window.location.origin !== 'file://')
        ? window.location.origin
        : 'http://localhost:3000';
    // /share/p/:id returns HTML with proper OG meta tags so WhatsApp/Facebook
    // show the real product image, title and price when shared.
    return `${origin}/share/p/${encodeURIComponent(productId)}`;
}

window.shareVendorProduct = function(id, title, price, priceByAgreement = false) {
    const phone = currentVendor ? currentVendor.phone : '';
    const shop = currentVendor ? (currentVendor.shopName || currentVendor.name || 'Duka Langu') : 'Duka Langu';
    const shareUrl = getProductShareUrl(id, phone);
    const priceFormatted = priceByAgreement ? 'Bei kwa makubaliano' : `Tsh ${Number(price).toLocaleString()}`;
    const action = priceByAgreement ? 'Bofya link hii kuuliza bei na upatikanaji:' : 'Bofya link hii kuagiza moja kwa moja:';
    const shareText = `Habari! Tazama bidhaa hii mpya "${title}" kwa ${priceFormatted} kwenye duka langu la ${shop} ndani ya Genge Mall.\n${action}\n${shareUrl}`;

    activeShareData = {
        title,
        shop,
        price: priceFormatted,
        url: shareUrl,
        text: shareText
    };

    openShareModal(activeShareData);
};

function openShareModal(data) {
    const modal = document.getElementById('vendor-share-modal');
    if (!modal) return;

    document.getElementById('share-modal-prod-title').textContent = data.title;
    document.getElementById('share-modal-prod-price').textContent = data.price;
    document.getElementById('share-link-input').value = data.url;

    // Reset copy btn
    const copyTxt = document.getElementById('share-copy-text');
    if (copyTxt) copyTxt.textContent = 'Nakili';

    // Set Social Links
    const encodedText = encodeURIComponent(data.text);
    const encodedUrl = encodeURIComponent(data.url);

    const waBtn = document.getElementById('share-wa-btn');
    if (waBtn) waBtn.href = `https://wa.me/?text=${encodedText}`;

    const fbBtn = document.getElementById('share-fb-btn');
    if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    const xBtn = document.getElementById('share-x-btn');
    if (xBtn) xBtn.href = `https://twitter.com/intent/tweet?text=${encodedText}`;

    const tgBtn = document.getElementById('share-tg-btn');
    if (tgBtn) tgBtn.href = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

    const nativeBtn = document.getElementById('share-native-btn');
    if (nativeBtn) {
        if (navigator.share) {
            nativeBtn.style.display = 'flex';
        } else {
            nativeBtn.style.display = 'none';
        }
    }

    modal.style.display = 'flex';
}

window.closeShareModal = function() {
    const modal = document.getElementById('vendor-share-modal');
    if (modal) modal.style.display = 'none';
};

window.copyShareModalLink = function() {
    const input = document.getElementById('share-link-input');
    if (!input) return;
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value).then(() => {
        const copyTxt = document.getElementById('share-copy-text');
        if (copyTxt) copyTxt.textContent = '✅ Imenakiliwa!';
        setTimeout(() => { if (copyTxt) copyTxt.textContent = 'Nakili'; }, 3000);
    }).catch(() => {
        document.execCommand('copy');
        const copyTxt = document.getElementById('share-copy-text');
        if (copyTxt) copyTxt.textContent = '✅ Imenakiliwa!';
        setTimeout(() => { if (copyTxt) copyTxt.textContent = 'Nakili'; }, 3000);
    });
};

window.copyDirectLink = function(url, btn) {
    navigator.clipboard.writeText(url).then(() => {
        const span = btn.querySelector('span');
        if (span) span.textContent = '✅ Imenakiliwa!';
        setTimeout(() => { if (span) span.textContent = 'Nakili Link'; }, 2500);
    }).catch(() => {
        const span = btn.querySelector('span');
        if (span) span.textContent = '✅ Imenakiliwa!';
        setTimeout(() => { if (span) span.textContent = 'Nakili Link'; }, 2500);
    });
};

window.triggerNativeShare = function() {
    if (!activeShareData || !navigator.share) return;
    navigator.share({
        title: activeShareData.title,
        text: activeShareData.text,
        url: activeShareData.url
    }).catch(() => {});
};
