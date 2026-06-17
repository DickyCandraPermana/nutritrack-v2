package scan

import (
	"context"
	"errors"
	"fmt"
	"mime/multipart"

	"github.com/minio/minio-go/v7"
	db "nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type WebhookPayload struct {
	TaskID        string `json:"task_id"`
	Status        string `json:"status"`
	NutritionData struct {
		Calories float64 `json:"calories"`
		Protein  float64 `json:"protein"`
	} `json:"nutrition_data"`
}

type Service interface {
	ProcessScan(ctx context.Context, file *multipart.FileHeader, userID string) (string, error)
	HandleWebhook(ctx context.Context, payload WebhookPayload) error
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

func (s *service) ProcessScan(ctx context.Context, file *multipart.FileHeader, userID string) (string, error) {
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
	objectName := fmt.Sprintf("scans/%s-%s", userID, file.Filename)
	_, err = s.minio.PutObject(ctx, s.bucket, objectName, src, file.Size, minio.PutObjectOptions{
		ContentType: file.Header.Get("Content-Type"),
	})
	if err != nil {
		return "", err
	}
	imageURL := fmt.Sprintf("minio://%s/%s", s.bucket, objectName)

	// 4. Simpan DB (Status PENDING) - asumsikan userID sudah di-parse ke pgtype.UUID di sisi handler/middleware
	// Note: Sesuaikan mapping tipe data dengan generate-an sqlc kamu
	scanRecord, err := s.repo.CreateScan(ctx, db.CreateScanHistoryParams{
		// UserID: ..., (Mapping UUID dari string)
		ImgUrl: imageURL,
	})
	if err != nil {
		return "", err
	}

	// 5. Publish ke RabbitMQ
	// Asumsikan scanRecord.ID dikonversi ke string
	taskID := fmt.Sprintf("%v", scanRecord.ID)
	err = s.publisher.PublishOCRTask(ctx, taskID, imageURL)
	if err != nil {
		return "", err
	}

	return taskID, nil
}

func (s *service) HandleWebhook(ctx context.Context, payload WebhookPayload) error {
	// 1. Update status scan history
	// 2. INSERT ke tabel nutrition_logs jika status COMPLETED
	// Implementasi pemanggilan ke s.repo.UpdateScan dan s.repo.CreateNutritionLog
	return nil
}
