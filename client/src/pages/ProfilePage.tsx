import React, { useState } from 'react';
import { useFitnessData } from '../context/FitnessDataContext';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacroTargets,
  cmToFtIn,
  ftInToCm,
  kgToLb,
  lbToKg,
  ActivityLevel,
  FitnessGoal,
  Gender,
} from '../utils/fitnessCalculations';
import { User, Scale, Flame, Calculator, Check, AlertCircle } from 'lucide-react';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useFitnessData();

  const [fullName, setFullName] = useState(profile.fullName);
  const [age, setAge] = useState<number>(profile.age);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [heightCm, setHeightCm] = useState<number>(profile.heightCm);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(profile.currentWeightKg);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(profile.targetWeightKg);
  const [startingWeightKg, setStartingWeightKg] = useState<number>(profile.startingWeightKg);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(profile.fitnessGoal);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dynamic calculations
  const bmiInfo = calculateBMI(currentWeightKg, heightCm);
  const bmr = calculateBMR(gender, currentWeightKg, heightCm, age);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetInfo = calculateCalorieTarget(tdee, fitnessGoal, gender);
  const macroTargets = calculateMacroTargets(targetInfo.calorieTarget, currentWeightKg, fitnessGoal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateProfile({
      ...profile,
      fullName,
      age,
      gender,
      heightCm,
      currentWeightKg,
      targetWeightKg,
      startingWeightKg,
      activityLevel,
      fitnessGoal,
      calorieTarget: targetInfo.calorieTarget,
      proteinGoal: macroTargets.protein,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      <DisclaimerBanner />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-6 w-6 text-emerald-500" /> Personal Profile & Fitness Calculator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure your body measurements, BMR, TDEE, and daily calorie targets.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20">
            <Check className="h-4 w-4" /> Profile Updated!
          </span>
        )}
      </div>

      {/* Calculated Fitness Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* BMI Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase text-slate-400">Current BMI</div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {bmiInfo.bmi} <span className="text-xs font-bold text-emerald-500">({bmiInfo.category})</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Healthy range: {bmiInfo.healthyRange}</p>
        </div>

        {/* BMR Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase text-slate-400">BMR (Mifflin-St Jeor)</div>
          <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
            {bmr} <span className="text-xs font-normal text-slate-400">kcal/day</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Basal metabolic rate at rest</p>
        </div>

        {/* TDEE & Target Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs font-bold uppercase text-slate-400">Maintenance & Target</div>
          <div className="mt-1 text-2xl font-black text-emerald-500">
            {targetInfo.calorieTarget} <span className="text-xs font-normal text-slate-400">kcal/day</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">Estimated TDEE: {tdee} kcal</p>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 dark:border-slate-800">
          Personal Information & Targets
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Age (Years)
            </label>
            <input
              type="number"
              min="10"
              max="120"
              required
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 25)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Gender / Sex
            </label>
            <select
              value={gender}
              onChange={(e: any) => setGender(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Height (cm)
            </label>
            <input
              type="number"
              min="50"
              max="250"
              required
              value={heightCm}
              onChange={(e) => setHeightCm(parseFloat(e.target.value) || 170)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Starting Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="20"
              required
              value={startingWeightKg}
              onChange={(e) => setStartingWeightKg(parseFloat(e.target.value) || 70)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Current Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="20"
              required
              value={currentWeightKg}
              onChange={(e) => setCurrentWeightKg(parseFloat(e.target.value) || 70)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="20"
              required
              value={targetWeightKg}
              onChange={(e) => setTargetWeightKg(parseFloat(e.target.value) || 70)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e: any) => setActivityLevel(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="sedentary">Sedentary (Little or no exercise)</option>
              <option value="lightly">Lightly Active (Exercise 1-3 days/week)</option>
              <option value="moderately">Moderately Active (Exercise 3-5 days/week)</option>
              <option value="very">Very Active (Hard exercise 6-7 days/week)</option>
              <option value="extremely">Extremely Active (Very physical job / athletic training)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Fitness Goal
            </label>
            <select
              value={fitnessGoal}
              onChange={(e: any) => setFitnessGoal(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="lose_weight">Lose Weight (Safe Calorie Deficit)</option>
              <option value="maintain_weight">Maintain Weight</option>
              <option value="gain_weight">Gain Weight</option>
              <option value="build_muscle">Build Muscle (Clean Surplus)</option>
              <option value="improve_fitness">Improve Overall Fitness</option>
            </select>
          </div>
        </div>

        {/* Calculated Recommended Macros Table */}
        <div className="rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20 dark:bg-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
            Recommended Daily Nutrient Targets
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="block font-black text-slate-900 dark:text-white">{targetInfo.calorieTarget} kcal</span>
              <span className="text-[10px] text-slate-500">Calories</span>
            </div>
            <div>
              <span className="block font-black text-slate-900 dark:text-white">{macroTargets.protein} g</span>
              <span className="text-[10px] text-slate-500">Protein</span>
            </div>
            <div>
              <span className="block font-black text-slate-900 dark:text-white">{macroTargets.carbs} g</span>
              <span className="text-[10px] text-slate-500">Carbs</span>
            </div>
            <div>
              <span className="block font-black text-slate-900 dark:text-white">{macroTargets.fat} g</span>
              <span className="text-[10px] text-slate-500">Fat</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700"
          >
            Save Profile & Update Targets
          </button>
        </div>
      </form>
    </div>
  );
};
