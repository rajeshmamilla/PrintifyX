CREATE TABLE variant_pricing (
    id BIGSERIAL PRIMARY KEY,

    variant_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price NUMERIC(10,2) NOT NULL,

    CONSTRAINT fk_pricing_variant
        FOREIGN KEY (variant_id)
        REFERENCES product_variants(id)
        ON DELETE CASCADE
);
