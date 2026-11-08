import { useState, useEffect } from 'react';
import { 
  Loader2, 
  Plus, 
  Sparkles, 
  Droplet, 
  Camera, 
  Upload, 
  Check, 
  Sun, 
  Sunrise, 
  Sunset, 
  Moon, 
  Leaf, 
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../lib/api';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface DiaryEntry {
  id: number;
  amount_consumed: number;
  consumed_at: string;
  meal_type: string;
  food_name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface DailySummary {
  TotalCalories: number;
  TotalProtein: number;
  TotalCarbs: number;
  TotalFat: number;
  Entries: DiaryEntry[];
}

export default function Home() {
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [waterAmount, setWaterAmount] = useState(1.8);
  const [habits, setHabits] = useState([
    { id: 1, title: 'Morning Herbal Infusion', done: true },
    { id: 2, title: 'Omega-3 & Vitamin D3', done: true },
    { id: 3, title: '10-Minute Mindful Dinner Walk', done: false }
  ]);

  const GOALS = {
    calories: 2200,
    protein: 140,
    carbs: 260,
    fat: 65,
    water: 2.5
  };

  const loadSummary = async () => {
    try {
      const data = await apiClient.get<DailySummary>('/diary/summary');
      setSummary(data);
    } catch {
      setSummary({
        TotalCalories: 1420,
        TotalProtein: 128,
        TotalCarbs: 115,
        TotalFat: 39,
        Entries: [
          { id: 1, food_name: 'Organic Rolled Oats with Blueberries & Chia Seeds', amount_consumed: 1, meal_type: 'breakfast', consumed_at: '2026-11-08T08:15:22Z', calories: 340, protein: 11, carbs: 58, fat: 6 },
          { id: 2, food_name: '2 Pasture-Raised Soft Boiled Eggs', amount_consumed: 2, meal_type: 'breakfast', consumed_at: '2026-11-08T08:22:45Z', calories: 180, protein: 14, carbs: 1, fat: 12 },
          { id: 3, food_name: 'Herb-Grilled Chicken Breast', amount_consumed: 1, meal_type: 'lunch', consumed_at: '2026-11-08T12:47:33Z', calories: 280, protein: 42, carbs: 0, fat: 6 },
          { id: 4, food_name: 'Steamed Jasmine Rice with Parsley', amount_consumed: 1, meal_type: 'lunch', consumed_at: '2026-11-08T12:55:18Z', calories: 210, protein: 4, carbs: 46, fat: 1 },
          { id: 5, food_name: 'Mixed Avocado Garden Salad with Lemon Vinaigrette', amount_consumed: 1, meal_type: 'lunch', consumed_at: '2026-11-08T13:02:10Z', calories: 120, protein: 2, carbs: 6, fat: 10 },
          { id: 6, food_name: 'Thick Greek Yogurt with Wildflower Honey & Crushed Almonds', amount_consumed: 1, meal_type: 'snack', consumed_at: '2026-11-08T15:30:08Z', calories: 290, protein: 18, carbs: 22, fat: 9 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const addWater = (amount: number) => {
    const updated = Math.min(GOALS.water, +(waterAmount + amount).toFixed(2));
    setWaterAmount(updated);
    toast.success(`Logged +${Math.round(amount * 1000)}ml natural water 💧`);
  };

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[380px] space-y-3 text-sm text-[#4b5563]">
        <Loader2 className="w-6 h-6 animate-spin text-[#15803d]" />
        <span>Loading daily nourishment journal...</span>
      </div>
    );
  }

  const consumedCal = summary?.TotalCalories || 1420;
  const remainingCal = Math.max(0, GOALS.calories - consumedCal);
  const calPercent = Math.min(100, Math.round((consumedCal / GOALS.calories) * 100));
  const waterPercent = Math.min(100, Math.round((waterAmount / GOALS.water) * 100));

  // SVG Circle calculations (radius = 50, circumference = 2 * PI * 50 = ~314)
  const strokeDashoffset = 314 * (1 - (calPercent / 100));

  return (
    <div className="space-y-8 antialiased text-[#1f2937]">
      
      {/* Main 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT COLUMN: Nutrition & Meal Journal (8 cols) ================= */}
        <section className="lg:col-span-8 space-y-8">
          
          {/* 1. Daily Energy & Calorie Balance Card (Stitch-designed) */}
          <div className="card-zen rounded-3xl p-6 sm:p-8 bg-[#fcfdf9]">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#f1f5f0]">
              
              {/* Radial Gauge & Calorie Counter */}
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      fill="transparent" 
                      stroke="#e2e8f0" 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                    />
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50" 
                      fill="transparent" 
                      stroke="#15803d" 
                      strokeWidth="10" 
                      strokeDasharray="314" 
                      strokeDashoffset={strokeDashoffset} 
                      strokeLinecap="round" 
                      className="transition-all duration-1000 ease-out" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-heading text-2xl font-bold text-[#1f2937] tracking-tight leading-none tabular-numbers">
                      {consumedCal}
                    </span>
                    <span className="text-[11px] text-[#6b7280] font-medium mt-0.5">
                      consumed
                    </span>
                  </div>
                </div>

                {/* Energy Headline & Badge */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
                      {remainingCal} kcal remaining
                    </span>
                    <span className="text-xs text-[#6b7280]">Goal: {GOALS.calories} kcal</span>
                  </div>
                  <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#1f2937] tracking-tight">
                    Daily Energy Balance
                  </h1>
                  <p className="text-xs text-[#4b5563] max-w-sm leading-relaxed">
                    You are gracefully paced for sustained vitality. Balanced nutrient density supports gentle recovery.
                  </p>
                </div>
              </div>

              {/* Active Burn Rhythm */}
              <div className="w-full md:w-auto flex md:flex-col justify-between items-end gap-1 bg-[#f8faf7] md:bg-transparent p-3 md:p-0 rounded-2xl">
                <div className="text-left md:text-right">
                  <span className="text-xs text-[#6b7280] block">Active Burn</span>
                  <span className="font-heading text-lg font-bold text-[#1f2937] tabular-numbers">420 kcal</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#15803d] font-semibold flex items-center md:justify-end gap-1">
                    <Leaf className="w-3.5 h-3.5 fill-[#15803d]" />
                    <span>Optimal rhythm</span>
                  </span>
                </div>
              </div>

            </div>

            {/* 3 Macro Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              
              {/* Protein */}
              <div className="p-4 rounded-2xl bg-[#f8faf7] border border-[#e5e7eb] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">
                    Protein
                  </span>
                  <span className="text-xs font-bold text-[#1f2937]">91%</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-heading text-xl font-bold text-[#1f2937] tabular-numbers">128g</span>
                  <span className="text-xs text-[#6b7280]">/ 140g</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e2e8f0] overflow-hidden mt-1">
                  <div className="h-full rounded-full bg-[#16a34a] transition-all duration-700" style={{ width: '91%' }} />
                </div>
                <span className="text-[11px] text-[#6b7280]">12g remaining</span>
              </div>

              {/* Carbs */}
              <div className="p-4 rounded-2xl bg-[#f8faf7] border border-[#e5e7eb] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                    Carbs
                  </span>
                  <span className="text-xs font-bold text-[#1f2937]">44%</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-heading text-xl font-bold text-[#1f2937] tabular-numbers">115g</span>
                  <span className="text-xs text-[#6b7280]">/ 260g</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e2e8f0] overflow-hidden mt-1">
                  <div className="h-full rounded-full bg-[#f59e0b] transition-all duration-700" style={{ width: '44%' }} />
                </div>
                <span className="text-[11px] text-[#6b7280]">145g remaining</span>
              </div>

              {/* Healthy Fats */}
              <div className="p-4 rounded-2xl bg-[#f8faf7] border border-[#e5e7eb] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#ecfccb] text-[#3f6212] border border-[#d9f99d]">
                    Healthy Fats
                  </span>
                  <span className="text-xs font-bold text-[#1f2937]">60%</span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-heading text-xl font-bold text-[#1f2937] tabular-numbers">39g</span>
                  <span className="text-xs text-[#6b7280]">/ 65g</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#e2e8f0] overflow-hidden mt-1">
                  <div className="h-full rounded-full bg-[#65a30d] transition-all duration-700" style={{ width: '60%' }} />
                </div>
                <span className="text-[11px] text-[#6b7280]">26g remaining</span>
              </div>

            </div>

            {/* Micronutrient Summary Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-5 border-t border-[#f1f5f0] text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#6b7280]">Micronutrients:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#f3f4f6] text-[#1f2937] font-medium">
                    Fiber: <strong className="text-[#15803d]">28g</strong>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f3f4f6] text-[#1f2937] font-medium">
                    Sodium: <strong>1,420mg</strong>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#f3f4f6] text-[#1f2937] font-medium">
                    Sugar: <strong>34g</strong>
                  </span>
                </div>
              </div>
              <span className="text-[#15803d] font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                Detailed Micronutrients <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>

          {/* 2. Today's Meal Journal Section */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-heading text-xl font-bold text-[#1f2937]">
                  Daily Food Journal
                </h2>
                <span className="px-3 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-xs font-semibold border border-[#bbf7d0]">
                  3 meals logged
                </span>
              </div>
            </div>

            {/* MEAL 1: Breakfast Card */}
            <div className="card-zen rounded-2xl p-5 bg-[#fcfdf9] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f6]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#92400e] flex items-center justify-center">
                    <Sunrise className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-base text-[#1f2937]">Breakfast</h3>
                      <span className="text-xs text-[#6b7280]">8:15 AM</span>
                    </div>
                    <span className="text-xs text-[#4b5563]">Recommended target: 450-550 kcal</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-heading font-bold text-base text-[#1f2937] tabular-numbers block">520 kcal</span>
                  <span className="text-xs text-[#6b7280]">P: 25g • C: 59g • F: 18g</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8faf7] transition-colors border border-transparent hover:border-[#e5e7eb]">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#15803d]" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1f2937]">Organic Rolled Oats with Blueberries & Chia Seeds</h4>
                      <span className="text-xs text-[#6b7280]">1 bowl (65g dry oats, 50g fresh blueberries, 10g chia)</span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-[#1f2937] block">340 kcal</span>
                    <span className="text-[#166534] font-medium">11g P</span> • <span className="text-[#6b7280]">58g C</span> • <span className="text-[#6b7280]">6g F</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8faf7] transition-colors border border-transparent hover:border-[#e5e7eb]">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#15803d]" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1f2937]">2 Pasture-Raised Soft Boiled Eggs</h4>
                      <span className="text-xs text-[#6b7280]">2 large eggs, sprinkled with sea salt & black pepper</span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-[#1f2937] block">180 kcal</span>
                    <span className="text-[#166534] font-medium">14g P</span> • <span className="text-[#6b7280]">1g C</span> • <span className="text-[#6b7280]">12g F</span>
                  </div>
                </div>
              </div>

              <Link
                to="/foods"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[#15803d] font-semibold text-xs bg-[#f0fdf4] hover:bg-[#dcfce7] transition-colors w-full border border-dashed border-[#bbf7d0]"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add to Breakfast</span>
              </Link>
            </div>

            {/* MEAL 2: Lunch Card */}
            <div className="card-zen rounded-2xl p-5 bg-[#fcfdf9] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f6]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#dcfce7] text-[#166534] flex items-center justify-center">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-base text-[#1f2937]">Lunch</h3>
                      <span className="text-xs text-[#6b7280]">12:45 PM</span>
                    </div>
                    <span className="text-xs text-[#4b5563]">Recommended target: 600-700 kcal</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-heading font-bold text-base text-[#1f2937] tabular-numbers block">610 kcal</span>
                  <span className="text-xs text-[#6b7280]">P: 48g • C: 52g • F: 17g</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8faf7] transition-colors border border-transparent hover:border-[#e5e7eb]">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#15803d]" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1f2937]">Herb-Grilled Chicken Breast</h4>
                      <span className="text-xs text-[#6b7280]">160g cooked portion, fresh rosemary & thyme</span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-[#1f2937] block">280 kcal</span>
                    <span className="text-[#166534] font-medium">42g P</span> • <span className="text-[#6b7280]">0g C</span> • <span className="text-[#6b7280]">6g F</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8faf7] transition-colors border border-transparent hover:border-[#e5e7eb]">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1f2937]">Steamed Jasmine Rice with Parsley</h4>
                      <span className="text-xs text-[#6b7280]">1 cup cooked (150g)</span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-[#1f2937] block">210 kcal</span>
                    <span className="text-[#166534] font-medium">4g P</span> • <span className="text-[#6b7280]">46g C</span> • <span className="text-[#6b7280]">1g F</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8faf7] transition-colors border border-transparent hover:border-[#e5e7eb]">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#65a30d]" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#1f2937]">Mixed Avocado Garden Salad with Lemon Vinaigrette</h4>
                      <span className="text-xs text-[#6b7280]">Tuscan kale, cucumber, 1/4 ripe avocado, extra virgin olive oil</span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-[#1f2937] block">120 kcal</span>
                    <span className="text-[#166534] font-medium">2g P</span> • <span className="text-[#6b7280]">6g C</span> • <span className="text-[#6b7280]">10g F</span>
                  </div>
                </div>
              </div>

              <Link
                to="/foods"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[#15803d] font-semibold text-xs bg-[#f0fdf4] hover:bg-[#dcfce7] transition-colors w-full border border-dashed border-[#bbf7d0]"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add to Lunch</span>
              </Link>
            </div>

            {/* MEAL 3: Afternoon Snack Card */}
            <div className="card-zen rounded-2xl p-5 bg-[#fcfdf9] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f6]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ecfccb] text-[#3f6212] flex items-center justify-center">
                    <Sunset className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-base text-[#1f2937]">Afternoon Snack</h3>
                      <span className="text-xs text-[#6b7280]">3:30 PM</span>
                    </div>
                    <span className="text-xs text-[#4b5563]">Recommended target: 200-300 kcal</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-heading font-bold text-base text-[#1f2937] tabular-numbers block">290 kcal</span>
                  <span className="text-xs text-[#6b7280]">P: 18g • C: 22g • F: 9g</span>
                </div>
              </div>

              <div className="p-3 rounded-xl hover:bg-[#f8faf7] transition-colors border border-transparent hover:border-[#e5e7eb] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#15803d]" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#1f2937]">Thick Greek Yogurt with Wildflower Honey & Crushed Almonds</h4>
                    <span className="text-xs text-[#6b7280]">170g nonfat Greek yogurt, 1 tsp raw honey, 15g roasted almonds</span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-[#1f2937] block">290 kcal</span>
                  <span className="text-[#166534] font-medium">18g P</span> • <span className="text-[#6b7280]">22g C</span> • <span className="text-[#6b7280]">9g F</span>
                </div>
              </div>

              <Link
                to="/foods"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[#15803d] font-semibold text-xs bg-[#f0fdf4] hover:bg-[#dcfce7] transition-colors w-full border border-dashed border-[#bbf7d0]"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Snack</span>
              </Link>
            </div>

            {/* MEAL 4: Dinner Card (Mindful Planned State) */}
            <div className="card-zen rounded-2xl p-6 bg-[#fcfdf9] border border-dashed border-[#bbf7d0] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f6]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f0fdf4] text-[#15803d] flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-base text-[#1f2937]">Dinner</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f3f4f6] text-[#4b5563] text-xs font-semibold">Planned</span>
                    </div>
                    <span className="text-xs text-[#4b5563]">Recommended target: 550-700 kcal</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-[#15803d]">~{remainingCal} kcal remaining</span>
                </div>
              </div>

              <div className="space-y-3 py-1">
                <p className="text-sm text-[#4b5563] italic">
                  “What are you nourishing yourself with tonight?”
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#6b7280]">Quick ideas:</span>
                  {['Pan-seared Salmon Bowl', 'Mediterranean Lentil Soup', 'Tofu Veggie Stir-Fry'].map(item => (
                    <button 
                      key={item}
                      onClick={() => toast.info(`Added ${item} suggestion to dinner plan`)}
                      className="px-3 py-1 rounded-full bg-[#f8faf7] hover:bg-[#dcfce7] text-[#1f2937] border border-[#e5e7eb] transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-[#15803d]" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Link
                  to="/foods"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-xs shadow-sm hover:shadow transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Log Dinner</span>
                </Link>
              </div>
            </div>

          </div>

        </section>

        {/* ================= RIGHT COLUMN: Mindful Utilities (4 cols) ================= */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* 1. Smart Meal Vision / Scanner Dropzone (Stitch-designed) */}
          <div className="card-zen rounded-3xl p-6 bg-[#fcfdf9] flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center ring-8 ring-[#f0fdf4]">
              <Camera className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-[#1f2937]">Smart Meal Vision</h3>
              <p className="text-xs text-[#4b5563] max-w-xs leading-relaxed">
                Snap your meal or upload a photo / barcode for instant mindful nutritional breakdown.
              </p>
            </div>

            <Link
              to="/scan"
              className="w-full border-2 border-dashed border-[#bbf7d0] rounded-2xl p-4 bg-[#f8faf7] hover:bg-[#f0fdf4] transition-colors flex flex-col items-center justify-center gap-2"
            >
              <Upload className="w-6 h-6 text-[#15803d]" />
              <span className="text-xs font-semibold text-[#1f2937]">Drag plate photo here or click</span>
              <span className="text-[10px] text-[#6b7280]">Supports JPG, PNG, HEIC</span>
            </Link>

            <div className="grid grid-cols-2 gap-3 w-full">
              <Link
                to="/scan"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0] text-xs font-semibold transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </Link>
              <Link
                to="/scan"
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-[#f3f4f6] text-[#1f2937] hover:bg-[#e5e7eb] text-xs font-semibold transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload File</span>
              </Link>
            </div>
          </div>

          {/* 2. Daily Hydration Ritual Card */}
          <div className="card-zen rounded-3xl p-6 bg-[#fcfdf9] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
                  <Droplet className="w-5 h-5 fill-[#0284c7]" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-base text-[#1f2937]">Hydration Ritual</h3>
                  <span className="text-xs text-[#6b7280]">Natural mineral water</span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#e0f2fe] text-[#0369a1] text-xs font-bold">
                {waterPercent}%
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#f0f9ff] border border-[#bae6fd]">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-2xl font-bold text-[#1f2937] tabular-numbers">{waterAmount}L</span>
                  <span className="text-xs text-[#6b7280]">/ {GOALS.water}L Goal</span>
                </div>
                <span className="text-xs text-[#0369a1] font-medium mt-0.5 block">
                  {+(GOALS.water - waterAmount).toFixed(2)}L remaining today
                </span>
              </div>

              {/* Water bottle mini progress */}
              <div className="w-12 h-20 rounded-xl border-2 border-[#38bdf8] p-0.5 relative overflow-hidden bg-white/70 flex flex-col justify-end shadow-inner">
                <div 
                  className="w-full bg-[#38bdf8] rounded-b-lg transition-all duration-500 relative flex items-center justify-center" 
                  style={{ height: `${waterPercent}%` }}
                >
                  <span className="text-[9px] font-bold text-white leading-none">{waterPercent}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => addWater(0.25)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-white border border-[#e5e7eb] hover:border-[#38bdf8] hover:bg-[#f0f9ff] text-[#1f2937] text-xs font-semibold transition-all"
              >
                <Droplet className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>+250 ml (Glass)</span>
              </button>
              <button 
                onClick={() => addWater(0.50)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-white border border-[#e5e7eb] hover:border-[#38bdf8] hover:bg-[#f0f9ff] text-[#1f2937] text-xs font-semibold transition-all"
              >
                <Droplet className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>+500 ml (Bottle)</span>
              </button>
            </div>
          </div>

          {/* 3. Wholesome Nutrition Insight / Mindful Tip Card */}
          <div className="rounded-3xl p-6 bg-[#ecfdf5] border border-[#bbf7d0] space-y-3 relative shadow-sm">
            <div className="flex items-center gap-2.5 text-[#166534]">
              <Sparkles className="w-5 h-5" />
              <span className="font-heading font-bold text-sm tracking-tight">Mindful Nourishment Tip</span>
            </div>
            <p className="text-xs text-[#4b5563] leading-relaxed">
              Balanced fiber intake with your afternoon snack helps stabilize blood sugar and maintains steady evening focus without mid-day energy dips.
            </p>
            <div className="pt-2 border-t border-[#bbf7d0]/60 flex items-center justify-between text-xs">
              <span className="text-[#15803d] font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                Read 2-min read on glucose balance <ArrowRight className="w-3 h-3" />
              </span>
              <span className="text-[#15803d]/70 font-medium text-[11px]">Daily Ritual</span>
            </div>
          </div>

          {/* 4. Daily Mindful Habits Micro Checklist */}
          <div className="card-zen rounded-3xl p-5 bg-[#fcfdf9] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f0]">
              <span className="font-heading font-semibold text-sm text-[#1f2937]">Daily Mindful Habits</span>
              <span className="text-xs text-[#6b7280]">
                {habits.filter(h => h.done).length}/{habits.length} Done
              </span>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => (
                <div 
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f8faf7] transition-colors cursor-pointer select-none"
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    habit.done 
                      ? 'bg-[#15803d] border-[#15803d] text-white' 
                      : 'border-[#d1d5db] bg-white'
                  }`}>
                    {habit.done && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className={`text-xs ${habit.done ? 'line-through text-[#6b7280]' : 'text-[#1f2937] font-medium'}`}>
                    {habit.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
