-- Remove 2FA fields from users table
ALTER TABLE users DROP COLUMN IF EXISTS otp_enabled;
ALTER TABLE users DROP COLUMN IF EXISTS otp_secret;

DROP INDEX IF EXISTS idx_users_otp_enabled;
