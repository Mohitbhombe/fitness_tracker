import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { useDate } from '../context/DateContext';
import { calculateRunningPace, calculateCaloriesBurned } from '../utils/fitnessCalculations';
import { Footprints, Plus, Flame, Timer, Trophy, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const RunningPage: React.FC = () => {
  const { runningLogs, addRunningLog, profile } = useFitnessData();
  const { selectedDate } = useDate();

  const [distanceKm, setDistanceKm] = useState<number>(5);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [notes, setNotes] = useState('');

  const paceInfo = calculateRunningPace(durationMinutes, distanceKm);
  const estimatedCalories = calculateCaloriesBurned('Running', durationMinutes, profile.currentWeightKg);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!distanceKm || distanceKm <= 0 || !durationMinutes) return;

    await addRunningLog({
      date: selectedDate,
      distanceKm,
      durationMinutes,
      paceMinPerKm: paceInfo.paceString,
      caloriesBurned: estimatedCalories,
      notes: notes.trim() || undefined,
    });

    setNotes('');
  };

  // Stats aggregate
  const totalRuns = runningLogs.length;
  const totalDistance = Math.round(runningLogs.reduce((acc, r) => acc + r.distanceKm, 0) * 10) / 10;
  const totalCalories = runningLogs.reduce((acc, r) => acc + r.caloriesBurned, 0);

  const bestPaceLog = runningLogs.length > 0
    ? [...runningLogs].sort((a, b) => {
        const paceA = parseFloat(a.paceMinPerKm.replace(':', '.')) || 99;
        const paceB = parseFloat(b.paceMinPerKm.replace(':', '.')) || 99;
        return paceA - paceB;
      })[0]
    : null;

  const chartData = [...runningLogs]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => ({
      date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      distance: r.distanceKm,
    }));

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Footprints className="h-6 w-6 text-emerald-500" /> Dedicated Running Tracker
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Track running distance, duration, automatic pace calculations (min/km), and history.
        </p>
      </div>

      {/* Aggregate Running Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase text-slate-400">Total Runs</div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{totalRuns} Runs</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase text-slate-400">Total Distance</div>
          <div className="mt-1 text-2xl font-black text-emerald-500">{totalDistance} km</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase text-slate-400">Best Pace</div>
          <div className="mt-1 text-xl font-black text-teal-500 flex items-center gap-1.5">
            <Trophy className="h-4 w-4 text-amber-500" /> {bestPaceLog ? bestPaceLog.paceMinPerKm : 'N/A'}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase text-slate-400">Running Calories Burned</div>
          <div className="mt-1 text-2xl font-black text-amber-500 flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-amber-500" /> {totalCalories} kcal
          </div>
        </div>
      </div>

      {/* Record Run Form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Record Run Entry for {selectedDate}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/20">
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Auto Pace & Calorie Burn
              </span>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {paceInfo.paceString}
              </div>
              <span className="text-[11px] text-slate-500">~{estimatedCalories} kcal burned</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Run Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Park loop, felt energetic, good split pace..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700"
            >
              <Plus className="h-4 w-4" /> Save Run Log
            </button>
          </div>
        </form>
      </div>

      {/* Running Distance Over Time Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" /> Running Distance Over Time (km)
        </h3>

        {chartData.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No running logs available yet.</div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} km`, 'Distance']}
                />
                <Line type="monotone" dataKey="distance" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
