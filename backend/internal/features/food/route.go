package food

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

	// Public routes
	group := router.Group("/foods")
	group.Get("/search", handler.Search)
	group.Get("/:id", handler.GetByID)

	// Protected admin routes
	protectedGroup := router.Group("/admin/foods", middleware.Protected())
	protectedGroup.Post("/", handler.Create)
	protectedGroup.Put("/:id", handler.Update)
	protectedGroup.Delete("/:id", handler.Delete)
}
