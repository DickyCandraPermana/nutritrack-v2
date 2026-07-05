package goals

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

	group := router.Group("/goals", middleware.Protected())
	group.Get("/", handler.GetGoals)
	group.Get("/active", handler.GetActiveGoal)
	group.Post("/", handler.CreateGoal)
	group.Put("/:id", handler.UpdateGoal)
	group.Delete("/:id", handler.DeleteGoal)
}
