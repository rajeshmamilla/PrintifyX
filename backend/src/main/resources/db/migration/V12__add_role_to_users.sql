ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'USER';
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@printifyx.com';
