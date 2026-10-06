import React from 'react';
import { NavTab } from './Sidebar';
import { Activity, LayoutDashboard, Utensils, Dumbbell, Menu } from 'lucide-react';

interface MobileNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenMoreMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMoreMenu,
}) => {
  const primaryTabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'daily_activity', label: 'Activity', icon: Activity },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'nutrition', label: 'Food', icon: Utensils },
    { id: 'exercise', label: 'Exercise', icon: Dumbbell },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">
      {primaryTabs.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-xs font-semibold transition ${
              isActive
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? 'scale-110 text-emerald-500' : ''}`} />
            <span>{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMoreMenu}
        className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <Menu className="h-5 w-5" />
        <span>More</span>
      </button>
    </div>
  );
};
