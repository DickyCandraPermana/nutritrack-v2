package food

import (
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/app"
)

func SetupRoutes(router fiber.Router, state *app.State) {
	repo := NewRepository(state.Queries)
	svc := NewService(repo)
	hdl := NewHandler(svc)

	foodGroup := router.Group("/foods")
	foodGroup.Post("/", hdl.CreateFood)
	foodGroup.Get("/", hdl.ListFoods)
	foodGroup.Get("/:id", hdl.GetFood)
}
