CREATE TABLE IF NOT EXISTS foods(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  description text,
  serving_size numeric(10,2) NOT NULL DEFAULT 100,
  serving_unit varchar(50) NOT NULL DEFAULT 'g',
  
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  deleted_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TRIGGER set_timestamp_foods
BEFORE UPDATE ON foods
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
