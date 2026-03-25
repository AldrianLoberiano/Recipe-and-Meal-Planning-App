import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppStore } from '../store';
import {
  ShoppingCart, Check, Trash2, RotateCcw, Package, Search,
  ChevronDown, ChevronUp, TriangleAlert
} from 'lucide-react';
import { toast } from 'sonner';

type GroceryCategory = 'vegetables' | 'ingredients' | 'meats';

const ITEM_PRICE_MAP: Record<string, number> = {
  potato: 25,
  potatoes: 25,
  onion: 18,
  onions: 18,
  garlic: 10,
  carrot: 20,
  carrots: 20,
  cabbage: 45,
  tomato: 12,
  tomatoes: 12,
  pork: 320,
  beef: 420,
  chicken: 260,
  fish: 300,
  shrimp: 460,
  egg: 9,
  eggs: 9,
  rice: 60,
  salt: 8,
  sugar: 7,
  oil: 14,
};

const CATEGORY_LABELS: Record<GroceryCategory, string> = {
  vegetables: 'Vegetables',
  ingredients: 'Ingredients',
  meats: 'Meats',
};

const categorizeItem = (name: string): GroceryCategory => {
  const lower = name.toLowerCase();

  if (/(beef|pork|chicken|meat|fish|shrimp|sausage|bacon|ham|liver)/.test(lower)) {
    return 'meats';
  }

  if (/(potato|onion|garlic|carrot|cabbage|pepper|eggplant|radish|kangkong|lettuce|spinach|tomato|vegetable)/.test(lower)) {
    return 'vegetables';
  }

  return 'ingredients';
};

const getEstimatedPrice = (name: string): number => {
  const lower = name.toLowerCase();
  const match = Object.keys(ITEM_PRICE_MAP).find(key => lower.includes(key));
  return match ? ITEM_PRICE_MAP[match] : 30;
};

const getOrderedQuantity = (amount: string): number => {
  const parsed = parseFloat(amount);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

export function GroceryListPage() {
  const { groceryList, mealPlan, toggleGroceryItem, clearPurchasedItems, generateGroceryList, addNotification } = useAppStore();
  const [search, setSearch] = useState('');
  const [showPurchased, setShowPurchased] = useState(true);
  const [acquiredById, setAcquiredById] = useState<Record<string, number>>({});
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
  const visibleItems = showPurchased ? filtered : unpurchased;
  const categorizedItems = useMemo(() => {
    const grouped: Record<GroceryCategory, typeof visibleItems> = {
      vegetables: [],
      ingredients: [],
      meats: [],
    };

    for (const item of visibleItems) {
      grouped[categorizeItem(item.name)].push(item);
    }

    return grouped;
  }, [visibleItems]);
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

  useEffect(() => {
    setAcquiredById(prev => {
      const next: Record<string, number> = {};

      for (const item of groceryList) {
        const orderedQty = getOrderedQuantity(item.amount);
        const existingValue = prev[item.id];

        if (typeof existingValue === 'number') {
          next[item.id] = existingValue;
          continue;
        }

        next[item.id] = item.purchased ? orderedQty : 0;
      }

      return next;
    });
  }, [groceryList]);

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

  const setAcquiredQuantity = (itemId: string, acquired: number) => {
    const item = groceryList.find(entry => entry.id === itemId);
    if (!item) return;

    const safeAcquired = Math.max(0, acquired);
    const orderedQty = getOrderedQuantity(item.amount);

    setAcquiredById(prev => ({ ...prev, [itemId]: safeAcquired }));

    const shouldBePurchased = safeAcquired >= orderedQty;
    if (shouldBePurchased !== item.purchased) {
      toggleGroceryItem(itemId);
    }
  };

  const togglePurchasedState = (itemId: string) => {
    const item = groceryList.find(entry => entry.id === itemId);
    if (!item) return;

    const orderedQty = getOrderedQuantity(item.amount);
    const nextPurchased = !item.purchased;

    setAcquiredById(prev => ({
      ...prev,
      [itemId]: nextPurchased ? orderedQty : 0,
    }));

    toggleGroceryItem(itemId);
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

      {/* Category tables */}
      {groceryList.length > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => setShowPurchased(!showPurchased)}
            className="w-full px-4 py-3 bg-card rounded-xl border border-border flex items-center justify-between"
          >
            <h3 className="text-muted-foreground">
              {showPurchased ? 'Showing all items' : 'Showing only unpurchased'}
              {' '}
              ({showPurchased ? filtered.length : unpurchased.length})
            </h3>
            {showPurchased ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>

          {(Object.keys(categorizedItems) as GroceryCategory[]).map(categoryKey => {
            const items = categorizedItems[categoryKey];
            if (items.length === 0) return null;

            return (
              <div key={categoryKey} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-secondary/30 border-b border-border flex items-center justify-between">
                  <h3>{CATEGORY_LABELS[categoryKey]}</h3>
                  <span className="text-[0.8rem] text-muted-foreground">{items.length} items</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] text-left">
                    <thead className="bg-secondary/20 text-[0.75rem] text-muted-foreground uppercase tracking-wide">
                      <tr>
                        <th className="px-4 py-3">Item</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Ordered</th>
                        <th className="px-4 py-3">Acquired</th>
                        <th className="px-4 py-3">Recipe</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => {
                        const orderedQty = getOrderedQuantity(item.amount);
                        const acquiredQty = acquiredById[item.id] ?? (item.purchased ? orderedQty : 0);
                        const unitPrice = getEstimatedPrice(item.name);
                        const subtotal = unitPrice * orderedQty;

                        return (
                          <tr key={item.id} className={`border-t border-border ${item.purchased ? 'opacity-70' : ''}`}>
                            <td className="px-4 py-3">
                              <p className={`text-[0.9rem] ${item.purchased ? 'line-through' : ''}`}>{item.name}</p>
                              <p className="text-[0.75rem] text-muted-foreground">{item.amount} {item.unit}</p>
                            </td>
                            <td className="px-4 py-3 text-[0.85rem]">
                              <p>PHP {unitPrice.toFixed(2)}</p>
                              <p className="text-[0.75rem] text-muted-foreground">Total: PHP {subtotal.toFixed(2)}</p>
                            </td>
                            <td className="px-4 py-3 text-[0.85rem]">{orderedQty}</td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min={0}
                                step="0.5"
                                value={acquiredQty}
                                onChange={event => setAcquiredQuantity(item.id, Number(event.target.value))}
                                className="w-24 bg-input-background rounded-lg border border-border px-2 py-1.5 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                              />
                            </td>
                            <td className="px-4 py-3 text-[0.8rem] text-muted-foreground max-w-[220px] truncate">{item.recipeTitle}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => togglePurchasedState(item.id)}
                                className={`px-3 py-1.5 rounded-md text-[0.75rem] inline-flex items-center gap-1.5 border transition-colors ${item.purchased
                                  ? 'border-primary/40 bg-primary/10 text-primary'
                                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
                              >
                                {item.purchased ? <Check className="w-3.5 h-3.5" /> : null}
                                {item.purchased ? 'Acquired' : 'Mark acquired'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
