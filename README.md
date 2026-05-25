# DRIP. — Clothing E-Commerce Website

A full-featured clothing e-commerce frontend with Supabase backend and Razorpay payments.

---

## 📁 Project Structure

```
clothstore/
├── index.html              ← Homepage (hero, categories, featured products)
├── css/
│   └── style.css           ← All global styles (dark luxury theme)
├── js/
│   ├── config.js           ← Supabase & Razorpay keys ← EDIT THIS FIRST
│   ├── auth.js             ← Login, signup, logout
│   ├── cart.js             ← Cart (localStorage)
│   ├── products.js         ← Fetch/display products from Supabase
│   └── payment.js          ← Razorpay checkout helper
├── pages/
│   ├── shop.html           ← Shop with filters & search
│   ├── product.html        ← Product detail page
│   ├── auth.html           ← Login / Signup
│   ├── checkout.html       ← Checkout with Razorpay
│   └── order-success.html  ← Order confirmation
└── supabase-schema.sql     ← Database setup (run in Supabase SQL editor)
```

---

## ⚡ Quick Setup

### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com) → Create a new project
2. In the SQL editor, paste and run `supabase-schema.sql`
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_ANON_KEY`

### 2. Razorpay Setup
1. Go to [razorpay.com](https://razorpay.com) → Create account
2. Go to **Settings → API Keys** → Generate Key
3. Copy your **Key ID** → `RAZORPAY_KEY_ID`

> **Note**: For real payments, you need a Razorpay Edge Function to create orders server-side. See below.

### 3. Edit `js/config.js`
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const RAZORPAY_KEY_ID = 'YOUR_RAZORPAY_KEY_ID';
```

### 4. Deploy
- Drag the `clothstore/` folder to [Netlify Drop](https://app.netlify.com/drop) or any static host
- Or serve locally: `npx serve clothstore`

---

## 🔑 Razorpay Edge Function (for production)

For production, create a Supabase Edge Function to create Razorpay orders:

```bash
supabase functions new create-razorpay-order
```

```typescript
// supabase/functions/create-razorpay-order/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { amount } = await req.json()
  const auth = btoa(`${Deno.env.get('RAZORPAY_KEY_ID')}:${Deno.env.get('RAZORPAY_KEY_SECRET')}`)
  
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency: 'INR', receipt: `order_${Date.now()}` })
  })
  const order = await response.json()
  return new Response(JSON.stringify(order), { headers: { 'Content-Type': 'application/json' } })
})
```

Set secrets:
```bash
supabase secrets set RAZORPAY_KEY_ID=your_key_id
supabase secrets set RAZORPAY_KEY_SECRET=your_key_secret
supabase functions deploy create-razorpay-order
```

---

## 🎨 Features

| Feature | Status |
|---|---|
| Homepage with hero & categories | ✅ |
| Product listing with filters | ✅ |
| Product detail page | ✅ |
| Cart sidebar (localStorage) | ✅ |
| User auth (Email + Google OAuth) | ✅ |
| Checkout with Razorpay | ✅ |
| Cash on Delivery option | ✅ |
| Promo codes | ✅ |
| Order success page + confetti | ✅ |
| Supabase DB with RLS | ✅ |
| Responsive (mobile-first) | ✅ |
| Dark luxury editorial theme | ✅ |

---

## 🧪 Test Razorpay Credentials

Use these test card numbers in Razorpay test mode:
- **Card**: 4111 1111 1111 1111 | Expiry: any future | CVV: any
- **UPI**: success@razorpay
- **NetBanking**: any bank → success

---

## 🛠 Customization

- **Colors**: Edit CSS variables in `css/style.css` `:root` block
- **Products**: Add via Supabase dashboard or SQL
- **Logo**: Replace "DRIP." text in navbar with your brand name
- **Images**: Use your own product images via Supabase Storage
