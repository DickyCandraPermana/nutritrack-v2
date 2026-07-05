import { useState, useEffect } from 'react';
import { User, Settings, Bell, Key, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { fetchApi } from '../lib/api';
import { toast } from 'sonner';

export default function Profile() {
  const authUser = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
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
        const res = await fetchApi('/users/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          // If the backend doesn't return full profile yet, we fallback to authUser
          setFormData({
            username: data.user?.username || authUser?.username || '',
            email: data.user?.email || authUser?.email || '',
            weight: data.user?.weight || '70',
            height: data.user?.height || '175',
            age: data.user?.age || '25',
          });
        }
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
      const res = await fetchApi('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-3xl font-semibold text-slate-100 mb-8">Profile Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
            <User className="w-5 h-5" />
            General Info
          </button>
          <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
            <Settings className="w-5 h-5" />
            Preferences
          </button>
          <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
            <Bell className="w-5 h-5" />
            Notifications
          </button>
          <button className="w-full flex items-center gap-3 p-4 rounded-2xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
            <Key className="w-5 h-5" />
            Security & 2FA
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-2 glass-card rounded-3xl p-8 space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl border-2 border-emerald-500/30 overflow-hidden">
              {profile?.user?.avatar ? (
                <img src={profile.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                "🦊"
              )}
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-100">{formData.username || 'User'}</h3>
              <p className="text-slate-400 mb-3">{formData.email}</p>
              <button className="px-4 py-2 rounded-xl bg-slate-800 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700">
                Change Avatar
              </button>
            </div>
          </div>

          <hr className="border-slate-800" />

          <div className="space-y-5">
            <h4 className="text-lg font-medium text-slate-200 mb-4">Personal Details</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Username</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email</label>
                <input 
                  type="text" 
                  value={formData.email}
                  disabled
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-slate-500 cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Age</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Weight (kg)</label>
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Height (cm)</label>
                <input 
                  type="number" 
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
