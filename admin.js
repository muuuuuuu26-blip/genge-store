const API_URL = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

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
        document.querySelector('.top-header h1').innerText = 'Oda za Wateja';
    } else if (section === 'upload') {
        document.getElementById('orders-section').style.display = 'none';
        document.getElementById('upload-section').style.display = 'block';
        document.getElementById('feedback-section').style.display = 'none';
        document.querySelector('.top-header h1').innerText = 'Pakia Bidhaa Mpya';
    } else if (section === 'feedback') {
        document.getElementById('orders-section').style.display = 'none';
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('feedback-section').style.display = 'block';
        document.querySelector('.top-header h1').innerText = 'Maoni ya Wateja';
        loadFeedbacks();
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
