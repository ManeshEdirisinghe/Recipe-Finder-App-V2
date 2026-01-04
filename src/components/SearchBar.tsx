import { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCategories } from '@/lib/api';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  isLoading?: boolean;
}

interface SearchFilters {
  category?: string;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), { category });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query.trim(), { category });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative p-2 bg-card/80 backdrop-blur-xl rounded-2xl shadow-elevated border border-border/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
              <Search className="h-4 w-4 text-white" />
            </div>
            <Input
              type="text"
              placeholder="Search recipes by ingredient (chicken, pasta, tomato...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-16 pr-4 h-14 text-base rounded-xl border-0 bg-secondary/50 shadow-none focus:bg-secondary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Category Filter */}
          <Select value={category || "all"} onValueChange={(val) => setCategory(val === "all" ? "" : val)}>
            <SelectTrigger className="w-full sm:w-44 h-14 rounded-xl border-0 bg-secondary/50 hover:bg-secondary transition-colors">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">🍽️ All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !query.trim()}
            className="h-14 px-8 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>Find Recipes</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
