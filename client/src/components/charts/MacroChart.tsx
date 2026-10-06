import React from 'react';
import { ProgressBar } from '../common/ProgressBar';

interface MacroChartProps {
  proteinG: number;
  proteinTarget: number;
  carbsG: number;
  carbsTarget: number;
  fatG: number;
  fatTarget: number;
  fiberG: number;
  fiberTarget: number;
}

export const MacroChart: React.FC<MacroChartProps> = ({
  proteinG,
  proteinTarget,
  carbsG,
  carbsTarget,
  fatG,
  fatTarget,
  fiberG,
  fiberTarget,
}) => {
  return (
    <div className="space-y-4">
      {/* Protein */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
        <ProgressBar
          label="Protein 🥩"
          value={proteinG}
          max={proteinTarget}
          unit="g"
          color="emerald"
          showPercentage
        />
      </div>

      {/* Carbohydrates */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
        <ProgressBar
          label="Carbohydrates 🌾"
          value={carbsG}
          max={carbsTarget}
          unit="g"
          color="amber"
          showPercentage
        />
      </div>

      {/* Fat */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
        <ProgressBar
          label="Fat 🥑"
          value={fatG}
          max={fatTarget}
          unit="g"
          color="rose"
          showPercentage
        />
      </div>

      {/* Fiber */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
        <ProgressBar
          label="Dietary Fiber 🥗"
          value={fiberG}
          max={fiberTarget}
          unit="g"
          color="sky"
          showPercentage
        />
      </div>
    </div>
  );
};
