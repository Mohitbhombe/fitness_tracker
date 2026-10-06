const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
  },
  { timestamps: true }
);

// Profile Schema
const profileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    fullName: { type: String, default: 'Fitness User' },
    age: { type: Number, default: 25 },
    gender: { type: String, default: 'male' },
    heightCm: { type: Number, default: 175 },
    currentWeightKg: { type: Number, default: 80 },
    startingWeightKg: { type: Number, default: 85 },
    targetWeightKg: { type: Number, default: 70 },
    activityLevel: { type: String, default: 'moderately' },
    fitnessGoal: { type: String, default: 'lose_weight' },
    preferredWeightUnit: { type: String, default: 'kg' },
    preferredHeightUnit: { type: String, default: 'cm' },
    calorieTarget: { type: Number, default: 2000 },
    stepGoal: { type: Number, default: 10000 },
    waterGoalMl: { type: Number, default: 2500 },
    proteinGoal: { type: Number, default: 120 },
    sleepGoalHours: { type: Number, default: 8 },
  },
  { timestamps: true }
);

// WeightLog Schema
const weightLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    weightKg: { type: Number, required: true },
    bodyFatPercentage: { type: Number },
    waistMeasurementCm: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

// Food Schema
const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    servingQuantity: { type: Number, default: 100 },
    servingUnit: { type: String, default: 'g' },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    category: { type: String, default: 'general' },
    isCustom: { type: Boolean, default: false },
    userId: { type: String },
  },
  { timestamps: true }
);

// Meal Schema
const mealSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    mealType: { type: String, required: true },
    foodName: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    servingUnit: { type: String, default: 'g' },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    time: { type: String },
  },
  { timestamps: true }
);

// Exercise Schema
const exerciseSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    sets: { type: Number },
    reps: { type: Number },
    weightKg: { type: Number },
    caloriesBurned: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

// Workout Schema
const workoutSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    exercises: [
      {
        exerciseName: String,
        sets: Number,
        reps: Number,
        weightKg: Number,
        restSeconds: Number,
      },
    ],
    durationMinutes: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    totalSets: { type: Number, default: 0 },
    completed: { type: Boolean, default: true },
    notes: { type: String },
  },
  { timestamps: true }
);

// RunningLog Schema
const runningLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    distanceKm: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    paceMinPerKm: { type: String, required: true },
    caloriesBurned: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

// WalkingLog Schema
const walkingLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    steps: { type: Number, required: true },
    distanceKm: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    stepGoal: { type: Number, default: 10000 },
  },
  { timestamps: true }
);

// WaterLog Schema
const waterLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    amountMl: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// SleepLog Schema
const sleepLogSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    date: { type: String, required: true },
    sleepTime: { type: String, required: true },
    wakeTime: { type: String, required: true },
    durationHours: { type: Number, required: true },
    quality: { type: String, default: 'good' },
    notes: { type: String },
  },
  { timestamps: true }
);

// Goal Schema
const goalSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    unit: { type: String, default: '' },
    startDate: { type: String, required: true },
    targetDate: { type: String, required: true },
    status: { type: String, default: 'active' },
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model('User', userSchema),
  Profile: mongoose.model('Profile', profileSchema),
  WeightLog: mongoose.model('WeightLog', weightLogSchema),
  Food: mongoose.model('Food', foodSchema),
  Meal: mongoose.model('Meal', mealSchema),
  Exercise: mongoose.model('Exercise', exerciseSchema),
  Workout: mongoose.model('Workout', workoutSchema),
  RunningLog: mongoose.model('RunningLog', runningLogSchema),
  WalkingLog: mongoose.model('WalkingLog', walkingLogSchema),
  WaterLog: mongoose.model('WaterLog', waterLogSchema),
  SleepLog: mongoose.model('SleepLog', sleepLogSchema),
  Goal: mongoose.model('Goal', goalSchema),
};
