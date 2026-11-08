import { create } from 'zustand';
import { apiClient, ApiError } from '../lib/api';

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  imageUrl?: string;
}

interface FoodSearchResponse {
  data?: Food[];
}

interface FoodState {
  foods: Food[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchFoods: () => Promise<void>;
}

export const useFoodStore = create<FoodState>((set, get) => ({
  foods: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  fetchFoods: async () => {
    set({ isLoading: true, error: null });
    try {
      const url = `/foods/search?q=${encodeURIComponent(get().searchQuery)}`;
      const response = await apiClient.get<FoodSearchResponse>(url);

      set({
        foods: response.data ?? [],
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : 'An unexpected error occurred while fetching foods';

      console.error('Failed to fetch foods', error);
      set({
        foods: [],
        isLoading: false,
        error: errorMessage,
      });
    }
  },
}));
