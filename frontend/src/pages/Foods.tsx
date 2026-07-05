import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { useFoodStore } from '../store/useFoodStore';

export default function Foods() {
  const { foods, isLoading, searchQuery, setSearchQuery, fetchFoods } = useFoodStore();

  useEffect(() => {
    fetchFoods();
  }, [searchQuery, fetchFoods]);

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Food Catalog</h2>
          <p className="text-slate-400 mt-1">Discover and track nutritional information</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search foods..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass rounded-2xl h-40 animate-pulse bg-slate-800/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            <div key={food.id} className="glass group rounded-2xl p-5 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
              
              <h3 className="text-xl font-semibold text-slate-100 mb-4">{food.name}</h3>
              
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-1">Calories</div>
                  <div className="text-lg font-bold text-emerald-400">{food.calories} <span className="text-xs font-normal text-slate-500">kcal</span></div>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-1">Protein</div>
                  <div className="text-lg font-bold text-teal-400">{food.protein} <span className="text-xs font-normal text-slate-500">g</span></div>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-1">Fat</div>
                  <div className="text-lg font-bold text-yellow-400">{food.fat} <span className="text-xs font-normal text-slate-500">g</span></div>
                </div>
                <div className="bg-slate-900/40 rounded-xl p-3 border border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-1">Carbs</div>
                  <div className="text-lg font-bold text-blue-400">{food.carbs} <span className="text-xs font-normal text-slate-500">g</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
