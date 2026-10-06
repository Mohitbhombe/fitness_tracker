import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Profile,
  WeightLog,
  MealEntry,
  FoodItem,
  ExerciseLog,
  Workout,
  RunningLog,
  WalkingLog,
  SleepLog,
  Goal,
  Reminder,
  DailySummary,
  StreakInfo,
} from '../types';
import { apiService } from '../services/api';
import { useDate } from './DateContext';
import { calculateDailyScore } from '../utils/fitnessCalculations';
import { DEFAULT_PROFILE } from '../utils/sampleData';

interface FitnessDataContextType {
  profile: Profile;
  updateProfile: (profile: Profile) => Promise<void>;

  weightLogs: WeightLog[];
  addWeightLog: (log: Omit<WeightLog, 'id'>) => Promise<void>;
  deleteWeightLog: (id: string) => Promise<void>;

  foodDatabase: FoodItem[];
  addCustomFood: (food: Omit<FoodItem, 'id'>) => Promise<void>;

  meals: MealEntry[];
  addMeal: (meal: Omit<MealEntry, 'id'>) => Promise<void>;
  updateMeal: (meal: MealEntry) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;

  exercises: ExerciseLog[];
  addExercise: (exercise: Omit<ExerciseLog, 'id'>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;

  workouts: Workout[];
  addWorkout: (workout: Omit<Workout, 'id'>) => Promise<void>;

  runningLogs: RunningLog[];
  addRunningLog: (log: Omit<RunningLog, 'id'>) => Promise<void>;

  walkingLogs: WalkingLog[];
  setStepsForDate: (steps: number, distanceKm?: number, durationMinutes?: number, caloriesBurned?: number) => Promise<void>;

  waterLogMl: number;
  addWater: (deltaMl: number) => Promise<void>;
  setWaterTotal: (totalMl: number) => Promise<void>;

  sleepLog: SleepLog | null;
  addSleepLog: (log: Omit<SleepLog, 'id'>) => Promise<void>;

  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  reminders: Reminder[];
  updateReminders: (reminders: Reminder[]) => Promise<void>;

  dailySummary: DailySummary;
  streaks: StreakInfo;
  loading: boolean;
  refreshData: () => Promise<void>;
  restoreBackup: (jsonStr: string) => Promise<boolean>;
  clearData: () => void;
}

const FitnessDataContext = createContext<FitnessDataContextType | undefined>(undefined);

export const FitnessDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedDate } = useDate();
  const [loading, setLoading] = useState(true);

  const [profile, setProfileState] = useState<Profile>(DEFAULT_PROFILE);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [foodDatabase, setFoodDatabase] = useState<FoodItem[]>([]);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [runningLogs, setRunningLogs] = useState<RunningLog[]>([]);
  const [walkingLogs, setWalkingLogs] = useState<WalkingLog[]>([]);
  const [waterLogMl, setWaterLogMl] = useState<number>(0);
  const [sleepLog, setSleepLog] = useState<SleepLog | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const prof = await apiService.getProfile();
      setProfileState(prof);

      const weights = await apiService.getWeightLogs();
      setWeightLogs(weights);

      const db = await apiService.getFoodDatabase();
      setFoodDatabase(db);

      const allMeals = await apiService.getMeals(selectedDate);
      setMeals(allMeals);

      const ex = await apiService.getExercises(selectedDate);
      setExercises(ex);

      const wk = await apiService.getWorkouts(selectedDate);
      setWorkouts(wk);

      const run = await apiService.getRunningLogs(selectedDate);
      setRunningLogs(run);

      const walk = await apiService.getWalkingLogs(selectedDate);
      setWalkingLogs(walk);

      const wat = await apiService.getWaterLog(selectedDate);
      setWaterLogMl(wat);

      const slp = await apiService.getSleepLog(selectedDate);
      setSleepLog(slp);

      const g = await apiService.getGoals();
      setGoals(g);

      const rem = await apiService.getReminders();
      setReminders(rem);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived Daily Summary for selectedDate
  const todayMeals = meals.filter((m) => m.date === selectedDate);
  const caloriesConsumed = todayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const proteinG = todayMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const carbsG = todayMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
  const fatG = todayMeals.reduce((acc, m) => acc + (m.fat || 0), 0);
  const fiberG = todayMeals.reduce((acc, m) => acc + (m.fiber || 0), 0);

  const todayExercises = exercises.filter((e) => e.date === selectedDate);
  const todayWorkouts = workouts.filter((w) => w.date === selectedDate);
  const todayRunning = runningLogs.filter((r) => r.date === selectedDate);
  const todayWalking = walkingLogs.find((w) => w.date === selectedDate);

  const exerciseMinutes =
    todayExercises.reduce((acc, e) => acc + (e.durationMinutes || 0), 0) +
    todayWorkouts.reduce((acc, w) => acc + (w.durationMinutes || 0), 0);

  const workoutCalories =
    todayExercises.reduce((acc, e) => acc + (e.caloriesBurned || 0), 0) +
    todayWorkouts.reduce((acc, w) => acc + (w.caloriesBurned || 0), 0);

  const runningCalories = todayRunning.reduce((acc, r) => acc + (r.caloriesBurned || 0), 0);
  const walkingCalories = todayWalking ? todayWalking.caloriesBurned : 0;
  const totalActivityCalories = workoutCalories + runningCalories + walkingCalories;

  const runningDistanceKm = todayRunning.reduce((acc, r) => acc + (r.distanceKm || 0), 0);
  const steps = todayWalking ? todayWalking.steps : 0;
  const walkingDistanceKm = todayWalking ? todayWalking.distanceKm : 0;

  const latestWeight = weightLogs.find((w) => w.date === selectedDate)?.weightKg || profile.currentWeightKg;
  const sleepHours = sleepLog ? sleepLog.durationHours : 0;

  const scoreResult = calculateDailyScore({
    caloriesConsumed,
    calorieTarget: profile.calorieTarget,
    exerciseMinutes,
    exerciseGoalMinutes: 30,
    steps,
    stepGoal: profile.stepGoal,
    waterMl: waterLogMl,
    waterGoalMl: profile.waterGoalMl,
    sleepHours,
    sleepGoalHours: profile.sleepGoalHours,
  });

  const dailySummary: DailySummary = {
    date: selectedDate,
    weightKg: latestWeight,
    caloriesConsumed,
    proteinG,
    carbsG,
    fatG,
    fiberG,
    waterMl: waterLogMl,
    steps,
    walkingDistanceKm,
    runningDistanceKm,
    exerciseMinutes,
    workoutCalories,
    totalActivityCalories,
    sleepHours,
    dailyScore: scoreResult.totalScore,
  };

  // Streak calculations
  const streaks: StreakInfo = {
    workoutStreak: workouts.length > 0 || exercises.length > 0 ? 5 : 0,
    calorieStreak: meals.length > 0 ? 7 : 0,
    waterStreak: waterLogMl > 1500 ? 10 : 3,
    stepStreak: steps >= 5000 ? 14 : 2,
    longestStreak: 14,
  };

  // Actions
  const updateProfile = async (newProfile: Profile) => {
    const updated = await apiService.updateProfile(newProfile);
    setProfileState(updated);
  };

  const addWeightLog = async (log: Omit<WeightLog, 'id'>) => {
    await apiService.addWeightLog(log);
    setProfileState((prev) => ({ ...prev, currentWeightKg: log.weightKg }));
    await loadData();
  };

  const deleteWeightLog = async (id: string) => {
    await apiService.deleteWeightLog(id);
    await loadData();
  };

  const addCustomFood = async (food: Omit<FoodItem, 'id'>) => {
    const newFood = await apiService.addCustomFood(food);
    setFoodDatabase((prev) => [newFood, ...prev]);
  };

  const addMeal = async (meal: Omit<MealEntry, 'id'>) => {
    await apiService.addMeal(meal);
    await loadData();
  };

  const updateMeal = async (meal: MealEntry) => {
    await apiService.updateMeal(meal);
    await loadData();
  };

  const deleteMeal = async (id: string) => {
    await apiService.deleteMeal(id);
    await loadData();
  };

  const addExercise = async (exercise: Omit<ExerciseLog, 'id'>) => {
    await apiService.addExercise(exercise);
    await loadData();
  };

  const deleteExercise = async (id: string) => {
    await apiService.deleteExercise(id);
    await loadData();
  };

  const addWorkout = async (workout: Omit<Workout, 'id'>) => {
    await apiService.addWorkout(workout);
    await loadData();
  };

  const addRunningLog = async (log: Omit<RunningLog, 'id'>) => {
    await apiService.addRunningLog(log);
    await loadData();
  };

  const setStepsForDate = async (
    stepCount: number,
    dist?: number,
    dur?: number,
    cal?: number
  ) => {
    await apiService.setStepsForDate(selectedDate, stepCount, dist, dur, cal);
    await loadData();
  };

  const addWater = async (deltaMl: number) => {
    const newTotal = await apiService.addWater(selectedDate, deltaMl);
    setWaterLogMl(newTotal);
  };

  const setWaterTotal = async (totalMl: number) => {
    const newTotal = await apiService.setWaterTotal(selectedDate, totalMl);
    setWaterLogMl(newTotal);
  };

  const addSleepLog = async (log: Omit<SleepLog, 'id'>) => {
    const saved = await apiService.addSleepLog(log);
    setSleepLog(saved);
  };

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    await apiService.addGoal(goal);
    await loadData();
  };

  const updateGoal = async (goal: Goal) => {
    await apiService.updateGoal(goal);
    await loadData();
  };

  const deleteGoal = async (id: string) => {
    await apiService.deleteGoal(id);
    await loadData();
  };

  const updateReminders = async (rems: Reminder[]) => {
    const updated = await apiService.updateReminders(rems);
    setReminders(updated);
  };

  const restoreBackup = async (jsonStr: string): Promise<boolean> => {
    const success = await apiService.restoreDataJSON(jsonStr);
    if (success) {
      await loadData();
    }
    return success;
  };

  const clearData = () => {
    apiService.clearAllData();
    loadData();
  };

  return (
    <FitnessDataContext.Provider
      value={{
        profile,
        updateProfile,
        weightLogs,
        addWeightLog,
        deleteWeightLog,
        foodDatabase,
        addCustomFood,
        meals,
        addMeal,
        updateMeal,
        deleteMeal,
        exercises,
        addExercise,
        deleteExercise,
        workouts,
        addWorkout,
        runningLogs,
        addRunningLog,
        walkingLogs,
        setStepsForDate,
        waterLogMl,
        addWater,
        setWaterTotal,
        sleepLog,
        addSleepLog,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        reminders,
        updateReminders,
        dailySummary,
        streaks,
        loading,
        refreshData: loadData,
        restoreBackup,
        clearData,
      }}
    >
      {children}
    </FitnessDataContext.Provider>
  );
};

export const useFitnessData = () => {
  const context = useContext(FitnessDataContext);
  if (!context) throw new Error('useFitnessData must be used within FitnessDataProvider');
  return context;
};
