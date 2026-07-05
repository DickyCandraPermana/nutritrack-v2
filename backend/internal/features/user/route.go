package user

import (
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/app"
	"nutritrack.com/backend/internal/middleware"
)

func SetupRoutes(router fiber.Router, state *app.State) {
	service := NewService(state.Queries)
	handler := NewHandler(service)

	userGroup := router.Group("/users", middleware.Protected())
	userGroup.Get("/profile", handler.GetProfile)
	userGroup.Put("/profile", handler.UpdateProfile)
	userGroup.Patch("/avatar", handler.UpdateAvatar)
	userGroup.Patch("/password", handler.UpdatePassword)
}
