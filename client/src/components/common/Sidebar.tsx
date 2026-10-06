import React from 'react';
import {
  LayoutDashboard,
  User,
  Scale,
  Utensils,
  Dumbbell,
  Footprints,
  Droplets,
  Target,
  LineChart,
  Calendar,
  Settings,
  X,
  Activity,
  Flame,
} from 'lucide-react';

export type NavTab =
  | 'daily_activity'
  | 'dashboard'
  | 'profile'
  | 'weight'
  | 'nutrition'
  | 'exercise'
  | 'running_walking'
  | 'water'
  | 'goals'
  | 'analytics'
  | 'history'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const NAV_ITEMS: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'daily_activity', label: 'Daily Activity Tracker', icon: Activity },
  { id: 'dashboard', label: 'Dashboard & Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'weight', label: 'Weight Tracking', icon: Scale },
  { id: 'nutrition', label: 'Nutrition / Food', icon: Utensils },
  { id: 'exercise', label: 'Exercise & Workouts', icon: Dumbbell },
  { id: 'running_walking', label: 'Running / Walking', icon: Footprints },
  { id: 'water', label: 'Water Tracking', icon: Droplets },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'analytics', label: 'Progress & Analytics', icon: LineChart },
  { id: 'history', label: 'Daily History', icon: Calendar },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex h-full flex-col justify-between p-4">
      <div>
        {/* Mobile Header with close button */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">FitTrack</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Motivational Card in Sidebar */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-4 border border-emerald-500/20 dark:bg-slate-800/60">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Flame className="h-4 w-4 text-amber-500" /> Daily Motivation
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 italic">
          "Consistency beats intensity. Small daily steps build massive long-term results."
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:block">
        {content}
      </aside>

      {/* Mobile Overlay Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-900 shadow-2xl transition-transform">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
