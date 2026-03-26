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

export const defaultRecipes: Recipe[] = [
  {
    id: 'recipe-breakfast-oats',
    title: 'Apple Cinnamon Overnight Oats',
    description: 'A make-ahead breakfast with oats, yogurt, and fresh apple.',
    category: 'breakfast',
    image: 'https://picsum.photos/seed/recipe-breakfast-oats/960/640',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    ingredients: [
      { name: 'Rolled oats', amount: '1', unit: 'cup' },
      { name: 'Milk', amount: '1', unit: 'cup' },
      { name: 'Greek yogurt', amount: '1/2', unit: 'cup' },
      { name: 'Apple', amount: '1', unit: 'piece' },
      { name: 'Cinnamon', amount: '1', unit: 'tsp' },
    ],
    instructions: [
      'Mix oats, milk, yogurt, and cinnamon in a bowl or jar.',
      'Fold in diced apple and stir well.',
      'Cover and refrigerate overnight.',
      'Serve chilled in the morning.',
    ],
    nutrition: { calories: 310, protein: 14, carbs: 48, fat: 7, fiber: 7 },
    rating: 4.6,
    ratingCount: 24,
    isFavorite: true,
    createdAt: '2026-01-10',
  },
  {
    id: 'recipe-lunch-wrap',
    title: 'Chickpea Avocado Wrap',
    description: 'A quick high-fiber lunch wrap with mashed chickpeas and avocado.',
    category: 'lunch',
    image: 'https://picsum.photos/seed/recipe-lunch-wrap/960/640',
    prepTime: 12,
    cookTime: 0,
    servings: 2,
    ingredients: [
      { name: 'Chickpeas', amount: '1', unit: 'can' },
      { name: 'Avocado', amount: '1', unit: 'piece' },
      { name: 'Lemon juice', amount: '1', unit: 'tbsp' },
      { name: 'Whole wheat tortilla', amount: '2', unit: 'piece' },
      { name: 'Spinach', amount: '1', unit: 'cup' },
    ],
    instructions: [
      'Drain chickpeas and mash with avocado and lemon juice.',
      'Season to taste with salt and pepper.',
      'Spread mixture on tortillas and top with spinach.',
      'Roll tightly and slice in half.',
    ],
    nutrition: { calories: 420, protein: 15, carbs: 50, fat: 18, fiber: 13 },
    rating: 4.4,
    ratingCount: 19,
    isFavorite: false,
    createdAt: '2026-01-11',
  },
  {
    id: 'recipe-dinner-salmon',
    title: 'Garlic Lemon Baked Salmon',
    description: 'A simple oven-baked salmon with garlic, lemon, and herbs.',
    category: 'dinner',
    image: 'https://picsum.photos/seed/recipe-dinner-salmon/960/640',
    prepTime: 10,
    cookTime: 18,
    servings: 2,
    ingredients: [
      { name: 'Salmon fillet', amount: '2', unit: 'piece' },
      { name: 'Garlic', amount: '2', unit: 'clove' },
      { name: 'Lemon', amount: '1', unit: 'piece' },
      { name: 'Olive oil', amount: '1', unit: 'tbsp' },
      { name: 'Parsley', amount: '1', unit: 'tbsp' },
    ],
    instructions: [
      'Preheat oven to 400 F (205 C).',
      'Place salmon on a lined tray and brush with olive oil.',
      'Top with minced garlic, lemon slices, and parsley.',
      'Bake until salmon flakes easily, about 16 to 18 minutes.',
    ],
    nutrition: { calories: 360, protein: 34, carbs: 4, fat: 22, fiber: 1 },
    rating: 4.8,
    ratingCount: 42,
    isFavorite: true,
    createdAt: '2026-01-12',
  },
  {
    id: 'recipe-snack-parfait',
    title: 'Berry Yogurt Parfait',
    description: 'Layered yogurt, berries, and granola for a quick snack.',
    category: 'snack',
    image: 'https://picsum.photos/seed/recipe-snack-parfait/960/640',
    prepTime: 8,
    cookTime: 0,
    servings: 1,
    ingredients: [
      { name: 'Greek yogurt', amount: '3/4', unit: 'cup' },
      { name: 'Mixed berries', amount: '1/2', unit: 'cup' },
      { name: 'Granola', amount: '1/4', unit: 'cup' },
      { name: 'Honey', amount: '1', unit: 'tsp' },
    ],
    instructions: [
      'Spoon half of the yogurt into a glass.',
      'Add berries and granola.',
      'Top with remaining yogurt and drizzle honey.',
    ],
    nutrition: { calories: 250, protein: 16, carbs: 28, fat: 8, fiber: 4 },
    rating: 4.3,
    ratingCount: 16,
    isFavorite: false,
    createdAt: '2026-01-13',
  },
  {
    id: 'recipe-drink-smoothie',
    title: 'Green Mango Smoothie',
    description: 'Refreshing smoothie with mango, spinach, and banana.',
    category: 'drinks',
    image: 'https://picsum.photos/seed/recipe-drink-smoothie/960/640',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    ingredients: [
      { name: 'Mango', amount: '1', unit: 'cup' },
      { name: 'Banana', amount: '1/2', unit: 'piece' },
      { name: 'Spinach', amount: '1', unit: 'cup' },
      { name: 'Water', amount: '3/4', unit: 'cup' },
      { name: 'Lime juice', amount: '1', unit: 'tsp' },
    ],
    instructions: [
      'Add all ingredients to a blender.',
      'Blend until smooth and creamy.',
      'Serve immediately over ice if desired.',
    ],
    nutrition: { calories: 180, protein: 3, carbs: 43, fat: 1, fiber: 5 },
    rating: 4.2,
    ratingCount: 11,
    isFavorite: false,
    createdAt: '2026-01-14',
  },
  {
    id: 'recipe-dessert-cookies',
    title: 'Banana Oat Cookies',
    description: 'Soft cookies made with ripe banana and rolled oats.',
    category: 'dessert',
    image: 'https://picsum.photos/seed/recipe-dessert-cookies/960/640',
    prepTime: 12,
    cookTime: 15,
    servings: 8,
    ingredients: [
      { name: 'Ripe banana', amount: '2', unit: 'piece' },
      { name: 'Rolled oats', amount: '1 1/2', unit: 'cup' },
      { name: 'Dark chocolate chips', amount: '1/4', unit: 'cup' },
      { name: 'Cinnamon', amount: '1/2', unit: 'tsp' },
    ],
    instructions: [
      'Preheat oven to 350 F (175 C).',
      'Mash banana and stir in oats, chips, and cinnamon.',
      'Scoop onto a lined tray and flatten slightly.',
      'Bake for 12 to 15 minutes.',
    ],
    nutrition: { calories: 120, protein: 3, carbs: 21, fat: 3, fiber: 3 },
    rating: 4.5,
    ratingCount: 28,
    isFavorite: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'recipe-fruits-salad',
    title: 'Citrus Fruit Salad',
    description: 'A bright fruit bowl with orange, pineapple, and mint.',
    category: 'fruits',
    image: 'https://picsum.photos/seed/recipe-fruits-salad/960/640',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    ingredients: [
      { name: 'Orange', amount: '2', unit: 'piece' },
      { name: 'Pineapple', amount: '1', unit: 'cup' },
      { name: 'Kiwi', amount: '1', unit: 'piece' },
      { name: 'Mint leaves', amount: '1', unit: 'tbsp' },
      { name: 'Lime juice', amount: '1', unit: 'tsp' },
    ],
    instructions: [
      'Peel and segment orange, then dice the remaining fruit.',
      'Combine all fruit in a bowl.',
      'Add lime juice and chopped mint, then toss gently.',
    ],
    nutrition: { calories: 145, protein: 2, carbs: 36, fat: 0, fiber: 5 },
    rating: 4.1,
    ratingCount: 14,
    isFavorite: false,
    createdAt: '2026-01-16',
  },
];

export const defaultMealPlan: MealPlan = {
  Monday: {
    breakfast: 'recipe-breakfast-oats',
    lunch: 'recipe-lunch-wrap',
    dinner: 'recipe-dinner-salmon',
  },
  Tuesday: {},
  Wednesday: {
    snack: 'recipe-snack-parfait',
  },
  Thursday: {},
  Friday: {
    dessert: 'recipe-dessert-cookies',
  },
  Saturday: {},
  Sunday: {
    drinks: 'recipe-drink-smoothie',
    fruits: 'recipe-fruits-salad',
  },
};
