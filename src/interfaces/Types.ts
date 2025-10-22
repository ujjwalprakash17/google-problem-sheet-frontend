interface Problem {
  title: string;
  day: number;
  week: number;
  theme: string;
  difficulty: "Easy" | "Medium" | "Hard";
  leetcode: number | string;
  technique: string;
  completed?: boolean;
  completedDate?: string | null;
}

interface ProblemStats {
  total: number;
  completed: number;
  progress: number;
  easy: { total: number; completed: number };
  medium: { total: number; completed: number };
  hard: { total: number; completed: number };
  streak: number;
}


export type { Problem, ProblemStats };