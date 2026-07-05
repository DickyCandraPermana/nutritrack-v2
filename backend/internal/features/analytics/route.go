package analytics

import (
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/app"
	"nutritrack.com/backend/internal/middleware"
)

func SetupRoutes(router fiber.Router, state *app.State) {
	service := NewService(state.Queries)
	handler := NewHandler(service)

	group := router.Group("/analytics", middleware.Protected())
	group.Get("/calories-trend", handler.GetCaloriesTrend)
	group.Get("/macro-trend", handler.GetMacroTrend)
}
