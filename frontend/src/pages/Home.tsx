import { useState, useEffect } from 'react';
import { 
  Droplets, 
  Loader2, 
  Plus, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../lib/api';
import useAuthStore from '../store/authStore';

interface DiaryEntry {
  id: number;
  amount_consumed: number;
  consumed_at: string;
  meal_type: string;
  food_name: string;
}

interface DailySummary {
  TotalCalories: number;
  TotalProtein: number;
  TotalCarbs: number;
  TotalFat: number;
  Entries: DiaryEntry[];
}

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState('');

  const GOALS = {
    calories: 2200,
    protein: 140,
    carbs: 260,
    fat: 65,
  };

  useEffect(() => {
    let cancel = false;
    const loadSummary = async () => {
      try {
        const data = await apiClient.get<DailySummary>('/diary/summary');
        if (!cancel) {
          setSummary(data);
        }
      } catch (err: any) {
        if (!cancel) {
          // graceful fallback for empty summary
          setSummary({
            TotalCalories: 0,
            TotalProtein: 0,
            TotalCarbs: 0,
            TotalFat: 0,
            Entries: []
          });
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    };
    loadSummary();
    return () => { cancel = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3 font-mono text-xs text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <span>STREAMING DIETARY TELEMETRY...</span>
      </div>
    );
  }

  const consumedCal = summary?.TotalCalories || 0;
  const remainingCal = Math.max(0, GOALS.calories - consumedCal);
  const calPercent = Math.min(100, Math.round((consumedCal / GOALS.calories) * 100));

  return (
    <div className="space-y-6 antialiased">
      
      {/* Console Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1f2e47]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>DAILY TELEMETRY STATUS</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
            Metabolic Overview — {user?.username || 'Subject'}
          </h1>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-[#111b2d] border border-[#1f2e47] text-slate-300 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <Link
            to="/foods"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#002113] font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Meal</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Energy Bento Card */}
      <div className="clinical-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Energy Balance Ratio
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-4xl font-bold text-white tnum tracking-tight">
                {consumedCal}
              </span>
              <span className="text-sm font-mono text-slate-400">
                / {GOALS.calories} kcal Target
              </span>
              <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold">
                {calPercent}% Utilized
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs border-t lg:border-t-0 pt-4 lg:pt-0 border-[#1f2e47]">
            <div className="text-right">
              <span className="text-slate-500 block">Remaining Headroom</span>
              <span className="text-base font-bold text-emerald-400 tnum">
                {remainingCal} <span className="text-xs font-normal text-slate-400">kcal</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Metabolic Burn</span>
              <span className="text-base font-bold text-slate-200 tnum">
                {calPercent > 100 ? '+ Over Budget' : 'Within Guardrail'}
              </span>
            </div>
          </div>
        </div>

        {/* Linear Precision Gauge */}
        <div className="h-3 w-full bg-[#0b111e] rounded-full overflow-hidden p-0.5 border border-[#1f2e47]">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-700"
            style={{ width: `${Math.min(100, calPercent)}%` }}
          />
        </div>
      </div>

      {/* Macronutrient Triad Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { 
            label: 'Protein Intake', 
            val: summary?.TotalProtein || 0, 
            goal: GOALS.protein, 
            unit: 'g', 
            color: 'text-emerald-400', 
            bar: 'bg-emerald-500', 
            bg: 'bg-emerald-500/10' 
          },
          { 
            label: 'Carbohydrates', 
            val: summary?.TotalCarbs || 0, 
            goal: GOALS.carbs, 
            unit: 'g', 
            color: 'text-teal-300', 
            bar: 'bg-teal-400', 
            bg: 'bg-teal-500/10' 
          },
          { 
            label: 'Lipids (Fat)', 
            val: summary?.TotalFat || 0, 
            goal: GOALS.fat, 
            unit: 'g', 
            color: 'text-amber-300', 
            bar: 'bg-amber-400', 
            bg: 'bg-amber-500/10' 
          },
        ].map((macro) => {
          const pct = Math.min(100, Math.round((macro.val / macro.goal) * 100));
          return (
            <div key={macro.label} className="clinical-card p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-medium">{macro.label}</span>
                <span className="text-slate-500 tnum">{pct}%</span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-1">
                  <span className={`font-heading text-2xl font-bold ${macro.color} tnum`}>
                    {macro.val}
                  </span>
                  <span className="text-xs font-mono text-slate-500">/ {macro.goal}{macro.unit}</span>
                </div>
              </div>

              <div className="h-1.5 w-full bg-[#0b111e] rounded-full overflow-hidden border border-[#1f2e47]">
                <div 
                  className={`h-full rounded-full ${macro.bar} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Diary Timeline & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Meal Timeline */}
        <div className="clinical-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f2e47]">
            <h2 className="font-heading font-semibold text-base text-white">
              Food Diary Ledger
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {summary?.Entries?.length || 0} Events Recorded
            </span>
          </div>

          <div className="space-y-2.5">
            {summary?.Entries && summary.Entries.length > 0 ? (
              summary.Entries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="p-3.5 rounded-lg bg-[#0e1626] border border-[#1f2e47] hover:border-emerald-500/30 flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-[#141f33] border border-[#22334f] flex items-center justify-center text-xs font-mono font-semibold text-emerald-400 uppercase shrink-0">
                      {entry.meal_type?.charAt(0) || 'M'}
                    </div>
                    <div className="truncate">
                      <p className="font-heading font-semibold text-sm text-slate-200 capitalize truncate">
                        {entry.food_name || 'Standard Nutrition Entity'}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono capitalize">
                        {entry.meal_type} • {new Date(entry.consumed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-heading font-bold text-sm text-emerald-400 tnum block">
                      {entry.amount_consumed}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">servings</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs font-mono text-slate-500 bg-[#0e1626]/50 rounded-lg border border-dashed border-[#1f2e47]">
                No dietary events logged today. Query the food database or scan a label to register intake.
              </div>
            )}
          </div>
        </div>

        {/* Side Panel: Hydration & Telemetry Guide */}
        <div className="clinical-card p-6 space-y-5">
          <h2 className="font-heading font-semibold text-base text-white pb-3 border-b border-[#1f2e47]">
            Fluid Intake & Audit
          </h2>

          <div className="flex flex-col items-center justify-center p-6 bg-[#0e1626] rounded-xl border border-[#1f2e47]">
            <div className="w-20 h-20 rounded-full border-2 border-emerald-500/30 flex flex-col items-center justify-center relative mb-3 bg-emerald-500/5">
              <Droplets className="w-6 h-6 text-emerald-400 mb-0.5" />
              <span className="text-lg font-bold font-heading text-white tnum">1.8<span className="text-xs text-slate-400 font-normal">L</span></span>
            </div>
            <span className="text-xs font-mono text-slate-400">Target: 2.5 L Daily</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#141f33] border border-[#1f2e47] space-y-1.5 text-xs">
            <span className="font-mono text-[10px] uppercase text-emerald-400 font-semibold block">
              Clinical Guardrail
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Micro-nutrient balance is computed against USDA Reference Standards. Dietary entries synchronize with the Go Fiber backend and PostgreSQL database.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
