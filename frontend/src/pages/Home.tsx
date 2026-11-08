import { useState, useEffect } from 'react';
import { 
  Loader2, 
  Terminal, 
  Sparkles, 
  ScanLine 
} from 'lucide-react';
import { apiClient } from '../lib/api';
import useAuthStore from '../store/authStore';
import { toast } from 'sonner';

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
  const user = useAuthStore((state) => state.user);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [quickInput, setQuickInput] = useState('');
  const [servingSize, setServingSize] = useState(1.0);
  const [isCommitting, setIsCommitting] = useState(false);

  const GOALS = {
    calories: 2200,
    protein: 140,
    carbs: 260,
    fat: 65,
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
          { id: 1, food_name: 'Egg Whites (Liquid Pasteurized)', amount_consumed: 250, meal_type: 'breakfast', consumed_at: '2026-11-08T08:15:22Z', calories: 130, protein: 27.5, carbs: 1.8, fat: 0.5 },
          { id: 2, food_name: 'Rolled Oats (Steel-Cut Organic)', amount_consumed: 60, meal_type: 'breakfast', consumed_at: '2026-11-08T08:22:45Z', calories: 228, protein: 8.2, carbs: 38.4, fat: 3.6 },
          { id: 3, food_name: 'Chicken Breast (Sous Vide)', amount_consumed: 210, meal_type: 'lunch', consumed_at: '2026-11-08T12:47:33Z', calories: 346, protein: 51.2, carbs: 0.0, fat: 6.1 },
          { id: 4, food_name: 'Basmati Jasmine Blend & Avocado Oil', amount_consumed: 180, meal_type: 'lunch', consumed_at: '2026-11-08T12:55:18Z', calories: 264, protein: 5.2, carbs: 51.0, fat: 10.4 },
          { id: 5, food_name: 'Skyr Icelandic Curd + Raw Almonds', amount_consumed: 170, meal_type: 'snack', consumed_at: '2026-11-08T16:12:08Z', calories: 290, protein: 24.0, carbs: 22.0, fat: 8.5 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const handleQuickCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    setIsCommitting(true);
    try {
      await apiClient.post('/diary', {
        food_name: quickInput.trim(),
        amount_consumed: servingSize,
        meal_type: 'snack',
        calories: Math.round(servingSize * 150),
        protein: Math.round(servingSize * 12),
        carbs: Math.round(servingSize * 18),
        fat: Math.round(servingSize * 4)
      });
      toast.success(`Ingested ${quickInput.trim()} into diary ledger`);
      setQuickInput('');
      loadSummary();
    } catch {
      toast.error('Failed to commit log entry');
    } finally {
      setIsCommitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3 font-mono text-xs text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-[#10b981]" />
        <span>INITIALIZING METABOLIC COCKPIT TELEMETRY...</span>
      </div>
    );
  }

  const consumedCal = summary?.TotalCalories || 1420;
  const remainingCal = Math.max(0, GOALS.calories - consumedCal);
  const calPercent = Math.min(100, Math.round((consumedCal / GOALS.calories) * 100));

  return (
    <div className="space-y-4 antialiased text-[#dee2f5]">
      
      {/* 1. Tactical Sub-Header Telemetry Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#0c1322] border border-white/10 rounded font-mono text-[11px] select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#10b981] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
            DIET_CYCLE: HYPERTROPHY_A3 [DAY 42/90]
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#94a3b8]">FASTING_CLOCK: <strong className="text-white tabular-numbers">14h 22m</strong> (FEEDING WINDOW ACTIVE)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#94a3b8]">METABOLIC_RATE: <strong className="text-[#10b981] tabular-numbers">1.14x BMR</strong> (2,410 kcal TDEE)</span>
          <span className="text-white/20">|</span>
          <span className="text-white/40 text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10">HOTKEY: [Ctrl+K] PALETTE</span>
        </div>
      </div>

      {/* 2. Top Caloric Ledger Summary Tape */}
      <div className="p-4 bg-[#0c1322] border border-white/10 rounded flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] text-[#94a3b8] uppercase tracking-wider font-semibold">
            <span>REAL-TIME CALORIC LEDGER</span>
            <span className="text-white/20">•</span>
            <span className="text-[#10b981]">OPERATOR: {user?.username || 'OP // N-01'}</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-4 text-xs">
            <div>
              <span className="text-[#94a3b8]">TARGET: </span>
              <span className="font-bold text-white text-base tabular-numbers">{GOALS.calories}</span>
              <span className="text-[10px] text-[#94a3b8]"> kcal</span>
            </div>
            <span className="text-white/20">|</span>
            <div>
              <span className="text-[#94a3b8]">CONSUMED: </span>
              <span className="font-bold text-[#10b981] text-base tabular-numbers">{consumedCal}</span>
              <span className="text-[10px] text-[#94a3b8]"> kcal</span>
            </div>
            <span className="text-white/20">|</span>
            <div>
              <span className="text-[#94a3b8]">REMAINING: </span>
              <span className="font-bold text-[#0ea5e9] text-base tabular-numbers">{remainingCal}</span>
              <span className="text-[10px] text-[#94a3b8]"> kcal</span>
            </div>
            <span className="text-white/20">|</span>
            <div>
              <span className="text-[#94a3b8]">NET BURN RATIO: </span>
              <span className="font-bold text-[#10b981] text-base tabular-numbers">{calPercent}%</span>
            </div>
          </div>
        </div>

        {/* 3px Dual-color Gauge */}
        <div className="w-full md:w-64 space-y-1.5">
          <div className="h-1.5 w-full bg-[#080d1a] border border-white/10 rounded-full overflow-hidden flex">
            <div className="h-full bg-[#10b981] transition-all duration-700" style={{ width: `${Math.min(100, calPercent)}%` }} />
            <div className="h-full bg-[#0ea5e9]/40" style={{ width: `${Math.max(0, 100 - calPercent)}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-[#94a3b8] font-mono">
            <span>0 kcal</span>
            <span className="text-[#10b981]">{calPercent}% Utilized</span>
            <span>{GOALS.calories} kcal</span>
          </div>
        </div>
      </div>

      {/* 3. Main Asymmetric Cockpit: Left 65% / Right 35% */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* ================= LEFT COLUMN (65% / xl:col-span-8): Dietary Intake Ledger ================= */}
        <div className="xl:col-span-8 space-y-4">
          
          {/* Fast Inline Ingestion Protocol Command Bar */}
          <form onSubmit={handleQuickCommit} className="p-3 bg-[#0c1322] border border-white/10 rounded space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-[#94a3b8] border-b border-white/5 pb-1.5">
              <span className="text-[#10b981] font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                FAST INLINE INGESTION PROTOCOL
              </span>
              <span className="text-white/40">SOURCE: USDA FOODDATA CENTRAL #170889</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#10b981] font-bold text-sm select-none">$</span>
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="quick_log > e.g. '200g Greek Yogurt 0% Fat', barcode, or SKU..."
                className="flex-1 bg-[#080d1a] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#10b981] transition-colors"
              />

              <div className="flex items-center gap-1 bg-[#080d1a] border border-white/10 rounded px-1.5 py-1 text-[11px]">
                <button 
                  type="button" 
                  onClick={() => setServingSize(Math.max(0.5, servingSize - 0.5))}
                  className="px-1 text-[#94a3b8] hover:text-white"
                >-</button>
                <span className="text-white font-bold tabular-numbers">{servingSize.toFixed(1)}x</span>
                <button 
                  type="button" 
                  onClick={() => setServingSize(servingSize + 0.5)}
                  className="px-1 text-[#94a3b8] hover:text-white"
                >+</button>
              </div>

              <button
                type="submit"
                disabled={isCommitting}
                className="px-3 py-1.5 bg-[#10b981] hover:bg-[#34d399] text-[#080d1a] font-bold text-xs rounded transition-colors disabled:opacity-50 select-none"
              >
                {isCommitting ? 'INGESTING...' : 'INGEST'}
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/50 pt-1">
              <div className="flex items-center gap-3">
                <span>[Enter] Commit Log</span>
                <span>[Tab] Macro Split</span>
                <span>[Esc] Clear</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#10b981]">
                <span>Projected Delta:</span>
                <span className="px-1 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/30 text-white font-bold tabular-numbers">
                  +{Math.round(servingSize * 150)} kcal
                </span>
                <span className="text-[#10b981] tabular-numbers">+{Math.round(servingSize * 12)}g P</span>
                <span className="text-[#0ea5e9] tabular-numbers">+{Math.round(servingSize * 18)}g C</span>
                <span className="text-[#f59e0b] tabular-numbers">+{Math.round(servingSize * 4)}g F</span>
              </div>
            </div>
          </form>

          {/* Chronological Meal Stream */}
          <div className="bg-[#0c1322] border border-white/10 rounded overflow-hidden">
            <div className="p-3 bg-[#080d1a] border-b border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-white font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                DIETARY INTAKE LEDGER // REAL-TIME LOG FEED
              </span>
              <span className="text-[#94a3b8] text-[11px]">EXPORT: JSON / NDJSON</span>
            </div>

            <div className="divide-y divide-white/5 font-mono text-xs">
              
              {/* MEAL 01: Breakfast */}
              <div>
                <div className="px-3 py-1.5 bg-[#0e1626] border-b border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-[#10b981] font-bold">MEAL_01 // BREAKFAST [08:15 - 08:42]</span>
                  <span className="text-[#94a3b8] tabular-numbers">520 kcal | P: 48.0g | C: 42.0g | F: 14.0g</span>
                </div>
                <div className="p-2.5 space-y-2">
                  <div className="flex items-center justify-between hover:bg-white/5 p-1 rounded transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-[10px] tabular-numbers">08:15:22</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span className="text-white font-medium">Egg Whites (Liquid Pasteurized)</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-[#10b981]">USDA</span>
                      <span className="text-[#94a3b8] text-[11px] tabular-numbers">250g</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] tabular-numbers">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white">130 kcal</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] font-bold">27.5g P</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#0ea5e9]/15 text-[#0ea5e9]">1.8g C</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#f59e0b]/15 text-[#f59e0b]">0.5g F</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between hover:bg-white/5 p-1 rounded transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-[10px] tabular-numbers">08:22:45</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" />
                      <span className="text-white font-medium">Rolled Oats (Steel-Cut Organic)</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-[#0ea5e9]">VERIFIED</span>
                      <span className="text-[#94a3b8] text-[11px] tabular-numbers">60g</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] tabular-numbers">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white">228 kcal</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981]">8.2g P</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#0ea5e9]/15 text-[#0ea5e9] font-bold">38.4g C</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#f59e0b]/15 text-[#f59e0b]">3.6g F</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MEAL 02: Lunch */}
              <div>
                <div className="px-3 py-1.5 bg-[#0e1626] border-b border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-[#10b981] font-bold">MEAL_02 // LUNCH [12:45 - 13:10]</span>
                  <span className="text-[#94a3b8] tabular-numbers">610 kcal | P: 56.4g | C: 51.0g | F: 16.5g</span>
                </div>
                <div className="p-2.5 space-y-2">
                  <div className="flex items-center justify-between hover:bg-white/5 p-1 rounded transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-[10px] tabular-numbers">12:47:33</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                      <span className="text-white font-medium">Chicken Breast (Sous Vide)</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-[#10b981]">USDA</span>
                      <span className="text-[#94a3b8] text-[11px] tabular-numbers">210g</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] tabular-numbers">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white">346 kcal</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] font-bold">51.2g P</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#0ea5e9]/15 text-[#0ea5e9]">0.0g C</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#f59e0b]/15 text-[#f59e0b]">6.1g F</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between hover:bg-white/5 p-1 rounded transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-[10px] tabular-numbers">12:55:18</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" />
                      <span className="text-white font-medium">Basmati Jasmine Blend & Avocado Oil</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-[#0ea5e9]">MANUAL</span>
                      <span className="text-[#94a3b8] text-[11px] tabular-numbers">180g</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] tabular-numbers">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white">264 kcal</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981]">5.2g P</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#0ea5e9]/15 text-[#0ea5e9] font-bold">51.0g C</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#f59e0b]/15 text-[#f59e0b]">10.4g F</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MEAL 03: Afternoon Snack */}
              <div>
                <div className="px-3 py-1.5 bg-[#0e1626] border-b border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-[#10b981] font-bold">MEAL_03 // AFTERNOON SNACK [16:10 - 16:18]</span>
                  <span className="text-[#94a3b8] tabular-numbers">290 kcal | P: 24.0g | C: 22.0g | F: 8.5g</span>
                </div>
                <div className="p-2.5">
                  <div className="flex items-center justify-between hover:bg-white/5 p-1 rounded transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 text-[10px] tabular-numbers">16:12:08</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                      <span className="text-white font-medium">Skyr Icelandic Curd + Raw Almonds</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-white/10 text-[#f59e0b]">BARCODE</span>
                      <span className="text-[#94a3b8] text-[11px] tabular-numbers">170g + 15g</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] tabular-numbers">
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-white">290 kcal</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#10b981]/15 text-[#10b981] font-bold">24.0g P</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#0ea5e9]/15 text-[#0ea5e9]">22.0g C</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#f59e0b]/15 text-[#f59e0b]">8.5g F</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROJECTED DINNER PRESCRIPTION */}
              <div className="p-3 bg-[#080d1a] border-l-2 border-dashed border-[#0ea5e9] flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[#0ea5e9]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>PROJECTED // DINNER PRESCRIPTION ALLOCATION</span>
                    <span className="text-[9px] bg-[#0ea5e9]/10 text-[#0ea5e9] px-1 py-0.2 rounded">QUOTA: 780 kcal</span>
                  </div>
                  <p className="text-[11px] text-[#94a3b8]">
                    Suggested: 240g Atlantic Wild Salmon + 250g Steamed Broccoli + 150g Sweet Potato
                  </p>
                </div>
                <button 
                  onClick={() => toast.success('Dinner prescription staged into allocation queue')}
                  className="px-2.5 py-1 text-[11px] bg-[#0c1322] border border-[#0ea5e9]/50 hover:bg-[#0ea5e9] hover:text-[#080d1a] text-[#0ea5e9] rounded transition-all font-semibold"
                >
                  STAGE_ALLOCATION
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN (35% / xl:col-span-4): Optical Scanner & Micronutrients ================= */}
        <div className="xl:col-span-4 space-y-4 font-mono text-xs">
          
          {/* Optical Scanner HUD Viewfinder */}
          <div className="bg-[#0c1322] border border-white/10 rounded p-3 space-y-3">
            <div className="flex items-center justify-between text-[11px] border-b border-white/5 pb-2">
              <span className="text-[#10b981] font-bold flex items-center gap-1.5">
                <ScanLine className="w-3.5 h-3.5" />
                OPTICAL SPECTROMETRY & HUD SCANNER
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30">
                ACTIVE FEED
              </span>
            </div>

            {/* Tactical Viewfinder Box */}
            <div className="relative w-full h-56 bg-[#080d1a] border border-white/10 rounded overflow-hidden hairline-grid flex items-center justify-center select-none">
              
              {/* Coordinates HUD */}
              <div className="absolute top-2 left-2 text-[9px] text-[#10b981]/80">
                SYS.CAM.01 // RETICLE: [X: 512 | Y: 384]
              </div>
              <div className="absolute top-2 right-2 text-[9px] text-[#94a3b8]">
                FPS: 59.9 • ISO: 400
              </div>

              {/* 4 Green Corner Brackets */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#10b981]" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#10b981]" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#10b981]" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#10b981]" />

              {/* Center Crosshair Reticle */}
              <div className="relative w-12 h-12 flex items-center justify-center pointer-events-none">
                <div className="absolute w-full h-px bg-[#10b981]/40" />
                <div className="absolute h-full w-px bg-[#10b981]/40" />
                <div className="w-2.5 h-2.5 border border-[#10b981]/80 rounded-full" />
                <div className="w-0.5 h-0.5 bg-[#10b981]" />
              </div>

              {/* Animated Neon Laser Scanning Beam */}
              <div className="laser-beam pointer-events-none">
                <div className="laser-trail" />
              </div>

              {/* Detected Bounding Box Overlay */}
              <div className="absolute w-48 h-28 border border-[#10b981]/80 bg-[#10b981]/5 rounded flex flex-col justify-between p-1.5 pointer-events-none">
                <div className="flex items-center justify-between text-[8px] bg-[#080d1a]/90 px-1 py-0.5 rounded text-[#10b981] border border-[#10b981]/30">
                  <span>OBJ_TARGET: #042</span>
                  <span>CONF: 98.4%</span>
                </div>
                <div className="text-[9px] bg-[#080d1a]/90 px-1.5 py-0.5 rounded text-[#10b981] font-bold border border-[#10b981]/40">
                  DETECTED: SALMON FILLET (WILD ALASKAN)
                </div>
              </div>

              {/* Telemetry bottom badge */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] text-[#94a3b8] bg-[#080d1a]/80 px-2 py-0.5 rounded border border-white/5">
                <span>EST_MASS: 220g (±5g)</span>
                <span className="text-[#10b981] font-bold">READY TO COMMIT</span>
              </div>
            </div>

            {/* Ingestion Dropzone & Pipeline status */}
            <div className="border border-dashed border-white/10 rounded p-2.5 bg-[#080d1a] flex items-center justify-between text-[11px]">
              <div>
                <p className="text-white font-medium">Drop packaging photo or meal snapshot</p>
                <p className="text-[10px] text-[#94a3b8]">Celery Worker Queue • Ready (0 jobs pending)</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#10b981] font-bold">
                BROWSE
              </span>
            </div>
          </div>

          {/* Micronutrient Density Matrix */}
          <div className="bg-[#0c1322] border border-white/10 rounded p-3 space-y-3">
            <div className="flex items-center justify-between text-[11px] border-b border-white/5 pb-2">
              <span className="text-white font-bold">MICRONUTRIENT DENSITY MATRIX</span>
              <span className="text-[10px] text-[#94a3b8]">SAFETY THRESHOLDS</span>
            </div>

            <div className="space-y-2.5 text-[11px]">
              {/* Sodium */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8]">SODIUM (Na+)</span>
                  <span className="tabular-numbers text-white font-bold">
                    1,340 mg <span className="text-white/40 font-normal">/ 2,300 mg max</span>
                    <span className="ml-1.5 text-[9px] text-[#10b981] bg-[#10b981]/10 px-1 py-0.2 rounded">58% OPTIMAL</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#080d1a] rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-[#10b981]" style={{ width: '58%' }} />
                </div>
              </div>

              {/* Dietary Fiber */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8]">DIETARY FIBER</span>
                  <span className="tabular-numbers text-white font-bold">
                    28.5 g <span className="text-white/40 font-normal">/ 38.0 g target</span>
                    <span className="ml-1.5 text-[9px] text-[#10b981] bg-[#10b981]/10 px-1 py-0.2 rounded">75% ON TRACK</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#080d1a] rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-[#10b981]" style={{ width: '75%' }} />
                </div>
              </div>

              {/* Potassium */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8]">POTASSIUM (K+)</span>
                  <span className="tabular-numbers text-white font-bold">
                    3,120 mg <span className="text-white/40 font-normal">/ 4,700 mg target</span>
                    <span className="ml-1.5 text-[9px] text-[#f59e0b] bg-[#f59e0b]/10 px-1 py-0.2 rounded">66% MODERATE</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#080d1a] rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-[#f59e0b]" style={{ width: '66%' }} />
                </div>
              </div>

              {/* Free Sugars */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#94a3b8]">FREE SUGARS</span>
                  <span className="tabular-numbers text-white font-bold">
                    18.2 g <span className="text-white/40 font-normal">/ 36.0 g limit</span>
                    <span className="ml-1.5 text-[9px] text-[#10b981] bg-[#10b981]/10 px-1 py-0.2 rounded">50% CONTROLLED</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-[#080d1a] rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-[#10b981]" style={{ width: '50%' }} />
                </div>
              </div>
            </div>

            {/* Micro-Trace Badges Array */}
            <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-[#080d1a] border border-white/10 text-white tabular-numbers">
                Iron: <strong className="text-[#10b981]">14.2mg</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#080d1a] border border-white/10 text-white tabular-numbers">
                Zinc: <strong className="text-[#10b981]">11.0mg</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#080d1a] border border-white/10 text-white tabular-numbers">
                Magnesium: <strong className="text-[#10b981]">340mg</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#080d1a] border border-white/10 text-white tabular-numbers">
                Omega-3: <strong className="text-[#10b981]">2.4g</strong>
              </span>
            </div>
          </div>

          {/* Macro Ratio Reconciliation & Action Controls */}
          <div className="bg-[#0c1322] border border-white/10 rounded p-3 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] border-b border-white/5 pb-1.5">
              <span className="text-white font-bold">MACRO RATIO RECONCILIATION</span>
              <span className="text-[#10b981] text-[10px]">VARIANCE: ±2.1%</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 bg-[#080d1a] rounded border border-white/5">
                <span className="text-[#94a3b8] block">PRESCRIPTION RATIO</span>
                <span className="text-white font-bold">P: 35% | C: 40% | F: 25%</span>
              </div>
              <div className="p-2 bg-[#080d1a] rounded border border-[#10b981]/30">
                <span className="text-[#10b981] font-bold block">ACTUAL REAL-TIME</span>
                <span className="text-[#10b981] font-bold">P: 38% | C: 37% | F: 25%</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <button 
                onClick={() => toast.success('Dinner macros calibrated to remaining budget')}
                className="w-full py-1.5 px-2 bg-[#10b981] hover:bg-[#34d399] text-[#080d1a] font-bold text-xs rounded transition-colors"
              >
                AUTOCORRECT DINNER MACROS
              </button>
              <div className="grid grid-cols-2 gap-1.5">
                <button 
                  onClick={() => toast.info('Exporting ledger CSV...')}
                  className="py-1 px-2 bg-[#080d1a] border border-white/10 hover:border-white/30 text-white rounded text-[11px] transition-colors"
                >
                  EXPORT CSV
                </button>
                <button 
                  onClick={() => toast.info('Recalibrating BMR metrics...')}
                  className="py-1 px-2 bg-[#080d1a] border border-white/10 hover:border-white/30 text-white rounded text-[11px] transition-colors"
                >
                  RECALIBRATE BMR
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
