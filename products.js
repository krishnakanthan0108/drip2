import { supabase } from './config.js';

// ── Fetch all products (with optional filters) ─────────────────
export async function getProducts({ category, search, sort, page = 1, limit = 12 } = {}) {
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('in_stock', true);

  if (category && category !== 'all') query = query.eq('category', category);
  if (search) query = query.ilike('name', `%${search}%`);

  switch (sort) {
    case 'price_asc':  query = query.order('price', { ascending: true });  break;
    case 'price_desc': query = query.order('price', { ascending: false }); break;
    case 'newest':     query = query.order('created_at', { ascending: false }); break;
    default:           query = query.order('created_at', { ascending: false });
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { products: data, total: count };
}

// ── Fetch single product ──────────────────────────────────────
export async function getProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// ── Fetch featured products ────────────────────────────────────
export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('in_stock', true)
    .limit(8);
  if (error) throw error;
  return data;
}

// ── Format price ───────────────────────────────────────────────
export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

// ── Product card HTML ──────────────────────────────────────────
export function productCardHTML(product) {
  const badge = product.sale_price
    ? `<span class="badge sale">SALE</span>`
    : product.is_new
    ? `<span class="badge new-badge">NEW</span>`
    : '';

  const priceHTML = product.sale_price
    ? `<span class="price sale-price">${formatPrice(product.sale_price)}</span>
       <span class="price original-price">${formatPrice(product.price)}</span>`
    : `<span class="price">${formatPrice(product.price)}</span>`;

  return `
    <article class="product-card" data-id="${product.id}">
      <a href="pages/product.html?id=${product.id}" class="card-img-wrap">
        ${badge}
        <img src="${product.image_url || 'assets/placeholder.jpg'}" alt="${product.name}" loading="lazy">
        <div class="card-overlay">
          <button class="quick-view-btn" data-id="${product.id}">Quick View</button>
        </div>
      </a>
      <div class="card-info">
        <p class="card-category">${product.category}</p>
        <h3 class="card-name"><a href="pages/product.html?id=${product.id}">${product.name}</a></h3>
        <div class="card-price">${priceHTML}</div>
        <button class="add-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    </article>
  `;
}
