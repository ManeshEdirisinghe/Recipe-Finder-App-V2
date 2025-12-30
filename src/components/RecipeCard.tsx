import { Heart } from 'lucide-react';
import { Recipe } from '@/types/recipe';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
  index?: number;
}

export function RecipeCard({
  recipe,
  isFavorite,
  onToggleFavorite,
  onClick,
  index = 0,
}: RecipeCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  return (
    <article
      onClick={onClick}
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden shadow-card cursor-pointer",
        "transition-all duration-300 hover:shadow-elevated hover:-translate-y-1",
        "animate-fade-up"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-3 right-3 p-2.5 rounded-full transition-all duration-200",
            "backdrop-blur-sm shadow-soft",
            isFavorite
              ? "bg-primary text-primary-foreground scale-110"
              : "bg-card/90 text-muted-foreground hover:bg-card hover:text-primary hover:scale-110"
          )}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={cn("h-5 w-5 transition-all", isFavorite && "fill-current")}
          />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.strMeal}
          </h3>
        </div>
        
        {(recipe.strCategory || recipe.strArea) && (
          <div className="flex items-center gap-2 mt-3">
            {recipe.strCategory && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                {recipe.strCategory}
              </span>
            )}
            {recipe.strArea && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent/30 text-accent-foreground">
                {recipe.strArea}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
