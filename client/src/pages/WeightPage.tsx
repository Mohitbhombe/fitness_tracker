import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { WeightChart } from '../components/charts/WeightChart';
import { LogWeightModal } from '../components/weight/LogWeightModal';
import { Scale, Plus, Trash2, TrendingDown, Target, Award } from 'lucide-react';

export const WeightPage: React.FC = () => {
  const { weightLogs, profile, deleteWeightLog } = useFitnessData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<7 | 30 | 90 | 365>(30);

  const sortedLogs = [...weightLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentWeight = profile.currentWeightKg;
  const startingWeight = profile.startingWeightKg;
  const targetWeight = profile.targetWeightKg;

  const totalLost = Math.max(0, Math.round((startingWeight - currentWeight) * 10) / 10);
  const remaining = Math.max(0, Math.round((currentWeight - targetWeight) * 10) / 10);

  const totalNeeded = Math.max(0.1, startingWeight - targetWeight);
  const progressPercent = Math.min(100, Math.max(0, Math.round((totalLost / totalNeeded) * 100)));

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="h-6 w-6 text-emerald-500" /> Weight & Body Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor weight change trends, body fat percentage, and waist measurements over time.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700"
        >
          <Plus className="h-4 w-4" /> Record New Weight
        </button>
      </div>

      {/* Progress Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase text-slate-400">Starting Weight</span>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{startingWeight} kg</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase text-slate-400">Current Weight</span>
          <div className="mt-1 text-2xl font-black text-emerald-500">{currentWeight} kg</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase text-slate-400">Target Weight</span>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{targetWeight} kg</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase text-slate-400">Weight Lost</span>
          <div className="mt-1 text-2xl font-black text-teal-500">{totalLost} kg</div>
          <span className="text-[11px] text-slate-400">{remaining} kg remaining</span>
        </div>
      </div>

      {/* Progress Bar to Target */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700 dark:text-slate-300">Goal Progress ({progressPercent}%)</span>
          <span className="text-emerald-500">
            {currentWeight <= targetWeight ? '🎉 Target Weight Reached!' : `${remaining} kg to target`}
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Trend Chart */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-emerald-500" /> Weight History Trend Chart
          </h3>

          <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800">
            <button
              onClick={() => setTimeframe(7)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                timeframe === 7 ? 'bg-emerald-500 text-white' : 'text-slate-500'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeframe(30)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                timeframe === 30 ? 'bg-emerald-500 text-white' : 'text-slate-500'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeframe(90)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                timeframe === 90 ? 'bg-emerald-500 text-white' : 'text-slate-500'
              }`}
            >
              90 Days
            </button>
            <button
              onClick={() => setTimeframe(365)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                timeframe === 365 ? 'bg-emerald-500 text-white' : 'text-slate-500'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        <WeightChart weightLogs={weightLogs} targetWeightKg={targetWeight} timeframeDays={timeframe} />
      </div>

      {/* History Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-4 text-base font-bold text-slate-900 dark:text-white">
          Weight Logs History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Weight</th>
                <th className="px-4 py-3 font-semibold">Body Fat %</th>
                <th className="px-4 py-3 font-semibold">Waist (cm)</th>
                <th className="px-4 py-3 font-semibold">Notes</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {log.date}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {log.weightKg} kg
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {log.bodyFatPercentage ? `${log.bodyFatPercentage}%` : '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {log.waistMeasurementCm ? `${log.waistMeasurementCm} cm` : '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 italic">
                    {log.notes || '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteWeightLog(log.id)}
                      className="rounded p-1 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LogWeightModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
