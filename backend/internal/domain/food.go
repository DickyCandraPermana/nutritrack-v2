package domain

type Food struct {
	ID          int64            `db:"id" json:"id"`
	Name        string           `db:"name" json:"name"`
	Description string           `db:"description" json:"description"`
	ServingSize *float64         `db:"serving_size" json:"serving_size"`
	ServingUnit *string          `db:"serving_unit" json:"serving_unit"`
	Nutrients   []NutrientAmount `json:"nutrients"`
	CreatedAt   string           `db:"created_at" json:"created_at"`
	UpdatedAt   string           `db:"updated_at" json:"updated_at"`
}

type NutrientAmount struct {
	ID     int64   `db:"id" json:"id"`
	Name   string  `db:"name" json:"name"`
	Unit   string  `db:"unit" json:"unit"`
	Amount float64 `db:"amount" json:"amount"`
}

type FoodFilter struct {
	Query       string
	MinCalories float64
	MaxCalories float64
	Limit       int
	Offset      int
}

type CreateFoodInput struct {
	Name        string   `validate:"required"`
	Description string   `validate:"omitempty"`
	ServingSize *float64 `validate:"omitempty"`
	ServingUnit *string  `validate:"omitempty"`
	Nutrients   []struct {
		ID     int64   `validate:"required"`
		Name   string  `validate:"required"`
		Unit   string  `validate:"required"`
		Amount float64 `validate:"required"`
	} `validate:"omitempty"`
}

type UpdateFoodInput struct {
	Name        *string
	Description *string
	ServingSize *float64
	ServingUnit *string
	Nutrients   *[]UpdateNutrientInput
}

type UpdateNutrientInput struct {
	ID     int64
	Amount float64
}
