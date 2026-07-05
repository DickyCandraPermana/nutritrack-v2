package diary

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
	GetSummary(ctx context.Context, userID int64, date time.Time) (*domain.DailySummary, error)
	GetEntries(ctx context.Context, userID int64, date time.Time) ([]sqlc.GetDiaryEntriesRow, error)
	CreateEntry(ctx context.Context, input domain.DiaryCreateInput) (sqlc.CreateDiaryEntryRow, error)
	UpdateEntry(ctx context.Context, userID int64, input domain.DiaryUpdateInput) error
	DeleteEntry(ctx context.Context, userID int64, entryID int64) error
}

type diaryService struct {
	queries   *sqlc.Queries
	validator *validator.Validate
}

func NewService(queries *sqlc.Queries, validator *validator.Validate) Service {
	return &diaryService{
		queries:   queries,
		validator: validator,
	}
}

func (s *diaryService) GetSummary(ctx context.Context, userID int64, date time.Time) (*domain.DailySummary, error) {
	// Ambil summary makro & kalori
	summaryRow, err := s.queries.GetDiarySummary(ctx, sqlc.GetDiarySummaryParams{
		UserID:     userID,
		ConsumedAt: pgtype.Timestamptz{Time: date, Valid: true},
	})
	if err != nil {
		return nil, err
	}

	// Ambil daftar makanan hari ini
	entries, err := s.queries.GetDiaryEntries(ctx, sqlc.GetDiaryEntriesParams{
		UserID:     userID,
		ConsumedAt: pgtype.Timestamptz{Time: date, Valid: true},
	})
	if err != nil {
		return nil, err
	}

	var parsedEntries []domain.FoodDiary
	for _, e := range entries {
		parsedEntries = append(parsedEntries, domain.FoodDiary{
			ID:             e.ID,
			AmountConsumed: helper.NumericToFloat64(e.AmountConsumed),
			ConsumedAt:     e.ConsumedAt.Time,
			MealType:       e.MealType.String,
			FoodName:       &e.FoodName,
		})
	}

	return &domain.DailySummary{
		TotalCalories: summaryRow.TotalCalories,
		TotalProtein:  summaryRow.TotalProtein,
		TotalCarbs:    summaryRow.TotalCarbs,
		TotalFat:      summaryRow.TotalFat,
		Entries:       parsedEntries,
	}, nil
}

func (s *diaryService) GetEntries(ctx context.Context, userID int64, date time.Time) ([]sqlc.GetDiaryEntriesRow, error) {
	return s.queries.GetDiaryEntries(ctx, sqlc.GetDiaryEntriesParams{
		UserID:     userID,
		ConsumedAt: pgtype.Timestamptz{Time: date, Valid: true},
	})
}

func (s *diaryService) CreateEntry(ctx context.Context, input domain.DiaryCreateInput) (sqlc.CreateDiaryEntryRow, error) {
	if err := s.validator.Struct(input); err != nil {
		return sqlc.CreateDiaryEntryRow{}, err
	}

	return s.queries.CreateDiaryEntry(ctx, sqlc.CreateDiaryEntryParams{
		UserID:         input.UserID,
		FoodID:         input.FoodID,
		AmountConsumed: helper.Float64ToNumeric(input.AmountConsumed),
		ConsumedAt:     pgtype.Timestamptz{Time: input.ConsumedAt, Valid: true},
		MealType:       pgtype.Text{String: input.MealType, Valid: true},
	})
}

func (s *diaryService) UpdateEntry(ctx context.Context, userID int64, input domain.DiaryUpdateInput) error {
	if err := s.validator.Struct(input); err != nil {
		return err
	}

	// Verify kepemilikan diary
	diary, err := s.queries.GetUserDiaryEntry(ctx, sqlc.GetUserDiaryEntryParams{
		ID:     input.ID,
		UserID: userID,
	})
	if err != nil {
		return err
	}

	params := sqlc.UpdateDiaryEntryParams{
		ID:             input.ID,
		FoodID:         diary.FoodID,
		AmountConsumed: diary.AmountConsumed,
		ConsumedAt:     diary.ConsumedAt,
		MealType:       diary.MealType,
	}

	if input.AmountConsumed != nil {
		params.AmountConsumed = helper.Float64ToNumeric(*input.AmountConsumed)
	}
	if input.ConsumedAt != nil {
		params.ConsumedAt = pgtype.Timestamptz{Time: *input.ConsumedAt, Valid: true}
	}
	if input.MealType != nil {
		params.MealType = pgtype.Text{String: *input.MealType, Valid: true}
	}

	_, err = s.queries.UpdateDiaryEntry(ctx, params)
	return err
}

func (s *diaryService) DeleteEntry(ctx context.Context, userID int64, entryID int64) error {
	// Verify kepemilikan
	_, err := s.queries.GetUserDiaryEntry(ctx, sqlc.GetUserDiaryEntryParams{
		ID:     entryID,
		UserID: userID,
	})
	if err != nil {
		return err
	}

	_, err = s.queries.DeleteDiaryEntry(ctx, entryID)
	return err
}
