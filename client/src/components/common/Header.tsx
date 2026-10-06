import React, { useState } from 'react';
import { useDate } from '../../context/DateContext';
import { useTheme } from '../../context/ThemeContext';
import { useFitnessData } from '../../context/FitnessDataContext';
import {
  Calendar as CalendarIcon,
  Sun,
  Moon,
  Bell,
  ChevronLeft,
  ChevronRight,
  Activity,
  Flame,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { selectedDate, setSelectedDate, goToToday, formattedDateLabel, isToday } = useDate();
  const { theme, toggleTheme } = useTheme();
  const { profile, streaks } = useFitnessData();
  const [showRemindersDropdown, setShowRemindersDropdown] = useState(false);

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-emerald-500/10 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open Navigation Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/30">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Fit<span className="text-emerald-500">Track</span>
            </span>
            <span className="hidden text-xs font-medium text-emerald-600 dark:text-emerald-400 sm:inline-block sm:ml-2">
              PRO
            </span>
          </div>
        </div>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center gap-1 sm:gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-2 py-1 dark:border-slate-800 dark:bg-slate-800/80">
        <button
          onClick={handlePrevDay}
          className="rounded-lg p-1 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Previous Day"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="relative flex items-center gap-1.5 px-1 sm:px-2">
          <CalendarIcon className="h-4 w-4 text-emerald-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          />
          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100">
            {formattedDateLabel}
          </span>
        </div>

        <button
          onClick={handleNextDay}
          className="rounded-lg p-1 text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Next Day"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {!isToday && (
          <button
            onClick={goToToday}
            className="ml-1 rounded-md bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white transition hover:bg-emerald-600"
          >
            Today
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Streak Counter */}
        <div className="hidden sm:flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
          <span>{streaks.stepStreak} Day Streak</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowRemindersDropdown(!showRemindersDropdown)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            title="Reminders & Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />
          </button>

          {showRemindersDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Daily Reminders
              </h4>
              <ul className="mt-2 space-y-2 text-xs">
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-sky-500" /> 💧 Drink 250ml Water (10:00 AM)
                </li>
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> 🥗 Log Lunch (01:00 PM)
                </li>
                <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> 🏃 10,000 Step Goal Progress
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-sm font-bold text-white shadow-md">
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'M'}
          </div>
        </div>
      </div>
    </header>
  );
};
