package scan

import (
	"github.com/gofiber/fiber/v2"
)

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) UploadLabel(c *fiber.Ctx) error {
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Gambar tidak ditemukan dalam request"})
	}

	// Simulasi ambil userID dari JWT middleware
	userID := "user-uuid-placeholder"

	taskID, err := h.service.ProcessScan(c.Context(), file, userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusAccepted).JSON(fiber.Map{
		"message": "Gambar sedang diproses",
		"data": fiber.Map{
			"task_id": taskID,
			"status":  "PENDING",
		},
	})
}

func (h *Handler) WebhookOCR(c *fiber.Ctx) error {
	var payload WebhookPayload
	if err := c.BodyParser(&payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid JSON payload"})
	}

	if err := h.service.HandleWebhook(c.Context(), payload); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.SendStatus(fiber.StatusOK)
}
