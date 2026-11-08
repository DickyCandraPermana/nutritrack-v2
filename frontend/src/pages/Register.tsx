import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, Leaf } from 'lucide-react';
import { apiClient } from '../lib/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/auth/register', { username, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf7] text-[#1f2937] flex flex-col items-center justify-center p-4 antialiased selection:bg-[#dcfce7] selection:text-[#15803d]">
      
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 fill-[#15803d]" />
            </div>
            <span className="font-heading font-bold text-xl text-[#1f2937] tracking-tight">
              NutriTrack
            </span>
          </Link>
          <h1 className="font-heading font-bold text-2xl text-[#1f2937] tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-[#6b7280]">
            Begin your mindful nutrition journey today
          </p>
        </div>

        {/* Serene Form Card */}
        <form onSubmit={handleSubmit} className="card-zen rounded-3xl p-6 sm:p-8 space-y-5 bg-[#fcfdf9]">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-[#4b5563] font-medium">Your Name / Nickname</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-white border border-[#e5e7eb] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10 transition-all shadow-sm"
                placeholder="Elena"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[#4b5563] font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white border border-[#e5e7eb] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10 transition-all shadow-sm"
                placeholder="elena@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-[#4b5563] font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white border border-[#e5e7eb] rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10 transition-all shadow-sm"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-xs py-3 rounded-full flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[#6b7280]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#15803d] font-semibold hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
