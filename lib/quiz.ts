export const QUIZ_QUESTION_COUNT = 5;
export const COINS_PER_CORRECT = 10;
export const MAX_COINS_PER_QUIZ = QUIZ_QUESTION_COUNT * COINS_PER_CORRECT;

export type QuizQuestion = {
  id: number;
  prompt: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
};

export type QuizQuestionWithAnswer = QuizQuestion & {
  correctOption: "A" | "B" | "C" | "D";
  explanation?: string | null;
};

export type QuizHistoryEntry = {
  id: number;
  articleSlug: string;
  title: string;
  imageUrl: string | null;
  score: number;
  totalQuestions: number;
  coinsAwarded: number;
  completedAt: string;
};

export type QuizHistorySummary = {
  profile: {
    totalCoins: number;
    totalQuizzes: number;
  };
  attempts: QuizHistoryEntry[];
};
