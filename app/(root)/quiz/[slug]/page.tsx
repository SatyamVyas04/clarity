"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { AuthGuard } from "@/components/auth/auth-guard";
import { BottomDock } from "@/components/navigation/bottom-dock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { COINS_PER_CORRECT, type QuizQuestion } from "@/lib/quiz";

type QuizPageProps = {
  params: Promise<{ slug: string }>;
};

type QuizFetchResponse = {
  article: {
    slug: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    sourceName: string | null;
    sourceLink: string | null;
    callToAction?: string;
  };
  quiz: {
    questionCount: number;
    rewardPerQuestion: number;
    maxReward: number;
  };
  questions: QuizQuestion[];
};

type QuizAttemptResponse = {
  attempt: {
    id: number;
    completedAt: string;
    score: number;
    totalQuestions: number;
    coinsAwarded: number;
  };
  profile: {
    totalCoins: number;
    totalQuizzes: number;
  };
  results: Array<{
    questionId: number;
    prompt: string;
    selectedOption: "A" | "B" | "C" | "D" | null;
    correctOption: "A" | "B" | "C" | "D";
    isCorrect: boolean;
    explanation: string | null;
    options: QuizQuestion["options"];
  }>;
  reward: {
    perCorrect: number;
    maxReward: number;
  };
};

type InfoPillProps = {
  label: string;
  value: string;
};

export default function QuizAttemptPage({ params }: QuizPageProps) {
  const { slug } = use(params);

  return (
    <AuthGuard>
      <QuizContent slug={slug} />
    </AuthGuard>
  );
}

type QuizContentProps = {
  slug: string;
};

function QuizContent({ slug }: QuizContentProps) {
  const { address } = useAccount();
  const [selections, setSelections] = useState<
    Record<number, "A" | "B" | "C" | "D">
  >({});
  const [attemptResult, setAttemptResult] =
    useState<QuizAttemptResponse | null>(null);

  const {
    data: quizData,
    isLoading,
    error,
    refetch,
  } = useQuery<QuizFetchResponse>({
    queryKey: ["quiz", slug],
    queryFn: async () => {
      const response = await fetch(`/api/quiz/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to load quiz");
      }
      return (await response.json()) as QuizFetchResponse;
    },
    staleTime: 1000 * 60 * 5,
  });

  const submitMutation = useMutation<
    QuizAttemptResponse,
    Error,
    Record<number, "A" | "B" | "C" | "D">
  >({
    mutationFn: async (currentSelections) => {
      if (!address) {
        throw new Error("Wallet address unavailable");
      }

      const payload = {
        walletAddress: address,
        answers:
          quizData?.questions.map((question) => ({
            questionId: question.id,
            selectedOption: currentSelections[question.id],
          })) ?? [],
      };

      const response = await fetch(`/api/quiz/${slug}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response
          .json()
          .catch(() => ({ error: "Quiz submission failed" }));
        throw new Error(message.error ?? "Quiz submission failed");
      }

      return (await response.json()) as QuizAttemptResponse;
    },
    onSuccess: (data) => {
      setAttemptResult(data);
    },
  });

  const resultMap = useMemo(() => {
    if (!attemptResult) {
      return new Map<number, QuizAttemptResponse["results"][number]>();
    }
    return new Map(
      attemptResult.results.map((result) => [result.questionId, result])
    );
  }, [attemptResult]);

  const handleSelect = (questionId: number, option: "A" | "B" | "C" | "D") => {
    if (attemptResult) {
      return;
    }
    setSelections((prev) => ({ ...prev, [questionId]: option }));
  };

  const allAnswered = useMemo(() => {
    if (!quizData) {
      return false;
    }
    return quizData.questions.every((question) =>
      Boolean(selections[question.id])
    );
  }, [quizData, selections]);

  const handleSubmit = () => {
    if (!(quizData && address)) {
      return;
    }
    if (quizData.questions.some((question) => !selections[question.id])) {
      return;
    }
    submitMutation.mutate(selections);
  };

  const resetQuiz = () => {
    setSelections({});
    setAttemptResult(null);
    refetch().catch(() => null);
  };

  return (
    <main className="relative z-10 mx-auto h-screen w-full max-w-4xl overflow-scroll border bg-background pb-16">
      <div className="container mx-auto max-w-4xl p-6 md:p-10">
        <nav className="mb-8 flex items-center justify-between">
          <Button asChild size="sm" variant="ghost">
            <Link href={`/feed/${slug}`}>Back to Article</Link>
          </Button>
          <Badge className="font-medium" variant="secondary">
            5 Question Sprint
          </Badge>
        </nav>

        {isLoading && (
          <Card>
            <CardContent className="space-y-3 py-6">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">
                Quiz unavailable
              </CardTitle>
              <CardDescription>
                We could not load this checkpoint. Try refreshing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="cursor-pointer" onClick={() => refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {quizData && (
          <div className="space-y-8">
            <Card className="rounded-none border border-border shadow-sm">
              <CardHeader className="space-y-3">
                <CardTitle className="text-pretty text-2xl leading-tight md:text-3xl">
                  {quizData.article.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {quizData.article.callToAction ??
                    "Take the clarity checkpoint to earn fresh coins."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="line-clamp-6 text-muted-foreground text-sm leading-relaxed">
                  {quizData.article.description ??
                    "Engage with the quiz to reinforce what you just read and mint fresh conviction."}
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoPill
                    label="Questions"
                    value={`${quizData.quiz.questionCount}`}
                  />
                  <InfoPill
                    label="Per Correct"
                    value={`+${COINS_PER_CORRECT}`}
                  />
                  <InfoPill
                    label="Max Reward"
                    value={`+${quizData.quiz.maxReward}`}
                  />
                </div>

                <div className="border border-primary/20 bg-primary/5 p-4">
                  <p className="text-primary text-xs uppercase tracking-wide">
                    Answer every card before submitting. You can always retry
                    for a higher score.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {quizData.questions.map((question, index) => {
                const result = resultMap.get(question.id);
                const selectedOption =
                  result?.selectedOption ?? selections[question.id] ?? null;
                const correctOption = result?.correctOption;
                return (
                  <Card
                    className="rounded-none border border-border shadow-sm"
                    key={question.id}
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg leading-tight">
                        <span className="text-muted-foreground">
                          Q{index + 1}.
                        </span>{" "}
                        {question.prompt}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {(
                          Object.entries(question.options) as [
                            "A" | "B" | "C" | "D",
                            string,
                          ][]
                        ).map(([optionKey, optionValue]) => {
                          const isSelected = selectedOption === optionKey;
                          const isCorrect = correctOption === optionKey;
                          const showResult = Boolean(result);

                          let buttonClasses = "h-auto min-h-[3rem]";

                          if (showResult && isCorrect) {
                            buttonClasses +=
                              " border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400";
                          } else if (showResult && isSelected && !isCorrect) {
                            buttonClasses +=
                              " border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20";
                          }

                          return (
                            <Button
                              className={`${buttonClasses} h-auto min-h-12 w-full justify-start whitespace-normal px-4 py-3 text-left`}
                              disabled={Boolean(attemptResult)}
                              key={optionKey}
                              onClick={() =>
                                handleSelect(question.id, optionKey)
                              }
                              variant={
                                isSelected && !showResult
                                  ? "default"
                                  : "outline"
                              }
                            >
                              <span className="mr-2.5 shrink-0 self-start font-semibold">
                                {optionKey}
                              </span>
                              <div className="wrap-break-word flex-1 overflow-hidden font-normal leading-snug">
                                {optionValue}
                              </div>
                            </Button>
                          );
                        })}
                      </div>

                      {result?.explanation && (
                        <div className="border bg-muted/40 p-4">
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            <span className="font-semibold">Explanation: </span>
                            {result.explanation}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {attemptResult && (
              <Card className="rounded-none border border-emerald-500/60 bg-emerald-50 shadow-sm dark:bg-emerald-950/20">
                <CardHeader className="space-y-2 pb-2">
                  <CardTitle className="text-emerald-700 dark:text-emerald-400">
                    Score {attemptResult.attempt.score}/
                    {attemptResult.attempt.totalQuestions}
                  </CardTitle>
                  <CardDescription className="text-emerald-600/80 dark:text-emerald-400/70">
                    Session reward +{attemptResult.attempt.coinsAwarded} •
                    Lifetime coins {attemptResult.profile.totalCoins}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3 text-sm">
                  <Badge className="bg-emerald-600 text-emerald-50 dark:bg-emerald-700">
                    Total quizzes {attemptResult.profile.totalQuizzes}
                  </Badge>
                  <Badge className="bg-emerald-600 text-emerald-50 dark:bg-emerald-700">
                    Latest attempt{" "}
                    {new Date(
                      attemptResult.attempt.completedAt
                    ).toLocaleDateString()}
                  </Badge>
                </CardContent>
              </Card>
            )}

            <Card className="rounded-none border border-border shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">
                    {attemptResult ? "What's next?" : "Ready to submit?"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {attemptResult
                      ? "Review your answers or try again for a better score."
                      : "Make sure each question has a selection before locking in your reward."}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {!attemptResult && (
                    <Button
                      className="cursor-pointer sm:flex-1"
                      disabled={
                        Boolean(attemptResult) ||
                        submitMutation.isPending ||
                        !allAnswered
                      }
                      onClick={handleSubmit}
                      size="lg"
                    >
                      {submitMutation.isPending
                        ? "Calculating..."
                        : "Submit Answers"}
                    </Button>
                  )}

                  {attemptResult && (
                    <Button
                      className="cursor-pointer sm:flex-1"
                      onClick={resetQuiz}
                      size="lg"
                    >
                      Retry Quiz
                    </Button>
                  )}

                  <Button
                    asChild
                    className="cursor-pointer sm:flex-1"
                    size="lg"
                    variant="secondary"
                  >
                    <Link href={`/feed/${slug}`}>Back to Article</Link>
                  </Button>

                  <Button
                    asChild
                    className="cursor-pointer bg-transparent sm:flex-1"
                    size="lg"
                    variant="outline"
                  >
                    <Link href="/profile">View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <BottomDock />
    </main>
  );
}

function InfoPill({ label, value }: InfoPillProps) {
  return (
    <div className="border border-border bg-card p-4 text-center shadow-sm transition-shadow hover:shadow-md">
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-2 font-semibold text-foreground text-xl">{value}</p>
    </div>
  );
}
