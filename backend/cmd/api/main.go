package main

import (
	"log"

	"github.com/gofiber/fiber/v2"

	// Import 3 folder infrastruktur secara terpisah
	broker "nutritrack.com/backend/internal/infrastructure/broker"
	database "nutritrack.com/backend/internal/infrastructure/database"
	storage "nutritrack.com/backend/internal/infrastructure/storage"

	// Gunakan alias 'db' khusus untuk hasil generate sqlc
	db "nutritrack.com/backend/internal/infrastructure/database/sqlc"

	// Import feature
	"nutritrack.com/backend/internal/features/scan"
)

func main() {
	app := fiber.New(fiber.Config{
		BodyLimit: 5 * 1024 * 1024,
	})

	// 1. Eksekusi Koneksi Database
	// Asumsi string koneksi sementara ditaruh statis (idealnya dari config)
	dbPool := database.NewPostgresPool("postgres://user:pass@localhost:5432/nutritrack_db")
	defer dbPool.Close()

	// 2. Eksekusi Koneksi Storage (MinIO)
	minioClient := storage.NewMinioClient("localhost:9000", "minioadmin", "minioadmin", "nutritrack-images")

	// 3. Eksekusi Koneksi Broker (RabbitMQ)
	rabbitConn, rabbitCh := broker.NewRabbitMQConnection("amqp://guest:guest@localhost:5672/", "ocr_tasks")
	defer rabbitConn.Close()
	defer rabbitCh.Close()

	// 4. Setup Dependencies (sqlc wrapper)
	queries := db.New(dbPool)

	// 5. Dependency Injection untuk Fitur Scan
	scanRepo := scan.NewRepository(queries)
	scanPub := scan.NewPublisher(rabbitCh, "ocr_tasks")

	// Masukkan repo, publisher, dan minio ke dalam service
	scanSvc := scan.NewService(scanRepo, scanPub, minioClient, "nutritrack-images")
	scanHdl := scan.NewHandler(scanSvc)

	// 6. Daftarkan Routes
	api := app.Group("/api/v1")
	api.Post("/scans", scanHdl.UploadLabel)

	// 7. Jalankan Server
	log.Println("🚀 Server berjalan di port 8080")
	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}
