const API_URL = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

// ── LOGIN PROTECTION ─────────────────────────────────────────────
const ADMIN_USER = 'genge-letu';
const ADMIN_PASS = 'gengetz2026';

function attemptLogin() {
    const user = document.getElementById('admin-username').value.trim();
    const pass = document.getElementById('admin-password').value.trim();
    const errEl = document.getElementById('login-error');

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem('genge_admin_auth', '1');
        document.getElementById('login-overlay').classList.add('hidden');
        errEl.innerText = '';
    } else {
        errEl.innerText = '❌ Username au Password si sahihi. Jaribu tena.';
        document.getElementById('admin-password').value = '';
    }
}

// Allow pressing Enter on inputs to trigger login
document.addEventListener('DOMContentLoaded', () => {
    ['admin-username', 'admin-password'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('keydown', (e) => { if (e.key === 'Enter') attemptLogin(); });
    });

    // Check if already authenticated in this session
    if (sessionStorage.getItem('genge_admin_auth') === '1') {
        document.getElementById('login-overlay').classList.add('hidden');
    }
});
// ─────────────────────────────────────────────────────────────────


document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    // Optional: Refresh orders every 10 seconds automatically to simulate real-time
    setInterval(loadOrders, 10000);
});

let currentOrders = [];

async function loadOrders() {
    try {
        const response = await fetch(API_URL + '/api/orders');
        const orders = await response.json();
        
        console.log('Fetched orders from server:', orders);
        
        currentOrders = orders; // Save for printInvoice
        updateStats(orders);
        renderOrdersTable(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
    }
}

function updateStats(orders) {
    document.getElementById('total-orders').innerText = orders.length;
    
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    document.getElementById('pending-orders').innerText = pendingCount;
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('orders-tbody');
    const noOrdersMsg = document.getElementById('no-orders-msg');
    
    if (orders.length === 0) {
        tbody.innerHTML = '';
        noOrdersMsg.style.display = 'block';
        return;
    }
    
    noOrdersMsg.style.display = 'none';
    tbody.innerHTML = '';
    
    orders.forEach(order => {
        const tr = document.createElement('tr');
        
        // Format Items
        let itemsHtml = '<div class="order-items">';
        order.items.forEach(item => {
            itemsHtml += `<div>- ${item.title}</div>`;
        });
        itemsHtml += '</div>';
        
        // Status Badge
        let statusBadge = '';
        let paymentBadge = '';
        let actionButtons = '';
        
        // Payment Status Badge
        const paymentStatus = order.paymentStatus || 'pending';
        console.log(`Order ${order.id} - Payment Status: ${paymentStatus}, Order Status: ${order.status}`);
        if (paymentStatus === 'paid') {
            paymentBadge = '<span class="badge payment-paid">💳 Ililipwa</span>';
        } else if (paymentStatus === 'failed') {
            paymentBadge = '<span class="badge payment-failed">❌ Haikusurf</span>';
        } else {
            paymentBadge = '<span class="badge payment-pending">⏳ Inasubiri</span>';
        }
        
        // Status Selector for Admin Control
        const currentStatus = order.status || 'pending';
        actionButtons = `
            <div class="actions" style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;">
                <select onchange="updateOrderStatus('${order.id}', this.value)" style="padding:0.4rem 0.6rem;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(15,23,42,0.9);color:#fff;font-size:0.85rem;cursor:pointer;">
                    <option value="pending" ${currentStatus === 'pending' ? 'selected' : ''}>⏳ Inasubiri Malipo</option>
                    <option value="processing" ${currentStatus === 'processing' ? 'selected' : ''}>👨‍🍳 Inaandaliwa (Processing)</option>
                    <option value="in_transit" ${currentStatus === 'in_transit' ? 'selected' : ''}>🛵 Ipo Njiani (In-Transit)</option>
                    <option value="delivered" ${currentStatus === 'delivered' ? 'selected' : ''}>✅ Imefikishwa (Delivered)</option>
                    <option value="rejected" ${currentStatus === 'rejected' ? 'selected' : ''}>❌ Imekataliwa (Cancelled)</option>
                </select>
                <button class="btn-delete" onclick="deleteOrder('${order.id}')" title="Futa Oda Kabisa">🗑️</button>
                <button class="btn-print" onclick="printInvoice('${order.id}')" title="Print Invoice">🖨️</button>
            </div>
        `;
        
        if (currentStatus === 'processing') {
            statusBadge = '<span class="badge pending" style="background:#3b82f6;color:#fff;">👨‍🍳 Inaandaliwa</span>';
        } else if (currentStatus === 'in_transit') {
            statusBadge = '<span class="badge pending" style="background:#f59e0b;color:#fff;">🛵 Ipo Njiani</span>';
        } else if (currentStatus === 'delivered') {
            statusBadge = '<span class="badge accepted">✅ Imefikishwa</span>';
        } else if (currentStatus === 'rejected') {
            statusBadge = '<span class="badge rejected">❌ Imekataliwa</span>';
        } else {
            statusBadge = '<span class="badge pending">⏳ Inasubiri</span>';
        }
        
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);
        };

        let gpsLink = '';
        if (order.customer.gps && order.customer.gps.lat && order.customer.gps.lng) {
            gpsLink += `<a href="https://www.google.com/maps/dir/?api=1&destination=${order.customer.gps.lat},${order.customer.gps.lng}" target="_blank" class="map-link" style="color: #10B981; text-decoration: none; font-size: 0.85rem; display: block; margin-top: 5px;">📍 Pata Direction (Kutoka kwenye GPS)</a>`;
        }
        if (order.customer.location) {
            // Append city context so Google Maps finds the right location in Tanzania
            const locationWithContext = order.customer.location + ', Dar es Salaam, Tanzania';
            const encodedLoc = encodeURIComponent(locationWithContext);
            gpsLink += `<a href="https://www.google.com/maps/dir/?api=1&destination=${encodedLoc}" target="_blank" class="map-link" style="color: #F59E0B; text-decoration: none; font-size: 0.85rem; display: block; margin-top: 5px;">🛣️ Pata Direction (Kutoka kwenye Jina aliloandika)</a>`;
        }

        tr.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td class="customer-info">
                <strong>${order.customer.name}</strong>
                <span>📞 ${order.customer.phone}</span>
                <span>📍 ${order.customer.location}</span>
                ${gpsLink}
            </td>
            <td>${itemsHtml}</td>
            <td><strong>${formatCurrency(order.total)}</strong></td>
            <td>${order.date}</td>
            <td>
                <div>${statusBadge}</div>
                <div style="margin-top: 5px;">${paymentBadge}</div>
            </td>
            <td>${actionButtons}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

window.updateOrderStatus = async function(orderId, newStatus) {
    try {
        console.log('Updating order:', orderId, 'to status:', newStatus);
        const response = await fetch(API_URL + `/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Order updated successfully:', result);
            // Wait 500ms to ensure database update before refreshing
            setTimeout(() => loadOrders(), 500);
        } else {
            console.error('Error response:', response.status);
            alert('Kosa kubadilisha hali ya oda.');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Tatizo la mtandao.');
    }
};

window.deleteOrder = async function(orderId) {
    if (!confirm('Onyo: Je, una uhakika unataka kufuta oda hii KIATU (permanently)? Huwezi kuirudisha.')) {
        return;
    }
    
    try {
        const response = await fetch(API_URL + `/api/orders/${orderId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadOrders(); // Refresh table
        } else {
            alert('Kosa kufuta oda.');
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        alert('Tatizo la mtandao.');
    }
};

// --- Tab Switching Logic ---
window.showSection = function(section, anchor) {
    // Update nav active state
    document.querySelectorAll('.admin-nav a').forEach(el => el.classList.remove('active'));
    if (anchor) {
        anchor.classList.add('active');
    }

    if (section === 'orders') {
        document.getElementById('orders-section').style.display = 'block';
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('feedback-section').style.display = 'none';
        document.getElementById('products-section').style.display = 'none';
        document.getElementById('packages-section').style.display = 'none';
        document.querySelector('.top-header h1').innerText = 'Oda za Wateja';
    } else if (section === 'upload') {
        document.getElementById('orders-section').style.display = 'none';
        document.getElementById('upload-section').style.display = 'block';
        document.getElementById('feedback-section').style.display = 'none';
        document.getElementById('products-section').style.display = 'none';
        document.getElementById('packages-section').style.display = 'none';
        document.querySelector('.top-header h1').innerText = 'Pakia Bidhaa Mpya';
    } else if (section === 'feedback') {
        document.getElementById('orders-section').style.display = 'none';
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('feedback-section').style.display = 'block';
        document.getElementById('products-section').style.display = 'none';
        document.getElementById('packages-section').style.display = 'none';
        document.querySelector('.top-header h1').innerText = 'Maoni ya Wateja';
        loadFeedbacks();
    } else if (section === 'products') {
        document.getElementById('orders-section').style.display = 'none';
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('feedback-section').style.display = 'none';
        document.getElementById('products-section').style.display = 'block';
        document.getElementById('packages-section').style.display = 'none';
        document.querySelector('.top-header h1').innerText = 'Hariri Bei za Bidhaa';
        loadProducts();
    } else if (section === 'packages') {
        document.getElementById('orders-section').style.display = 'none';
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('feedback-section').style.display = 'none';
        document.getElementById('products-section').style.display = 'none';
        document.getElementById('packages-section').style.display = 'block';
        if (document.getElementById('mall-control-section')) document.getElementById('mall-control-section').style.display = 'none';
        document.querySelector('.top-header h1').innerText = 'Vifurushi vya Familia';
        loadPackages();
    } else if (section === 'mall-control') {
        document.getElementById('orders-section').style.display = 'none';
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('feedback-section').style.display = 'none';
        document.getElementById('products-section').style.display = 'none';
        document.getElementById('packages-section').style.display = 'none';
        if (document.getElementById('mall-control-section')) document.getElementById('mall-control-section').style.display = 'block';
        document.querySelector('.top-header h1').innerText = '🛍️ Genge Mall Control Panel';
        loadMallAdminVendors();
    }
};

// ── SUPER ADMIN: GENGE MALL VENDOR CONTROL ─────────────────────────
async function loadMallAdminVendors() {
    const tbody = document.getElementById('admin-vendors-tbody');
    const noMsg = document.getElementById('no-admin-vendors-msg');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:1.5rem;color:var(--text-muted);">Inavuta data ya wauzaji...</td></tr>';

    try {
        const res = await fetch('/api/admin/vendors');
        const vendors = await res.json();

        if (!vendors || vendors.length === 0) {
            tbody.innerHTML = '';
            if (noMsg) noMsg.style.display = 'block';
            return;
        }

        if (noMsg) noMsg.style.display = 'none';

        tbody.innerHTML = vendors.map(v => {
            const isSuspended = (v.status === 'suspended' || v.status === 'blocked');
            const pkg = v.package || { name: 'Basic', price: 5000, maxProducts: 25 };
            const statusBadge = isSuspended
                ? `<span style="background:rgba(239,68,68,0.2);color:#EF4444;padding:4px 10px;border-radius:12px;font-weight:700;font-size:0.8rem;">🚫 IMEFUNGIWA</span>`
                : `<span style="background:rgba(16,185,129,0.2);color:#10B981;padding:4px 10px;border-radius:12px;font-weight:700;font-size:0.8rem;">✅ ACTIVE</span>`;

            return `
                <tr>
                    <td>
                        <strong>${v.shopName || v.name}</strong><br>
                        <span style="font-size:0.8rem;color:var(--text-muted);">${v.name}</span>
                    </td>
                    <td><code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;color:#f59e0b;">${v.nidaOrTin || 'Bila NIDA/TIN'}</code></td>
                    <td><strong>${v.phone}</strong></td>
                    <td>
                        <strong style="color:#10B981;">${pkg.name}</strong><br>
                        <span style="font-size:0.78rem;color:var(--text-muted);">(Tsh ${pkg.price.toLocaleString()}/mwezi - max ${pkg.maxProducts})</span>
                    </td>
                    <td><strong>${v.productCount || 0} / ${pkg.maxProducts || 25}</strong> Bidhaa</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div style="display:flex;gap:6px;flex-wrap:wrap;">
                            <button onclick="toggleVendorStatus('${v.phone}', '${v.status}')" style="background:${isSuspended ? '#10B981' : '#EF4444'};color:#fff;border:none;padding:5px 10px;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.8rem;">
                                ${isSuspended ? '✅ Fungulia' : '🚫 Fungia'}
                            </button>
                            <button onclick="changeVendorPackage('${v.phone}')" style="background:#F59E0B;color:#000;border:none;padding:5px 10px;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.8rem;">
                                🚀 Kifurushi
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#EF4444;">Imefeli kuleta wauzaji.</td></tr>';
    }
}

async function toggleVendorStatus(phone, currentStatus) {
    const isBlocking = (currentStatus === 'active');
    let reason = '';
    
    if (isBlocking) {
        reason = prompt('Weka sababu ya kumfungia/kumsimamisha muuzaji huyu:', 'Ukiukaji wa taratibu za Genge Mall');
        if (reason === null) return;
    }

    const newStatus = isBlocking ? 'suspended' : 'active';

    try {
        const res = await fetch(`/api/admin/vendors/${phone}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, reason: reason })
        });

        const data = await res.json();
        alert(data.message || 'Hali imebadilishwa!');
        loadMallAdminVendors();
    } catch (err) {
        alert('Kosa wakati wa kubadilisha status ya muuzaji.');
    }
}

async function changeVendorPackage(phone) {
    const pkgChoice = prompt('Chagua Kifurushi kipya kwa muuzaji huyu:\n1 = Basic (Tsh 5,000 / 25 Bidhaa)\n2 = Silver (Tsh 10,000 / 45 Bidhaa)\n3 = Gold (Tsh 15,000 / 60 Bidhaa)', '1');
    if (!pkgChoice) return;

    let packageName = 'Basic';
    if (pkgChoice === '2' || pkgChoice.toLowerCase() === 'silver') packageName = 'Silver';
    if (pkgChoice === '3' || pkgChoice.toLowerCase() === 'gold') packageName = 'Gold';

    try {
        const res = await fetch(`/api/admin/vendors/${phone}/package`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ packageName: packageName })
        });

        const data = await res.json();
        alert(data.message || 'Kifurushi kimbadilishwa!');
        loadMallAdminVendors();
    } catch (err) {
        alert('Kosa wakati wa kubadilisha kifurushi.');
    }
}

// --- Product Upload Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const statusEl = document.getElementById('upload-status');
            statusEl.innerText = 'Inapakia... tafadhali subiri.';
            statusEl.style.color = '#333';

            const formData = new FormData(uploadForm);

            try {
                const response = await fetch(API_URL + '/api/products', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    statusEl.innerText = '✅ Bidhaa imepakiwa kikamilifu!';
                    statusEl.style.color = 'green';
                    uploadForm.reset();
                } else {
                    statusEl.innerText = '❌ Kosa: ' + result.message;
                    statusEl.style.color = 'red';
                }
            } catch (error) {
                console.error('Error uploading product:', error);
                statusEl.innerText = '❌ Tatizo la mtandao, hakikisha server inafanya kazi.';
                statusEl.style.color = 'red';
            }
        });
    }
});

// ── PRODUCTS MANAGEMENT ──────────────────────────────────────────────────────
let allProducts = [];

async function loadProducts() {
    const tbody = document.getElementById('products-tbody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:rgba(255,255,255,0.4);padding:1.5rem;">Inapakia bidhaa...</td></tr>';
    try {
        const res = await fetch(API_URL + '/api/products');
        allProducts = await res.json();
        renderProductsTable(allProducts);
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" style="color:red;text-align:center;">Tatizo la mtandao.</td></tr>';
    }
}

window.filterProducts = function() {
    const cat = document.getElementById('products-filter').value;
    const filtered = cat === 'all' ? allProducts : allProducts.filter(p => p.category === cat);
    renderProductsTable(filtered);
};

function renderProductsTable(products) {
    const tbody = document.getElementById('products-tbody');
    const fmt = (n) => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);
    tbody.innerHTML = '';
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:1.5rem;">Hakuna bidhaa za kundi hili.</td></tr>';
        return;
    }
    products.forEach(p => {
        const tr = document.createElement('tr');
        
        let imgHtml = '';
        if (p.image) {
            const imgSrc = p.image.startsWith('http') || p.image.startsWith('/') ? p.image : API_URL + '/' + p.image;
            imgHtml = `<img src="${imgSrc}" alt="${p.name}" style="width:45px;height:45px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;">`;
        } else if (p.isImage && p.icon) {
            imgHtml = `<img src="${pkgIcon(p)}" alt="${p.name}" style="width:45px;height:45px;object-fit:cover;border-radius:8px;border:1px solid #e2e8f0;">`;
        } else {
            imgHtml = `<span style="font-size:1.8rem;">${p.icon || '🥦'}</span>`;
        }

        tr.innerHTML = `
            <td>${imgHtml}</td>
            <td>
                <input type="text" id="name-${p.id}" value="${p.name.replace(/"/g, '&quot;')}"
                    style="width:100%;min-width:130px;padding:0.4rem 0.6rem;border-radius:8px;border:1px solid var(--border);
                    background:var(--bg-main);color:var(--text-main);font-size:0.9rem;font-weight:600;">
            </td>
            <td>
                <select id="cat-${p.id}" style="padding:0.4rem 0.6rem;border-radius:8px;border:1px solid var(--border);background:var(--bg-main);color:var(--text-main);font-size:0.85rem;">
                    <option value="matunda" ${p.category === 'matunda' ? 'selected' : ''}>Matunda</option>
                    <option value="mbogamboga" ${p.category === 'mbogamboga' ? 'selected' : ''}>Mbogamboga</option>
                    <option value="mafuta" ${p.category === 'mafuta' ? 'selected' : ''}>Mafuta</option>
                    <option value="nyama" ${p.category === 'nyama' ? 'selected' : ''}>Nyama</option>
                    <option value="samaki" ${p.category === 'samaki' ? 'selected' : ''}>Samaki</option>
                    <option value="nafaka" ${p.category === 'nafaka' ? 'selected' : ''}>Nafaka</option>
                    <option value="vinywaji" ${p.category === 'vinywaji' ? 'selected' : ''}>Vinywaji</option>
                </select>
            </td>
            <td><strong style="color:#10b981;">${fmt(p.price)}</strong></td>
            <td>
                <input type="number" id="price-${p.id}" value="${p.price}" min="0" step="50"
                    style="width:100px;padding:0.4rem 0.6rem;border-radius:8px;border:1px solid var(--border);
                    background:var(--bg-main);color:var(--text-main);font-size:0.9rem;font-weight:600;">
            </td>
            <td>
                <button onclick="updateFullProduct('${p.id}')"
                    style="padding:0.45rem 0.9rem;background:#10b981;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-right:6px;">
                    💾 Hifadhi Taarifa
                </button>
                <button onclick="deleteProduct('${p.id}', '${p.name.replace(/'/g, "\\'")}')"
                    style="padding:0.45rem 0.7rem;background:#ef4444;color:#fff;border:none;border-radius:8px;cursor:pointer;">
                    🗑️
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function pkgIcon(p) { return p.icon; }

window.updateFullProduct = async function(productId) {
    const newName = document.getElementById('name-' + productId).value.trim();
    const newCat = document.getElementById('cat-' + productId).value;
    const newPrice = document.getElementById('price-' + productId).value;

    if (!newName) { alert('Tafadhali weka jina la bidhaa.'); return; }
    if (!newPrice || isNaN(newPrice) || Number(newPrice) < 0) { alert('Tafadhali weka bei sahihi.'); return; }

    try {
        const res = await fetch(API_URL + '/api/products/' + productId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, category: newCat, price: Number(newPrice) })
        });
        if (res.ok) {
            const p = allProducts.find(p => p.id === productId);
            if (p) { p.name = newName; p.category = newCat; p.price = Number(newPrice); }
            alert('✅ Taarifa za bidhaa zimehifadhiwa kikamilifu!');
        } else { alert('❌ Imeshindwa kuhifadhi taarifa za bidhaa.'); }
    } catch (err) { alert('Tatizo la mtandao.'); }
};

window.updateProductPrice = window.updateFullProduct;

window.deleteProduct = async function(productId, productName) {
    if (!confirm(`Onyo: Unataka kufuta bidhaa "${productName}" kabisa?`)) return;
    try {
        const res = await fetch(API_URL + '/api/products/' + productId, { method: 'DELETE' });
        if (res.ok) {
            allProducts = allProducts.filter(p => p.id !== productId);
            window.filterProducts();
            alert('✅ Bidhaa imefutwa.');
        } else { alert('❌ Imeshindwa kufuta bidhaa.'); }
    } catch (err) { alert('Tatizo la mtandao.'); }
};

// ── PACKAGES MANAGEMENT ──────────────────────────────────────────────────────

// Smart Feature Matcher: Matches item description (e.g., "Mchele Kg 5") with products database
function matchFeatureWithProduct(featureStr, productsList) {
    if (!featureStr || featureStr.trim().startsWith('<i') || featureStr.toLowerCase().includes('motto:')) {
        return { isMotto: true, text: featureStr };
    }

    const cleanStr = featureStr.trim();
    
    // Extract quantity / number from string
    let quantity = 1;
    const numMatch = cleanStr.match(/(\d+(?:\.\d+)?)/);
    if (numMatch) {
        quantity = parseFloat(numMatch[1]) || 1;
    }

    const lower = cleanStr.toLowerCase();
    let bestProduct = null;

    if (productsList && productsList.length > 0) {
        const keywords = lower.replace(/\b(\d+(?:\.\d+)?|kg|lita|litres|l|tray|pack|pakiti|pcs|fungu|mzima|fresh)\b/gi, '').trim().split(/\s+/).filter(k => k.length > 2);
        
        let highestScore = 0;
        productsList.forEach(p => {
            const pNameLower = p.name.toLowerCase();
            let score = 0;
            
            keywords.forEach(kw => {
                if (pNameLower.includes(kw)) score += 3;
            });

            // Specific commodity matching rules
            if (lower.includes('mchele') && pNameLower.includes('mchele')) score += 5;
            if (lower.includes('sembe') && pNameLower.includes('sembe')) score += 5;
            if (lower.includes('dona') && pNameLower.includes('dona')) score += 5;
            if (lower.includes('mafuta') && pNameLower.includes('mafuta')) score += 5;
            if (lower.includes('sukari') && pNameLower.includes('sukari')) score += 5;
            if (lower.includes('maharage') && pNameLower.includes('maharage')) score += 5;
            if (lower.includes('ngano') && pNameLower.includes('ngano')) score += 5;
            if (lower.includes('vitunguu') && pNameLower.includes('vitunguu')) score += 5;
            if (lower.includes('nyanya') && pNameLower.includes('nyanya')) score += 5;
            if (lower.includes('karoti') && pNameLower.includes('karoti')) score += 5;
            if (lower.includes('kuku') && pNameLower.includes('kuku')) score += 5;
            if (lower.includes('nyama') && pNameLower.includes('nyama')) score += 5;
            if (lower.includes('mayai') && pNameLower.includes('mayai')) score += 5;

            if (score > highestScore) {
                highestScore = score;
                bestProduct = p;
            }
        });
    }

    if (bestProduct && bestProduct.price) {
        const subtotal = quantity * bestProduct.price;
        return {
            isMotto: false,
            text: cleanStr,
            matchedName: bestProduct.name,
            quantity: quantity,
            unitPrice: bestProduct.price,
            subtotal: subtotal,
            isMatched: true
        };
    } else {
        return {
            isMotto: false,
            text: cleanStr,
            matchedName: 'Haijapatikana sokoni',
            quantity: quantity,
            unitPrice: 0,
            subtotal: 0,
            isMatched: false
        };
    }
}

// Stores calculated market values in memory for live math binding
const packageCalculatedTotals = {};

async function loadPackages() {
    const grid = document.getElementById('packages-grid');
    grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:2rem;">Inapakia vifurushi na kukokotoa bei za sokoni...</p>';
    
    try {
        if (allProducts.length === 0) {
            const prodRes = await fetch(API_URL + '/api/products');
            allProducts = await prodRes.json();
        }

        const res = await fetch(API_URL + '/api/packages');
        const packages = await res.json();
        grid.innerHTML = '';

        packages.forEach(pkg => {
            const card = document.createElement('div');
            card.id = `pkg-card-${pkg.id}`;
            card.className = 'package-card-admin';
            card.style.cssText = 'background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:1.4rem;box-shadow:0 8px 24px rgba(0,0,0,0.04);display:flex;flex-direction:column;justify-content:space-between;gap:1.2rem;position:relative;';

            renderPackageCardContent(card, pkg);
            grid.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        grid.innerHTML = '<p style="color:red;grid-column:1/-1;text-align:center;">Tatizo la mtandao wakati wa kuvuta vifurushi.</p>';
    }
}

function renderPackageCardContent(card, pkg) {
    const fmt = (n) => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);
    
    let imgHtml = '';
    if (pkg.isImage && pkg.icon) {
        imgHtml = `<img src="${pkg.icon}" alt="${pkg.title}" style="width:100%;height:140px;object-fit:cover;border-radius:12px;margin-bottom:0.6rem;">`;
    } else {
        imgHtml = `<div style="font-size:3rem;text-align:center;margin-bottom:0.5rem;">📦</div>`;
    }

    const features = pkg.features || [];
    const featuresText = features.join('\n');

    let marketTotal = 0;
    let breakdownRowsHtml = '';

    features.forEach(fStr => {
        const item = matchFeatureWithProduct(fStr, allProducts);
        if (item.isMotto) return;

        if (item.isMatched) {
            marketTotal += item.subtotal;
            breakdownRowsHtml += `
                <tr style="border-bottom:1px solid rgba(0,0,0,0.05);font-size:0.82rem;">
                    <td style="padding:4px 6px;font-weight:600;">${item.text}</td>
                    <td style="padding:4px 6px;text-align:center;color:#64748b;">${item.quantity}</td>
                    <td style="padding:4px 6px;text-align:right;color:#64748b;">${fmt(item.unitPrice)}</td>
                    <td style="padding:4px 6px;text-align:right;font-weight:700;color:#10b981;">${fmt(item.subtotal)}</td>
                </tr>
            `;
        } else {
            breakdownRowsHtml += `
                <tr style="border-bottom:1px solid rgba(0,0,0,0.05);font-size:0.82rem;">
                    <td style="padding:4px 6px;font-weight:600;">${item.text}</td>
                    <td style="padding:4px 6px;text-align:center;color:#64748b;">${item.quantity}</td>
                    <td colspan="2" style="padding:4px 6px;text-align:right;color:#ef4444;font-size:0.75rem;">(Bei haijapatikana sokoni)</td>
                </tr>
            `;
        }
    });

    packageCalculatedTotals[pkg.id] = marketTotal;

    const sellingPrice = pkg.price !== undefined ? pkg.price : marketTotal;
    let extraTsh = 0;
    let discTsh = 0;

    if (sellingPrice > marketTotal) {
        extraTsh = sellingPrice - marketTotal;
    } else if (sellingPrice < marketTotal) {
        discTsh = marketTotal - sellingPrice;
    }

    card.innerHTML = `
        <div>
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                ${imgHtml}
                <button onclick="deletePackage('${pkg.id}', '${pkg.title.replace(/'/g, "\\'")}')" title="Futa Kifurushi" style="background:#fee2e2;color:#ef4444;border:none;padding:0.4rem 0.7rem;border-radius:8px;cursor:pointer;font-weight:700;margin-left:8px;">
                    🗑️ Futa
                </button>
            </div>

            <!-- Title -->
            <label style="font-weight:700;font-size:0.8rem;color:var(--text-muted);display:block;margin-bottom:2px;">Jina la Kifurushi:</label>
            <input type="text" id="pkg-title-${pkg.id}" value="${pkg.title.replace(/"/g, '&quot;')}"
                style="width:100%;padding:0.5rem 0.8rem;border-radius:8px;border:1px solid var(--border);background:var(--bg-main);color:var(--text-main);font-size:1rem;font-weight:700;margin-bottom:1rem;box-sizing:border-box;">

            <!-- Automatic Breakdown Card -->
            <div style="background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:0.8rem;margin-bottom:1rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-size:0.82rem;font-weight:700;color:#059669;">📊 Uchanganuzi wa Bei za Sokoni:</span>
                    <span id="pkg-market-total-${pkg.id}" style="font-size:0.95rem;font-weight:800;color:#059669;">Jumla: ${fmt(marketTotal)}</span>
                </div>
                <div id="pkg-breakdown-box-${pkg.id}" style="max-height:160px;overflow-y:auto;background:var(--bg-card);border-radius:8px;border:1px solid var(--border);">
                    <table style="width:100%;border-collapse:collapse;">
                        <thead>
                            <tr style="background:#f1f5f9;font-size:0.75rem;color:#64748b;text-align:left;">
                                <th style="padding:4px 6px;">Bidhaa</th>
                                <th style="padding:4px 6px;text-align:center;">Idadi</th>
                                <th style="padding:4px 6px;text-align:right;">Bei/Moja</th>
                                <th style="padding:4px 6px;text-align:right;">Jumla</th>
                            </tr>
                        </thead>
                        <tbody id="pkg-breakdown-tbody-${pkg.id}">
                            ${breakdownRowsHtml || '<tr><td colspan="4" style="text-align:center;padding:6px;font-size:0.8rem;color:#94a3b8;">Hakuna bidhaa zilizotambuliwa.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Price & Markup Controls -->
            <div style="background:var(--bg-main);border:1px solid var(--border);border-radius:12px;padding:0.9rem;margin-bottom:1rem;">
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:8px;">
                    <div>
                        <label style="font-weight:700;font-size:0.75rem;color:#d97706;display:block;margin-bottom:2px;">➕ Ongezeko/Faida:</label>
                        <input type="number" id="pkg-extra-${pkg.id}" value="${extraTsh}" min="0" step="500"
                            oninput="onPkgExtraInput('${pkg.id}')"
                            style="width:100%;padding:0.45rem 0.6rem;border-radius:8px;border:1px solid #f59e0b;background:var(--bg-card);color:#f59e0b;font-size:0.95rem;font-weight:700;box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-weight:700;font-size:0.75rem;color:#3b82f6;display:block;margin-bottom:2px;">➖ Punguzo:</label>
                        <input type="number" id="pkg-disc-${pkg.id}" value="${discTsh}" min="0" step="500"
                            oninput="onPkgDiscInput('${pkg.id}')"
                            style="width:100%;padding:0.45rem 0.6rem;border-radius:8px;border:1px solid #3b82f6;background:var(--bg-card);color:#3b82f6;font-size:0.95rem;font-weight:700;box-sizing:border-box;">
                    </div>
                    <div>
                        <label style="font-weight:700;font-size:0.75rem;color:#10b981;display:block;margin-bottom:2px;">🏷️ Bei ya Kuuzia:</label>
                        <input type="number" id="pkg-price-${pkg.id}" value="${sellingPrice}" min="0" step="500"
                            oninput="onPkgPriceInput('${pkg.id}')"
                            style="width:100%;padding:0.45rem 0.6rem;border-radius:8px;border:2px solid #10b981;background:var(--bg-card);color:#10b981;font-size:1.05rem;font-weight:800;box-sizing:border-box;">
                    </div>
                </div>

                <!-- Quick Adjustment Buttons -->
                <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;align-items:center;">
                    <span style="font-size:0.72rem;color:var(--text-muted);font-weight:600;">Weka Ziada/Punguzo:</span>
                    <button onclick="applyQuickAdjustment('${pkg.id}', 'exact', 0)" style="padding:2px 6px;font-size:0.72rem;border-radius:6px;border:1px solid var(--border);background:var(--bg-card);cursor:pointer;font-weight:600;">0 (Bei Halisi)</button>
                    <button onclick="applyQuickAdjustment('${pkg.id}', 'extra', 2000)" style="padding:2px 6px;font-size:0.72rem;border-radius:6px;border:1px solid #f59e0b;background:rgba(245,158,11,0.1);color:#d97706;cursor:pointer;font-weight:700;">+2,000</button>
                    <button onclick="applyQuickAdjustment('${pkg.id}', 'extra', 5000)" style="padding:2px 6px;font-size:0.72rem;border-radius:6px;border:1px solid #f59e0b;background:rgba(245,158,11,0.15);color:#d97706;cursor:pointer;font-weight:700;">+5,000</button>
                    <button onclick="applyQuickAdjustment('${pkg.id}', 'extra', 10000)" style="padding:2px 6px;font-size:0.72rem;border-radius:6px;border:1px solid #f59e0b;background:rgba(245,158,11,0.2);color:#d97706;cursor:pointer;font-weight:700;">+10,000</button>
                    <button onclick="applyQuickAdjustment('${pkg.id}', 'extra_pct', 10)" style="padding:2px 6px;font-size:0.72rem;border-radius:6px;border:1px solid #10b981;background:rgba(16,185,129,0.1);color:#059669;cursor:pointer;font-weight:700;">+10% Faida</button>
                    <button onclick="applyQuickAdjustment('${pkg.id}', 'disc_pct', 10)" style="padding:2px 6px;font-size:0.72rem;border-radius:6px;border:1px solid #3b82f6;background:rgba(59,130,246,0.1);color:#2563eb;cursor:pointer;font-weight:700;">-10% Punguzo</button>
                </div>

                <!-- Customer Savings / Markup Badge -->
                <div id="pkg-status-badge-${pkg.id}" style="padding:6px 10px;border-radius:8px;font-weight:700;font-size:0.82rem;text-align:center;"></div>
            </div>

            <!-- Items List Textarea -->
            <label style="font-weight:700;font-size:0.8rem;color:var(--text-muted);display:block;margin-bottom:2px;">Bidhaa za Ndani (Kila moja kwenye mstari mpya):</label>
            <textarea id="pkg-features-${pkg.id}" rows="5" oninput="recalculatePkgCard('${pkg.id}')"
                style="width:100%;padding:0.5rem 0.7rem;border-radius:8px;border:1px solid var(--border);background:var(--bg-main);color:var(--text-main);font-size:0.85rem;line-height:1.4;resize:vertical;box-sizing:border-box;">${featuresText}</textarea>
        </div>

        <div style="margin-top:0.8rem;">
            <button onclick="updateFullPackage('${pkg.id}')"
                style="width:100%;padding:0.7rem 1rem;background:linear-gradient(135deg, #10b981, #059669);color:#fff;border:none;border-radius:10px;cursor:pointer;font-weight:700;font-size:0.95rem;box-shadow:0 4px 12px rgba(16,185,129,0.3);">
                💾 Hifadhi Kifurushi Zote
            </button>
            <div id="pkg-msg-${pkg.id}" style="margin-top:0.4rem;font-size:0.85rem;text-align:center;"></div>
        </div>
    `;

    updatePkgCardBadge(pkg.id);
}

window.updatePkgCardBadge = function(pkgId) {
    const marketTotal = packageCalculatedTotals[pkgId] || 0;
    const priceEl = document.getElementById('pkg-price-' + pkgId);
    const badgeEl = document.getElementById('pkg-status-badge-' + pkgId);
    if (!priceEl || !badgeEl) return;

    const sellingPrice = parseFloat(priceEl.value) || 0;
    const fmt = (n) => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

    if (sellingPrice > marketTotal && marketTotal > 0) {
        const extra = sellingPrice - marketTotal;
        const pct = ((extra / marketTotal) * 100).toFixed(1);
        badgeEl.style.backgroundColor = '#fef3c7';
        badgeEl.style.color = '#b45309';
        badgeEl.innerText = `➕ Imeongezwa ${fmt(extra)} (+${pct}%) ya faida/ziada juu ya bei ya sokoni`;
    } else if (sellingPrice < marketTotal && marketTotal > 0) {
        const disc = marketTotal - sellingPrice;
        const pct = ((disc / marketTotal) * 100).toFixed(1);
        badgeEl.style.backgroundColor = '#dcfce7';
        badgeEl.style.color = '#15803d';
        badgeEl.innerText = `🎁 Mteja anaokoa ${fmt(disc)} (Punguzo la ${pct}%)`;
    } else {
        badgeEl.style.backgroundColor = '#f1f5f9';
        badgeEl.style.color = '#64748b';
        badgeEl.innerText = `Bei ipo sawa na thamani halisi ya sokoni (Bila Ongezeko/Punguzo)`;
    }
};

window.onPkgExtraInput = function(pkgId) {
    const marketTotal = packageCalculatedTotals[pkgId] || 0;
    const extraEl = document.getElementById('pkg-extra-' + pkgId);
    const discEl = document.getElementById('pkg-disc-' + pkgId);
    const priceEl = document.getElementById('pkg-price-' + pkgId);

    const extra = parseFloat(extraEl.value) || 0;
    discEl.value = 0;
    priceEl.value = marketTotal + extra;

    updatePkgCardBadge(pkgId);
};

window.onPkgDiscInput = function(pkgId) {
    const marketTotal = packageCalculatedTotals[pkgId] || 0;
    const extraEl = document.getElementById('pkg-extra-' + pkgId);
    const discEl = document.getElementById('pkg-disc-' + pkgId);
    const priceEl = document.getElementById('pkg-price-' + pkgId);

    const disc = parseFloat(discEl.value) || 0;
    extraEl.value = 0;
    priceEl.value = Math.max(0, marketTotal - disc);

    updatePkgCardBadge(pkgId);
};

window.onPkgPriceInput = function(pkgId) {
    const marketTotal = packageCalculatedTotals[pkgId] || 0;
    const extraEl = document.getElementById('pkg-extra-' + pkgId);
    const discEl = document.getElementById('pkg-disc-' + pkgId);
    const priceEl = document.getElementById('pkg-price-' + pkgId);

    const sellingPrice = parseFloat(priceEl.value) || 0;
    if (sellingPrice >= marketTotal) {
        extraEl.value = sellingPrice - marketTotal;
        discEl.value = 0;
    } else {
        extraEl.value = 0;
        discEl.value = marketTotal - sellingPrice;
    }

    updatePkgCardBadge(pkgId);
};

window.applyQuickAdjustment = function(pkgId, mode, value) {
    const marketTotal = packageCalculatedTotals[pkgId] || 0;
    const extraEl = document.getElementById('pkg-extra-' + pkgId);
    const discEl = document.getElementById('pkg-disc-' + pkgId);
    const priceEl = document.getElementById('pkg-price-' + pkgId);

    if (mode === 'exact') {
        extraEl.value = 0;
        discEl.value = 0;
        priceEl.value = marketTotal;
    } else if (mode === 'extra') {
        extraEl.value = value;
        discEl.value = 0;
        priceEl.value = marketTotal + value;
    } else if (mode === 'extra_pct') {
        const extra = Math.round(marketTotal * (value / 100));
        extraEl.value = extra;
        discEl.value = 0;
        priceEl.value = marketTotal + extra;
    } else if (mode === 'disc_pct') {
        const disc = Math.round(marketTotal * (value / 100));
        discEl.value = disc;
        extraEl.value = 0;
        priceEl.value = Math.max(0, marketTotal - disc);
    }

    updatePkgCardBadge(pkgId);
};

window.recalculatePkgCard = function(pkgId) {
    const featuresRaw = document.getElementById('pkg-features-' + pkgId).value;
    const features = featuresRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const fmt = (n) => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

    let marketTotal = 0;
    let breakdownRowsHtml = '';

    features.forEach(fStr => {
        const item = matchFeatureWithProduct(fStr, allProducts);
        if (item.isMotto) return;

        if (item.isMatched) {
            marketTotal += item.subtotal;
            breakdownRowsHtml += `
                <tr style="border-bottom:1px solid rgba(0,0,0,0.05);font-size:0.82rem;">
                    <td style="padding:4px 6px;font-weight:600;">${item.text}</td>
                    <td style="padding:4px 6px;text-align:center;color:#64748b;">${item.quantity}</td>
                    <td style="padding:4px 6px;text-align:right;color:#64748b;">${fmt(item.unitPrice)}</td>
                    <td style="padding:4px 6px;text-align:right;font-weight:700;color:#10b981;">${fmt(item.subtotal)}</td>
                </tr>
            `;
        } else {
            breakdownRowsHtml += `
                <tr style="border-bottom:1px solid rgba(0,0,0,0.05);font-size:0.82rem;">
                    <td style="padding:4px 6px;font-weight:600;">${item.text}</td>
                    <td style="padding:4px 6px;text-align:center;color:#64748b;">${item.quantity}</td>
                    <td colspan="2" style="padding:4px 6px;text-align:right;color:#ef4444;font-size:0.75rem;">(Bei haijapatikana sokoni)</td>
                </tr>
            `;
        }
    });

    packageCalculatedTotals[pkgId] = marketTotal;

    const marketTotalEl = document.getElementById('pkg-market-total-' + pkgId);
    const tbodyEl = document.getElementById('pkg-breakdown-tbody-' + pkgId);
    if (marketTotalEl) marketTotalEl.innerText = `Jumla: ${fmt(marketTotal)}`;
    if (tbodyEl) tbodyEl.innerHTML = breakdownRowsHtml || '<tr><td colspan="4" style="text-align:center;padding:6px;font-size:0.8rem;color:#94a3b8;">Hakuna bidhaa zilizotambuliwa.</td></tr>';

    // Recalculate price using existing extra/disc settings
    const extraEl = document.getElementById('pkg-extra-' + pkgId);
    const discEl = document.getElementById('pkg-disc-' + pkgId);
    const priceEl = document.getElementById('pkg-price-' + pkgId);

    const extra = extraEl ? (parseFloat(extraEl.value) || 0) : 0;
    const disc = discEl ? (parseFloat(discEl.value) || 0) : 0;

    if (extra > 0) {
        if (priceEl) priceEl.value = marketTotal + extra;
    } else if (disc > 0) {
        if (priceEl) priceEl.value = Math.max(0, marketTotal - disc);
    } else {
        if (priceEl) priceEl.value = marketTotal;
    }

    updatePkgCardBadge(pkgId);
};

window.updateFullPackage = async function(pkgId) {
    const newTitle = document.getElementById('pkg-title-' + pkgId).value.trim();
    const newPrice = document.getElementById('pkg-price-' + pkgId).value;
    const featuresRaw = document.getElementById('pkg-features-' + pkgId).value;
    const msgEl = document.getElementById('pkg-msg-' + pkgId);

    if (!newTitle) { msgEl.style.color = '#ef4444'; msgEl.innerText = '❌ Weka jina la kifurushi.'; return; }
    if (!newPrice || isNaN(newPrice) || Number(newPrice) < 0) { msgEl.style.color = '#ef4444'; msgEl.innerText = '❌ Weka bei sahihi.'; return; }

    const newFeatures = featuresRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);

    try {
        const res = await fetch(API_URL + '/api/packages/' + pkgId, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newTitle,
                price: Number(newPrice),
                features: newFeatures
            })
        });
        if (res.ok) {
            msgEl.style.color = '#10b981';
            msgEl.innerText = '✅ Taarifa na bei za kifurushi zimesasishwa kikamilifu!';
            setTimeout(() => {
                msgEl.innerText = '';
                loadPackages();
            }, 1800);
        } else { msgEl.style.color = '#ef4444'; msgEl.innerText = '❌ Imeshindwa kubadilisha.'; }
    } catch (err) { msgEl.style.color = '#ef4444'; msgEl.innerText = 'Tatizo la mtandao.'; }
};

window.updatePackagePrice = window.updateFullPackage;

async function loadFeedbacks() {
    const container = document.getElementById('feedback-container');
    container.innerHTML = '<p>Inavuta maoni...</p>';
    try {
        const response = await fetch(API_URL + '/api/feedback');
        const feedbacks = await response.json();

        if (feedbacks.length === 0) {
            container.innerHTML = '<p>Hakuna maoni yoyote kwa sasa.</p>';
            return;
        }

        container.innerHTML = '';
        feedbacks.forEach(fb => {
            const dateStr = new Date(fb.date).toLocaleString('sw-TZ');
            const card = document.createElement('div');
            card.className = 'feedback-card';
            card.innerHTML = `
                <div class="feedback-header">
                    <strong><ion-icon name="person-circle-outline"></ion-icon> ${fb.name}</strong>
                    <span class="feedback-date">${dateStr}</span>
                </div>
                <div class="feedback-body">
                    ${fb.message}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        container.innerHTML = '<p style="color:red">Imeshindwa kuvuta maoni. Angalia connection ya server.</p>';
    }
}

// --- Print Invoice Logic ---
window.printInvoice = function(orderId) {
    const order = currentOrders.find(o => o.id === orderId);
    
    if (!order) return;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(amount);
    };

    document.getElementById('inv-order-id').innerText = order.id;
    document.getElementById('inv-date').innerText = `Tarehe: ${order.date}`;
    document.getElementById('inv-name').innerText = order.customer.name;
    document.getElementById('inv-phone').innerText = order.customer.phone;
    document.getElementById('inv-location').innerText = order.customer.location;
    
    const tbody = document.getElementById('inv-items-body');
    tbody.innerHTML = '';
    order.items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.title} - ${item.details}</td>
            <td style="text-align: center;">${item.quantity || 1}</td>
            <td style="text-align: right;">${formatCurrency(item.price)}</td>
        `;
        tbody.appendChild(tr);
    });
    
    const deliveryCharge = order.deliveryCharge || 0;
    document.getElementById('inv-delivery').innerText = formatCurrency(deliveryCharge);
    document.getElementById('inv-total').innerText = formatCurrency(order.total);
    
    // Set payment status safely
    const paymentStatusEl = document.getElementById('inv-payment-status');
    if (paymentStatusEl) {
        const paymentStatus = order.paymentStatus || 'pending';
        if (paymentStatus === 'paid') {
            paymentStatusEl.innerText = '✅ ILILIPWA';
            paymentStatusEl.style.backgroundColor = '#D4EDDA';
            paymentStatusEl.style.color = '#155724';
        } else if (paymentStatus === 'failed') {
            paymentStatusEl.innerText = '❌ HAIKUSURF';
            paymentStatusEl.style.backgroundColor = '#F8D7DA';
            paymentStatusEl.style.color = '#721C24';
        } else {
            paymentStatusEl.innerText = '⏳ INASUBIRI MALIPO';
            paymentStatusEl.style.backgroundColor = '#FFF3CD';
            paymentStatusEl.style.color = '#856404';
        }
    }

    // Trigger Print
    window.print();
};
