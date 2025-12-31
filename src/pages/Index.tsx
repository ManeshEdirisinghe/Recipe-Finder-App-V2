import { useState } from 'react';
import { ChefHat, Utensils, Search as SearchIcon } from 'lucide-react';

import { SearchBar } from '@/components/SearchBar';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeModal } from '@/components/RecipeModal';
import { EmptyState } from '@/components/EmptyState';
import { searchByIngredient, searchByName } from '@/lib/api';
import { useFavorites } from '@/hooks/useFavorites';
import { Recipe } from '@/types/recipe';

const POPULAR_INGREDIENTS = ['Chicken', 'Beef', 'Salmon', 'Pasta', 'Rice', 'Tomato'];

export default function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const { isFavorite, toggleFavorite, favorites } = useFavorites();


  // Accept filters from SearchBar
  const handleSearch = async (query: string, filters?: any) => {
    setLoading(true);
    setSearched(true);
    try {
      let results: Recipe[] = await searchByIngredient(query);
      // Optionally, fetch by name if no results
      if (results.length === 0) {
        results = await searchByName(query);
      }
      // Filter by category, area, etc. (client-side for now)
      if (filters) {
        if (filters.category) {
          results = results.filter(r => r.strCategory === filters.category);
        }
        if (filters.area) {
          results = results.filter(r => r.strArea && r.strArea.toLowerCase().includes(filters.area.toLowerCase()));
        }
        // Cook time and diet are not available in API, so this is a placeholder for future extension
      }
      setRecipes(results);
    } catch (error) {
      console.error('Search failed:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (ingredient: string) => {
    handleSearch(ingredient);
  };

  const selectedRecipe = recipes.find((r) => r.idMeal === selectedRecipeId) ||
    favorites.find((r) => r.idMeal === selectedRecipeId);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="absolute inset-0 gradient-warm opacity-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6 animate-fade-up">
              <ChefHat className="h-4 w-4" />
              <span>Discover delicious recipes</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              Find recipes by{' '}
              <span className="text-gradient">ingredients</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
              Enter an ingredient you have on hand, and we'll show you delicious recipes you can make right now.
            </p>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>

          {!searched && (
            <div className="mt-8 text-center animate-fade-up" style={{ animationDelay: '400ms' }}>
              <p className="text-sm text-muted-foreground mb-4">Popular ingredients</p>
              <div className="flex flex-wrap justify-center gap-2">
                {POPULAR_INGREDIENTS.map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => handleQuickSearch(ingredient)}
                    className="px-4 py-2 rounded-full bg-card text-foreground text-sm font-medium border border-border hover:border-primary hover:text-primary transition-all shadow-soft hover:shadow-warm"
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {searched && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-card animate-pulse">
                    <div className="aspect-[4/3] bg-muted" />
                    <div className="p-5">
                      <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recipes.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-2xl font-semibold text-foreground">
                    Found <span className="text-primary">{recipes.length}</span> recipes
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recipes.map((recipe, index) => (
                    <RecipeCard
                      key={recipe.idMeal}
                      recipe={recipe}
                      isFavorite={isFavorite(recipe.idMeal)}
                      onToggleFavorite={() => toggleFavorite(recipe)}
                      onClick={() => setSelectedRecipeId(recipe.idMeal)}
                      index={index}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                icon={Utensils}
                title="No recipes found"
                description="Try searching with a different ingredient, like 'chicken' or 'tomato'."
              />
            )}
          </div>
        </section>
      )}

      {/* Initial State */}
      {!searched && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary mb-6">
                <SearchIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Ready to cook something amazing?
              </h3>
              <p className="text-muted-foreground">
                Search for an ingredient above to get started
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Recipe Modal */}
      <RecipeModal
        recipeId={selectedRecipeId}
        onClose={() => setSelectedRecipeId(null)}
        isFavorite={selectedRecipe ? isFavorite(selectedRecipe.idMeal) : false}
        onToggleFavorite={toggleFavorite}
      />
    </main>
  );
}
