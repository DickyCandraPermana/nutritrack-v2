package helper

import (
	"crypto/rand"
	"encoding/base32"
	"fmt"
	"time"

	"github.com/pquerna/otp"
	"github.com/pquerna/otp/totp"
)

// TwoFAHelper handles 2FA operations
type TwoFAHelper struct {
	encryption *Encryption
}

func NewTwoFAHelper(encryption *Encryption) *TwoFAHelper {
	return &TwoFAHelper{
		encryption: encryption,
	}
}

// GenerateSecret generates a new TOTP secret for 2FA
func (h *TwoFAHelper) GenerateSecret(email string) (secret string, err error) {
	key, err := totp.Generate(totp.GenerateOpts{
		Issuer:      "NuTrack",
		AccountName: email,
		Period:      30,
		SecretSize:  32,
	})
	if err != nil {
		return "", fmt.Errorf("failed to generate TOTP secret: %w", err)
	}

	return key.Secret(), nil
}

// GenerateQRCode generates a QR code for the secret
func (h *TwoFAHelper) GenerateQRCode(email string, secret string) (qrCode string, err error) {
	// Create key from TOTP URL format
	key, err := otp.NewKeyFromURL(fmt.Sprintf("otpauth://totp/NuTrack:%s?secret=%s&issuer=NuTrack", email, secret))
	if err != nil {
		return "", fmt.Errorf("failed to create QR key: %w", err)
	}

	img, err := key.Image(200, 200)
	if err != nil {
		return "", fmt.Errorf("failed to generate image: %w", err)
	}

	// Convert image to base64 (simplified - would need actual PNG encoding in production)
	// For now, return placeholder
	_ = img
	return "qrcode_base64_placeholder", nil
}

// VerifyToken verifies a TOTP token against a secret
func (h *TwoFAHelper) VerifyToken(secret string, token string) (bool, error) {
	if len(token) != 6 {
		return false, fmt.Errorf("token must be 6 digits")
	}

	valid, err := totp.ValidateCustom(
		token,
		secret,
		time.Now().UTC(),
		totp.ValidateOpts{
			Period: 30,
			Skew:   1,
		},
	)

	if err != nil {
		return false, fmt.Errorf("failed to validate token: %w", err)
	}

	return valid, nil
}

// EncryptSecret encrypts a TOTP secret
func (h *TwoFAHelper) EncryptSecret(secret string) (string, error) {
	return h.encryption.Encrypt(secret)
}

// DecryptSecret decrypts a TOTP secret
func (h *TwoFAHelper) DecryptSecret(encrypted string) (string, error) {
	return h.encryption.Decrypt(encrypted)
}

// GenerateToken generates a random token for GDPR requests
func GenerateRandomToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", fmt.Errorf("failed to generate token: %w", err)
	}
	return base32.StdEncoding.EncodeToString(b), nil
}
