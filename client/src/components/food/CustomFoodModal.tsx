import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useFitnessData } from '../../context/FitnessDataContext';
import { Plus } from 'lucide-react';

interface CustomFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomFoodModal: React.FC<CustomFoodModalProps> = ({ isOpen, onClose }) => {
  const { addCustomFood } = useFitnessData();

  const [name, setName] = useState('');
  const [servingQuantity, setServingQuantity] = useState<number>(100);
  const [servingUnit, setServingUnit] = useState('g');
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [fiber, setFiber] = useState<number>(0);
  const [category, setCategory] = useState('custom');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addCustomFood({
      name,
      servingQuantity,
      servingUnit,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      category,
    });

    setName('');
    setCalories(0);
    setProtein(0);
    setCarbs(0);
    setFat(0);
    setFiber(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Custom Food Item">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Food Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Homemade Protein Bar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Serving Quantity
            </label>
            <input
              type="number"
              required
              value={servingQuantity}
              onChange={(e) => setServingQuantity(parseFloat(e.target.value) || 1)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Serving Unit
            </label>
            <input
              type="text"
              required
              placeholder="g, piece, scoop, bowl"
              value={servingUnit}
              onChange={(e) => setServingUnit(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Calories (kcal)
            </label>
            <input
              type="number"
              required
              min="0"
              value={calories}
              onChange={(e) => setCalories(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Protein (g)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={protein}
              onChange={(e) => setProtein(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Carbs (g)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={carbs}
              onChange={(e) => setCarbs(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Fat (g)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={fat}
              onChange={(e) => setFat(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Fiber (g)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={fiber}
              onChange={(e) => setFiber(parseFloat(e.target.value) || 0)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
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
            <Plus className="h-4 w-4" /> Save Custom Food
          </button>
        </div>
      </form>
    </Modal>
  );
};
