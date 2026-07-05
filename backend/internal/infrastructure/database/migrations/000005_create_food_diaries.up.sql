CREATE TABLE IF NOT EXISTS food_diaries (
    id bigserial PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    food_id bigint NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
    -- Takaran yang dimakan user bisa beda dengan serving_size standar di tabel foods
    amount_consumed numeric(10,2) NOT NULL, -- misal: user makan 250g, padahal standar food 100g
    -- Kapan dimakan? Penting untuk tracking harian
    consumed_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    -- Metadata tambahan
    meal_type varchar(20), -- 'breakfast', 'lunch', 'dinner', 'snack'
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    deleted_at timestamp(0) with time zone
);

-- Index agar query harian cepat
CREATE INDEX idx_food_diaries_user_date ON food_diaries (user_id, consumed_at);