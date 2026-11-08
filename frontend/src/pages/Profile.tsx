import { useState, useEffect } from 'react';
import { User, Settings, Bell, Key, Loader2, Save, Leaf } from 'lucide-react';
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
      toast.success('Health profile updated successfully 🌱');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3 text-xs text-[#6b7280]">
        <Loader2 className="w-6 h-6 animate-spin text-[#15803d]" />
        <span>Loading health profile...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 antialiased text-[#1f2937]">
      <div className="pb-4 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-1.5 text-xs text-[#15803d] font-semibold mb-1">
          <Leaf className="w-3.5 h-3.5 fill-[#15803d]" />
          <span>PERSONAL HEALTH & WELLNESS SETTINGS</span>
        </div>
        <h1 className="font-heading text-2xl font-bold text-[#1f2937] tracking-tight">
          Member Profile & Body Metrics
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Navigation Tabs */}
        <div className="space-y-1.5 text-xs">
          <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white text-[#15803d] font-semibold border border-[#e5e7eb] shadow-sm">
            <User className="w-4 h-4" />
            <span>Body Metrics & Profile</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[#6b7280] hover:bg-white hover:text-[#1f2937] transition-all">
            <Settings className="w-4 h-4" />
            <span>Nutrition Goals</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[#6b7280] hover:bg-white hover:text-[#1f2937] transition-all">
            <Bell className="w-4 h-4" />
            <span>Meal Reminders</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[#6b7280] hover:bg-white hover:text-[#1f2937] transition-all">
            <Key className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* Profile Content */}
        <div className="md:col-span-2 card-zen rounded-3xl p-6 sm:p-8 bg-[#fcfdf9] space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-center text-xl font-heading font-bold text-[#15803d]">
              {profile?.user?.avatar ? (
                <img src={profile.user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                formData.username?.charAt(0) || 'U'
              )}
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-[#1f2937] capitalize leading-tight">
                {formData.username || 'Member'}
              </h2>
              <p className="text-xs text-[#6b7280] mt-0.5">{formData.email}</p>
              <span className="inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] font-medium border border-[#bbf7d0]">
                Active Member
              </span>
            </div>
          </div>

          <div className="border-t border-[#f1f5f0] pt-5 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[#6b7280] font-medium">Username</label>
                <input 
                  type="text" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-white border border-[#e5e7eb] rounded-xl p-2.5 text-[#1f2937] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10 transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[#6b7280] font-medium">Email (Account ID)</label>
                <input 
                  type="text" 
                  value={formData.email}
                  disabled
                  className="w-full bg-[#f3f4f6] border border-[#e5e7eb] rounded-xl p-2.5 text-[#9ca3af] cursor-not-allowed" 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[#6b7280] font-medium">Age</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-white border border-[#e5e7eb] rounded-xl p-2.5 text-[#1f2937] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10 transition-all tabular-numbers" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[#6b7280] font-medium">Weight (kg)</label>
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full bg-white border border-[#e5e7eb] rounded-xl p-2.5 text-[#1f2937] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10 transition-all tabular-numbers" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[#6b7280] font-medium">Height (cm)</label>
                <input 
                  type="number" 
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-white border border-[#e5e7eb] rounded-xl p-2.5 text-[#1f2937] focus:outline-none focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/10 transition-all tabular-numbers" 
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#f1f5f0]">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-full bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-xs shadow-sm hover:shadow transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
