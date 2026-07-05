package domain

import (
	"context"
	"io"
)

type FileStorage interface {
	Upload(ctx context.Context, fileName string, content io.Reader, size int64, contentType string) (string, error)
}
