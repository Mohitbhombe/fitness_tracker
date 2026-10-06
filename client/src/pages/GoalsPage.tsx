import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import { Target, Plus, CheckCircle, Trash2, Calendar, Flame } from 'lucide-react';
import { Goal } from '../types';

export const GoalsPage: React.FC = () => {
  const { goals, addGoal, deleteGoal, updateGoal } = useFitnessData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Goal['category']>('weight');
  const [targetValue, setTargetValue] = useState<number>(10);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [unit, setUnit] = useState('kg');
  const [targetDate, setTargetDate] = useState('2026-12-31');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addGoal({
      title,
      category,
      targetValue,
      currentValue,
      unit,
      startDate: new Date().toISOString().split('T')[0],
      targetDate,
      status: 'active',
    });

    setTitle('');
    setIsModalOpen(false);
  };

  const handleToggleStatus = async (goal: Goal) => {
    const newStatus = goal.status === 'completed' ? 'active' : 'completed';
    await updateGoal({ ...goal, status: newStatus });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-amber-500" /> Fitness & Weight Goals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Set targets for weight loss, daily steps, hydration, running distance, and weekly workouts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-emerald-700"
        >
          <Plus className="h-4 w-4" /> Create New Goal
        </button>
      </div>

      {/* Goals List Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {goals.map((goal) => {
          const progressPercent = Math.min(
            100,
            Math.max(0, Math.round((goal.currentValue / goal.targetValue) * 100))
          );
          const isDone = goal.status === 'completed' || progressPercent >= 100;

          return (
            <div
              key={goal.id}
              className={`rounded-3xl border p-6 shadow-sm transition ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-slate-900'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {goal.category}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    {goal.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Target Date: {goal.targetDate}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleStatus(goal)}
                  className={`rounded-full p-2 transition ${
                    isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  }`}
                  title={isDone ? 'Mark as Active' : 'Mark as Completed'}
                >
                  <CheckCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4">
                <ProgressBar
                  value={goal.currentValue}
                  max={goal.targetValue}
                  unit={goal.unit}
                  color={isDone ? 'emerald' : 'amber'}
                  showPercentage
                />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                <span className="text-slate-500">
                  {goal.currentValue} / {goal.targetValue} {goal.unit}
                </span>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Fitness Goal">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Goal Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lose 10 kg, Walk 10,000 Steps Daily"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="weight">Weight Loss</option>
                <option value="steps">Step Count</option>
                <option value="water">Water Intake</option>
                <option value="running">Running Distance</option>
                <option value="workout">Workout Frequency</option>
                <option value="nutrition">Calorie Target</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Date
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Value
              </label>
              <input
                type="number"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Current Value
              </label>
              <input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Unit
              </label>
              <input
                type="text"
                required
                placeholder="kg, steps, ml, km"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-amber-500 px-5 py-2 text-sm font-bold text-white shadow-md hover:bg-amber-600"
            >
              Save Goal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
