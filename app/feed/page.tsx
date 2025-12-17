"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/auth-guard";
import { BottomDock } from "@/components/navigation/bottom-dock";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type CryptoNewsArticle, fetchCryptoNews } from "@/lib/news";

const SKELETON_KEYS = [
  "feed-skeleton-1",
  "feed-skeleton-2",
  "feed-skeleton-3",
  "feed-skeleton-4",
];

export default function FeedPage() {
  return (
    <AuthGuard>
      <FeedContent />
    </AuthGuard>
  );
}

function FeedContent() {
  const {
    data: articles,
    isLoading: isNewsLoading,
    error: newsError,
  } = useQuery<CryptoNewsArticle[]>({
    queryKey: ["crypto-news"],
    queryFn: fetchCryptoNews,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });

  const hasArticles = Boolean(articles?.length);
  const shouldShowArticles = hasArticles && !isNewsLoading && !newsError;

  return (
    <main className="min-h-screen bg-background pb-28">
      <div className="container mx-auto flex flex-col gap-10 p-6 md:p-10">
        <header className="my-12 space-y-2 text-center">
          <h1 className="font-bold text-4xl md:text-5xl">The Feed</h1>
          <p className="text-lg text-muted-foreground italic">
            &ldquo;The market is a device for transferring money from the
            impatient to the patient.&rdquo;
          </p>
        </header>

        <section className="space-y-6">
          {isNewsLoading && (
            <div className="grid gap-6 md:grid-cols-2">
              {SKELETON_KEYS.map((key) => (
                <Card className="animate-pulse" key={key}>
                  <div className="h-40 rounded-t-lg bg-muted" />
                  <CardContent className="space-y-3 py-4">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-3 w-2/3 rounded bg-muted" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {newsError && (
            <Card>
              <CardContent className="py-6">
                <p className="text-destructive">
                  Failed to load news. Please try again shortly.
                </p>
              </CardContent>
            </Card>
          )}

          {shouldShowArticles && (
            <div className="grid gap-6 md:grid-cols-2">
              {(articles ?? []).slice(0, 10).map((article) => (
                <Card
                  className="flex h-full flex-col pt-0"
                  key={article.article_id}
                >
                  {article.image_url ? (
                    <div
                      className="h-50 w-full overflow-hidden rounded-t-lg bg-muted"
                      style={{
                        backgroundImage: `url(${article.image_url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <div className="h-44 w-full rounded-t-lg bg-muted" />
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <CardDescription>
                      {formatDescription(article.description)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                      {article.source_name && (
                        <span>{article.source_name}</span>
                      )}
                      {article.pubDate && (
                        <span>{formatDate(article.pubDate)}</span>
                      )}
                      {article.coin?.slice(0, 2).map((symbol) => (
                        <span
                          className="rounded-full bg-primary/10 px-2 py-0.5 text-primary"
                          key={symbol}
                        >
                          #{symbol}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm">
                        <Link href={`/feed/${article.article_id}`}>
                          Read Article
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="secondary">
                        <a
                          href={article.link}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          View Source
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
      <BottomDock />
    </main>
  );
}

function formatDescription(description: string | null) {
  if (!description) {
    return "No summary provided.";
  }
  if (description.length <= 160) {
    return description;
  }
  return `${description.slice(0, 157)}…`;
}

function formatDate(pubDate: string) {
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
