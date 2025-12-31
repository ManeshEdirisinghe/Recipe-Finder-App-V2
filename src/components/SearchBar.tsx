import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/api';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  isLoading?: boolean;
}

interface SearchFilters {
  category?: string;
  area?: string;
  cookTime?: string;
  diet?: string;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [diet, setDiet] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), {
        category,
        area,
        cookTime,
        diet,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by ingredient (e.g., chicken, tomato, pasta...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-14 text-base rounded-xl border-2 border-border bg-card shadow-soft focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Cuisine (Area)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-32"
        />
        <Select value={cookTime} onValueChange={setCookTime}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Cook Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="15">≤ 15 min</SelectItem>
            <SelectItem value="30">≤ 30 min</SelectItem>
            <SelectItem value="60">≤ 1 hour</SelectItem>
            <SelectItem value="120">≤ 2 hours</SelectItem>
          </SelectContent>
        </Select>
        <Select value={diet} onValueChange={setDiet}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Diet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any</SelectItem>
            <SelectItem value="vegetarian">Vegetarian</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
            <SelectItem value="gluten-free">Gluten-Free</SelectItem>
            <SelectItem value="halal">Halal</SelectItem>
            <SelectItem value="kosher">Kosher</SelectItem>
          </SelectContent>
        </Select>
        <Button
          type="submit"
          size="lg"
          variant="hero"
          disabled={isLoading || !query.trim()}
          className="h-14 px-8"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            'Search'
          )}
        </Button>
      </div>
    </form>
  );
}
