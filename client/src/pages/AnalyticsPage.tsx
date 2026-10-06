import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { WeightChart } from '../components/charts/WeightChart';
import { CalorieChart } from '../components/charts/CalorieChart';
import { LineChart as AnalyticsIcon, TrendingUp, Activity, Flame, Footprints, Droplets } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { weightLogs, meals, profile, walkingLogs, runningLogs, exercises, workouts } = useFitnessData();
  const [timeframe, setTimeframe] = useState<7 | 30 | 90 | 365>(30);

  // Aggregate step trends
  const stepData = walkingLogs.slice(-timeframe).map((w) => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    steps: w.steps,
  }));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <AnalyticsIcon className="h-6 w-6 text-emerald-500" /> Progress & Comprehensive Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-metric trends across weight, calories, exercise minutes, steps, water, and consistency.
          </p>
        </div>

        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800">
          {( [7, 30, 90, 365] as const).map((days) => (
            <button
              key={days}
              onClick={() => setTimeframe(days)}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                timeframe === days ? 'bg-emerald-500 text-white' : 'text-slate-500'
              }`}
            >
              {days === 365 ? '1 Year' : `${days} Days`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weight Progress Chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" /> Weight Progress Trend
          </h3>
          <WeightChart weightLogs={weightLogs} targetWeightKg={profile.targetWeightKg} timeframeDays={timeframe} />
        </div>

        {/* Calorie Intake Trend */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500" /> Calorie Consumption Trend
          </h3>
          <CalorieChart meals={meals} calorieTarget={profile.calorieTarget} days={timeframe} />
        </div>

        {/* Steps Trend */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Footprints className="h-5 w-5 text-sky-500" /> Daily Steps Trend
          </h3>
          {stepData.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">No step history available.</div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stepData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} steps`, 'Steps']}
                  />
                  <Bar dataKey="steps" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Workout Consistency & Exercise */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-purple-500" /> Workout Consistency Overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total sessions and active minutes logged over the selected {timeframe}-day window.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="rounded-2xl bg-purple-500/10 p-4 border border-purple-500/20 text-center">
              <span className="block text-2xl font-black text-purple-600 dark:text-purple-400">
                {workouts.length + exercises.length} Sessions
              </span>
              <span className="text-xs text-slate-500">Total Workouts Completed</span>
            </div>

            <div className="rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20 text-center">
              <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {runningLogs.reduce((acc, r) => acc + r.distanceKm, 0).toFixed(1)} km
              </span>
              <span className="text-xs text-slate-500">Total Running Distance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
