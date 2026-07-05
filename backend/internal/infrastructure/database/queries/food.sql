-- name: CreateFood :one
INSERT INTO foods (name, description, serving_size, serving_unit)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetFood :one
SELECT * FROM foods WHERE id = $1;

-- name: ListFoods :many
SELECT
  f.id,
  f.name,
  f.description,
  f.serving_size,
  f.serving_unit,
  COALESCE(MAX(fn.amount) FILTER (WHERE n.name = 'Caloric Value'), 0)::float AS calories,
  COALESCE(MAX(fn.amount) FILTER (WHERE n.name = 'Protein'), 0)::float AS protein,
  COALESCE(MAX(fn.amount) FILTER (WHERE n.name = 'Fat'), 0)::float AS fat,
  COALESCE(MAX(fn.amount) FILTER (WHERE n.name = 'Carbohydrates'), 0)::float AS carbs
FROM foods f
LEFT JOIN food_nutrients fn ON f.id = fn.food_id
LEFT JOIN nutrients n ON fn.nutrient_id = n.id
WHERE f.name ILIKE '%' || sqlc.arg('name')::text || '%'
GROUP BY f.id
ORDER BY f.name
LIMIT $1 OFFSET $2;
