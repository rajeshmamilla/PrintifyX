-- Fix existing products to link to the correct category ID after slug fix
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'business-cards')
WHERE slug IN ('standard-business-cards', 'plastic-business-cards');

-- Seed new products for each category
-- Flyers
INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
VALUES 
((SELECT id FROM categories WHERE slug = 'flyers'), 'Standard Flyers', 'standard-flyers', 'High-quality standard flyers for business promotion.', 500.00, true, NOW()),
((SELECT id FROM categories WHERE slug = 'flyers'), 'Premium Flyers', 'premium-flyers', 'Premium flyers with superior finish.', 500.00, true, NOW()),
((SELECT id FROM categories WHERE slug = 'flyers'), 'Club Flyers', 'club-flyers', 'Vibrant flyers perfect for clubs and events.', 500.00, true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Banners
INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
VALUES 
((SELECT id FROM categories WHERE slug = 'banners'), 'Vinyl Banners', 'vinyl-banners', 'Durable vinyl banners for indoor and outdoor use.', 500.00, true, NOW()),
((SELECT id FROM categories WHERE slug = 'banners'), 'Mesh Banners', 'mesh-banners', 'Weather-resistant mesh banners for windy areas.', 500.00, true, NOW()),
((SELECT id FROM categories WHERE slug = 'banners'), 'Fabric Banners', 'fabric-banners', 'Elegant fabric banners for a premium feel.', 500.00, true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Posters
INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
VALUES 
((SELECT id FROM categories WHERE slug = 'posters'), 'Paper Posters', 'paper-posters', 'Standard paper posters for indoor advertising.', 500.00, true, NOW()),
((SELECT id FROM categories WHERE slug = 'posters'), 'Photo Posters', 'photo-posters', 'High-resolution photo posters for stunning visuals.', 500.00, true, NOW())
ON CONFLICT (slug) DO NOTHING;

-- Stickers
INSERT INTO products (category_id, name, slug, description, base_price, is_active, created_at)
VALUES 
((SELECT id FROM categories WHERE slug = 'stickers'), 'Die-Cut Stickers', 'die-cut-stickers', 'Custom die-cut stickers in any shape.', 500.00, true, NOW()),
((SELECT id FROM categories WHERE slug = 'stickers'), 'Kiss-Cut Stickers', 'kiss-cut-stickers', 'Easy-to-peel kiss-cut stickers on sheets.', 500.00, true, NOW())
ON CONFLICT (slug) DO NOTHING;
