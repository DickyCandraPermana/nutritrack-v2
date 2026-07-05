package helper

import "math"

// PaginationParams represents input pagination parameters
type PaginationParams struct {
	Page    int
	PerPage int
}

// Pagination represents pagination metadata in response
type Pagination struct {
	Page       int   `json:"page"`
	PerPage    int   `json:"per_page"`
	Total      int64 `json:"total"`
	TotalPages int64 `json:"total_pages"`
	HasNext    bool  `json:"has_next"`
	HasPrev    bool  `json:"has_prev"`
}

// PaginatedResponse wraps data with pagination metadata
type PaginatedResponse struct {
	Data       interface{} `json:"data"`
	Pagination *Pagination `json:"pagination"`
}

// Constants
const (
	DefaultPageSize = 20
	MaxPageSize     = 100
	MinPageSize     = 1
)

// ParsePaginationParams parses and validates pagination parameters
func ParsePaginationParams(page, perPage int) PaginationParams {
	// Validate page
	if page < 1 {
		page = 1
	}

	// Validate per_page
	if perPage < MinPageSize {
		perPage = DefaultPageSize
	}
	if perPage > MaxPageSize {
		perPage = MaxPageSize
	}

	return PaginationParams{
		Page:    page,
		PerPage: perPage,
	}
}

// NewPagination creates pagination metadata
func NewPagination(params PaginationParams, total int64) *Pagination {
	totalPages := int64(math.Ceil(float64(total) / float64(params.PerPage)))

	return &Pagination{
		Page:       params.Page,
		PerPage:    params.PerPage,
		Total:      total,
		TotalPages: totalPages,
		HasNext:    int64(params.Page) < totalPages,
		HasPrev:    params.Page > 1,
	}
}

// GetOffset calculates database OFFSET from page and per_page
func (p PaginationParams) GetOffset() int {
	return (p.Page - 1) * p.PerPage
}

// GetLimit returns per_page as LIMIT
func (p PaginationParams) GetLimit() int {
	return p.PerPage
}

// NewPaginatedResponse creates paginated response
func NewPaginatedResponse(data interface{}, pagination *Pagination) *PaginatedResponse {
	return &PaginatedResponse{
		Data:       data,
		Pagination: pagination,
	}
}
