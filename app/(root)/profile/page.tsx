"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { formatUnits } from "viem";
import { useAccount, useBalance, useDisconnect, useEnsName } from "wagmi";
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

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName, isError: isEnsError } = useEnsName({ address });
  const {
    data: balance,
    isLoading: balanceLoading,
    isError: isBalanceError,
  } = useBalance({ address });

  const {
    data: quizSummary,
    isLoading: isQuizLoading,
    error: quizError,
    refetch: refetchQuiz,
  } = useQuery<QuizHistorySummary>({
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

  const handleDisconnect = () => {
    try {
      disconnect();
    } catch {
      // Fail silently if disconnect throws, or handle error appropriately
    }
  };

  // AuthGuard ensures we're connected, but TypeScript needs the check
  if (!address) {
    return null;
  }

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const formattedBalance = balance
    ? `${Number(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}`
    : "0.0000 ETH";

  return (
    <main className="relative z-10 mx-auto h-screen w-full max-w-4xl overflow-scroll border bg-background pb-16">
      <div className="container mx-auto flex max-w-4xl flex-col gap-6 p-6 md:p-10">
        <header className="mb-6 space-y-4">
          <h1 className="font-bold text-4xl md:text-5xl">Your Profile</h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            Manage your wallet and account settings
          </p>
        </header>

        <Card className="rounded-none border border-border shadow-sm">
          <CardHeader>
            <CardTitle>Wallet Details</CardTitle>
            <CardDescription>
              Connected via {connector?.name ?? "Unknown"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-sm">
                Address
              </p>
              <p className="break-all font-mono text-sm">{address}</p>
            </div>

            {ensName && !isEnsError && (
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  ENS Name
                </p>
                <p className="font-semibold text-lg">{ensName}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-sm">
                Balance
              </p>
              <BalanceDisplay
                formattedBalance={formattedBalance}
                isError={isBalanceError}
                isLoading={balanceLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border border-border shadow-sm">
          <CardHeader>
            <CardTitle>Quick Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="border border-border bg-muted/40 p-4 text-center">
              <p className="font-medium text-muted-foreground text-sm">
                Display Name
              </p>
              <p className="mt-1 font-semibold">
                {ensName ?? shortenedAddress}
              </p>
            </div>
            <div className="border border-border bg-muted/40 p-4 text-center">
              <p className="font-medium text-muted-foreground text-sm">
                Network
              </p>
              <p className="mt-1 font-semibold">Ethereum Mainnet</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border border-border shadow-sm">
          <CardHeader>
            <CardTitle>Clarity Coins</CardTitle>
            <CardDescription>
              Track quiz rewards and recent checkpoints.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isQuizLoading && (
              <div className="space-y-3">
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
              </div>
            )}

            {quizError && (
              <div className="space-y-3">
                <p className="text-destructive text-sm">
                  Failed to load quiz stats. Try again in a moment.
                </p>
                <Button
                  className="cursor-pointer"
                  onClick={() => refetchQuiz()}
                  size="sm"
                >
                  Retry
                </Button>
              </div>
            )}

            {quizSummary && (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatTile
                    label="Total Coins"
                    value={quizSummary.profile.totalCoins}
                  />
                  <StatTile
                    label="Quizzes Completed"
                    value={quizSummary.profile.totalQuizzes}
                  />
                  <StatTile
                    label="Max Coins per Quiz"
                    value={MAX_COINS_PER_QUIZ}
                  />
                </div>
                <Separator />
                <div className="space-y-3">
                  <p className="font-medium text-sm">Recent quizzes</p>
                  {quizSummary.attempts.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No attempts recorded yet. Explore the feed to earn your
                      first coins.
                    </p>
                  ) : (
                    quizSummary.attempts
                      .slice(0, 3)
                      .map(
                        (attempt: QuizHistorySummary["attempts"][number]) => (
                          <div
                            className="border border-border bg-muted/40 p-4 shadow-sm"
                            key={attempt.id}
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-semibold text-sm">
                                  {attempt.title}
                                </p>
                              </div>
                              <Badge variant="outline">
                                +{attempt.coinsAwarded} coins
                              </Badge>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                              <p className="text-muted-foreground text-xs">
                                Score {attempt.score}/{attempt.totalQuestions} •{" "}
                                {formatCompletedAt(attempt.completedAt)}
                              </p>
                              <div>
                                <Button
                                  asChild
                                  className="flex-1 cursor-pointer sm:flex-none"
                                  size="sm"
                                  variant="ghost"
                                >
                                  <Link href={`/feed/${attempt.articleSlug}`}>
                                    Review
                                  </Link>
                                </Button>
                                <Button
                                  asChild
                                  className="flex-1 cursor-pointer sm:flex-none"
                                  size="sm"
                                >
                                  <Link href={`/quiz/${attempt.articleSlug}`}>
                                    Retake
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      )
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    className="flex-1 cursor-pointer sm:flex-none"
                    size="sm"
                  >
                    <Link href="/quiz">Open quiz hub</Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 cursor-pointer sm:flex-none"
                    size="sm"
                    variant="outline"
                  >
                    <Link href="/feed">Browse articles</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-none border border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Actions here cannot be undone easily
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-between gap-4 sm:flex-row">
            <Button
              className="flex-1 cursor-pointer py-2"
              onClick={handleDisconnect}
              size="lg"
              variant="destructive"
            >
              Disconnect Wallet
            </Button>
            <Button
              className="flex-1 cursor-pointer py-2"
              onClick={handleDisconnect}
              size="lg"
              variant="outline"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
      <BottomDock />
    </main>
  );
}

type StatTileProps = {
  label: string;
  value: number;
};

function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="rounded-none border border-border bg-card px-4 py-3 text-center shadow-sm">
      <p className="text-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1 font-bold text-xl">{value}</p>
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
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type BalanceDisplayProps = {
  isLoading: boolean;
  isError: boolean;
  formattedBalance: string;
};

function BalanceDisplay({
  isLoading,
  isError,
  formattedBalance,
}: BalanceDisplayProps) {
  if (isLoading) {
    return <div className="h-8 w-32 animate-pulse rounded bg-muted" />;
  }
  if (isError) {
    return <p className="text-destructive text-sm">Failed to load balance</p>;
  }
  return <p className="font-bold text-2xl">{formattedBalance}</p>;
}
