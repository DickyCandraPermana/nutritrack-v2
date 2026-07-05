CREATE TABLE IF NOT EXISTS foods(
  id bigserial PRIMARY KEY,
  name varchar(255) NOT NULL,
  description text,
  serving_size numeric(10,2) NOT NULL DEFAULT 100,
  serving_unit varchar(50) NOT NULL DEFAULT 'g',
  created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
  deleted_at timestamp(0) with time zone
)