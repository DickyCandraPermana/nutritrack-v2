-- name: CreateProfile :one
INSERT INTO profiles (
  user_id, first_name, last_name, date_of_birth, weight, height, gender, activity_level, created_by
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9
)
RETURNING id, first_name, last_name, date_of_birth, weight, height, gender, activity_level;

-- name: UpdateProfile :exec
UPDATE profiles
SET
  first_name = $2,
  last_name = $3,
  date_of_birth = $4,
  weight = $5,
  height = $6,
  gender = $7,
  activity_level = $8,
  updated_by = $1,
  updated_at = NOW()
WHERE user_id = $1 AND deleted_at IS NULL;

-- name: GetProfileByUserId :one
SELECT
  first_name,
  last_name,
  date_of_birth,
  weight,
  height,
  gender,
  activity_level,
  created_at
FROM profiles
WHERE user_id = $1 AND deleted_at IS NULL;

-- name: DeleteProfileByUserId :exec
UPDATE profiles
SET
  deleted_at = NOW(),
  deleted_by = $2,
  updated_at = NOW()
WHERE user_id = $1 AND deleted_at IS NULL;