import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useFitnessData } from '../../context/FitnessDataContext';
import { useDate } from '../../context/DateContext';
import { calculateCaloriesBurned } from '../../utils/fitnessCalculations';
import { Plus } from 'lucide-react';

interface LogExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogExerciseModal: React.FC<LogExerciseModalProps> = ({ isOpen, onClose }) => {
  const { addExercise, profile } = useFitnessData();
  const { selectedDate } = useDate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<any>('Strength Training');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<number>(12);
  const [weightKg, setWeightKg] = useState<number>(20);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(150);
  const [autoCalculateCal, setAutoCalculateCal] = useState(true);

  const handleDurationChange = (mins: number) => {
    setDurationMinutes(mins);
    if (autoCalculateCal) {
      const estimated = calculateCaloriesBurned(category, mins, profile.currentWeightKg);
      setCaloriesBurned(estimated);
    }
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    if (autoCalculateCal) {
      const estimated = calculateCaloriesBurned(cat, durationMinutes, profile.currentWeightKg);
      setCaloriesBurned(estimated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addExercise({
      date: selectedDate,
      name,
      category,
      durationMinutes,
      sets,
      reps,
      weightKg,
      caloriesBurned,
    });

    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Exercise / Activity">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Exercise Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Bench Press, HIIT Cardio, Yoga Session"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="Strength Training">Strength Training 💪</option>
              <option value="Cardio">Cardio 🏃‍♂️</option>
              <option value="Running">Running 🏃</option>
              <option value="Walking">Walking 🚶</option>
              <option value="Cycling">Cycling 🚴</option>
              <option value="HIIT">HIIT 🔥</option>
              <option value="Yoga">Yoga 🧘</option>
              <option value="Stretching">Stretching 🙆</option>
              <option value="Sports">Sports ⚽</option>
              <option value="Other">Other 🏋️</option>
            </select>
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
              onChange={(e) => handleDurationChange(parseInt(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {category === 'Strength Training' && (
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sets
              </label>
              <input
                type="number"
                min="1"
                value={sets}
                onChange={(e) => setSets(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Reps
              </label>
              <input
                type="number"
                min="1"
                value={reps}
                onChange={(e) => setReps(parseInt(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Weight ({profile.preferredWeightUnit})
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Calories Burned (Estimated)
            </label>
            <span className="text-[10px] text-slate-400">MET-based estimation</span>
          </div>
          <input
            type="number"
            min="0"
            required
            value={caloriesBurned}
            onChange={(e) => {
              setAutoCalculateCal(false);
              setCaloriesBurned(parseInt(e.target.value) || 0);
            }}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700"
          >
            <Plus className="h-4 w-4" /> Save Exercise
          </button>
        </div>
      </form>
    </Modal>
  );
};
