-- ============================================================
-- SELA ATHLEISURE — Migration 003
-- Optional variants on order items
--
-- Run in the Supabase SQL Editor. Idempotent and safe to run
-- more than once.
-- ============================================================

BEGIN;

ALTER TABLE public.order_items
ALTER COLUMN variant_id DROP NOT NULL;

COMMENT ON COLUMN public.order_items.variant_id IS
'Nullable for simple products; populated for variant-based products.';

COMMIT;
