import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function Premium() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="text-center space-y-4 pt-8">
        <div className="inline-flex items-center justify-center p-3 bg-amber-500/20 text-amber-400 rounded-full mb-2 border border-amber-500/30">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-bold text-slate-100">Upgrade to Premium</h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Unlock the full power of Nutritrack's AI and reach your goals faster with advanced insights and unlimited scans.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <div className="glass-card rounded-3xl p-8 flex flex-col opacity-80">
          <h3 className="text-2xl font-semibold text-slate-100 mb-2">Basic</h3>
          <p className="text-slate-400 mb-6">For casual tracking</p>
          <div className="mb-8">
            <span className="text-4xl font-bold text-slate-100">Free</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {['Basic macro tracking', '5 AI food scans per day', 'Standard support', 'Community access'].map(feature => (
              <li key={feature} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-slate-500" />
                {feature}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 rounded-xl border-2 border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 transition-colors">
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="glass-card rounded-3xl p-8 flex flex-col relative overflow-hidden border-amber-500/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
            Most Popular
          </div>

          <h3 className="text-2xl font-semibold text-amber-400 mb-2">Pro</h3>
          <p className="text-slate-400 mb-6">For serious achievers</p>
          <div className="mb-8">
            <span className="text-4xl font-bold text-slate-100">$9.99</span>
            <span className="text-slate-400">/month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {['Unlimited AI food scans', 'Advanced analytics & trends', 'Custom macro goals', 'Priority 24/7 support', 'Export data to CSV'].map(feature => (
              <li key={feature} className="flex items-center gap-3 text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                {feature}
              </li>
            ))}
          </ul>
          <button className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-lg transition-all shadow-[0_0_20px_-5px_rgba(245,158,11,0.5)]">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
