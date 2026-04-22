-- Fix existing categories with wrong naming or slug structure
UPDATE categories SET name = 'Business Cards', slug = 'business-cards' WHERE id = 1;
UPDATE categories SET name = 'Flyers', slug = 'flyers' WHERE id = 2;

-- Seed missing categories
INSERT INTO categories (name, slug, is_active, created_at)
VALUES 
('Banners', 'banners', true, NOW()),
('Posters', 'posters', true, NOW()),
('Stickers', 'stickers', true, NOW())
ON CONFLICT (slug) DO NOTHING;
