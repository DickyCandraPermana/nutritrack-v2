package user

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
	"nutritrack.com/backend/internal/domain"
	"nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type Service interface {
	GetPaginated(ctx context.Context, size, page int32) ([]sqlc.GetPaginatedUsersRow, error)
	UpdateAvatar(ctx context.Context, userID int64, avatarURL string) error
	UpdatePassword(ctx context.Context, userID int64, input domain.UpdatePasswordInput) error
}

type userService struct {
	queries *sqlc.Queries
}

func NewService(queries *sqlc.Queries) Service {
	return &userService{
		queries: queries,
	}
}

func (s *userService) GetPaginated(ctx context.Context, size, page int32) ([]sqlc.GetPaginatedUsersRow, error) {
	if page < 1 {
		page = 1
	}
	if size < 1 || size > 100 {
		size = 10
	}
	offset := (page - 1) * size

	return s.queries.GetPaginatedUsers(ctx, sqlc.GetPaginatedUsersParams{
		Limit:  size,
		Offset: offset,
	})
}

func (s *userService) UpdateAvatar(ctx context.Context, userID int64, avatarURL string) error {
	_, err := s.queries.UpdateUserAvatar(ctx, sqlc.UpdateUserAvatarParams{
		ID:     userID,
		Avatar: pgtype.Text{String: avatarURL, Valid: true},
	})
	return err
}

func (s *userService) UpdatePassword(ctx context.Context, userID int64, input domain.UpdatePasswordInput) error {
	// Di sini harusnya ada logic bcrypt dan validasi OldPassword
	// Untuk sekarang langsung bypass untuk mengupdate
	// TODO: implement bcrypt
	newHash := []byte(input.NewPassword) // Mock hashing
	_, err := s.queries.UpdateUserPassword(ctx, sqlc.UpdateUserPasswordParams{
		ID:       userID,
		Password: newHash,
	})
	return err
}
