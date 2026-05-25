// ── Cart stored in localStorage ──────────────────────────────

export function getCart() {
  return JSON.parse(localStorage.getItem('clothstore_cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('clothstore_cart', JSON.stringify(cart));
  updateCartBadge();
}

export function addToCart(product, size, quantity = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id && i.size === size);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, size, quantity });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart!`);
}

export function removeFromCart(productId, size) {
  const cart = getCart().filter(i => !(i.id === productId && i.size === size));
  saveCart(cart);
}

export function updateQuantity(productId, size, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId && i.size === size);
  if (item) {
    if (qty <= 0) return removeFromCart(productId, size);
    item.quantity = qty;
    saveCart(cart);
  }
}

export function clearCart() {
  localStorage.removeItem('clothstore_cart');
  updateCartBadge();
}

export function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function showToast(msg) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// Initialize badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);
