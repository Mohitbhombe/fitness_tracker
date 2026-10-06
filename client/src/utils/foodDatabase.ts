import { FoodItem } from '../types';

export const INITIAL_FOOD_DATABASE: FoodItem[] = [
  // Indian Staples & Dishes
  { id: 'f_1', name: 'White Rice (Cooked)', servingQuantity: 100, servingUnit: 'g', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, category: 'indian' },
  { id: 'f_2', name: 'Brown Rice (Cooked)', servingQuantity: 100, servingUnit: 'g', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, fiber: 1.8, category: 'indian' },
  { id: 'f_3', name: 'Roti / Chapati (Whole Wheat)', servingQuantity: 1, servingUnit: 'piece (40g)', calories: 104, protein: 3.1, carbs: 22, fat: 0.5, fiber: 2.8, category: 'indian' },
  { id: 'f_4', name: 'Yellow Dal (Tadka)', servingQuantity: 1, servingUnit: 'bowl (150g)', calories: 150, protein: 8.5, carbs: 20, fat: 4.2, fiber: 4.5, category: 'indian' },
  { id: 'f_5', name: 'Dal Makhani', servingQuantity: 1, servingUnit: 'bowl (150g)', calories: 230, protein: 9.0, carbs: 24, fat: 11.5, fiber: 5.0, category: 'indian' },
  { id: 'f_6', name: 'Paneer (Raw)', servingQuantity: 100, servingUnit: 'g', calories: 265, protein: 18.3, carbs: 1.2, fat: 20.8, fiber: 0, category: 'indian' },
  { id: 'f_7', name: 'Paneer Butter Masala', servingQuantity: 1, servingUnit: 'bowl (150g)', calories: 310, protein: 11.0, carbs: 12.0, fat: 24.0, fiber: 2.1, category: 'indian' },
  { id: 'f_8', name: 'Chicken Curry (Indian Style)', servingQuantity: 1, servingUnit: 'serving (200g)', calories: 280, protein: 26.0, carbs: 6.0, fat: 16.0, fiber: 1.5, category: 'indian' },
  { id: 'f_9', name: 'Chicken Breast (Grilled)', servingQuantity: 100, servingUnit: 'g', calories: 165, protein: 31.0, carbs: 0, fat: 3.6, fiber: 0, category: 'protein' },
  { id: 'f_10', name: 'Boiled Egg (Whole)', servingQuantity: 1, servingUnit: 'large (50g)', calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fiber: 0, category: 'protein' },
  { id: 'f_11', name: 'Egg White', servingQuantity: 1, servingUnit: 'large (33g)', calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, fiber: 0, category: 'protein' },
  { id: 'f_12', name: 'Milk (Toned / 2% Fat)', servingQuantity: 1, servingUnit: 'cup (250ml)', calories: 122, protein: 8.0, carbs: 12.0, fat: 4.8, fiber: 0, category: 'beverages' },
  { id: 'f_13', name: 'Curd / Dahi (Plain)', servingQuantity: 1, servingUnit: 'cup (150g)', calories: 98, protein: 5.5, carbs: 7.0, fat: 5.0, fiber: 0, category: 'indian' },
  { id: 'f_14', name: 'Poha (Flattened Rice)', servingQuantity: 1, servingUnit: 'plate (150g)', calories: 220, protein: 4.2, carbs: 42.0, fat: 4.5, fiber: 2.2, category: 'indian' },
  { id: 'f_15', name: 'Upma (Semolina)', servingQuantity: 1, servingUnit: 'plate (150g)', calories: 210, protein: 5.0, carbs: 36.0, fat: 5.2, fiber: 2.0, category: 'indian' },
  { id: 'f_16', name: 'Idli (Steamed)', servingQuantity: 2, servingUnit: 'pieces (100g)', calories: 130, protein: 4.0, carbs: 26.0, fat: 0.8, fiber: 1.6, category: 'indian' },
  { id: 'f_17', name: 'Plain Dosa', servingQuantity: 1, servingUnit: 'medium (80g)', calories: 168, protein: 3.8, carbs: 29.0, fat: 3.7, fiber: 1.4, category: 'indian' },
  { id: 'f_18', name: 'Samosa (Potato)', servingQuantity: 1, servingUnit: 'piece (90g)', calories: 262, protein: 3.5, carbs: 32.0, fat: 13.5, fiber: 2.5, category: 'snacks' },
  { id: 'f_19', name: 'Mixed Sabzi / Vegetable Curry', servingQuantity: 1, servingUnit: 'bowl (150g)', calories: 120, protein: 3.0, carbs: 14.0, fat: 6.0, fiber: 4.0, category: 'indian' },
  { id: 'f_20', name: 'Sprouts (Moong / Chana)', servingQuantity: 1, servingUnit: 'cup (100g)', calories: 110, protein: 9.0, carbs: 18.0, fat: 0.8, fiber: 6.0, category: 'indian' },
  { id: 'f_21', name: 'Oats (Rolled, Cooked in Water)', servingQuantity: 1, servingUnit: 'cup (234g)', calories: 166, protein: 5.9, carbs: 28.0, fat: 3.6, fiber: 4.0, category: 'breakfast' },
  { id: 'f_22', name: 'Almonds (Raw)', servingQuantity: 1, servingUnit: 'handful (28g)', calories: 164, protein: 6.0, carbs: 6.1, fat: 14.2, fiber: 3.5, category: 'nuts' },
  { id: 'f_23', name: 'Walnuts', servingQuantity: 1, servingUnit: 'handful (28g)', calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9, category: 'nuts' },
  
  // Fruits & Vegetables
  { id: 'f_24', name: 'Banana', servingQuantity: 1, servingUnit: 'medium (118g)', calories: 105, protein: 1.3, carbs: 27.0, fat: 0.4, fiber: 3.1, category: 'fruits' },
  { id: 'f_25', name: 'Apple', servingQuantity: 1, servingUnit: 'medium (182g)', calories: 95, protein: 0.5, carbs: 25.0, fat: 0.3, fiber: 4.4, category: 'fruits' },
  { id: 'f_26', name: 'Orange', servingQuantity: 1, servingUnit: 'medium (131g)', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2, fiber: 3.1, category: 'fruits' },
  { id: 'f_27', name: 'Papaya', servingQuantity: 1, servingUnit: 'cup (145g)', calories: 62, protein: 0.7, carbs: 15.7, fat: 0.4, fiber: 2.5, category: 'fruits' },
  { id: 'f_28', name: 'Cucumber', servingQuantity: 1, servingUnit: 'medium (200g)', calories: 30, protein: 1.3, carbs: 7.3, fat: 0.2, fiber: 1.0, category: 'vegetables' },
  { id: 'f_29', name: 'Spinach / Palak', servingQuantity: 1, servingUnit: 'cup (100g)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, category: 'vegetables' },
  
  // Beverages & Whey
  { id: 'f_30', name: 'Whey Protein Scoop', servingQuantity: 1, servingUnit: 'scoop (30g)', calories: 120, protein: 24.0, carbs: 2.0, fat: 1.5, fiber: 0, category: 'protein' },
  { id: 'f_31', name: 'Green Tea (Unsweetened)', servingQuantity: 1, servingUnit: 'cup (240ml)', calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, category: 'beverages' },
  { id: 'f_32', name: 'Black Coffee', servingQuantity: 1, servingUnit: 'cup (240ml)', calories: 5, protein: 0.3, carbs: 0, fat: 0, fiber: 0, category: 'beverages' },
];
