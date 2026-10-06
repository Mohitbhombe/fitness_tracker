import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { useDate } from '../context/DateContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { Moon, Sun, Clock, Plus, Star } from 'lucide-react';

export const SleepPage: React.FC = () => {
  const { sleepLog, addSleepLog, profile } = useFitnessData();
  const { selectedDate, formattedDateLabel } = useDate();

  const [sleepTime, setSleepTime] = useState(sleepLog ? sleepLog.sleepTime : '23:00');
  const [wakeTime, setWakeTime] = useState(sleepLog ? sleepLog.wakeTime : '07:00');
  const [durationHours, setDurationHours] = useState<number>(sleepLog ? sleepLog.durationHours : 8.0);
  const [quality, setQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>(
    sleepLog?.quality || 'good'
  );
  const [notes, setNotes] = useState(sleepLog?.notes || '');

  const sleepGoal = profile.sleepGoalHours || 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSleepLog({
      date: selectedDate,
      sleepTime,
      wakeTime,
      durationHours,
      quality,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Moon className="h-6 w-6 text-indigo-500" /> Sleep & Recovery Tracker
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Track sleep duration, wake-up times, and rest quality for {formattedDateLabel}.
        </p>
      </div>

      {/* Sleep Goal Summary Card */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-900/10 p-6 shadow-sm dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Sleep Duration
            </span>
            <div className="mt-1 text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-6 w-6 text-indigo-500" /> {durationHours} Hours
              <span className="text-xs font-normal text-slate-400">/ Goal: {sleepGoal} hrs</span>
            </div>
          </div>

          {sleepLog && (
            <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-800 text-center">
              <span className="block text-xs font-semibold text-slate-400">Sleep Quality</span>
              <span className="text-sm font-bold capitalize text-indigo-500">{quality} Rest</span>
            </div>
          )}
        </div>

        <ProgressBar value={durationHours} max={sleepGoal} color="purple" heightClass="h-4" showPercentage />
      </div>

      {/* Sleep Form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Record Sleep Log for {selectedDate}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sleep Time (Bedtime)
              </label>
              <input
                type="time"
                required
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Wake-up Time
              </label>
              <input
                type="time"
                required
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Total Duration (Hours)
              </label>
              <input
                type="number"
                step="0.25"
                min="1"
                max="24"
                required
                value={durationHours}
                onChange={(e) => setDurationHours(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sleep Quality
              </label>
              <select
                value={quality}
                onChange={(e: any) => setQuality(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="poor">Poor (Restless / Interrupted)</option>
                <option value="fair">Fair (Average)</option>
                <option value="good">Good (Refreshing)</option>
                <option value="excellent">Excellent (Deep, uninterrupted rest)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="No screen time before bed, drank chamomile tea..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" /> Save Sleep Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
