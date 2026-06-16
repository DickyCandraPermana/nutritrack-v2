-- name: CreateScanHistory :one
INSERT INTO scan_histories (
  img_url,
  user_id,
  created_by
) VALUES (
  $1, $2, $2
)
RETURNING id, img_url, status, error_message;

-- name: UpdateScan :exec
UPDATE scan_histories
SET status = $2, error_message = $3, updated_by = $4, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetScanById :one
SELECT
  id,
  img_url,
  status,
  error_message,
  created_at
FROM scan_histories
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetScanByUserId :many
SELECT
  id,
  img_url,
  status,
  error_message,
  created_at
FROM scan_histories
WHERE user_id = $1 AND deleted_at IS NULL;

-- name: GetScan :many
SELECT
  id,
  user_id,
  img_url,
  status,
  error_message,
  created_at
FROM scan_histories
WHERE deleted_at IS NULL;

-- name: DeleteScan :exec
UPDATE scan_histories
SET deleted_at = NOW(), deleted_by = $2, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;