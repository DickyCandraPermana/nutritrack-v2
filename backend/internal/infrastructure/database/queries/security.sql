-- name: Enable2FA :execrows
UPDATE users 
SET otp_secret = $1, otp_enabled = true, updated_at = CURRENT_TIMESTAMP
WHERE id = $2;

-- name: Disable2FA :execrows
UPDATE users 
SET otp_secret = NULL, otp_enabled = false, updated_at = CURRENT_TIMESTAMP
WHERE id = $1;

-- name: CreateAuditLog :exec
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_value, new_value, ip_address, user_agent)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8);

-- name: GetAuditLogsByUserID :many
SELECT id, user_id, action, resource_type, resource_id, old_value, new_value, ip_address, user_agent, created_at
FROM audit_logs
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;
