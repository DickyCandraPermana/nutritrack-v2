import { useEffect, useRef } from 'react';
import { Search, Plus, Database, Sparkles, Loader2 } from 'lucide-react';
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
      toast.success(`Logged 1 serving of ${food.name} to Lunch diary`);
    } catch {
      toast.error(`Failed to log ${food.name} to diary`);
    }
  };

  return (
    <div className="space-y-6 antialiased">
      
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1f2e47]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>RELATIONAL NUTRITIONAL REGISTRY</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
            Food Nutrient Catalog
          </h1>
        </div>

        {/* Search Bar with Keyboard Shortcut */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search verified nutrients (press '/' to focus)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111b2d] border border-[#1f2e47] rounded-lg py-2 pl-9 pr-8 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#0e1626] border border-[#1f2e47] rounded">
            /
          </kbd>
        </div>
      </div>

      {/* Catalog Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3 font-mono text-xs text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          <span>QUERYING POSTGRESQL REGISTRY...</span>
        </div>
      ) : foods.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food) => (
            <div 
              key={food.id} 
              className="clinical-card p-5 flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-heading font-semibold text-base text-white capitalize truncate">
                    {food.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141f33] border border-[#1f2e47] text-slate-400 shrink-0">
                    ID {food.id}
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-400">
                  Standard Baseline: <span className="text-slate-200 font-semibold tnum">100g</span>
                </p>
              </div>

              {/* Macro Quadrant */}
              <div className="grid grid-cols-4 gap-2 py-3 px-3 bg-[#0e1626] rounded-lg border border-[#1f2e47] text-center font-mono">
                <div>
                  <div className="text-[10px] uppercase text-slate-500">Cal</div>
                  <div className="text-xs font-bold text-emerald-400 tnum">{food.calories || 0}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500">Prot</div>
                  <div className="text-xs font-bold text-teal-300 tnum">{food.protein || 0}g</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500">Lipid</div>
                  <div className="text-xs font-bold text-amber-300 tnum">{food.fat || 0}g</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500">Carb</div>
                  <div className="text-xs font-bold text-blue-300 tnum">{food.carbs || 0}g</div>
                </div>
              </div>

              {/* Quick Action Button */}
              <button
                onClick={() => handleQuickLog(food)}
                className="w-full py-2 px-3 rounded-md bg-[#162238] hover:bg-emerald-500 hover:text-[#002113] text-slate-300 border border-[#263854] hover:border-emerald-500 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all group-hover:border-emerald-500/40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log 1 Serving to Diary</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="clinical-card p-12 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="font-heading font-semibold text-white">No food entities found</h3>
          <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
            No matching nutrients found for "{searchQuery}". Try searching for generic items like "egg", "apple", "rice", or "beef".
          </p>
        </div>
      )}
    </div>
  );
}
