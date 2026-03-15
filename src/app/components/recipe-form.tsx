import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppStore } from '../store';
import { Recipe, Ingredient, CATEGORIES } from '../data';
import { ArrowLeft, Plus, X, ImageIcon, Save } from 'lucide-react';

const emptyIngredient: Ingredient = { name: '', amount: '', unit: '' };

export function RecipeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, addRecipe, updateRecipe } = useAppStore();
  const isEditing = !!id && id !== 'new';
  const existing = isEditing ? recipes.find(r => r.id === id) : null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Recipe['category']>('dinner');
  const [image, setImage] = useState('');
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(4);
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ ...emptyIngredient }]);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [nutrition, setNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setDescription(existing.description);
      setCategory(existing.category);
      setImage(existing.image);
      setPrepTime(existing.prepTime);
      setCookTime(existing.cookTime);
      setServings(existing.servings);
      setIngredients(existing.ingredients);
      setInstructions(existing.instructions);
      setNutrition(existing.nutrition);
    }
  }, [existing]);

  const addIngredient = () => setIngredients(prev => [...prev, { ...emptyIngredient }]);
  const removeIngredient = (i: number) => setIngredients(prev => prev.filter((_, idx) => idx !== i));
  const updateIngredient = (i: number, field: keyof Ingredient, value: string) => {
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: value } : ing));
  };

  const addInstruction = () => setInstructions(prev => [...prev, '']);
  const removeInstruction = (i: number) => setInstructions(prev => prev.filter((_, idx) => idx !== i));
  const updateInstruction = (i: number, value: string) => {
    setInstructions(prev => prev.map((s, idx) => idx === i ? value : s));
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const validate = () => {
    const errs: string[] = [];
    if (!title.trim()) errs.push('Title is required');
    if (!description.trim()) errs.push('Description is required');
    if (ingredients.filter(i => i.name.trim()).length === 0) errs.push('At least one ingredient is required');
    if (instructions.filter(i => i.trim()).length === 0) errs.push('At least one instruction is required');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const recipeData = {
      title: title.trim(),
      description: description.trim(),
      category,
      image: image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800',
      prepTime,
      cookTime,
      servings,
      ingredients: ingredients.filter(i => i.name.trim()),
      instructions: instructions.filter(i => i.trim()),
      nutrition,
    };

    if (isEditing && existing) {
      updateRecipe(existing.id, recipeData);
      navigate(`/recipes/${existing.id}`);
    } else {
      addRecipe(recipeData as any);
      navigate('/recipes');
    }
  };

  const inputClass = "w-full px-3 py-2.5 bg-input-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1>{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</h1>
      </div>

      {errors.length > 0 && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-xl">
          {errors.map((e, i) => <p key={i} className="text-[0.85rem]">{e}</p>)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <h2>Basic Information</h2>

          <div>
            <label className="block mb-1.5 text-[0.85rem]">Recipe Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} placeholder="e.g., Classic Margherita Pizza" />
          </div>

          <div>
            <label className="block mb-1.5 text-[0.85rem]">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className={`${inputClass} min-h-[80px] resize-none`} placeholder="A brief description of the recipe..." />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-[0.85rem]">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value as Recipe['category'])} className={inputClass}>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1.5 text-[0.85rem]">Image URL</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={image} onChange={e => setImage(e.target.value)} className={`${inputClass} pl-10`} placeholder="https://..." />
                </div>
                <label className="px-3 py-2.5 rounded-lg border border-border text-[0.8rem] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer whitespace-nowrap">
                  Upload Image
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageFileSelect} />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1.5 text-[0.85rem]">Prep (min)</label>
              <input type="number" value={prepTime} onChange={e => setPrepTime(Number(e.target.value))} className={inputClass} min={0} />
            </div>
            <div>
              <label className="block mb-1.5 text-[0.85rem]">Cook (min)</label>
              <input type="number" value={cookTime} onChange={e => setCookTime(Number(e.target.value))} className={inputClass} min={0} />
            </div>
            <div>
              <label className="block mb-1.5 text-[0.85rem]">Servings</label>
              <input type="number" value={servings} onChange={e => setServings(Number(e.target.value))} className={inputClass} min={1} />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2>Ingredients</h2>
            <button type="button" onClick={addIngredient} className="text-primary text-[0.85rem] flex items-center gap-1 hover:underline">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                value={ing.amount} onChange={e => updateIngredient(i, 'amount', e.target.value)}
                className={`${inputClass} w-20`} placeholder="Amt"
              />
              <input
                value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)}
                className={`${inputClass} w-24`} placeholder="Unit"
              />
              <input
                value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)}
                className={`${inputClass} flex-1`} placeholder="Ingredient name"
              />
              {ingredients.length > 1 && (
                <button type="button" onClick={() => removeIngredient(i)} className="p-2.5 text-muted-foreground hover:text-destructive transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2>Instructions</h2>
            <button type="button" onClick={addInstruction} className="text-primary text-[0.85rem] flex items-center gap-1 hover:underline">
              <Plus className="w-4 h-4" /> Add Step
            </button>
          </div>

          {instructions.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-[0.8rem] mt-2">
                {i + 1}
              </div>
              <textarea
                value={step} onChange={e => updateInstruction(i, e.target.value)}
                className={`${inputClass} flex-1 min-h-[60px] resize-none`}
                placeholder={`Step ${i + 1}...`}
              />
              {instructions.length > 1 && (
                <button type="button" onClick={() => removeInstruction(i)} className="p-2.5 text-muted-foreground hover:text-destructive transition-colors mt-2">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Nutrition */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <h2>Nutrition (per serving)</h2>
          <div className="grid grid-cols-5 gap-3">
            {(['calories', 'protein', 'carbs', 'fat', 'fiber'] as const).map(key => (
              <div key={key}>
                <label className="block mb-1 text-[0.75rem] text-muted-foreground capitalize">{key}</label>
                <input
                  type="number"
                  value={nutrition[key]}
                  onChange={e => setNutrition(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                  className={inputClass}
                  min={0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate(-1)} className="px-5 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition inline-flex items-center gap-2">
            <Save className="w-4 h-4" /> {isEditing ? 'Update Recipe' : 'Save Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}
