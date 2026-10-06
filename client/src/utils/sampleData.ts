import {
  Profile,
  WeightLog,
  MealEntry,
  ExerciseLog,
  Workout,
  RunningLog,
  WalkingLog,
  WaterLog,
  SleepLog,
  Goal,
  Reminder,
} from '../types';

export const DEFAULT_PROFILE: Profile = {
  userId: 'user_1',
  fullName: 'Mohit',
  age: 26,
  gender: 'male',
  heightCm: 178,
  currentWeightKg: 82.4,
  startingWeightKg: 85.0,
  targetWeightKg: 70.0,
  activityLevel: 'moderately',
  fitnessGoal: 'lose_weight',
  preferredWeightUnit: 'kg',
  preferredHeightUnit: 'cm',
  calorieTarget: 2000,
  stepGoal: 10000,
  waterGoalMl: 2500,
  proteinGoal: 120,
  sleepGoalHours: 8,
  remindersEnabled: true,
};

export const INITIAL_WEIGHT_LOGS: WeightLog[] = [
  { id: 'w_1', date: '2026-09-06', weightKg: 85.0, bodyFatPercentage: 24.5, waistMeasurementCm: 92, notes: 'Starting fitness journey' },
  { id: 'w_2', date: '2026-09-13', weightKg: 84.5, bodyFatPercentage: 24.1, notes: 'Felt lighter this week' },
  { id: 'w_3', date: '2026-09-20', weightKg: 83.8, bodyFatPercentage: 23.8 },
  { id: 'w_4', date: '2026-09-27', weightKg: 83.1, bodyFatPercentage: 23.2 },
  { id: 'w_5', date: '2026-10-01', weightKg: 82.8, bodyFatPercentage: 22.9 },
  { id: 'w_6', date: '2026-10-06', weightKg: 82.4, bodyFatPercentage: 22.6, waistMeasurementCm: 88, notes: 'On target!' },
];

export const INITIAL_MEALS: MealEntry[] = [
  {
    id: 'm_1',
    date: '2026-10-06',
    mealType: 'breakfast',
    foodName: 'Oats with Milk & Banana',
    quantity: 1,
    servingUnit: 'bowl',
    calories: 450,
    protein: 18,
    carbs: 72,
    fat: 8,
    fiber: 7,
    time: '08:30 AM',
  },
  {
    id: 'm_2',
    date: '2026-10-06',
    mealType: 'lunch',
    foodName: 'Roti (2) + Yellow Dal + Mixed Sabzi',
    quantity: 1,
    servingUnit: 'plate',
    calories: 650,
    protein: 24,
    carbs: 98,
    fat: 16,
    fiber: 12,
    time: '01:15 PM',
  },
  {
    id: 'm_3',
    date: '2026-10-06',
    mealType: 'snack',
    foodName: 'Almonds & Green Tea',
    quantity: 1,
    servingUnit: 'handful',
    calories: 200,
    protein: 7,
    carbs: 8,
    fat: 15,
    fiber: 4,
    time: '05:00 PM',
  },
  {
    id: 'm_4',
    date: '2026-10-06',
    mealType: 'dinner',
    foodName: 'Paneer Bhurji (150g) + 1 Chapati + Salad',
    quantity: 1,
    servingUnit: 'serving',
    calories: 550,
    protein: 35,
    carbs: 34,
    fat: 28,
    fiber: 6,
    time: '08:30 PM',
  },
];

export const INITIAL_EXERCISES: ExerciseLog[] = [
  {
    id: 'e_1',
    date: '2026-10-06',
    name: 'Evening Weight Training',
    category: 'Strength Training',
    durationMinutes: 45,
    sets: 12,
    reps: 12,
    weightKg: 40,
    caloriesBurned: 320,
    notes: 'Chest & Triceps workout',
  },
];

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'wkt_1',
    date: '2026-10-06',
    title: 'Chest & Triceps Strength Workout',
    exercises: [
      { exerciseName: 'Bench Press', sets: 3, reps: 10, weightKg: 60, restSeconds: 90 },
      { exerciseName: 'Incline Dumbbell Press', sets: 3, reps: 12, weightKg: 20, restSeconds: 60 },
      { exerciseName: 'Push-ups', sets: 3, reps: 15, weightKg: 0, restSeconds: 45 },
      { exerciseName: 'Triceps Rope Pushdown', sets: 3, reps: 12, weightKg: 25, restSeconds: 45 },
    ],
    durationMinutes: 45,
    caloriesBurned: 320,
    totalSets: 12,
    completed: true,
    notes: 'Great pump today!',
  },
];

export const INITIAL_RUNNING_LOGS: RunningLog[] = [
  {
    id: 'r_1',
    date: '2026-10-04',
    distanceKm: 4.5,
    durationMinutes: 28,
    paceMinPerKm: '6:13 min/km',
    caloriesBurned: 380,
    notes: 'Morning park run',
  },
  {
    id: 'r_2',
    date: '2026-10-06',
    distanceKm: 3.2,
    durationMinutes: 20,
    paceMinPerKm: '6:15 min/km',
    caloriesBurned: 270,
    notes: 'Treadmill warm-up run',
  },
];

export const INITIAL_WALKING_LOGS: WalkingLog[] = [
  {
    id: 'wlk_1',
    date: '2026-10-06',
    steps: 7250,
    distanceKm: 5.2,
    durationMinutes: 65,
    caloriesBurned: 240,
    stepGoal: 10000,
  },
];

export const INITIAL_WATER_LOGS: WaterLog[] = [
  { id: 'wat_1', date: '2026-10-06', amountMl: 2100 },
];

export const INITIAL_SLEEP_LOGS: SleepLog[] = [
  {
    id: 's_1',
    date: '2026-10-06',
    sleepTime: '23:15',
    wakeTime: '07:15',
    durationHours: 8.0,
    quality: 'good',
    notes: 'Woke up energized',
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'g_1',
    title: 'Lose 15 kg Total',
    category: 'weight',
    targetValue: 70,
    currentValue: 82.4,
    unit: 'kg',
    startDate: '2026-09-01',
    targetDate: '2026-12-31',
    status: 'active',
  },
  {
    id: 'g_2',
    title: 'Walk 10,000 steps daily',
    category: 'steps',
    targetValue: 10000,
    currentValue: 7250,
    unit: 'steps',
    startDate: '2026-10-01',
    targetDate: '2026-10-31',
    status: 'active',
  },
  {
    id: 'g_3',
    title: 'Drink 2.5 L Water Daily',
    category: 'water',
    targetValue: 2500,
    currentValue: 2100,
    unit: 'ml',
    startDate: '2026-10-01',
    targetDate: '2026-10-31',
    status: 'active',
  },
  {
    id: 'g_4',
    title: 'Run 5 km under 30 minutes',
    category: 'running',
    targetValue: 5,
    currentValue: 3.2,
    unit: 'km',
    startDate: '2026-10-01',
    targetDate: '2026-11-15',
    status: 'active',
  },
  {
    id: 'g_5',
    title: 'Workout 5 days a week',
    category: 'workout',
    targetValue: 5,
    currentValue: 4,
    unit: 'days/wk',
    startDate: '2026-10-01',
    targetDate: '2026-10-31',
    status: 'active',
  },
];

export const INITIAL_REMINDERS: Reminder[] = [
  { id: 'rem_1', type: 'water', time: '10:00 AM', enabled: true, label: 'Hydration Break: Drink 250ml water' },
  { id: 'rem_2', type: 'water', time: '02:30 PM', enabled: true, label: 'Afternoon Hydration' },
  { id: 'rem_3', type: 'meals', time: '01:00 PM', enabled: true, label: 'Log Lunch' },
  { id: 'rem_4', type: 'meals', time: '08:00 PM', enabled: true, label: 'Log Dinner' },
  { id: 'rem_5', type: 'exercise', time: '06:00 PM', enabled: true, label: 'Workout / Evening Walk Time' },
  { id: 'rem_6', type: 'weight', time: '07:30 AM', enabled: true, label: 'Morning Weight Log' },
];

export const INITIAL_HABITS = [
  { id: 'hab_1', title: '10,000 Daily Steps', category: 'fitness', icon: 'Footprints', targetPerDay: 10000, unit: 'steps', streak: 5 },
  { id: 'hab_2', title: 'Drink 2.5L Water', category: 'hydration', icon: 'Droplets', targetPerDay: 2500, unit: 'ml', streak: 7 },
  { id: 'hab_3', title: '30 Min Active Workout', category: 'fitness', icon: 'Dumbbell', targetPerDay: 30, unit: 'min', streak: 4 },
  { id: 'hab_4', title: '8 Hours Quality Sleep', category: 'sleep', icon: 'Moon', targetPerDay: 8, unit: 'hrs', streak: 6 },
  { id: 'hab_5', title: 'Log All Daily Meals', category: 'nutrition', icon: 'Utensils', targetPerDay: 3, unit: 'meals', streak: 12 },
  { id: 'hab_6', title: 'Morning Stretch & Breathe', category: 'mindfulness', icon: 'Sun', targetPerDay: 10, unit: 'min', streak: 3 },
];

export const MOTIVATIONAL_QUOTES = [
  "Small progress is still progress.",
  "Consistency beats intensity.",
  "Keep going — you're building a healthier routine.",
  "Your only limit is you.",
  "Focus on progress, not perfection.",
  "Every step count brings you closer to your target.",
  "Nourish your body, respect your effort.",
  "Great things take time and daily commitment."
];

