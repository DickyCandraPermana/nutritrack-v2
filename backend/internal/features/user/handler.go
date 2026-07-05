package user

import (
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/domain"
	"nutritrack.com/backend/internal/middleware"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetProfile(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	return c.JSON(fiber.Map{"message": "Profile Data", "user_id": userID})
}

func (h *Handler) UpdateProfile(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	return c.JSON(fiber.Map{"message": "Profile updated", "user_id": userID})
}

func (h *Handler) UpdateAvatar(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	var input domain.UpdateAvatarInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid payload"})
	}

	if err := h.service.UpdateAvatar(c.Context(), userID, input.AvatarURL); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Avatar updated"})
}

func (h *Handler) UpdatePassword(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	var input domain.UpdatePasswordInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid payload"})
	}

	if err := h.service.UpdatePassword(c.Context(), userID, input); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Password updated"})
}
