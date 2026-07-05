import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Activity, Camera, Star, MessageCircleQuestion } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center relative overflow-hidden pb-24">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px]" />

      <main className="z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-24">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium animate-in slide-in-from-bottom-4 duration-700">
          <Leaf className="w-4 h-4" />
          <span>Smarter Nutrition Tracking</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Track Your Nutrition, <br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Empower Your Life
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Nutritrack uses advanced AI to analyze your food from photos, making calorie counting and nutrient tracking effortless.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link
            to="/register"
            className="px-8 py-4 rounded-2xl bg-emerald-500 text-slate-950 font-semibold text-lg flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-2xl bg-slate-800/50 text-slate-100 font-semibold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors border border-slate-700/50"
          >
            Sign In
          </Link>
        </div>

        {/* Features */}
        <div className="mt-32 w-full grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          {[
            { icon: Camera, title: "AI Food Scan", desc: "Instantly recognize foods from photos" },
            { icon: Activity, title: "Macro Tracking", desc: "Detailed breakdown of protein, carbs & fat" },
            { icon: Leaf, title: "Personalized Goals", desc: "Tailored nutrition plans for your body" }
          ].map((feature, i) => (
            <div key={i} className="glass rounded-3xl p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-32 w-full">
          <h2 className="text-3xl font-bold mb-12">Loved by thousands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Sarah K.", role: "Fitness Enthusiast", text: "The AI food scanner is mind-blowing. It saves me so much time every single day!" },
              { name: "Mike T.", role: "Personal Trainer", text: "I recommend Nutritrack to all my clients. The macro breakdown is incredibly accurate." },
              { name: "Emily R.", role: "Busy Mom", text: "Finally an app that makes tracking food easy. The design is beautiful and so simple to use." }
            ].map((testimonial, i) => (
              <div key={i} className="glass rounded-3xl p-6 text-left flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4 text-amber-400">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-slate-300 italic mb-6">"{testimonial.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-32 w-full max-w-3xl mx-auto text-left">
          <div className="flex items-center justify-center gap-3 mb-12">
            <MessageCircleQuestion className="w-8 h-8 text-emerald-400" />
            <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Is Nutritrack really free?", a: "Yes! The core tracking features are 100% free. We offer a Premium plan for unlimited AI scans and advanced analytics." },
              { q: "How accurate is the AI scanner?", a: "Our AI is trained on millions of food images and is highly accurate for whole foods, packaged items, and common restaurant meals." },
              { q: "Can I track my own custom meals?", a: "Absolutely. You can manually enter recipes, scan barcodes, or create custom foods in your personal database." }
            ].map((faq, i) => (
              <div key={i} className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
