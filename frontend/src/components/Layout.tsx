import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Camera, 
  User, 
  LogOut, 
  ShieldCheck, 
  Leaf, 
  Droplet,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Journal', icon: BookOpen },
    { to: '/foods', label: 'Food Database', icon: Search },
    { to: '/scan', label: 'Smart Scanner', icon: Camera },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf7] text-[#1f2937] flex flex-col antialiased selection:bg-[#dcfce7] selection:text-[#15803d]">
      
      {/* 1. Serene Top Navigation Bar (Stitch-designed) */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-[#e5e7eb] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 transition-all">
        
        {/* Brand & Date Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#dcfce7] text-[#15803d] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 fill-[#15803d]" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-[#1f2937] tracking-tight block leading-none">
                NutriTrack
              </span>
              <span className="text-[11px] text-[#15803d] font-medium tracking-wide">
                Mindful Nutrition
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2 bg-[#f8faf7] border border-[#e5e7eb] rounded-full px-3 py-1.5 text-xs text-[#4b5563]">
            <button className="hover:text-[#15803d] transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
            <span className="font-medium text-[#1f2937]">Today, Sun Nov 8</span>
            <button className="hover:text-[#15803d] transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f8faf7] p-1 rounded-full border border-[#e5e7eb]">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all
                ${isActive 
                  ? 'bg-white text-[#15803d] shadow-sm' 
                  : 'text-[#4b5563] hover:text-[#1f2937] hover:bg-white/60'}
              `}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                ${isActive ? 'bg-white text-purple-600 shadow-sm' : 'text-[#4b5563] hover:text-[#1f2937]'}
              `}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </NavLink>
          )}
        </nav>

        {/* Right Actions & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Quick Water Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd] rounded-full px-3 py-1.5 text-xs font-medium">
            <Droplet className="w-3.5 h-3.5 fill-[#0284c7] text-[#0284c7]" />
            <span>1.8 / 2.5L</span>
          </div>

          {/* Log Meal Pill CTA */}
          <Link
            to="/foods"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#15803d] hover:bg-[#166534] text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Meal</span>
          </Link>

          {/* User Avatar & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#e5e7eb]">
            <div className="w-8 h-8 rounded-full bg-[#dcfce7] border border-[#bbf7d0] text-[#15803d] font-bold text-xs flex items-center justify-center uppercase">
              {user?.username?.charAt(0) || 'U'}
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-full hover:bg-rose-50 text-[#6b7280] hover:text-rose-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </header>

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* 3. Mobile Bottom Navigation Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#e5e7eb] px-4 flex items-center justify-around z-30 shadow-lg">
        {navLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all
              ${isActive 
                ? 'text-[#15803d] font-semibold' 
                : 'text-[#6b7280] font-medium'}
            `}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>

    </div>
  );
}
