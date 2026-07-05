-- name: GetPaginatedUsers :many
SELECT
    id,
    username,
    email,
    height,
    weight,
    date_of_birth,
    activity_level,
    gender,
    created_at,
    updated_at
FROM users
WHERE deleted_at IS NULL
LIMIT $1 OFFSET $2;

-- name: GetAllUsers :many
SELECT
    id,
    username,
    email,
    height,
    weight,
    date_of_birth,
    activity_level,
    gender,
    created_at,
    updated_at
FROM users
WHERE deleted_at IS NULL
ORDER BY created_at DESC;

-- name: GetUserByID :one
SELECT
    id,
    username,
    email,
    height,
    weight,
    date_of_birth,
    activity_level,
    gender,
    created_at,
    updated_at
FROM users
WHERE id = $1;

-- name: GetUserByEmail :one
SELECT
    id,
    username,
    password,
    email,
    weight,
    height,
    date_of_birth,
    activity_level,
    gender,
    created_at,
    updated_at
FROM users
WHERE email = $1
  AND deleted_at IS NULL;

-- name: CreateUser :one
INSERT INTO users (
    username,
    password,
    email,
    height,
    weight,
    date_of_birth,
    activity_level,
    gender
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8
) RETURNING id, created_at, updated_at;

-- name: UpdateUser :execrows
UPDATE users
SET
    username = $2,
    email = $3,
    height = $4,
    weight = $5,
    date_of_birth = $6,
    activity_level = $7,
    gender = $8,
    updated_at = NOW()
WHERE id = $1;

-- name: UpdateUserAvatar :execrows
UPDATE users
SET
    avatar = $2,
    updated_at = NOW()
WHERE id = $1;

-- name: UpdateUserPassword :execrows
UPDATE users
SET
    password = $2,
    updated_at = NOW()
WHERE id = $1;

-- name: DeleteUser :execrows
UPDATE users
SET deleted_at = NOW()
WHERE id = $1;