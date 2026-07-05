-- name: CreateGoal :one
INSERT INTO nutrition_goals (user_id, daily_target_calories, start_date, end_date, goal_type, created_at, updated_at)
VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
RETURNING id, created_at, updated_at;

-- name: GetGoalByID :one
SELECT id, user_id, daily_target_calories, start_date, end_date, goal_type, created_at, updated_at, deleted_at
FROM nutrition_goals
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetActiveGoalByUser :one
SELECT id, user_id, daily_target_calories, start_date, end_date, goal_type, created_at, updated_at, deleted_at
FROM nutrition_goals
WHERE user_id = $1 
    AND start_date <= $2
    AND (end_date IS NULL OR end_date >= $2)
    AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 1;

-- name: GetGoalsByUserAndDateRange :many
SELECT id, user_id, daily_target_calories, start_date, end_date, goal_type, created_at, updated_at, deleted_at
FROM nutrition_goals
WHERE user_id = $1 
    AND start_date <= $2
    AND (end_date IS NULL OR end_date >= $1)
    AND deleted_at IS NULL
ORDER BY start_date DESC;

-- name: UpdateGoal :execrows
UPDATE nutrition_goals
SET daily_target_calories = $1, start_date = $2, end_date = $3, goal_type = $4, updated_at = NOW()
WHERE id = $5 AND deleted_at IS NULL;

-- name: DeleteGoal :execrows
UPDATE nutrition_goals
SET deleted_at = NOW(), updated_at = NOW()
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetAllGoalsByUser :many
SELECT id, user_id, daily_target_calories, start_date, end_date, goal_type, created_at, updated_at, deleted_at
FROM nutrition_goals
WHERE user_id = $1 AND deleted_at IS NULL
ORDER BY created_at DESC;
