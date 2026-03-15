import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import {
  ShoppingCart, Check, Trash2, RotateCcw, Package, Search,
  ChevronDown, ChevronUp, TriangleAlert
} from 'lucide-react';
import { toast } from 'sonner';

export function GroceryListPage() {
  const { groceryList, mealPlan, toggleGroceryItem, clearPurchasedItems, generateGroceryList, addNotification } = useAppStore();
  const [search, setSearch] = useState('');
  const [showPurchased, setShowPurchased] = useState(true);
  const hasShownEmptyWarningRef = useRef(false);

  const filtered = useMemo(() => {
    if (!search) return groceryList;
    const q = search.toLowerCase();
    return groceryList.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.recipeTitle.toLowerCase().includes(q)
    );
  }, [groceryList, search]);

  const unpurchased = filtered.filter(i => !i.purchased);
  const purchased = filtered.filter(i => i.purchased);
  const plannedMealsCount = useMemo(
    () => Object.values(mealPlan).reduce((count, day) => count + Object.keys(day).length, 0),
    [mealPlan]
  );
  const progress = groceryList.length > 0
    ? Math.round((groceryList.filter(i => i.purchased).length / groceryList.length) * 100)
    : 0;

  useEffect(() => {
    if (groceryList.length === 0 && !hasShownEmptyWarningRef.current) {
      addNotification('Your grocery list is empty. Add meals and generate a list to start shopping.');
      toast.warning('Grocery list is empty. Generate from your meal plan.');
      hasShownEmptyWarningRef.current = true;
    }

    if (groceryList.length > 0) {
      hasShownEmptyWarningRef.current = false;
    }
  }, [groceryList.length, addNotification]);

  const handleRegenerate = () => {
    generateGroceryList();

    if (plannedMealsCount === 0) {
      addNotification('Cannot generate grocery list: no meals are planned this week.');
      toast.warning('No meals planned yet. Add meals first.');
      return;
    }

    addNotification('Grocery list regenerated from your meal plan.');
    toast.success('Grocery list regenerated.');
  };

  const handleClearPurchased = () => {
    if (purchased.length === 0) {
      addNotification('No purchased items to clear.');
      toast.warning('No purchased items to clear.');
      return;
    }

    clearPurchasedItems();
    addNotification('Purchased grocery items were cleared.');
    toast.success('Purchased items cleared.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            Grocery List
          </h1>
          <p className="text-muted-foreground">
            {groceryList.filter(i => i.purchased).length} of {groceryList.length} items purchased
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            className="px-3 py-2 rounded-lg border border-border text-[0.85rem] hover:bg-secondary transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Regenerate
          </button>
          {purchased.length > 0 && (
            <button
              onClick={handleClearPurchased}
              className="px-3 py-2 rounded-lg border border-border text-[0.85rem] text-destructive hover:bg-destructive/10 transition-colors inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear Purchased
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      {groceryList.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.85rem] text-muted-foreground">Shopping Progress</span>
            <span className="text-[0.85rem] text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Search */}
      {groceryList.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search grocery items..."
            className="w-full pl-10 pr-4 py-2.5 bg-card rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
          />
        </div>
      )}

      {/* Empty state */}
      {groceryList.length === 0 && (
        <div className="space-y-3">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <TriangleAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.9rem] text-amber-700">Grocery list is empty.</p>
              <p className="text-[0.8rem] text-amber-700/80">Plan meals first, then generate your list to avoid missing ingredients.</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="mb-2">No grocery items yet</h2>
          <p className="text-muted-foreground text-[0.9rem] mb-4">
            Plan your meals first, then generate your grocery list automatically.
          </p>
          <button
            onClick={handleRegenerate}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:opacity-90 transition inline-flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> Generate from Meal Plan
          </button>
          </div>
        </div>
      )}

      {/* Unpurchased items */}
      {unpurchased.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-secondary/30 border-b border-border">
            <h3>To Buy ({unpurchased.length})</h3>
          </div>
          <div className="divide-y divide-border">
            {unpurchased.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => toggleGroceryItem(item.id)}
              >
                <div className="w-5 h-5 rounded border-2 border-border flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.9rem]">{item.name}</p>
                  <p className="text-muted-foreground text-[0.75rem] truncate">
                    {item.amount} {item.unit} &middot; {item.recipeTitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purchased items */}
      {purchased.length > 0 && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setShowPurchased(!showPurchased)}
            className="w-full px-4 py-3 bg-secondary/30 border-b border-border flex items-center justify-between"
          >
            <h3 className="text-muted-foreground">Purchased ({purchased.length})</h3>
            {showPurchased ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {showPurchased && (
            <div className="divide-y divide-border">
              {purchased.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer opacity-60"
                  onClick={() => toggleGroceryItem(item.id)}
                >
                  <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.9rem] line-through">{item.name}</p>
                    <p className="text-muted-foreground text-[0.75rem] truncate">
                      {item.amount} {item.unit} &middot; {item.recipeTitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
