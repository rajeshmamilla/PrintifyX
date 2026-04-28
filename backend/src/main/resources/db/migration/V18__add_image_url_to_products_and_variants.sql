-- V18__add_image_url_to_products_and_variants.sql

ALTER TABLE products
ADD COLUMN image_url VARCHAR(255);

ALTER TABLE product_variants
ADD COLUMN image_url VARCHAR(255);
