import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useAppStore } from '../store';
import { DAYS_OF_WEEK, MEAL_SLOTS, CATEGORIES, Recipe } from '../data';
import {
  Calendar, Plus, X, Trash2, ShoppingCart, RotateCcw,
  ChefHat, Search, GripVertical, ArrowRightLeft, Smartphone, BookOpen,
  Flame, Beef, Wheat, Droplets, Leaf
} from 'lucide-react';
import { toast } from 'sonner';
import { MealTemplatesModal } from './meal-templates';

const DRAG_TYPE = 'MEAL_ITEM';

function useIsTouchDevice() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);
}

interface DragItem {
  day: string;
  slot: string;
  recipeId: string;
}

function DraggableMealCard({
  recipe,
  day,
  slot,
  onRemove,
  onNavigate,
}: {
  recipe: Recipe;
  day: string;
  slot: string;
  onRemove: () => void;
  onNavigate: () => void;
}) {
  const [{ isDragging }, dragRef] = useDrag({
    type: DRAG_TYPE,
    item: { day, slot, recipeId: recipe.id } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef as any}
      className={`group relative bg-secondary/50 rounded-lg p-2 flex items-center gap-2 min-h-[52px] cursor-grab active:cursor-grabbing transition-all ${
        isDragging ? 'opacity-30 scale-95 ring-2 ring-primary/30' : ''
      }`}
    >
      <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0 group-hover:text-muted-foreground transition-colors" />
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-10 h-10 rounded-md object-cover flex-shrink-0 cursor-pointer"
        onClick={onNavigate}
      />
      <p className="text-[0.8rem] line-clamp-2 flex-1 cursor-pointer" onClick={onNavigate}>
        {recipe.title}
      </p>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

function DroppableMealSlot({
  day,
  slot,
  recipe,
  onAddClick,
  onRemove,
  onNavigate,
  onDrop,
}: {
  day: string;
  slot: string;
  recipe: Recipe | null;
  onAddClick: () => void;
  onRemove: () => void;
  onNavigate: () => void;
  onDrop: (item: DragItem) => void;
}) {
  const cat = CATEGORIES.find(c => c.value === slot);

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: DRAG_TYPE,
    drop: (item: DragItem) => {
      onDrop(item);
    },
    canDrop: (item: DragItem) => {
      // Don't allow dropping on the same slot
      return !(item.day === day && item.slot === slot);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const dropHighlight = isOver && canDrop
    ? 'ring-2 ring-primary/50 bg-primary/5 scale-[1.02]'
    : canDrop
    ? 'ring-1 ring-primary/20'
    : '';

  return (
    <div ref={dropRef as any} className={`relative transition-all duration-200 rounded-lg ${dropHighlight}`}>
      <p className="text-[0.7rem] text-muted-foreground uppercase tracking-wide mb-1 pl-1">
        {cat?.emoji} {cat?.label}
      </p>

      {recipe ? (
        <DraggableMealCard
          recipe={recipe}
          day={day}
          slot={slot}
          onRemove={onRemove}
          onNavigate={onNavigate}
        />
      ) : (
        <button
          onClick={onAddClick}
          className={`w-full min-h-[52px] rounded-lg border border-dashed ${
            isOver && canDrop ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50 text-muted-foreground hover:text-primary'
          } flex items-center justify-center gap-1.5 transition-colors text-[0.8rem]`}
        >
          {isOver && canDrop ? (
            <>
              <ArrowRightLeft className="w-3.5 h-3.5" /> Drop here
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" /> Add
            </>
          )}
        </button>
      )}
    </div>
  );
}

function MealPlannerContent() {
  const { recipes, mealPlan, setMealForDay, moveMeal, clearMealPlan, generateGroceryList, addNotification } = useAppStore();
  const navigate = useNavigate();
  const [showRecipePicker, setShowRecipePicker] = useState<{ day: string; slot: string } | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const today = DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  const handleGenerateGrocery = () => {
    generateGroceryList();
    addNotification('Grocery list has been generated from your meal plan!');
    navigate('/grocery-list');
  };

  const handleSelectRecipe = (recipeId: string) => {
    if (showRecipePicker) {
      setMealForDay(showRecipePicker.day, showRecipePicker.slot, recipeId);
      setShowRecipePicker(null);
      setPickerSearch('');
    }
  };

  const handleDrop = useCallback((targetDay: string, targetSlot: string, item: DragItem) => {
    if (item.day === targetDay && item.slot === targetSlot) return;
    moveMeal(item.day, item.slot, targetDay, targetSlot);
    toast.success(`Moved meal to ${targetDay} ${targetSlot}`, { duration: 2000 });
  }, [moveMeal]);

  const filteredPickerRecipes = recipes.filter(r => {
    if (!showRecipePicker) return false;
    const matchesSearch = !pickerSearch || r.title.toLowerCase().includes(pickerSearch.toLowerCase());
    const matchesCategory = r.category === showRecipePicker.slot;
    return matchesSearch && matchesCategory;
  });

  const totalMeals = Object.values(mealPlan).reduce((c, d) => c + Object.keys(d).length, 0);

  const weeklyNutrition = useMemo(() => {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, meals: 0 };

    for (const day of DAYS_OF_WEEK) {
      const dayPlan = mealPlan[day] || {};
      for (const slot of MEAL_SLOTS) {
        const recipeId = (dayPlan as any)[slot] as string | undefined;
        if (!recipeId) continue;
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) continue;

        totals.calories += recipe.nutrition.calories;
        totals.protein += recipe.nutrition.protein;
        totals.carbs += recipe.nutrition.carbs;
        totals.fat += recipe.nutrition.fat;
        totals.fiber += recipe.nutrition.fiber;
        totals.meals += 1;
      }
    }

    return {
      ...totals,
      avgDailyCalories: Math.round(totals.calories / 7),
      avgDailyProtein: Math.round((totals.protein / 7) * 10) / 10,
      avgDailyCarbs: Math.round((totals.carbs / 7) * 10) / 10,
      avgDailyFat: Math.round((totals.fat / 7) * 10) / 10,
      avgDailyFiber: Math.round((totals.fiber / 7) * 10) / 10,
    };
  }, [mealPlan, recipes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            Weekly Meal Planner
          </h1>
          <p className="text-muted-foreground">
            {totalMeals} meals planned this week
            <span className="text-[0.75rem] ml-2 text-primary/60">
              &middot; Includes drinks, desserts, and fruits
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTemplates(true)}
            className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors inline-flex items-center gap-2 text-[0.85rem]"
          >
            <BookOpen className="w-4 h-4" /> Templates
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors inline-flex items-center gap-2 text-[0.85rem]"
          >
            <RotateCcw className="w-4 h-4" /> Clear
          </button>
          <button
            onClick={handleGenerateGrocery}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition inline-flex items-center gap-2 text-[0.85rem]"
          >
            <ShoppingCart className="w-4 h-4" /> Generate Grocery List
          </button>
        </div>
      </div>

      {/* Weekly Nutrition Summary */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary" /> Nutritional Summary
          </h2>
          <p className="text-[0.8rem] text-muted-foreground">Weekly totals and daily averages</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          <div className="bg-secondary/40 rounded-lg p-3">
            <p className="text-[0.75rem] text-muted-foreground">Calories</p>
            <p className="text-xl text-orange-500">{weeklyNutrition.calories}</p>
            <p className="text-[0.7rem] text-muted-foreground">{weeklyNutrition.avgDailyCalories}/day</p>
          </div>
          <div className="bg-secondary/40 rounded-lg p-3">
            <p className="text-[0.75rem] text-muted-foreground inline-flex items-center gap-1"><Beef className="w-3.5 h-3.5" />Protein</p>
            <p className="text-xl text-blue-500">{weeklyNutrition.protein}g</p>
            <p className="text-[0.7rem] text-muted-foreground">{weeklyNutrition.avgDailyProtein}g/day</p>
          </div>
          <div className="bg-secondary/40 rounded-lg p-3">
            <p className="text-[0.75rem] text-muted-foreground inline-flex items-center gap-1"><Wheat className="w-3.5 h-3.5" />Carbs</p>
            <p className="text-xl text-green-600">{weeklyNutrition.carbs}g</p>
            <p className="text-[0.7rem] text-muted-foreground">{weeklyNutrition.avgDailyCarbs}g/day</p>
          </div>
          <div className="bg-secondary/40 rounded-lg p-3">
            <p className="text-[0.75rem] text-muted-foreground inline-flex items-center gap-1"><Droplets className="w-3.5 h-3.5" />Fat</p>
            <p className="text-xl text-yellow-500">{weeklyNutrition.fat}g</p>
            <p className="text-[0.7rem] text-muted-foreground">{weeklyNutrition.avgDailyFat}g/day</p>
          </div>
          <div className="bg-secondary/40 rounded-lg p-3">
            <p className="text-[0.75rem] text-muted-foreground inline-flex items-center gap-1"><Leaf className="w-3.5 h-3.5" />Fiber</p>
            <p className="text-xl text-emerald-600">{weeklyNutrition.fiber}g</p>
            <p className="text-[0.7rem] text-muted-foreground">{weeklyNutrition.avgDailyFiber}g/day</p>
          </div>
        </div>

        <p className="text-[0.8rem] text-muted-foreground">Planned meals counted: {weeklyNutrition.meals}</p>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-3">
        {DAYS_OF_WEEK.map(day => {
          const dayPlan = mealPlan[day] || {};
          const isToday = day === today;

          return (
            <div
              key={day}
              className={`bg-card rounded-xl border ${isToday ? 'border-primary/30 ring-1 ring-primary/10' : 'border-border'} overflow-hidden`}
            >
              <div className={`px-4 py-3 flex items-center justify-between ${isToday ? 'bg-primary/5' : 'bg-secondary/30'}`}>
                <div className="flex items-center gap-2">
                  <span className={isToday ? 'text-primary' : ''}>{day}</span>
                  {isToday && (
                    <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-[0.65rem] uppercase tracking-wider">Today</span>
                  )}
                </div>
                <span className="text-muted-foreground text-[0.8rem]">
                  {Object.keys(dayPlan).length} meals
                </span>
              </div>

              <div className="p-3 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-2">
                {MEAL_SLOTS.map(slot => {
                  const recipeId = (dayPlan as any)[slot];
                  const recipe = recipeId ? recipes.find(r => r.id === recipeId) : null;

                  return (
                    <DroppableMealSlot
                      key={slot}
                      day={day}
                      slot={slot}
                      recipe={recipe || null}
                      onAddClick={() => { setShowRecipePicker({ day, slot }); setPickerSearch(''); }}
                      onRemove={() => setMealForDay(day, slot, undefined)}
                      onNavigate={() => recipe && navigate(`/recipes/${recipe.id}`)}
                      onDrop={(item) => handleDrop(day, slot, item)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recipe Picker Modal */}
      {showRecipePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowRecipePicker(null)}>
          <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h2>Select Recipe</h2>
                <button onClick={() => setShowRecipePicker(null)} className="p-1 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-muted-foreground text-[0.85rem] mb-3">
                {showRecipePicker.day} - {CATEGORIES.find(c => c.value === showRecipePicker.slot)?.label}
              </p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  placeholder="Search recipes..."
                  className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredPickerRecipes.length === 0 ? (
                <div className="text-center py-8">
                  <ChefHat className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No recipes found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredPickerRecipes.map(recipe => {
                    const cat = CATEGORIES.find(c => c.value === recipe.category);
                    return (
                      <button
                        key={recipe.id}
                        onClick={() => handleSelectRecipe(recipe.id)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary transition-colors text-left"
                      >
                        <img src={recipe.image} alt={recipe.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[0.9rem]">{recipe.title}</p>
                          <p className="text-muted-foreground text-[0.75rem]">{cat?.emoji} {cat?.label} &middot; {recipe.prepTime + recipe.cookTime} min</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowClearConfirm(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h2 className="mb-2">Clear Meal Plan?</h2>
            <p className="text-muted-foreground text-[0.9rem] mb-6">This will remove all planned meals for the week.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowClearConfirm(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors">
                Cancel
              </button>
              <button onClick={() => { clearMealPlan(); setShowClearConfirm(false); }} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition">
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meal Templates Modal */}
      {showTemplates && (
        <MealTemplatesModal onClose={() => setShowTemplates(false)} />
      )}
    </div>
  );
}

export function MealPlanner() {
  const isTouchDevice = useIsTouchDevice();
  return (
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      <MealPlannerContent />
    </DndProvider>
  );
}