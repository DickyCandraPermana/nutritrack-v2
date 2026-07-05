package diary

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

	group := router.Group("/diary", middleware.Protected())
	group.Get("/summary", handler.GetSummary)
	group.Get("/", handler.GetEntries)
	group.Post("/", handler.CreateEntry)
	group.Put("/:id", handler.UpdateEntry)
	group.Delete("/:id", handler.DeleteEntry)
}
