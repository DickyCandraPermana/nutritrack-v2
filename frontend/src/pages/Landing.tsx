import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Camera,
  Leaf,
  Droplet,
  ShieldCheck
} from 'lucide-react';
import { apiClient } from '../lib/api';

interface FoodItem {
  id: number;
  name: string;
  serving_size: number;
  serving_unit: string;
}

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState('banana');
  const [sampleFoods, setSampleFoods] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancel = false;
    const fetchSample = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get<{ data: FoodItem[] }>(`/foods/search?q=${encodeURIComponent(searchQuery)}`);
        if (!cancel && res.data) {
          setSampleFoods(res.data.slice(0, 4));
        }
      } catch {
        // fallback
      } finally {
        if (!cancel) setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchSample, 300);
    return () => {
      cancel = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8faf7] text-[#1f2937] flex flex-col antialiased selection:bg-[#dcfce7] selection:text-[#15803d]">
      
      {/* Top Serene Nav */}
      <header className="border-b border-[#e5e7eb] bg-white/90 sticky top-0 z-30 px-6 py-4 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center">
              <Leaf className="w-5 h-5 fill-[#15803d]" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg tracking-tight text-[#1f2937] block leading-none">
                NutriTrack
              </span>
              <span className="text-[11px] text-[#15803d] font-medium tracking-wide">
                Mindful Nourishment & Holistic Clarity
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-[#4b5563] hover:text-[#1f2937] font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-full bg-[#15803d] hover:bg-[#166534] text-white font-semibold shadow-sm transition-all"
            >
              Start Journaling
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Mindful Vitality */}
      <section className="px-6 pt-16 pb-12 max-w-5xl mx-auto w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dcfce7] text-[#15803d] text-xs font-semibold">
          <Leaf className="w-3.5 h-3.5 fill-[#15803d]" />
          <span>MINDFUL NOURISHMENT JOURNAL</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-[#1f2937] max-w-3xl mx-auto leading-[1.15]">
          A calm, intentional way to track your daily nutrition.
        </h1>

        <p className="text-base sm:text-lg text-[#4b5563] max-w-2xl mx-auto leading-relaxed">
          NutriTrack replaces anxious calorie counting with mindful vitality. Track meals with photo AI, balance whole-food nutrients, and nurture your body gently.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/register"
            className="px-6 py-3 rounded-full bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-sm flex items-center gap-2 shadow-sm hover:shadow transition-all"
          >
            Open Your Journal
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/foods"
            className="px-6 py-3 rounded-full bg-white hover:bg-[#f8faf7] text-[#1f2937] border border-[#e5e7eb] text-sm font-medium transition-colors shadow-sm"
          >
            Explore Whole Foods Registry
          </Link>
        </div>
      </section>

      {/* Live Interactive Search Box */}
      <section className="px-6 py-8 max-w-5xl mx-auto w-full">
        <div className="card-zen rounded-3xl p-6 sm:p-8 bg-[#fcfdf9]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#f1f5f0]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#15803d] mb-1">
                <Leaf className="w-3.5 h-3.5 fill-[#15803d]" />
                <span>INTERACTIVE NUTRIENT DIRECTORY</span>
              </div>
              <h2 className="text-xl font-heading font-bold text-[#1f2937]">
                Live Whole Foods Search
              </h2>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#9ca3af] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query foods (e.g. egg, apple, oats, salmon)..."
                className="w-full bg-white border border-[#e5e7eb] rounded-full py-2.5 pl-10 pr-4 text-xs text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-[#f8faf7] rounded-2xl animate-pulse border border-[#e5e7eb]" />
              ))
            ) : sampleFoods.length > 0 ? (
              sampleFoods.map((food) => (
                <div key={food.id} className="p-4 rounded-2xl bg-[#f8faf7] border border-[#e5e7eb] hover:border-[#bbf7d0] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-heading font-semibold text-sm text-[#1f2937] capitalize truncate">
                      {food.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] font-semibold shrink-0">
                      ID {food.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#6b7280]">
                    <span>Portion:</span>
                    <span className="text-[#1f2937] font-semibold tabular-numbers">
                      {food.serving_size} {food.serving_unit}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-xs text-[#6b7280]">
                No whole food items found for "{searchQuery}". Try searching for natural staples.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3 Holistic Pillars */}
      <section className="px-6 py-12 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-zen rounded-3xl p-6 space-y-3 bg-[#fcfdf9]">
          <div className="w-10 h-10 rounded-2xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-[#1f2937]">
            Smart Plate Vision
          </h3>
          <p className="text-xs text-[#4b5563] leading-relaxed">
            Snap your plate or scan packaging barcodes. Multimodal AI gently identifies ingredients and balances your nutrients.
          </p>
        </div>

        <div className="card-zen rounded-3xl p-6 space-y-3 bg-[#fcfdf9]">
          <div className="w-10 h-10 rounded-2xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
            <Droplet className="w-5 h-5 fill-[#0284c7]" />
          </div>
          <h3 className="font-heading font-bold text-base text-[#1f2937]">
            Hydration & Mindful Habits
          </h3>
          <p className="text-xs text-[#4b5563] leading-relaxed">
            Track pure water intake throughout the day with one-tap logging and gentle hydration reminders.
          </p>
        </div>

        <div className="card-zen rounded-3xl p-6 space-y-3 bg-[#fcfdf9]">
          <div className="w-10 h-10 rounded-2xl bg-[#fef3c7] text-[#92400e] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-[#1f2937]">
            Verified Whole Food Data
          </h3>
          <p className="text-xs text-[#4b5563] leading-relaxed">
            All dietary entries align with trusted USDA FoodData references, stored securely with complete user privacy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#e5e7eb] py-6 px-6 text-center text-xs text-[#6b7280]">
        NutriTrack • Mindful Nourishment & Holistic Clarity • Built with Serene Vitality
      </footer>

    </div>
  );
}
