ALTER TABLE order_items
ADD COLUMN price NUMERIC(10,2);

UPDATE order_items
SET price = 0
WHERE price IS NULL;

ALTER TABLE order_items
ALTER COLUMN price SET NOT NULL;
