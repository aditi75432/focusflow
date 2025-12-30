import { Flame, TrendingUp, Sparkles } from "lucide-react";
import { useProgressStore } from "@/store/useProgressStore";

export const StreakDisplay = () => {
  const { progress, isLoading } = useProgressStore();
  
  // Safety check: if loading or progress data is missing
  if (isLoading || !progress) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-4 w-24 bg-muted rounded mb-4"></div>
        <div className="h-24 w-full bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-semibold text-foreground">Study Streak</h3>
        <div className="streak-badge animate-streak-glow">
          <Flame className="w-4 h-4" />
          <span>{progress.focusStreak} days</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-sage-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sage-600 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">Current</span>
          </div>
          <p className="font-serif text-3xl font-bold text-sage-700">{progress.focusStreak}</p>
        </div>
        <div className="bg-teal-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-teal-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Best</span>
          </div>
          <p className="font-serif text-3xl font-bold text-teal-700">{progress.maxStreak}</p>
        </div>
      </div>
      <div className="bg-teal-50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-teal-600 mb-1">
          <Flame className="w-4 h-4" />
          <span className="text-sm font-medium">Completed Sessions</span>
        </div>
        <p className="font-serif text-3xl font-bold text-teal-700">{progress.completedSessions}</p>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground mb-3 text-center">Keep the flow going!</p>
      </div>
    </div>
  );
};
