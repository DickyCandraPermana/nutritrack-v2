package domain

import "time"

// 2FA Input types
type TwoFASetupInput struct {
	Password string `json:"password" validate:"required,min=6"`
}

type TwoFAVerifyInput struct {
	Token string `json:"token" validate:"required,len=6,numeric"`
}

type TwoFAEnableInput struct {
	Token    string `json:"token" validate:"required,len=6,numeric"`
	Password string `json:"password" validate:"required,min=6"`
}

type TwoFADisableInput struct {
	Password string `json:"password" validate:"required,min=6"`
}

type TwoFASetupResponse struct {
	QRCode string `json:"qr_code"` // Base64 encoded QR code
	Secret string `json:"secret"`  // Backup code
}

type TwoFALoginResponse struct {
	NeedOTP  bool   `json:"need_otp"`
	OTPToken string `json:"otp_token,omitempty"` // Temporary token to verify OTP
}

// Audit Log types
type AuditLog struct {
	ID           int64       `db:"id" json:"id"`
	UserID       int64       `db:"user_id" json:"user_id"`
	Action       string      `db:"action" json:"action"`
	ResourceType string      `db:"resource_type" json:"resource_type"`
	ResourceID   *int64      `db:"resource_id" json:"resource_id"`
	OldValue     interface{} `db:"old_value" json:"old_value"`
	NewValue     interface{} `db:"new_value" json:"new_value"`
	IPAddress    string      `db:"ip_address" json:"ip_address"`
	UserAgent    string      `db:"user_agent" json:"user_agent"`
	CreatedAt    time.Time   `db:"created_at" json:"created_at"`
}

// Audit action constants
const (
	AuditActionLogin         = "LOGIN"
	AuditActionLogout        = "LOGOUT"
	AuditActionCreateGoal    = "CREATE_GOAL"
	AuditActionUpdateGoal    = "UPDATE_GOAL"
	AuditActionDeleteGoal    = "DELETE_GOAL"
	AuditActionCreateDiary   = "CREATE_DIARY"
	AuditActionUpdateDiary   = "UPDATE_DIARY"
	AuditActionDeleteDiary   = "DELETE_DIARY"
	AuditActionUpdateProfile = "UPDATE_PROFILE"
	AuditActionEnable2FA     = "ENABLE_2FA"
	AuditActionDisable2FA    = "DISABLE_2FA"
	AuditActionExportData    = "EXPORT_DATA"
	AuditActionDeleteAccount = "DELETE_ACCOUNT"
)

// Resource type constants
const (
	ResourceTypeGoal  = "nutrition_goal"
	ResourceTypeDiary = "food_diary"
	ResourceTypeUser  = "user"
	ResourceTypeAuth  = "auth"
)

// GDPR types
type GDPRExportRequest struct {
	UserID    int64     `json:"user_id"`
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
}

type GDPRDeleteRequest struct {
	UserID    int64     `json:"user_id"`
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expires_at"`
	Confirmed bool      `json:"confirmed"`
}

type UserDataExport struct {
	User           *User            `json:"user"`
	NutritionGoals []*NutritionGoal `json:"nutrition_goals"`
	FoodDiaries    []*FoodDiary     `json:"food_diaries"`
	AuditLogs      []*AuditLog      `json:"audit_logs"`
	ExportedAt     time.Time        `json:"exported_at"`
}
