import React from 'react';
import { useFitnessData } from '../../context/FitnessDataContext';
import { useDate } from '../../context/DateContext';
import {
  Utensils,
  Dumbbell,
  Footprints,
  Droplets,
  Moon,
  Scale,
  Clock,
  Flame,
  CheckCircle2,
  Plus,
} from 'lucide-react';

interface DailyActivityTimelineProps {
  onOpenMealModal: () => void;
  onOpenExerciseModal: () => void;
  onOpenWeightModal: () => void;
}

export const DailyActivityTimeline: React.FC<DailyActivityTimelineProps> = ({
  onOpenMealModal,
  onOpenExerciseModal,
  onOpenWeightModal,
}) => {
  const { meals, exercises, workouts, runningLogs, walkingLogs, waterLogMl, sleepLog, weightLogs, addWater } =
    useFitnessData();
  const { selectedDate, formattedDateLabel } = useDate();

  // Consolidate into timeline items
  const timelineItems: Array<{
    id: string;
    time: string;
    title: string;
    description: string;
    type: 'meal' | 'exercise' | 'workout' | 'run' | 'walk' | 'water' | 'sleep' | 'weight';
    badge: string;
    badgeColor: string;
    icon: React.FC<{ className?: string }>;
    iconBg: string;
    calories?: string;
  }> = [];

  // Meals
  meals
    .filter((m) => m.date === selectedDate)
    .forEach((m) => {
      timelineItems.push({
        id: m.id,
        time: m.time || '12:00 PM',
        title: `${m.mealType.toUpperCase()}: ${m.foodName}`,
        description: `P: ${m.protein}g | C: ${m.carbs}g | F: ${m.fat}g`,
        type: 'meal',
        badge: `${m.calories} kcal`,
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        icon: Utensils,
        iconBg: 'bg-amber-500 text-white',
        calories: `+${m.calories} kcal`,
      });
    });

  // Exercises
  exercises
    .filter((e) => e.date === selectedDate)
    .forEach((e) => {
      timelineItems.push({
        id: e.id,
        time: '06:30 PM',
        title: e.name,
        description: `${e.category} • ${e.durationMinutes} mins ${e.sets ? `• ${e.sets} sets x ${e.reps} reps` : ''}`,
        type: 'exercise',
        badge: `-${e.caloriesBurned} kcal burned`,
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
        icon: Dumbbell,
        iconBg: 'bg-purple-500 text-white',
        calories: `-${e.caloriesBurned} kcal`,
      });
    });

  // Workouts
  workouts
    .filter((w) => w.date === selectedDate)
    .forEach((w) => {
      timelineItems.push({
        id: w.id,
        time: '05:00 PM',
        title: w.title,
        description: `${w.exercises.length} exercises logged • ${w.durationMinutes} minutes`,
        type: 'workout',
        badge: `-${w.caloriesBurned} kcal burned`,
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        icon: Dumbbell,
        iconBg: 'bg-emerald-500 text-white',
        calories: `-${w.caloriesBurned} kcal`,
      });
    });

  // Running
  runningLogs
    .filter((r) => r.date === selectedDate)
    .forEach((r) => {
      timelineItems.push({
        id: r.id,
        time: '07:00 AM',
        title: `Running Session (${r.distanceKm} km)`,
        description: `Duration: ${r.durationMinutes} mins • Pace: ${r.paceMinPerKm}`,
        type: 'run',
        badge: `-${r.caloriesBurned} kcal`,
        badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        icon: Footprints,
        iconBg: 'bg-rose-500 text-white',
        calories: `-${r.caloriesBurned} kcal`,
      });
    });

  // Walking
  const todayWalk = walkingLogs.find((w) => w.date === selectedDate);
  if (todayWalk && todayWalk.steps > 0) {
    timelineItems.push({
      id: todayWalk.id,
      time: 'Daily Total',
      title: `Steps & Walking Log`,
      description: `${todayWalk.steps.toLocaleString()} steps • ${todayWalk.distanceKm} km walked`,
      type: 'walk',
      badge: `-${todayWalk.caloriesBurned} kcal`,
      badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      icon: Footprints,
      iconBg: 'bg-sky-500 text-white',
    });
  }

  // Water Log
  if (waterLogMl > 0) {
    timelineItems.push({
      id: 'water_today',
      time: 'Hydration',
      title: `Water Intake Total`,
      description: `${(waterLogMl / 1000).toFixed(1)} Liters consumed today`,
      type: 'water',
      badge: `${waterLogMl} ml`,
      badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      icon: Droplets,
      iconBg: 'bg-sky-500 text-white',
    });
  }

  // Sleep
  if (sleepLog && sleepLog.date === selectedDate) {
    timelineItems.push({
      id: sleepLog.id,
      time: sleepLog.wakeTime || '07:00 AM',
      title: `Sleep Log (${sleepLog.durationHours} hrs)`,
      description: `Slept at ${sleepLog.sleepTime} • Quality: ${sleepLog.quality || 'Good'}`,
      type: 'sleep',
      badge: `${sleepLog.durationHours} hrs`,
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      icon: Moon,
      iconBg: 'bg-indigo-500 text-white',
    });
  }

  // Weight Log
  const todayWeight = weightLogs.find((w) => w.date === selectedDate);
  if (todayWeight) {
    timelineItems.push({
      id: todayWeight.id,
      time: '07:15 AM',
      title: `Morning Weight Entry`,
      description: `Body weight recorded: ${todayWeight.weightKg} kg ${todayWeight.bodyFatPercentage ? `• ${todayWeight.bodyFatPercentage}% Body Fat` : ''}`,
      type: 'weight',
      badge: `${todayWeight.weightKg} kg`,
      badgeColor: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
      icon: Scale,
      iconBg: 'bg-teal-500 text-white',
    });
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-500" /> Daily Activity Timeline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chronological breakdown for {formattedDateLabel}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenMealModal}
            className="flex items-center gap-1 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
          >
            <Plus className="h-3.5 w-3.5" /> Log Meal
          </button>
          <button
            onClick={onOpenExerciseModal}
            className="flex items-center gap-1 rounded-xl bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-600 hover:bg-purple-500/20 dark:text-purple-400"
          >
            <Plus className="h-3.5 w-3.5" /> Log Exercise
          </button>
          <button
            onClick={() => addWater(250)}
            className="flex items-center gap-1 rounded-xl bg-sky-500/10 px-3 py-1.5 text-xs font-bold text-sky-600 hover:bg-sky-500/20 dark:text-sky-400"
          >
            <Plus className="h-3.5 w-3.5" /> +250ml Water
          </button>
          <button
            onClick={onOpenWeightModal}
            className="flex items-center gap-1 rounded-xl bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-teal-600 hover:bg-teal-500/20 dark:text-teal-400"
          >
            <Plus className="h-3.5 w-3.5" /> Log Weight
          </button>
        </div>
      </div>

      {timelineItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
          <Clock className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No activities logged yet for today</h4>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            Use the buttons above to log your morning weight, breakfast meal, workout, or water intake!
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {timelineItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative flex items-start gap-4 group">
                <div
                  className={`absolute -left-6 top-1 flex h-6 w-6 items-center justify-center rounded-full ${item.iconBg} ring-4 ring-white dark:ring-slate-900 shadow-sm transition group-hover:scale-110`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <div className="flex-1 rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-800/40 dark:hover:border-slate-700 dark:hover:bg-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {item.time}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h4 className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{item.title}</h4>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
