-- name: GetDailyNutritionByRange :many
SELECT 
    DATE(fd.consumed_at)::date as date,
    COALESCE(SUM(
        f.serving_size * fd.amount_consumed / 100.0 * fn.amount
    ), 0)::float8 as total_calories,
    COALESCE(SUM(
        CASE WHEN n."name" = 'Protein' 
        THEN f.serving_size * fd.amount_consumed / 100.0 * fn.amount 
        ELSE 0 END
    ), 0)::float8 as protein,
    COALESCE(SUM(
        CASE WHEN n."name" = 'Carbs' 
        THEN f.serving_size * fd.amount_consumed / 100.0 * fn.amount 
        ELSE 0 END
    ), 0)::float8 as carbs,
    COALESCE(SUM(
        CASE WHEN n."name" = 'Fat' 
        THEN f.serving_size * fd.amount_consumed / 100.0 * fn.amount 
        ELSE 0 END
    ), 0)::float8 as fat,
    COUNT(fd.id)::int as entry_count
FROM food_diaries fd
JOIN foods f ON fd.food_id = f.id
JOIN food_nutrients fn ON f.id = fn.food_id
JOIN nutrients n ON fn.nutrient_id = n.id
WHERE fd.user_id = $1 
    AND DATE(fd.consumed_at) >= $2 
    AND DATE(fd.consumed_at) <= $3
    AND fd.deleted_at IS NULL
GROUP BY DATE(fd.consumed_at)
ORDER BY date ASC;
