package food

import (
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/infrastructure/database/sqlc"
	"strconv"
)

type Handler struct {
	svc Service
}

func NewHandler(svc Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) CreateFood(c *fiber.Ctx) error {
	var req sqlc.CreateFoodParams
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	food, err := h.svc.CreateFood(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(food)
}

func (h *Handler) ListFoods(c *fiber.Ctx) error {
	name := c.Query("q", "")
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	offset, _ := strconv.Atoi(c.Query("offset", "0"))

	foods, err := h.svc.ListFoods(c.Context(), name, int32(limit), int32(offset))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	if foods == nil {
		foods = []sqlc.ListFoodsRow{} // Return empty array instead of null
	}
	return c.JSON(foods)
}

func (h *Handler) GetFood(c *fiber.Ctx) error {
	id := c.Params("id")
	food, err := h.svc.GetFood(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Food not found"})
	}
	return c.JSON(food)
}
