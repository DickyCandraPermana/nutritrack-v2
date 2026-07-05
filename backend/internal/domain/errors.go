package domain

import "errors"

var (
	ErrUnauthorized       = errors.New("email atau password salah")
	ErrNotFound           = errors.New("resource not found")
	ErrConflict           = errors.New("resource already exists")
	ErrDuplicateEmail     = errors.New("email is already registered")
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrValidator          = errors.New("invalid request")
	ErrCannotDelete       = errors.New("resource cannot be deleted due to existing dependencies")
)
