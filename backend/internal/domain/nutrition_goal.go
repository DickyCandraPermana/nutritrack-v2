package domain

import "time"

// GoalType merepresentasikan tipe nutrition goal
type GoalType string

const (
	GoalTypeWeightLoss  GoalType = "weight_loss"
	GoalTypeMuscleGain  GoalType = "muscle_gain"
	GoalTypeMaintenance GoalType = "maintenance"
)

// NutritionGoal merepresentasikan target nutrisi user
type NutritionGoal struct {
	ID                  int64      `db:"id"`
	UserID              int64      `db:"user_id"`
	DailyTargetCalories float64    `db:"daily_target_calories"`
	StartDate           time.Time  `db:"start_date"`
	EndDate             *time.Time `db:"end_date"`
	GoalType            GoalType   `db:"goal_type"`
	CreatedAt           time.Time  `db:"created_at"`
	UpdatedAt           time.Time  `db:"updated_at"`
	DeletedAt           *time.Time `db:"deleted_at"`
}

// CreateNutritionGoalInput input untuk membuat goal baru
type CreateNutritionGoalInput struct {
	DailyTargetCalories float64    `json:"daily_target_calories" validate:"required,gt=0"`
	StartDate           time.Time  `json:"start_date" validate:"required"`
	EndDate             *time.Time `json:"end_date"`
	GoalType            GoalType   `json:"goal_type" validate:"required"`
}

// UpdateNutritionGoalInput input untuk update goal
type UpdateNutritionGoalInput struct {
	DailyTargetCalories *float64   `json:"daily_target_calories"`
	StartDate           *time.Time `json:"start_date"`
	EndDate             *time.Time `json:"end_date"`
	GoalType            *GoalType  `json:"goal_type"`
}

// GetGoalInput untuk query goal
type GetGoalInput struct {
	UserID int64
	Date   *time.Time // Jika disediakan, cari goal yang active di tanggal tersebut
}

// IsActive mengecek apakah goal active di hari ini
func (g *NutritionGoal) IsActive(date time.Time) bool {
	if g.DeletedAt != nil {
		return false
	}
	if date.Before(g.StartDate) {
		return false
	}
	if g.EndDate != nil && date.After(*g.EndDate) {
		return false
	}
	return true
}
