import React from 'react';
import { useNavigate } from 'react-router';
import { Recipe, CATEGORIES } from '../data';
import { useAppStore } from '../store';
import { Heart, Clock, Star, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface RecipeCardProps {
  recipe: Recipe;
  compact?: boolean;
}

export function RecipeCard({ recipe, compact = false }: RecipeCardProps) {
  const { toggleFavorite } = useAppStore();
  const navigate = useNavigate();
  const category = CATEGORIES.find(c => c.value === recipe.category);

  if (compact) {
    return (
      <div
        onClick={() => navigate(`/recipes/${recipe.id}`)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer transition-colors group"
      >
        <ImageWithFallback
          src={recipe.image}
          alt={recipe.title}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.85rem] group-hover:text-primary transition-colors">{recipe.title}</p>
          <p className="text-muted-foreground text-[0.75rem]">{category?.emoji} {category?.label}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => navigate(`/recipes/${recipe.id}`)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-card/90 backdrop-blur-sm text-foreground px-2.5 py-1 rounded-full text-[0.75rem]">
            {category?.emoji} {category?.label}
          </span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
        >
          <Heart className={`w-4 h-4 ${recipe.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="mb-1 line-clamp-1 group-hover:text-primary transition-colors">{recipe.title}</h3>
        <p className="text-muted-foreground text-[0.8rem] line-clamp-2 mb-3">{recipe.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-muted-foreground text-[0.75rem]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {recipe.prepTime + recipe.cookTime}m
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {recipe.servings}
            </span>
          </div>
          {recipe.rating > 0 && (
            <span className="flex items-center gap-1 text-[0.75rem]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-foreground">{recipe.rating}</span>
              <span className="text-muted-foreground">({recipe.ratingCount})</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
