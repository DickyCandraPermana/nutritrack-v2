import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  ScanLine, 
  User, 
  Activity, 
  LogOut, 
  Shield, 
  Sparkles 
} from 'lucide-react';
import useAuthStore from '../store/authStore';

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Telemetry' },
    { to: '/foods', icon: Search, label: 'Food Database' },
    { to: '/scan', icon: ScanLine, label: 'Optical Scanner' },
    { to: '/profile', icon: User, label: 'Health Profile' },
  ];

  return (
    <div className="min-h-screen bg-[#0b111e] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500/30">
      
      {/* Desktop Sidebar (Operate & Command Console) */}
      <aside className="hidden md:flex md:w-64 flex-col justify-between border-r border-[#1f2e47] bg-[#0e1626] p-5 shrink-0 z-20">
        <div className="space-y-6">
          
          {/* Brand & Telemetry Badge */}
          <div className="space-y-2">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/25 transition-all">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="font-heading font-bold text-lg tracking-tight text-white block leading-none">
                  NutriTrack
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400/90 font-medium">
                  Clinical Console
                </span>
              </div>
            </Link>

            {/* System Telemetry Pill */}
            <div className="px-2.5 py-1.5 rounded-md bg-[#141f33] border border-[#1f2e47] flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                API Mesh Live
              </span>
              <span className="text-slate-500">v2.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="px-2 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Workspaces
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#141f33] border border-transparent'}
                `}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-purple-500/10 text-purple-300 border border-purple-500/25' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#141f33] border border-transparent'}
                `}
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span>Admin Governance</span>
              </NavLink>
            )}
          </nav>
        </div>

        {/* User Status & Action Footer */}
        <div className="pt-4 border-t border-[#1f2e47] space-y-3">
          <Link 
            to="/premium"
            className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border border-emerald-500/20 hover:border-emerald-500/40 transition-all text-xs"
          >
            <span className="flex items-center gap-2 text-emerald-300 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              NutriAI Vision
            </span>
            <span className="text-[10px] font-mono uppercase text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Active
            </span>
          </Link>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#1b273d] border border-[#2b3c59] flex items-center justify-center text-xs font-semibold text-slate-200 uppercase shrink-0">
                {user?.username?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-medium text-slate-200 truncate leading-none">
                  {user?.username || 'Authenticated'}
                </p>
                <p className="text-[10px] text-slate-500 font-mono truncate mt-0.5">
                  {user?.email || 'Logged In'}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        
        {/* Top Header Bar */}
        <header className="h-14 border-b border-[#1f2e47] bg-[#0e1626]/80 backdrop-blur px-4 md:px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="font-heading font-semibold text-sm text-slate-200 flex items-center gap-2">
              <span className="text-emerald-400">●</span>
              Clinical Dietary Telemetry
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/scan"
              className="px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-[#002113] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Scan Food</span>
            </Link>
            <Link
              to="/foods"
              className="px-3 py-1.5 rounded-md bg-[#162238] hover:bg-[#1c2c47] text-slate-200 border border-[#263854] text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Catalog</span>
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0e1626] border-t border-[#1f2e47] px-3 flex items-center justify-around z-30">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-all
              ${isActive 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-slate-400 hover:text-slate-200'}
            `}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium text-slate-400 hover:text-rose-400"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit</span>
        </button>
      </nav>

    </div>
  );
}
