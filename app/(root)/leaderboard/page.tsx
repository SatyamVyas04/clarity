"use client";

import { Medal, Trophy } from "lucide-react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { BottomDock } from "@/components/navigation/bottom-dock";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LEADERBOARD_DATA = [
  {
    rank: 1,
    name: "Alex Rivera",
    handle: "@arivera",
    score: 2840,
    change: "+12%",
  },
  {
    rank: 2,
    name: "Sarah Chen",
    handle: "@schen_dev",
    score: 2720,
    change: "+8%",
  },
  {
    rank: 3,
    name: "Mike Johnson",
    handle: "@mj_builder",
    score: 2650,
    change: "+5%",
  },
  {
    rank: 4,
    name: "Emily Davis",
    handle: "@edavis",
    score: 2400,
    change: "+2%",
  },
  {
    rank: 5,
    name: "Chris Wilson",
    handle: "@cwilson",
    score: 2100,
    change: "-1%",
  },
  {
    rank: 6,
    name: "Jessica Taylor",
    handle: "@jtaylor",
    score: 1950,
    change: "+4%",
  },
  {
    rank: 7,
    name: "David Brown",
    handle: "@dbrown",
    score: 1800,
    change: "0%",
  },
] as const;

export default function LeaderboardPage() {
  return (
    <AuthGuard>
      <main className="relative z-10 mx-auto h-screen w-full max-w-4xl overflow-scroll border bg-background pb-16">
        <div className="container mx-auto p-6 md:p-10">
          <header className="mx-auto mb-12 space-y-4">
            <h1 className="font-bold text-4xl md:text-5xl">Leaderboard</h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              See who&apos;s climbing the Clarity charts and flexing their
              alpha.
            </p>
          </header>

          <Card className="rounded-none border border-border bg-card">
            <CardHeader>
              <CardTitle>Global Rankings</CardTitle>
              <CardDescription>
                Updated daily based on quiz performance
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border/50">
                {LEADERBOARD_DATA.map((user) => (
                  <li
                    className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
                    key={user.rank}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center font-bold text-muted-foreground">
                        {user.rank === 1 && (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        )}
                        {user.rank === 2 && (
                          <Medal className="h-5 w-5 text-gray-400" />
                        )}
                        {user.rank === 3 && (
                          <Medal className="h-5 w-5 text-amber-700" />
                        )}
                        {user.rank > 3 && (
                          <span className="w-5 text-center">{user.rank}</span>
                        )}
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {user.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-medium leading-none">{user.name}</p>
                        <p className="text-muted-foreground text-sm">
                          {user.handle}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold">{user.score.toLocaleString()}</p>
                      <p
                        className={`text-xs ${
                          user.change.startsWith("+")
                            ? "text-green-500"
                            : // biome-ignore lint/style/noNestedTernary: Basic ternary usage
                              user.change.startsWith("-")
                              ? "text-red-500"
                              : "text-muted-foreground"
                        }`}
                      >
                        {user.change}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <BottomDock />
      </main>
    </AuthGuard>
  );
}
