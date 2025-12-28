export interface Progress {
  id: string;              // SAME as userId
  userId: string;          // partition key

  focusStreak: number;     // consecutive days
  completedSessions: number;

  skills: {
    Attention?: {
      xp: number;
      topics: string[];
    };
  };

  lastActive: string;      // ISO date
  lastStreakDate: string;  // YYYY-MM-DD (IMPORTANT)
  createdAt: string;
  updatedAt: string;
}
