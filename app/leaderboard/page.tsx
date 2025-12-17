import { AuthGuard } from "@/components/auth/auth-guard";
import { BottomDock } from "@/components/navigation/bottom-dock";

export default function LeaderboardPage() {
  return (
    <AuthGuard>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 pb-28 text-center">
        <h1 className="font-bold text-3xl">Leaderboard coming soon</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          We&apos;re preparing ranked challenges so you can climb the Clarity
          charts and flex your alpha.
        </p>
        <BottomDock />
      </main>
    </AuthGuard>
  );
}
