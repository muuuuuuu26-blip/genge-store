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

// --- Platform Switcher ---
window.switchPlatformMode = function(mode) {
    const freshNav = document.getElementById('nav-fresh');
    const mallNav = document.getElementById('nav-mall');
    const freshBtn = document.getElementById('tab-btn-fresh');
    const mallBtn = document.getElementById('tab-btn-mall');

    const freshSections = ['orders-section','upload-section','feedback-section','products-section','packages-section'];
    const mallSections = ['mall-control-section'];

    if (mode === 'fresh') {
        if (freshNav) freshNav.style.display = '';
        if (mallNav) mallNav.style.display = 'none';
        if (freshBtn) freshBtn.classList.add('active');
        if (mallBtn) mallBtn.classList.remove('active');
        mallSections.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = 'none'; });
        // Show orders by default
        freshSections.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = 'none'; });
        const orders = document.getElementById('orders-section');
        if (orders) orders.style.display = 'block';
        const h = document.querySelector('.top-header h1');
        if (h) h.innerText = 'Oda za Wateja';
        // Reset fresh nav active
        document.querySelectorAll('#nav-fresh a').forEach(a => a.classList.remove('active'));
        const firstFresh = document.querySelector('#nav-fresh a');
        if (firstFresh) firstFresh.classList.add('active');
    } else {
        if (freshNav) freshNav.style.display = 'none';
        if (mallNav) mallNav.style.display = '';
        if (mallBtn) mallBtn.classList.add('active');
        if (freshBtn) freshBtn.classList.remove('active');
        freshSections.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = 'none'; });
        const mallSec = document.getElementById('mall-control-section');
        if (mallSec) mallSec.style.display = 'block';
        const h = document.querySelector('.top-header h1');
        if (h) h.innerText = '🛍️ Genge Mall Control Panel';
        loadMallAdminVendors();
    }
};

// --- Tab Switching Logic (Fresh) ---
window.showSection = function(section, anchor) {
    document.querySelectorAll('#nav-fresh a').forEach(el => el.classList.remove('active'));
    if (anchor) anchor.classList.add('active');

    const allSections = ['orders-section','upload-section','feedback-section','products-section','packages-section','mall-control-section'];
    allSections.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = 'none'; });

    const map = {
        orders: { id: 'orders-section', title: 'Oda za Wateja' },
        upload: { id: 'upload-section', title: 'Pakia Bidhaa Mpya' },
        feedback: { id: 'feedback-section', title: 'Maoni ya Wateja' },
        products: { id: 'products-section', title: 'Hariri Bei za Bidhaa' },
        packages: { id: 'packages-section', title: 'Vifurushi vya Familia' },
    };

    const info = map[section];
    if (info) {
        const el = document.getElementById(info.id);
        if (el) el.style.display = 'block';
        const h = document.querySelector('.top-header h1');
        if (h) h.innerText = info.title;
        if (section === 'feedback') loadFeedbacks();
        if (section === 'products') loadProducts();
        if (section === 'packages') loadPackages();
    }
};

// --- Tab Switching Logic (Mall) ---
window.showMallSection = function(section, anchor) {
    document.querySelectorAll('#nav-mall a').forEach(el => el.classList.remove('active'));
    if (anchor) anchor.classList.add('active');
    if (section === 'vendors') loadMallAdminVendors();
};

// ── SUPER ADMIN: GENGE MALL VENDOR CONTROL ─────────────────────────
let _allMallVendors = [];

async function loadMallAdminVendors() {
    const tbody = document.getElementById('admin-vendors-tbody');
    const noMsg = document.getElementById('no-admin-vendors-msg');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:1.5rem;color:var(--text-muted);">Inavuta data ya wauzaji...</td></tr>';

    try {
        const res = await fetch('/api/admin/vendors');
        const vendors = await res.json();
        _allMallVendors = Array.isArray(vendors) ? vendors : [];
        renderMallVendorsTable(_allMallVendors);
    } catch (err) {
        _allMallVendors = [];
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#EF4444;padding:1.5rem;">Imefeli kuleta wauzaji. Hakikisha server inafanya kazi.</td></tr>';
    }
}

window.filterMallVendors = function() {
    const q = (document.getElementById('mall-vendor-search')?.value || '').toLowerCase();
    const filter = document.getElementById('mall-vendor-filter')?.value || 'all';
    const today = new Date();

    let filtered = _allMallVendors.filter(v => {
        const matchQ = !q ||
            (v.name || '').toLowerCase().includes(q) ||
            (v.shopName || '').toLowerCase().includes(q) ||
            (v.phone || '').includes(q);

        const isSuspended = (v.status === 'suspended' || v.status === 'blocked');
        const daysLeft = v.daysRemaining !== undefined ? v.daysRemaining : null;
        const isExpiring = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

        let matchFilter = true;
        if (filter === 'active') matchFilter = !isSuspended;
        else if (filter === 'suspended') matchFilter = isSuspended;
        else if (filter === 'expiring') matchFilter = isExpiring;

        return matchQ && matchFilter;
    });

    renderMallVendorsTable(filtered);
};

function renderMallVendorsTable(vendors) {
    const tbody = document.getElementById('admin-vendors-tbody');
    const noMsg = document.getElementById('no-admin-vendors-msg');
    if (!tbody) return;

    // Update stats
    const total = _allMallVendors.length;
    const activeCount = _allMallVendors.filter(v => v.status !== 'suspended' && v.status !== 'blocked').length;
    const expiringCount = _allMallVendors.filter(v => {
        const d = v.daysRemaining;
        return d !== undefined && d !== null && d >= 0 && d <= 7;
    }).length;
    const totalProducts = _allMallVendors.reduce((sum, v) => sum + (v.productCount || 0), 0);
    const el = id => document.getElementById(id);
    if (el('mall-stat-total')) el('mall-stat-total').innerText = total;
    if (el('mall-stat-active')) el('mall-stat-active').innerText = activeCount;
    if (el('mall-stat-expiring')) el('mall-stat-expiring').innerText = expiringCount;
    if (el('mall-stat-products')) el('mall-stat-products').innerText = totalProducts;

    if (!vendors || vendors.length === 0) {
        tbody.innerHTML = '';
        if (noMsg) noMsg.style.display = 'block';
        return;
    }
    if (noMsg) noMsg.style.display = 'none';

    tbody.innerHTML = vendors.map(v => {
        const isSuspended = (v.status === 'suspended' || v.status === 'blocked');
        const pkg = v.package || { name: 'Basic', price: 5000, maxProducts: 25 };
        const pkgName = pkg.name || 'Basic';

        // Countdown badge
        const days = v.daysRemaining;
        let countdownBadge = '<span style="color:#94a3b8;font-size:0.78rem;">Haijui</span>';
        if (days !== undefined && days !== null) {
            if (days < 0) {
                countdownBadge = `<span style="background:#fee2e2;color:#ef4444;padding:3px 8px;border-radius:10px;font-weight:700;font-size:0.78rem;">🔴 Kimeisha</span>`;
            } else if (days <= 7) {
                countdownBadge = `<span style="background:#fef3c7;color:#b45309;padding:3px 8px;border-radius:10px;font-weight:700;font-size:0.78rem;">🟡 Siku ${days}</span>`;
            } else {
                countdownBadge = `<span style="background:#d1fae5;color:#065f46;padding:3px 8px;border-radius:10px;font-weight:700;font-size:0.78rem;">🟢 Siku ${days}</span>`;
            }
        }

        // Timeline
        const activatedAt = v.activatedAt ? new Date(v.activatedAt).toLocaleDateString('sw-TZ') : '—';
        const expiresAt = v.expiresAt ? new Date(v.expiresAt).toLocaleDateString('sw-TZ') : '—';

        const statusBadge = isSuspended
            ? `<span style="background:rgba(239,68,68,0.15);color:#EF4444;padding:3px 9px;border-radius:10px;font-weight:700;font-size:0.78rem;">🚫 Imefungiwa</span>`
            : `<span style="background:rgba(16,185,129,0.15);color:#10B981;padding:3px 9px;border-radius:10px;font-weight:700;font-size:0.78rem;">✅ Active</span>`;

        return `
            <tr>
                <td>
                    <strong>${v.shopName || v.name}</strong><br>
                    <span style="font-size:0.78rem;color:var(--text-muted);">${v.name}</span>
                </td>
                <td><code style="background:rgba(255,255,255,0.08);padding:2px 5px;border-radius:4px;color:#f59e0b;font-size:0.8rem;">${v.nidaOrTin || '—'}</code></td>
                <td><strong>${v.phone}</strong></td>
                <td>
                    <strong style="color:#10B981;">${pkgName}</strong><br>
                    <span style="font-size:0.75rem;color:var(--text-muted);">Tsh ${(pkg.price||0).toLocaleString()} · max ${pkg.maxProducts||25}</span>
                </td>
                <td style="font-size:0.8rem;white-space:nowrap;">${activatedAt}<br><span style="color:#94a3b8;">↓</span><br>${expiresAt}</td>
                <td>${countdownBadge}</td>
                <td><strong>${v.productCount || 0}</strong><span style="color:var(--text-muted);font-size:0.78rem;"> / ${pkg.maxProducts||25}</span></td>
                <td>${statusBadge}</td>
                <td>
                    <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        <button onclick="toggleVendorStatus('${v.phone}','${v.status}')" style="background:${isSuspended ? '#10B981' : '#EF4444'};color:#fff;border:none;padding:4px 8px;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.75rem;">
                            ${isSuspended ? '✅ Fungulia' : '🚫 Funga'}
                        </button>
                        <button onclick="openRenewVendorModal('${v.phone}','${(v.shopName||v.name).replace(/'/g,"\\'")}','${pkgName}')" style="background:#F59E0B;color:#000;border:none;padding:4px 8px;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.75rem;">
                            🔄 Renew
                        </button>
                        <button onclick="deleteVendor('${v.phone}','${(v.shopName||v.name).replace(/'/g,"\\'")}') " style="background:#7f1d1d;color:#fca5a5;border:none;padding:4px 8px;border-radius:6px;font-weight:700;cursor:pointer;font-size:0.75rem;">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

window.openAdminAddVendorModal = function() {
    const modal = document.getElementById('admin-add-vendor-modal');
    if (modal) { modal.style.display = 'flex'; }
    const form = document.getElementById('admin-add-vendor-form');
    if (form) form.reset();
    const msg = document.getElementById('admin-add-vendor-msg');
    if (msg) msg.innerText = '';
};

window.closeAdminAddVendorModal = function() {
    const modal = document.getElementById('admin-add-vendor-modal');
    if (modal) modal.style.display = 'none';
};

window.submitAdminAddVendor = async function(e) {
    e.preventDefault();
    const msgEl = document.getElementById('admin-add-vendor-msg');
    msgEl.innerText = '⏳ Inasajili...';
    msgEl.style.color = '#94a3b8';

    const payload = {
        name: document.getElementById('av-name').value.trim(),
        shopName: document.getElementById('av-shop').value.trim(),
        phone: document.getElementById('av-phone').value.trim(),
        password: document.getElementById('av-password').value,
        nidaOrTin: document.getElementById('av-nida').value.trim(),
        packageName: document.getElementById('av-package').value,
        durationDays: parseInt(document.getElementById('av-duration').value),
        role: 'vendor',
    };

    try {
        const res = await fetch('/api/admin/vendors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
            msgEl.style.color = '#10b981';
            msgEl.innerText = '✅ ' + (data.message || 'Muuzaji amesajiliwa!');
            setTimeout(() => { closeAdminAddVendorModal(); loadMallAdminVendors(); }, 1500);
        } else {
            msgEl.style.color = '#ef4444';
            msgEl.innerText = '❌ ' + (data.message || 'Imeshindwa kusajili.');
        }
    } catch (err) {
        msgEl.style.color = '#ef4444';
        msgEl.innerText = '❌ Tatizo la mtandao.';
    }
};

window.openRenewVendorModal = function(phone, shopName, currentPkg) {
    document.getElementById('rv-phone').value = phone;
    const info = document.getElementById('renew-vendor-info');
    if (info) info.innerHTML = `<strong>${shopName}</strong><br>Kifurushi cha sasa: <span style="color:#10b981;font-weight:700;">${currentPkg}</span>`;
    const pkgSelect = document.getElementById('rv-package');
    if (pkgSelect) pkgSelect.value = currentPkg;
    const modal = document.getElementById('admin-renew-vendor-modal');
    if (modal) { modal.style.display = 'flex'; }
    const msg = document.getElementById('admin-renew-vendor-msg');
    if (msg) msg.innerText = '';
};

window.closeRenewVendorModal = function() {
    const modal = document.getElementById('admin-renew-vendor-modal');
    if (modal) modal.style.display = 'none';
};

window.submitRenewVendor = async function(e) {
    e.preventDefault();
    const msgEl = document.getElementById('admin-renew-vendor-msg');
    msgEl.innerText = '⏳ Inafanya kazi...';
    msgEl.style.color = '#94a3b8';

    const phone = document.getElementById('rv-phone').value;
    const packageName = document.getElementById('rv-package').value;
    const durationDays = parseInt(document.getElementById('rv-duration').value);

    try {
        const res = await fetch(`/api/admin/vendors/${phone}/renew`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ packageName, durationDays }),
        });
        const data = await res.json();
        if (res.ok) {
            msgEl.style.color = '#10b981';
            msgEl.innerText = '✅ ' + (data.message || 'Kifurushi kimeboreshwa!');
            setTimeout(() => { closeRenewVendorModal(); loadMallAdminVendors(); }, 1400);
        } else {
            msgEl.style.color = '#ef4444';
            msgEl.innerText = '❌ ' + (data.message || 'Imeshindwa.');
        }
    } catch (err) {
        msgEl.style.color = '#ef4444';
        msgEl.innerText = '❌ Tatizo la mtandao.';
    }
};

window.toggleVendorStatus = async function(phone, currentStatus) {
    const isBlocking = (currentStatus === 'active');
    let reason = '';
    if (isBlocking) {
        reason = prompt('Weka sababu ya kumfunga muuzaji huyu:', 'Ukiukaji wa taratibu za Genge Mall');
        if (reason === null) return;
    }
    const newStatus = isBlocking ? 'suspended' : 'active';
    try {
        const res = await fetch(`/api/admin/vendors/${phone}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus, reason }),
        });
        const data = await res.json();
        alert(data.message || 'Hali imebadilishwa!');
        loadMallAdminVendors();
    } catch (err) {
        alert('Kosa wakati wa kubadilisha status ya muuzaji.');
    }
};

window.deleteVendor = async function(phone, shopName) {
    if (!confirm(`Una uhakika wa kufuta muuzaji "${shopName}" (${phone})?\n\nBidhaa zake zote zitafutwa pia.`)) return;
    try {
        const res = await fetch(`/api/admin/vendors/${phone}`, { method: 'DELETE' });
        const data = await res.json();
        alert(data.message || 'Muuzaji amefutwa!');
        loadMallAdminVendors();
    } catch (err) {
        alert('Kosa wakati wa kufuta muuzaji.');
    }
};

// ── PACKAGE MODAL FUNCTIONS ─────────────────────────────────────────
window.openAddPackageModal = function() {
    const modal = document.getElementById('add-package-modal');
    if (modal) { modal.style.display = 'flex'; }
    const form = document.getElementById('add-package-form');
    if (form) form.reset();
    const totalEl = document.getElementById('new-pkg-calc-total');
    if (totalEl) totalEl.innerText = 'TZS 0';
    const breakEl = document.getElementById('new-pkg-calc-breakdown');
    if (breakEl) breakEl.innerHTML = '<span style="color:#94a3b8;">Andika bidhaa hapo juu ili kuhesabu jumla kiotomatiki.</span>';
};

window.closeAddPackageModal = function() {
    const modal = document.getElementById('add-package-modal');
    if (modal) modal.style.display = 'none';
};

window.calculateModalPackageTotal = function() {
    const featuresRaw = (document.getElementById('new-pkg-features')?.value || '');
    const features = featuresRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const fmt = n => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);

    let total = 0;
    let html = '';
    features.forEach(fStr => {
        const item = matchFeatureWithProduct(fStr, allProducts);
        if (item.isMotto) return;
        if (item.isMatched) {
            total += item.subtotal;
            html += `<div style="display:flex;justify-content:space-between;padding:2px 0;font-size:0.78rem;"><span>${item.text} ×${item.quantity}</span><span style="color:#10b981;font-weight:700;">${fmt(item.subtotal)}</span></div>`;
        } else {
            html += `<div style="font-size:0.78rem;color:#94a3b8;">${item.text} — (Bei haipatikani)</div>`;
        }
    });

    const totalEl = document.getElementById('new-pkg-calc-total');
    const breakEl = document.getElementById('new-pkg-calc-breakdown');
    if (totalEl) totalEl.innerText = fmt(total);
    if (breakEl) breakEl.innerHTML = html || '<span style="color:#94a3b8;">Andika bidhaa hapo juu.</span>';

    // Auto-fill price if empty
    const priceEl = document.getElementById('new-pkg-price');
    const extraEl = document.getElementById('new-pkg-extra');
    if (priceEl && (!priceEl.value || priceEl.value === '0')) {
        priceEl.value = total + (parseFloat(extraEl?.value) || 0);
    }
};

window.onNewPkgExtraInput = function() {
    const featuresRaw = (document.getElementById('new-pkg-features')?.value || '');
    const features = featuresRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    let total = 0;
    features.forEach(fStr => {
        const item = matchFeatureWithProduct(fStr, allProducts);
        if (!item.isMotto && item.isMatched) total += item.subtotal;
    });
    const extra = parseFloat(document.getElementById('new-pkg-extra')?.value) || 0;
    const priceEl = document.getElementById('new-pkg-price');
    if (priceEl) priceEl.value = total + extra;
};

window.onNewPkgPriceInput = function() {
    // Just keep the user's typed value; no auto-calculation needed
};

window.submitNewPackage = async function(e) {
    e.preventDefault();
    const title = document.getElementById('new-pkg-title')?.value.trim();
    const featuresRaw = document.getElementById('new-pkg-features')?.value || '';
    const features = featuresRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    const price = parseFloat(document.getElementById('new-pkg-price')?.value) || 0;

    if (!title) { alert('Weka jina la kifurushi!'); return; }
    if (features.length === 0) { alert('Weka angalau bidhaa moja!'); return; }
    if (price <= 0) { alert('Weka bei ya kuuzia!'); return; }

    const newPkg = {
        id: 'pkg_' + Date.now(),
        title,
        features,
        price,
        createdAt: new Date().toISOString(),
    };

    // Try API first, fall back to localStorage
    let saved = false;
    try {
        const res = await fetch('/api/packages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPkg),
        });
        if (res.ok) saved = true;
    } catch (_) {}

    if (!saved) {
        // localStorage fallback
        const existing = JSON.parse(localStorage.getItem('genge_custom_packages') || '[]');
        existing.push(newPkg);
        localStorage.setItem('genge_custom_packages', JSON.stringify(existing));
        // Also remove from deleted list if re-adding same id (edge case)
        const deleted = JSON.parse(localStorage.getItem('genge_deleted_packages') || '[]');
        localStorage.setItem('genge_deleted_packages', JSON.stringify(deleted.filter(id => id !== newPkg.id)));
    }

    alert('✅ Kifurushi kipya kimeongezwa!');
    closeAddPackageModal();
    loadPackages();
};

window.deletePackage = async function(pkgId, pkgTitle) {
    if (!confirm(`Una uhakika wa kufuta kifurushi "${pkgTitle}"?`)) return;

    let deleted = false;
    try {
        const res = await fetch(`/api/packages/${pkgId}`, { method: 'DELETE' });
        if (res.ok) deleted = true;
    } catch (_) {}

    if (!deleted) {
        // localStorage fallback
        const existing = JSON.parse(localStorage.getItem('genge_custom_packages') || '[]');
        localStorage.setItem('genge_custom_packages', JSON.stringify(existing.filter(p => p.id !== pkgId)));
        const deletedList = JSON.parse(localStorage.getItem('genge_deleted_packages') || '[]');
        if (!deletedList.includes(pkgId)) {
            deletedList.push(pkgId);
            localStorage.setItem('genge_deleted_packages', JSON.stringify(deletedList));
        }
    }

    // Remove card from DOM
    const card = document.getElementById('pkg-card-' + pkgId);
    if (card) card.remove();
    alert('🗑️ Kifurushi kimefutwa!');
};

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
