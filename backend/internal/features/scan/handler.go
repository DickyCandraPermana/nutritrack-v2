package scan

import (
	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/helper"
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

	userID, err := helper.GetUserIDFromContext(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

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

func (h *Handler) GetScanResult(c *fiber.Ctx) error {
	taskUUID, err := helper.StringToUUID(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid task ID"})
	}

	result, err := h.service.GetScanResult(c.Context(), taskUUID)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Scan not found"})
	}

	return c.JSON(fiber.Map{
		"data": result,
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
