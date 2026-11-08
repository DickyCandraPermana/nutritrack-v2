import { useEffect, useRef } from 'react';
import { Search, Plus, Sparkles, Loader2, Leaf } from 'lucide-react';
import { useFoodStore } from '../store/useFoodStore';
import { toast } from 'sonner';
import { apiClient } from '../lib/api';

export default function Foods() {
  const { foods, isLoading, searchQuery, setSearchQuery, fetchFoods } = useFoodStore();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFoods();
  }, [searchQuery, fetchFoods]);

  // Keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleQuickLog = async (food: any) => {
    try {
      await apiClient.post('/diary', {
        food_id: food.id,
        amount_consumed: 1,
        meal_type: 'lunch'
      });
      toast.success(`Logged 1 serving of ${food.name} to Lunch journal 🥗`);
    } catch {
      toast.error(`Failed to log ${food.name} to journal`);
    }
  };

  return (
    <div className="space-y-6 antialiased text-[#1f2937]">
      
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e5e7eb]">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#15803d] font-semibold mb-1">
            <Leaf className="w-3.5 h-3.5 fill-[#15803d]" />
            <span>WHOLE FOODS & NUTRIENT CATALOG</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-[#1f2937] tracking-tight">
            Nourishing Foods Directory
          </h1>
        </div>

        {/* Search Bar with Keyboard Shortcut */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search verified foods (press '/' to focus)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#e5e7eb] rounded-full py-2.5 pl-10 pr-9 text-xs text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10 transition-all shadow-sm"
          />
          <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] text-[#6b7280] bg-[#f3f4f6] border border-[#e5e7eb] rounded">
            /
          </kbd>
        </div>
      </div>

      {/* Catalog Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3 text-xs text-[#6b7280]">
          <Loader2 className="w-6 h-6 animate-spin text-[#15803d]" />
          <span>Searching botanical nutrient registry...</span>
        </div>
      ) : foods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {foods.map((food) => (
            <div 
              key={food.id} 
              className="card-zen rounded-2xl p-5 bg-[#fcfdf9] flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-heading font-semibold text-base text-[#1f2937] capitalize truncate">
                    {food.name}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] shrink-0 font-medium">
                    100g serving
                  </span>
                </div>
                <p className="text-xs text-[#6b7280]">
                  Standard nutritional density reference
                </p>
              </div>

              {/* Macro Quadrant */}
              <div className="grid grid-cols-4 gap-2 py-2.5 px-3 bg-[#f8faf7] rounded-xl border border-[#e5e7eb] text-center">
                <div>
                  <div className="text-[10px] uppercase text-[#6b7280] font-medium">Cal</div>
                  <div className="text-xs font-bold text-[#1f2937] tabular-numbers">{food.calories || 0}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-[#166534] font-medium">Prot</div>
                  <div className="text-xs font-bold text-[#15803d] tabular-numbers">{food.protein || 0}g</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-[#92400e] font-medium">Carb</div>
                  <div className="text-xs font-bold text-[#d97706] tabular-numbers">{food.carbs || 0}g</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-[#3f6212] font-medium">Fat</div>
                  <div className="text-xs font-bold text-[#65a30d] tabular-numbers">{food.fat || 0}g</div>
                </div>
              </div>

              {/* Quick Action Button */}
              <button
                onClick={() => handleQuickLog(food)}
                className="w-full py-2 px-3 rounded-full bg-[#f0fdf4] hover:bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add to Daily Journal</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-zen rounded-3xl p-12 text-center space-y-3 bg-[#fcfdf9]">
          <Sparkles className="w-8 h-8 text-[#9ca3af] mx-auto" />
          <h3 className="font-heading font-semibold text-[#1f2937]">No whole food items found</h3>
          <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
            No matching nutrients found for "{searchQuery}". Try searching for natural items like "oats", "salmon", "banana", or "egg".
          </p>
        </div>
      )}
    </div>
  );
}
