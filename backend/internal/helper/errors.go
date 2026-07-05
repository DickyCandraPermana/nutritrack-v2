package helper

import (
	"errors"

	"github.com/lib/pq"
)

func IsDuplicateKeyError(err error) bool {
	var pqErr *pq.Error
	if errors.As(err, &pqErr) {
		// Kode error PostgreSQL untuk unique violation
		return pqErr.Code == "23505"
	}
	return false
}

func IsForeignKeyError(err error) bool {
	// PostgreSQL
	var pqErr *pq.Error
	if errors.As(err, &pqErr) {
		// 23503 = foreign_key_violation
		return pqErr.Code == "23503"
	}

	return false
}
