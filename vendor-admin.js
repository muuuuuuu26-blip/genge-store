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
    try {
        const res = await fetch(`/api/vendor/profile/${currentVendor.phone}`);
        if (res.ok) {
            const data = await res.json();
            currentVendor = { ...currentVendor, ...data.vendor };
            localStorage.setItem('genge_vendor', JSON.stringify(currentVendor));
            updateVendorUI();
            renderVendorProducts(data.products || []);
        }
    } catch (e) {
        console.error('Error fetching profile:', e);
    }
}

function updateVendorUI() {
    if (!currentVendor) return;

    document.getElementById('display-shop-name').textContent = currentVendor.shopName || currentVendor.name;
    document.getElementById('display-nida-tin').textContent = currentVendor.nidaOrTin || 'NIDA Verified';
    document.getElementById('display-vendor-phone').textContent = currentVendor.phone || '';

    const pkg = currentVendor.package || { name: 'Basic', price: 5000, maxProducts: 25 };
    document.getElementById('display-pkg-name').textContent = pkg.name + ' Vendor';
    document.getElementById('display-pkg-price').textContent = `Tsh ${pkg.price.toLocaleString()}/mwezi`;
    document.getElementById('display-max-count').textContent = pkg.maxProducts || 25;
}

function renderVendorProducts(products) {
    const container = document.getElementById('vendor-products-container');
    const usedCount = products.length;
    const maxCount = (currentVendor.package ? currentVendor.package.maxProducts : 25) || 25;

    document.getElementById('display-used-count').textContent = usedCount;
    document.getElementById('badge-limit-left').textContent = `Bidhaa zilizosalia: ${Math.max(0, maxCount - usedCount)}`;

    const percentage = Math.min(100, Math.round((usedCount / maxCount) * 100));
    const fill = document.getElementById('usage-progress-fill');
    fill.style.width = percentage + '%';

    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">
                <ion-icon name="bag-handle-outline" style="font-size: 3rem; margin-bottom: 0.5rem;"></ion-icon>
                <p>Bado hujaweka bidhaa yoyote sokoni Genge Mall.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(p => `
        <div class="vendor-prod-item">
            <img src="${p.icon}" alt="${p.name}">
            <div class="vendor-prod-body">
                <h4>${p.name}</h4>
                <div class="price">Tsh ${p.price.toLocaleString()}</div>
                <div class="vendor-prod-actions">
                    <button class="v-delete-btn" onclick="deleteVendorProduct('${p.id}')">
                        <ion-icon name="trash-outline"></ion-icon> Futa Sokoni
                    </button>
                </div>
            </div>
        </div>
    `).join('');
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

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', dept);
    formData.append('dept', dept);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('desc', desc);
    formData.append('vendorPhone', currentVendor.phone);
    formData.append('image', fileInput.files[0]);

    const submitBtn = document.getElementById('upload-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Inapakia bidhaa...';

    try {
        const res = await fetch('/api/vendor/products', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (!res.ok) {
            msgDiv.textContent = data.message || 'Imefeli kupakia bidhaa.';
            msgDiv.style.color = '#EF4444';
        } else {
            msgDiv.textContent = '✅ ' + data.message;
            msgDiv.style.color = '#10B981';
            document.getElementById('vendor-product-form').reset();
            fetchVendorProfile();
        }
    } catch (err) {
        msgDiv.textContent = 'Kosa wakati wa kutuma picha. Jaribu tena.';
        msgDiv.style.color = '#EF4444';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<ion-icon name="checkmark-circle-outline"></ion-icon> Chapisha Bidhaa Sokoni Genge Mall';
    }
}

async function deleteVendorProduct(id) {
    if (!confirm('Je, una uhakika unataka kufuta bidhaa hii sokoni?')) return;
    try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchVendorProfile();
        } else {
            alert('Imefeli kufuta bidhaa.');
        }
    } catch (e) {
        alert('Kosa wakati wa kufuta bidhaa.');
    }
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
