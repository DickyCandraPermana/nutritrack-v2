CREATE TABLE IF NOT EXISTS food_nutrients (
    food_id UUID REFERENCES foods(id) ON DELETE CASCADE,
    nutrient_id UUID REFERENCES nutrients(id) ON DELETE CASCADE,
    amount numeric(10,2) NOT NULL,
    PRIMARY KEY (food_id, nutrient_id)
);
