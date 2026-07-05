-- name: GetPaginatedFoods :many
SELECT id, name, description, serving_size, serving_unit
FROM foods
WHERE deleted_at IS NULL
LIMIT $1 OFFSET $2;

-- name: SearchFoods :many
SELECT f.id, f.name, f.description, f.serving_size, f.serving_unit
FROM foods f
WHERE f.deleted_at IS NULL
  AND (sqlc.narg('query')::text IS NULL OR f.name ILIKE '%' || sqlc.narg('query')::text || '%')
ORDER BY f.name ASC
LIMIT $1 OFFSET $2;

-- name: GetNutrientsByFoodIDs :many
SELECT fn.food_id, n.id, n.name, n.unit, fn.amount
FROM food_nutrients fn
JOIN nutrients n ON fn.nutrient_id = n.id
WHERE fn.food_id = ANY($1::bigint[]);

-- name: GetFoodByID :many
SELECT 
    f.id,
    f.name,
    f.description,
    f.serving_size,
    f.serving_unit,
    fn.amount,
    n.id AS nutrient_id,
    n.name AS nutrient_name,
    n.unit,
    f.created_at,
    f.updated_at
FROM foods f
LEFT JOIN food_nutrients fn ON fn.food_id = f.id
LEFT JOIN nutrients n ON n.id = fn.nutrient_id
WHERE f.id = $1
    AND f.deleted_at IS NULL;

-- name: CreateFood :one
INSERT INTO foods (name, description, serving_size, serving_unit)
VALUES ($1, $2, $3, $4)
RETURNING id, created_at, updated_at;

-- name: UpdateFood :execrows
UPDATE foods
SET name = $1, description = $2, serving_size = $3, serving_unit = $4, updated_at = NOW()
WHERE id = $5 AND deleted_at IS NULL;

-- name: DeleteFood :execrows
UPDATE foods
SET deleted_at = NOW()
WHERE id = $1;

-- name: DeleteFoodNutrients :execrows
DELETE FROM food_nutrients WHERE food_id = $1;

-- name: CreateFoodNutrient :exec
INSERT INTO food_nutrients (food_id, nutrient_id, amount)
VALUES ($1, $2, $3);
