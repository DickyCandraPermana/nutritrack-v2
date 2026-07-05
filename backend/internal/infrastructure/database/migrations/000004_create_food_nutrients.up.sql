CREATE TABLE IF NOT EXISTS food_nutrients (
    food_id bigint REFERENCES foods(id) ON DELETE CASCADE,
    nutrient_id bigint REFERENCES nutrients(id) ON DELETE CASCADE,
    amount numeric(10,2) NOT NULL,
    PRIMARY KEY (food_id, nutrient_id)
);