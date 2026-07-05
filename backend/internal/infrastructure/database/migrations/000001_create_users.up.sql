CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
  id bigserial PRIMARY KEY,
  email citext NOT NULL,
  username varchar(255) NOT NULL,
  password bytea NOT NULL,
  height numeric(5,2),
  weight numeric(5,2),
  date_of_birth date,
  activity_level int DEFAULT 1,
  gender varchar(10),
  created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp(0) with time zone
);

CREATE UNIQUE INDEX users_email_unique_active
ON users (email)
WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX users_username_unique_active
ON users (username)
WHERE deleted_at IS NULL;