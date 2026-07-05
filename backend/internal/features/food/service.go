package food

import (
	"context"

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgtype"
	"nutritrack.com/backend/internal/domain"
	"nutritrack.com/backend/internal/helper"
	"nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type Service interface {
	Search(ctx context.Context, filter domain.FoodFilter) ([]domain.Food, error)
	GetByID(ctx context.Context, id int64) (*domain.Food, error)
	Create(ctx context.Context, input domain.CreateFoodInput) (*domain.Food, error)
	Update(ctx context.Context, id int64, input domain.UpdateFoodInput) error
	Delete(ctx context.Context, id int64) error
}

type foodService struct {
	queries   *sqlc.Queries
	validator *validator.Validate
}

func NewService(queries *sqlc.Queries, validator *validator.Validate) Service {
	return &foodService{
		queries:   queries,
		validator: validator,
	}
}

func (s *foodService) Search(ctx context.Context, filter domain.FoodFilter) ([]domain.Food, error) {
	var searchQuery pgtype.Text
	if filter.Query != "" {
		searchQuery = pgtype.Text{String: filter.Query, Valid: true}
	}

	rows, err := s.queries.SearchFoods(ctx, sqlc.SearchFoodsParams{
		Query:  searchQuery,
		Limit:  int32(filter.Limit),
		Offset: int32(filter.Offset),
	})
	if err != nil {
		return nil, err
	}

	var foods []domain.Food
	for _, r := range rows {
		foods = append(foods, domain.Food{
			ID:          r.ID,
			Name:        r.Name,
			Description: r.Description.String,
			ServingSize: helper.NumericToFloat64Ptr(r.ServingSize),
			ServingUnit: &r.ServingUnit,
		})
	}

	// Actually we should fetch nutrients for each, but we simplify it here
	// as SearchFoods usually returns basic data.
	return foods, nil
}

func (s *foodService) GetByID(ctx context.Context, id int64) (*domain.Food, error) {
	rows, err := s.queries.GetFoodByID(ctx, id)
	if err != nil || len(rows) == 0 {
		return nil, domain.ErrNotFound
	}

	food := &domain.Food{
		ID:          rows[0].ID,
		Name:        rows[0].Name,
		Description: rows[0].Description.String,
		ServingSize: helper.NumericToFloat64Ptr(rows[0].ServingSize),
		ServingUnit: &rows[0].ServingUnit,
	}

	for _, r := range rows {
		if r.NutrientID.Valid {
			food.Nutrients = append(food.Nutrients, domain.NutrientAmount{
				ID:     r.NutrientID.Int64,
				Name:   r.NutrientName.String,
				Unit:   r.Unit.String,
				Amount: helper.NumericToFloat64(r.Amount),
			})
		}
	}

	return food, nil
}

func (s *foodService) Create(ctx context.Context, input domain.CreateFoodInput) (*domain.Food, error) {
	if err := s.validator.Struct(input); err != nil {
		return nil, err
	}

	params := sqlc.CreateFoodParams{
		Name:        input.Name,
		Description: pgtype.Text{String: input.Description, Valid: input.Description != ""},
		ServingSize: helper.Float64PtrToNumeric(input.ServingSize),
	}
	if input.ServingUnit != nil {
		params.ServingUnit = *input.ServingUnit
	}

	res, err := s.queries.CreateFood(ctx, params)
	if err != nil {
		return nil, err
	}

	if len(input.Nutrients) > 0 {
		for _, n := range input.Nutrients {
			_ = s.queries.CreateFoodNutrient(ctx, sqlc.CreateFoodNutrientParams{
				FoodID:     res.ID,
				NutrientID: n.ID,
				Amount:     helper.Float64ToNumeric(n.Amount),
			})
		}
	}

	return s.GetByID(ctx, res.ID)
}

func (s *foodService) Update(ctx context.Context, id int64, input domain.UpdateFoodInput) error {
	existing, err := s.GetByID(ctx, id)
	if err != nil {
		return err
	}

	params := sqlc.UpdateFoodParams{
		ID:          id,
		Name:        existing.Name,
		Description: pgtype.Text{String: existing.Description, Valid: existing.Description != ""},
		ServingSize: helper.Float64PtrToNumeric(existing.ServingSize),
	}
	if existing.ServingUnit != nil {
		params.ServingUnit = *existing.ServingUnit
	}

	if input.Name != nil {
		params.Name = *input.Name
	}
	if input.Description != nil {
		params.Description = pgtype.Text{String: *input.Description, Valid: true}
	}
	if input.ServingSize != nil {
		params.ServingSize = helper.Float64PtrToNumeric(input.ServingSize)
	}
	if input.ServingUnit != nil {
		params.ServingUnit = *input.ServingUnit
	}

	if _, err := s.queries.UpdateFood(ctx, params); err != nil {
		return err
	}

	if input.Nutrients != nil {
		_, _ = s.queries.DeleteFoodNutrients(ctx, id)
		for _, n := range *input.Nutrients {
			_ = s.queries.CreateFoodNutrient(ctx, sqlc.CreateFoodNutrientParams{
				FoodID:     id,
				NutrientID: n.ID,
				Amount:     helper.Float64ToNumeric(n.Amount),
			})
		}
	}

	return nil
}

func (s *foodService) Delete(ctx context.Context, id int64) error {
	_, err := s.queries.DeleteFood(ctx, id)
	return err
}
