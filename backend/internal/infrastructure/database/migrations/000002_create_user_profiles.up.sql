CREATE TYPE user_gender AS ENUM (
  'male',
  'female'
);

CREATE TYPE activity_level_type AS ENUM (
  'sedentary',
  'light',
  'moderate',
  'active',
  'very_active'
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  weight NUMERIC(5, 2),
  height NUMERIC(5, 2),
  gender user_gender,
  activity_level activity_level_type DEFAULT 'sedentary',

  user_id UUID NOT NULL,

  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  deleted_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT fk_profile_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE UNIQUE INDEX profile_user_unique_active
ON profiles(user_id)
WHERE deleted_at IS NULL;

CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();