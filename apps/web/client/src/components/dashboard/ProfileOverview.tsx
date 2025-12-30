import { User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useProgressStore } from "@/store/useProgressStore";

export const ProfileOverview = () => {
  const { user } = useAuthStore();
  const { progress } = useProgressStore();

  if (!user) return null;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass-card p-8 text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-serif font-bold">{user.name}</h3>
        <p className="text-muted-foreground">{user.email}</p>
        <div className="pt-4 border-t border-border/50 max-w-xs mx-auto">
          <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-2">Account Statistics</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-primary">{progress?.focusStreak || 0}</p>
              <p className="text-[10px] text-muted-foreground">DAY STREAK</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{progress?.completedSessions || 0}</p>
              <p className="text-[10px] text-muted-foreground">SESSIONS</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
