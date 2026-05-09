ALTER TABLE categories ADD COLUMN trending BOOLEAN DEFAULT FALSE;

-- Mark some initial categories as trending
UPDATE categories SET trending = TRUE WHERE slug IN ('business-cards', 'marketing-materials');
