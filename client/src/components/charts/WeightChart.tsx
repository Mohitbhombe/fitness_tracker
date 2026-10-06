import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { WeightLog } from '../../types';

interface WeightChartProps {
  weightLogs: WeightLog[];
  targetWeightKg: number;
  timeframeDays?: 7 | 30 | 90 | 365;
}

export const WeightChart: React.FC<WeightChartProps> = ({
  weightLogs,
  targetWeightKg,
  timeframeDays = 30,
}) => {
  // Sort logs by date ascending
  const sortedLogs = [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter logs based on timeframe
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - timeframeDays);
  const filteredLogs = sortedLogs.filter((l) => new Date(l.date) >= cutoffDate);

  const data = filteredLogs.map((l) => ({
    date: new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: l.weightKg,
    target: targetWeightKg,
  }));

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-400 dark:border-slate-800">
        No weight logs available for this period. Start logging your weight above!
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(val: any) => [`${val} kg`, 'Weight']}
          />
          <ReferenceLine
            y={targetWeightKg}
            label={{ value: `Target: ${targetWeightKg}kg`, fill: '#10b981', fontSize: 11 }}
            stroke="#10b981"
            strokeDasharray="4 4"
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
