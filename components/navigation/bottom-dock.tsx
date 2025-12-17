"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Feed", href: "/feed" },
  { label: "Quiz", href: "/quiz" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Profile", href: "/profile" },
];

export function BottomDock() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4">
      <div className="flex items-center justify-between rounded-full border border-border bg-card/80 p-2 backdrop-blur">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Button
              className="cursor-pointer rounded-full"
              key={item.href}
              onClick={() => router.push(item.href)}
              size="sm"
              variant={isActive ? "default" : "ghost"}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
