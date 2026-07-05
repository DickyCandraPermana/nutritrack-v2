package security

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/app"
	"nutritrack.com/backend/internal/middleware"
)

func SetupRoutes(router fiber.Router, state *app.State) {
	validator := validator.New()
	service := NewService(state.Queries, validator)
	handler := NewHandler(service)

	group := router.Group("/security", middleware.Protected())
	group.Get("/audit", handler.GetAuditLogs)
	group.Post("/2fa/enable", handler.Enable2FA)
	group.Post("/2fa/disable", handler.Disable2FA)
}
