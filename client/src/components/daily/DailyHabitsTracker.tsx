import React, { useState } from 'react';
import { INITIAL_HABITS } from '../../utils/sampleData';
import {
  CheckCircle2,
  Circle,
  Flame,
  Plus,
  Footprints,
  Droplets,
  Dumbbell,
  Moon,
  Utensils,
  Sun,
  Sparkles,
} from 'lucide-react';

interface HabitItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  targetPerDay: number;
  unit: string;
  streak: number;
  completed?: boolean;
}

export const DailyHabitsTracker: React.FC = () => {
  const [habits, setHabits] = useState<HabitItem[]>(() => {
    const saved = localStorage.getItem('fittrack_user_habits');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_HABITS.map((h) => ({ ...h, completed: false }));
  });

  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleHabit = (id: string) => {
    const updated = habits.map((h) => {
      if (h.id === id) {
        const isNowCompleted = !h.completed;
        return {
          ...h,
          completed: isNowCompleted,
          streak: isNowCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      }
      return h;
    });
    setHabits(updated);
    localStorage.setItem('fittrack_user_habits', JSON.stringify(updated));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    const newHabit: HabitItem = {
      id: `hab_${Date.now()}`,
      title: newHabitTitle.trim(),
      category: 'routine',
      icon: 'Sparkles',
      targetPerDay: 1,
      unit: 'times',
      streak: 0,
      completed: false,
    };
    const updated = [...habits, newHabit];
    setHabits(updated);
    localStorage.setItem('fittrack_user_habits', JSON.stringify(updated));
    setNewHabitTitle('');
    setShowAddForm(false);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="h-4 w-4 text-sky-500" />;
      case 'Droplets':
        return <Droplets className="h-4 w-4 text-blue-500" />;
      case 'Dumbbell':
        return <Dumbbell className="h-4 w-4 text-purple-500" />;
      case 'Moon':
        return <Moon className="h-4 w-4 text-indigo-500" />;
      case 'Utensils':
        return <Utensils className="h-4 w-4 text-amber-500" />;
      case 'Sun':
        return <Sun className="h-4 w-4 text-emerald-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-emerald-500" />;
    }
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const progressPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Daily Habits & Routine Checklist
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {completedCount} of {habits.length} habits completed today ({progressPercent}%)
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
        >
          <Plus className="h-4 w-4" /> Add Habit
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddHabit} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Enter new custom daily habit (e.g. 15 Min Reading)..."
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600"
          >
            Save
          </button>
        </form>
      )}

      {/* Habits List */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {habits.map((habit) => (
          <div
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
              habit.completed
                ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
                  habit.completed ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'
                }`}
              >
                {habit.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500 fill-emerald-500/20" />
                ) : (
                  <Circle className="h-6 w-6" />
                )}
              </button>

              <div>
                <div className="flex items-center gap-1.5">
                  {renderIcon(habit.icon)}
                  <span
                    className={`text-xs font-bold ${
                      habit.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {habit.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Target: {habit.targetPerDay} {habit.unit}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Flame className="h-3 w-3 text-amber-500" />
              <span>{habit.streak}d streak</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
