export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'lightly' | 'moderately' | 'very' | 'extremely';
export type FitnessGoal = 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle' | 'improve_fitness';
export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'ft';

export interface BMICalculation {
  bmi: number;
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obesity';
  healthyRange: string;
  color: string; // HEX or Tailwind class indicator
  percentile: number; // 0-100 for gauge meter
}

/**
 * Converts pounds to kilograms
 */
export const lbToKg = (lb: number): number => lb * 0.453592;

/**
 * Converts kilograms to pounds
 */
export const kgToLb = (kg: number): number => kg / 0.453592;

/**
 * Converts feet/inches to cm
 */
export const ftInToCm = (ft: number, inches: number): number => (ft * 12 + inches) * 2.54;

/**
 * Converts cm to feet and inches
 */
export const cmToFtIn = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

/**
 * Calculate BMI given weight in kg and height in cm
 * BMI = weight(kg) / (height(m))^2
 */
export const calculateBMI = (weightKg: number, heightCm: number): BMICalculation => {
  if (!weightKg || !heightCm || weightKg <= 0 || heightCm <= 0) {
    return {
      bmi: 0,
      category: 'Normal weight',
      healthyRange: '18.5 - 24.9 kg/m²',
      color: 'emerald',
      percentile: 50,
    };
  }

  const heightM = heightCm / 100;
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Math.round(rawBmi * 10) / 10;

  let category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obesity' = 'Normal weight';
  let color = 'emerald';
  let percentile = 50;

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'sky';
    percentile = Math.max(5, Math.min(25, (bmi / 18.5) * 25));
  } else if (bmi <= 24.9) {
    category = 'Normal weight';
    color = 'emerald';
    percentile = 25 + ((bmi - 18.5) / (24.9 - 18.5)) * 25;
  } else if (bmi <= 29.9) {
    category = 'Overweight';
    color = 'amber';
    percentile = 50 + ((bmi - 25) / (29.9 - 25)) * 25;
  } else {
    category = 'Obesity';
    color = 'rose';
    percentile = Math.min(95, 75 + ((bmi - 30) / 10) * 20);
  }

  const minHealthyKg = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxHealthyKg = Math.round(24.9 * heightM * heightM * 10) / 10;

  return {
    bmi,
    category,
    healthyRange: `${minHealthyKg} kg - ${maxHealthyKg} kg (18.5 - 24.9 BMI)`,
    color,
    percentile: Math.round(percentile),
  };
};

/**
 * Calculate BMR using Mifflin-St Jeor Equation
 * Male: 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
 * Female: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
 */
export const calculateBMR = (
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number
): number => {
  if (!weightKg || !heightCm || !age || weightKg <= 0 || heightCm <= 0 || age <= 0) return 1500;

  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'female') {
    bmr -= 161;
  } else {
    bmr += 5; // Default for male & other
  }

  return Math.round(bmr);
};

/**
 * Get activity level multiplier for TDEE calculation
 */
export const getActivityMultiplier = (activityLevel: ActivityLevel): number => {
  switch (activityLevel) {
    case 'sedentary':
      return 1.2;
    case 'lightly':
      return 1.375;
    case 'moderately':
      return 1.55;
    case 'very':
      return 1.725;
    case 'extremely':
      return 1.9;
    default:
      return 1.375;
  }
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * TDEE = BMR * Activity Multiplier
 */
export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  const multiplier = getActivityMultiplier(activityLevel);
  return Math.round(bmr * multiplier);
};

/**
 * Calculate safe calorie target based on fitness goal
 */
export const calculateCalorieTarget = (
  tdee: number,
  goal: FitnessGoal,
  gender: Gender = 'male'
): { calorieTarget: number; minRecommended: number; defaultDeficit: number } => {
  const minRecommended = gender === 'female' ? 1200 : 1500;
  let target = tdee;
  let deficit = 0;

  switch (goal) {
    case 'lose_weight':
      deficit = 500; // ~0.5kg per week weight loss
      target = Math.max(minRecommended, tdee - deficit);
      break;
    case 'gain_weight':
    case 'build_muscle':
      deficit = -300; // ~300 kcal surplus
      target = tdee + 300;
      break;
    case 'maintain_weight':
    case 'improve_fitness':
    default:
      deficit = 0;
      target = tdee;
      break;
  }

  return {
    calorieTarget: Math.round(target),
    minRecommended,
    defaultDeficit: deficit,
  };
};

/**
 * Calculate macronutrient target goals
 */
export const calculateMacroTargets = (
  calorieTarget: number,
  weightKg: number,
  goal: FitnessGoal
) => {
  // Protein: ~1.8g to 2.2g per kg of bodyweight for active weight loss / muscle gain
  let proteinGrams = Math.round(weightKg * 1.8);
  if (goal === 'build_muscle') proteinGrams = Math.round(weightKg * 2.2);

  // Minimum safety ceiling/floor for protein
  proteinGrams = Math.max(60, Math.min(250, proteinGrams));

  // Protein calories = 4 kcal per gram
  const proteinCalories = proteinGrams * 4;

  // Fat calories: ~25% of total calorie target
  const fatCalories = calorieTarget * 0.25;
  const fatGrams = Math.round(fatCalories / 9); // 9 kcal per gram

  // Carbs calories: Remaining calories
  const carbCalories = Math.max(0, calorieTarget - proteinCalories - fatCalories);
  const carbGrams = Math.round(carbCalories / 4); // 4 kcal per gram

  // Fiber target: 14g per 1000 kcal
  const fiberGrams = Math.round((calorieTarget / 1000) * 14);

  return {
    protein: proteinGrams,
    carbs: carbGrams,
    fat: fatGrams,
    fiber: Math.max(25, fiberGrams),
  };
};

/**
 * Calculate running pace min/km from duration (min) and distance (km)
 */
export const calculateRunningPace = (
  durationMinutes: number,
  distanceKm: number
): { paceString: string; decimalPace: number } => {
  if (!distanceKm || distanceKm <= 0 || !durationMinutes || durationMinutes <= 0) {
    return { paceString: '0:00 min/km', decimalPace: 0 };
  }

  const paceDecimal = durationMinutes / distanceKm;
  const mins = Math.floor(paceDecimal);
  const secs = Math.round((paceDecimal - mins) * 60);

  const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;
  return {
    paceString: `${mins}:${formattedSecs} min/km`,
    decimalPace: Math.round(paceDecimal * 100) / 100,
  };
};

/**
 * Calculate MET-based estimated calories burned
 */
export const calculateCaloriesBurned = (
  category: string,
  durationMinutes: number,
  weightKg: number = 70
): number => {
  if (!durationMinutes || durationMinutes <= 0) return 0;

  // MET values for standard activities
  const metMap: Record<string, number> = {
    'Running': 9.8,
    'Walking': 3.8,
    'Strength Training': 5.0,
    'Cardio': 7.0,
    'Cycling': 7.5,
    'HIIT': 8.5,
    'Yoga': 3.0,
    'Stretching': 2.3,
    'Sports': 6.5,
    'Other': 4.0,
  };

  const met = metMap[category] || 4.5;
  // Calories = MET * weight(kg) * duration(hours)
  const calories = met * weightKg * (durationMinutes / 60);
  return Math.round(calories);
};

/**
 * Calculate Daily Fitness Score out of 100
 * Nutrition (25), Exercise (25), Steps (20), Water (15), Sleep (15)
 */
export interface DailyScoreBreakdown {
  totalScore: number;
  nutritionScore: number; // max 25
  exerciseScore: number; // max 25
  stepsScore: number; // max 20
  waterScore: number; // max 15
  sleepScore: number; // max 15
  message: string;
}

export const calculateDailyScore = (data: {
  caloriesConsumed: number;
  calorieTarget: number;
  exerciseMinutes: number;
  exerciseGoalMinutes?: number;
  steps: number;
  stepGoal?: number;
  waterMl: number;
  waterGoalMl?: number;
  sleepHours: number;
  sleepGoalHours?: number;
}): DailyScoreBreakdown => {
  const stepGoal = data.stepGoal || 10000;
  const waterGoal = data.waterGoalMl || 2500;
  const exerciseGoal = data.exerciseGoalMinutes || 30;
  const sleepGoal = data.sleepGoalHours || 8;
  const calorieTarget = data.calorieTarget || 2000;

  // 1. Nutrition Score (25 pts): Perfect if within +/- 15% of calorie target
  let nutritionScore = 0;
  if (data.caloriesConsumed > 0 && calorieTarget > 0) {
    const ratio = data.caloriesConsumed / calorieTarget;
    if (ratio >= 0.85 && ratio <= 1.15) {
      nutritionScore = 25;
    } else if (ratio > 0.6 && ratio < 1.3) {
      nutritionScore = 18;
    } else if (ratio > 0.4 && ratio < 1.5) {
      nutritionScore = 10;
    } else {
      nutritionScore = 5;
    }
  }

  // 2. Exercise Score (25 pts)
  const exerciseRatio = Math.min(1.5, data.exerciseMinutes / exerciseGoal);
  const exerciseScore = Math.round(Math.min(25, exerciseRatio * 25));

  // 3. Steps Score (20 pts)
  const stepsRatio = Math.min(1.5, data.steps / stepGoal);
  const stepsScore = Math.round(Math.min(20, stepsRatio * 20));

  // 4. Water Score (15 pts)
  const waterRatio = Math.min(1.2, data.waterMl / waterGoal);
  const waterScore = Math.round(Math.min(15, waterRatio * 15));

  // 5. Sleep Score (15 pts)
  const sleepRatio = Math.min(1.2, data.sleepHours / sleepGoal);
  const sleepScore = Math.round(Math.min(15, sleepRatio * 15));

  const totalScore = Math.min(100, nutritionScore + exerciseScore + stepsScore + waterScore + sleepScore);

  let message = 'Keep taking small steps towards your health goals!';
  if (totalScore >= 85) {
    message = '🔥 Outstanding consistency! You hit almost all your daily fitness goals!';
  } else if (totalScore >= 70) {
    message = '💪 Great work today! You are building very strong healthy habits.';
  } else if (totalScore >= 50) {
    message = '👍 Good progress! Focus on your water and step goals to boost your score.';
  }

  return {
    totalScore,
    nutritionScore,
    exerciseScore,
    stepsScore,
    waterScore,
    sleepScore,
    message,
  };
};
