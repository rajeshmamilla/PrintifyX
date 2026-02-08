CREATE TABLE product_variants (
    id BIGSERIAL PRIMARY KEY,

    product_id BIGINT NOT NULL,
    variant_name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_variants_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);
