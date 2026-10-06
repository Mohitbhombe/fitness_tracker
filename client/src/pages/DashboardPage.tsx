import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { useDate } from '../context/DateContext';
import { calculateBMI, calculateDailyScore } from '../utils/fitnessCalculations';
import { StatCard } from '../components/common/StatCard';
import { CircularProgress } from '../components/common/CircularProgress';
import { ProgressBar } from '../components/common/ProgressBar';
import { WeightChart } from '../components/charts/WeightChart';
import { CalorieChart } from '../components/charts/CalorieChart';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { LogMealModal } from '../components/food/LogMealModal';
import { LogExerciseModal } from '../components/exercise/LogExerciseModal';
import { LogWeightModal } from '../components/weight/LogWeightModal';

import {
  Scale,
  Flame,
  Activity,
  Footprints,
  Droplets,
  Dumbbell,
  Beef,
  Plus,
  TrendingDown,
  Award,
  Zap,
  Sparkles,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { profile, dailySummary, weightLogs, meals, addWater, streaks } = useFitnessData();
  const { formattedDateLabel } = useDate();

  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  const bmiInfo = calculateBMI(profile.currentWeightKg, profile.heightCm);

  // Weight calculations
  const weightRemaining = Math.max(0, Math.round((profile.currentWeightKg - profile.targetWeightKg) * 10) / 10);
  const weightLost = Math.max(0, Math.round((profile.startingWeightKg - profile.currentWeightKg) * 10) / 10);

  // Calorie calculations
  const caloriesRemaining = Math.max(0, profile.calorieTarget - dailySummary.caloriesConsumed);

  // Fitness score
  const scoreBreakdown = calculateDailyScore({
    caloriesConsumed: dailySummary.caloriesConsumed,
    calorieTarget: profile.calorieTarget,
    exerciseMinutes: dailySummary.exerciseMinutes,
    exerciseGoalMinutes: 30,
    steps: dailySummary.steps,
    stepGoal: profile.stepGoal,
    waterMl: dailySummary.waterMl,
    waterGoalMl: profile.waterGoalMl,
    sleepHours: dailySummary.sleepHours,
    sleepGoalHours: profile.sleepGoalHours,
  });

  return (
    <div className="space-y-6 pb-20">
      <DisclaimerBanner />

      {/* Top Welcome Banner */}
      <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 text-white shadow-xl shadow-emerald-500/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Good Morning, {profile.fullName || 'Fitness Champion'} 👋
          </h1>
          <p className="mt-1 text-sm font-medium text-emerald-100 opacity-90">
            {formattedDateLabel} • Stay consistent with your weight loss journey!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsMealModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3.5 py-2 text-xs font-bold backdrop-blur-md transition hover:bg-white/30"
          >
            <Plus className="h-4 w-4" /> Log Meal
          </button>
          <button
            onClick={() => setIsExerciseModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-white/20 px-3.5 py-2 text-xs font-bold backdrop-blur-md transition hover:bg-white/30"
          >
            <Dumbbell className="h-4 w-4" /> Log Exercise
          </button>
          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-emerald-700 shadow-md transition hover:bg-emerald-50"
          >
            <Scale className="h-4 w-4" /> Record Weight
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Weight Summary */}
        <StatCard
          title="Current Weight"
          value={`${profile.currentWeightKg} kg`}
          subtext={`Target: ${profile.targetWeightKg} kg (${weightRemaining} kg left)`}
          icon={Scale}
          iconColorClass="bg-emerald-500/10 text-emerald-500"
          trend={{ text: `${weightLost} kg lost total`, isPositive: true }}
          onClick={() => setIsWeightModalOpen(true)}
        />

        {/* Calories Consumed */}
        <StatCard
          title="Calories Consumed"
          value={`${dailySummary.caloriesConsumed} kcal`}
          subtext={`Budget: ${profile.calorieTarget} kcal (${caloriesRemaining} kcal left)`}
          icon={Flame}
          iconColorClass="bg-amber-500/10 text-amber-500"
        />

        {/* Calories Burned */}
        <StatCard
          title="Calories Burned"
          value={`${dailySummary.totalActivityCalories} kcal`}
          subtext={`Exercise: ${dailySummary.workoutCalories} kcal`}
          icon={Zap}
          iconColorClass="bg-purple-500/10 text-purple-500"
        />

        {/* Steps */}
        <StatCard
          title="Daily Steps"
          value={dailySummary.steps.toLocaleString()}
          subtext={`Goal: ${profile.stepGoal.toLocaleString()} steps`}
          icon={Footprints}
          iconColorClass="bg-sky-500/10 text-sky-500"
        />
      </div>

      {/* Main Section: Calorie Progress & Water / Workout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calorie Ring & Macro Breakdown */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" /> Daily Calorie Budget & Progress
            </h3>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {caloriesRemaining > 0 ? `${caloriesRemaining} kcal remaining` : 'Target Met'}
            </span>
          </div>

          <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center p-4">
              <CircularProgress
                value={dailySummary.caloriesConsumed}
                max={profile.calorieTarget}
                size={170}
                strokeWidth={14}
                colorClass={
                  dailySummary.caloriesConsumed > profile.calorieTarget
                    ? 'stroke-rose-500'
                    : 'stroke-emerald-500'
                }
                label={`${dailySummary.caloriesConsumed}`}
                sublabel={`/ ${profile.calorieTarget} kcal`}
              />
            </div>

            <div className="space-y-4">
              <ProgressBar
                label="Protein 🥩"
                value={dailySummary.proteinG}
                max={profile.proteinGoal}
                unit="g"
                color="emerald"
                showPercentage
              />
              <ProgressBar
                label="Carbohydrates 🌾"
                value={dailySummary.carbsG}
                max={Math.round((profile.calorieTarget * 0.5) / 4)}
                unit="g"
                color="amber"
                showPercentage
              />
              <ProgressBar
                label="Fat 🥑"
                value={dailySummary.fatG}
                max={Math.round((profile.calorieTarget * 0.25) / 9)}
                unit="g"
                color="rose"
                showPercentage
              />
            </div>
          </div>
        </div>

        {/* Water & Quick Hydration Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Droplets className="h-5 w-5 text-sky-500" /> Water Intake
              </h3>
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                {(dailySummary.waterMl / 1000).toFixed(1)} / {(profile.waterGoalMl / 1000).toFixed(1)} L
              </span>
            </div>

            <ProgressBar
              value={dailySummary.waterMl}
              max={profile.waterGoalMl}
              color="sky"
              heightClass="h-4"
              showPercentage
            />

            <div className="mt-6">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 block">
                Quick Add Water:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addWater(250)}
                  className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-2 py-2 text-xs font-bold text-sky-600 hover:bg-sky-500/20 dark:text-sky-300"
                >
                  +250 ml
                </button>
                <button
                  onClick={() => addWater(500)}
                  className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-2 py-2 text-xs font-bold text-sky-600 hover:bg-sky-500/20 dark:text-sky-300"
                >
                  +500 ml
                </button>
                <button
                  onClick={() => addWater(750)}
                  className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-2 py-2 text-xs font-bold text-sky-600 hover:bg-sky-500/20 dark:text-sky-300"
                >
                  +750 ml
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>BMI Indicator</span>
              <span className={`font-bold text-${bmiInfo.color}-500`}>{bmiInfo.category}</span>
            </div>
            <div className="mt-1 text-lg font-black text-slate-900 dark:text-white">
              {bmiInfo.bmi} <span className="text-xs font-normal text-slate-400">kg/m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fitness Score & Daily Streak Card */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Fitness Score */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" /> Today's Fitness Score
            </h3>
            <span className="text-2xl font-black text-emerald-500">{scoreBreakdown.totalScore} / 100</span>
          </div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {scoreBreakdown.message}
          </p>

          <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
            <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
              <span className="block font-bold text-emerald-500">{scoreBreakdown.nutritionScore}/25</span>
              <span className="text-[10px] text-slate-400">Food</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
              <span className="block font-bold text-purple-500">{scoreBreakdown.exerciseScore}/25</span>
              <span className="text-[10px] text-slate-400">Workout</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
              <span className="block font-bold text-sky-500">{scoreBreakdown.stepsScore}/20</span>
              <span className="text-[10px] text-slate-400">Steps</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
              <span className="block font-bold text-blue-500">{scoreBreakdown.waterScore}/15</span>
              <span className="text-[10px] text-slate-400">Water</span>
            </div>
            <div className="rounded-xl bg-slate-50 p-2 dark:bg-slate-800">
              <span className="block font-bold text-indigo-500">{scoreBreakdown.sleepScore}/15</span>
              <span className="text-[10px] text-slate-400">Sleep</span>
            </div>
          </div>
        </div>

        {/* Streaks & Consistency */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" /> Active Fitness Streaks
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Consistency builds strong habits. Great effort!
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 p-3 border border-amber-500/20">
              <Flame className="h-6 w-6 text-amber-500 shrink-0" />
              <div>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {streaks.stepStreak} Days
                </span>
                <span className="block text-[11px] font-medium text-slate-500">Step Goal Streak</span>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-3 border border-emerald-500/20">
              <Sparkles className="h-6 w-6 text-emerald-500 shrink-0" />
              <div>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {streaks.calorieStreak} Days
                </span>
                <span className="block text-[11px] font-medium text-slate-500">Calorie Track Streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Weight Progress Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-emerald-500" /> 30-Day Weight Progress Trend
          </h3>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Target: {profile.targetWeightKg} kg
          </span>
        </div>
        <WeightChart weightLogs={weightLogs} targetWeightKg={profile.targetWeightKg} timeframeDays={30} />
      </div>

      {/* Modals */}
      <LogMealModal isOpen={isMealModalOpen} onClose={() => setIsMealModalOpen(false)} />
      <LogExerciseModal isOpen={isExerciseModalOpen} onClose={() => setIsExerciseModalOpen(false)} />
      <LogWeightModal isOpen={isWeightModalOpen} onClose={() => setIsWeightModalOpen(false)} />
    </div>
  );
};
