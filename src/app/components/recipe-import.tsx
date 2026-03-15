import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../store';
import { Recipe } from '../data';
import {
  Upload, FileText, ArrowLeft, Sparkles, ChefHat,
  Clock, Users, AlertCircle, Check, X, Clipboard, ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface ParsedRecipe {
  title: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  nutrition: { calories: number; protein: number; carbs: number; fat: number; fiber: number };
  image: string;
}

function parseRecipeText(text: string): ParsedRecipe {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract title (first non-empty line)
  const title = lines[0]?.replace(/^#+\s*/, '').replace(/^recipe:\s*/i, '').trim() || 'Imported Recipe';

  // Try to find a description
  let description = '';
  if (lines[1] && !lines[1].match(/^[-*•]\s/) && !lines[1].match(/^\d+[\.\)]/)) {
    description = lines[1];
  }

  // Parse ingredients
  const ingredients: { name: string; amount: string; unit: string }[] = [];
  const ingredientStartPatterns = [/ingredients/i, /what you'll need/i, /you will need/i];
  const instructionStartPatterns = [/instructions/i, /directions/i, /method/i, /steps/i, /how to make/i, /preparation/i];

  let inIngredients = false;
  let inInstructions = false;
  const instructions: string[] = [];

  const commonUnits = ['cup', 'cups', 'tbsp', 'tsp', 'tablespoon', 'tablespoons', 'teaspoon', 'teaspoons',
    'oz', 'ounce', 'ounces', 'lb', 'lbs', 'pound', 'pounds', 'g', 'gram', 'grams', 'kg',
    'ml', 'liter', 'liters', 'piece', 'pieces', 'whole', 'clove', 'cloves', 'can', 'cans',
    'medium', 'large', 'small', 'bunch', 'head', 'stalk', 'stalks', 'slice', 'slices',
    'pinch', 'dash', 'handful', 'package', 'pkg', 'bag'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (ingredientStartPatterns.some(p => p.test(line))) {
      inIngredients = true;
      inInstructions = false;
      continue;
    }
    if (instructionStartPatterns.some(p => p.test(line))) {
      inIngredients = false;
      inInstructions = true;
      continue;
    }

    if (inIngredients) {
      const cleaned = line.replace(/^[-*•]\s*/, '').replace(/^\d+[\.\)]\s*/, '').trim();
      if (!cleaned) continue;

      // Try to extract amount and unit
      const amountMatch = cleaned.match(/^([\d\/\.\s]+(?:\/\d+)?)\s*/);
      if (amountMatch) {
        const amount = amountMatch[1].trim();
        const rest = cleaned.slice(amountMatch[0].length);

        // Try to find unit
        const unitMatch = rest.match(new RegExp(`^(${commonUnits.join('|')})\\b\\s*`, 'i'));
        if (unitMatch) {
          const unit = unitMatch[1].toLowerCase();
          const name = rest.slice(unitMatch[0].length).replace(/^(of\s+)/i, '').trim();
          ingredients.push({ name: name || rest, amount, unit });
        } else {
          ingredients.push({ name: rest.trim(), amount, unit: 'whole' });
        }
      } else {
        ingredients.push({ name: cleaned, amount: '1', unit: 'whole' });
      }
    }

    if (inInstructions) {
      const cleaned = line
        .replace(/^[-*•]\s*/, '')
        .replace(/^\d+[\.\)]\s*/, '')
        .replace(/^step\s*\d+[:\.\)]\s*/i, '')
        .trim();
      if (cleaned && cleaned.length > 5) {
        instructions.push(cleaned);
      }
    }
  }

  // If we couldn't find sections, try to auto-detect ingredients (lines starting with - or *)
  if (ingredients.length === 0) {
    for (const line of lines) {
      const match = line.match(/^[-*•]\s*([\d\/\.\s]+)?\s*(.*)/);
      if (match) {
        const amount = match[1]?.trim() || '1';
        const rest = match[2] || '';
        const unitMatch = rest.match(new RegExp(`^(${commonUnits.join('|')})\\b\\s*`, 'i'));
        if (unitMatch) {
          ingredients.push({
            name: rest.slice(unitMatch[0].length).replace(/^(of\s+)/i, '').trim() || rest,
            amount,
            unit: unitMatch[1].toLowerCase(),
          });
        } else {
          ingredients.push({ name: rest.trim(), amount, unit: 'whole' });
        }
      }
    }
  }

  // If still no instructions, get numbered lines
  if (instructions.length === 0) {
    for (const line of lines) {
      const match = line.match(/^\d+[\.\)]\s*(.+)/);
      if (match && match[1].length > 10) {
        instructions.push(match[1].trim());
      }
    }
  }

  // Provide defaults
  if (ingredients.length === 0) {
    ingredients.push({ name: 'Add your ingredients', amount: '1', unit: 'whole' });
  }
  if (instructions.length === 0) {
    instructions.push('Add your cooking instructions here.');
  }

  // Try to detect category from keywords
  let category: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'dinner';
  const lowerText = text.toLowerCase();
  if (/breakfast|pancake|waffle|omelette|scramble|cereal|toast|smoothie|morning/i.test(lowerText)) {
    category = 'breakfast';
  } else if (/lunch|salad|sandwich|wrap|soup|bowl/i.test(lowerText)) {
    category = 'lunch';
  } else if (/snack|energy|bite|bar|dip|trail|cookie|chip/i.test(lowerText)) {
    category = 'snack';
  }

  // Parse time hints
  let prepTime = 15;
  let cookTime = 20;
  const prepMatch = text.match(/prep\s*(?:time)?[:\s]*(\d+)\s*min/i);
  const cookMatch = text.match(/cook\s*(?:time)?[:\s]*(\d+)\s*min/i);
  if (prepMatch) prepTime = parseInt(prepMatch[1]);
  if (cookMatch) cookTime = parseInt(cookMatch[1]);

  // Parse servings
  let servings = 4;
  const servingsMatch = text.match(/serves?\s*(?::\s*)?(\d+)/i) || text.match(/servings?\s*(?::\s*)?(\d+)/i) || text.match(/(\d+)\s*servings?/i);
  if (servingsMatch) servings = parseInt(servingsMatch[1]);

  return {
    title,
    description: description || `A delicious ${category} recipe.`,
    category,
    prepTime,
    cookTime,
    servings,
    ingredients,
    instructions,
    nutrition: { calories: 350, protein: 15, carbs: 40, fat: 12, fiber: 5 },
    image: '',
  };
}

const SAMPLE_RECIPE = `Classic Spaghetti Bolognese
A hearty Italian meat sauce served over al dente spaghetti.

Prep time: 15 min
Cook time: 45 min
Serves: 6

Ingredients:
- 1 lb ground beef
- 1 medium onion, diced
- 3 cloves garlic, minced
- 1 can crushed tomatoes
- 2 tbsp tomato paste
- 1 tsp Italian seasoning
- 1/2 tsp salt
- 1/4 tsp black pepper
- 1 lb spaghetti
- 2 tbsp olive oil
- 1/4 cup Parmesan cheese

Instructions:
1. Cook spaghetti according to package directions. Drain and set aside.
2. Heat olive oil in a large skillet over medium-high heat.
3. Add ground beef and cook until browned, breaking it apart, about 5-7 minutes.
4. Add diced onion and garlic, cook for 3 minutes until softened.
5. Stir in crushed tomatoes, tomato paste, Italian seasoning, salt, and pepper.
6. Reduce heat to low and simmer for 30 minutes, stirring occasionally.
7. Serve sauce over spaghetti and top with grated Parmesan cheese.`;

export function RecipeImport() {
  const navigate = useNavigate();
  const { addRecipe } = useAppStore();
  const [rawText, setRawText] = useState('');
  const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleParse = () => {
    if (!rawText.trim()) {
      toast.error('Please paste a recipe first');
      return;
    }
    const parsed = parseRecipeText(rawText);
    setParsedRecipe(parsed);
    setIsEditing(true);
    toast.success('Recipe parsed! Review and edit the details below.');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setRawText(text);
      toast.success('Pasted from clipboard!');
    } catch {
      toast.error('Unable to read clipboard. Please paste manually.');
    }
  };

  const handleUseSample = () => {
    setRawText(SAMPLE_RECIPE);
    toast.success('Sample recipe loaded!');
  };

  const handleSave = () => {
    if (!parsedRecipe) return;

    addRecipe({
      title: parsedRecipe.title,
      description: parsedRecipe.description,
      category: parsedRecipe.category,
      image: parsedRecipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800',
      prepTime: parsedRecipe.prepTime,
      cookTime: parsedRecipe.cookTime,
      servings: parsedRecipe.servings,
      ingredients: parsedRecipe.ingredients,
      instructions: parsedRecipe.instructions,
      nutrition: parsedRecipe.nutrition,
    });

    toast.success('Recipe imported successfully!');
    navigate('/recipes');
  };

  const updateField = (field: keyof ParsedRecipe, value: any) => {
    if (!parsedRecipe) return;
    setParsedRecipe({ ...parsedRecipe, [field]: value });
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    if (!parsedRecipe) return;
    const updated = [...parsedRecipe.ingredients];
    (updated[index] as any)[field] = value;
    setParsedRecipe({ ...parsedRecipe, ingredients: updated });
  };

  const removeIngredient = (index: number) => {
    if (!parsedRecipe) return;
    setParsedRecipe({ ...parsedRecipe, ingredients: parsedRecipe.ingredients.filter((_, i) => i !== index) });
  };

  const addIngredient = () => {
    if (!parsedRecipe) return;
    setParsedRecipe({ ...parsedRecipe, ingredients: [...parsedRecipe.ingredients, { name: '', amount: '1', unit: 'whole' }] });
  };

  const updateInstruction = (index: number, value: string) => {
    if (!parsedRecipe) return;
    const updated = [...parsedRecipe.instructions];
    updated[index] = value;
    setParsedRecipe({ ...parsedRecipe, instructions: updated });
  };

  const removeInstruction = (index: number) => {
    if (!parsedRecipe) return;
    setParsedRecipe({ ...parsedRecipe, instructions: parsedRecipe.instructions.filter((_, i) => i !== index) });
  };

  const addInstruction = () => {
    if (!parsedRecipe) return;
    setParsedRecipe({ ...parsedRecipe, instructions: [...parsedRecipe.instructions, ''] });
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!parsedRecipe) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('image', reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="flex items-center gap-2">
            <Upload className="w-6 h-6 text-primary" />
            Import Recipe
          </h1>
          <p className="text-muted-foreground text-[0.85rem]">Paste recipe text and we'll parse it for you</p>
        </div>
      </div>

      {!isEditing ? (
        <>
          {/* Input Area */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recipe Text
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 text-[0.8rem]"
                >
                  <Clipboard className="w-3.5 h-3.5" /> Paste
                </button>
                <button
                  onClick={handleUseSample}
                  className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors inline-flex items-center gap-1.5 text-[0.8rem]"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Use Sample
                </button>
              </div>
            </div>
            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder={`Paste your recipe here...\n\nExample format:\nRecipe Title\nDescription of the recipe.\n\nPrep time: 15 min\nCook time: 30 min\nServes: 4\n\nIngredients:\n- 2 cups flour\n- 1 tsp salt\n- 3 eggs\n\nInstructions:\n1. Mix dry ingredients together.\n2. Add wet ingredients and stir.\n3. Cook and serve.`}
              className="w-full h-64 sm:h-80 bg-input-background rounded-lg border border-border p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-none text-[0.9rem]"
            />
            <div className="flex items-start gap-2 mt-3 text-muted-foreground text-[0.8rem]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>Our parser works best with clearly labeled sections (Ingredients, Instructions) and standard formatting. You can always edit the parsed result.</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleParse}
              disabled={!rawText.trim()}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" /> Parse Recipe
            </button>
          </div>
        </>
      ) : parsedRecipe && (
        <>
          {/* Parsed Result */}
          <div className="bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800 p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 dark:text-green-300 text-[0.9rem]">Recipe parsed successfully!</p>
              <p className="text-green-600 dark:text-green-400 text-[0.8rem]">
                Found {parsedRecipe.ingredients.length} ingredients and {parsedRecipe.instructions.length} steps. Review and edit below.
              </p>
            </div>
            <button
              onClick={() => { setIsEditing(false); setParsedRecipe(null); }}
              className="ml-auto px-3 py-1.5 rounded-lg text-[0.8rem] text-green-700 hover:bg-green-100 transition-colors"
            >
              Start Over
            </button>
          </div>

          {/* Basic Info */}
          <div className="bg-card rounded-xl border border-border p-5 space-y-4">
            <h2 className="mb-2">Basic Information</h2>
            <div>
              <label className="text-[0.85rem] text-muted-foreground block mb-1">Title</label>
              <input
                type="text"
                value={parsedRecipe.title}
                onChange={e => updateField('title', e.target.value)}
                className="w-full bg-input-background rounded-lg border border-border px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              />
            </div>
            <div>
              <label className="text-[0.85rem] text-muted-foreground block mb-1">Description</label>
              <textarea
                value={parsedRecipe.description}
                onChange={e => updateField('description', e.target.value)}
                rows={2}
                className="w-full bg-input-background rounded-lg border border-border px-4 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-none"
              />
            </div>
            <div>
              <label className="text-[0.85rem] text-muted-foreground block mb-1">Image URL</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={parsedRecipe.image}
                    onChange={e => updateField('image', e.target.value)}
                    className="w-full bg-input-background rounded-lg border border-border pl-10 pr-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                    placeholder="https://..."
                  />
                </div>
                <label className="px-3 py-2.5 rounded-lg border border-border text-[0.8rem] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer whitespace-nowrap">
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageFileSelect} />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[0.85rem] text-muted-foreground block mb-1">Category</label>
                <select
                  value={parsedRecipe.category}
                  onChange={e => updateField('category', e.target.value)}
                  className="w-full bg-input-background rounded-lg border border-border px-3 py-2.5 focus:border-primary outline-none transition"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              <div>
                <label className="text-[0.85rem] text-muted-foreground flex items-center gap-1 mb-1"><Clock className="w-3.5 h-3.5" /> Prep (min)</label>
                <input
                  type="number"
                  value={parsedRecipe.prepTime}
                  onChange={e => updateField('prepTime', parseInt(e.target.value) || 0)}
                  className="w-full bg-input-background rounded-lg border border-border px-3 py-2.5 focus:border-primary outline-none transition"
                />
              </div>
              <div>
                <label className="text-[0.85rem] text-muted-foreground flex items-center gap-1 mb-1"><Clock className="w-3.5 h-3.5" /> Cook (min)</label>
                <input
                  type="number"
                  value={parsedRecipe.cookTime}
                  onChange={e => updateField('cookTime', parseInt(e.target.value) || 0)}
                  className="w-full bg-input-background rounded-lg border border-border px-3 py-2.5 focus:border-primary outline-none transition"
                />
              </div>
              <div>
                <label className="text-[0.85rem] text-muted-foreground flex items-center gap-1 mb-1"><Users className="w-3.5 h-3.5" /> Servings</label>
                <input
                  type="number"
                  value={parsedRecipe.servings}
                  onChange={e => updateField('servings', parseInt(e.target.value) || 1)}
                  className="w-full bg-input-background rounded-lg border border-border px-3 py-2.5 focus:border-primary outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2>Ingredients ({parsedRecipe.ingredients.length})</h2>
              <button onClick={addIngredient} className="text-primary text-[0.85rem] hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
              {parsedRecipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={e => updateIngredient(i, 'amount', e.target.value)}
                    className="w-16 bg-input-background rounded-lg border border-border px-2 py-2 text-center focus:border-primary outline-none transition text-[0.85rem]"
                    placeholder="Amt"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={e => updateIngredient(i, 'unit', e.target.value)}
                    className="w-20 bg-input-background rounded-lg border border-border px-2 py-2 focus:border-primary outline-none transition text-[0.85rem]"
                    placeholder="Unit"
                  />
                  <input
                    type="text"
                    value={ing.name}
                    onChange={e => updateIngredient(i, 'name', e.target.value)}
                    className="flex-1 bg-input-background rounded-lg border border-border px-3 py-2 focus:border-primary outline-none transition text-[0.85rem]"
                    placeholder="Ingredient name"
                  />
                  <button
                    onClick={() => removeIngredient(i)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-card rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h2>Instructions ({parsedRecipe.instructions.length} steps)</h2>
              <button onClick={addInstruction} className="text-primary text-[0.85rem] hover:underline">+ Add Step</button>
            </div>
            <div className="space-y-3">
              {parsedRecipe.instructions.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-[0.8rem] mt-1">
                    {i + 1}
                  </div>
                  <textarea
                    value={step}
                    onChange={e => updateInstruction(i, e.target.value)}
                    rows={2}
                    className="flex-1 bg-input-background rounded-lg border border-border px-3 py-2 focus:border-primary outline-none transition resize-none text-[0.85rem]"
                  />
                  <button
                    onClick={() => removeInstruction(i)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors mt-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="mb-4">Nutrition (per serving)</h2>
            <div className="grid grid-cols-5 gap-3">
              {[
                { key: 'calories', label: 'Calories', unit: 'kcal' },
                { key: 'protein', label: 'Protein', unit: 'g' },
                { key: 'carbs', label: 'Carbs', unit: 'g' },
                { key: 'fat', label: 'Fat', unit: 'g' },
                { key: 'fiber', label: 'Fiber', unit: 'g' },
              ].map(n => (
                <div key={n.key} className="text-center">
                  <label className="text-[0.7rem] text-muted-foreground block mb-1">{n.label} ({n.unit})</label>
                  <input
                    type="number"
                    value={(parsedRecipe.nutrition as any)[n.key]}
                    onChange={e => updateField('nutrition', { ...parsedRecipe.nutrition, [n.key]: parseInt(e.target.value) || 0 })}
                    className="w-full bg-input-background rounded-lg border border-border px-2 py-2 text-center focus:border-primary outline-none transition text-[0.85rem]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setIsEditing(false); setParsedRecipe(null); }}
              className="px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Paste
            </button>
            <button
              onClick={handleSave}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Import Recipe
            </button>
          </div>
        </>
      )}
    </div>
  );
}
