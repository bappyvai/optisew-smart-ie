import React from 'react';
import { useIE, ScreenType } from '../context/IEContext';
import { Play, RotateCcw, LogOut, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentScreen, setCurrentScreen, resetDataToFactoryDefaults, logout, currentUser } = useIE();

  const navLinks: { label: string; screen: ScreenType }[] = [
    { label: 'IE Dashboard', screen: 'dashboard' },
    { label: 'Style Master', screen: 'style-master' },
    { label: 'GSD Mapping', screen: 'style-mapping' },
    { label: 'Line Layouts', screen: 'line-layout' },
    { label: 'Live Capacity Study', screen: 'skill-study' },
    { label: 'Skill Report', screen: 'skill-report' },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between gap-8 border-b border-slate-200 bg-white/95 px-6 backdrop-blur-xs">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setCurrentScreen('dashboard')}
          className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap hover:text-slate-700 transition-colors"
        >
          OptiSew Smart IE
        </button>
        <span className="hidden sm:inline-block text-xs font-mono text-slate-400">· Apparel MES</span>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
        {navLinks.map((link) => (
          <button
            key={link.screen}
            onClick={() => setCurrentScreen(link.screen)}
            className={`whitespace-nowrap transition-colors hover:text-slate-900 ${
              currentScreen === link.screen
                ? 'text-slate-900 underline underline-offset-8 decoration-2 decoration-slate-900'
                : 'text-slate-500'
            }`}
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: 1 primary action & Account profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={resetDataToFactoryDefaults}
          title="Restore factory default test dataset"
          className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span>Reset Data</span>
        </button>

        {/* User Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs">
          <User className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-semibold text-slate-900">{currentUser?.username || 'admin'}</span>
          <span className="text-[10px] text-slate-400">(Chief IE)</span>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign out of IE Workbench"
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
