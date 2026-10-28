import React from 'react';
import { useIE, ScreenType } from '../context/IEContext';
import {
  LayoutDashboard,
  Layers,
  FileSpreadsheet,
  Shirt,
  GitBranch,
  Timer,
  FileCheck2,
  Users,
} from 'lucide-react';

interface SidebarItem {
  id: ScreenType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  kicker: string;
  count?: number | string;
}

export const Sidebar: React.FC = () => {
  const {
    currentScreen,
    setCurrentScreen,
    motherOperations,
    gsdOperations,
    styles,
    lineLayouts,
    skillMatrixRecords,
    operators,
    machines,
  } = useIE();

  const items: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'IE Analytics Dashboard',
      kicker: 'Overview & Slabs',
      icon: LayoutDashboard,
    },
    {
      id: 'mother-ops',
      label: 'Mother Operation Master',
      kicker: 'Basic / Inter / Advance',
      icon: Layers,
      count: motherOperations.length,
    },
    {
      id: 'gsd-ops',
      label: 'GSD Operation Master',
      kicker: 'SMV & Machine Category',
      icon: FileSpreadsheet,
      count: gsdOperations.length,
    },
    {
      id: 'style-master',
      label: 'Style Master (Catalog)',
      kicker: 'Create & Manage Styles',
      icon: Shirt,
      count: styles.length,
    },
    {
      id: 'style-mapping',
      label: 'Style GSD Mapping',
      kicker: 'Operation SMV Summation',
      icon: Layers,
    },
    {
      id: 'line-layout',
      label: 'Line Layout & Balancing',
      kicker: 'Workstations, Ops & Clone',
      icon: GitBranch,
      count: lineLayouts.length,
    },
    {
      id: 'skill-study',
      label: 'Stopwatch Capacity Study',
      kicker: 'Piece Counter & Swap',
      icon: Timer,
    },
    {
      id: 'skill-report',
      label: 'Skill Matrix Report',
      kicker: 'Historical Log & Exports',
      icon: FileCheck2,
      count: skillMatrixRecords.length,
    },
    {
      id: 'hris-machines',
      label: 'HRIS & Machine Inventory',
      kicker: '1,000 Ops · 2,000 Mchs',
      icon: Users,
      count: '3,000',
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-3.5rem)] flex flex-col justify-between">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          IE Workbench Modules
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white font-medium shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <div className="truncate">
                  <div className="text-xs truncate">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                    {item.kicker}
                  </div>
                </div>
              </div>

              {item.count !== undefined && (
                <span
                  className={`text-[11px] font-mono tabular-nums shrink-0 px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System summary strip */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500 space-y-1">
        <div className="flex justify-between">
          <span>HRIS Active Operators</span>
          <span className="font-mono tabular-nums text-slate-700 font-medium">{operators.length.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Machine Inventory</span>
          <span className="font-mono tabular-nums text-slate-700 font-medium">{machines.length.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Capacity Records</span>
          <span className="font-mono tabular-nums text-slate-700 font-medium">{skillMatrixRecords.length}</span>
        </div>
      </div>
    </aside>
  );
};
