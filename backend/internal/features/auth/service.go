package auth

import (
	"context"
	"log"

	"github.com/go-playground/validator/v10"
	"golang.org/x/crypto/bcrypt"

	"nutritrack.com/backend/internal/domain"
	"nutritrack.com/backend/internal/helper"
	"nutritrack.com/backend/internal/infrastructure/database/sqlc"
)

type Service interface {
	Login(ctx context.Context, payload domain.UserLoginInput) (*domain.LoginResponse, error)
	Register(ctx context.Context, payload domain.UserCreateInput) (*domain.LoginResponse, error)
}

type authService struct {
	queries   *sqlc.Queries
	validator *validator.Validate
}

func NewService(queries *sqlc.Queries, validator *validator.Validate) Service {
	return &authService{
		queries:   queries,
		validator: validator,
	}
}

func (s *authService) Login(ctx context.Context, payload domain.UserLoginInput) (*domain.LoginResponse, error) {
	if err := s.validator.Struct(payload); err != nil {
		return nil, err
	}

	user, err := s.queries.GetUserByEmail(ctx, payload.Email)
	if err != nil {
		return nil, err
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(payload.Password)); err != nil {
		log.Printf("Failed login attempt for user ID: %d", user.ID)
		return nil, domain.ErrInvalidCredentials
	}

	token, err := helper.GenerateToken(user.ID)
	if err != nil {
		log.Printf("Failed to generate token for user %d: %v", user.ID, err)
		return nil, err
	}

	return &domain.LoginResponse{
		Token: token,
		Type:  "Bearer",
	}, nil
}

func (s *authService) Register(ctx context.Context, payload domain.UserCreateInput) (*domain.LoginResponse, error) {
	if err := s.validator.Struct(payload); err != nil {
		return nil, err
	}

	// Check if user already exists
	_, err := s.queries.GetUserByEmail(ctx, payload.Email)
	if err == nil {
		return nil, domain.ErrDuplicateEmail
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create map to CreateUserParams
	arg := sqlc.CreateUserParams{
		Username: payload.Username,
		Email:    payload.Email,
		Password: hashedPassword,
	}

	// Basic registration only
	user, err := s.queries.CreateUser(ctx, arg)
	if err != nil {
		return nil, err
	}

	token, err := helper.GenerateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &domain.LoginResponse{
		Token: token,
		Type:  "Bearer",
	}, nil
}
