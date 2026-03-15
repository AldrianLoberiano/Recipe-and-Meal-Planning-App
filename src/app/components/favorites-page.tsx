import React from 'react';
import { useAppStore } from '../store';
import { RecipeCard } from './recipe-card';
import { Heart } from 'lucide-react';

export function FavoritesPage() {
  const { recipes } = useAppStore();
  const favorites = recipes.filter(r => r.isFavorite);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Favorite Recipes
        </h1>
        <p className="text-muted-foreground">{favorites.length} saved recipes</p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h2 className="mb-2">No favorites yet</h2>
          <p className="text-muted-foreground text-[0.9rem]">
            Click the heart icon on any recipe to save it here.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {favorites.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
