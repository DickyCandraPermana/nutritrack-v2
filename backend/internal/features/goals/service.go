package goals

import (
	"context"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgtype"
	"nutritrack.com/backend/internal/domain"
	"nutritrack.com/backend/internal/helper"
	"nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type Service interface {
	CreateGoal(ctx context.Context, userID int64, input domain.CreateNutritionGoalInput) (sqlc.NutritionGoal, error)
	GetActiveGoal(ctx context.Context, userID int64) (sqlc.NutritionGoal, error)
	GetAllGoals(ctx context.Context, userID int64) ([]sqlc.NutritionGoal, error)
	UpdateGoal(ctx context.Context, userID int64, goalID int64, input domain.UpdateNutritionGoalInput) error
	DeleteGoal(ctx context.Context, userID int64, goalID int64) error
}

type goalsService struct {
	queries   *sqlc.Queries
	validator *validator.Validate
}

func NewService(queries *sqlc.Queries, validator *validator.Validate) Service {
	return &goalsService{
		queries:   queries,
		validator: validator,
	}
}

func (s *goalsService) CreateGoal(ctx context.Context, userID int64, input domain.CreateNutritionGoalInput) (sqlc.NutritionGoal, error) {
	if err := s.validator.Struct(input); err != nil {
		return sqlc.NutritionGoal{}, err
	}

	params := sqlc.CreateGoalParams{
		UserID:              userID,
		DailyTargetCalories: helper.Float64ToNumeric(input.DailyTargetCalories),
		StartDate:           input.StartDate,
		GoalType:            string(input.GoalType),
	}

	if input.EndDate != nil {
		params.EndDate = pgtype.Date{Time: *input.EndDate, Valid: true}
	}

	res, err := s.queries.CreateGoal(ctx, params)
	if err != nil {
		return sqlc.NutritionGoal{}, err
	}
	
	// Refetch to return full object
	return s.queries.GetGoalByID(ctx, res.ID)
}

func (s *goalsService) GetActiveGoal(ctx context.Context, userID int64) (sqlc.NutritionGoal, error) {
	return s.queries.GetActiveGoalByUser(ctx, sqlc.GetActiveGoalByUserParams{
		UserID:    userID,
		StartDate: time.Now(),
	})
}

func (s *goalsService) GetAllGoals(ctx context.Context, userID int64) ([]sqlc.NutritionGoal, error) {
	return s.queries.GetAllGoalsByUser(ctx, userID)
}

func (s *goalsService) UpdateGoal(ctx context.Context, userID int64, goalID int64, input domain.UpdateNutritionGoalInput) error {
	if err := s.validator.Struct(input); err != nil {
		return err
	}

	// Verify ownership
	existing, err := s.queries.GetGoalByID(ctx, goalID)
	if err != nil {
		return err
	}
	if existing.UserID != userID {
		return domain.ErrUnauthorized
	}

	params := sqlc.UpdateGoalParams{
		ID:                  goalID,
		DailyTargetCalories: existing.DailyTargetCalories,
		StartDate:           existing.StartDate,
		EndDate:             existing.EndDate,
		GoalType:            existing.GoalType,
	}

	if input.DailyTargetCalories != nil {
		params.DailyTargetCalories = helper.Float64ToNumeric(*input.DailyTargetCalories)
	}
	if input.StartDate != nil {
		params.StartDate = *input.StartDate
	}
	if input.EndDate != nil {
		params.EndDate = pgtype.Date{Time: *input.EndDate, Valid: true}
	}
	if input.GoalType != nil {
		params.GoalType = string(*input.GoalType)
	}

	_, err = s.queries.UpdateGoal(ctx, params)
	return err
}

func (s *goalsService) DeleteGoal(ctx context.Context, userID int64, goalID int64) error {
	existing, err := s.queries.GetGoalByID(ctx, goalID)
	if err != nil {
		return err
	}
	if existing.UserID != userID {
		return domain.ErrUnauthorized
	}

	_, err = s.queries.DeleteGoal(ctx, goalID)
	return err
}
