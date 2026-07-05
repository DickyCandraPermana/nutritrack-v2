package diary

import (
	"strconv"
	"time"

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

func (h *Handler) GetSummary(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	dateStr := c.Query("date")

	date := time.Now()
	if dateStr != "" {
		parsed, err := time.Parse("2006-01-02", dateStr)
		if err == nil {
			date = parsed
		}
	}

	summary, err := h.service.GetSummary(c.Context(), userID, date)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"data": summary,
	})
}

func (h *Handler) GetEntries(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	dateStr := c.Query("date")

	date := time.Now()
	if dateStr != "" {
		parsed, err := time.Parse("2006-01-02", dateStr)
		if err == nil {
			date = parsed
		}
	}

	entries, err := h.service.GetEntries(c.Context(), userID, date)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{
		"data": entries,
	})
}

func (h *Handler) CreateEntry(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	var input domain.DiaryCreateInput

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}

	input.UserID = userID

	res, err := h.service.CreateEntry(c.Context(), input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Diary entry created",
		"data":    res,
	})
}

func (h *Handler) UpdateEntry(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid entry ID"})
	}

	var input domain.DiaryUpdateInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request payload"})
	}
	input.ID = id

	if err := h.service.UpdateEntry(c.Context(), userID, input); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Diary entry updated"})
}

func (h *Handler) DeleteEntry(c *fiber.Ctx) error {
	userID := middleware.GetUserID(c)
	idStr := c.Params("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid entry ID"})
	}

	if err := h.service.DeleteEntry(c.Context(), userID, id); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Diary entry deleted"})
}
