import { NavLink, Outlet } from 'react-router-dom';
import { Home, Search, Book, Camera, User, Utensils } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/foods', icon: Search, label: 'Foods' },
    { to: '/scan', icon: Camera, label: 'Scan Label' },
    { to: '/diary', icon: Book, label: 'Diary' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center pb-20 md:pb-0 md:flex-row relative overflow-hidden">
      
      {/* Abstract Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 z-10 min-h-screen">
        <header className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
            <Utensils className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Nutritrack
          </h1>
        </header>
        
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) & Side Navigation (Desktop) */}
      <nav className="glass fixed bottom-0 left-0 w-full md:relative md:w-64 md:h-screen z-50 flex md:flex-col justify-around md:justify-start items-center md:items-start p-3 md:p-6 border-t md:border-t-0 md:border-r border-slate-700/50">
        
        <div className="hidden md:flex items-center gap-3 mb-10 w-full justify-center opacity-0">
           {/* Placeholder for alignment */}
        </div>

        <ul className="flex md:flex-col w-full justify-around md:justify-start gap-2">
          {navItems.map((item) => (
            <li key={item.to} className="md:w-full">
              <NavLink
                to={item.to}
                className={({ isActive }) => cn(
                  "flex flex-col md:flex-row items-center gap-1 md:gap-4 p-2 md:px-4 md:py-3 rounded-xl transition-all duration-300",
                  isActive 
                    ? "text-emerald-400 bg-emerald-400/10 shadow-[inset_0px_0px_20px_rgba(16,185,129,0.1)] border border-emerald-400/20" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
                )}
              >
                <item.icon className="w-6 h-6" strokeWidth={1.5} />
                <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
    </div>
  );
}
