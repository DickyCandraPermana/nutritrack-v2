CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- Trigger Function untuk update timestamp (Standard PostgreSQL)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TYPE user_role AS ENUM (
  'user',
  'admin',
  'super_admin'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  email CITEXT NOT NULL,
  role user_role DEFAULT 'user',
  password_hash TEXT NOT NULL,
  verified_at TIMESTAMPTZ,

  created_by UUID,
  updated_by UUID,
  deleted_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX users_email_unique_active
ON users (email)
WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX users_username_unique_active
ON users (username)
WHERE deleted_at IS NULL;

-- Trigger dipasang ke tabel users
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();