package domain

import "time"

type FoodDiary struct {
	ID             int64      `db:"id" json:"id"`
	UserID         int64      `db:"user_id" json:"user_id"`
	FoodID         int64      `db:"food_id" json:"food_id"`
	AmountConsumed float64    `db:"amount_consumed" json:"amount_consumed"`
	ConsumedAt     time.Time  `db:"consumed_at" json:"consumed_at"`
	MealType       string     `db:"meal_type" json:"meal_type"`
	FoodName       *string    `db:"food_name" json:"food_name,omitempty"`
	CreatedAt      *time.Time `db:"created_at" json:"created_at"`
	UpdatedAt      *time.Time `db:"updated_at" json:"updated_at"`
}

type DiaryCreateInput struct {
	UserID         int64     `validate:"required"`
	FoodID         int64     `validate:"required"`
	AmountConsumed float64   `validate:"required"`
	ConsumedAt     time.Time `validate:"required"`
	MealType       string    `validate:"required"`
}

type DiaryUpdateInput struct {
	ID             int64      `validate:"required"`
	AmountConsumed *float64   `validate:"omitempty"`
	ConsumedAt     *time.Time `validate:"omitempty"`
	MealType       *string    `validate:"omitempty"`
}

// Summary untuk Dashboard
type DailySummary struct {
	TotalCalories float64     `json:"total_calories"`
	TotalProtein  float64     `json:"total_protein"`
	TotalCarbs    float64     `json:"total_carbs"`
	TotalFat      float64     `json:"total_fat"`
	Entries       []FoodDiary `json:"entries"`
}

type UserHealthSum struct {
	Tdee          float64 `json:"tdee"`
	Bmi           string  `json:"bmi"`
	Bmr           float64 `json:"bmr"`
	ProteinNeeded float64 `json:"protein_needed"`
	CarbsNeeded   float64 `json:"carbs_needed"`
	FatNeeded     float64 `json:"fat_needed"`
}
