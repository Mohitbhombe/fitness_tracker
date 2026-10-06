import React from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { useDate } from '../context/DateContext';
import { Calendar, Scale, Utensils, Footprints, Droplets, Moon, Dumbbell } from 'lucide-react';

export const DailyHistoryPage: React.FC = () => {
  const { dailySummary, meals, weightLogs, exercises, workouts, runningLogs, sleepLog } = useFitnessData();
  const { selectedDate, formattedDateLabel, setSelectedDate } = useDate();

  const dayMeals = meals.filter((m) => m.date === selectedDate);
  const dayExercises = exercises.filter((e) => e.date === selectedDate);
  const dayWorkouts = workouts.filter((w) => w.date === selectedDate);
  const dayRuns = runningLogs.filter((r) => r.date === selectedDate);
  const dayWeight = weightLogs.find((w) => w.date === selectedDate);

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-emerald-500" /> Complete Daily History Timeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View full historical log breakdown for any date in your fitness journal.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Date Title Banner */}
      <div className="rounded-3xl bg-slate-900 p-6 text-white dark:bg-slate-800">
        <h2 className="text-xl font-bold">{formattedDateLabel} Overview</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4 text-slate-300">
          <div>Weight: <span className="font-bold text-emerald-400">{dayWeight ? `${dayWeight.weightKg} kg` : 'Not recorded'}</span></div>
          <div>Total Calories: <span className="font-bold text-amber-400">{dailySummary.caloriesConsumed} kcal</span></div>
          <div>Steps: <span className="font-bold text-sky-400">{dailySummary.steps}</span></div>
          <div>Water: <span className="font-bold text-blue-400">{(dailySummary.waterMl / 1000).toFixed(1)} L</span></div>
        </div>
      </div>

      {/* Daily Timeline Cards */}
      <div className="space-y-4">
        {/* Meals Timeline */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Utensils className="h-5 w-5 text-emerald-500" /> Meals & Food ({dayMeals.length})
          </h3>

          {dayMeals.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No meals recorded for this date.</p>
          ) : (
            <div className="space-y-2">
              {dayMeals.map((m) => (
                <div key={m.id} className="flex justify-between items-center rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800">
                  <div>
                    <span className="font-bold capitalize text-slate-900 dark:text-white">[{m.mealType}] {m.foodName}</span>
                    <span className="block text-[11px] text-slate-500">{m.quantity} {m.servingUnit} • {m.time}</span>
                  </div>
                  <span className="font-bold text-emerald-500">{m.calories} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exercises Timeline */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Dumbbell className="h-5 w-5 text-purple-500" /> Workouts & Exercise ({dayExercises.length + dayWorkouts.length})
          </h3>

          {dayExercises.length === 0 && dayWorkouts.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No exercise recorded for this date.</p>
          ) : (
            <div className="space-y-2">
              {dayWorkouts.map((w) => (
                <div key={w.id} className="rounded-xl bg-purple-500/10 p-3 text-xs dark:bg-purple-950/40">
                  <span className="font-bold text-purple-600 dark:text-purple-300">{w.title}</span>
                  <span className="block text-[11px] text-slate-500">{w.durationMinutes} mins • {w.caloriesBurned} kcal burned</span>
                </div>
              ))}
              {dayExercises.map((e) => (
                <div key={e.id} className="flex justify-between items-center rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800">
                  <span>{e.name} ({e.durationMinutes} mins)</span>
                  <span className="font-bold text-purple-500">{e.caloriesBurned} kcal</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
