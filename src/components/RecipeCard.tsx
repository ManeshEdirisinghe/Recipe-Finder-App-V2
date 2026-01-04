import { Heart, Clock, ChefHat } from 'lucide-react';
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
        "group relative bg-card rounded-3xl overflow-hidden cursor-pointer",
        "border border-border/50 shadow-lg",
        "transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2",
        "animate-fade-up"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-4 right-4 p-3 rounded-full transition-all duration-300",
            "backdrop-blur-md shadow-lg",
            isFavorite
              ? "bg-gradient-to-r from-primary to-accent text-white scale-110"
              : "bg-white/90 text-gray-600 hover:bg-white hover:text-primary hover:scale-110"
          )}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={cn("h-5 w-5 transition-transform", isFavorite && "fill-current animate-pulse")}
          />
        </button>

        {/* Quick Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-display text-xl font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
            {recipe.strMeal}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 bg-gradient-to-b from-card to-card/50">
        <div className="flex items-center gap-2 flex-wrap">
          {recipe.strCategory && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20">
              <ChefHat className="h-3 w-3" />
              {recipe.strCategory}
            </span>
          )}
          {recipe.strArea && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-accent/10 to-accent/5 text-accent-foreground border border-accent/20">
              🌍 {recipe.strArea}
            </span>
          )}
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </article>
  );
}
