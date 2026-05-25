-- ============================================================
-- DRIP. Clothing — Supabase Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- ── PROFILES ─────────────────────────────────────────────────
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  avatar_url text,
  phone text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- ── PRODUCTS ─────────────────────────────────────────────────
create table if not exists products (
  id bigserial primary key,
  name text not null,
  description text,
  category text not null, -- 'men', 'women', 'streetwear', 'accessories'
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  image_url text,
  images text[], -- additional images array
  sizes text[] default array['XS','S','M','L','XL','XXL'],
  in_stock boolean default true,
  featured boolean default false,
  is_new boolean default false,
  tags text[],
  sku text unique,
  stock_count integer default 100,
  created_at timestamptz default now()
);
alter table products enable row level security;
-- Public read access
create policy "Anyone can view products" on products for select using (true);
-- Only authenticated admins can modify (add admin check as needed)
create policy "Admins can manage products" on products for all using (auth.role() = 'authenticated');

-- ── ORDERS ───────────────────────────────────────────────────
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users,
  items jsonb not null,
  total numeric(10,2) not null,
  shipping_info jsonb,
  status text default 'pending', -- pending, pending_cod, paid, shipped, delivered, cancelled
  razorpay_order_id text,
  razorpay_payment_id text,
  tracking_id text,
  notes text,
  created_at timestamptz default now()
);
alter table orders enable row level security;
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Anyone can insert orders" on orders for insert with check (true);
create policy "Users can update own orders" on orders for update using (auth.uid() = user_id);

-- ── WISHLIST ─────────────────────────────────────────────────
create table if not exists wishlist (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade,
  product_id bigint references products on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);
alter table wishlist enable row level security;
create policy "Users can manage own wishlist" on wishlist for all using (auth.uid() = user_id);

-- ── REVIEWS ──────────────────────────────────────────────────
create table if not exists reviews (
  id bigserial primary key,
  product_id bigint references products on delete cascade,
  user_id uuid references auth.users,
  rating integer check (rating between 1 and 5),
  title text,
  body text,
  created_at timestamptz default now()
);
alter table reviews enable row level security;
create policy "Anyone can view reviews" on reviews for select using (true);
create policy "Users can add reviews" on reviews for insert with check (auth.uid() = user_id);

-- ── SAMPLE PRODUCTS ──────────────────────────────────────────
insert into products (name, description, category, price, sale_price, image_url, featured, is_new, sizes) values
  ('Obsidian Oversized Tee', 'Premium 280GSM combed cotton tee with relaxed oversized silhouette.', 'streetwear', 1299, null, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80', true, true, array['XS','S','M','L','XL','XXL']),
  ('Linen Relaxed Blazer', 'Structured breathable linen blazer perfect for warm-weather occasions.', 'men', 4999, 3499, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80', true, false, array['S','M','L','XL']),
  ('Minimal Wrap Dress', 'Timeless wrap dress in soft crepe fabric with surplice neckline.', 'women', 2799, null, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', true, true, array['XS','S','M','L','XL']),
  ('Cargo Utility Pants', 'Relaxed-fit cargo pants in durable ripstop fabric.', 'streetwear', 2299, null, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80', true, false, array['S','M','L','XL','XXL']),
  ('Classic Oxford Shirt', 'Crisp cotton oxford button-down with a tailored fit.', 'men', 1899, null, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&q=80', false, false, array['S','M','L','XL']),
  ('Floral Midi Skirt', 'Flowy floral midi skirt in lightweight chiffon.', 'women', 1699, 1299, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80', false, false, array['XS','S','M','L']),
  ('Leather Crossbody Bag', 'Compact genuine leather crossbody with adjustable strap.', 'accessories', 3499, null, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', false, false, array['One Size']),
  ('Hoodie Zip-Up', 'Premium French terry zip-up hoodie with kangaroo pocket.', 'streetwear', 2199, null, 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80', false, true, array['XS','S','M','L','XL','XXL']);
