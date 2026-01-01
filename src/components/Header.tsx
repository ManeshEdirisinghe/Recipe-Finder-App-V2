
import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Heart, Search, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from './ui/switch';
import { useDarkMode } from '@/hooks/useDarkMode';

interface HeaderProps {
  favoritesCount: number;
}

export function Header({ favoritesCount }: HeaderProps) {
  const location = useLocation();

  const [isDark, setIsDark] = useDarkMode();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl gradient-hero shadow-warm group-hover:shadow-elevated transition-shadow">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Recipe<span className="text-gradient">Finder</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              location.pathname === '/'
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Link>

          <Link
            to="/favorites"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative",
              location.pathname === '/favorites'
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Heart className={cn("h-4 w-4", location.pathname === '/favorites' && "fill-primary text-primary")} />
            <span className="hidden sm:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold rounded-full bg-primary text-primary-foreground shadow-warm">
                {favoritesCount > 9 ? '9+' : favoritesCount}
              </span>
            )}
          </Link>

          {/* Dark mode toggle */}
          <div className="flex items-center gap-2 ml-4">
            <Sun className={cn("h-4 w-4", !isDark ? "text-yellow-400" : "text-muted-foreground")}/>
            <Switch checked={isDark} onCheckedChange={setIsDark} aria-label="Toggle dark mode" />
            <Moon className={cn("h-4 w-4", isDark ? "text-blue-400" : "text-muted-foreground")}/>
          </div>
        </nav>
      </div>
    </header>
  );
}
