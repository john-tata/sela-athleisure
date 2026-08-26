-- ============================================================
-- SELA ATHLEISURE — Seed Data
-- Run after schema.sql
-- ============================================================

-- Clear existing data
TRUNCATE categories, products, product_variants, product_images, hero_slides, testimonials, lookbook_images, shipping_zones, cart_items, orders, order_items, reviews, newsletter_subscribers CASCADE;

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
('Sports Bras', 'sports-bras', 'High-support bras for every workout intensity', '/assets/category-sports-bras.jpg', 1),
('Leggings', 'leggings', 'Sculpting leggings from studio to street', '/assets/category-leggings.jpg', 2),
('Shorts', 'shorts', 'Performance shorts for warm weather training', '/assets/category-shorts.jpg', 3),
('Sets', 'sets', 'Matching sets designed to move together', '/assets/category-sets.jpg', 4),
('Accessories', 'accessories', 'Bottles, bags, and workout essentials', '/assets/category-accessories.jpg', 5);

-- ============================================================
-- PRODUCTS
-- ============================================================
INSERT INTO products (name, slug, description, base_price, category_id, sku, is_bestseller, is_new, is_active) VALUES
('Seamless Leggings', 'seamless-leggings', 'High-waisted seamless leggings with 4-way stretch. Sweat-wicking fabric keeps you dry through any workout. The squat-proof construction ensures total confidence.', 6800, (SELECT id FROM categories WHERE slug='leggings'), 'SELA-LG-001', true, false, true),
('Criss-Cross Sports Bra', 'criss-cross-sports-bra', 'Medium-support sports bra with signature criss-cross back detail. Removable padding and moisture-wicking fabric for all-day comfort.', 5200, (SELECT id FROM categories WHERE slug='sports-bras'), 'SELA-SB-001', false, false, true),
('Oversized Hoodie', 'oversized-hoodie', 'Premium cotton-blend oversized hoodie with dropped shoulders. Perfect for post-workout layering or casual weekends.', 7800, (SELECT id FROM categories WHERE slug='sets'), 'SELA-ST-001', true, false, true),
('Biker Shorts', 'biker-shorts', 'High-waisted biker shorts with 7-inch inseam. Seamless construction, squat-proof, and breathable for cycling or training.', 4800, (SELECT id FROM categories WHERE slug='shorts'), 'SELA-SH-001', false, false, true),
('Essential Joggers', 'essential-joggers', 'Relaxed-fit joggers in premium cotton blend. Tapered leg with elastic cuffs and hidden zip pockets.', 7200, (SELECT id FROM categories WHERE slug='sets'), 'SELA-ST-002', false, false, true),
('Essential Tee', 'essential-tee', 'Soft cotton-blend fitted workout tee with curved hem. Breathable, lightweight, and designed to move with you.', 4200, (SELECT id FROM categories WHERE slug='sports-bras'), 'SELA-SB-002', false, false, true),
('Track Jacket', 'track-jacket', 'Lightweight full-zip track jacket in premium nylon. Stand collar, zippered pockets, and slight sheen finish.', 8800, (SELECT id FROM categories WHERE slug='sets'), 'SELA-ST-003', false, true, true),
('High-Waist Shorts', 'high-waist-shorts', 'High-waisted running shorts with built-in liner and side pockets. 3-inch inseam in lightweight performance fabric.', 4600, (SELECT id FROM categories WHERE slug='shorts'), 'SELA-SH-002', false, false, true);

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
INSERT INTO product_variants (product_id, sku, size, color, color_hex, stock_quantity, price_adjustment) VALUES
-- Seamless Leggings
((SELECT id FROM products WHERE slug='seamless-leggings'), 'SELA-LG-001-BLK-S', 'S', 'Black', '#111111', 42, 0),
((SELECT id FROM products WHERE slug='seamless-leggings'), 'SELA-LG-001-BLK-M', 'M', 'Black', '#111111', 38, 0),
((SELECT id FROM products WHERE slug='seamless-leggings'), 'SELA-LG-001-BLK-L', 'L', 'Black', '#111111', 25, 0),
((SELECT id FROM products WHERE slug='seamless-leggings'), 'SELA-LG-001-SGE-S', 'S', 'Sage', '#87A878', 15, 0),
((SELECT id FROM products WHERE slug='seamless-leggings'), 'SELA-LG-001-SGE-M', 'M', 'Sage', '#87A878', 12, 0),
((SELECT id FROM products WHERE slug='seamless-leggings'), 'SELA-LG-001-MOC-M', 'M', 'Mocha', '#8B6914', 20, 0),

-- Criss-Cross Sports Bra
((SELECT id FROM products WHERE slug='criss-cross-sports-bra'), 'SELA-SB-001-SGE-S', 'S', 'Sage', '#87A878', 30, 0),
((SELECT id FROM products WHERE slug='criss-cross-sports-bra'), 'SELA-SB-001-SGE-M', 'M', 'Sage', '#87A878', 28, 0),
((SELECT id FROM products WHERE slug='criss-cross-sports-bra'), 'SELA-SB-001-BLK-S', 'S', 'Black', '#111111', 22, 0),
((SELECT id FROM products WHERE slug='criss-cross-sports-bra'), 'SELA-SB-001-BLK-M', 'M', 'Black', '#111111', 35, 0),
((SELECT id FROM products WHERE slug='criss-cross-sports-bra'), 'SELA-SB-001-DSR-L', 'L', 'Dusty Rose', '#DCAE96', 18, 0),

-- Oversized Hoodie
((SELECT id FROM products WHERE slug='oversized-hoodie'), 'SELA-ST-001-CRM-S', 'S', 'Cream', '#F5F5DC', 20, 0),
((SELECT id FROM products WHERE slug='oversized-hoodie'), 'SELA-ST-001-CRM-M', 'M', 'Cream', '#F5F5DC', 25, 0),
((SELECT id FROM products WHERE slug='oversized-hoodie'), 'SELA-ST-001-CRM-L', 'L', 'Cream', '#F5F5DC', 15, 0),
((SELECT id FROM products WHERE slug='oversized-hoodie'), 'SELA-ST-001-BLK-M', 'M', 'Black', '#111111', 30, 0),
((SELECT id FROM products WHERE slug='oversized-hoodie'), 'SELA-ST-001-BLK-L', 'L', 'Black', '#111111', 22, 0),

-- Biker Shorts
((SELECT id FROM products WHERE slug='biker-shorts'), 'SELA-SH-001-CHA-S', 'S', 'Charcoal', '#36454F', 25, 0),
((SELECT id FROM products WHERE slug='biker-shorts'), 'SELA-SH-001-CHA-M', 'M', 'Charcoal', '#36454F', 30, 0),
((SELECT id FROM products WHERE slug='biker-shorts'), 'SELA-SH-001-CHA-L', 'L', 'Charcoal', '#36454F', 18, 0),
((SELECT id FROM products WHERE slug='biker-shorts'), 'SELA-SH-001-BLK-M', 'M', 'Black', '#111111', 35, 0),

-- Essential Joggers
((SELECT id FROM products WHERE slug='essential-joggers'), 'SELA-ST-002-MOC-S', 'S', 'Mocha', '#8B6914', 20, 0),
((SELECT id FROM products WHERE slug='essential-joggers'), 'SELA-ST-002-MOC-M', 'M', 'Mocha', '#8B6914', 25, 0),
((SELECT id FROM products WHERE slug='essential-joggers'), 'SELA-ST-002-MOC-L', 'L', 'Mocha', '#8B6914', 15, 0),
((SELECT id FROM products WHERE slug='essential-joggers'), 'SELA-ST-002-BLK-M', 'M', 'Black', '#111111', 28, 0),

-- Essential Tee
((SELECT id FROM products WHERE slug='essential-tee'), 'SELA-SB-002-WHT-S', 'S', 'White', '#FFFFFF', 30, 0),
((SELECT id FROM products WHERE slug='essential-tee'), 'SELA-SB-002-WHT-M', 'M', 'White', '#FFFFFF', 35, 0),
((SELECT id FROM products WHERE slug='essential-tee'), 'SELA-SB-002-WHT-L', 'L', 'White', '#FFFFFF', 20, 0),
((SELECT id FROM products WHERE slug='essential-tee'), 'SELA-SB-002-BLK-M', 'M', 'Black', '#111111', 25, 0),

-- Track Jacket
((SELECT id FROM products WHERE slug='track-jacket'), 'SELA-ST-003-OLV-S', 'S', 'Olive', '#556B2F', 15, 0),
((SELECT id FROM products WHERE slug='track-jacket'), 'SELA-ST-003-OLV-M', 'M', 'Olive', '#556B2F', 18, 0),
((SELECT id FROM products WHERE slug='track-jacket'), 'SELA-ST-003-OLV-L', 'L', 'Olive', '#556B2F', 10, 0),
((SELECT id FROM products WHERE slug='track-jacket'), 'SELA-ST-003-BLK-M', 'M', 'Black', '#111111', 22, 0),

-- High-Waist Shorts
((SELECT id FROM products WHERE slug='high-waist-shorts'), 'SELA-SH-002-BLK-S', 'S', 'Black', '#111111', 28, 0),
((SELECT id FROM products WHERE slug='high-waist-shorts'), 'SELA-SH-002-BLK-M', 'M', 'Black', '#111111', 32, 0),
((SELECT id FROM products WHERE slug='high-waist-shorts'), 'SELA-SH-002-BLK-L', 'L', 'Black', '#111111', 20, 0),
((SELECT id FROM products WHERE slug='high-waist-shorts'), 'SELA-SH-002-SGE-M', 'M', 'Sage', '#87A878', 15, 0);

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug='seamless-leggings'), '/assets/product-seamless-leggings-black.jpg', 'Seamless Leggings Black', 1, true),
((SELECT id FROM products WHERE slug='criss-cross-sports-bra'), '/assets/product-sports-bra-sage.jpg', 'Criss-Cross Sports Bra Sage', 1, true),
((SELECT id FROM products WHERE slug='oversized-hoodie'), '/assets/product-oversized-hoodie-cream.jpg', 'Oversized Hoodie Cream', 1, true),
((SELECT id FROM products WHERE slug='biker-shorts'), '/assets/product-biker-shorts-charcoal.jpg', 'Biker Shorts Charcoal', 1, true),
((SELECT id FROM products WHERE slug='essential-joggers'), '/assets/product-joggers-mocha.jpg', 'Essential Joggers Mocha', 1, true),
((SELECT id FROM products WHERE slug='essential-tee'), '/assets/product-essential-tee-white.jpg', 'Essential Tee White', 1, true),
((SELECT id FROM products WHERE slug='track-jacket'), '/assets/product-track-jacket-olive.jpg', 'Track Jacket Olive', 1, true),
((SELECT id FROM products WHERE slug='high-waist-shorts'), '/assets/product-high-waist-shorts-black.jpg', 'High-Waist Shorts Black', 1, true);

-- ============================================================
-- HERO SLIDES
-- ============================================================
INSERT INTO hero_slides (image_url, heading, subtext, cta_primary, cta_primary_link, cta_secondary, cta_secondary_link, sort_order, is_active) VALUES
('/assets/hero-slide-1.jpg', 'MOVE WITHOUT LIMITS', 'Premium Athleisure Built For Women Who Lead.', 'Shop Collection', '/products', 'Explore', '/about', 1, true),
('/assets/hero-slide-2.jpg', 'CONFIDENCE IN EVERY STEP', 'Designed for workouts. Styled for everyday life.', 'Shop Collection', '/products', 'Explore', '/about', 2, true),
('/assets/hero-slide-3.jpg', 'YOUR EVERYDAY UNIFORM', 'Performance. Comfort. Elegance.', 'Shop Collection', '/products', 'Explore', '/about', 3, true);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
INSERT INTO testimonials (customer_name, customer_photo, rating, review_text, is_verified, sort_order) VALUES
('Sarah Mitchell', '/assets/testimonial-1.jpg', 5, 'The seamless leggings are absolutely game-changing. I have tried dozens of brands and nothing compares to the comfort and fit of SELA.', true, 1),
('Jordan Lee', '/assets/testimonial-2.jpg', 5, 'Finally, athleisure that actually looks premium. The fabric quality is incredible. I have replaced half my wardrobe with SELA pieces.', true, 2),
('Emma Rodriguez', '/assets/testimonial-3.jpg', 5, 'The sports bras provide amazing support without feeling restrictive. I wear them for HIIT classes and they are perfect.', true, 3),
('Aisha Patel', '/assets/testimonial-4.jpg', 5, 'I love how versatile these pieces are. I can go from yoga to brunch without changing. Highly recommend!', true, 4),
('Chloe Brennan', '/assets/testimonial-5.jpg', 5, 'The customer service is as premium as the products. The sets are stunning. I get compliments every time I wear them.', true, 5);

-- ============================================================
-- LOOKBOOK IMAGES
-- ============================================================
INSERT INTO lookbook_images (image_url, alt_text, is_tall, sort_order, is_active) VALUES
('/assets/lookbook-1.jpg', 'Yoga session', true, 1, true),
('/assets/lookbook-2.jpg', 'Walking together', false, 2, true),
('/assets/lookbook-3.jpg', 'Fabric detail', true, 3, true),
('/assets/lookbook-4.jpg', 'Warrior pose', true, 4, true),
('/assets/lookbook-5.jpg', 'Workout setup', false, 5, true),
('/assets/lookbook-6.jpg', 'Post workout stretch', true, 6, true),
('/assets/lookbook-7.jpg', 'City street style', true, 7, true),
('/assets/lookbook-8.jpg', 'Group fitness', false, 8, true);

-- ============================================================
-- SHIPPING ZONES
-- ============================================================
INSERT INTO shipping_zones (name, state, description, shipping_fee, free_shipping_threshold, is_active) VALUES
('Abuja (Area A)', 'FCT', 'Apo, Kaura, Guzape, Prince & Princess, Lifecamp, Galadima, Galadimawa, Asokoro, Katempe, Jahi, Gwarimpa 1st-2nd Avenue', 3500, NULL, true),
('Abuja (Area C)', 'FCT', 'Apo Legislative, Apo resettlement, AYA, Lifecamp EXT, Brains and Hammers City, Karimo, Naf Valley, Gwarimpa 3rd-4th Avenue, Kugbo', 4000, NULL, true),
('Abuja (Area E)', 'FCT', 'Lugbe, Nyanya, Katampe Extension, Kurudu, Kugbo, Kubwa, Wumba, Kubusa, Durumi, Sun City, Idu, Dawaki, Lokogoma', 5000, NULL, true);

-- ============================================================
-- DONE
-- ============================================================
SELECT 'Seed data inserted successfully' as status;
