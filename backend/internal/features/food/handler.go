package food

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/domain"
	"nutritrack.com/backend/internal/helper"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Search(c *fiber.Ctx) error {
	filter := domain.FoodFilter{
		Query:       c.Query("q"),
		Limit:       helper.ReadIntQueryFiber(c, "limit", 10),
		Offset:      helper.ReadIntQueryFiber(c, "offset", 0),
		MinCalories: helper.ReadFloatQueryFiber(c, "min_calories", 0),
		MaxCalories: helper.ReadFloatQueryFiber(c, "max_calories", 0),
	}

	foods, err := h.service.Search(c.Context(), filter)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(fiber.Map{"data": foods})
}

func (h *Handler) GetByID(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid food ID"})
	}

	food, err := h.service.GetByID(c.Context(), id)
	if err != nil {
		if err == domain.ErrNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Food not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": food})
}

func (h *Handler) Create(c *fiber.Ctx) error {
	var input domain.CreateFoodInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid payload"})
	}

	res, err := h.service.Create(c.Context(), input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": res})
}

func (h *Handler) Update(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid food ID"})
	}

	var input domain.UpdateFoodInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid payload"})
	}

	if err := h.service.Update(c.Context(), id, input); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Food updated"})
}

func (h *Handler) Delete(c *fiber.Ctx) error {
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid food ID"})
	}

	if err := h.service.Delete(c.Context(), id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Food deleted"})
}
