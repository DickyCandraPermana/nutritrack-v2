import { useState, useEffect } from 'react';
import { User, Settings, Bell, Key, Loader2, Save, Activity } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { apiClient } from '../lib/api';
import { toast } from 'sonner';

export default function Profile() {
  const authUser = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    weight: '',
    height: '',
    age: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiClient.get<any>('/users/profile');
        setProfile(data);
        setFormData({
          username: data.user?.username || authUser?.username || '',
          email: data.user?.email || authUser?.email || '',
          weight: data.user?.weight || '70',
          height: data.user?.height || '175',
          age: data.user?.age || '25',
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [authUser]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiClient.put('/users/profile', formData);
      toast.success('Clinical profile updated.');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3 font-mono text-xs text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        <span>LOADING BIOMETRIC PROFILE...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 antialiased">
      <div className="pb-4 border-b border-[#1f2e47]">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
          <Activity className="w-3.5 h-3.5" />
          <span>BIOMETRIC TELEMETRY & AUTHENTICATION</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
          Operator Profile & Body Metrics
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Navigation Tabs */}
        <div className="space-y-1.5 font-mono text-xs">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/25">
            <User className="w-4 h-4" />
            <span>Biometrics & Identity</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-[#141f33] hover:text-slate-200 transition-colors">
            <Settings className="w-4 h-4" />
            <span>Metabolic Guardrails</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-[#141f33] hover:text-slate-200 transition-colors">
            <Bell className="w-4 h-4" />
            <span>Telemetry Alerts</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-[#141f33] hover:text-slate-200 transition-colors">
            <Key className="w-4 h-4" />
            <span>Security & Cryptography</span>
          </button>
        </div>

        {/* Profile Content */}
        <div className="md:col-span-2 clinical-card p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-[#0e1626] border border-[#23334d] flex items-center justify-center text-2xl overflow-hidden font-mono font-bold text-emerald-400">
              {profile?.user?.avatar ? (
                <img src={profile.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                formData.username?.charAt(0) || 'U'
              )}
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white capitalize leading-tight">
                {formData.username || 'Operator'}
              </h2>
              <p className="text-xs font-mono text-slate-400">{formData.email}</p>
              <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE TELEMETRY SESSION
              </span>
            </div>
          </div>

          <div className="border-t border-[#1f2e47] pt-5 space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400">Username</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-[#0b111e] border border-[#1f2e47] rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400">Email (Immutable)</label>
                <input 
                  type="text" 
                  value={formData.email}
                  disabled
                  className="w-full bg-[#0e1626] border border-[#1f2e47] rounded-lg p-2.5 text-slate-500 cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400">Age</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-[#0b111e] border border-[#1f2e47] rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 tnum" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400">Weight (kg)</label>
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full bg-[#0b111e] border border-[#1f2e47] rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 tnum" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400">Height (cm)</label>
                <input 
                  type="number" 
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-[#0b111e] border border-[#1f2e47] rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 tnum" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#1f2e47]">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#002113] font-heading font-semibold text-xs transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Biometrics</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
