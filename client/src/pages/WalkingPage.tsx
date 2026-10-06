import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { useDate } from '../context/DateContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { Footprints, Plus, Flame, MapPin, Target, CheckCircle } from 'lucide-react';

export const WalkingPage: React.FC = () => {
  const { dailySummary, profile, setStepsForDate } = useFitnessData();
  const { selectedDate, formattedDateLabel } = useDate();

  const [inputSteps, setInputSteps] = useState<number>(dailySummary.steps || 7250);

  const stepGoal = profile.stepGoal || 10000;
  const currentSteps = dailySummary.steps;
  const walkingDist = dailySummary.walkingDistanceKm || Math.round(currentSteps * 0.00075 * 10) / 10;
  const walkingCals = Math.round(currentSteps * 0.04);

  const handleSaveSteps = async (e: React.FormEvent) => {
    e.preventDefault();
    await setStepsForDate(inputSteps);
  };

  const handleQuickAddSteps = async (delta: number) => {
    const newTotal = currentSteps + delta;
    setInputSteps(newTotal);
    await setStepsForDate(newTotal);
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Footprints className="h-6 w-6 text-sky-500" /> Walking & Step Tracker
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Track daily step count, walking distance, duration, and calories burned for {formattedDateLabel}.
        </p>
      </div>

      {/* Main Step Goal Progress Card */}
      <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-teal-500/5 to-emerald-500/10 p-6 shadow-sm dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Daily Step Goal Progress
            </span>
            <div className="mt-1 text-3xl font-black text-slate-900 dark:text-white">
              {currentSteps.toLocaleString()} <span className="text-base font-medium text-slate-500">/ {stepGoal.toLocaleString()} steps</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-800 text-center">
              <span className="block text-xs font-semibold text-slate-400">Distance</span>
              <span className="text-sm font-bold text-sky-500">{walkingDist} km</span>
            </div>
            <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-800 text-center">
              <span className="block text-xs font-semibold text-slate-400">Calories</span>
              <span className="text-sm font-bold text-amber-500">{walkingCals} kcal</span>
            </div>
          </div>
        </div>

        <ProgressBar value={currentSteps} max={stepGoal} color="sky" heightClass="h-4" showPercentage />

        {currentSteps >= stepGoal && (
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-4 w-4" /> 🎉 Daily 10,000 Step Goal Accomplished!
          </div>
        )}
      </div>

      {/* Quick Step Buttons & Manual Entry */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Quick Add Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Quick Add Steps
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Tap to instantly add steps taken during your walk today.
          </p>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleQuickAddSteps(1000)}
              className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3 text-center text-xs font-bold text-sky-600 hover:bg-sky-500/20 dark:text-sky-300"
            >
              +1,000 Steps
            </button>
            <button
              onClick={() => handleQuickAddSteps(2500)}
              className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3 text-center text-xs font-bold text-sky-600 hover:bg-sky-500/20 dark:text-sky-300"
            >
              +2,500 Steps
            </button>
            <button
              onClick={() => handleQuickAddSteps(5000)}
              className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-3 text-center text-xs font-bold text-sky-600 hover:bg-sky-500/20 dark:text-sky-300"
            >
              +5,000 Steps
            </button>
          </div>
        </div>

        {/* Manual Step Entry */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
            Update Total Step Count
          </h3>

          <form onSubmit={handleSaveSteps} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Step Count
              </label>
              <input
                type="number"
                min="0"
                required
                value={inputSteps}
                onChange={(e) => setInputSteps(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base font-bold text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-sky-500/20 hover:from-sky-600 hover:to-teal-700"
              >
                <Plus className="h-4 w-4" /> Save Step Count
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
