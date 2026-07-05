package helper

import (
	"strconv"

	"github.com/jackc/pgx/v5/pgtype"
)

func Float64ToNumeric(f float64) pgtype.Numeric {
	var num pgtype.Numeric
	str := strconv.FormatFloat(f, 'f', -1, 64)
	num.Scan(str)
	return num
}

func NumericToFloat64(num pgtype.Numeric) float64 {
	if !num.Valid {
		return 0
	}
	val, err := num.Value()
	if err != nil {
		return 0
	}
	if str, ok := val.(string); ok {
		f, _ := strconv.ParseFloat(str, 64)
		return f
	}
	return 0
}

func Float64PtrToNumeric(f *float64) pgtype.Numeric {
	if f == nil {
		return pgtype.Numeric{Valid: false}
	}
	return Float64ToNumeric(*f)
}

func NumericToFloat64Ptr(num pgtype.Numeric) *float64 {
	if !num.Valid {
		return nil
	}
	f := NumericToFloat64(num)
	return &f
}
