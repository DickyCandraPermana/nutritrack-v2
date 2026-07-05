package security

import (
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/domain"
	"nutritrack.com/backend/internal/helper"
	"nutritrack.com/backend/internal/middleware"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetAuditLogs(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	limit := helper.ReadIntQueryFiber(c, "limit", 10)
	offset := helper.ReadIntQueryFiber(c, "offset", 0)

	logs, err := h.service.GetAuditLogs(c.Context(), userID, int32(limit), int32(offset))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": logs})
}

func (h *Handler) Enable2FA(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	var input domain.TwoFAEnableInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid payload"})
	}

	if err := h.service.Enable2FA(c.Context(), userID, input); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"message": "2FA enabled"})
}

func (h *Handler) Disable2FA(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	var input domain.TwoFADisableInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid payload"})
	}

	if err := h.service.Disable2FA(c.Context(), userID, input); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"message": "2FA disabled"})
}
