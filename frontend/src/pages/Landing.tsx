import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Search, 
  ScanLine, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Terminal 
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
    <div className="min-h-screen bg-[#0b111e] text-slate-100 flex flex-col antialiased selection:bg-emerald-500/30">
      
      {/* Top Clinical Nav */}
      <header className="border-b border-[#1f2e47] bg-[#0e1626]/90 sticky top-0 z-30 px-6 py-3.5 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-bold text-base tracking-tight text-white block leading-none">
                NutriTrack
              </span>
              <span className="text-[10px] font-mono tracking-wider text-emerald-400 font-medium">
                Core v2.0 • Go Fiber & PostgreSQL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141f33] border border-[#1f2e47] text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Production Mesh Ready</span>
            </div>
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-md bg-[#162238] hover:bg-[#1e2f4a] text-slate-200 border border-[#263854] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-[#002113] font-semibold transition-colors"
            >
              Console Access
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Operate & Command Precision */}
      <section className="px-6 pt-16 pb-12 max-w-6xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-mono mb-6">
          <Terminal className="w-3.5 h-3.5" />
          <span>DIETARY INTELLIGENCE SPECIFICATION</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Clinical-Grade Dietary Intelligence & Food Intake Telemetry.
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-8">
          NutriTrack v2 is built for verifiable metabolic logging. Powered by Go Clean Architecture, asynchronous Gemini Vision label scanning, and real nutritional datasets.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#002113] font-heading font-semibold text-sm flex items-center gap-2 transition-all shadow-sm"
          >
            Launch Command Console
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/foods"
            className="px-5 py-2.5 rounded-lg bg-[#141f33] hover:bg-[#1b2a45] text-slate-200 border border-[#22334f] text-sm font-medium transition-colors"
          >
            Explore Public Food Database
          </Link>
        </div>
      </section>

      {/* Live Interactive Telemetry Box */}
      <section className="px-6 py-8 max-w-6xl mx-auto w-full">
        <div className="clinical-card p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#1f2e47]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
                <Database className="w-3.5 h-3.5" />
                <span>LIVE TELEMETRY PROBE</span>
              </div>
              <h2 className="text-xl font-heading font-semibold text-white">
                Nutritional Matrix Query Engine
              </h2>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query database (e.g. egg, apple, avocado)..."
                className="w-full bg-[#0b111e] border border-[#1f2e47] rounded-lg py-2 pl-9 pr-4 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-[#141f33] rounded-lg animate-pulse border border-[#1f2e47]" />
              ))
            ) : sampleFoods.length > 0 ? (
              sampleFoods.map((food) => (
                <div key={food.id} className="p-4 rounded-lg bg-[#0e1626] border border-[#1f2e47] hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-heading font-semibold text-sm text-white capitalize truncate">
                      {food.name}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 shrink-0">
                      ID {food.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Base Serving:</span>
                    <span className="text-slate-200 font-semibold tnum">
                      {food.serving_size} {food.serving_unit}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-xs text-slate-400 font-mono">
                No telemetry data found for "{searchQuery}". Query another nutrient entity.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Architecture Highlights: No Slop, Pure Precision */}
      <section className="px-6 py-12 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="clinical-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <ScanLine className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-semibold text-base text-white">
            Optical Food Vision Scanner
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Asynchronous Celery OCR workers powered by Gemini multimodal vision ingest food labels, decomposing macro and micronutrients into validated relational schemas.
          </p>
        </div>

        <div className="clinical-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-semibold text-base text-white">
            Go Fiber Clean Architecture
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            High-throughput REST API written in Go 1.23, featuring connection pooling, JWT claims validation, and idempotent SQL migrations over PostgreSQL 16.
          </p>
        </div>

        <div className="clinical-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-semibold text-base text-white">
            Zero-Cost Hybrid Infrastructure
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deployable on minimal memory footprints with Chainguard MinIO object storage, Tailscale mesh encryption, and Cloudflare Edge tunneling.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1f2e47] py-6 px-6 text-center text-xs text-slate-500 font-mono">
        NutriTrack v2 • Clinical Nutrition Telemetry Engine • Monorepo Architecture
      </footer>

    </div>
  );
}
