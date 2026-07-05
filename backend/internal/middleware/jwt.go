package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"nutritrack.com/backend/internal/helper"
)

// Protected is a Fiber middleware that validates the JWT token
// from the Authorization header and extracts the user ID.
func Protected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing Authorization header",
			})
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid Authorization header format. Expected 'Bearer <token>'",
			})
		}

		tokenStr := parts[1]
		userID, err := helper.ValidateToken(tokenStr)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired token",
			})
		}

		// Store user ID in context locals
		c.Locals("user_id", userID)

		return c.Next()
	}
}

// GetUserID is a helper function to extract user_id from Fiber context
func GetUserID(c *fiber.Ctx) int64 {
	val := c.Locals("user_id")
	if val == nil {
		return 0
	}
	return val.(int64)
}
