package scan

import (
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/app"
	"nutritrack.com/backend/internal/middleware"
)

func SetupRoutes(router fiber.Router, state *app.State) {
	repo := NewRepository(state.Queries)
	pub := NewPublisher(state.RabbitMQ, state.Config.RabbitMQQueue)
	svc := NewService(repo, pub, state.Minio, state.Config.MinioBucket)
	hdl := NewHandler(svc)

	// Protected routes
	protected := router.Group("/scans", middleware.Protected())
	protected.Post("/", hdl.UploadLabel)
	protected.Get("/:id", hdl.GetScanResult)

	// Public Webhook route
	router.Post("/scans/webhook", hdl.WebhookOCR)
}
