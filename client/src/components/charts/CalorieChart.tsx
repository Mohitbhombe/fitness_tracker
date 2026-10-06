import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { MealEntry } from '../../types';

interface CalorieChartProps {
  meals: MealEntry[];
  calorieTarget: number;
  days?: number;
}

export const CalorieChart: React.FC<CalorieChartProps> = ({
  meals,
  calorieTarget,
  days = 7,
}) => {
  // Aggregate calories by date for last N days
  const dateMap: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    dateMap[dateStr] = 0;
  }

  meals.forEach((m) => {
    if (dateMap[m.date] !== undefined) {
      dateMap[m.date] += m.calories || 0;
    }
  });

  const data = Object.entries(dateMap).map(([date, cals]) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calories: cals,
      target: calorieTarget,
    };
  });

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(val: any) => [`${val} kcal`, 'Calories']}
          />
          <ReferenceLine
            y={calorieTarget}
            stroke="#f59e0b"
            strokeDasharray="3 3"
            label={{ value: `Goal: ${calorieTarget}`, fill: '#f59e0b', fontSize: 11 }}
          />
          <Bar dataKey="calories" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
