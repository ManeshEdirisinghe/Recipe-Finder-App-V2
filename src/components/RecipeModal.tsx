import { useEffect, useState } from 'react';
import { X, Heart, Clock, Users, ExternalLink } from 'lucide-react';
import { Recipe, getIngredients } from '@/types/recipe';
import { getRecipeById } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecipeModalProps {
  recipeId: string | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

export function RecipeModal({
  recipeId,
  onClose,
  isFavorite,
  onToggleFavorite,
}: RecipeModalProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (recipeId) {
      setLoading(true);
      getRecipeById(recipeId)
        .then(setRecipe)
        .finally(() => setLoading(false));
    } else {
      setRecipe(null);
    }
  }, [recipeId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!recipeId) return null;

  const ingredients = recipe ? getIngredients(recipe) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-3xl shadow-elevated overflow-hidden animate-scale-in">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="h-10 w-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : recipe ? (
          <>
            <div className="relative h-72 md:h-80">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-card/90 backdrop-blur-sm text-foreground hover:bg-card transition-colors shadow-soft"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 mb-3">
                  {recipe.strCategory && (
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/90 text-primary-foreground">
                      {recipe.strCategory}
                    </span>
                  )}
                  {recipe.strArea && (
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-card/90 text-foreground">
                      {recipe.strArea}
                    </span>
                  )}
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground drop-shadow-lg">
                  {recipe.strMeal}
                </h2>
              </div>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-20rem)]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">30-45 min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">4 servings</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {recipe.strYoutube && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={recipe.strYoutube}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1.5" />
                        Watch Video
                      </a>
                    </Button>
                  )}
                  <Button
                    variant={isFavorite ? 'default' : 'favorite'}
                    size="sm"
                    onClick={() => onToggleFavorite(recipe)}
                  >
                    <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    {isFavorite ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <h3 className="font-display text-xl font-semibold mb-4 text-foreground">
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {ingredients.map((ing, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm py-2 border-b border-border/50 last:border-0"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">{ing.measure}</span>{' '}
                          {ing.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-display text-xl font-semibold mb-4 text-foreground">
                    Instructions
                  </h3>
                  <div className="prose prose-sm text-muted-foreground leading-relaxed">
                    {recipe.strInstructions?.split('\n').map((paragraph, idx) => (
                      paragraph.trim() && (
                        <p key={idx} className="mb-4">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            Recipe not found
          </div>
        )}
      </div>
    </div>
  );
}
