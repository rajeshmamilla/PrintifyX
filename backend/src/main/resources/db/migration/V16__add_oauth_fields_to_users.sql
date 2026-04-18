-- Add OAuth2 fields to users table and make password optional
ALTER TABLE users ADD COLUMN provider VARCHAR(50) DEFAULT 'LOCAL';
ALTER TABLE users ADD COLUMN provider_id VARCHAR(255);
ALTER TABLE users ADD COLUMN picture_url VARCHAR(500);

-- Make password nullable for Google users
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Index for faster lookup of OAuth users
CREATE INDEX idx_user_provider ON users(provider, provider_id);
