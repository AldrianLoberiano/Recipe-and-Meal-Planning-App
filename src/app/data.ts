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
    title: 'Avocado Toast with Poached Eggs',
    description: 'Creamy avocado spread on sourdough toast topped with perfectly poached eggs, cherry tomatoes, and a sprinkle of everything bagel seasoning.',
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1623691751128-ade6f7e59003?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwYnJlYWtmYXN0JTIwYXZvY2FkbyUyMHRvYXN0fGVufDF8fHx8MTc3MzUyNTUzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    prepTime: 10,
    cookTime: 5,
    servings: 2,
    ingredients: [
      { name: 'Ripe avocado', amount: '1', unit: 'whole' },
      { name: 'Sourdough bread', amount: '2', unit: 'slices' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Cherry tomatoes', amount: '6', unit: 'pieces' },
      { name: 'Lemon juice', amount: '1', unit: 'tbsp' },
      { name: 'Everything bagel seasoning', amount: '1', unit: 'tsp' },
      { name: 'Salt', amount: '1', unit: 'pinch' },
      { name: 'Red pepper flakes', amount: '1', unit: 'pinch' },
    ],
    instructions: [
      'Toast the sourdough bread slices until golden and crispy.',
      'Cut the avocado in half, remove the pit, and scoop into a bowl. Mash with lemon juice and salt.',
      'Bring a pot of water to a gentle simmer. Create a whirlpool and carefully drop in the eggs. Poach for 3-4 minutes.',
      'Spread the mashed avocado generously on each toast slice.',
      'Place the poached eggs on top of the avocado.',
      'Halve the cherry tomatoes and arrange around the eggs.',
      'Sprinkle with everything bagel seasoning and red pepper flakes. Serve immediately.',
    ],
    nutrition: { calories: 380, protein: 16, carbs: 32, fat: 22, fiber: 8 },
    rating: 4.7,
    ratingCount: 128,
    isFavorite: true,
    createdAt: '2026-01-15',
  },
  {
    id: '2',
    title: 'Grilled Chicken Caesar Salad',
    description: 'Classic Caesar salad with juicy grilled chicken breast, crispy croutons, shaved Parmesan, and homemade Caesar dressing.',
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1771074168439-0083aaac48e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbiUyMHNhbGFkJTIwbHVuY2h8ZW58MXx8fHwxNzczNDI1NDg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    prepTime: 15,
    cookTime: 12,
    servings: 2,
    ingredients: [
      { name: 'Chicken breast', amount: '2', unit: 'pieces' },
      { name: 'Romaine lettuce', amount: '1', unit: 'head' },
      { name: 'Parmesan cheese', amount: '1/2', unit: 'cup' },
      { name: 'Croutons', amount: '1', unit: 'cup' },
      { name: 'Caesar dressing', amount: '1/4', unit: 'cup' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
      { name: 'Garlic powder', amount: '1', unit: 'tsp' },
      { name: 'Black pepper', amount: '1/2', unit: 'tsp' },
    ],
    instructions: [
      'Season chicken breasts with olive oil, garlic powder, salt, and pepper.',
      'Grill chicken on medium-high heat for 6 minutes per side until internal temperature reaches 165°F.',
      'Let chicken rest for 5 minutes, then slice into strips.',
      'Wash and chop romaine lettuce into bite-sized pieces.',
      'Toss lettuce with Caesar dressing in a large bowl.',
      'Top with sliced chicken, croutons, and shaved Parmesan.',
      'Serve immediately with extra dressing on the side.',
    ],
    nutrition: { calories: 450, protein: 42, carbs: 18, fat: 24, fiber: 4 },
    rating: 4.5,
    ratingCount: 95,
    isFavorite: false,
    createdAt: '2026-01-20',
  },
  {
    id: '3',
    title: 'Creamy Garlic Tuscan Pasta',
    description: 'Rich and creamy pasta with sun-dried tomatoes, spinach, garlic, and Italian herbs in a Parmesan cream sauce.',
    category: 'dinner',
    image: 'https://images.unsplash.com/photo-1599984615649-3307ec0ef478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpbm5lciUyMGl0YWxpYW58ZW58MXx8fHwxNzczNTI1NTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    ingredients: [
      { name: 'Penne pasta', amount: '400', unit: 'g' },
      { name: 'Heavy cream', amount: '1', unit: 'cup' },
      { name: 'Sun-dried tomatoes', amount: '1/2', unit: 'cup' },
      { name: 'Baby spinach', amount: '2', unit: 'cups' },
      { name: 'Garlic cloves', amount: '4', unit: 'cloves' },
      { name: 'Parmesan cheese', amount: '1/2', unit: 'cup' },
      { name: 'Italian seasoning', amount: '1', unit: 'tbsp' },
      { name: 'Olive oil', amount: '2', unit: 'tbsp' },
      { name: 'Salt', amount: '1', unit: 'tsp' },
    ],
    instructions: [
      'Cook penne pasta according to package directions. Reserve 1 cup pasta water before draining.',
      'Heat olive oil in a large skillet over medium heat. Sauté minced garlic for 1 minute.',
      'Add sun-dried tomatoes and cook for 2 minutes.',
      'Pour in heavy cream and bring to a gentle simmer.',
      'Add Italian seasoning, salt, and grated Parmesan. Stir until cheese melts.',
      'Toss in baby spinach and cook until wilted, about 2 minutes.',
      'Add cooked pasta to the sauce. Toss to coat, adding pasta water as needed.',
      'Serve hot with extra Parmesan on top.',
    ],
    nutrition: { calories: 580, protein: 22, carbs: 62, fat: 28, fiber: 5 },
    rating: 4.8,
    ratingCount: 203,
    isFavorite: true,
    createdAt: '2026-02-01',
  },
  {
    id: '4',
    title: 'Berry Protein Smoothie',
    description: 'A refreshing and nutritious smoothie packed with mixed berries, banana, Greek yogurt, and a scoop of protein powder.',
    category: 'snack',
    image: 'https://images.unsplash.com/photo-1740637372899-e27569049917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGZydWl0JTIwc21vb3RoaWUlMjBzbmFja3xlbnwxfHx8fDE3NzM1MjU1MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    ingredients: [
      { name: 'Mixed berries (frozen)', amount: '1', unit: 'cup' },
      { name: 'Banana', amount: '1', unit: 'medium' },
      { name: 'Greek yogurt', amount: '1/2', unit: 'cup' },
      { name: 'Protein powder', amount: '1', unit: 'scoop' },
      { name: 'Almond milk', amount: '1', unit: 'cup' },
      { name: 'Honey', amount: '1', unit: 'tbsp' },
      { name: 'Chia seeds', amount: '1', unit: 'tbsp' },
    ],
    instructions: [
      'Add almond milk and Greek yogurt to the blender first.',
      'Add frozen mixed berries and banana.',
      'Add protein powder and honey.',
      'Blend on high for 60 seconds until smooth and creamy.',
      'Pour into a glass, top with chia seeds.',
      'Serve immediately for best taste and texture.',
    ],
    nutrition: { calories: 320, protein: 28, carbs: 45, fat: 6, fiber: 7 },
    rating: 4.6,
    ratingCount: 76,
    isFavorite: false,
    createdAt: '2026-02-10',
  },
  {
    id: '5',
    title: 'Teriyaki Glazed Salmon',
    description: 'Perfectly pan-seared salmon fillet glazed with homemade teriyaki sauce, served with steamed jasmine rice and roasted vegetables.',
    category: 'dinner',
    image: 'https://images.unsplash.com/photo-1727821935355-9a2ec8c4ef5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjB0ZXJpeWFraSUyMGRpbm5lciUyMHBsYXRlfGVufDF8fHx8MTc3MzUyNTUzN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    ingredients: [
      { name: 'Salmon fillets', amount: '2', unit: 'pieces' },
      { name: 'Soy sauce', amount: '3', unit: 'tbsp' },
      { name: 'Mirin', amount: '2', unit: 'tbsp' },
      { name: 'Brown sugar', amount: '1', unit: 'tbsp' },
      { name: 'Garlic cloves', amount: '2', unit: 'cloves' },
      { name: 'Fresh ginger', amount: '1', unit: 'tsp' },
      { name: 'Jasmine rice', amount: '1', unit: 'cup' },
      { name: 'Sesame seeds', amount: '1', unit: 'tbsp' },
      { name: 'Green onions', amount: '2', unit: 'stalks' },
    ],
    instructions: [
      'Cook jasmine rice according to package directions.',
      'Mix soy sauce, mirin, brown sugar, minced garlic, and grated ginger for the teriyaki sauce.',
      'Pat salmon fillets dry and season with salt and pepper.',
      'Heat oil in a skillet over medium-high heat. Place salmon skin-side up and cook 4 minutes.',
      'Flip salmon, pour teriyaki sauce over the fillets.',
      'Reduce heat and cook 4-5 more minutes, spooning sauce over the fish.',
      'Serve over jasmine rice, garnished with sesame seeds and sliced green onions.',
    ],
    nutrition: { calories: 520, protein: 38, carbs: 48, fat: 18, fiber: 2 },
    rating: 4.9,
    ratingCount: 167,
    isFavorite: true,
    createdAt: '2026-02-15',
  },
  {
    id: '6',
    title: 'Fluffy Buttermilk Pancakes',
    description: 'Light and fluffy buttermilk pancakes with a hint of vanilla, served with fresh berries and maple syrup.',
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1585407698236-7a78cdb68dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5jYWtlcyUyMGJyZWFrZmFzdCUyMG1hcGxlJTIwc3lydXB8ZW58MXx8fHwxNzczNTI1NTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    ingredients: [
      { name: 'All-purpose flour', amount: '2', unit: 'cups' },
      { name: 'Buttermilk', amount: '1.5', unit: 'cups' },
      { name: 'Eggs', amount: '2', unit: 'large' },
      { name: 'Butter (melted)', amount: '3', unit: 'tbsp' },
      { name: 'Sugar', amount: '2', unit: 'tbsp' },
      { name: 'Baking powder', amount: '2', unit: 'tsp' },
      { name: 'Vanilla extract', amount: '1', unit: 'tsp' },
      { name: 'Maple syrup', amount: '1/4', unit: 'cup' },
      { name: 'Fresh berries', amount: '1', unit: 'cup' },
    ],
    instructions: [
      'Whisk together flour, sugar, baking powder, and salt in a large bowl.',
      'In a separate bowl, mix buttermilk, eggs, melted butter, and vanilla extract.',
      'Pour wet ingredients into dry and stir until just combined. Some lumps are okay.',
      'Heat a griddle or non-stick pan over medium heat. Lightly butter the surface.',
      'Pour 1/4 cup batter for each pancake. Cook until bubbles form on surface, about 2-3 minutes.',
      'Flip and cook another 1-2 minutes until golden brown.',
      'Stack pancakes, top with fresh berries and warm maple syrup.',
    ],
    nutrition: { calories: 420, protein: 12, carbs: 58, fat: 16, fiber: 3 },
    rating: 4.4,
    ratingCount: 89,
    isFavorite: false,
    createdAt: '2026-02-20',
  },
  {
    id: '7',
    title: 'Mediterranean Quinoa Bowl',
    description: 'A vibrant and nutritious bowl with fluffy quinoa, chickpeas, cucumber, cherry tomatoes, feta cheese, and lemon-herb dressing.',
    category: 'lunch',
    image: 'https://images.unsplash.com/photo-1671058844333-2d4b41530be6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGVycmFuZWFuJTIwcXVpbm9hJTIwYm93bCUyMGx1bmNofGVufDF8fHx8MTc3MzUyNTUzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    ingredients: [
      { name: 'Quinoa', amount: '1', unit: 'cup' },
      { name: 'Chickpeas (canned)', amount: '1', unit: 'can' },
      { name: 'Cucumber', amount: '1', unit: 'medium' },
      { name: 'Cherry tomatoes', amount: '1', unit: 'cup' },
      { name: 'Feta cheese', amount: '1/2', unit: 'cup' },
      { name: 'Kalamata olives', amount: '1/4', unit: 'cup' },
      { name: 'Red onion', amount: '1/4', unit: 'medium' },
      { name: 'Lemon juice', amount: '2', unit: 'tbsp' },
      { name: 'Extra virgin olive oil', amount: '3', unit: 'tbsp' },
      { name: 'Fresh parsley', amount: '2', unit: 'tbsp' },
    ],
    instructions: [
      'Rinse quinoa and cook in 2 cups water for 15 minutes. Fluff with a fork and let cool.',
      'Drain and rinse chickpeas. Pat dry with paper towels.',
      'Dice cucumber, halve cherry tomatoes, and thinly slice red onion.',
      'Whisk together olive oil, lemon juice, salt, and pepper for the dressing.',
      'In a large bowl, combine quinoa, chickpeas, cucumber, tomatoes, onion, and olives.',
      'Drizzle with dressing and toss gently.',
      'Top with crumbled feta cheese and fresh parsley. Serve at room temperature.',
    ],
    nutrition: { calories: 410, protein: 18, carbs: 52, fat: 16, fiber: 10 },
    rating: 4.6,
    ratingCount: 112,
    isFavorite: false,
    createdAt: '2026-03-01',
  },
  {
    id: '8',
    title: 'Chocolate Peanut Butter Energy Bites',
    description: 'No-bake energy bites made with oats, peanut butter, chocolate chips, and honey. Perfect for a quick and healthy snack.',
    category: 'snack',
    image: 'https://images.unsplash.com/photo-1734773487516-078839ea277f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBlbmVyZ3klMjBiaXRlcyUyMHNuYWNrfGVufDF8fHx8MTc3MzUyNTUzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    prepTime: 15,
    cookTime: 0,
    servings: 20,
    ingredients: [
      { name: 'Rolled oats', amount: '1', unit: 'cup' },
      { name: 'Peanut butter', amount: '1/2', unit: 'cup' },
      { name: 'Honey', amount: '1/3', unit: 'cup' },
      { name: 'Dark chocolate chips', amount: '1/3', unit: 'cup' },
      { name: 'Flaxseed meal', amount: '2', unit: 'tbsp' },
      { name: 'Vanilla extract', amount: '1', unit: 'tsp' },
      { name: 'Salt', amount: '1', unit: 'pinch' },
    ],
    instructions: [
      'Combine all ingredients in a large mixing bowl.',
      'Stir until everything is well combined and the mixture holds together.',
      'Refrigerate for 30 minutes to make rolling easier.',
      'Roll mixture into 1-inch balls using your hands.',
      'Place on a parchment-lined baking sheet.',
      'Refrigerate for at least 1 hour before serving.',
      'Store in an airtight container in the refrigerator for up to 1 week.',
    ],
    nutrition: { calories: 95, protein: 3, carbs: 12, fat: 5, fiber: 2 },
    rating: 4.3,
    ratingCount: 64,
    isFavorite: false,
    createdAt: '2026-03-05',
  },
];

export const defaultMealPlan: MealPlan = {
  Monday: { breakfast: '1', lunch: '2', dinner: '3' },
  Tuesday: { breakfast: '6', lunch: '7', dinner: '5' },
  Wednesday: { breakfast: '1', snack: '4' },
  Thursday: { lunch: '2', dinner: '3', snack: '8' },
  Friday: { breakfast: '6', dinner: '5' },
  Saturday: { breakfast: '1', lunch: '7', dinner: '3', snack: '4' },
  Sunday: { breakfast: '6', lunch: '2', dinner: '5', snack: '8' },
};
