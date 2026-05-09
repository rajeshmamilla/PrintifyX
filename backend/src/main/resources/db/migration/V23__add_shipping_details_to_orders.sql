-- Add shipping address columns to orders table
ALTER TABLE orders ADD COLUMN shipping_name VARCHAR(255);
ALTER TABLE orders ADD COLUMN shipping_address_line1 VARCHAR(255);
ALTER TABLE orders ADD COLUMN shipping_address_line2 VARCHAR(255);
ALTER TABLE orders ADD COLUMN shipping_city VARCHAR(100);
ALTER TABLE orders ADD COLUMN shipping_state VARCHAR(100);
ALTER TABLE orders ADD COLUMN shipping_pincode VARCHAR(20);

-- Sync existing customer_name to shipping_name for legacy orders
UPDATE orders SET shipping_name = customer_name WHERE shipping_name IS NULL;
