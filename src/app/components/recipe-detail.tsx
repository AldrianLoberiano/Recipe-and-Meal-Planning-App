import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppStore } from '../store';
import { CATEGORIES, Ingredient } from '../data';
import {
  ArrowLeft, Heart, Star, Clock, Users, Flame, Edit, Trash2,
  ChefHat, Printer, Share2, Minus, Plus, RotateCcw,
  Play, Pause, SkipBack, SkipForward, TimerReset
} from 'lucide-react';
import { RecipeShareModal } from './recipe-share-modal';

// Parse fraction strings like "1/2", "1 1/2", "1.5" into numbers
function parseFraction(str: string): number {
  const trimmed = str.trim();
  if (!trimmed) return 0;

  // Handle mixed fractions like "1 1/2"
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    return parseInt(mixedMatch[1]) + parseInt(mixedMatch[2]) / parseInt(mixedMatch[3]);
  }

  // Handle simple fractions like "1/2"
  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    return parseInt(fractionMatch[1]) / parseInt(fractionMatch[2]);
  }

  // Handle decimals and integers
  const num = parseFloat(trimmed);
  return isNaN(num) ? 0 : num;
}

// Convert a decimal back to a nice fraction string
function formatAmount(num: number): string {
  if (num === 0) return '0';
  if (Number.isInteger(num)) return num.toString();

  // Common fractions
  const fractions: [number, string][] = [
    [0.125, '1/8'],
    [0.25, '1/4'],
    [0.333, '1/3'],
    [0.375, '3/8'],
    [0.5, '1/2'],
    [0.625, '5/8'],
    [0.667, '2/3'],
    [0.75, '3/4'],
    [0.875, '7/8'],
  ];

  const whole = Math.floor(num);
  const decimal = num - whole;

  if (decimal < 0.05) return whole.toString();

  // Find closest fraction
  let closestFrac = '';
  let closestDiff = Infinity;
  for (const [val, str] of fractions) {
    const diff = Math.abs(decimal - val);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestFrac = str;
    }
  }

  if (closestDiff < 0.05) {
    return whole > 0 ? `${whole} ${closestFrac}` : closestFrac;
  }

  // Fall back to decimal with 1 decimal place
  return Number(num.toFixed(1)).toString();
}

function scaleIngredient(ingredient: Ingredient, scaleFactor: number): Ingredient {
  const originalAmount = parseFraction(ingredient.amount);
  const scaledAmount = originalAmount * scaleFactor;
  return {
    ...ingredient,
    amount: formatAmount(scaledAmount),
  };
}

export function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, toggleFavorite, rateRecipe, deleteRecipe } = useAppStore();
  const recipe = recipes.find(r => r.id === id);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [scaledServings, setScaledServings] = useState<number | null>(null);
  const [isStepMode, setIsStepMode] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const activeServings = scaledServings ?? recipe?.servings ?? 1;
  const scaleFactor = recipe ? activeServings / recipe.servings : 1;
  const isScaled = scaledServings !== null && recipe && scaledServings !== recipe.servings;

  const scaledIngredients = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map(ing => scaleIngredient(ing, scaleFactor));
  }, [recipe, scaleFactor]);

  const scaledNutrition = useMemo(() => {
    if (!recipe) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    // Nutrition is per serving, so it stays the same per serving
    // But total changes. We show per-serving still, unchanged.
    // Actually, the user might expect total nutrition to scale. Let's keep per-serving the same.
    return recipe.nutrition;
  }, [recipe]);

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (!recipe) return;
    const suggestedStepMinutes = Math.max(1, Math.round(recipe.cookTime / Math.max(recipe.instructions.length, 1)));
    setTimerMinutes(suggestedStepMinutes);
    setTimeLeft(suggestedStepMinutes * 60);
  }, [recipe]);

  if (!recipe) {
    return (
      <div className="text-center py-16">
        <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h2>Recipe not found</h2>
        <button onClick={() => navigate('/recipes')} className="mt-4 text-primary hover:underline">
          Back to Recipes
        </button>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.value === recipe.category);
  const totalTime = recipe.prepTime + recipe.cookTime;

  const handleRate = (rating: number) => {
    setUserRating(rating);
    rateRecipe(recipe.id, rating);
  };

  const handleDelete = () => {
    deleteRecipe(recipe.id);
    navigate('/recipes');
  };

  const adjustServings = (delta: number) => {
    const current = scaledServings ?? recipe.servings;
    const next = Math.max(1, current + delta);
    setScaledServings(next);
  };

  const resetServings = () => {
    setScaledServings(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const applyTimerPreset = (minutes: number) => {
    setTimerMinutes(minutes);
    setTimeLeft(minutes * 60);
    setIsTimerRunning(false);
  };

  const goToStep = (nextStep: number) => {
    const bounded = Math.min(Math.max(nextStep, 0), recipe.instructions.length - 1);
    setActiveStep(bounded);
    setIsTimerRunning(false);
    setTimeLeft(timerMinutes * 60);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => setShowShareModal(true)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          title="Share recipe"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <Edit className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => toggleFavorite(recipe.id)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[0.8rem] mb-2">
            {category?.emoji} {category?.label}
          </span>
          <h1 className="text-white mb-2">{recipe.title}</h1>
          <p className="text-white/80 text-[0.9rem]">{recipe.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Clock, label: 'Prep Time', value: `${recipe.prepTime} min` },
          { icon: Flame, label: 'Cook Time', value: `${recipe.cookTime} min` },
          { icon: Clock, label: 'Total Time', value: `${totalTime} min` },
          { icon: Users, label: 'Servings', value: `${recipe.servings}` },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-4 text-center">
            <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-[0.75rem] text-muted-foreground">{stat.label}</p>
            <p className="text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Nutrition */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="mb-4">Nutrition per Serving</h2>
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Calories', value: recipe.nutrition.calories, unit: 'kcal', color: 'text-orange-500' },
            { label: 'Protein', value: recipe.nutrition.protein, unit: 'g', color: 'text-blue-500' },
            { label: 'Carbs', value: recipe.nutrition.carbs, unit: 'g', color: 'text-green-500' },
            { label: 'Fat', value: recipe.nutrition.fat, unit: 'g', color: 'text-yellow-500' },
            { label: 'Fiber', value: recipe.nutrition.fiber, unit: 'g', color: 'text-purple-500' },
          ].map(n => (
            <div key={n.label} className="text-center">
              <p className={`text-xl ${n.color}`}>{n.value}</p>
              <p className="text-[0.7rem] text-muted-foreground">{n.unit}</p>
              <p className="text-[0.75rem] text-muted-foreground mt-0.5">{n.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Ingredients */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-5 sticky top-20">
            {/* Servings Scaler */}
            <div className="flex items-center justify-between mb-4">
              <h2>Ingredients</h2>
            </div>

            <div className="bg-secondary/50 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between">
                <p className="text-[0.8rem] text-muted-foreground">Adjust servings</p>
                {isScaled && (
                  <button
                    onClick={resetServings}
                    className="text-[0.75rem] text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>
              <div className="flex items-center justify-center gap-3 mt-2">
                <button
                  onClick={() => adjustServings(-1)}
                  disabled={activeServings <= 1}
                  className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-center min-w-[80px]">
                  <p className={`text-2xl ${isScaled ? 'text-primary' : 'text-foreground'}`}>
                    {activeServings}
                  </p>
                  <p className="text-[0.7rem] text-muted-foreground">
                    {activeServings === 1 ? 'serving' : 'servings'}
                  </p>
                </div>
                <button
                  onClick={() => adjustServings(1)}
                  className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {isScaled && (
                <p className="text-[0.7rem] text-primary text-center mt-1.5">
                  Scaled from {recipe.servings} to {activeServings} ({scaleFactor.toFixed(1)}x)
                </p>
              )}
            </div>

            <ul className="space-y-2.5">
              {scaledIngredients.map((ing, i) => {
                const original = recipe.ingredients[i];
                const changed = isScaled && ing.amount !== original.amount;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 ${changed ? 'border-primary bg-primary/10' : 'border-primary/30'} flex-shrink-0 mt-0.5`} />
                    <span className="text-[0.9rem]">
                      <span className={`${changed ? 'text-primary' : 'text-primary'}`}>
                        {ing.amount} {ing.unit}
                      </span>{' '}
                      {ing.name}
                      {changed && (
                        <span className="text-[0.7rem] text-muted-foreground ml-1">
                          (was {original.amount})
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2>Instructions</h2>
              <button
                onClick={() => setIsStepMode(prev => !prev)}
                className={`px-3 py-1.5 rounded-lg text-[0.8rem] border transition-colors ${isStepMode ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
              >
                {isStepMode ? 'Exit Step Mode' : 'Step-by-Step Mode'}
              </button>
            </div>

            {isStepMode ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-[0.75rem] text-muted-foreground mb-1">Step {activeStep + 1} of {recipe.instructions.length}</p>
                  <p className="text-[0.95rem] leading-relaxed">{recipe.instructions[activeStep]}</p>
                </div>

                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="text-[0.8rem] text-muted-foreground">Step timer</p>
                    <div className="flex items-center gap-2">
                      {[3, 5, 10, 15].map(min => (
                        <button
                          key={min}
                          onClick={() => applyTimerPreset(min)}
                          className={`px-2.5 py-1 rounded-md text-[0.75rem] border ${timerMinutes === min ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
                        >
                          {min}m
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className={`text-2xl ${timeLeft === 0 ? 'text-destructive' : 'text-primary'}`}>{formatTime(timeLeft)}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsTimerRunning(prev => !prev)}
                        disabled={timeLeft === 0}
                        className="px-3 py-1.5 rounded-lg border border-border text-[0.8rem] inline-flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isTimerRunning ? 'Pause' : 'Start'}
                      </button>
                      <button
                        onClick={() => {
                          setTimeLeft(timerMinutes * 60);
                          setIsTimerRunning(false);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-border text-[0.8rem] inline-flex items-center gap-1.5"
                      >
                        <TimerReset className="w-3.5 h-3.5" /> Reset
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => goToStep(activeStep - 1)}
                    disabled={activeStep === 0}
                    className="px-3 py-2 rounded-lg border border-border text-[0.85rem] inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <SkipBack className="w-4 h-4" /> Previous
                  </button>
                  <button
                    onClick={() => goToStep(activeStep + 1)}
                    disabled={activeStep >= recipe.instructions.length - 1}
                    className="px-3 py-2 rounded-lg border border-border text-[0.85rem] inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <ol className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-[0.8rem]">
                      {i + 1}
                    </div>
                    <p className="text-[0.9rem] pt-0.5 flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="mb-1">Rate this Recipe</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-foreground">{recipe.rating}</span>
              </div>
              <span className="text-muted-foreground text-[0.85rem]">({recipe.ratingCount} ratings)</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star className={`w-7 h-7 ${(hoverRating || userRating) >= star ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <h2 className="mb-2">Delete Recipe?</h2>
            <p className="text-muted-foreground text-[0.9rem] mb-6">This will permanently delete "{recipe.title}" and remove it from any meal plans.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <RecipeShareModal recipe={recipe} onClose={() => setShowShareModal(false)} />
      )}
    </div>
  );
}
