package mapper

import "nutritrack.com/backend/internal/domain"

func UserToUserResponse(user *domain.User) *domain.UserResponse {
	res := &domain.UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Email:    user.Email,
	}

	if user.Weight != nil {
		res.Weight = user.Weight
	}

	if user.Height != nil {
		res.Height = user.Height
	}

	if user.DateOfBirth != nil {
		res.DateOfBirth = user.DateOfBirth
	}

	if user.ActivityLevel != nil {
		res.ActivityLevel = user.ActivityLevel
	}

	if user.Gender != nil {
		res.Gender = user.Gender
	}

	return res
}

func CreateDiaryInputToFoodDiary(input *domain.DiaryCreateInput) *domain.FoodDiary {
	return &domain.FoodDiary{
		UserID:         input.UserID,
		FoodID:         input.FoodID,
		AmountConsumed: input.AmountConsumed,
		ConsumedAt:     input.ConsumedAt,
		MealType:       input.MealType,
	}
}

func UpdateDiaryInputToFoodDiary(input *domain.DiaryUpdateInput) *domain.FoodDiary {
	res := &domain.FoodDiary{
		ID:             input.ID,
		AmountConsumed: *input.AmountConsumed,
		ConsumedAt:     *input.ConsumedAt,
		MealType:       *input.MealType,
	}

	return res
}

func CreateFoodInputToFood(input *domain.CreateFoodInput) *domain.Food {
	food := &domain.Food{
		Name:        input.Name,
		Description: input.Description,
		ServingSize: input.ServingSize,
		ServingUnit: input.ServingUnit,
	}

	return food
}
