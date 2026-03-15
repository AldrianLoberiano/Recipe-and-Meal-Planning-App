import React, { useState } from 'react';
import { useAppStore } from '../store';
import { MealPlan, defaultRecipes } from '../data';
import {
  X, Dumbbell, Leaf, Zap, Scale, Check, AlertTriangle, BookOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface MealTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  tags: string[];
  plan: MealPlan;
}

// Recipe IDs from defaultRecipes:
// 1: Avocado Toast (breakfast)
// 2: Grilled Chicken Caesar (lunch)
// 3: Creamy Garlic Tuscan Pasta (dinner)
// 4: Berry Protein Smoothie (snack)
// 5: Teriyaki Glazed Salmon (dinner)
// 6: Fluffy Buttermilk Pancakes (breakfast)
// 7: Mediterranean Quinoa Bowl (lunch)
// 8: Chocolate Peanut Butter Energy Bites (snack)

const templates: MealTemplate[] = [
  {
    id: 'high-protein',
    name: 'High Protein Week',
    description: 'Packed with protein-rich meals to fuel workouts and build muscle. Features chicken, salmon, eggs, and Greek yogurt-based recipes.',
    icon: Dumbbell,
    color: 'bg-blue-500/10 text-blue-600',
    tags: ['Fitness', 'Muscle Building', '140g+ protein/day'],
    plan: {
      Monday: { breakfast: '1', lunch: '2', dinner: '5', snack: '4' },
      Tuesday: { breakfast: '1', lunch: '2', dinner: '5', snack: '8' },
      Wednesday: { breakfast: '1', lunch: '7', dinner: '5', snack: '4' },
      Thursday: { breakfast: '1', lunch: '2', dinner: '5', snack: '4' },
      Friday: { breakfast: '1', lunch: '2', dinner: '5', snack: '8' },
      Saturday: { breakfast: '6', lunch: '2', dinner: '5', snack: '4' },
      Sunday: { breakfast: '6', lunch: '7', dinner: '5', snack: '4' },
    },
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian Plan',
    description: 'A wholesome plant-forward week filled with Mediterranean quinoa bowls, creamy pasta, protein smoothies, and avocado toast.',
    icon: Leaf,
    color: 'bg-green-500/10 text-green-600',
    tags: ['Plant-based', 'Sustainable', 'Nutrient-rich'],
    plan: {
      Monday: { breakfast: '1', lunch: '7', dinner: '3', snack: '4' },
      Tuesday: { breakfast: '6', lunch: '7', dinner: '3', snack: '8' },
      Wednesday: { breakfast: '1', lunch: '7', dinner: '3', snack: '4' },
      Thursday: { breakfast: '6', lunch: '7', dinner: '3', snack: '8' },
      Friday: { breakfast: '1', lunch: '7', dinner: '3', snack: '4' },
      Saturday: { breakfast: '6', lunch: '7', dinner: '3', snack: '8' },
      Sunday: { breakfast: '1', lunch: '7', dinner: '3', snack: '4' },
    },
  },
  {
    id: 'quick-easy',
    name: 'Quick & Easy',
    description: 'All meals take 30 minutes or less to prepare. Perfect for busy weekdays when you need fast, delicious meals without the fuss.',
    icon: Zap,
    color: 'bg-amber-500/10 text-amber-600',
    tags: ['Under 30 min', 'Weekday-friendly', 'Minimal prep'],
    plan: {
      Monday: { breakfast: '1', lunch: '2', dinner: '3', snack: '4' },
      Tuesday: { breakfast: '6', lunch: '7', dinner: '5' },
      Wednesday: { breakfast: '1', snack: '8', dinner: '3' },
      Thursday: { breakfast: '6', lunch: '2', dinner: '5', snack: '4' },
      Friday: { breakfast: '1', lunch: '7', dinner: '3' },
      Saturday: { breakfast: '6', lunch: '2', dinner: '5', snack: '8' },
      Sunday: { breakfast: '1', lunch: '7', dinner: '3', snack: '4' },
    },
  },
  {
    id: 'balanced',
    name: 'Balanced Week',
    description: 'A well-rounded plan with variety across all food groups. Different meals each day to keep things interesting while maintaining nutritional balance.',
    icon: Scale,
    color: 'bg-purple-500/10 text-purple-600',
    tags: ['Balanced macros', 'Variety', 'Well-rounded'],
    plan: {
      Monday: { breakfast: '1', lunch: '2', dinner: '3', snack: '4' },
      Tuesday: { breakfast: '6', lunch: '7', dinner: '5', snack: '8' },
      Wednesday: { breakfast: '1', lunch: '2', dinner: '5', snack: '4' },
      Thursday: { breakfast: '6', lunch: '7', dinner: '3', snack: '8' },
      Friday: { breakfast: '1', lunch: '2', dinner: '5', snack: '4' },
      Saturday: { breakfast: '6', lunch: '7', dinner: '3', snack: '8' },
      Sunday: { breakfast: '1', lunch: '2', dinner: '5', snack: '4' },
    },
  },
];

interface MealTemplatesModalProps {
  onClose: () => void;
}

export function MealTemplatesModal({ onClose }: MealTemplatesModalProps) {
  const { recipes, mealPlan, setMealForDay, clearMealPlan } = useAppStore();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const hasExistingMeals = Object.values(mealPlan).some(
    day => Object.keys(day).length > 0
  );

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (hasExistingMeals) {
      setShowConfirm(true);
    } else {
      applyTemplate(templateId);
    }
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    // Verify all recipe IDs in the template exist
    const allRecipeIds = new Set(recipes.map(r => r.id));
    const plan = { ...template.plan };

    for (const day of Object.keys(plan)) {
      const dayPlan = { ...plan[day] };
      for (const slot of Object.keys(dayPlan)) {
        const recipeId = (dayPlan as any)[slot];
        if (!allRecipeIds.has(recipeId)) {
          delete (dayPlan as any)[slot];
        }
      }
      plan[day] = dayPlan;
    }

    // Clear existing plan then apply template
    clearMealPlan();
    setTimeout(() => {
      for (const day of Object.keys(plan)) {
        const dayPlan = plan[day];
        for (const slot of Object.keys(dayPlan)) {
          const recipeId = (dayPlan as any)[slot];
          if (recipeId) {
            setMealForDay(day, slot, recipeId);
          }
        }
      }
    }, 50);

    toast.success(`"${template.name}" template applied!`);
    setShowConfirm(false);
    onClose();
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  // Count meals in a template
  const countMeals = (plan: MealPlan) =>
    Object.values(plan).reduce((count, day) => count + Object.keys(day).length, 0);

  // Calculate estimated avg daily nutrition for a template
  const calcAvgNutrition = (plan: MealPlan) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let days = 0;

    for (const day of Object.keys(plan)) {
      const dayPlan = plan[day];
      let dayCals = 0;
      let dayProtein = 0;
      for (const slot of Object.keys(dayPlan)) {
        const recipeId = (dayPlan as any)[slot];
        const recipe = defaultRecipes.find(r => r.id === recipeId);
        if (recipe) {
          dayCals += recipe.nutrition.calories;
          dayProtein += recipe.nutrition.protein;
        }
      }
      if (dayCals > 0) {
        totalCalories += dayCals;
        totalProtein += dayProtein;
        days++;
      }
    }

    return {
      avgCalories: days > 0 ? Math.round(totalCalories / days) : 0,
      avgProtein: days > 0 ? Math.round(totalProtein / days) : 0,
    };
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Meal Plan Templates
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-muted-foreground text-[0.85rem]">
            Choose a pre-built meal plan to fill your entire week instantly.
          </p>
        </div>

        {/* Template List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {templates.map(template => {
            const nutrition = calcAvgNutrition(template.plan);
            const mealCount = countMeals(template.plan);

            return (
              <div
                key={template.id}
                className="bg-secondary/30 rounded-xl border border-border hover:border-primary/30 transition-colors p-4 cursor-pointer group"
                onClick={() => handleSelect(template.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${template.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <template.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-foreground group-hover:text-primary transition-colors">{template.name}</h3>
                      <span className="text-[0.75rem] text-muted-foreground">{mealCount} meals</span>
                    </div>
                    <p className="text-muted-foreground text-[0.85rem] mb-3">{template.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {template.tags.map(tag => (
                        <span key={tag} className="bg-secondary text-muted-foreground px-2 py-0.5 rounded-full text-[0.7rem]">
                          {tag}
                        </span>
                      ))}
                      <span className="text-[0.75rem] text-muted-foreground ml-auto">
                        ~{nutrition.avgCalories} cal/day &middot; ~{nutrition.avgProtein}g protein/day
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirm Dialog */}
        {showConfirm && selectedTemplateData && (
          <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center p-6">
            <div className="bg-card rounded-xl border border-border p-6 max-w-sm w-full shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h3>Replace Current Plan?</h3>
              </div>
              <p className="text-muted-foreground text-[0.9rem] mb-5">
                You have existing meals planned. Applying the "{selectedTemplateData.name}" template will replace your current meal plan.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setShowConfirm(false); setSelectedTemplate(null); }}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedTemplate && applyTemplate(selectedTemplate)}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition inline-flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Apply Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}