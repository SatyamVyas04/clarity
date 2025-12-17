"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo } from "react";
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
import { Separator } from "@/components/ui/separator";
import { MAX_COINS_PER_QUIZ, type QuizHistorySummary } from "@/lib/quiz";

export default function QuizPage() {
  return (
    <AuthGuard>
      <QuizDashboard />
    </AuthGuard>
  );
}

function QuizDashboard() {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useQuery<QuizHistorySummary>({
    queryKey: ["quiz-history", address],
    queryFn: async () => {
      if (!address) {
        throw new Error("Address missing");
      }
      const params = new URLSearchParams({ walletAddress: address });
      const response = await fetch(`/api/quiz/history?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to load quiz history");
      }
      return (await response.json()) as QuizHistorySummary;
    },
    enabled: Boolean(address),
    staleTime: 1000 * 60,
  });

  const primaryStat = useMemo(() => {
    if (!data) {
      return { coins: 0, attempts: 0 };
    }
    return {
      coins: data.profile.totalCoins,
      attempts: data.profile.totalQuizzes,
    };
  }, [data]);
  return (
    <main className="relative z-10 mx-auto h-screen w-full max-w-4xl overflow-scroll border bg-background pb-16">
      <div className="container mx-auto max-w-4xl p-6 md:p-10">
        <header className="mb-12 space-y-4">
          <h1 className="font-bold text-4xl md:text-5xl">Clarity Quizzes</h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Stack knowledge and coins across every checkpoint. Track your
            momentum below.
          </p>
        </header>

        {address ? (
          <div className="space-y-10">
            <Card className="rounded-none border border-border shadow-sm">
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">Your Scoreboard</CardTitle>
                  <CardDescription>
                    {primaryStat.attempts} completed{" "}
                    {primaryStat.attempts === 1 ? "quiz" : "quizzes"} •{" "}
                    {primaryStat.coins} coins banked
                  </CardDescription>
                </div>
                <Badge className="bg-primary text-primary-foreground">
                  +{MAX_COINS_PER_QUIZ} per session
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <StatBlock
                    label="Total Coins"
                    value={primaryStat.coins.toString()}
                  />
                  <StatBlock
                    label="Quizzes Completed"
                    value={primaryStat.attempts.toString()}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="flex-1 cursor-pointer sm:flex-none"
                    size="lg"
                  >
                    <Link href="/feed">Find a new article</Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 cursor-pointer sm:flex-none"
                    size="lg"
                    variant="outline"
                  >
                    <Link href="/profile">View profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {isLoading && (
              <Card className="rounded-none border border-border">
                <CardContent className="space-y-3 py-6">
                  <div className="h-4 w-2/3 animate-pulse bg-muted" />
                  <div className="h-3 w-3/4 animate-pulse bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse bg-muted" />
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className="rounded-none border border-destructive/60">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Unable to load history
                  </CardTitle>
                  <CardDescription>
                    Refresh or retry in a moment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="cursor-pointer" onClick={() => refetch()}>
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}

            {data && data.attempts.length === 0 && (
              <Card className="rounded-none border border-border bg-secondary/40 shadow-sm">
                <CardHeader>
                  <CardTitle>Dive into your first quiz</CardTitle>
                  <CardDescription>
                    Head to the feed, pick a briefing, and unlock your first
                    reward.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="cursor-pointer" size="lg">
                    <Link href="/feed">Browse articles</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {data && data.attempts.length > 0 && (
              <div className="space-y-4">
                {data.attempts.map((attempt) => (
                  <Card
                    className="rounded-none border border-border shadow-sm"
                    key={attempt.id}
                  >
                    <CardHeader className="gap-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg">
                          {attempt.title}
                        </CardTitle>
                        <Badge variant="secondary">
                          +{attempt.coinsAwarded} coins
                        </Badge>
                      </div>
                      <CardDescription className="text-muted-foreground text-sm">
                        {formatCompletedAt(attempt.completedAt)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-muted-foreground text-sm">
                        Score {attempt.score}/{attempt.totalQuestions}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <Button
                          asChild
                          className="flex-1 cursor-pointer sm:flex-none"
                          size="sm"
                          variant="ghost"
                        >
                          <Link href={`/feed/${attempt.articleSlug}`}>
                            Review article
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="flex-1 cursor-pointer sm:flex-none"
                          size="sm"
                        >
                          <Link href={`/quiz/${attempt.articleSlug}`}>
                            Retake quiz
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Card className="rounded-none border border-border shadow-sm">
            <CardHeader>
              <CardTitle>Connect wallet to continue</CardTitle>
              <CardDescription>
                Head back to the homepage and link your wallet to unlock
                quizzes.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <Separator className="my-10" />
      </div>
      <BottomDock />
    </main>
  );
}

type StatBlockProps = {
  label: string;
  value: string;
};

function StatBlock({ label, value }: StatBlockProps) {
  return (
    <div className="rounded-none border border-border bg-card px-5 py-5 text-center shadow-sm">
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-2 font-semibold text-3xl text-foreground">{value}</p>
    </div>
  );
}

function formatCompletedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "recently";
  }
  return date.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
