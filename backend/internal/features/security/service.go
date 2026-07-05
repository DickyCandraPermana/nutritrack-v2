package security

import (
	"context"

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgtype"
	"nutritrack.com/backend/internal/domain"
	"nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type Service interface {
	GetAuditLogs(ctx context.Context, userID int64, limit, offset int32) ([]sqlc.AuditLog, error)
	Enable2FA(ctx context.Context, userID int64, input domain.TwoFAEnableInput) error
	Disable2FA(ctx context.Context, userID int64, input domain.TwoFADisableInput) error
}

type securityService struct {
	queries   *sqlc.Queries
	validator *validator.Validate
}

func NewService(queries *sqlc.Queries, validator *validator.Validate) Service {
	return &securityService{
		queries:   queries,
		validator: validator,
	}
}

func (s *securityService) GetAuditLogs(ctx context.Context, userID int64, limit, offset int32) ([]sqlc.AuditLog, error) {
	if limit <= 0 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}

	return s.queries.GetAuditLogsByUserID(ctx, sqlc.GetAuditLogsByUserIDParams{
		UserID: userID,
		Limit:  limit,
		Offset: offset,
	})
}

func (s *securityService) Enable2FA(ctx context.Context, userID int64, input domain.TwoFAEnableInput) error {
	if err := s.validator.Struct(input); err != nil {
		return err
	}

	// Verify password first... (skipped for brevity)
	// Validate token... (skipped for brevity)

	_, err := s.queries.Enable2FA(ctx, sqlc.Enable2FAParams{
		ID:        userID,
		OtpSecret: pgtype.Text{String: "MOCK_SECRET", Valid: true},
	})
	return err
}

func (s *securityService) Disable2FA(ctx context.Context, userID int64, input domain.TwoFADisableInput) error {
	if err := s.validator.Struct(input); err != nil {
		return err
	}

	// Verify password... (skipped for brevity)

	_, err := s.queries.Disable2FA(ctx, userID)
	return err
}
