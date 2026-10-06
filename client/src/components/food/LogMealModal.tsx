import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useFitnessData } from '../../context/FitnessDataContext';
import { useDate } from '../../context/DateContext';
import { FoodItem } from '../../types';
import { Search, Plus, Utensils } from 'lucide-react';

interface LogMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomFoodModal?: () => void;
}

export const LogMealModal: React.FC<LogMealModalProps> = ({
  isOpen,
  onClose,
  onOpenCustomFoodModal,
}) => {
  const { foodDatabase, addMeal } = useFitnessData();
  const { selectedDate } = useDate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [quantity, setQuantity] = useState<number>(1);
  const [servingUnit, setServingUnit] = useState<string>('g');

  // Custom entry override fields
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState<number>(0);
  const [customProtein, setCustomProtein] = useState<number>(0);
  const [customCarbs, setCustomCarbs] = useState<number>(0);
  const [customFat, setCustomFat] = useState<number>(0);
  const [customFiber, setCustomFiber] = useState<number>(0);

  const filteredFoods = foodDatabase.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setCustomName(food.name);
    setServingUnit(food.servingUnit);
    setQuantity(1);
    setCustomCalories(food.calories);
    setCustomProtein(food.protein);
    setCustomCarbs(food.carbs);
    setCustomFat(food.fat);
    setCustomFiber(food.fiber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const multiplier = quantity > 0 ? quantity : 1;

    await addMeal({
      date: selectedDate,
      mealType,
      foodName: customName,
      quantity,
      servingUnit,
      calories: Math.round(customCalories * multiplier),
      protein: Math.round(customProtein * multiplier * 10) / 10,
      carbs: Math.round(customCarbs * multiplier * 10) / 10,
      fat: Math.round(customFat * multiplier * 10) / 10,
      fiber: Math.round(customFiber * multiplier * 10) / 10,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    // Reset
    setSelectedFood(null);
    setSearchQuery('');
    setCustomName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Food / Meal" maxWidth="lg">
      <div className="space-y-4">
        {/* Search Food Database */}
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Search Food Database (Includes Indian Foods)
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search rice, roti, dal, paneer, eggs, chicken..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Quick Search Food Suggestions */}
        {searchQuery && (
          <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-800/80">
            {filteredFoods.length === 0 ? (
              <div className="p-2 text-xs text-slate-500 text-center">
                No matching food found.{' '}
                {onOpenCustomFoodModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenCustomFoodModal();
                    }}
                    className="text-emerald-500 font-bold underline"
                  >
                    + Create Custom Food
                  </button>
                )}
              </div>
            ) : (
              filteredFoods.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleSelectFood(f)}
                  className="flex w-full items-center justify-between rounded-lg p-2 text-left text-xs hover:bg-emerald-500/10 dark:hover:bg-slate-700"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{f.name}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {f.calories} kcal ({f.servingQuantity} {f.servingUnit})
                  </span>
                </button>
              ))
            )}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Meal Category
              </label>
              <select
                value={mealType}
                onChange={(e: any) => setMealType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="breakfast">Breakfast 🍳</option>
                <option value="lunch">Lunch 🍱</option>
                <option value="dinner">Dinner 🥗</option>
                <option value="snack">Snack 🍎</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Food Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Steamed Rice"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quantity / Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Serving Unit
              </label>
              <input
                type="text"
                placeholder="e.g. g, bowl, piece, cup"
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
                min="0"
                required
                value={customCalories}
                onChange={(e) => setCustomCalories(parseFloat(e.target.value) || 0)}
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
                value={customProtein}
                onChange={(e) => setCustomProtein(parseFloat(e.target.value) || 0)}
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
                value={customCarbs}
                onChange={(e) => setCustomCarbs(parseFloat(e.target.value) || 0)}
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
                value={customFat}
                onChange={(e) => setCustomFat(parseFloat(e.target.value) || 0)}
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
                value={customFiber}
                onChange={(e) => setCustomFiber(parseFloat(e.target.value) || 0)}
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
              <Plus className="h-4 w-4" /> Save Meal Entry
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
