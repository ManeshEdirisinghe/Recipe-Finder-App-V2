import { cn } from "@/lib/utils";

export function RecipeCardSkeleton() {
  return (
    <div className={cn(
      "bg-card rounded-3xl overflow-hidden border border-border/50 shadow-lg",
      // මුළු කාඩ් එකටම Pulse animation එක ලබා දෙයි
      "animate-pulse" 
    )}>
      {/* Image Skeleton */}
      <div className="aspect-[4/3] bg-muted/60 relative">
        {/* Favorite Button Placeholder */}
        <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-muted-foreground/20" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Badges Placeholder (Category & Area) */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-20 rounded-full bg-muted/80" />
          <div className="h-6 w-16 rounded-full bg-muted/80" />
        </div>

        {/* Title Placeholder */}
        <div className="space-y-2">
          <div className="h-7 w-3/4 rounded-md bg-muted/80" />
          {/* දිග වැඩි නම් දෙවැනි පේළියක් සඳහා */}
          <div className="h-7 w-1/2 rounded-md bg-muted/60" />
        </div>
      </div>
    </div>
  );
}