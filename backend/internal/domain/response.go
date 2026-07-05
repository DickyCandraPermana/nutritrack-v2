package domain

import (
	"time"
)

type UserResponse struct {
	ID            int64      `json:"id"`
	Username      string     `json:"username"`
	Email         string     `json:"email"`
	Height        *float64   `json:"height"`
	Weight        *float64   `json:"weight"`
	DateOfBirth   *time.Time `json:"date_of_birth"`
	ActivityLevel *int       `json:"activity_level"`
	Gender        *string    `json:"gender"`
}

type LoginResponse struct {
	Token string `json:"token"`
	Type  string `json:"type"`
}
