import { useState, useEffect } from 'react';
import { Activity, Flame, Droplets, Target, Loader2 } from 'lucide-react';
import { fetchApi } from '../lib/api';
import useAuthStore from '../store/authStore';

interface DailySummary {
  TotalCalories: number;
  TotalProtein: number;
  TotalCarbs: number;
  TotalFat: number;
  Entries: Array<{
    id: number;
    amount_consumed: number;
    consumed_at: string;
    meal_type: string;
    food_name: string;
  }>;
}

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dummy goals for now (can be fetched from user goals)
  const GOALS = {
    calories: 2200,
    protein: 150,
    carbs: 250,
    fat: 70,
  };

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const res = await fetchApi('/diary/summary');
        if (!res.ok) throw new Error('Failed to fetch summary');
        const data = await res.json();
        setSummary(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-semibold text-slate-100">Welcome back, {user?.username || 'User'}!</h2>
          <p className="text-slate-400 mt-1">Here is your nutrition summary for today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Daily Goal</p>
          <p className="text-emerald-400 font-semibold text-xl">{GOALS.calories} kcal</p>
        </div>
      </header>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Calories', current: summary?.TotalCalories || 0, max: GOALS.calories, unit: 'kcal', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Protein', current: summary?.TotalProtein || 0, max: GOALS.protein, unit: 'g', icon: Activity, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Carbs', current: summary?.TotalCarbs || 0, max: GOALS.carbs, unit: 'g', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Fat', current: summary?.TotalFat || 0, max: GOALS.fat, unit: 'g', icon: Droplets, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        ].map((macro, i) => (
          <div key={macro.label} className="glass-card rounded-2xl p-5 flex flex-col relative overflow-hidden" style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[40px] opacity-20 ${macro.bg.replace('/10', '')}`} />
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${macro.bg}`}>
                <macro.icon className={`w-5 h-5 ${macro.color}`} />
              </div>
              <span className="text-sm font-medium text-slate-300">{macro.label}</span>
            </div>
            
            <div className="flex items-end gap-1">
              <span className="text-3xl font-bold text-slate-100">{macro.current}</span>
              <span className="text-sm text-slate-500 mb-1">/ {macro.max} {macro.unit}</span>
            </div>
            
            <div className="mt-4 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${macro.bg.replace('/10', '')}`} 
                style={{ width: `${Math.min((macro.current / macro.max) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="glass-card rounded-3xl p-6 md:col-span-2">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Recent Meals</h3>
          <div className="space-y-4">
            {summary?.Entries && summary.Entries.length > 0 ? (
              summary.Entries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-2xl">
                      {entry.meal_type === 'breakfast' ? '🍳' : entry.meal_type === 'lunch' ? '🥗' : '🍱'}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">{entry.food_name || 'Unknown Food'}</h4>
                      <p className="text-sm text-slate-400 capitalize">{entry.meal_type} • {new Date(entry.consumed_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-emerald-400">{entry.amount_consumed} servings</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No meals logged today.</p>
            )}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-slate-100 mb-4">Hydration</h3>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500/20 flex flex-col items-center justify-center relative mb-4">
              <div className="absolute bottom-0 w-full bg-blue-500/20 rounded-b-full h-[60%]" />
              <Droplets className="w-8 h-8 text-blue-400 mb-1 z-10" />
              <span className="text-2xl font-bold text-slate-100 z-10">1.2<span className="text-sm text-slate-400">L</span></span>
            </div>
            <p className="text-slate-400 text-sm">Goal: 2.5 Liters</p>
          </div>
        </div>
      </div>
    </div>
  );
}
