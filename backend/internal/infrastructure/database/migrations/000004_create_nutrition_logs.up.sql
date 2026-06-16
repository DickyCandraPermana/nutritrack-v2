CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  food_name TEXT NOT NULL CHECK (char_length(food_name) >= 2),

  calories NUMERIC(6, 2) NOT NULL DEFAULT 0.00 CHECK (calories >= 0),
  protein_g NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (protein_g >= 0),
  carbs_g NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (carbs_g >= 0),
  fat_g NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (fat_g >= 0),
  sugar_g NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (sugar_g >= 0),

  user_id UUID NOT NULL,

  scan_id UUID,

  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  deleted_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT fk_nutrition_logs_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_nutrition_logs_scan
    FOREIGN KEY (scan_id)
    REFERENCES scan_histories(id)
    ON DELETE SET NULL
);

CREATE INDEX idx_nutrition_logs_query
ON nutrition_logs (profile_id, created_at)
WHERE deleted_at IS NULL;

CREATE TRIGGER set_timestamp_nutrition_logs
BEFORE UPDATE ON nutrition_logs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();