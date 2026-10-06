import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  sublabel?: string;
  unit?: string;
  color?: 'emerald' | 'sky' | 'amber' | 'rose' | 'purple' | 'auto';
  showPercentage?: boolean;
  heightClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  sublabel,
  unit = '',
  color = 'auto',
  showPercentage = false,
  heightClass = 'h-2.5',
}) => {
  const percentage = Math.round(Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0)));

  // Auto color logic: Green within target, Yellow approaching, Red exceeded if calories
  let colorBg = 'bg-emerald-500';
  if (color === 'auto') {
    if (percentage > 105) colorBg = 'bg-rose-500';
    else if (percentage >= 85) colorBg = 'bg-amber-500';
    else colorBg = 'bg-emerald-500';
  } else if (color === 'sky') colorBg = 'bg-sky-500';
  else if (color === 'amber') colorBg = 'bg-amber-500';
  else if (color === 'rose') colorBg = 'bg-rose-500';
  else if (color === 'purple') colorBg = 'bg-purple-500';
  else if (color === 'emerald') colorBg = 'bg-emerald-500';

  return (
    <div className="w-full">
      {(label || sublabel) && (
        <div className="mb-1.5 flex justify-between text-xs font-semibold">
          <span className="text-slate-700 dark:text-slate-300">{label}</span>
          <span className="text-slate-500 dark:text-slate-400">
            {sublabel || `${value} / ${max} ${unit}`} {showPercentage && `(${percentage}%)`}
          </span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${heightClass}`}>
        <div
          className={`${heightClass} rounded-full transition-all duration-500 ease-out ${colorBg}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
