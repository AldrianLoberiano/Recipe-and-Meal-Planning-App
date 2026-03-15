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
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
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
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍿' },
] as const;

export const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export const defaultRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Chicken Arroz Caldo',
    description: 'Comforting Filipino rice porridge simmered with chicken, ginger, and garlic, then topped with spring onions and calamansi.',
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1080&q=80',
    prepTime: 15,
    cookTime: 40,
    servings: 4,
    ingredients: [
      { name: 'Chicken thighs', amount: '500', unit: 'g' },
      { name: 'Glutinous rice', amount: '1', unit: 'cup' },
      { name: 'Garlic', amount: '6', unit: 'cloves' },
      { name: 'Ginger', amount: '3', unit: 'tbsp' },
      { name: 'Fish sauce', amount: '2', unit: 'tbsp' },
      { name: 'Chicken broth', amount: '8', unit: 'cups' },
      { name: 'Spring onions', amount: '3', unit: 'stalks' },
      { name: 'Calamansi', amount: '4', unit: 'pieces' },
    ],
    instructions: [
      'Saute garlic and ginger in oil until fragrant.',
      'Add chicken pieces and cook until lightly browned.',
      'Stir in rice and fish sauce, then pour in broth.',
      'Simmer over low heat for 35-40 minutes, stirring occasionally until thick.',
      'Shred chicken and return to the pot. Season to taste.',
      'Serve hot with spring onions and calamansi on the side.',
    ],
    nutrition: { calories: 420, protein: 28, carbs: 38, fat: 16, fiber: 2 },
    rating: 4.8,
    ratingCount: 182,
    isFavorite: true,
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    title: 'Pancit Bihon',
    description: 'Classic Filipino stir-fried rice noodles with chicken, vegetables, soy sauce, and calamansi.',
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1080&q=80',
    prepTime: 15,
    cookTime: 20,
    servings: 5,
    ingredients: [
      { name: 'Bihon noodles', amount: '400', unit: 'g' },
      { name: 'Chicken breast', amount: '300', unit: 'g' },
      { name: 'Carrot', amount: '1', unit: 'medium' },
      { name: 'Cabbage', amount: '2', unit: 'cups' },
      { name: 'Soy sauce', amount: '4', unit: 'tbsp' },
      { name: 'Oyster sauce', amount: '2', unit: 'tbsp' },
      { name: 'Chicken broth', amount: '2', unit: 'cups' },
      { name: 'Calamansi', amount: '4', unit: 'pieces' },
    ],
    instructions: [
      'Soak bihon noodles in warm water until softened, then drain.',
      'Saute garlic and onion, then cook chicken strips until done.',
      'Add soy sauce, oyster sauce, and broth. Bring to a simmer.',
      'Add noodles and toss until liquid is absorbed.',
      'Mix in carrots and cabbage, then cook for 3-4 minutes.',
      'Serve with calamansi wedges.',
    ],
    nutrition: { calories: 470, protein: 26, carbs: 62, fat: 12, fiber: 5 },
    rating: 4.7,
    ratingCount: 210,
    isFavorite: false,
    createdAt: '2026-01-20',
  },
  {
    id: '3',
    title: 'Chicken Adobo',
    description: 'Filipino classic braised in soy sauce, vinegar, garlic, bay leaves, and black peppercorns.',
    category: 'dinner',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1080&q=80',
    prepTime: 15,
    cookTime: 45,
    servings: 4,
    ingredients: [
      { name: 'Chicken thighs', amount: '1', unit: 'kg' },
      { name: 'Soy sauce', amount: '1/2', unit: 'cup' },
      { name: 'Cane vinegar', amount: '1/2', unit: 'cup' },
      { name: 'Garlic', amount: '8', unit: 'cloves' },
      { name: 'Bay leaves', amount: '3', unit: 'pieces' },
      { name: 'Black peppercorns', amount: '1', unit: 'tsp' },
      { name: 'Water', amount: '1', unit: 'cup' },
      { name: 'Brown sugar', amount: '1', unit: 'tsp' },
      { name: 'Cooking oil', amount: '1', unit: 'tbsp' },
    ],
    instructions: [
      'Marinate chicken in soy sauce and half the garlic for 30 minutes.',
      'Heat oil and sear chicken pieces until lightly browned.',
      'Pour in marinade, vinegar, water, bay leaves, peppercorns, and remaining garlic.',
      'Simmer uncovered for 35-40 minutes until chicken is tender and sauce is reduced.',
      'Add sugar if desired and adjust seasoning.',
      'Serve hot with steamed rice.',
    ],
    nutrition: { calories: 520, protein: 36, carbs: 8, fat: 36, fiber: 1 },
    rating: 4.9,
    ratingCount: 325,
    isFavorite: true,
    createdAt: '2026-02-01',
  },
  {
    id: '4',
    title: 'Turon',
    description: 'Crispy caramelized Filipino banana spring rolls made with saba bananas and brown sugar.',
    category: 'snack',
    image: 'https://images.unsplash.com/photo-1604908554167-6d9fcb4206b4?auto=format&fit=crop&w=1080&q=80',
    prepTime: 15,
    cookTime: 12,
    servings: 8,
    ingredients: [
      { name: 'Saba bananas', amount: '8', unit: 'pieces' },
      { name: 'Jackfruit strips', amount: '1/2', unit: 'cup' },
      { name: 'Brown sugar', amount: '1', unit: 'cup' },
      { name: 'Spring roll wrappers', amount: '8', unit: 'pieces' },
      { name: 'Cooking oil', amount: '2', unit: 'cups' },
    ],
    instructions: [
      'Coat banana halves in brown sugar.',
      'Place banana and jackfruit on a spring roll wrapper and roll tightly.',
      'Heat oil over medium heat and fry turon until golden brown.',
      'Sprinkle remaining sugar into the pan to caramelize the wrapper.',
      'Drain on paper towels and serve warm.',
    ],
    nutrition: { calories: 190, protein: 2, carbs: 34, fat: 6, fiber: 2 },
    rating: 4.7,
    ratingCount: 143,
    isFavorite: false,
    createdAt: '2026-02-10',
  },
  {
    id: '5',
    title: 'Sinigang na Baboy',
    description: 'Tamarind-based Filipino pork soup with radish, eggplant, kangkong, and green chili.',
    category: 'dinner',
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=1080&q=80',
    prepTime: 15,
    cookTime: 60,
    servings: 6,
    ingredients: [
      { name: 'Pork belly', amount: '1', unit: 'kg' },
      { name: 'Tamarind soup mix', amount: '1', unit: 'packet' },
      { name: 'Tomatoes', amount: '2', unit: 'medium' },
      { name: 'Onion', amount: '1', unit: 'large' },
      { name: 'Radish', amount: '1', unit: 'medium' },
      { name: 'Eggplant', amount: '2', unit: 'medium' },
      { name: 'Kangkong', amount: '1', unit: 'bundle' },
      { name: 'Fish sauce', amount: '2', unit: 'tbsp' },
      { name: 'Water', amount: '8', unit: 'cups' },
    ],
    instructions: [
      'Boil pork with onion and tomatoes until tender, about 45 minutes.',
      'Add radish and eggplant, then simmer for 8-10 minutes.',
      'Stir in tamarind mix and fish sauce.',
      'Add kangkong and cook for 1-2 minutes.',
      'Serve hot with rice and fish sauce on the side.',
    ],
    nutrition: { calories: 460, protein: 30, carbs: 10, fat: 33, fiber: 4 },
    rating: 4.8,
    ratingCount: 278,
    isFavorite: true,
    createdAt: '2026-02-15',
  },
  {
    id: '6',
    title: 'Tapsilog',
    description: 'Filipino breakfast combo of beef tapa, garlic fried rice (sinangag), and sunny-side-up egg.',
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1080&q=80',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    ingredients: [
      { name: 'Beef tapa', amount: '500', unit: 'g' },
      { name: 'Cooked rice', amount: '4', unit: 'cups' },
      { name: 'Garlic', amount: '8', unit: 'cloves' },
      { name: 'Eggs', amount: '4', unit: 'large' },
      { name: 'Soy sauce', amount: '2', unit: 'tbsp' },
      { name: 'Calamansi juice', amount: '2', unit: 'tbsp' },
      { name: 'Sugar', amount: '1', unit: 'tbsp' },
      { name: 'Cooking oil', amount: '3', unit: 'tbsp' },
    ],
    instructions: [
      'Marinate beef tapa in soy sauce, calamansi, and sugar for at least 30 minutes.',
      'Pan-fry tapa until browned and cooked through.',
      'Saute garlic, add rice, and stir-fry to make sinangag.',
      'Fry eggs sunny-side up.',
      'Serve tapa with garlic rice and eggs.',
    ],
    nutrition: { calories: 540, protein: 29, carbs: 58, fat: 20, fiber: 2 },
    rating: 4.8,
    ratingCount: 196,
    isFavorite: false,
    createdAt: '2026-02-20',
  },
  {
    id: '7',
    title: 'Pork Menudo',
    description: 'Tomato-based Filipino pork stew with liver, potatoes, carrots, and bell peppers.',
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1080&q=80',
    prepTime: 15,
    cookTime: 50,
    servings: 6,
    ingredients: [
      { name: 'Pork shoulder', amount: '800', unit: 'g' },
      { name: 'Pork liver', amount: '200', unit: 'g' },
      { name: 'Tomato sauce', amount: '2', unit: 'cups' },
      { name: 'Potatoes', amount: '2', unit: 'medium' },
      { name: 'Carrots', amount: '2', unit: 'medium' },
      { name: 'Bell pepper', amount: '1', unit: 'large' },
      { name: 'Soy sauce', amount: '2', unit: 'tbsp' },
      { name: 'Garlic', amount: '5', unit: 'cloves' },
      { name: 'Onion', amount: '1', unit: 'large' },
    ],
    instructions: [
      'Saute garlic and onion, then add pork shoulder and cook until lightly browned.',
      'Add soy sauce and tomato sauce, then simmer until pork starts to get tender.',
      'Add potatoes and carrots and cook for 12-15 minutes.',
      'Add liver and bell pepper, then simmer for another 8-10 minutes.',
      'Season with salt and pepper, then serve with rice.',
    ],
    nutrition: { calories: 510, protein: 31, carbs: 24, fat: 31, fiber: 5 },
    rating: 4.7,
    ratingCount: 168,
    isFavorite: false,
    createdAt: '2026-03-01',
  },
  {
    id: '8',
    title: 'Chicken Afritada',
    description: 'Hearty Filipino tomato stew with chicken, potatoes, carrots, and bell peppers.',
    category: 'snack',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1080&q=80',
    prepTime: 15,
    cookTime: 45,
    servings: 5,
    ingredients: [
      { name: 'Chicken drumsticks', amount: '1', unit: 'kg' },
      { name: 'Tomato sauce', amount: '2', unit: 'cups' },
      { name: 'Potatoes', amount: '2', unit: 'medium' },
      { name: 'Carrots', amount: '2', unit: 'medium' },
      { name: 'Red bell pepper', amount: '1', unit: 'large' },
      { name: 'Green peas', amount: '1/2', unit: 'cup' },
      { name: 'Garlic', amount: '5', unit: 'cloves' },
      { name: 'Onion', amount: '1', unit: 'large' },
      { name: 'Fish sauce', amount: '1', unit: 'tbsp' },
    ],
    instructions: [
      'Saute garlic and onion, then brown chicken pieces on all sides.',
      'Add fish sauce and tomato sauce, then simmer for 20 minutes.',
      'Add potatoes and carrots, then continue simmering until tender.',
      'Add bell pepper and peas, then cook for 5 more minutes.',
      'Adjust seasoning and serve warm with rice.',
    ],
    nutrition: { calories: 495, protein: 34, carbs: 21, fat: 30, fiber: 4 },
    rating: 4.8,
    ratingCount: 201,
    isFavorite: false,
    createdAt: '2026-03-05',
  },
];

export const defaultMealPlan: MealPlan = {
  Monday: { breakfast: '1', lunch: '2', dinner: '3' },
  Tuesday: { breakfast: '6', lunch: '7', dinner: '5' },
  Wednesday: { breakfast: '1', snack: '4' },
  Thursday: { lunch: '2', dinner: '3', snack: '4' },
  Friday: { breakfast: '6', dinner: '5' },
  Saturday: { breakfast: '1', lunch: '7', dinner: '3', snack: '4' },
  Sunday: { breakfast: '6', lunch: '2', dinner: '5', snack: '4' },
};
