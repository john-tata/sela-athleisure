-- ============================================================
-- SELA ATHLEISURE — Migration 002
-- Shipping area zones
--
-- Run in the Supabase SQL Editor. Idempotent and safe to run
-- more than once.
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS shipping_zones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  state text,
  description text,
  shipping_fee numeric(10,2) NOT NULL DEFAULT 0,
  free_shipping_threshold numeric(10,2),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE shipping_zones ADD COLUMN IF NOT EXISTS description text;

CREATE INDEX IF NOT EXISTS idx_shipping_zones_active
  ON shipping_zones(is_active);

CREATE INDEX IF NOT EXISTS idx_shipping_zones_state
  ON shipping_zones(state);

INSERT INTO shipping_zones (
  name,
  state,
  description,
  shipping_fee,
  free_shipping_threshold,
  is_active
)
SELECT *
FROM (
  VALUES
    (
      'Abuja (Area A)'::text,
      'FCT'::text,
      'Apo, Kaura, Guzape, Prince & Princess, Lifecamp, Galadima, Galadimawa, Asokoro, Katempe, Jahi, Gwarimpa 1st-2nd Avenue'::text,
      3500::numeric,
      NULL::numeric,
      true::boolean
    ),
    (
      'Abuja (Area C)'::text,
      'FCT'::text,
      'Apo Legislative, Apo resettlement, AYA, Lifecamp EXT, Brains and Hammers City, Karimo, Naf Valley, Gwarimpa 3rd-4th Avenue, Kugbo'::text,
      4000::numeric,
      NULL::numeric,
      true::boolean
    ),
    (
      'Abuja (Area E)'::text,
      'FCT'::text,
      'Lugbe, Nyanya, Katampe Extension, Kurudu, Kugbo, Kubwa, Wumba, Kubusa, Durumi, Sun City, Idu, Dawaki, Lokogoma'::text,
      5000::numeric,
      NULL::numeric,
      true::boolean
    )
) AS zone(
  name,
  state,
  description,
  shipping_fee,
  free_shipping_threshold,
  is_active
)
WHERE NOT EXISTS (
  SELECT 1
  FROM shipping_zones existing
  WHERE lower(existing.name) = lower(zone.name)
);

COMMIT;
