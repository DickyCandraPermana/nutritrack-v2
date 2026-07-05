CREATE TYPE scan_status AS ENUM(
  'pending',
  'processing',
  'completed',
  'failed'
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE scan_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  img_url TEXT NOT NULL,
  status scan_status DEFAULT 'pending',
  error_message TEXT,

  user_id BIGINT NOT NULL,

  created_by BIGINT REFERENCES users(id),
  updated_by BIGINT REFERENCES users(id),
  deleted_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT fk_scan_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TRIGGER set_timestamp_scan_histories
BEFORE UPDATE ON scan_histories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
