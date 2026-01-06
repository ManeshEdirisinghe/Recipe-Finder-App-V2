import { useEffect, useState, useCallback } from 'react';
import { X, Heart, Clock, Users, ExternalLink, Check, Minus, Plus } from 'lucide-react';
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

// භාග සංඛ්‍යා (Fractions) දශම බවට හැරවීමට උදව් වන helper function එකක්
const parseFraction = (str: string): number => {
  if (str.includes('/')) {
    const [num, den] = str.split('/').map(Number);
    return num / den;
  }
  return parseFloat(str);
};

// දශම සංඛ්‍යා නැවත ලස්සනට පෙන්වීමට (උදා: 0.5 -> 1/2)
const formatNumber = (num: number): string => {
  if (Number.isInteger(num)) return num.toString();
  
  // සුලභ භාග සංඛ්‍යා සඳහා
  const decimal = num % 1;
  const integer = Math.floor(num);
  
  if (Math.abs(decimal - 0.5) < 0.01) return integer ? `${integer} ½` : '½';
  if (Math.abs(decimal - 0.25) < 0.01) return integer ? `${integer} ¼` : '¼';
  if (Math.abs(decimal - 0.75) < 0.01) return integer ? `${integer} ¾` : '¾';
  if (Math.abs(decimal - 0.33) < 0.01) return integer ? `${integer} ⅓` : '⅓';
  
  return num.toFixed(1).replace('.0', '');
};

export function RecipeModal({
  recipeId,
  onClose,
  isFavorite,
  onToggleFavorite,
}: RecipeModalProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  
  // Default servings ප්‍රමාණය 4 ලෙස ගනිමු
  const [defaultServings, setDefaultServings] = useState(4);
  const [currentServings, setCurrentServings] = useState(4);

  useEffect(() => {
    if (recipeId) {
      setLoading(true);
      setCheckedIngredients(new Set());
      setCurrentServings(4); // Reset servings
      
      getRecipeById(recipeId)
        .then((data) => {
          setRecipe(data);
          // API එකේ servings දීලා තියෙනවා නම් එය ගන්න, නැත්නම් 4 ගන්න
          // (API එක සමහර විට "Yield: 2" වගේ text එවන නිසා අපි 4 යොදාගනිමු ආරක්ෂාවට)
          setDefaultServings(4);
          setCurrentServings(4);
        })
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

  const toggleIngredient = (index: number) => {
    const next = new Set(checkedIngredients);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setCheckedIngredients(next);
  };

  const updateServings = (change: number) => {
    const newServings = currentServings + change;
    if (newServings >= 1 && newServings <= 20) {
      setCurrentServings(newServings);
    }
  };

  // අමුද්‍රව්‍ය ප්‍රමාණය ගණනය කරන Logic එක
  const getScaledMeasure = useCallback((measure: string) => {
    if (currentServings === defaultServings) return measure;

    // ඉලක්කම් හෝ භාග සංඛ්‍යා සොයා ගැනීමට Regex (උදා: 1/2, 1.5, 200)
    return measure.replace(/(\d+\/\d+|\d+(\.\d+)?)/g, (match) => {
      const value = parseFraction(match);
      const scaled = (value / defaultServings) * currentServings;
      return formatNumber(scaled);
    });
  }, [currentServings, defaultServings]);

  if (!recipeId) return null;

  const ingredients = recipe ? getIngredients(recipe) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-3xl shadow-elevated overflow-hidden animate-scale-in flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="h-10 w-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : recipe ? (
          <>
            <div className="relative h-72 md:h-80 flex-shrink-0">
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

            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 text-muted-foreground bg-secondary/30 p-2 rounded-xl border border-border/50">
                  <div className="flex items-center gap-1.5 px-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">30-45 min</span>
                  </div>
                  
                  <div className="w-px h-4 bg-border" />

                  {/* Portion Calculator Controls */}
                  <div className="flex items-center gap-3 px-2">
                    <Users className="h-4 w-4" />
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateServings(-1)}
                        className="p-1 hover:bg-background rounded-md transition-colors disabled:opacity-50"
                        disabled={currentServings <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-bold w-16 text-center text-foreground">
                        {currentServings} servings
                      </span>
                      <button 
                        onClick={() => updateServings(1)}
                        className="p-1 hover:bg-background rounded-md transition-colors disabled:opacity-50"
                        disabled={currentServings >= 20}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {recipe.strYoutube && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1.5" />
                        Video
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
                  <h3 className="font-display text-xl font-semibold mb-4 text-foreground flex items-center justify-between">
                    Ingredients
                    <span className="text-xs font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                      {checkedIngredients.size}/{ingredients.length} done
                    </span>
                  </h3>
                  <ul className="space-y-3">
                    {ingredients.map((ing, idx) => {
                      const isChecked = checkedIngredients.has(idx);
                      // මෙතනදී අපි ප්‍රමාණය scale කරනවා
                      const scaledMeasure = getScaledMeasure(ing.measure);

                      return (
                        <li
                          key={idx}
                          onClick={() => toggleIngredient(idx)}
                          className={cn(
                            "flex items-start gap-3 text-sm py-2 px-3 rounded-lg border cursor-pointer transition-all duration-200 select-none",
                            isChecked 
                              ? "bg-primary/5 border-primary/20" 
                              : "bg-transparent border-transparent hover:bg-secondary/50"
                          )}
                        >
                          <div className={cn(
                            "mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors",
                            isChecked
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-muted-foreground/30 text-transparent"
                          )}>
                            <Check className="h-3 w-3" />
                          </div>
                          
                          <span className={cn(
                            "transition-all duration-200",
                            isChecked ? "text-muted-foreground line-through opacity-70" : "text-foreground"
                          )}>
                            <span className={cn("font-bold", isChecked ? "text-muted-foreground" : "text-primary")}>
                              {scaledMeasure}
                            </span>{' '}
                            {ing.name}
                          </span>
                        </li>
                      );
                    })}
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