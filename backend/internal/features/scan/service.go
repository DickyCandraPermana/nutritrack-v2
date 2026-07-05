package scan

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"mime/multipart"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/minio/minio-go/v7"
	"nutritrack.com/backend/internal/helper"
	db "nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type WebhookPayload struct {
	TaskID        string `json:"task_id"`
	Status        string `json:"status"`
	ErrorMessage  string `json:"error_message,omitempty"`
	NutritionData struct {
		Name     string  `json:"name"`
		Calories float64 `json:"calories"`
		Protein  float64 `json:"protein"`
		Carbs    float64 `json:"carbs"`
		Fat      float64 `json:"fat"`
	} `json:"nutrition_data,omitempty"`
}

type Service interface {
	ProcessScan(ctx context.Context, file *multipart.FileHeader, userID int64) (string, error)
	HandleWebhook(ctx context.Context, payload WebhookPayload) error
	GetScanResult(ctx context.Context, taskID pgtype.UUID) (db.GetScanByIdRow, error)
}

type service struct {
	repo      Repository
	publisher Publisher
	minio     *minio.Client
	bucket    string
}

func NewService(repo Repository, publisher Publisher, minioClient *minio.Client, bucket string) Service {
	return &service{repo: repo, publisher: publisher, minio: minioClient, bucket: bucket}
}

func (s *service) ProcessScan(ctx context.Context, file *multipart.FileHeader, userID int64) (string, error) {
	// 1. Validasi Ukuran (Maks 2MB)
	if file.Size > 2*1024*1024 {
		return "", errors.New("ukuran file melebihi 2MB")
	}

	// 2. Buka file multipart
	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	// 3. Upload ke MinIO
	objectName := fmt.Sprintf("scans/%d-%s", userID, file.Filename)
	_, err = s.minio.PutObject(ctx, s.bucket, objectName, src, file.Size, minio.PutObjectOptions{
		ContentType: file.Header.Get("Content-Type"),
	})
	if err != nil {
		return "", err
	}
	// For MinIO local development, we need to provide a public URL or let the worker download it
	// assuming minio is exposed at localhost:9000
	imageURL := fmt.Sprintf("http://localhost:9000/%s/%s", s.bucket, objectName)

	// 4. Simpan DB (Status PENDING)
	scanRecord, err := s.repo.CreateScan(ctx, db.CreateScanHistoryParams{
		UserID: userID,
		ImgUrl: imageURL,
	})
	if err != nil {
		return "", err
	}

	// 5. Publish ke RabbitMQ
	taskID := helper.UUIDToString(scanRecord.ID)
	err = s.publisher.PublishOCRTask(ctx, taskID, imageURL)
	if err != nil {
		return "", err
	}

	return taskID, nil
}

func (s *service) HandleWebhook(ctx context.Context, payload WebhookPayload) error {
	taskUUID, err := helper.StringToUUID(payload.TaskID)
	if err != nil {
		return err
	}

	status := db.NullScanStatus{ScanStatus: db.ScanStatus(payload.Status), Valid: true}
	if payload.Status == "" {
		status = db.NullScanStatus{ScanStatus: db.ScanStatusFailed, Valid: true}
	}

	var errorMsg pgtype.Text
	if payload.ErrorMessage != "" {
		errorMsg = pgtype.Text{String: payload.ErrorMessage, Valid: true}
	}
	
	var nutritionBytes []byte
	if payload.Status == "COMPLETED" {
		nutritionBytes, _ = json.Marshal(payload.NutritionData)
	}

	// Update status scan history
	err = s.repo.UpdateScan(ctx, db.UpdateScanParams{
		ID:           taskUUID,
		Status:       status,
		ErrorMessage: errorMsg,
		NutritionData: nutritionBytes,
	})
	return err
}

func (s *service) GetScanResult(ctx context.Context, taskID pgtype.UUID) (db.GetScanByIdRow, error) {
	return s.repo.GetScanById(ctx, taskID)
}
