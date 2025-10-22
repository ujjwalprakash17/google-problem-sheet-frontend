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

export type { Problem };