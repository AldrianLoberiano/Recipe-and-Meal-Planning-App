import React from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../store';
import { RecipeCard } from './recipe-card';
import { DAYS_OF_WEEK, CATEGORIES, MEAL_SLOTS } from '../data';
import {
  ChefHat, Calendar, ShoppingCart, Heart, Star, TrendingUp,
  ArrowRight, Utensils, Plus, Upload
} from 'lucide-react';

export function Dashboard() {
  const { recipes, mealPlan, groceryList } = useAppStore();
  const navigate = useNavigate();

  const favoriteCount = recipes.filter(r => r.isFavorite).length;
  const plannedMeals = Object.values(mealPlan).reduce((count, day) => count + Object.keys(day).length, 0);
  const unpurchased = groceryList.filter(i => !i.purchased).length;
  const topRecipes = [...recipes].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const today = DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todayPlan = mealPlan[today] || {};

  const stats = [
    { label: 'Total Recipes', value: recipes.length, icon: ChefHat, color: 'bg-primary/10 text-primary' },
    { label: 'Meals Planned', value: plannedMeals, icon: Calendar, color: 'bg-blue-500/10 text-blue-600' },
    { label: 'Grocery Items', value: unpurchased, icon: ShoppingCart, color: 'bg-green-500/10 text-green-600' },
    { label: 'Favorites', value: favoriteCount, icon: Heart, color: 'bg-red-500/10 text-red-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="mb-1">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!</h1>
        <p className="text-muted-foreground">Here's your meal planning overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl text-foreground">{stat.value}</p>
              <p className="text-muted-foreground text-[0.75rem]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Meals & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's meals */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-primary" />
              Today's Meals ({today})
            </h2>
            <button onClick={() => navigate('/meal-planner')} className="text-primary text-[0.85rem] flex items-center gap-1 hover:underline">
              View Planner <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {Object.keys(todayPlan).length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground mb-3">No meals planned for today</p>
              <button
                onClick={() => navigate('/meal-planner')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Plan Meals
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {MEAL_SLOTS.map(slot => {
                const recipeId = (todayPlan as any)[slot];
                if (!recipeId) return null;
                const recipe = recipes.find(r => r.id === recipeId);
                if (!recipe) return null;
                const cat = CATEGORIES.find(c => c.value === slot);
                return (
                  <div key={slot} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                    <img src={recipe.image} alt={recipe.title} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="text-[0.7rem] text-muted-foreground uppercase tracking-wide">{cat?.emoji} {cat?.label}</p>
                      <p className="truncate text-[0.85rem]">{recipe.title}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/recipes/new')}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Recipe</span>
            </button>
            <button
              onClick={() => navigate('/recipes/import')}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 transition-colors"
            >
              <Upload className="w-5 h-5" />
              <span>Import Recipe</span>
            </button>
            <button
              onClick={() => navigate('/meal-planner')}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Plan Meals</span>
            </button>
            <button
              onClick={() => navigate('/grocery-list')}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>View Grocery List</span>
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>Browse Favorites</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Rated Recipes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Top Rated Recipes
          </h2>
          <button onClick={() => navigate('/recipes')} className="text-primary text-[0.85rem] flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}