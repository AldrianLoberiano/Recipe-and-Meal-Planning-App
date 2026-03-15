import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../store';
import { RecipeCard } from './recipe-card';
import { CATEGORIES } from '../data';
import { Search, Plus, SlidersHorizontal, X, ChefHat, Upload } from 'lucide-react';

export function RecipesPage() {
  const { recipes } = useAppStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'time'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...recipes];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(q))
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter(r => r.category === categoryFilter);
    }

    switch (sortBy) {
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'time': result.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime)); break;
      default: result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [recipes, search, categoryFilter, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1>Recipes</h1>
          <p className="text-muted-foreground">{recipes.length} recipes in your collection</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/recipes/import')}
            className="px-4 py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors inline-flex items-center gap-2 self-start"
          >
            <Upload className="w-4 h-4" /> Import
          </button>
          <button
            onClick={() => navigate('/recipes/new')}
            className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 transition inline-flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" /> Add Recipe
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search recipes by name or ingredient..."
              className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-lg border border-border inline-flex items-center gap-2 transition-colors ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-secondary'}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1.5 text-[0.8rem] text-muted-foreground">Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-[0.8rem] transition-colors ${categoryFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}
                >
                  All
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={`px-3 py-1.5 rounded-full text-[0.8rem] transition-colors ${categoryFilter === cat.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1.5 text-[0.8rem] text-muted-foreground">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-input-background rounded-lg border border-border outline-none focus:border-primary text-[0.85rem]"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="time">Quickest</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Recipe Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-muted-foreground">No recipes found</h3>
          <p className="text-muted-foreground text-[0.85rem] mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}