package helper

import (
	"errors"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

func StringToUUID(s string) (pgtype.UUID, error) {
	var uuid pgtype.UUID
	err := uuid.Scan(s)
	return uuid, err
}

func UUIDToString(u pgtype.UUID) string {
	if !u.Valid {
		return ""
	}
	// uuid string representation
	return fmt.Sprintf("%x-%x-%x-%x-%x", u.Bytes[0:4], u.Bytes[4:6], u.Bytes[6:8], u.Bytes[8:10], u.Bytes[10:16])
}

func GetUserIDFromContext(c *fiber.Ctx) (int64, error) {
	userToken := c.Locals("user")
	if userToken == nil {
		return 0, errors.New("unauthorized")
	}

	token, ok := userToken.(*jwt.Token)
	if !ok {
		return 0, errors.New("unauthorized")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return 0, errors.New("unauthorized")
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return 0, errors.New("unauthorized")
	}

	return int64(userIDFloat), nil
}
