import { create } from 'zustand';
import { fetchApi } from '../lib/api';

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
      // The backend uses /foods/search?q=
      // If query is empty, maybe /foods/search (it should handle empty q)
      const url = `/foods/search?q=${encodeURIComponent(get().searchQuery)}`;
        
      const response = await fetchApi(url);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const json = await response.json();
      set({ foods: json.data || [], isLoading: false });
      
    } catch (error) {
      console.error('Failed to fetch foods', error);
      set({ foods: [], isLoading: false });
    }
  }
}));
