"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/use-auth";

type AuthGuardProps = {
  children: ReactNode;
};

/**
 * A wrapper component that protects routes requiring authentication.
 * Uses the combined Web3Auth + wagmi state to prevent race conditions
 * and avoid flickering during SSR hydration.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { status, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect when we're sure the user is disconnected
    // (not during initialization or active connection attempts)
    if (status === "disconnected") {
      router.replace("/");
    }
  }, [status, router]);

  // Show loading state while Web3Auth initializes or wallet connects
  if (isLoading) {
    return (
      <main className="relative z-10 mx-auto h-screen w-full max-w-4xl overflow-hidden border bg-background pb-16">
        <div className="container mx-auto flex max-w-4xl flex-col p-6 md:p-10">
          {/* Header skeleton */}
          <header className="mb-12 space-y-4">
            <div className="h-12 w-48 animate-pulse rounded bg-muted" />
            <div className="h-6 w-96 animate-pulse rounded bg-muted" />
          </header>

          {/* Content skeleton */}
          <section className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((key) => (
                <Card className="animate-pulse rounded-none" key={key}>
                  <div className="h-40 bg-muted" />
                  <CardContent className="space-y-3 py-4">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-2/3 rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  // Show redirect message only when explicitly disconnected
  if (status === "disconnected") {
    return (
      <div className="relative z-10 flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-sm rounded-none">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <p className="text-muted-foreground text-sm">
              Redirecting to home...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Connected - render children
  return <>{children}</>;
}
