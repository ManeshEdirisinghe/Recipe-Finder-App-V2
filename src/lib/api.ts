import { MealDBResponse, Recipe } from '@/types/recipe';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export async function searchByIngredient(ingredient: string): Promise<Recipe[]> {
  const response = await fetch(
    `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
  );
  const data: MealDBResponse = await response.json();
  return data.meals || [];
}

export async function searchByName(name: string): Promise<Recipe[]> {
  const response = await fetch(
    `${BASE_URL}/search.php?s=${encodeURIComponent(name)}`
  );
  const data: MealDBResponse = await response.json();
  return data.meals || [];
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
  const data: MealDBResponse = await response.json();
  return data.meals?.[0] || null;
}

export async function getRandomRecipe(): Promise<Recipe | null> {
  const response = await fetch(`${BASE_URL}/random.php`);
  const data: MealDBResponse = await response.json();
  return data.meals?.[0] || null;
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/list.php?c=list`);
  const data = await response.json();
  return data.meals?.map((m: { strCategory: string }) => m.strCategory) || [];
}
