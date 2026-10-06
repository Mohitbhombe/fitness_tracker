import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { useDate } from '../context/DateContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { CircularProgress } from '../components/common/CircularProgress';
import { Droplets, Plus, RotateCcw } from 'lucide-react';

export const WaterPage: React.FC = () => {
  const { waterLogMl, profile, addWater, setWaterTotal } = useFitnessData();
  const { formattedDateLabel } = useDate();

  const [manualInput, setManualInput] = useState<number>(waterLogMl);

  const targetMl = profile.waterGoalMl || 2500;
  const currentLiters = (waterLogMl / 1000).toFixed(2);
  const targetLiters = (targetMl / 1000).toFixed(2);
  const remainingMl = Math.max(0, targetMl - waterLogMl);

  const handleSetTotal = async (e: React.FormEvent) => {
    e.preventDefault();
    await setWaterTotal(manualInput);
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Droplets className="h-6 w-6 text-sky-500" /> Daily Water & Hydration Tracker
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Track water intake, prevent dehydration, and reach your daily {targetLiters} L target for {formattedDateLabel}.
        </p>
      </div>

      {/* Main Hydration Visual Ring Card */}
      <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-teal-500/10 p-6 shadow-sm dark:bg-slate-900">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center">
            <CircularProgress
              value={waterLogMl}
              max={targetMl}
              size={180}
              strokeWidth={16}
              colorClass="stroke-sky-500"
              label={`${currentLiters} L`}
              sublabel={`Goal: ${targetLiters} L`}
            />
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase text-sky-600 dark:text-sky-400">
                Hydration Progress
              </span>
              <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                {waterLogMl} <span className="text-sm font-semibold text-slate-400">/ {targetMl} ml</span>
              </div>
              <p className="text-xs font-medium text-slate-500">
                {remainingMl > 0 ? `${remainingMl} ml remaining to reach goal` : '🎉 Daily Hydration Goal Reached!'}
              </p>
            </div>

            <ProgressBar value={waterLogMl} max={targetMl} color="sky" heightClass="h-3" showPercentage />

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                Quick Hydration Add:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addWater(250)}
                  className="rounded-xl border border-sky-500/30 bg-sky-500/20 px-3 py-2 text-xs font-bold text-sky-700 hover:bg-sky-500/30 dark:text-sky-200"
                >
                  +250 ml 🥤
                </button>
                <button
                  onClick={() => addWater(500)}
                  className="rounded-xl border border-sky-500/30 bg-sky-500/20 px-3 py-2 text-xs font-bold text-sky-700 hover:bg-sky-500/30 dark:text-sky-200"
                >
                  +500 ml 🍶
                </button>
                <button
                  onClick={() => addWater(750)}
                  className="rounded-xl border border-sky-500/30 bg-sky-500/20 px-3 py-2 text-xs font-bold text-sky-700 hover:bg-sky-500/30 dark:text-sky-200"
                >
                  +750 ml 🍼
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Entry Form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
          Manual Water Entry / Reset
        </h3>

        <form onSubmit={handleSetTotal} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Set Exact Total Water Consumed (ml)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                value={manualInput}
                onChange={(e) => setManualInput(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base font-bold text-slate-900 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-sky-600"
              >
                <Plus className="h-4 w-4" /> Save Water Log
              </button>

              <button
                type="button"
                onClick={() => setWaterTotal(0)}
                className="flex items-center gap-1.5 rounded-xl border border-rose-300 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/30"
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
