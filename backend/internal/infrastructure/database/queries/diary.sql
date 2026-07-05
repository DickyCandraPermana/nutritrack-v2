-- name: GetDiarySummary :one
SELECT
    COALESCE(SUM(CASE WHEN n.name = 'Caloric Value' THEN (fd.amount_consumed / NULLIF(f.serving_size, 0)) * fn.amount END), 0)::float8 as total_calories,
    COALESCE(SUM(CASE WHEN n.name = 'Protein' THEN (fd.amount_consumed / NULLIF(f.serving_size, 0)) * fn.amount END), 0)::float8 as total_protein,
    COALESCE(SUM(CASE WHEN n.name = 'Carbohydrates' THEN (fd.amount_consumed / NULLIF(f.serving_size, 0)) * fn.amount END), 0)::float8 as total_carbs,
    COALESCE(SUM(CASE WHEN n.name = 'Fat' THEN (fd.amount_consumed / NULLIF(f.serving_size, 0)) * fn.amount END), 0)::float8 as total_fat
FROM food_diaries fd
JOIN foods f ON fd.food_id = f.id AND f.deleted_at IS NULL
JOIN food_nutrients fn ON f.id = fn.food_id
JOIN nutrients n ON fn.nutrient_id = n.id
WHERE fd.user_id = $1
    AND DATE(fd.consumed_at) = $2
    AND fd.deleted_at IS NULL;

-- name: GetDiaryEntries :many
SELECT
    fd.id,
    fd.amount_consumed,
    fd.consumed_at,
    fd.meal_type,
    fd.created_at,
    fd.updated_at,
    f.name as food_name
FROM food_diaries fd
JOIN foods f ON f.id = fd.food_id
WHERE fd.user_id = $1
  AND DATE(fd.consumed_at) = $2
  AND fd.deleted_at IS NULL;

-- name: GetUserDiaryEntry :one
SELECT
    fd.user_id,
    fd.food_id,
    fd.amount_consumed,
    fd.consumed_at,
    fd.meal_type,
    f.name as food_name,
    fd.created_at,
    fd.updated_at
FROM food_diaries fd
JOIN foods f ON fd.food_id = f.id
WHERE fd.id = $1 AND fd.user_id = $2 AND fd.deleted_at IS NULL;

-- name: GetDiaryEntry :one
SELECT
    fd.user_id,
    fd.food_id,
    fd.amount_consumed,
    fd.consumed_at,
    fd.meal_type,
    f.name as food_name,
    fd.created_at,
    fd.updated_at
FROM food_diaries fd
JOIN foods f ON fd.food_id = f.id
WHERE fd.id = $1 AND fd.deleted_at IS NULL;

-- name: CreateDiaryEntry :one
INSERT INTO food_diaries (user_id, food_id, amount_consumed, consumed_at, meal_type)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, created_at, updated_at;

-- name: UpdateDiaryEntry :execrows
UPDATE food_diaries
SET
    food_id = $2,
    amount_consumed = $3,
    consumed_at = $4,
    meal_type = $5,
    updated_at = NOW()
WHERE id = $1;

-- name: DeleteDiaryEntry :execrows
UPDATE food_diaries
SET deleted_at = NOW()
WHERE id = $1;
