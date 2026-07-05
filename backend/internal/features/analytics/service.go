package analytics

import (
	"context"
	"math"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"nutritrack.com/backend/internal/domain"
	"nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type Service interface {
	GetCaloriesTrend(ctx context.Context, userID int64, days int) (*domain.TrendSummary, error)
	GetMacroTrend(ctx context.Context, userID int64, days int) (*domain.MacroTrendSummary, error)
}

type analyticsService struct {
	queries *sqlc.Queries
}

func NewService(queries *sqlc.Queries) Service {
	return &analyticsService{
		queries: queries,
	}
}

func (s *analyticsService) GetCaloriesTrend(ctx context.Context, userID int64, days int) (*domain.TrendSummary, error) {
	endDate := time.Now()
	startDate := endDate.AddDate(0, 0, -days+1)

	rows, err := s.queries.GetDailyNutritionByRange(ctx, sqlc.GetDailyNutritionByRangeParams{
		UserID:       userID,
		ConsumedAt:   pgtype.Timestamptz{Time: startDate, Valid: true},
		ConsumedAt_2: pgtype.Timestamptz{Time: endDate, Valid: true},
	})
	if err != nil {
		return nil, err
	}

	dailyNutr := make(map[time.Time]*domain.DailyNutrition)
	for _, r := range rows {
		dailyNutr[r.Date] = &domain.DailyNutrition{
			Date:          r.Date,
			TotalCalories: r.TotalCalories,
			Protein:       r.Protein,
			Carbs:         r.Carbs,
			Fat:           r.Fat,
			EntryCount:    int(r.EntryCount),
		}
	}

	var allDates []time.Time
	for d := startDate; !d.After(endDate); d = d.AddDate(0, 0, 1) {
		allDates = append(allDates, d)
	}

	var (
		totalCalories  float64
		minCalories    = math.MaxFloat64
		maxCalories    = 0.0
		calorieValues  []float64
		dailyBreakdown []domain.DailyNutrition
	)

	for _, date := range allDates {
		daily := dailyNutr[date]
		if daily == nil {
			daily = &domain.DailyNutrition{Date: date, TotalCalories: 0}
		}

		dailyBreakdown = append(dailyBreakdown, *daily)
		calorieValues = append(calorieValues, daily.TotalCalories)

		totalCalories += daily.TotalCalories
		if daily.TotalCalories > 0 {
			if daily.TotalCalories < minCalories {
				minCalories = daily.TotalCalories
			}
			if daily.TotalCalories > maxCalories {
				maxCalories = daily.TotalCalories
			}
		}
	}

	if minCalories == math.MaxFloat64 {
		minCalories = 0
	}

	avgDaily := totalCalories / float64(len(allDates))
	slope := domain.CalculateTrendSlope(calorieValues)

	return &domain.TrendSummary{
		PeriodDays:           days,
		StartDate:            startDate,
		EndDate:              endDate,
		TotalCalories:        totalCalories,
		AverageDailyCalories: avgDaily,
		MinCalories:          minCalories,
		MaxCalories:          maxCalories,
		TrendSlope:           slope,
		TrendDirection:       domain.ClassifyTrend(slope),
		DailyBreakdown:       dailyBreakdown,
	}, nil
}

func (s *analyticsService) GetMacroTrend(ctx context.Context, userID int64, days int) (*domain.MacroTrendSummary, error) {
	endDate := time.Now()
	startDate := endDate.AddDate(0, 0, -days+1)

	rows, err := s.queries.GetDailyNutritionByRange(ctx, sqlc.GetDailyNutritionByRangeParams{
		UserID:       userID,
		ConsumedAt:   pgtype.Timestamptz{Time: startDate, Valid: true},
		ConsumedAt_2: pgtype.Timestamptz{Time: endDate, Valid: true},
	})
	if err != nil {
		return nil, err
	}

	var (
		totalProtein  float64
		totalCarbs    float64
		totalFat      float64
		totalCalories float64
		daysWithData  int
	)

	for _, r := range rows {
		if r.EntryCount > 0 {
			totalProtein += r.Protein
			totalCarbs += r.Carbs
			totalFat += r.Fat
			totalCalories += r.TotalCalories
			daysWithData++
		}
	}

	if daysWithData == 0 {
		return &domain.MacroTrendSummary{
			PeriodDays: days,
		}, nil
	}

	avgProtein := totalProtein / float64(daysWithData)
	avgCarbs := totalCarbs / float64(daysWithData)
	avgFat := totalFat / float64(daysWithData)

	if totalCalories > 0 {
		proteinCals := avgProtein * 4
		carbsCals := avgCarbs * 4
		fatCals := avgFat * 9
		totalMacroCals := proteinCals + carbsCals + fatCals

		return &domain.MacroTrendSummary{
			PeriodDays:     days,
			AverageProtein: avgProtein,
			AverageCarbs:   avgCarbs,
			AverageFat:     avgFat,
			ProteinPercent: (proteinCals / totalMacroCals) * 100,
			CarbsPercent:   (carbsCals / totalMacroCals) * 100,
			FatPercent:     (fatCals / totalMacroCals) * 100,
		}, nil
	}

	return &domain.MacroTrendSummary{
		PeriodDays:     days,
		AverageProtein: avgProtein,
		AverageCarbs:   avgCarbs,
		AverageFat:     avgFat,
	}, nil
}
