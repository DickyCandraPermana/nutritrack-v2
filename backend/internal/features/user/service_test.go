package user_test

import (
	"testing"

	"golang.org/x/crypto/bcrypt"
)

// TestPasswordHashingLogic verifies that bcrypt hashes are generated and verifiable.
func TestPasswordHashingLogic(t *testing.T) {
	password := "SecretPassword123!"
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("expected no error from bcrypt generation, got: %v", err)
	}

	if len(hashed) == 0 {
		t.Fatalf("expected non-empty hash")
	}

	// Verify comparison succeeds with correct password
	err = bcrypt.CompareHashAndPassword(hashed, []byte(password))
	if err != nil {
		t.Errorf("expected hash to match original password, got error: %v", err)
	}

	// Verify comparison fails with wrong password
	err = bcrypt.CompareHashAndPassword(hashed, []byte("WrongPassword"))
	if err == nil {
		t.Errorf("expected error when verifying incorrect password, got nil")
	}
}

func TestPaginationDefaults(t *testing.T) {
	testCases := []struct {
		name         string
		size         int32
		page         int32
		expectedSize int32
		expectedPage int32
	}{
		{"default bounds", 0, 0, 10, 1},
		{"upper limit clamp", 150, 2, 10, 2},
		{"valid parameters", 25, 3, 25, 3},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			size := tc.size
			page := tc.page

			if page < 1 {
				page = 1
			}
			if size < 1 || size > 100 {
				size = 10
			}

			if size != tc.expectedSize {
				t.Errorf("expected size %d, got %d", tc.expectedSize, size)
			}
			if page != tc.expectedPage {
				t.Errorf("expected page %d, got %d", tc.expectedPage, page)
			}
		})
	}
}
