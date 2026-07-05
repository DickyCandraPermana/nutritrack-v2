import { create } from 'zustand';

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  imageUrl?: string;
}

interface FoodState {
  foods: Food[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchFoods: () => Promise<void>;
}

export const useFoodStore = create<FoodState>((set, get) => ({
  foods: [],
  isLoading: false,
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  fetchFoods: async () => {
    set({ isLoading: true });
    try {
      const url = get().searchQuery 
        ? `/api/v1/foods?q=${encodeURIComponent(get().searchQuery)}`
        : '/api/v1/foods';
        
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      set({ foods: data, isLoading: false });
      
    } catch (error) {
      console.error('Failed to fetch foods', error);
      set({ isLoading: false });
    }
  }
}));
