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
        
        if (order.status === 'pending') {
            statusBadge = '<span class="badge pending">Nasubiri</span>';
            actionButtons = `
                <div class="actions">
                    <button class="btn-accept" onclick="updateOrderStatus('${order.id}', 'accepted')">Kubali</button>
                    <button class="btn-reject" onclick="updateOrderStatus('${order.id}', 'rejected')">Kataa</button>
                    <button class="btn-delete" onclick="deleteOrder('${order.id}')" title="Futa Oda Kabisa">🗑️</button>
                    <button class="btn-print" onclick="printInvoice('${order.id}')" title="Print Invoice">🖨️</button>
                </div>
            `;
        } else if (order.status === 'accepted') {
            statusBadge = '<span class="badge accepted">Imekubaliwa</span>';
            actionButtons = `
                <div class="actions">
                    <em>Imekamilika</em>
                    <button class="btn-delete" onclick="deleteOrder('${order.id}')" title="Futa Oda Kabisa">🗑️</button>
                    <button class="btn-print" onclick="printInvoice('${order.id}')" title="Print Invoice">🖨️</button>
                </div>
            `;
        } else if (order.status === 'rejected') {
            statusBadge = '<span class="badge rejected">Imekataliwa</span>';
            actionButtons = `
                <div class="actions">
                    <em>Imekataliwa</em>
                    <button class="btn-delete" onclick="deleteOrder('${order.id}')" title="Futa Oda Kabisa">🗑️</button>
                    <button class="btn-print" onclick="printInvoice('${order.id}')" title="Print Invoice">🖨️</button>
                </div>
            `;
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
        document.querySelector('.top-header h1').innerText = 'Vifurushi vya Familia';
        loadPackages();
    }
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
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:rgba(255,255,255,0.4);padding:1.5rem;">Hakuna bidhaa za kundi hili.</td></tr>';
        return;
    }
    products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${p.name}</strong></td>
            <td style="text-transform:capitalize;">${p.category}</td>
            <td><strong style="color:#10b981;">${fmt(p.price)}</strong></td>
            <td><input type="number" id="price-${p.id}" value="${p.price}" min="0" step="50"
                style="width:110px;padding:0.4rem 0.6rem;border-radius:8px;border:1px solid rgba(255,255,255,0.2);
                background:rgba(255,255,255,0.08);color:#fff;font-size:0.9rem;"></td>
            <td>
                <button onclick="updateProductPrice('${p.id}')"
                    style="padding:0.4rem 0.9rem;background:#10b981;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-right:6px;">
                    💾 Hifadhi
                </button>
                <button onclick="deleteProduct('${p.id}', '${p.name.replace(/'/g, "\\'")}')"
                    style="padding:0.4rem 0.7rem;background:#ef4444;color:#fff;border:none;border-radius:8px;cursor:pointer;">
                    🗑️
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.updateProductPrice = async function(productId) {
    const newPrice = document.getElementById('price-' + productId).value;
    if (!newPrice || isNaN(newPrice) || Number(newPrice) < 0) { alert('Tafadhali weka bei sahihi.'); return; }
    try {
        const res = await fetch(API_URL + '/api/products/' + productId + '/price', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: Number(newPrice) })
        });
        if (res.ok) {
            const p = allProducts.find(p => p.id === productId);
            if (p) p.price = Number(newPrice);
            const cat = document.getElementById('products-filter').value;
            renderProductsTable(cat === 'all' ? allProducts : allProducts.filter(x => x.category === cat));
            alert('✅ Bei ya bidhaa imebadilishwa kikamilifu!');
        } else { alert('❌ Imeshindwa kubadilisha bei.'); }
    } catch (err) { alert('Tatizo la mtandao.'); }
};

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
async function loadPackages() {
    const grid = document.getElementById('packages-grid');
    grid.innerHTML = '<p style="color:rgba(255,255,255,0.4);">Inapakia vifurushi...</p>';
    try {
        const res = await fetch(API_URL + '/api/packages');
        const packages = await res.json();
        grid.innerHTML = '';
        const fmt = (n) => new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 }).format(n);
        packages.forEach(pkg => {
            const card = document.createElement('div');
            card.style.cssText = 'background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:1.4rem;';
            card.innerHTML = `
                <h3 style="color:#fff;margin-bottom:0.5rem;font-size:1.05rem;">📦 ${pkg.title}</h3>
                <p style="color:#10b981;font-weight:700;font-size:1.1rem;margin-bottom:0.8rem;">${fmt(pkg.price)}</p>
                <ul style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-bottom:1rem;padding-left:1.2rem;">
                    ${pkg.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;">
                    <label style="color:rgba(255,255,255,0.5);font-size:0.82rem;">Bei Mpya (Tsh):</label>
                    <input type="number" id="pkg-price-${pkg.id}" value="${pkg.price}" min="0" step="500"
                        style="flex:1;min-width:120px;padding:0.4rem 0.7rem;border-radius:8px;border:1px solid rgba(255,255,255,0.2);
                        background:rgba(255,255,255,0.08);color:#fff;font-size:0.9rem;">
                    <button onclick="updatePackagePrice('${pkg.id}')"
                        style="padding:0.45rem 1rem;background:#10b981;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600;white-space:nowrap;">
                        💾 Hifadhi Bei
                    </button>
                </div>
                <div id="pkg-msg-${pkg.id}" style="margin-top:0.5rem;font-size:0.82rem;"></div>
            `;
            grid.appendChild(card);
        });
    } catch (err) { grid.innerHTML = '<p style="color:red;">Tatizo la mtandao.</p>'; }
}

window.updatePackagePrice = async function(pkgId) {
    const newPrice = document.getElementById('pkg-price-' + pkgId).value;
    const msgEl = document.getElementById('pkg-msg-' + pkgId);
    if (!newPrice || isNaN(newPrice) || Number(newPrice) < 0) {
        msgEl.style.color = '#ef4444'; msgEl.innerText = '❌ Weka bei sahihi.'; return;
    }
    try {
        const res = await fetch(API_URL + '/api/packages/' + pkgId, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: Number(newPrice) })
        });
        if (res.ok) {
            msgEl.style.color = '#10b981';
            msgEl.innerText = '✅ Bei imebadilishwa kikamilifu!';
            setTimeout(() => msgEl.innerText = '', 3000);
        } else { msgEl.style.color = '#ef4444'; msgEl.innerText = '❌ Imeshindwa.'; }
    } catch (err) { msgEl.style.color = '#ef4444'; msgEl.innerText = 'Tatizo la mtandao.'; }
};

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
    
    // Set payment status
    const paymentStatusEl = document.getElementById('inv-payment-status');
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

    // Trigger Print
    window.print();
};
