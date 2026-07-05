package helper

import (
	"net/http"
	"strconv"
	"github.com/gofiber/fiber/v2"
)

func ReadFloatQuery(r *http.Request, q string, fallback float64) float64 {
	resStr := r.URL.Query().Get(q)
	res, err := strconv.ParseFloat(resStr, 64)
	if err != nil {
		return fallback
	}

	return res
}

func ReadIntQuery(r *http.Request, q string, fallback int) int {
	resStr := r.URL.Query().Get(q)
	res, err := strconv.Atoi(resStr)
	if err != nil {
		return fallback
	}

	return res
}

func ReadFloatQueryFiber(c *fiber.Ctx, q string, fallback float64) float64 {
	resStr := c.Query(q)
	res, err := strconv.ParseFloat(resStr, 64)
	if err != nil {
		return fallback
	}
	return res
}

func ReadIntQueryFiber(c *fiber.Ctx, q string, fallback int) int {
	resStr := c.Query(q)
	res, err := strconv.Atoi(resStr)
	if err != nil {
		return fallback
	}
	return res
}
