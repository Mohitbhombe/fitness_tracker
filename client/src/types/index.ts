import { Gender, ActivityLevel, FitnessGoal, WeightUnit, HeightUnit } from '../utils/fitnessCalculations';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Profile {
  userId: string;
  fullName: string;
  age: number;
  gender: Gender;
  heightCm: number;
  currentWeightKg: number;
  startingWeightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  preferredWeightUnit: WeightUnit;
  preferredHeightUnit: HeightUnit;
  calorieTarget: number;
  stepGoal: number;
  waterGoalMl: number;
  proteinGoal: number;
  sleepGoalHours: number;
  remindersEnabled?: boolean;
}

export interface WeightLog {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  bodyFatPercentage?: number;
  waistMeasurementCm?: number;
  notes?: string;
  createdAt?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  servingQuantity: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: string;
  isCustom?: boolean;
}

export interface MealEntry {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  quantity: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  time?: string;
}

export interface ExerciseLog {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  name: string;
  category: 'Strength Training' | 'Cardio' | 'Running' | 'Walking' | 'Cycling' | 'HIIT' | 'Yoga' | 'Stretching' | 'Sports' | 'Other';
  durationMinutes: number;
  sets?: number;
  reps?: number;
  weightKg?: number;
  distanceKm?: number;
  caloriesBurned: number;
  notes?: string;
}

export interface WorkoutExercise {
  exerciseName: string;
  sets: number;
  reps: number;
  weightKg?: number;
  restSeconds?: number;
}

export interface Workout {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  title: string;
  exercises: WorkoutExercise[];
  durationMinutes: number;
  caloriesBurned: number;
  totalSets: number;
  completed: boolean;
  notes?: string;
}

export interface RunningLog {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  distanceKm: number;
  durationMinutes: number;
  paceMinPerKm: string;
  caloriesBurned: number;
  notes?: string;
}

export interface WalkingLog {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  steps: number;
  distanceKm: number;
  durationMinutes: number;
  caloriesBurned: number;
  stepGoal: number;
}

export interface WaterLog {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  amountMl: number; // accumulated for the day or entry amount
  timestamp?: string;
}

export interface SleepLog {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  sleepTime: string; // e.g. "23:00"
  wakeTime: string; // e.g. "07:00"
  durationHours: number;
  quality?: 'poor' | 'fair' | 'good' | 'excellent';
  notes?: string;
}

export interface Goal {
  id: string;
  userId?: string;
  title: string;
  category: 'weight' | 'steps' | 'water' | 'running' | 'workout' | 'nutrition' | 'sleep';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  targetDate: string;
  status: 'active' | 'completed' | 'abandoned';
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  weightKg?: number;
  caloriesConsumed: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  waterMl: number;
  steps: number;
  walkingDistanceKm: number;
  runningDistanceKm: number;
  exerciseMinutes: number;
  workoutCalories: number;
  totalActivityCalories: number;
  sleepHours: number;
  notes?: string;
  dailyScore?: number;
}

export interface Reminder {
  id: string;
  type: 'water' | 'meals' | 'exercise' | 'walk' | 'weight' | 'sleep';
  time: string;
  enabled: boolean;
  label: string;
}

export interface Habit {
  id: string;
  title: string;
  category: 'fitness' | 'hydration' | 'nutrition' | 'mindfulness' | 'sleep' | 'routine';
  icon: string;
  targetPerDay: number;
  unit: string;
  streak: number;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  count: number;
}

export interface StreakInfo {
  workoutStreak: number;
  calorieStreak: number;
  waterStreak: number;
  stepStreak: number;
  longestStreak: number;
}

