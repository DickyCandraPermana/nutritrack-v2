package goals

import (
	"strconv"

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

func (h *Handler) GetGoals(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	goals, err := h.service.GetAllGoals(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": goals})
}

func (h *Handler) GetActiveGoal(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	goal, err := h.service.GetActiveGoal(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No active goal found"})
	}
	return c.JSON(fiber.Map{"data": goal})
}

func (h *Handler) CreateGoal(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	var input domain.CreateNutritionGoalInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	res, err := h.service.CreateGoal(c.Context(), userID, input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Goal created successfully",
		"data":    res,
	})
}

func (h *Handler) UpdateGoal(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid goal ID"})
	}

	var input domain.UpdateNutritionGoalInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	if err := h.service.UpdateGoal(c.Context(), userID, id, input); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Goal updated successfully"})
}

func (h *Handler) DeleteGoal(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid goal ID"})
	}

	if err := h.service.DeleteGoal(c.Context(), userID, id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Goal deleted successfully"})
}
