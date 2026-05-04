-- Mark some products as trending for the initial showcase
UPDATE products SET trending = TRUE WHERE slug IN ('standard-business-cards', 'plastic-business-cards');
