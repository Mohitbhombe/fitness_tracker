import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import { useDate } from '../context/DateContext';
import { LogMealModal } from '../components/food/LogMealModal';
import { CustomFoodModal } from '../components/food/CustomFoodModal';
import { MacroChart } from '../components/charts/MacroChart';
import { Utensils, Plus, Trash2, Copy, Search, Flame, Apple } from 'lucide-react';

export const NutritionPage: React.FC = () => {
  const { meals, profile, dailySummary, deleteMeal, addMeal } = useFitnessData();
  const { formattedDateLabel, selectedDate } = useDate();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [mealFilter, setMealFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all');

  const todayMeals = meals.filter((m) => m.date === selectedDate);
  const filteredMeals = mealFilter === 'all' ? todayMeals : todayMeals.filter((m) => m.mealType === mealFilter);

  const handleDuplicateMeal = async (meal: any) => {
    await addMeal({
      ...meal,
      id: undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const getMealBadgeColor = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'lunch':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'dinner':
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
      default:
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Utensils className="h-6 w-6 text-emerald-500" /> Nutrition & Food Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log your daily meals, track macronutrients (Protein, Carbs, Fat, Fiber) & calories for {formattedDateLabel}.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            + Create Custom Food
          </button>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700"
          >
            <Plus className="h-4 w-4" /> Log Food / Meal
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Total Consumed Overview */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Flame className="h-5 w-5 text-amber-500" /> Today's Energy Summary
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-600 dark:text-slate-400">Calories Consumed</span>
              <span className="text-xl text-emerald-500">{dailySummary.caloriesConsumed} kcal</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-100 pb-3 dark:border-slate-800">
              <span>Daily Calorie Goal</span>
              <span>{profile.calorieTarget} kcal</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Remaining Budget</span>
              <span className="text-amber-500">{Math.max(0, profile.calorieTarget - dailySummary.caloriesConsumed)} kcal</span>
            </div>
          </div>
        </div>

        {/* Macronutrients Progress */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Macronutrient Targets vs Consumed
          </h3>
          <MacroChart
            proteinG={dailySummary.proteinG}
            proteinTarget={profile.proteinGoal}
            carbsG={dailySummary.carbsG}
            carbsTarget={Math.round((profile.calorieTarget * 0.5) / 4)}
            fatG={dailySummary.fatG}
            fatTarget={Math.round((profile.calorieTarget * 0.25) / 9)}
            fiberG={dailySummary.fiberG}
            fiberTarget={Math.round((profile.calorieTarget / 1000) * 14)}
          />
        </div>
      </div>

      {/* Filter Tabs & Meals List */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Meals Logged for {formattedDateLabel}
          </h3>

          <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-800">
            {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMealFilter(tab)}
                className={`capitalize rounded-lg px-3 py-1 text-xs font-bold transition ${
                  mealFilter === tab ? 'bg-emerald-500 text-white' : 'text-slate-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredMeals.length === 0 ? (
          <div className="py-12 text-center">
            <Apple className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              No meals logged for this filter on {formattedDateLabel}.
            </p>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="mt-3 text-xs font-bold text-emerald-500 hover:underline"
            >
              + Log a meal now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800/80"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-xl px-2.5 py-1 text-xs font-bold capitalize border ${getMealBadgeColor(
                      meal.mealType
                    )}`}
                  >
                    {meal.mealType}
                  </span>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {meal.foodName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {meal.quantity} {meal.servingUnit} • {meal.time || 'Logged today'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block text-sm font-black text-emerald-600 dark:text-emerald-400">
                      {meal.calories} kcal
                    </span>
                    <span className="text-[11px] text-slate-400">
                      P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicateMeal(meal)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700"
                      title="Duplicate meal"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500"
                      title="Delete meal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LogMealModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onOpenCustomFoodModal={() => setIsCustomModalOpen(true)}
      />
      <CustomFoodModal isOpen={isCustomModalOpen} onClose={() => setIsCustomModalOpen(false)} />
    </div>
  );
};
