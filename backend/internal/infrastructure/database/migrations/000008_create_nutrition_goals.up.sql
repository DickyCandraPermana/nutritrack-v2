CREATE TABLE IF NOT EXISTS nutrition_goals (
    id bigserial PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Target daily calories untuk periode ini
    daily_target_calories numeric(10,2) NOT NULL,
    -- Periode goal berlaku
    start_date date NOT NULL,
    end_date date, -- NULL = ongoing indefinitely
    -- Tipe goal untuk tracking purposes
    goal_type varchar(50) NOT NULL DEFAULT 'maintenance', -- 'weight_loss', 'muscle_gain', 'maintenance'
    -- Metadata
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    deleted_at timestamp(0) with time zone,
    -- Constraint untuk consistency
    CHECK (daily_target_calories > 0),
    CHECK (start_date <= end_date OR end_date IS NULL)
);

-- Index untuk query active goal per user
CREATE INDEX idx_nutrition_goals_user_active 
ON nutrition_goals (user_id, start_date, end_date) 
WHERE deleted_at IS NULL;
