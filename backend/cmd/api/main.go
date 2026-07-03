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

	// Import app config, state, and feature
	"nutritrack.com/backend/internal/app"
	"nutritrack.com/backend/internal/config"
	"nutritrack.com/backend/internal/features/scan"
)

func main() {
	// 1. Init Config
	cfg := config.Load()

	// 2. Eksekusi Koneksi Database
	dbPool := database.NewPostgresPool(cfg.DBUrl)
	defer dbPool.Close()

	// 3. Eksekusi Koneksi Storage (MinIO)
	minioClient := storage.NewMinioClient(cfg.MinioEndpoint, cfg.MinioAccessKey, cfg.MinioSecretKey, cfg.MinioBucket)

	// 4. Eksekusi Koneksi Broker (RabbitMQ)
	rabbitConn, rabbitCh := broker.NewRabbitMQConnection(cfg.RabbitMQUrl, cfg.RabbitMQQueue)
	defer rabbitConn.Close()
	defer rabbitCh.Close()

	// 5. Setup Dependencies (sqlc wrapper)
	queries := db.New(dbPool)

	// 6. Build App State
	state := &app.State{
		Config:   cfg,
		Queries:  queries,
		Minio:    minioClient,
		RabbitMQ: rabbitCh,
	}

	// 7. Setup Fiber & Routes
	fiberApp := fiber.New(fiber.Config{
		BodyLimit: 5 * 1024 * 1024,
	})
	api := fiberApp.Group("/api/v1")

	// 8. Mount Features
	scan.SetupRoutes(api, state)

	// 9. Jalankan Server
	log.Printf("🚀 Server berjalan di port %s\n", cfg.Addr)
	if err := fiberApp.Listen(cfg.Addr); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}
