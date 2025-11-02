// Simple product list for demo
const PRODUCTS = [
  { id: 'p1', title: 'Ergo Office Chair', price: 8500, img: 'images/chair.jpg', category: 'office' },
  { id: 'p2', title: 'Modern Work Desk', price: 12000, img: 'images/desk.jpg', category: 'office' },
  { id: 'p3', title: 'Comfort Sofa 3-seater', price: 15000, img: 'images/sofa.jpg', category: 'home' },
  { id: 'p4', title: 'Wooden Bookshelf', price: 7000, img: 'images/bookshelf.jpg', category: 'home' },
  { id: 'p5', title: 'Recliner Seat', price: 7000, img: 'images/recliner.jpg', category: 'home' },
  { id: 'p6', title: 'Coffee Table', price: 7000, img: 'images/table.jpg', category: 'home' },
];


// localStorage cart key
const CART_KEY = 'furnihaven_cart';

// helpers
function getCart(){
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch(e){
    return [];
  }
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function updateCartCount(){
  const count = getCart().reduce((s,i)=> s + (i.qty || 0), 0);
  const el = document.getElementById('cartCount');
  if(el) el.textContent = count;
}
function addToCart(id, qty = 1){
  const cart = getCart();
  const item = cart.find(x=>x.id === id);
  if(item) item.qty += qty;
  else {
    const p = PRODUCTS.find(p=>p.id === id);
    if(!p) return;
    cart.push({ id: p.id, title: p.title, price: p.price, img: p.img, qty });
  }
  saveCart(cart);
  updateCartCount();
  alert('Added to cart: ' + PRODUCTS.find(p=>p.id===id).title);
}
function removeFromCart(id){
  let cart = getCart().filter(x=>x.id !== id);
  saveCart(cart);
  updateCartCount();
  renderCartPage();
}
function setQty(id, qty){
  const cart = getCart();
  const item = cart.find(x=>x.id === id);
  if(!item) return;
  item.qty = Math.max(0, parseInt(qty) || 0);
  // remove if qty 0
  const final = cart.filter(x=>x.qty > 0);
  saveCart(final);
  updateCartCount();
  renderCartPage();
}
function cartTotal(){
  return getCart().reduce((s,i)=> s + (i.price * i.qty), 0);
}

// Renderers
function renderProductGrid(search=''){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  search = (search || '').toLowerCase();
  grid.innerHTML = '';
  const filtered = PRODUCTS.filter(p => p.title.toLowerCase().includes(search) || p.category.includes(search));
  filtered.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <h4>${p.title}</h4>
      <p class="price">KSh ${p.price.toLocaleString()}</p>
      <div class="card-actions">
        <a class="button-small" href="#" data-id="${p.id}">Add to Cart</a>
        <a class="button-small" href="cart.html">View Cart</a>
      </div>
    `;
    grid.appendChild(card);
  });

  // attach event listeners for add buttons
  grid.querySelectorAll('[data-id]').forEach(btn=>{
    btn.addEventListener('click', function(e){
      e.preventDefault();
      const id = this.getAttribute('data-id');
      addToCart(id, 1);
    });
  });
}

function renderCartPage(){
  const container = document.getElementById('cartContainer');
  const summary = document.getElementById('cartSummary');
  if(!container || !summary) return;
  const cart = getCart();
  container.innerHTML = '';
  if(cart.length === 0){
    container.innerHTML = '<p>Your cart is empty.</p>';
    summary.innerHTML = '';
    document.getElementById('checkoutBtn')?.classList?.add('disabled');
    return;
  }
  cart.forEach(item=>{
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div style="flex:1">
        <h4>${item.title}</h4>
        <p>KSh ${item.price.toLocaleString()}</p>
      </div>
      <div class="qty-control">
        <button class="button-small dec" data-id="${item.id}">-</button>
        <input type="number" min="0" class="qty-input" data-id="${item.id}" value="${item.qty}" style="width:60px;padding:6px;border-radius:6px;border:1px solid #ddd">
        <button class="button-small inc" data-id="${item.id}">+</button>
        <button class="button-small" data-remove="${item.id}">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  // summary
  summary.innerHTML = `
    <div><strong>Subtotal:</strong> KSh ${cartTotal().toLocaleString()}</div>
    <div><small>Delivery charges will be calculated at checkout.</small></div>
  `;

  // events
  container.querySelectorAll('.inc').forEach(btn=> btn.addEventListener('click', ()=> { addToCart(btn.getAttribute('data-id'), 1); renderCartPage(); }));
  container.querySelectorAll('.dec').forEach(btn=> btn.addEventListener('click', ()=> {
    const id = btn.getAttribute('data-id');
    const cart = getCart();
    const it = cart.find(x=>x.id === id);
    if(!it) return;
    setQty(id, Math.max(0, it.qty - 1));
  }));
  container.querySelectorAll('[data-remove]').forEach(btn=> btn.addEventListener('click', ()=> {
    removeFromCart(btn.getAttribute('data-remove'));
  }));
  container.querySelectorAll('.qty-input').forEach(inp=> inp.addEventListener('change', ()=> {
    setQty(inp.getAttribute('data-id'), inp.value);
  }));

  document.getElementById('checkoutBtn')?.classList?.remove('disabled');
}

function renderCheckoutSummary(){
  const node = document.getElementById('orderSummary');
  if(!node) return;
  const cart = getCart();
  if(cart.length === 0){
    node.innerHTML = '<p>Your cart is empty. Please add items before checkout.</p>';
    return;
  }
  const rows = cart.map(i => `<div>${i.title} x ${i.qty} — KSh ${(i.price * i.qty).toLocaleString()}</div>`).join('');
  node.innerHTML = `
    <div class="order-summary">
      <h4>Order Summary</h4>
      ${rows}
      <hr/>
      <div><strong>Total:</strong> KSh ${cartTotal().toLocaleString()}</div>
    </div>
  `;
}

// expose some functions for html to call
window.renderProductGrid = renderProductGrid;
window.updateCartCount = updateCartCount;
window.renderCartPage = renderCartPage;
window.renderCheckoutSummary = renderCheckoutSummary;
window.addToCart = addToCart;
window.getCart = getCart;
window.cartTotal = cartTotal;

