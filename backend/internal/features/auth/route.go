package auth

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/app"
)

func SetupRoutes(router fiber.Router, state *app.State) {
	validator := validator.New()
	service := NewService(state.Queries, validator)
	handler := NewHandler(service)

	authGroup := router.Group("/auth")
	authGroup.Post("/login", handler.Login)
	authGroup.Post("/register", handler.Register)
}
