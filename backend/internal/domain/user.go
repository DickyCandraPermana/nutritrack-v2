package domain

import (
	"time"
)

type User struct {
	ID            int64      `db:"id" json:"id"`
	Username      string     `db:"username" json:"username"`
	Email         string     `db:"email" json:"email"`
	Password      string     `db:"password" json:"-"`
	Height        *float64   `db:"height" json:"height"`
	Weight        *float64   `db:"weight" json:"weight"`
	DateOfBirth   *time.Time `db:"date_of_birth" json:"date_of_birth"`
	ActivityLevel *int       `db:"activity_level" json:"activity_level"`
	Gender        *string    `db:"gender" json:"gender"`
	OTPEnabled    bool       `db:"otp_enabled" json:"otp_enabled"`
	OTPSecret     string     `db:"otp_secret" json:"-"` // Never expose OTP secret to client
	CreatedAt     string     `db:"created_at" json:"created_at"`
	UpdatedAt     string     `db:"updated_at" json:"updated_at"`
}

func (u *User) GetAge() int {
	today := time.Now()
	age := today.Year() - u.DateOfBirth.Year()

	if today.YearDay() < u.DateOfBirth.YearDay() {
		age--
	}
	return age
}

type UpdateAvatarInput struct {
	AvatarURL string `json:"avatar_url" validate:"required,url"`
}

type UpdatePasswordInput struct {
	OldPassword string `json:"old_password" validate:"required,min=6"`
	NewPassword string `json:"new_password" validate:"required,min=6"`
}
