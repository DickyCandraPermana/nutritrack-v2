package scan

import (
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/app"
)

func SetupRoutes(router fiber.Router, state *app.State) {
	repo := NewRepository(state.Queries)
	pub := NewPublisher(state.RabbitMQ, state.Config.RabbitMQQueue)
	svc := NewService(repo, pub, state.Minio, state.Config.MinioBucket)
	hdl := NewHandler(svc)

	router.Post("/scans", hdl.UploadLabel)
	router.Post("/scans/webhook", hdl.WebhookOCR)
}
