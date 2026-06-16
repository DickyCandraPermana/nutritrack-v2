-- name: CreateNutritionLogsBatch :copyfrom
INSERT INTO nutrition_logs (
    food_name,
    calories,
    protein_g,
    carbs_g,
    fat_g,
    sugar_g,
    user_id,
    scan_id,
    created_by
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
);

-- name: CreateNutritionLog :one
INSERT INTO nutrition_logs (
    food_name,
    calories,
    protein_g,
    carbs_g,
    fat_g,
    sugar_g,
    user_id,
    scan_id,
    created_by
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9
)
RETURNING
  id,
  food_name,
  calories,
  protein_g,
  carbs_g,
  fat_g,
  sugar_g,
  user_id,
  scan_id,
  created_at;

-- name: UpdateNutritionLog :exec
UPDATE nutrition_logs
SET
  food_name = $2,
  calories = $3,
  protein_g = $4,
  carbs_g = $5,
  fat_g = $6,
  sugar_g = $7,
  updated_by = $8,
  updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: DeleteNutritionLog :exec
UPDATE nutrition_logs
SET
  deleted_at = NOW(),
  deleted_by = $2,
  updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;