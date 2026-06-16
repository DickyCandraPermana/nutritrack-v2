CREATE TYPE scan_status AS ENUM(
  'pending',
  'processing',
  'completed',
  'failed'
);

CREATE TABLE scan_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  img_url TEXT NOT NULL,
  status scan_status DEFAULT 'pending',
  error_message TEXT,

  user_id UUID NOT NULL,

  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  deleted_by UUID REFERENCES users(id),
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