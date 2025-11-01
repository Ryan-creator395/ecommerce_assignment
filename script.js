// PRODUCT LIST
const PRODUCTS = [
  { id:"p1", title:"Ergonomic Office Chair", price:8500, img:"images/chair.jpg" },
  { id:"p2", title:"Modern Work Desk",      price:12000, img:"images/desk.jpg" },
  { id:"p3", title:"Comfortable Sofa",      price:15000, img:"images/sofa.jpg" },
  { id:"p4", title:"Wooden Bookshelf",      price:7000,  img:"images/bookshelf.jpg" },
];

// CART STORAGE
const CART_KEY = "furnihaven_cart";

function getCart(){
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function updateCartCount(){
  const count = getCart().reduce((sum,i) => sum + i.qty, 0);
  const badge = document.getElementById("cartCount");
  if (badge) badge.innerText = count;
}

// ADD TO CART
function addToCart(id){
  let cart = getCart();
  let item = cart.find(i => i.id === id);
  if(item) item.qty++;
  else {
    const p = PRODUCTS.find(p=>p.id === id);
    cart.push({...p, qty:1});
  }
  saveCart(cart);
  updateCartCount();
  alert("Item added to cart!");
}

// RENDER PRODUCT GRID
function renderProductGrid(){
  let grid = document.getElementById("productGrid");
  if(!grid) return;

  grid.innerHTML = "";
  PRODUCTS.forEach(p=>{
    grid.innerHTML += `
      <div class="card">
        <img src="${p.img}" onerror="this.src='images/chair.jpg'"/>
        <img src="${p.img}" onerror="this.src='images/bed.jpg'"/>
        <img src="${p.img}" onerror="this.src='images/sofa.jpg'"/>
        <img src="${p.img}" onerror="this.src='images/recliner.jpg'"/>
        <img src="${p.img}" onerror="this.src='images/table.jpg'"/>
        <h4>${p.title}</h4>
        <p>KSh ${p.price}</p>
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    `;
  });
}


/***********************
  ADD TO CART
************************/
function addToCart(id){
  let cart = getCart();
  let item = cart.find(i => i.id === id);
  if(item) item.qty++;
  else {
    const p = PRODUCTS.find(p => p.id === id);
    cart.push({...p, qty:1});
  }
  saveCart(cart);
  updateCartCount();
  // small visual feedback instead of alert
  const btn = document.querySelectorAll([onclick="addToCart('${id}')"])[0];
  if(btn){
    btn.innerText = "Added ✓";
    setTimeout(()=> btn.innerText = "Add to Cart", 900);
  }
}

/***********************
  RENDER PRODUCT GRID
************************/
function renderProductGrid(){
  const grid = document.getElementById("productGrid");
  if(!grid) return;

  grid.innerHTML = "";

  PRODUCTS.forEach(p=>{
    grid.innerHTML += `
      <div class="card">
        <img src="${p.img}" alt="${p.title}" class="product-img" />

        <h3 class="product-name">${p.title}</h3>

        <p class="price">KSh ${p.price}</p>

        <button class="btn primary" onclick="addToCart('${p.id}')">
          Add to Cart
        </button>
      </div>
    `;
  });
}

/***********************
  CART PAGE
************************/
function renderCartPage(){
  const cart = getCart();
  const cont = document.getElementById("cartContainer");
  const sum = document.getElementById("cartSummary");
  if(!cont) return;
  if(!cart.length){
    cont.innerHTML = "<p>Your cart is empty.</p>";
    if(sum) sum.innerHTML = "";
    return;
  }

  cont.innerHTML = "";
  cart.forEach(item=>{
    cont.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.title}" />
        <div class="item-info">
          <h4>${item.title}</h4>
          <p>KSh ${item.price}</p>

          <div class="qty-control">
            <button onclick="decreaseQty('${item.id}')">-</button>
            <span class="qty">${item.qty}</span>
            <button onclick="increaseQty('${item.id}')">+</button>
          </div>

          <button class="remove" onclick="removeItem('${item.id}')">Remove</button>
        </div>
      </div>
    `;
  });

  if(sum) sum.innerHTML = <h3>Total: KSh ${cartTotal()}</h3>;
}

function increaseQty(id){
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if(item){ item.qty++; saveCart(cart); renderCartPage(); updateCartCount(); }
}
function decreaseQty(id){
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if(!item) return;
  if(item.qty > 1){ item.qty--; }
  else { cart = cart.filter(i => i.id !== id); }
  saveCart(cart); renderCartPage(); updateCartCount();
}
function removeItem(id){
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart); renderCartPage(); updateCartCount();
}
function cartTotal(){
  return getCart().reduce((sum,i) => sum + (i.price * i.qty), 0);
}

/***********************
  CHECKOUT SUMMARY
************************/
function renderCheckoutSummary(){
  const cont = document.getElementById("orderSummary");
  if(!cont) return;
  const cart = getCart();
  cont.innerHTML = "";
  cart.forEach(i=>{
    cont.innerHTML += <div>${i.title} x ${i.qty} — KSh ${i.price * i.qty}</div>;
  });
  cont.innerHTML += <h3>Total: KSh ${cartTotal()}</h3>;
}
function renderFeaturedProducts(){
  const grid = document.getElementById("productGrid");
  if(!grid) return;

  grid.innerHTML = "";

  // Only show first 3
  PRODUCTS.slice(0, 3).forEach(p=>{
    grid.innerHTML += `
      <div class="card">
        <div class="img-box">
          <img src="${p.img}" alt="${p.title}" />
          <div class="product-title-overlay">${p.title}</div>
        </div>
        <p class="price">KSh ${p.price}</p>
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    `;
  });
}
