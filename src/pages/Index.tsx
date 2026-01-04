import { useState } from 'react';
import { ChefHat, Utensils, Search as SearchIcon, Flame, Clock, Star } from 'lucide-react';

import { SearchBar } from '@/components/SearchBar';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeModal } from '@/components/RecipeModal';
import { EmptyState } from '@/components/EmptyState';
import { searchByIngredient, searchByName } from '@/lib/api';
import { useFavorites } from '@/hooks/useFavorites';
import { Recipe } from '@/types/recipe';

const POPULAR_INGREDIENTS = [
  { name: 'Chicken', emoji: '🍗' },
  { name: 'Beef', emoji: '🥩' },
  { name: 'Salmon', emoji: '🐟' },
  { name: 'Pasta', emoji: '🍝' },
  { name: 'Rice', emoji: '🍚' },
  { name: 'Tomato', emoji: '🍅' },
];

export default function Index() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const { isFavorite, toggleFavorite, favorites } = useFavorites();


  // Accept filters from SearchBar
  const handleSearch = async (query: string, filters?: { category?: string }) => {
    setLoading(true);
    setSearched(true);
    try {
      let results: Recipe[] = await searchByIngredient(query);
      // Also fetch by name if no ingredient results
      if (results.length === 0) {
        results = await searchByName(query);
      }
      // Filter by category if specified
      if (filters?.category) {
        results = results.filter(r => r.strCategory === filters.category);
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
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-warm opacity-50" />
        <div className="absolute top-10 left-[10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-[10%] w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-sm font-medium mb-8 animate-fade-up backdrop-blur-sm">
              <Flame className="h-4 w-4 text-primary" />
              <span className="text-foreground">Discover 1000+ delicious recipes</span>
              <Star className="h-4 w-4 text-accent fill-accent" />
            </div>
            
            {/* Main Heading */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 animate-fade-up leading-tight" style={{ animationDelay: '100ms' }}>
              Find amazing recipes
              <br />
              <span className="text-gradient">by ingredients</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-muted-foreground mb-10 animate-fade-up max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
              Type any ingredient you have at home and discover mouthwatering recipes you can cook right now!
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: '250ms' }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span>Quick & Easy</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 text-sm">
                <ChefHat className="h-4 w-4 text-primary" />
                <span>Pro Recipes</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 text-sm">
                <Utensils className="h-4 w-4 text-primary" />
                <span>All Cuisines</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>

          {/* Popular Ingredients */}
          {!searched && (
            <div className="mt-10 text-center animate-fade-up" style={{ animationDelay: '400ms' }}>
              <p className="text-sm text-muted-foreground mb-5 font-medium">✨ Popular ingredients to try</p>
              <div className="flex flex-wrap justify-center gap-3">
                {POPULAR_INGREDIENTS.map((ingredient) => (
                  <button
                    key={ingredient.name}
                    onClick={() => handleQuickSearch(ingredient.name)}
                    className="group px-5 py-3 rounded-xl bg-card/80 backdrop-blur-sm text-foreground font-medium border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:scale-105"
                  >
                    <span className="mr-2">{ingredient.emoji}</span>
                    {ingredient.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {searched && (
        <section className="pb-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-lg animate-pulse">
                    <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50" />
                    <div className="p-5">
                      <div className="h-5 bg-muted rounded-lg w-3/4 mb-3" />
                      <div className="h-4 bg-muted rounded-lg w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recipes.length > 0 ? (
              <>
                <div className="flex items-center justify-center mb-10">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                    <Flame className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-2xl font-semibold text-foreground">
                      Found <span className="text-gradient">{recipes.length}</span> delicious recipes
                    </h2>
                  </div>
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
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 mb-8 animate-float">
                <SearchIcon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Ready to cook something amazing?
              </h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Search for any ingredient above and let's find your next favorite meal! 🍳
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
