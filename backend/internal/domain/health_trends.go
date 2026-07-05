package domain

import "time"

// DailyNutrition merepresentasikan agregase nutrisi per hari
type DailyNutrition struct {
	Date          time.Time
	TotalCalories float64
	Protein       float64
	Carbs         float64
	Fat           float64
	EntryCount    int
	DailyTarget   *float64 // Dari goal jika ada
	DeltaCalories float64  // Actual - target (bisa negative)
}

// HealthTrend merepresentasikan satu data point dalam trend
type HealthTrend struct {
	Date           time.Time
	CalorieIntake  float64
	CaloriesBurned float64 // Dari TDEE calculation
	NetCalories    float64 // Intake - Burned
	Protein        float64
	Carbs          float64
	Fat            float64
	Weight         *float64 // Opsional jika user input weight
}

// TrendSummary merepresentasikan analisis trend untuk periode
type TrendSummary struct {
	PeriodDays           int              `json:"period_days"`
	StartDate            time.Time        `json:"start_date"`
	EndDate              time.Time        `json:"end_date"`
	TotalCalories        float64          `json:"total_calories"`
	AverageDailyCalories float64          `json:"average_daily_calories"`
	MinCalories          float64          `json:"min_calories"`
	MaxCalories          float64          `json:"max_calories"`
	TrendSlope           float64          `json:"trend_slope"`     // Linear regression slope
	TrendDirection       string           `json:"trend_direction"` // "increasing", "decreasing", "stable"
	GoalProgress         *GoalProgress    `json:"goal_progress,omitempty"`
	DailyBreakdown       []DailyNutrition `json:"daily_breakdown"` // Day-by-day details
}

// GoalProgress merepresentasikan progress terhadap goal
type GoalProgress struct {
	AverageVsTarget float64 `json:"average_vs_target"` // Actual average dibanding target
	DaysOnTarget    int     `json:"days_on_target"`    // Berapa hari within target ±10%
	DaysAboveTarget int     `json:"days_above_target"`
	DaysBelowTarget int     `json:"days_below_target"`
	TargetCalories  float64 `json:"target_calories"`  // Daily target
	VariancePercent float64 `json:"variance_percent"` // Persentase deviation
}

// MacroTrendSummary untuk macro breakdown trend
type MacroTrendSummary struct {
	PeriodDays     int     `json:"period_days"`
	AverageProtein float64 `json:"average_protein"`
	AverageCarbs   float64 `json:"average_carbs"`
	AverageFat     float64 `json:"average_fat"`
	ProteinPercent float64 `json:"protein_percent"` // % of total calories
	CarbsPercent   float64 `json:"carbs_percent"`
	FatPercent     float64 `json:"fat_percent"`
	Recommendation string  `json:"recommendation"` // e.g., "Balanced", "High protein", etc.
}

// CalculateTrendSlope menghitung linear regression slope
// slope positif = increasing trend, negatif = decreasing
func CalculateTrendSlope(values []float64) float64 {
	if len(values) < 2 {
		return 0
	}

	n := float64(len(values))
	var sumX, sumY, sumXY, sumX2 float64

	for i, v := range values {
		x := float64(i)
		sumX += x
		sumY += v
		sumXY += x * v
		sumX2 += x * x
	}

	// y = mx + b; m = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX)
	numerator := n*sumXY - sumX*sumY
	denominator := n*sumX2 - sumX*sumX

	if denominator == 0 {
		return 0
	}

	return numerator / denominator
}

// ClassifyTrend mengklasifikasikan trend berdasarkan slope
func ClassifyTrend(slope float64) string {
	if slope > 100 {
		return "increasing"
	} else if slope < -100 {
		return "decreasing"
	}
	return "stable"
}
