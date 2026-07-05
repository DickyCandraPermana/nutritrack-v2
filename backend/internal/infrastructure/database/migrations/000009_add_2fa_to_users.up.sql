-- Add 2FA fields to users table
ALTER TABLE users ADD COLUMN otp_secret VARCHAR(255);
ALTER TABLE users ADD COLUMN otp_enabled BOOLEAN NOT NULL DEFAULT false;

-- Create index for quick 2FA lookups
CREATE INDEX idx_users_otp_enabled ON users(otp_enabled);
