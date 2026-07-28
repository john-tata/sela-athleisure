# SELA Athleisure — Full Setup Guide

## Your Folder Structure

```
sela/                    ← Open this folder in VS Code
├── storefront/          ← React frontend (what users see)
├── backend/             ← Node.js API (handles data + payments)
└── admin/               ← Admin dashboard (manage products, orders)
```

Each folder is an **independent app** that runs on its own port.

---

## What Each App Does

| App            | Port   | What It Is                           | Stack                     |
| -------------- | ------ | ------------------------------------ | ------------------------- |
| **storefront** | `5173` | The customer-facing website          | React + Tailwind + Vite   |
| **backend**    | `3000` | The API that serves data             | Node + Express + Supabase |
| **admin**      | `5174` | The dashboard for managing the store | React + Tailwind + Vite   |

---

## Prerequisites

1. **Node.js 18+** — Check: `node -v`
2. **Supabase account** — Sign up at [supabase.com](https://supabase.com)
3. **Paystack account** — Sign up at [paystack.com](https://paystack.com)

---

## Step 1: Set Up Supabase (Database)

### 1.1 Create a Project

1. Go to [supabase.com](https://supabase.com) → Sign up
2. Click **"New Project"**
3. Give it a name (e.g., "sela-athleisure")
4. Choose a region close to you
5. Wait for it to provision (takes ~2 minutes)

### 1.2 Get Your Credentials

Once the project is ready:

1. Go to **Project Settings** → **API**
2. Copy these values:
   - `Project URL` (e.g., `https://xyzxyzxyzxyz.supabase.co`)
   - `anon public` key
   - `service_role secret` key (scroll down under "service_role")

### 1.3 Run the Database Schema

1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy everything from `backend/src/database/schema.sql`
4. Paste it into the editor
5. Click **Run**
6. You should see "Schema created successfully"

### 1.4 Seed the Data

1. Create another **New Query**
2. Copy everything from `backend/src/database/seed.sql`
3. Paste it and click **Run**
4. You should see "Seed data inserted successfully"

**Done!** Your database now has products, categories, hero slides, testimonials, and lookbook images.

---

## Step 2: Set Up the Backend

### 2.1 Create the Environment File

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your real values:

```env
PORT=3000
NODE_ENV=development

# From Supabase (Step 1.2)
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_ANON_KEY=eyJ...your-anon-key...
SUPABASE_SERVICE_KEY=eyJ...your-service-role-key...

# From Paystack Dashboard → Settings → API Keys
PAYSTACK_SECRET_KEY=sk_test_...your-secret-key...
PAYSTACK_PUBLIC_KEY=pk_test_...your-public-key...

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### 2.2 Install Dependencies & Start

```bash
cd backend
npm install
npm run dev
```

You should see: `Sela Backend running on port 3000`

**Test it:** Open browser → `http://localhost:3000/api/v1/products`

You should see a JSON response with your products!

---

## Step 3: Set Up the Storefront

### 3.1 Create the Environment File

```bash
cd storefront
cp .env.example .env 2>/dev/null || echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
```

Make sure `.env` contains:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 3.2 Install Dependencies & Start

```bash
cd storefront
npm install
npm run dev
```

You should see: `Local: http://localhost:5173`

**Open that URL in your browser.** The store should load with real products from your database!

---

## Step 4: Set Up the Admin Dashboard

### 4.1 Create the Environment File

```bash
cd admin
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
```

### 4.2 Install Dependencies & Start

```bash
cd admin
npm install
npm run dev
```

Open `http://localhost:5174` to access the admin panel.

---

## Running All 3 Apps Together

You need **3 terminal tabs** open:

| Tab | Folder        | Command       | URL                     |
| --- | ------------- | ------------- | ----------------------- |
| 1   | `backend/`    | `npm run dev` | `http://localhost:3000` |
| 2   | `storefront/` | `npm run dev` | `http://localhost:5173` |
| 3   | `admin/`      | `npm run dev` | `http://localhost:5174` |

---

## How They Talk to Each Other

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER                                │
│                                                            │
│  ┌─────────────────┐    ┌──────────────────────────────┐  │
│  │ localhost:5173  │    │ localhost:5174              │  │
│  │ (Storefront)    │    │ (Admin)                     │  │
│  │                 │    │                             │  │
│  │ Products load   │    │ Manage products             │  │
│  │ from API        │    │ View orders                 │  │
│  │ Add to cart     │    │ Edit content                │  │
│  └────────┬────────┘    └──────────────┬──────────────┘  │
│           │                             │                  │
│           │  GET /api/v1/products       │                  │
│           │  POST /api/v1/cart/items    │                  │
│           │  POST /api/v1/orders        │                  │
│           └──────────────┬──────────────┘                  │
│                          │                                 │
│           ┌──────────────▼──────────────┐                 │
│           │  localhost:3000             │                  │
│           │  (Backend API)              │                  │
│           │                             │                  │
│           │  Express + Supabase Client  │                  │
│           └──────────────┬──────────────┘                 │
│                          │                                 │
│           ┌──────────────▼──────────────┐                 │
│           │  Supabase Cloud             │                  │
│           │  (PostgreSQL + Auth)        │                  │
│           └─────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

**The flow:**

1. Customer opens the storefront (`:5173`)
2. Storefront calls the API (`:3000/api/v1/products`)
3. Backend queries Supabase and returns the data
4. Products appear on the page

### Cart behavior

The cart supports both simple products and variant-based products.

- Simple products are added using `productId` only.
- Variant products are added using `productId + variantId`.
- `variant_id` is nullable in `cart_items` to support products without sizes or colors.

## Quantity changes currently sync to the server on each click, so updates are correct but can feel slightly slower on products with many API round-trips.

## Troubleshooting

### "Cannot connect to backend"

- Make sure the backend is running (`npm run dev` in the `backend/` folder)
- Check that `VITE_API_URL` in storefront's `.env` points to `http://localhost:3000/api/v1`
- Check for CORS errors in browser console

### "Products not showing"

- Check that you ran both `schema.sql` AND `seed.sql` in Supabase SQL Editor
- Test the API directly: `http://localhost:3000/api/v1/products`
- Check Supabase Table Editor to see if data exists

### "Cart not working"

- Make sure you're sending the `x-guest-token` header (the cart store handles this)
- Check browser's Local Storage for `guest_token`

### "Port already in use"

- Change the port in the `.env` file or `package.json`

---

## What's Already Built

### ✅ Storefront

- Hero carousel (fetches from CMS)
- Product grid with Quick Add to cart
- Category browsing
- Cart drawer (slide-out panel)
- Lookbook gallery with lightbox
- Testimonials carousel
- Newsletter signup (UI only)
- Responsive design

### ✅ Backend

- Product CRUD API
- Category API
- Cart API (guest + authenticated)
- Order API
- Paystack payment integration
- CMS content API
- Database schema + seed data

### 🔄 Admin (Needs Setup)

- Dashboard with stats
- Product management
- Order management
- Content editing
- Settings

---

## Quick Test Checklist

- [ ] Backend running on `localhost:3000`
- [ ] `http://localhost:3000/api/v1/products` returns JSON
- [ ] Storefront running on `localhost:5173`
- [ ] Products appear on the homepage
- [ ] Clicking "Quick Add" opens the cart drawer
- [ ] Cart shows items with correct prices
