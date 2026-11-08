import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2, Activity } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { apiClient } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiClient.post<any>('/auth/login', { email, password });
      login(res.data.token, res.data.user || null);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication credentials invalid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b111e] flex flex-col items-center justify-center p-4 antialiased">
      
      <div className="w-full max-w-md space-y-6">
        
        {/* Console Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/25 transition-all">
              <Activity className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-xl text-white tracking-tight">
              NutriTrack
            </span>
          </Link>
          <h1 className="font-heading font-bold text-2xl text-white tracking-tight">
            Console Authentication
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Enter credentials to establish secure telemetry session
          </p>
        </div>

        {/* Clinical Form Card */}
        <form onSubmit={handleSubmit} className="clinical-card p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0b111e] border border-[#1f2e47] rounded-lg py-2 pl-9 pr-3 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="operator@thearinazs.my.id"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-medium">Session Key / Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0b111e] border border-[#1f2e47] rounded-lg py-2 pl-9 pr-3 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#002113] font-heading font-bold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs font-mono text-slate-500">
          Unregistered operator?{' '}
          <Link to="/register" className="text-emerald-400 hover:underline">
            Request console enrollment
          </Link>
        </p>

      </div>
    </div>
  );
}
