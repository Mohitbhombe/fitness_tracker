import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { useDate } from '../context/DateContext';
import { StatCard } from '../components/common/StatCard';
import { CircularProgress } from '../components/common/CircularProgress';
import { ProgressBar } from '../components/common/ProgressBar';
import { DailyActivityTimeline } from '../components/daily/DailyActivityTimeline';
import { DailyHabitsTracker } from '../components/daily/DailyHabitsTracker';
import { LogMealModal } from '../components/food/LogMealModal';
import { LogExerciseModal } from '../components/exercise/LogExerciseModal';
import { LogWeightModal } from '../components/weight/LogWeightModal';
import {
  Activity,
  Flame,
  Footprints,
  Droplets,
  Zap,
  Award,
  Calendar,
  Sparkles,
  Plus,
  Dumbbell,
  Scale,
  Utensils,
  Moon,
} from 'lucide-react';

export const DailyActivityPage: React.FC = () => {
  const { profile, dailySummary, addWater, streaks } = useFitnessData();
  const { formattedDateLabel } = useDate();

  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  // Energy Balance (Consumed vs Burned)
  const netEnergyKcal = dailySummary.caloriesConsumed - dailySummary.totalActivityCalories;
  const stepPercent = Math.min(100, Math.round((dailySummary.steps / profile.stepGoal) * 100));
  const waterPercent = Math.min(100, Math.round((dailySummary.waterMl / profile.waterGoalMl) * 100));
  const exercisePercent = Math.min(100, Math.round((dailySummary.exerciseMinutes / 30) * 100));

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 text-white shadow-xl shadow-emerald-500/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="h-4 w-4" /> Live Daily Activity Tracker
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            {formattedDateLabel} Overview
          </h1>
          <p className="mt-1 text-xs text-emerald-100 opacity-90">
            Track steps, active calories, hydration, workouts, and daily habits in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsMealModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3.5 py-2 text-xs font-bold backdrop-blur-md transition hover:bg-white/30"
          >
            <Utensils className="h-4 w-4" /> + Meal
          </button>
          <button
            onClick={() => setIsExerciseModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3.5 py-2 text-xs font-bold backdrop-blur-md transition hover:bg-white/30"
          >
            <Dumbbell className="h-4 w-4" /> + Workout
          </button>
          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-emerald-700 shadow-md transition hover:bg-emerald-50"
          >
            <Scale className="h-4 w-4" /> + Weight
          </button>
        </div>
      </div>

      {/* Main Activity Progress Rings Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Steps Ring Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center text-center">
          <div className="mb-2 flex w-full items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Footprints className="h-4 w-4 text-sky-500" /> Daily Steps
            </span>
            <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-bold text-sky-600 dark:text-sky-400">
              {stepPercent}%
            </span>
          </div>

          <CircularProgress
            value={dailySummary.steps}
            max={profile.stepGoal}
            size={130}
            strokeWidth={10}
            colorClass="stroke-sky-500"
            label={`${dailySummary.steps.toLocaleString()}`}
            sublabel={`/ ${profile.stepGoal.toLocaleString()}`}
          />
          <span className="mt-3 text-xs text-slate-400">
            {dailySummary.walkingDistanceKm} km walked today
          </span>
        </div>

        {/* Active Minutes Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center text-center">
          <div className="mb-2 flex w-full items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Zap className="h-4 w-4 text-purple-500" /> Active Exercise
            </span>
            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400">
              {exercisePercent}%
            </span>
          </div>

          <CircularProgress
            value={dailySummary.exerciseMinutes}
            max={30}
            size={130}
            strokeWidth={10}
            colorClass="stroke-purple-500"
            label={`${dailySummary.exerciseMinutes}`}
            sublabel="/ 30 mins"
          />
          <span className="mt-3 text-xs text-slate-400">
            {dailySummary.workoutCalories} active kcal burned
          </span>
        </div>

        {/* Hydration Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col items-center text-center">
          <div className="mb-2 flex w-full items-center justify-between">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Droplets className="h-4 w-4 text-blue-500" /> Hydration Level
            </span>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
              {waterPercent}%
            </span>
          </div>

          <CircularProgress
            value={dailySummary.waterMl}
            max={profile.waterGoalMl}
            size={130}
            strokeWidth={10}
            colorClass="stroke-blue-500"
            label={`${(dailySummary.waterMl / 1000).toFixed(1)} L`}
            sublabel={`/ ${(profile.waterGoalMl / 1000).toFixed(1)} L`}
          />
          <div className="mt-3 flex gap-1">
            <button
              onClick={() => addWater(250)}
              className="rounded-lg bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-600 hover:bg-blue-500/20 dark:text-blue-400"
            >
              +250ml
            </button>
            <button
              onClick={() => addWater(500)}
              className="rounded-lg bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-600 hover:bg-blue-500/20 dark:text-blue-400"
            >
              +500ml
            </button>
          </div>
        </div>

        {/* Energy Balance Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <Flame className="h-4 w-4 text-amber-500" /> Energy Balance
              </span>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                Net: {netEnergyKcal} kcal
              </span>
            </div>

            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Consumed:</span>
                  <span className="font-bold text-amber-500">{dailySummary.caloriesConsumed} kcal</span>
                </div>
                <ProgressBar value={dailySummary.caloriesConsumed} max={profile.calorieTarget} color="amber" heightClass="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Total Activity Burn:</span>
                  <span className="font-bold text-purple-500">{dailySummary.totalActivityCalories} kcal</span>
                </div>
                <ProgressBar value={dailySummary.totalActivityCalories} max={800} color="purple" heightClass="h-2" />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/60 text-center">
            <span className="text-[11px] font-medium text-slate-500 block">Daily Fitness Score</span>
            <span className="text-xl font-black text-emerald-500">{dailySummary.dailyScore} / 100</span>
          </div>
        </div>
      </div>

      {/* Daily Habits & Routine Checklist */}
      <DailyHabitsTracker />

      {/* Hourly Timeline */}
      <DailyActivityTimeline
        onOpenMealModal={() => setIsMealModalOpen(true)}
        onOpenExerciseModal={() => setIsExerciseModalOpen(true)}
        onOpenWeightModal={() => setIsWeightModalOpen(true)}
      />

      {/* Modals */}
      <LogMealModal isOpen={isMealModalOpen} onClose={() => setIsMealModalOpen(false)} />
      <LogExerciseModal isOpen={isExerciseModalOpen} onClose={() => setIsExerciseModalOpen(false)} />
      <LogWeightModal isOpen={isWeightModalOpen} onClose={() => setIsWeightModalOpen(false)} />
    </div>
  );
};
