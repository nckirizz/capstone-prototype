/* ============================================================
   OrderSync — app.js
   ============================================================ */

/* ---------- ROLE CONFIG ---------- */
const ROLES = {
  admin: {
    name: 'Tonette Admin',
    role: 'Administrator',
    initials: 'TA',
    defaultPage: 'dashboard',
    nav: [
      { section: 'Main', items: [
        { id: 'dashboard', label: 'Dashboard',  icon: 'grid'    },
        { id: 'orders',    label: 'Orders',     icon: 'orders'  },
        { id: 'inventory', label: 'Inventory',  icon: 'box'     },
      ]},
      { section: 'Communication', items: [
        { id: 'messages',  label: 'Messages',   icon: 'msg', badge: true },
      ]},
      { section: 'Management', items: [
        { id: 'reports',   label: 'Reports',    icon: 'report'  },
        { id: 'users',     label: 'Users',      icon: 'users'   },
        { id: 'settings',  label: 'Settings',   icon: 'settings'},
      ]},
    ]
  },
  cashier: {
    name: 'Maria Cashier',
    role: 'Cashier',
    initials: 'MC',
    defaultPage: 'cashier-home',
    nav: [
      { section: 'Main', items: [
        { id: 'cashier-home', label: 'Home',           icon: 'grid'   },
        { id: 'pos',          label: 'Point of Sale',  icon: 'pos'    },
        { id: 'orders',       label: 'Orders',         icon: 'orders' },
      ]},
      { section: 'Communication', items: [
        { id: 'messages', label: 'Messages', icon: 'msg', badge: true },
      ]},
      { section: 'Other', items: [
        { id: 'inventory', label: 'Inventory', icon: 'box' },
      ]},
    ]
  }
};

/* ---------- SVG ICONS ---------- */
const ICONS = {
  grid:     `<rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>`,
  orders:   `<path d="M2 3h12M2 8h8M2 13h5"/><path d="M11 10l2 2 3-3" stroke-linecap="round" stroke-linejoin="round"/>`,
  pos:      `<rect x="1" y="2" width="14" height="12" rx="1.5"/><path d="M1 6h14M5 10h2M9 10h2"/>`,
  box:      `<rect x="1" y="4" width="14" height="10" rx="1"/><path d="M5 4V3a3 3 0 016 0v1"/><path d="M6 9h4"/>`,
  msg:      `<path d="M14 3H2a1 1 0 00-1 1v7a1 1 0 001 1h3l3 3 3-3h3a1 1 0 001-1V4a1 1 0 00-1-1z"/>`,
  report:   `<path d="M1 13V5l4-4h6l4 4v8a1 1 0 01-1 1H2a1 1 0 01-1-1z"/><path d="M5 1v4H1M5 10h6M5 7h4"/>`,
  users:    `<circle cx="6" cy="5" r="3"/><path d="M1 14c0-3 2.5-5 5-5s5 2 5 5"/><path d="M11 7c1.5 0 3 1 3 3"/><circle cx="12" cy="4" r="2"/>`,
  settings: `<circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"/>`,
};

/* ---------- STATE ---------- */
let currentRole = 'admin';
let currentPage = 'dashboard';
let cart        = {};

/* ---------- PRODUCTS ---------- */
const products = [
  { id:1, name:'San Miguel Pale Pilsen', cat:'Beverages', price:1080, stock:36 },
  { id:2, name:'Coca-Cola 1.5L (case)',  cat:'Beverages', price:720,  stock:24 },
  { id:3, name:'Pepsi 1.5L (case)',      cat:'Beverages', price:680,  stock:18 },
  { id:4, name:'Royal Tru-Orange (case)',cat:'Beverages', price:660,  stock:30 },
  { id:5, name:'Oishi Pillows 60g',      cat:'Snacks',    price:12,   stock:120},
  { id:6, name:'Nova Country Cheddar',   cat:'Snacks',    price:15,   stock:80 },
  { id:7, name:'Chippy BBQ 110g',        cat:'Snacks',    price:22,   stock:65 },
  { id:8, name:'LPG 11kg',               cat:'LPG',       price:980,  stock:8  },
  { id:9, name:'LPG 5kg',                cat:'LPG',       price:480,  stock:12 },
];

/* ---------- ORDERS ---------- */
const orders = [
  { id:'ORD-001', customer:'Reyes Store',     items:3, total:'₱2,400', date:'Apr 17', status:'pending'   },
  { id:'ORD-002', customer:'Cruz Sari-sari',  items:2, total:'₱960',   date:'Apr 17', status:'confirmed' },
  { id:'ORD-003', customer:'Santos Trading',  items:5, total:'₱5,200', date:'Apr 16', status:'preparing' },
  { id:'ORD-004', customer:'Dela Rosa',       items:1, total:'₱1,100', date:'Apr 16', status:'completed' },
  { id:'ORD-005', customer:'Manalo Grocery',  items:4, total:'₱3,200', date:'Apr 15', status:'completed' },
  { id:'ORD-006', customer:'Bautista Store',  items:2, total:'₱1,960', date:'Apr 15', status:'cancelled' },
  { id:'ORD-007', customer:'Garcia Minimart', items:3, total:'₱2,640', date:'Apr 14', status:'pending'   },
];

/* ---------- CONVERSATIONS ---------- */
const convos = [
  {
    name: 'Reyes Store', time: '10:32', unread: true,
    preview: 'When will my order arrive?',
    msgs: [
      { text:'Hi, I placed an order earlier. When will it arrive?', out: false },
      { text:'Hello! Your order ORD-001 is confirmed and being prepared now.', out: true },
      { text:'When will my order arrive?', out: false },
    ]
  },
  {
    name: 'Cruz Sari-sari', time: '9:14', unread: false,
    preview: 'Ok thanks!',
    msgs: [
      { text:'Can I add 2 more cases of Pepsi to my order?', out: false },
      { text:"Sure! I've updated your order. New total is ₱1,320.", out: true },
      { text:'Ok thanks!', out: false },
    ]
  },
  {
    name: 'Santos Trading', time: 'Yesterday', unread: true,
    preview: 'We need 5 cases of SMB',
    msgs: [
      { text:'We need 5 cases of SMB and 3 cases of Coke. Can you process?', out: false },
      { text:"Noted! I'll prepare the order now. Please confirm your delivery address.", out: true },
    ]
  },
];
let activeConvo = 0;

/* ============================================================
   NAVIGATION
   ============================================================ */
function buildNav(role) {
  const cfg  = ROLES[role];
  const html = cfg.nav.map(section => `
    <div class="nav-section">${section.section}</div>
    ${section.items.map(item => `
      <div class="nav-item ${item.id === currentPage ? 'active' : ''}" onclick="nav('${item.id}')">
        <svg class="nav-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">${ICONS[item.icon]}</svg>
        ${item.label}
        ${item.badge ? '<span class="nav-badge"></span>' : ''}
      </div>
    `).join('')}
  `).join('');
  document.getElementById('nav-links').innerHTML = html;
}

function nav(page) {
  currentPage = page;
  buildNav(currentRole);
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');

  const titles = {
    'dashboard':    'Dashboard',
    'cashier-home': 'Home',
    'orders':       'Orders',
    'pos':          'Point of Sale',
    'inventory':    'Inventory',
    'messages':     'Messages',
    'reports':      'Reports',
    'users':        'Users',
    'settings':     'Settings',
  };
  document.getElementById('page-title').textContent = titles[page] || page;

  if (page === 'inventory') renderInventory();
  if (page === 'messages')  renderMsgList();
  if (page === 'orders')    renderOrders();
}

function switchRole(role, btn) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentRole = role;

  const cfg = ROLES[role];
  document.getElementById('sidebar-name').textContent   = cfg.name;
  document.getElementById('sidebar-role').textContent   = cfg.role;
  document.getElementById('sidebar-avatar').textContent = cfg.initials;
  document.getElementById('topbar-avatar').textContent  = cfg.initials;

  const avatarEl = document.getElementById('sidebar-avatar');
  const topAvatar = document.getElementById('topbar-avatar');
  avatarEl.className  = 'user-avatar'  + (role === 'cashier' ? ' cashier' : '');
  topAvatar.className = 'topbar-avatar' + (role === 'cashier' ? ' cashier' : '');

  currentPage = cfg.defaultPage;
  buildNav(role);
  nav(currentPage);
}

/* ============================================================
   POS
   ============================================================ */
function renderPOS(list) {
  document.getElementById('pos-grid').innerHTML = list.map(p => `
    <div class="product-card" onclick="addToCart(${p.id})">
      <div class="product-cat">${p.cat}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">₱${p.price.toLocaleString()}</div>
      <div class="product-stock">Stock: ${p.stock} units</div>
    </div>
  `).join('');
}

function filterPOS(q) {
  const filtered = q
    ? products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.cat.toLowerCase().includes(q.toLowerCase()))
    : products;
  renderPOS(filtered);
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

function renderCart() {
  const keys = Object.keys(cart);
  const el   = document.getElementById('cart-items');

  if (!keys.length) {
    el.innerHTML = '<div style="color:#9CA3AF;font-size:13px;text-align:center;padding:32px 0">No items added yet</div>';
    updateTotal(0);
    return;
  }

  el.innerHTML = keys.map(id => {
    const p = products.find(x => x.id == id);
    return `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">₱${p.price.toLocaleString()} each</div>
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
          <span class="qty-num">${cart[id]}</span>
          <button class="qty-btn" onclick="changeQty(${id}, 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  const total = keys.reduce((sum, id) => {
    const p = products.find(x => x.id == id);
    return sum + p.price * cart[id];
  }, 0);
  updateTotal(total);
}

function updateTotal(total) {
  const formatted = '₱' + total.toLocaleString();
  document.getElementById('subtotal').textContent = formatted;
  document.getElementById('total').textContent    = formatted;
}

function clearCart() {
  cart = {};
  renderCart();
}

function checkout() {
  if (!Object.keys(cart).length) {
    alert('Please add items to the cart first.');
    return;
  }
  const total = document.getElementById('total').textContent;
  alert(`✅ Transaction processed!\nReceipt generated.\nTotal: ${total}`);
  clearCart();
}

/* ============================================================
   ORDERS
   ============================================================ */
function renderOrders(list) {
  const data = list || orders;
  document.getElementById('orders-tbody').innerHTML = data.map(o => `
    <tr>
      <td class="mono">${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.items} items</td>
      <td>${o.total}</td>
      <td>${o.date}</td>
      <td><span class="status ${o.status}">${capitalize(o.status)}</span></td>
      <td><button class="btn btn-sm" onclick="viewOrder('${o.id}')">View</button></td>
    </tr>
  `).join('');
}

function filterOrders(q) {
  const filtered = orders.filter(o =>
    o.customer.toLowerCase().includes(q.toLowerCase()) ||
    o.id.toLowerCase().includes(q.toLowerCase())
  );
  renderOrders(filtered);
}

function filterOrdersByStatus(status) {
  const filtered = status ? orders.filter(o => o.status === status) : orders;
  renderOrders(filtered);
}

function viewOrder(id) {
  const o = orders.find(x => x.id === id);
  alert(`Order Details\n──────────────\nOrder ID:  ${o.id}\nCustomer:  ${o.customer}\nItems:     ${o.items}\nTotal:     ${o.total}\nStatus:    ${capitalize(o.status)}\nDate:      ${o.date}`);
}

function confirmOrder(btn) {
  btn.textContent = 'Confirmed ✓';
  btn.className   = 'btn btn-sm';
  btn.disabled    = true;
  btn.style.color = '#1D9E75';
}

/* ============================================================
   INVENTORY
   ============================================================ */
function renderInventory() {
  const isAdmin = currentRole === 'admin';
  if (document.getElementById('add-product-btn')) {
    document.getElementById('add-product-btn').style.display = isAdmin ? '' : 'none';
  }
  document.getElementById('inv-tbody').innerHTML = products.map(p => {
    const pct  = Math.min(100, Math.round((p.stock / 50) * 100));
    const cls  = pct < 20 ? 'critical' : pct < 40 ? 'low' : '';
    const action = isAdmin
      ? `<button class="btn btn-sm" onclick="restock(${p.id})">Restock</button>`
      : `<span style="font-size:12px;color:#9CA3AF">Read only</span>`;
    return `
      <tr>
        <td><strong>${p.name}</strong></td>
        <td>${p.cat}</td>
        <td>₱${p.price.toLocaleString()}</td>
        <td>${p.stock} units</td>
        <td>
          <div class="stock-bar">
            <div class="stock-fill ${cls}" style="width:${pct}%"></div>
          </div>
        </td>
        <td>${action}</td>
      </tr>
    `;
  }).join('');
}

function restock(id) {
  const p   = products.find(x => x.id === id);
  const qty = parseInt(prompt(`Restock: ${p.name}\nCurrent stock: ${p.stock} units\n\nAdd quantity:`) || 0);
  if (qty > 0) {
    p.stock += qty;
    renderInventory();
  }
}

/* ============================================================
   MESSAGES
   ============================================================ */
function renderMsgList() {
  document.getElementById('msg-list').innerHTML = convos.map((c, i) => `
    <div class="msg-item ${i === activeConvo ? 'active' : ''}" onclick="openConvo(${i})">
      <div class="msg-item-name">
        ${c.name}
        ${c.unread ? '<span class="unread-dot"></span>' : ''}
        <span class="msg-item-time">${c.time}</span>
      </div>
      <div class="msg-item-preview">${c.preview}</div>
    </div>
  `).join('');
}

function openConvo(i) {
  activeConvo    = i;
  convos[i].unread = false;
  renderMsgList();
  document.getElementById('msg-header').textContent = convos[i].name;
  const chat = document.getElementById('msg-chat');
  chat.innerHTML = convos[i].msgs.map(m =>
    `<div class="bubble ${m.out ? 'out' : 'in'}">${m.text}</div>`
  ).join('');
  chat.scrollTop = chat.scrollHeight;
}

function sendMsg(e) {
  if (e.key !== 'Enter') return;
  const inp = document.getElementById('msg-input');
  const txt = inp.value.trim();
  if (!txt) return;
  convos[activeConvo].msgs.push({ text: txt, out: true });
  convos[activeConvo].preview = txt;
  inp.value = '';
  openConvo(activeConvo);
}

/* ============================================================
   REPORTS TABS
   ============================================================ */
function switchTab(btn, repId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  ['rep-sales', 'rep-orders', 'rep-inventory'].forEach(id => {
    document.getElementById(id).style.display = id === repId ? 'block' : 'none';
  });
}

/* ============================================================
   DASHBOARD CHART
   ============================================================ */
function renderDashboardChart() {
  const vals   = [8200, 11400, 9800, 13200, 10600, 14800, 12480];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max    = Math.max(...vals);

  const chart  = document.getElementById('dash-chart');
  const lblEl  = document.getElementById('dash-labels');
  if (!chart || !lblEl) return;

  chart.innerHTML  = vals.map(v =>
    `<div class="bar" style="height:${Math.round((v / max) * 100)}%" title="₱${v.toLocaleString()}"></div>`
  ).join('');
  lblEl.innerHTML  = labels.map(l =>
    `<div class="bar-label">${l}</div>`
  ).join('');
}

/* ============================================================
   HELPERS
   ============================================================ */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildNav('admin');
  renderPOS(products);
  renderCart();
  renderOrders();
  renderInventory();
  renderMsgList();
  openConvo(0);
  renderDashboardChart();
});
