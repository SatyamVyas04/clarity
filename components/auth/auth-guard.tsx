"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent } from "@/components/ui/card";

type AuthGuardProps = {
  children: ReactNode;
};

/**
 * A wrapper component that protects routes requiring authentication.
 * Handles loading states gracefully to avoid flickering during hydration.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { status } = useAccount();
  const router = useRouter();

  useEffect(() => {
    // Only redirect when explicitly disconnected, not during connecting/reconnecting
    if (status === "disconnected") {
      router.replace("/");
    }
  }, [status, router]);

  // Show loading state during connection/reconnection
  if (status === "connecting" || status === "reconnecting") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <p className="text-muted-foreground text-sm">
              Connecting to wallet...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show redirect message only when disconnected
  if (status === "disconnected") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-sm">
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
