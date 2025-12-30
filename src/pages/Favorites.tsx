import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeModal } from '@/components/RecipeModal';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';

export default function Favorites() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const selectedRecipe = favorites.find((r) => r.idMeal === selectedRecipeId);

  return (
    <main className="min-h-screen pb-16">
      <section className="pt-12 pb-8 md:pt-16 md:pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-xl bg-primary/10">
              <Heart className="h-6 w-6 text-primary fill-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Your Favorites
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">
            {favorites.length > 0
              ? `You have ${favorites.length} saved recipe${favorites.length > 1 ? 's' : ''}`
              : 'Start saving recipes you love'}
          </p>
        </div>
      </section>

      <section>
        <div className="container mx-auto px-4">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((recipe, index) => (
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
          ) : (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              description="When you find recipes you love, click the heart icon to save them here for easy access."
              action={
                <Button variant="hero" asChild>
                  <Link to="/">
                    <Search className="h-4 w-4 mr-2" />
                    Find Recipes
                  </Link>
                </Button>
              }
            />
          )}
        </div>
      </section>

      <RecipeModal
        recipeId={selectedRecipeId}
        onClose={() => setSelectedRecipeId(null)}
        isFavorite={selectedRecipe ? isFavorite(selectedRecipe.idMeal) : false}
        onToggleFavorite={toggleFavorite}
      />
    </main>
  );
}
