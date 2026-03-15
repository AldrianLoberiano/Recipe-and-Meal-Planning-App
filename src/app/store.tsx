import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Recipe, MealPlan, GroceryItem, User, defaultRecipes, defaultMealPlan } from './data';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  recipes: Recipe[];
  mealPlan: MealPlan;
  groceryList: GroceryItem[];
  notifications: { id: string; message: string; time: string }[];
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'rating' | 'ratingCount' | 'isFavorite' | 'createdAt'>) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  toggleFavorite: (id: string) => void;
  rateRecipe: (id: string, rating: number) => void;
  setMealForDay: (day: string, slot: string, recipeId: string | undefined) => void;
  moveMeal: (fromDay: string, fromSlot: string, toDay: string, toSlot: string) => void;
  clearMealPlan: () => void;
  generateGroceryList: () => void;
  toggleGroceryItem: (id: string) => void;
  clearPurchasedItems: () => void;
  addNotification: (message: string) => void;
  dismissNotification: (id: string) => void;
}

type GlobalWithAppContext = typeof globalThis & {
  __MEALCRAFT_APP_CONTEXT__?: React.Context<AppState | null>;
};

const globalForAppContext = globalThis as GlobalWithAppContext;
const AppContext =
  globalForAppContext.__MEALCRAFT_APP_CONTEXT__ ?? createContext<AppState | null>(null);

globalForAppContext.__MEALCRAFT_APP_CONTEXT__ = AppContext;

const emptyMealPlan: MealPlan = {
  Monday: {},
  Tuesday: {},
  Wednesday: {},
  Thursday: {},
  Friday: {},
  Saturday: {},
  Sunday: {},
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function loadRecipesWithSeedMerge(): Recipe[] {
  const stored = loadFromStorage<Recipe[]>('mealplanner_recipes', defaultRecipes);

  if (!Array.isArray(stored)) {
    return defaultRecipes;
  }

  const existingIds = new Set(stored.map(recipe => recipe.id));
  const missingDefaults = defaultRecipes.filter(recipe => !existingIds.has(recipe.id));

  return missingDefaults.length > 0 ? [...stored, ...missingDefaults] : stored;
}

function syncRecipeToSql(recipe: Recipe) {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').toString().trim();
  const endpoint = `${baseUrl}/api/recipes/sync`;

  void fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recipe }),
  }).catch(() => {
    // Keep UI responsive even when API is offline.
  });
}

function buildApiUrl(path: string): string {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').toString().trim();
  return `${baseUrl}${path}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadFromStorage('mealplanner_user', null));
  const [recipes, setRecipes] = useState<Recipe[]>(() => loadRecipesWithSeedMerge());
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => loadFromStorage('mealplanner_mealplan', defaultMealPlan));
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() => loadFromStorage('mealplanner_grocery', []));
  const [notifications, setNotifications] = useState<{ id: string; message: string; time: string }[]>([]);

  useEffect(() => { localStorage.setItem('mealplanner_recipes', JSON.stringify(recipes)); }, [recipes]);
  useEffect(() => { localStorage.setItem('mealplanner_mealplan', JSON.stringify(mealPlan)); }, [mealPlan]);
  useEffect(() => { localStorage.setItem('mealplanner_grocery', JSON.stringify(groceryList)); }, [groceryList]);
  useEffect(() => { if (user) localStorage.setItem('mealplanner_user', JSON.stringify(user)); else localStorage.removeItem('mealplanner_user'); }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(buildApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok || !payload?.user) {
        return { success: false, message: payload?.message ?? 'Invalid email or password.' };
      }

      setUser(payload.user as User);
      return { success: true };
    } catch {
      return { success: false, message: 'Unable to connect to the server.' };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(buildApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok || !payload?.user) {
        return { success: false, message: payload?.message ?? 'Unable to create account.' };
      }

      setUser(null);
      setRecipes([]);
      setMealPlan(emptyMealPlan);
      setGroceryList([]);
      setNotifications([]);
      return { success: true };
    } catch {
      return { success: false, message: 'Unable to connect to the server.' };
    }
  }, []);

  const logout = useCallback(() => { setUser(null); }, []);

  const addRecipe = useCallback((recipe: Omit<Recipe, 'id' | 'rating' | 'ratingCount' | 'isFavorite' | 'createdAt'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      rating: 0,
      ratingCount: 0,
      isFavorite: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setRecipes(prev => [newRecipe, ...prev]);
    syncRecipeToSql(newRecipe);
  }, []);

  const updateRecipe = useCallback((id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updatedRecipe = { ...r, ...updates };
      syncRecipeToSql(updatedRecipe);
      return updatedRecipe;
    }));
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    setMealPlan(prev => {
      const updated = { ...prev };
      for (const day of Object.keys(updated)) {
        const dayPlan = { ...updated[day] };
        for (const slot of Object.keys(dayPlan)) {
          if (dayPlan[slot as keyof typeof dayPlan] === id) {
            delete dayPlan[slot as keyof typeof dayPlan];
          }
        }
        updated[day] = dayPlan;
      }
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  }, []);

  const rateRecipe = useCallback((id: string, rating: number) => {
    setRecipes(prev => prev.map(r => {
      if (r.id !== id) return r;
      const newCount = r.ratingCount + 1;
      const newRating = ((r.rating * r.ratingCount) + rating) / newCount;
      return { ...r, rating: Math.round(newRating * 10) / 10, ratingCount: newCount };
    }));
  }, []);

  const setMealForDay = useCallback((day: string, slot: string, recipeId: string | undefined) => {
    setMealPlan(prev => {
      const dayPlan = { ...prev[day] };
      if (recipeId) {
        (dayPlan as any)[slot] = recipeId;
      } else {
        delete (dayPlan as any)[slot];
      }
      return { ...prev, [day]: dayPlan };
    });
  }, []);

  const moveMeal = useCallback((fromDay: string, fromSlot: string, toDay: string, toSlot: string) => {
    setMealPlan(prev => {
      const fromDayPlan = { ...prev[fromDay] };
      const toDayPlan = fromDay === toDay ? fromDayPlan : { ...prev[toDay] };
      const sourceRecipeId = (fromDayPlan as any)[fromSlot];
      const targetRecipeId = (toDayPlan as any)[toSlot];

      if (!sourceRecipeId) return prev;

      // Swap: put target's recipe in source slot, source's recipe in target slot
      if (targetRecipeId) {
        (fromDayPlan as any)[fromSlot] = targetRecipeId;
      } else {
        delete (fromDayPlan as any)[fromSlot];
      }
      (toDayPlan as any)[toSlot] = sourceRecipeId;

      return { ...prev, [fromDay]: fromDayPlan, [toDay]: toDayPlan };
    });
  }, []);

  const clearMealPlan = useCallback(() => {
    setMealPlan(emptyMealPlan);
  }, []);

  const generateGroceryList = useCallback(() => {
    const items: GroceryItem[] = [];
    const ingredientMap = new Map<string, GroceryItem>();

    for (const day of Object.keys(mealPlan)) {
      const dayPlan = mealPlan[day];
      for (const slot of Object.keys(dayPlan)) {
        const recipeId = (dayPlan as any)[slot] as string;
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
          for (const ing of recipe.ingredients) {
            const key = `${ing.name.toLowerCase()}_${ing.unit}`;
            if (ingredientMap.has(key)) {
              const existing = ingredientMap.get(key)!;
              const existingAmt = parseFloat(existing.amount) || 0;
              const newAmt = parseFloat(ing.amount) || 0;
              existing.amount = (existingAmt + newAmt).toString();
              existing.recipeTitle += `, ${recipe.title}`;
            } else {
              ingredientMap.set(key, {
                id: Date.now().toString() + Math.random(),
                name: ing.name,
                amount: ing.amount,
                unit: ing.unit,
                purchased: false,
                recipeTitle: recipe.title,
              });
            }
          }
        }
      }
    }

    ingredientMap.forEach(item => items.push(item));
    setGroceryList(items);
  }, [mealPlan, recipes]);

  const toggleGroceryItem = useCallback((id: string) => {
    setGroceryList(prev => prev.map(item => item.id === id ? { ...item, purchased: !item.purchased } : item));
  }, []);

  const clearPurchasedItems = useCallback(() => {
    setGroceryList(prev => prev.filter(item => !item.purchased));
  }, []);

  const addNotification = useCallback((message: string) => {
    setNotifications(prev => [...prev, { id: Date.now().toString(), message, time: new Date().toLocaleTimeString() }]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      user, isAuthenticated: !!user, recipes, mealPlan, groceryList, notifications,
      login, register, logout, addRecipe, updateRecipe, deleteRecipe,
      toggleFavorite, rateRecipe, setMealForDay, moveMeal, clearMealPlan,
      generateGroceryList, toggleGroceryItem, clearPurchasedItems,
      addNotification, dismissNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}