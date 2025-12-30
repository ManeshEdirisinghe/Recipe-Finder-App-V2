import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '@/types/recipe';

const FAVORITES_KEY = 'recipe-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
        setFavorites([]);
      }
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: Recipe[]) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  }, []);

  const addFavorite = useCallback((recipe: Recipe) => {
    setFavorites((prev) => {
      const exists = prev.some((r) => r.idMeal === recipe.idMeal);
      if (exists) return prev;
      const newFavorites = [...prev, recipe];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const removeFavorite = useCallback((recipeId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((r) => r.idMeal !== recipeId);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (recipeId: string) => favorites.some((r) => r.idMeal === recipeId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (recipe: Recipe) => {
      if (isFavorite(recipe.idMeal)) {
        removeFavorite(recipe.idMeal);
      } else {
        addFavorite(recipe);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}
