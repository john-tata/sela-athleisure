-- ============================================================
-- SELA ATHLEISURE — Migration 001
-- Admin ↔ Schema Compatibility
--
-- Run in the Supabase SQL Editor (same place schema.sql was run).
-- Idempotent: safe to run more than once.
--
-- Adds the columns the admin dashboard (via the backend services)
-- expects, without changing or removing any existing column.
-- No data is deleted; existing columns keep their current meaning.
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. products.inventory_quantity
--    Used by: admin Products form (Add/Edit → "Inventory Quantity")
--    Written by: product.service.js createProduct / updateProduct
--    Backfilled from the sum of variant stock where variants exist.
-- ------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'inventory_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN inventory_quantity integer NOT NULL DEFAULT 0;

    UPDATE products p
    SET inventory_quantity = COALESCE((
      SELECT SUM(v.stock_quantity)
      FROM product_variants v
      WHERE v.product_id = p.id
    ), 0);
  END IF;
END $$;

-- ------------------------------------------------------------
-- 2. testimonials.role
--    Used by: admin Content form (Testimonials → "Role")
--    Read/written by: content.service.js (getTestimonials,
--    createTestimonial, updateTestimonial)
-- ------------------------------------------------------------
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS role text;

-- ------------------------------------------------------------
-- 3. testimonials.is_active
--    Used by: admin Content form (Testimonials → "Active" toggle)
--    Filtered/written by: content.service.js
--    The schema previously had only is_approved; that column is kept
--    untouched. Existing rows inherit their approval state as the
--    initial active state.
-- ------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'testimonials' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE testimonials ADD COLUMN is_active boolean NOT NULL DEFAULT true;
    UPDATE testimonials SET is_active = is_approved;
  END IF;
END $$;

-- ------------------------------------------------------------
-- 4. lookbook_images.title
--    Used by: admin Content form (Lookbook → "Title")
--    Read/written by: content.service.js
--    Backfilled from alt_text, the closest pre-existing field.
-- ------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lookbook_images' AND column_name = 'title'
  ) THEN
    ALTER TABLE lookbook_images ADD COLUMN title text;
    UPDATE lookbook_images SET title = alt_text WHERE alt_text IS NOT NULL;
  END IF;
END $$;

-- ------------------------------------------------------------
-- 5. orders.paid_at
--    Not an admin form field, but required by payment.service.js
--    (verifyPayment + handleWebhook both UPDATE this column).
--    Without it, Paystack payment confirmation silently fails and
--    orders are never marked paid.
-- ------------------------------------------------------------
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at timestamptz;

COMMIT;

-- ============================================================
-- Verification (optional — run after the migration):
--
-- SELECT column_name FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'products'
--   AND column_name = 'inventory_quantity';
--
-- SELECT column_name FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'testimonials'
--   AND column_name IN ('role', 'is_active');
--
-- SELECT column_name FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'lookbook_images'
--   AND column_name = 'title';
--
-- SELECT column_name FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'orders'
--   AND column_name = 'paid_at';
-- ============================================================
