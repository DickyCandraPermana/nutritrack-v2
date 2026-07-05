package auth

import (
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/domain"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Login(c *fiber.Ctx) error {
	var payload domain.UserLoginInput

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	res, err := h.service.Login(c.Context(), payload)
	if err != nil {
		if err == domain.ErrInvalidCredentials {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid email or password",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"message": "Login successful",
		"data":    res,
	})
}

func (h *Handler) Register(c *fiber.Ctx) error {
	var payload domain.UserCreateInput

	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request payload",
		})
	}

	res, err := h.service.Register(c.Context(), payload)
	if err != nil {
		if err == domain.ErrDuplicateEmail {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Email already registered",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Registration successful",
		"data":    res,
	})
}
