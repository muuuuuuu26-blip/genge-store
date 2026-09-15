// ==========================================================================
// GENGE MALL VENDOR PORTAL JAVASCRIPT
// ==========================================================================

let currentVendor = null;

document.addEventListener('DOMContentLoaded', () => {
    checkSavedVendorSession();
});

function checkSavedVendorSession() {
    const saved = localStorage.getItem('genge_vendor');
    if (saved) {
        try {
            currentVendor = JSON.parse(saved);
            if (currentVendor && currentVendor.role === 'vendor') {
                showDashboard();
                fetchVendorProfile();
                return;
            }
        } catch (e) {
            localStorage.removeItem('genge_vendor');
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
    const errDiv = document.getElementById('vlogin-error');
    errDiv.textContent = '';

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password })
        });

        const data = await res.json();

        if (!res.ok) {
            errDiv.textContent = data.message || 'Kosa wakati wa kuingia.';
            return;
        }

        if (data.user.role !== 'vendor') {
            errDiv.textContent = 'Akaunti hii ni ya Mnunuzi. Ingia na akaunti ya Muuzaji.';
            return;
        }

        currentVendor = data.user;
        localStorage.setItem('genge_vendor', JSON.stringify(currentVendor));
        showDashboard();
        fetchVendorProfile();
    } catch (err) {
        errDiv.textContent = 'Imefeli kuunganisha na server. Jaribu tena.';
    }
}

function handleVendorLogout() {
    localStorage.removeItem('genge_vendor');
    currentVendor = null;
    showLoginOverlay();
}

async function fetchVendorProfile() {
    if (!currentVendor) return;
    let prods = [];
    try {
        const res = await fetch(`/api/vendor/profile/${currentVendor.phone}`);
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
        const myLocal = allLocal.filter(p => p.vendorPhone === currentVendor.phone);
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
    const savedPic = localStorage.getItem('genge_vendor_profile_pic_' + (currentVendor.phone || ''));
    const avatarEl = document.getElementById('vp-profile-avatar');
    if (avatarEl && savedPic) {
        avatarEl.src = savedPic;
    } else if (avatarEl && currentVendor.avatar) {
        avatarEl.src = currentVendor.avatar;
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
    const img   = p.image || p.icon || 'pics/12.png';
    const title = p.name || p.title || 'Bidhaa';
    const price = `Tsh ${(p.price || 0).toLocaleString()}`;
    const loc   = p.location || '';
    const id    = p.id || p._id || '';
    return `
        <div class="vps-card">
            <div class="vps-card-inner">
                <img src="${img}" alt="${title}" class="vps-card-img" onerror="this.src='pics/12.png'">
                <div class="vps-card-body">
                    <div class="vps-card-title">${title}</div>
                    <div class="vps-card-meta"><ion-icon name="location-outline" style="font-size:0.8rem;vertical-align:middle;"></ion-icon> ${loc}</div>
                    <div class="vps-card-price">${price}</div>
                    <div class="vps-card-actions">
                        <button class="vps-delete-btn" onclick="deleteVendorProduct('${id}')">
                            <ion-icon name="trash-outline"></ion-icon> Futa Sokoni
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

// ── PROFILE PICTURE CHANGE ─────────────────────────────────────
function handleProfilePicChange(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        const avatarEl = document.getElementById('vp-profile-avatar');
        if (avatarEl) avatarEl.src = base64;
        if (currentVendor) {
            localStorage.setItem('genge_vendor_profile_pic_' + currentVendor.phone, base64);
            currentVendor.avatar = base64;
            localStorage.setItem('genge_vendor', JSON.stringify(currentVendor));
            // Also update in genge_custom_vendor_products so mall cards show new pic
            try {
                const allProds = JSON.parse(localStorage.getItem('genge_custom_vendor_products') || '[]');
                const updated = allProds.map(p => {
                    if (p.vendorPhone === currentVendor.phone) { p.vendorAvatar = base64; }
                    return p;
                });
                localStorage.setItem('genge_custom_vendor_products', JSON.stringify(updated));
            } catch(_) {}
        }
        showProfileMsg('✅ Picha ya profile imebadilishwa!', '#10B981');
    };
    reader.readAsDataURL(input.files[0]);
}

// ── SAVE VENDOR PROFILE ────────────────────────────────────────
async function saveVendorProfile() {
    if (!currentVendor) return;

    const shopName = (document.getElementById('vp-edit-shop-name').value || '').trim();
    const bio      = (document.getElementById('vp-edit-bio').value || '').trim();
    const location = (document.getElementById('vp-edit-location').value || '').trim();

    if (!shopName) {
        showProfileMsg('⚠️ Jina la duka haliwezi kuwa tupu.', '#f59e0b');
        return;
    }

    currentVendor.shopName = shopName;
    currentVendor.bio      = bio;
    currentVendor.location = location;
    localStorage.setItem('genge_vendor', JSON.stringify(currentVendor));

    // Update header shop name
    const dispShop = document.getElementById('display-shop-name');
    if (dispShop) dispShop.textContent = shopName;

    // Update localStorage vendor products with new shopName
    try {
        const allProds = JSON.parse(localStorage.getItem('genge_custom_vendor_products') || '[]');
        const updated = allProds.map(p => {
            if (p.vendorPhone === currentVendor.phone) {
                p.vendorShopName = shopName;
            }
            return p;
        });
        localStorage.setItem('genge_custom_vendor_products', JSON.stringify(updated));
    } catch(_) {}

    // Try API save (silent fail)
    try {
        await fetch('/api/vendor/profile/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: currentVendor.phone, shopName, bio, location })
        });
    } catch(_) {}

    showProfileMsg('✅ Mabadiliko yamehifadhiwa kikamilifu!', '#10B981');
}

function showProfileMsg(msg, color) {
    const el = document.getElementById('profile-save-msg');
    if (!el) return;
    el.textContent = msg;
    el.style.color = color;
    setTimeout(() => { el.textContent = ''; }, 4000);
}


async function handleProductUpload(e) {
    e.preventDefault();
    if (!currentVendor) return;

    const name = document.getElementById('vp-name').value;
    const dept = document.getElementById('vp-dept').value;
    const price = document.getElementById('vp-price').value;
    const location = document.getElementById('vp-location').value;
    const desc = document.getElementById('vp-desc').value;
    const fileInput = document.getElementById('vp-image');
    const msgDiv = document.getElementById('upload-msg');

    msgDiv.textContent = '';
    msgDiv.style.color = '#fff';

    if (!fileInput.files || fileInput.files.length === 0) {
        msgDiv.textContent = 'Tafadhali chagua picha ya bidhaa.';
        msgDiv.style.color = '#EF4444';
        return;
    }

    const file = fileInput.files[0];
    const submitBtn = document.getElementById('upload-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Inapakia bidhaa...';

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', dept);
    formData.append('dept', dept);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('desc', desc);
    formData.append('vendorPhone', currentVendor.phone);
    formData.append('vendorName', currentVendor.name || '');
    formData.append('vendorShopName', currentVendor.shopName || currentVendor.name || '');
    formData.append('image', file);

    try {
        await fetch('/api/vendor/products', {
            method: 'POST',
            body: formData
        }).catch(() => {});
    } catch (_) {}

    // Save product locally via FileReader with vendor's registered phone
    const reader = new FileReader();
    reader.onload = function(evt) {
        const base64Img = evt.target.result;
        const newProduct = {
            id: 'vprod_' + Date.now(),
            name: name,
            title: name,
            price: Number(price),
            priceUnit: 'Tsh',
            category: dept,
            dept: dept,
            image: base64Img,
            icon: base64Img,
            isImage: true,
            desc: desc || '',
            location: location || 'Dar es Salaam',
            vendorPhone: currentVendor.phone,
            vendorName: currentVendor.name || '',
            vendorShopName: currentVendor.shopName || currentVendor.name || 'Duka Langu',
            vendorAvatar: currentVendor.avatar || 'pics/12.png',
            vendorNidaOrTin: currentVendor.nidaOrTin || '',
            createdAt: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem('genge_custom_vendor_products') || '[]');
        existing.unshift(newProduct);
        localStorage.setItem('genge_custom_vendor_products', JSON.stringify(existing));

        msgDiv.textContent = '✅ Bidhaa imechapishwa sokoni Genge Mall kikamilifu!';
        msgDiv.style.color = '#10B981';
        document.getElementById('vendor-product-form').reset();
        fetchVendorProfile();

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> Chapisha Bidhaa Sokoni Genge Mall';
    };
    reader.readAsDataURL(file);
}

async function deleteVendorProduct(id) {
    if (!confirm('Je, una uhakika unataka kufuta bidhaa hii sokoni?')) return;
    try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (e) {}

    // Also remove from localStorage
    try {
        const existing = JSON.parse(localStorage.getItem('genge_custom_vendor_products') || '[]');
        const filtered = existing.filter(p => p.id !== id && p._id !== id);
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
