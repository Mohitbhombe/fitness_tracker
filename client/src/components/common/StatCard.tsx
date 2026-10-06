import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.FC<{ className?: string }>;
  iconColorClass?: string;
  trend?: {
    text: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
  actionButton?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconColorClass = 'text-emerald-500 bg-emerald-500/10',
  trend,
  onClick,
  actionButton,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 ${
        onClick ? 'cursor-pointer hover:border-emerald-500/30' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconColorClass}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </h4>
            <div className="mt-0.5 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {value}
            </div>
          </div>
        </div>

        {actionButton && <div>{actionButton}</div>}
      </div>

      {(subtext || trend) && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs dark:border-slate-800/80">
          {subtext && <span className="font-medium text-slate-500 dark:text-slate-400">{subtext}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
