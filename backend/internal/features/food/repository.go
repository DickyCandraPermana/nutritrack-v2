package food

import (
	"context"
	"github.com/jackc/pgx/v5/pgtype"
	"nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type Repository interface {
	CreateFood(ctx context.Context, arg sqlc.CreateFoodParams) (sqlc.Food, error)
	GetFood(ctx context.Context, id pgtype.UUID) (sqlc.Food, error)
	ListFoods(ctx context.Context, arg sqlc.ListFoodsParams) ([]sqlc.ListFoodsRow, error)
}

type repository struct {
	queries *sqlc.Queries
}

func NewRepository(q *sqlc.Queries) Repository {
	return &repository{queries: q}
}

func (r *repository) CreateFood(ctx context.Context, arg sqlc.CreateFoodParams) (sqlc.Food, error) {
	return r.queries.CreateFood(ctx, arg)
}

func (r *repository) GetFood(ctx context.Context, id pgtype.UUID) (sqlc.Food, error) {
	return r.queries.GetFood(ctx, id)
}

func (r *repository) ListFoods(ctx context.Context, arg sqlc.ListFoodsParams) ([]sqlc.ListFoodsRow, error) {
	return r.queries.ListFoods(ctx, arg)
}
