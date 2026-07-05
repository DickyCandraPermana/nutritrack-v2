package food

import (
	"context"
	"github.com/jackc/pgx/v5/pgtype"
	"nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type Service interface {
	CreateFood(ctx context.Context, arg sqlc.CreateFoodParams) (sqlc.Food, error)
	GetFood(ctx context.Context, id string) (sqlc.Food, error)
	ListFoods(ctx context.Context, name string, limit, offset int32) ([]sqlc.ListFoodsRow, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) CreateFood(ctx context.Context, arg sqlc.CreateFoodParams) (sqlc.Food, error) {
	return s.repo.CreateFood(ctx, arg)
}

func (s *service) GetFood(ctx context.Context, id string) (sqlc.Food, error) {
	var uuid pgtype.UUID
	err := uuid.Scan(id)
	if err != nil {
		return sqlc.Food{}, err
	}
	return s.repo.GetFood(ctx, uuid)
}

func (s *service) ListFoods(ctx context.Context, name string, limit, offset int32) ([]sqlc.ListFoodsRow, error) {
	return s.repo.ListFoods(ctx, sqlc.ListFoodsParams{
		Name:   name,
		Limit:  limit,
		Offset: offset,
	})
}
