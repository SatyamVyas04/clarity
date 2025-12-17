import { AuthGuard } from "@/components/auth/auth-guard";
import { BottomDock } from "@/components/navigation/bottom-dock";

export default function QuizPage() {
  return (
    <AuthGuard>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8 pb-28 text-center">
        <h1 className="font-bold text-3xl">Quizzes launching soon</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Stay tuned while we craft on-chain knowledge challenges to boost your
          Clarity XP.
        </p>
        <BottomDock />
      </main>
    </AuthGuard>
  );
}
