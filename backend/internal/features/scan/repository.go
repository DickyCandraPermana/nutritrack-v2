package scan

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
	db "nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type Repository interface {
	// Ubah db.ScanHistory menjadi db.CreateScanHistoryRow
	CreateScan(ctx context.Context, arg db.CreateScanHistoryParams) (db.CreateScanHistoryRow, error)
	UpdateScan(ctx context.Context, arg db.UpdateScanParams) error
	GetScanById(ctx context.Context, id pgtype.UUID) (db.GetScanByIdRow, error)
}

type repository struct {
	q *db.Queries
}

func NewRepository(q *db.Queries) Repository {
	return &repository{q: q}
}

// Ubah db.ScanHistory menjadi db.CreateScanHistoryRow
func (r *repository) CreateScan(ctx context.Context, arg db.CreateScanHistoryParams) (db.CreateScanHistoryRow, error) {
	return r.q.CreateScanHistory(ctx, arg)
}

func (r *repository) UpdateScan(ctx context.Context, arg db.UpdateScanParams) error {
	return r.q.UpdateScan(ctx, arg)
}

func (r *repository) GetScanById(ctx context.Context, id pgtype.UUID) (db.GetScanByIdRow, error) {
	return r.q.GetScanById(ctx, id)
}
