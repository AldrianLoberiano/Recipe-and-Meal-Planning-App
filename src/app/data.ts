export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drinks' | 'dessert' | 'fruits';
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  rating: number;
  ratingCount: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface MealPlan {
  [day: string]: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
    snack?: string;
    drinks?: string;
    dessert?: string;
    fruits?: string;
  };
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  purchased: boolean;
  recipeTitle: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const CATEGORIES = [
  { value: 'breakfast', label: 'Breakfast', emoji: '??' },
  { value: 'lunch', label: 'Lunch', emoji: '??' },
  { value: 'dinner', label: 'Dinner', emoji: '??' },
  { value: 'snack', label: 'Snack', emoji: '??' },
  { value: 'drinks', label: 'Drinks', emoji: '??' },
  { value: 'dessert', label: 'Dessert', emoji: '??' },
  { value: 'fruits', label: 'Fruits', emoji: '??' },
] as const;

export const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snack', 'drinks', 'dessert', 'fruits'] as const;

export const defaultRecipes: Recipe[] = [];

export const defaultMealPlan: MealPlan = {
  Monday: {},
  Tuesday: {},
  Wednesday: {},
  Thursday: {},
  Friday: {},
  Saturday: {},
  Sunday: {},
};
