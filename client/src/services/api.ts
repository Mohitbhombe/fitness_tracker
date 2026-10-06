import axios from 'axios';
import {
  Profile,
  WeightLog,
  MealEntry,
  FoodItem,
  ExerciseLog,
  Workout,
  RunningLog,
  WalkingLog,
  WaterLog,
  SleepLog,
  Goal,
  Reminder,
  User,
} from '../types';
import {
  DEFAULT_PROFILE,
  INITIAL_WEIGHT_LOGS,
  INITIAL_MEALS,
  INITIAL_EXERCISES,
  INITIAL_WORKOUTS,
  INITIAL_RUNNING_LOGS,
  INITIAL_WALKING_LOGS,
  INITIAL_WATER_LOGS,
  INITIAL_SLEEP_LOGS,
  INITIAL_GOALS,
  INITIAL_REMINDERS,
} from '../utils/sampleData';
import { INITIAL_FOOD_DATABASE } from '../utils/foodDatabase';

const API_BASE = '/api';

// Create Axios instance with Auth token header interceptor
export const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('fittrack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Keys for LocalStorage fallback
const STORAGE_KEYS = {
  USER: 'fittrack_user',
  TOKEN: 'fittrack_token',
  PROFILE: 'fittrack_profile',
  WEIGHT_LOGS: 'fittrack_weight_logs',
  MEALS: 'fittrack_meals',
  FOOD_DB: 'fittrack_food_db',
  EXERCISES: 'fittrack_exercises',
  WORKOUTS: 'fittrack_workouts',
  RUNNING_LOGS: 'fittrack_running_logs',
  WALKING_LOGS: 'fittrack_walking_logs',
  WATER_LOGS: 'fittrack_water_logs',
  SLEEP_LOGS: 'fittrack_sleep_logs',
  GOALS: 'fittrack_goals',
  REMINDERS: 'fittrack_reminders',
  THEME: 'fittrack_theme',
};

// LocalStorage helpers
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
};

// Initialize local storage defaults if empty
export const initializeLocalStorageDefaults = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    setStorageItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WEIGHT_LOGS)) {
    setStorageItem(STORAGE_KEYS.WEIGHT_LOGS, INITIAL_WEIGHT_LOGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEALS)) {
    setStorageItem(STORAGE_KEYS.MEALS, INITIAL_MEALS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FOOD_DB)) {
    setStorageItem(STORAGE_KEYS.FOOD_DB, INITIAL_FOOD_DATABASE);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EXERCISES)) {
    setStorageItem(STORAGE_KEYS.EXERCISES, INITIAL_EXERCISES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WORKOUTS)) {
    setStorageItem(STORAGE_KEYS.WORKOUTS, INITIAL_WORKOUTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RUNNING_LOGS)) {
    setStorageItem(STORAGE_KEYS.RUNNING_LOGS, INITIAL_RUNNING_LOGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WALKING_LOGS)) {
    setStorageItem(STORAGE_KEYS.WALKING_LOGS, INITIAL_WALKING_LOGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WATER_LOGS)) {
    setStorageItem(STORAGE_KEYS.WATER_LOGS, INITIAL_WATER_LOGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SLEEP_LOGS)) {
    setStorageItem(STORAGE_KEYS.SLEEP_LOGS, INITIAL_SLEEP_LOGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
    setStorageItem(STORAGE_KEYS.GOALS, INITIAL_GOALS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.REMINDERS)) {
    setStorageItem(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    const demoUser: User = { id: 'u_1', name: 'Mohit', email: 'mohit@fittrack.com' };
    setStorageItem(STORAGE_KEYS.USER, demoUser);
    setStorageItem(STORAGE_KEYS.TOKEN, 'demo_token_fittrack');
  }
};

initializeLocalStorageDefaults();

// Service Object with full API + LocalStorage fallback
export const apiService = {
  // Authentication
  async register(data: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> {
    try {
      const res = await axiosInstance.post('/auth/register', data);
      localStorage.setItem(STORAGE_KEYS.TOKEN, res.data.token);
      setStorageItem(STORAGE_KEYS.USER, res.data.user);
      return res.data;
    } catch {
      // Fallback
      const newUser: User = { id: `u_${Date.now()}`, name: data.name, email: data.email };
      const token = `token_${Date.now()}`;
      setStorageItem(STORAGE_KEYS.USER, newUser);
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      return { user: newUser, token };
    }
  },

  async login(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
    try {
      const res = await axiosInstance.post('/auth/login', data);
      localStorage.setItem(STORAGE_KEYS.TOKEN, res.data.token);
      setStorageItem(STORAGE_KEYS.USER, res.data.user);
      return res.data;
    } catch {
      // Fallback local login
      const existingUser = getStorageItem<User>(STORAGE_KEYS.USER, { id: 'u_1', name: 'Mohit', email: data.email });
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || `demo_token_${Date.now()}`;
      setStorageItem(STORAGE_KEYS.USER, existingUser);
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      return { user: existingUser, token };
    }
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // Profile
  async getProfile(): Promise<Profile> {
    try {
      const res = await axiosInstance.get('/profile');
      setStorageItem(STORAGE_KEYS.PROFILE, res.data);
      return res.data;
    } catch {
      return getStorageItem<Profile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    }
  },

  async updateProfile(profile: Profile): Promise<Profile> {
    try {
      const res = await axiosInstance.put('/profile', profile);
      setStorageItem(STORAGE_KEYS.PROFILE, res.data);
      return res.data;
    } catch {
      setStorageItem(STORAGE_KEYS.PROFILE, profile);
      return profile;
    }
  },

  // Weight Logs
  async getWeightLogs(): Promise<WeightLog[]> {
    try {
      const res = await axiosInstance.get('/weight');
      setStorageItem(STORAGE_KEYS.WEIGHT_LOGS, res.data);
      return res.data;
    } catch {
      return getStorageItem<WeightLog[]>(STORAGE_KEYS.WEIGHT_LOGS, INITIAL_WEIGHT_LOGS);
    }
  },

  async addWeightLog(log: Omit<WeightLog, 'id'>): Promise<WeightLog> {
    try {
      const res = await axiosInstance.post('/weight', log);
      const logs = await this.getWeightLogs();
      return res.data;
    } catch {
      const logs = getStorageItem<WeightLog[]>(STORAGE_KEYS.WEIGHT_LOGS, INITIAL_WEIGHT_LOGS);
      const newLog: WeightLog = { ...log, id: `w_${Date.now()}` };
      const updated = [newLog, ...logs.filter((l) => l.date !== log.date)];
      setStorageItem(STORAGE_KEYS.WEIGHT_LOGS, updated);

      // Also update current weight in profile!
      const profile = getStorageItem<Profile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
      profile.currentWeightKg = log.weightKg;
      setStorageItem(STORAGE_KEYS.PROFILE, profile);

      return newLog;
    }
  },

  async deleteWeightLog(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/weight/${id}`);
    } catch {
      const logs = getStorageItem<WeightLog[]>(STORAGE_KEYS.WEIGHT_LOGS, []);
      setStorageItem(
        STORAGE_KEYS.WEIGHT_LOGS,
        logs.filter((l) => l.id !== id)
      );
    }
  },

  // Meals & Food Database
  async getFoodDatabase(): Promise<FoodItem[]> {
    try {
      const res = await axiosInstance.get('/food');
      return res.data;
    } catch {
      return getStorageItem<FoodItem[]>(STORAGE_KEYS.FOOD_DB, INITIAL_FOOD_DATABASE);
    }
  },

  async addCustomFood(food: Omit<FoodItem, 'id'>): Promise<FoodItem> {
    try {
      const res = await axiosInstance.post('/food', food);
      return res.data;
    } catch {
      const db = getStorageItem<FoodItem[]>(STORAGE_KEYS.FOOD_DB, INITIAL_FOOD_DATABASE);
      const newFood: FoodItem = { ...food, id: `f_cust_${Date.now()}`, isCustom: true };
      const updated = [newFood, ...db];
      setStorageItem(STORAGE_KEYS.FOOD_DB, updated);
      return newFood;
    }
  },

  async getMeals(date?: string): Promise<MealEntry[]> {
    try {
      const res = await axiosInstance.get('/meals', { params: { date } });
      return res.data;
    } catch {
      const allMeals = getStorageItem<MealEntry[]>(STORAGE_KEYS.MEALS, INITIAL_MEALS);
      if (date) {
        return allMeals.filter((m) => m.date === date);
      }
      return allMeals;
    }
  },

  async addMeal(meal: Omit<MealEntry, 'id'>): Promise<MealEntry> {
    try {
      const res = await axiosInstance.post('/meals', meal);
      return res.data;
    } catch {
      const meals = getStorageItem<MealEntry[]>(STORAGE_KEYS.MEALS, INITIAL_MEALS);
      const newMeal: MealEntry = { ...meal, id: `m_${Date.now()}` };
      const updated = [...meals, newMeal];
      setStorageItem(STORAGE_KEYS.MEALS, updated);
      return newMeal;
    }
  },

  async updateMeal(meal: MealEntry): Promise<MealEntry> {
    try {
      const res = await axiosInstance.put(`/meals/${meal.id}`, meal);
      return res.data;
    } catch {
      const meals = getStorageItem<MealEntry[]>(STORAGE_KEYS.MEALS, INITIAL_MEALS);
      const updated = meals.map((m) => (m.id === meal.id ? meal : m));
      setStorageItem(STORAGE_KEYS.MEALS, updated);
      return meal;
    }
  },

  async deleteMeal(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/meals/${id}`);
    } catch {
      const meals = getStorageItem<MealEntry[]>(STORAGE_KEYS.MEALS, INITIAL_MEALS);
      setStorageItem(
        STORAGE_KEYS.MEALS,
        meals.filter((m) => m.id !== id)
      );
    }
  },

  // Exercises
  async getExercises(date?: string): Promise<ExerciseLog[]> {
    try {
      const res = await axiosInstance.get('/exercises', { params: { date } });
      return res.data;
    } catch {
      const list = getStorageItem<ExerciseLog[]>(STORAGE_KEYS.EXERCISES, INITIAL_EXERCISES);
      return date ? list.filter((e) => e.date === date) : list;
    }
  },

  async addExercise(exercise: Omit<ExerciseLog, 'id'>): Promise<ExerciseLog> {
    try {
      const res = await axiosInstance.post('/exercises', exercise);
      return res.data;
    } catch {
      const list = getStorageItem<ExerciseLog[]>(STORAGE_KEYS.EXERCISES, INITIAL_EXERCISES);
      const newEx: ExerciseLog = { ...exercise, id: `e_${Date.now()}` };
      const updated = [...list, newEx];
      setStorageItem(STORAGE_KEYS.EXERCISES, updated);
      return newEx;
    }
  },

  async deleteExercise(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/exercises/${id}`);
    } catch {
      const list = getStorageItem<ExerciseLog[]>(STORAGE_KEYS.EXERCISES, INITIAL_EXERCISES);
      setStorageItem(
        STORAGE_KEYS.EXERCISES,
        list.filter((e) => e.id !== id)
      );
    }
  },

  // Workouts
  async getWorkouts(date?: string): Promise<Workout[]> {
    try {
      const res = await axiosInstance.get('/workouts', { params: { date } });
      return res.data;
    } catch {
      const list = getStorageItem<Workout[]>(STORAGE_KEYS.WORKOUTS, INITIAL_WORKOUTS);
      return date ? list.filter((w) => w.date === date) : list;
    }
  },

  async addWorkout(workout: Omit<Workout, 'id'>): Promise<Workout> {
    try {
      const res = await axiosInstance.post('/workouts', workout);
      return res.data;
    } catch {
      const list = getStorageItem<Workout[]>(STORAGE_KEYS.WORKOUTS, INITIAL_WORKOUTS);
      const newWk: Workout = { ...workout, id: `wk_${Date.now()}` };
      const updated = [...list, newWk];
      setStorageItem(STORAGE_KEYS.WORKOUTS, updated);
      return newWk;
    }
  },

  // Running Logs
  async getRunningLogs(date?: string): Promise<RunningLog[]> {
    try {
      const res = await axiosInstance.get('/running', { params: { date } });
      return res.data;
    } catch {
      const list = getStorageItem<RunningLog[]>(STORAGE_KEYS.RUNNING_LOGS, INITIAL_RUNNING_LOGS);
      return date ? list.filter((r) => r.date === date) : list;
    }
  },

  async addRunningLog(log: Omit<RunningLog, 'id'>): Promise<RunningLog> {
    try {
      const res = await axiosInstance.post('/running', log);
      return res.data;
    } catch {
      const list = getStorageItem<RunningLog[]>(STORAGE_KEYS.RUNNING_LOGS, INITIAL_RUNNING_LOGS);
      const newLog: RunningLog = { ...log, id: `r_${Date.now()}` };
      const updated = [...list, newLog];
      setStorageItem(STORAGE_KEYS.RUNNING_LOGS, updated);
      return newLog;
    }
  },

  // Walking & Step Logs
  async getWalkingLogs(date?: string): Promise<WalkingLog[]> {
    try {
      const res = await axiosInstance.get('/walking', { params: { date } });
      return res.data;
    } catch {
      const list = getStorageItem<WalkingLog[]>(STORAGE_KEYS.WALKING_LOGS, INITIAL_WALKING_LOGS);
      return date ? list.filter((w) => w.date === date) : list;
    }
  },

  async setStepsForDate(date: string, steps: number, distanceKm?: number, durationMinutes?: number, caloriesBurned?: number): Promise<WalkingLog> {
    const defaultDist = distanceKm || Math.round((steps * 0.00075) * 10) / 10;
    const defaultDur = durationMinutes || Math.round(steps / 100);
    const defaultCal = caloriesBurned || Math.round(steps * 0.04);
    const profile = getStorageItem<Profile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);

    try {
      const res = await axiosInstance.post('/walking', {
        date,
        steps,
        distanceKm: defaultDist,
        durationMinutes: defaultDur,
        caloriesBurned: defaultCal,
        stepGoal: profile.stepGoal,
      });
      return res.data;
    } catch {
      const list = getStorageItem<WalkingLog[]>(STORAGE_KEYS.WALKING_LOGS, INITIAL_WALKING_LOGS);
      const existing = list.find((w) => w.date === date);
      let updatedLog: WalkingLog;

      if (existing) {
        updatedLog = { ...existing, steps, distanceKm: defaultDist, durationMinutes: defaultDur, caloriesBurned: defaultCal };
      } else {
        updatedLog = {
          id: `wk_${Date.now()}`,
          date,
          steps,
          distanceKm: defaultDist,
          durationMinutes: defaultDur,
          caloriesBurned: defaultCal,
          stepGoal: profile.stepGoal,
        };
      }

      const newList = [updatedLog, ...list.filter((w) => w.date !== date)];
      setStorageItem(STORAGE_KEYS.WALKING_LOGS, newList);
      return updatedLog;
    }
  },

  // Water Tracking
  async getWaterLog(date: string): Promise<number> {
    try {
      const res = await axiosInstance.get('/water', { params: { date } });
      return res.data.amountMl || 0;
    } catch {
      const logs = getStorageItem<WaterLog[]>(STORAGE_KEYS.WATER_LOGS, INITIAL_WATER_LOGS);
      const entry = logs.find((w) => w.date === date);
      return entry ? entry.amountMl : 0;
    }
  },

  async addWater(date: string, deltaMl: number): Promise<number> {
    try {
      const current = await this.getWaterLog(date);
      const newTotal = Math.max(0, current + deltaMl);
      const res = await axiosInstance.post('/water', { date, amountMl: newTotal });
      return res.data.amountMl;
    } catch {
      const logs = getStorageItem<WaterLog[]>(STORAGE_KEYS.WATER_LOGS, INITIAL_WATER_LOGS);
      const existing = logs.find((w) => w.date === date);
      const current = existing ? existing.amountMl : 0;
      const newTotal = Math.max(0, current + deltaMl);

      let newList: WaterLog[];
      if (existing) {
        newList = logs.map((w) => (w.date === date ? { ...w, amountMl: newTotal } : w));
      } else {
        newList = [...logs, { id: `wat_${Date.now()}`, date, amountMl: newTotal }];
      }
      setStorageItem(STORAGE_KEYS.WATER_LOGS, newList);
      return newTotal;
    }
  },

  async setWaterTotal(date: string, totalMl: number): Promise<number> {
    try {
      const res = await axiosInstance.post('/water', { date, amountMl: totalMl });
      return res.data.amountMl;
    } catch {
      const logs = getStorageItem<WaterLog[]>(STORAGE_KEYS.WATER_LOGS, INITIAL_WATER_LOGS);
      const existing = logs.find((w) => w.date === date);

      let newList: WaterLog[];
      if (existing) {
        newList = logs.map((w) => (w.date === date ? { ...w, amountMl: totalMl } : w));
      } else {
        newList = [...logs, { id: `wat_${Date.now()}`, date, amountMl: totalMl }];
      }
      setStorageItem(STORAGE_KEYS.WATER_LOGS, newList);
      return totalMl;
    }
  },

  // Sleep Log
  async getSleepLog(date: string): Promise<SleepLog | null> {
    try {
      const res = await axiosInstance.get('/sleep', { params: { date } });
      return res.data;
    } catch {
      const logs = getStorageItem<SleepLog[]>(STORAGE_KEYS.SLEEP_LOGS, INITIAL_SLEEP_LOGS);
      return logs.find((s) => s.date === date) || null;
    }
  },

  async addSleepLog(log: Omit<SleepLog, 'id'>): Promise<SleepLog> {
    try {
      const res = await axiosInstance.post('/sleep', log);
      return res.data;
    } catch {
      const logs = getStorageItem<SleepLog[]>(STORAGE_KEYS.SLEEP_LOGS, INITIAL_SLEEP_LOGS);
      const existing = logs.find((s) => s.date === log.date);
      let updatedLog: SleepLog;

      if (existing) {
        updatedLog = { ...existing, ...log };
      } else {
        updatedLog = { ...log, id: `s_${Date.now()}` };
      }
      const newList = [updatedLog, ...logs.filter((s) => s.date !== log.date)];
      setStorageItem(STORAGE_KEYS.SLEEP_LOGS, newList);
      return updatedLog;
    }
  },

  // Goals
  async getGoals(): Promise<Goal[]> {
    try {
      const res = await axiosInstance.get('/goals');
      setStorageItem(STORAGE_KEYS.GOALS, res.data);
      return res.data;
    } catch {
      return getStorageItem<Goal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
    }
  },

  async addGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
    try {
      const res = await axiosInstance.post('/goals', goal);
      return res.data;
    } catch {
      const goals = getStorageItem<Goal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
      const newGoal: Goal = { ...goal, id: `g_${Date.now()}` };
      const updated = [newGoal, ...goals];
      setStorageItem(STORAGE_KEYS.GOALS, updated);
      return newGoal;
    }
  },

  async updateGoal(goal: Goal): Promise<Goal> {
    try {
      const res = await axiosInstance.put(`/goals/${goal.id}`, goal);
      return res.data;
    } catch {
      const goals = getStorageItem<Goal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
      const updated = goals.map((g) => (g.id === goal.id ? goal : g));
      setStorageItem(STORAGE_KEYS.GOALS, updated);
      return goal;
    }
  },

  async deleteGoal(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/goals/${id}`);
    } catch {
      const goals = getStorageItem<Goal[]>(STORAGE_KEYS.GOALS, INITIAL_GOALS);
      setStorageItem(
        STORAGE_KEYS.GOALS,
        goals.filter((g) => g.id !== id)
      );
    }
  },

  // Reminders
  async getReminders(): Promise<Reminder[]> {
    return getStorageItem<Reminder[]>(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
  },

  async updateReminders(reminders: Reminder[]): Promise<Reminder[]> {
    setStorageItem(STORAGE_KEYS.REMINDERS, reminders);
    return reminders;
  },

  // Data Export & Import (JSON & CSV)
  async exportDataJSON(): Promise<string> {
    const data = {
      profile: getStorageItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE),
      weightLogs: getStorageItem(STORAGE_KEYS.WEIGHT_LOGS, INITIAL_WEIGHT_LOGS),
      meals: getStorageItem(STORAGE_KEYS.MEALS, INITIAL_MEALS),
      foodDatabase: getStorageItem(STORAGE_KEYS.FOOD_DB, INITIAL_FOOD_DATABASE),
      exercises: getStorageItem(STORAGE_KEYS.EXERCISES, INITIAL_EXERCISES),
      workouts: getStorageItem(STORAGE_KEYS.WORKOUTS, INITIAL_WORKOUTS),
      runningLogs: getStorageItem(STORAGE_KEYS.RUNNING_LOGS, INITIAL_RUNNING_LOGS),
      walkingLogs: getStorageItem(STORAGE_KEYS.WALKING_LOGS, INITIAL_WALKING_LOGS),
      waterLogs: getStorageItem(STORAGE_KEYS.WATER_LOGS, INITIAL_WATER_LOGS),
      sleepLogs: getStorageItem(STORAGE_KEYS.SLEEP_LOGS, INITIAL_SLEEP_LOGS),
      goals: getStorageItem(STORAGE_KEYS.GOALS, INITIAL_GOALS),
      exportDate: new Date().toISOString(),
      appName: 'FitTrack',
    };
    return JSON.stringify(data, null, 2);
  },

  async exportDataCSV(): Promise<string> {
    const weightLogs = getStorageItem<WeightLog[]>(STORAGE_KEYS.WEIGHT_LOGS, []);
    let csv = 'Type,Date,Value1,Value2,Notes\n';
    weightLogs.forEach((w) => {
      csv += `Weight,${w.date},${w.weightKg} kg,${w.bodyFatPercentage || ''}%,${w.notes || ''}\n`;
    });
    const meals = getStorageItem<MealEntry[]>(STORAGE_KEYS.MEALS, []);
    meals.forEach((m) => {
      csv += `Meal,${m.date},${m.mealType}:${m.foodName},${m.calories} kcal,P:${m.protein}g C:${m.carbs}g F:${m.fat}g\n`;
    });
    const walks = getStorageItem<WalkingLog[]>(STORAGE_KEYS.WALKING_LOGS, []);
    walks.forEach((w) => {
      csv += `Steps,${w.date},${w.steps} steps,${w.distanceKm} km,${w.caloriesBurned} kcal burned\n`;
    });
    return csv;
  },

  async restoreDataJSON(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') throw new Error('Invalid backup file');

      if (data.profile) setStorageItem(STORAGE_KEYS.PROFILE, data.profile);
      if (data.weightLogs) setStorageItem(STORAGE_KEYS.WEIGHT_LOGS, data.weightLogs);
      if (data.meals) setStorageItem(STORAGE_KEYS.MEALS, data.meals);
      if (data.foodDatabase) setStorageItem(STORAGE_KEYS.FOOD_DB, data.foodDatabase);
      if (data.exercises) setStorageItem(STORAGE_KEYS.EXERCISES, data.exercises);
      if (data.workouts) setStorageItem(STORAGE_KEYS.WORKOUTS, data.workouts);
      if (data.runningLogs) setStorageItem(STORAGE_KEYS.RUNNING_LOGS, data.runningLogs);
      if (data.walkingLogs) setStorageItem(STORAGE_KEYS.WALKING_LOGS, data.walkingLogs);
      if (data.waterLogs) setStorageItem(STORAGE_KEYS.WATER_LOGS, data.waterLogs);
      if (data.sleepLogs) setStorageItem(STORAGE_KEYS.SLEEP_LOGS, data.sleepLogs);
      if (data.goals) setStorageItem(STORAGE_KEYS.GOALS, data.goals);
      return true;
    } catch (err) {
      console.error('Failed to restore data:', err);
      return false;
    }
  },

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      if (key !== STORAGE_KEYS.THEME) {
        localStorage.removeItem(key);
      }
    });
    initializeLocalStorageDefaults();
  },
};
