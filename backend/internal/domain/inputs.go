package domain

import "time"

type UserCreateInput struct {
	Username      string     `validate:"required,min=3,max=30"`
	Email         string     `validate:"required,email"`
	Password      string     `validate:"required,min=8"`
	Height        *float64   `validate:"omitempty,gt=0"`
	Weight        *float64   `validate:"omitempty,gt=0"`
	DateOfBirth   *time.Time `validate:"omitempty"`
	ActivityLevel *int       `validate:"omitempty,min=1,max=5"`
	Gender        *string    `validate:"omitempty,oneof=male female"`
}

type UserLoginInput struct {
	Email    string `validate:"required,email"`
	Password string `validate:"required,min=8"`
}

type UserUpdateInput struct {
	Username      *string    `validate:"omitempty,min=3,max=30"`
	Email         *string    `validate:"omitempty,email"`
	Password      *string    `validate:"omitempty,min=8"`
	Height        *float64   `validate:"omitempty,gt=0"`
	Weight        *float64   `validate:"omitempty,gt=0"`
	DateOfBirth   *time.Time `validate:"omitempty"`
	ActivityLevel *int       `validate:"omitempty,min=1,max=5"`
	Gender        *string    `validate:"omitempty,oneof=male female"`
}
