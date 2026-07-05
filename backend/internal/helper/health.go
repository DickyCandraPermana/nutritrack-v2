package helper

import (
	"math"

	"nutritrack.com/backend/internal/domain"
)

func GetUserSummary(user *domain.User) *domain.UserHealthSum {
	bmi := getBMI(*user.Height, *user.Weight)
	bmr := getBMR(*user.Gender, *user.Height, *user.Weight, float64(user.GetAge()))
	tdee := getTDEE(bmr, *user.ActivityLevel)
	neededCarbs, neededProtein, neededFat := getNeededNutrients(tdee)

	sum := &domain.UserHealthSum{
		Bmi:           bmi,
		Bmr:           bmr,
		Tdee:          tdee,
		ProteinNeeded: neededProtein,
		CarbsNeeded:   neededCarbs,
		FatNeeded:     neededFat,
	}

	return sum
}

func getBMI(height, weight float64) string {
	heightInMeters := height / 100
	bmi := weight / math.Pow(heightInMeters, 2)

	var result string

	switch {
	case bmi < 17.5:
		result = "kurus"
	case bmi >= 17.5 && bmi < 23:
		result = "normal"
	case bmi >= 23 && bmi < 25:
		result = "gemuk"
	case bmi >= 25 && bmi < 30:
		result = "obesitas i"
	case bmi >= 30:
		result = "obesitas ii"
	}

	return result
}

func getBMR(gender string, height, weight, age float64) float64 {
	var result float64

	var genVar float64

	switch gender {
	case "male":
		genVar = 5
	case "female":
		genVar = -161
	}

	result = (10 * weight) + (6.25 * height) - (5 * age) + genVar

	return result
}

func getTDEE(bmr float64, activityLevel int) float64 {
	var variable float64
	switch activityLevel {
	case 1:
		variable = 1.2
	case 2:
		variable = 1.375
	case 3:
		variable = 1.55
	case 4:
		variable = 1.725
	case 5:
		variable = 1.9
	default:
		variable = 1.2
	}

	return bmr * variable
}

func getNeededNutrients(tdee float64) (float64, float64, float64) {
	neededProtein := tdee * 0.5 / 4
	neededCarbs := tdee * 0.2 / 4
	neededFat := tdee * 0.3 / 9

	return neededCarbs, neededProtein, neededFat
}
