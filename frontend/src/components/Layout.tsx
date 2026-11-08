import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  Activity, 
  Search, 
  ScanLine, 
  User, 
  LogOut, 
  ShieldCheck, 
  Terminal,
  Cpu
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
    { to: '/dashboard', icon: Activity, code: '01', label: 'COCKPIT' },
    { to: '/foods', icon: Search, code: '02', label: 'FOOD_DATABASE' },
    { to: '/scan', icon: ScanLine, code: '03', label: 'OPTICAL_HUD' },
    { to: '/profile', icon: User, code: '04', label: 'OPERATOR_METRICS' },
  ];

  return (
    <div className="min-h-screen bg-[#080d1a] text-[#dee2f5] flex flex-col antialiased selection:bg-[#10b981]/30">
      
      {/* 1. Global Fixed 48px Command Header (Stitch-designed) */}
      <header className="h-12 border-b border-white/10 bg-[#080d1a]/95 backdrop-blur px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-40 font-mono text-xs select-none">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-white font-bold tracking-tight">
            <span className="w-2.5 h-2.5 bg-[#10b981] rounded-sm" />
            <span className="font-heading text-sm font-bold tracking-wider">NutriTrack v2</span>
          </Link>

          <span className="hidden sm:inline text-white/20">|</span>

          {/* Operational Beacon */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#10b981]">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="font-semibold">INTAKE MESH ONLINE</span>
          </div>

          <span className="hidden lg:inline text-white/20">|</span>

          <div className="hidden lg:flex items-center gap-2 text-[10px] text-[#94a3b8]">
            <Cpu className="w-3 h-3 text-[#0ea5e9]" />
            <span>NODE: AP-SOUTHEAST-3 // 14ms</span>
          </div>
        </div>

        {/* Right Header Status */}
        <div className="flex items-center gap-3">
          <div className="px-2 py-0.5 rounded bg-[#0c1322] border border-white/10 text-[10px] text-[#94a3b8] flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-[#10b981]" />
            <span className="text-white font-semibold">{user?.username || 'OP // N-01'}</span>
          </div>

          <button
            onClick={handleLogout}
            title="Disconnect Terminal Session"
            className="p-1.5 rounded hover:bg-rose-500/10 text-[#94a3b8] hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Main Body with Side Dock and Content Area */}
      <div className="flex-1 flex flex-col md:flex-row min-w-0">
        
        {/* Desktop Side Dock (Stitch-designed) */}
        <aside className="hidden md:flex md:w-56 flex-col justify-between border-r border-white/10 bg-[#0c1322] p-3 shrink-0 z-20 font-mono text-xs">
          <div className="space-y-4">
            <div className="px-2 pt-1 text-[10px] uppercase tracking-wider text-white/40 font-semibold">
              NAVIGATION_ROUTES
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center justify-between px-2.5 py-2 rounded text-[11px] font-semibold transition-all
                    ${isActive 
                      ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40' 
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/5 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] text-white/30 tabular-numbers">{item.code}</span>
                </NavLink>
              ))}

              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `
                    flex items-center justify-between px-2.5 py-2 rounded text-[11px] font-semibold transition-all
                    ${isActive 
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/40' 
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/5 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>ADMIN_GOVERNANCE</span>
                  </div>
                  <span className="text-[9px] text-white/30">05</span>
                </NavLink>
              )}
            </nav>
          </div>

          {/* Micro Telemetry Footer */}
          <div className="pt-3 border-t border-white/5 space-y-2 text-[10px] text-[#94a3b8]">
            <div className="p-2 bg-[#080d1a] border border-white/5 rounded space-y-1">
              <div className="flex items-center justify-between text-white/70">
                <span>SECURITY GUARD</span>
                <span className="text-[#10b981]">ARMED</span>
              </div>
              <p className="text-[9px] text-white/40 leading-tight">
                Zero PII leak policy. Audit trail logged via OMEGA scanner.
              </p>
            </div>
            <div className="flex items-center justify-between text-[9px] text-white/40 px-1">
              <span>BUILD: 2.4.9-PROD</span>
              <span className="text-[#10b981]">OK</span>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 p-3 md:p-5 max-w-7xl w-full mx-auto pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0c1322] border-t border-white/10 px-2 flex items-center justify-around z-30 font-mono text-[10px]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded transition-all
              ${isActive 
                ? 'text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30' 
                : 'text-[#94a3b8] hover:text-white'}
            `}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label.replace('_', ' ')}</span>
          </NavLink>
        ))}
      </nav>

    </div>
  );
}
