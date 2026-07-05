package main

import (
	"log"

	"github.com/gofiber/fiber/v2"

	// Infrastruktur
	broker "nutritrack.com/backend/internal/infrastructure/broker"
	database "nutritrack.com/backend/internal/infrastructure/database"
	storage "nutritrack.com/backend/internal/infrastructure/storage"
	db_sqlc "nutritrack.com/backend/internal/infrastructure/database/sqlc"

	// Config dan State
	"nutritrack.com/backend/internal/app"
	"nutritrack.com/backend/internal/config"
	
	// Features
	"nutritrack.com/backend/internal/features/analytics"
	"nutritrack.com/backend/internal/features/auth"
	"nutritrack.com/backend/internal/features/diary"
	"nutritrack.com/backend/internal/features/food"
	"nutritrack.com/backend/internal/features/goals"
	"nutritrack.com/backend/internal/features/scan"
	"nutritrack.com/backend/internal/features/security"
	"nutritrack.com/backend/internal/features/user"
)

func main() {
	// =========================================================================
	// 1. Init Config
	// =========================================================================
	cfg := config.Load()

	// =========================================================================
	// 2. Infrastruktur (PostgreSQL, MinIO, RabbitMQ)
	// =========================================================================
	dbPool := database.NewPostgresPool(cfg.DBUrl)
	defer dbPool.Close()

	minioClient := storage.NewMinioClient(cfg.MinioEndpoint, cfg.MinioAccessKey, cfg.MinioSecretKey, cfg.MinioBucket)

	rabbitConn, rabbitCh := broker.NewRabbitMQConnection(cfg.RabbitMQUrl, cfg.RabbitMQQueue)
	defer rabbitConn.Close()
	defer rabbitCh.Close()

	// Initialize SQLC queries
	queries := db_sqlc.New(dbPool)

	// Build App State
	state := &app.State{
		Config:   cfg,
		Queries:  queries,
		Minio:    minioClient,
		RabbitMQ: rabbitCh,
	}

	// =========================================================================
	// 3. Setup Fiber App
	// =========================================================================
	fiberApp := fiber.New(fiber.Config{
		BodyLimit: 5 * 1024 * 1024,
	})
	
	fiberApp.Use(func(c *fiber.Ctx) error {
		c.Set("Access-Control-Allow-Origin", "*")
		c.Set("Access-Control-Allow-Methods", "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS")
		c.Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")
		if c.Method() == "OPTIONS" {
			return c.SendStatus(204)
		}
		return c.Next()
	})

	api := fiberApp.Group("/api/v1")

	// =========================================================================
	// 4. Mount All Features
	// =========================================================================
	auth.SetupRoutes(api, state)
	user.SetupRoutes(api, state)
	food.SetupRoutes(api, state)
	diary.SetupRoutes(api, state)
	goals.SetupRoutes(api, state)
	scan.SetupRoutes(api, state)
	security.SetupRoutes(api, state)
	analytics.SetupRoutes(api, state)

	// =========================================================================
	// 5. Start Server
	// =========================================================================
	log.Printf("🚀 Server berjalan di port %s\n", cfg.Addr)
	if err := fiberApp.Listen(cfg.Addr); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}
