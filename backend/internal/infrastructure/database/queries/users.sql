-- name: CreateUser :one
INSERT INTO users (
  username, email, password_hash, role, created_by
) VALUES (
  $1, $2, $3, $4, $5
)
RETURNING id, username, email, role, created_at;

-- name: UpdateUser :exec
UPDATE users
SET username = $2, email = $3, role = $4, updated_by = $5, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: UpdateUserPassword :exec
UPDATE users
SET password_hash = $2, updated_by = $3, updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetUserById :one
SELECT
  username, email, role
FROM users
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetUserByEmail :one
SELECT id, username, email, password_hash, role
FROM users
WHERE email = $1 AND deleted_at IS NULL;

-- name: GetUserByUsername :one
SELECT id, username, email, password_hash, role
FROM users
WHERE username = $1 AND deleted_at IS NULL;

-- name: GetUsers :many
SELECT
  username, email, role
FROM users
WHERE deleted_at IS NULL;

-- name: DeleteUser :exec
UPDATE users
SET deleted_at = NOW(), deleted_by = $2, updated_at = NOW()
WHERE id = $1;