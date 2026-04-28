-- Step 1 — Fix existing categories
UPDATE categories 
SET name = 'Business Cards', 
    slug = 'business-cards'
WHERE id = 1;

UPDATE categories
SET name = 'Flyers',
    slug = 'flyers'
WHERE id = 2;

-- Step 2 — Fix existing product slugs
UPDATE products 
SET name = 'Standard Business Cards',
    slug = 'standard-business-cards'
WHERE id = 1;

UPDATE products 
SET name = 'Plastic Business Cards',
    slug = 'plastic-business-cards'
WHERE id = 6;

-- Step 3 — Insert missing categories
INSERT INTO categories (name, slug, is_active, created_at)
VALUES 
('Banners', 'banners', true, NOW()),
('Posters', 'posters', true, NOW()),
('Stickers', 'stickers', true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Step 4 — Insert all missing products
-- Flyers
INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
SELECT id, 'Standard Flyers', 'standard-flyers', 'Standard quality flyers', 500, true, NOW()
FROM categories WHERE slug = 'flyers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
SELECT id, 'Premium Flyers', 'premium-flyers', 'Premium quality flyers', 700, true, NOW()
FROM categories WHERE slug = 'flyers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
SELECT id, 'Club Flyers', 'club-flyers', 'Club and event flyers', 600, true, NOW()
FROM categories WHERE slug = 'flyers'
ON CONFLICT (slug) DO NOTHING;

-- Banners
INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
SELECT id, 'Vinyl Banners', 'vinyl-banners', 'Durable vinyl banners', 800, true, NOW()
FROM categories WHERE slug = 'banners'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
SELECT id, 'Mesh Banners', 'mesh-banners', 'Breathable mesh banners', 900, true, NOW()
FROM categories WHERE slug = 'banners'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
SELECT id, 'Fabric Banners', 'fabric-banners', 'Fabric finish banners', 1000, true, NOW()
FROM categories WHERE slug = 'banners'
ON CONFLICT (slug) DO NOTHING;

-- Posters
INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
SELECT id, 'Paper Posters', 'paper-posters', 'Standard paper posters', 400, true, NOW()
FROM categories WHERE slug = 'posters'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
SELECT id, 'Photo Posters', 'photo-posters', 'High quality photo posters', 600, true, NOW()
FROM categories WHERE slug = 'posters'
ON CONFLICT (slug) DO NOTHING;

-- Stickers
INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
SELECT id, 'Die-Cut Stickers', 'die-cut-stickers', 'Custom die-cut stickers', 350, true, NOW()
FROM categories WHERE slug = 'stickers'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
SELECT id, 'Kiss-Cut Stickers', 'kiss-cut-stickers', 'Easy peel kiss-cut stickers', 300, true, NOW()
FROM categories WHERE slug = 'stickers'
ON CONFLICT (slug) DO NOTHING;
