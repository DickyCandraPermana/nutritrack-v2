package analytics

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/middleware"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) GetCaloriesTrend(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	daysStr := c.Query("days", "7")
	days, err := strconv.Atoi(daysStr)
	if err != nil || days <= 0 {
		days = 7
	}

	trend, err := h.service.GetCaloriesTrend(c.Context(), userID, days)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": trend})
}

func (h *Handler) GetMacroTrend(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	daysStr := c.Query("days", "7")
	days, err := strconv.Atoi(daysStr)
	if err != nil || days <= 0 {
		days = 7
	}

	trend, err := h.service.GetMacroTrend(c.Context(), userID, days)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": trend})
}
