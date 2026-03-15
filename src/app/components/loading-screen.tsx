import { ChefHat } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      <div className="relative text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mx-auto shadow-lg shadow-primary/30 animate-pulse">
          <ChefHat className="w-10 h-10 text-primary-foreground" />
        </div>

        <h1 className="mt-6 text-foreground">MealCraft</h1>
        <p className="text-muted-foreground text-[0.9rem] mt-1">Preparing your kitchen...</p>

        <div className="w-56 h-2 bg-secondary rounded-full mt-5 overflow-hidden mx-auto">
          <div className="h-full bg-primary rounded-full loading-bar" />
        </div>
      </div>
    </div>
  );
}
