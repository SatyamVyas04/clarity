"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { type ReactNode, use, useMemo } from "react";
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
import { type CryptoNewsArticle, fetchCryptoNews } from "@/lib/news";
import { MAX_COINS_PER_QUIZ } from "@/lib/quiz";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

type EnhancedArticle = {
  summary: string;
  keyTakeaways: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  sources: Array<{
    id: string;
    title: string;
    url: string;
  }>;
  quiz: {
    callToAction: string;
    questions: Array<{
      prompt: string;
      options: {
        A: string;
        B: string;
        C: string;
        D: string;
      };
      correctOption: "A" | "B" | "C" | "D";
      explanation?: string;
    }>;
  };
};

const INLINE_CITATION_PATTERN = /(\[\[(.*?)\]\])/g;
const INLINE_CITATION_EXTRACT = /^\[\[(.*?)\]\]$/;

async function getEnhancedContent(
  article: CryptoNewsArticle
): Promise<EnhancedArticle> {
  const response = await fetch("/api/enhance-article", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: article.title,
      description: article.description,
      source: article.source_name,
      slug: article.article_id,
      imageUrl: article.image_url,
      sourceLink: article.link,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to enhance article");
  }

  const data = (await response.json()) as EnhancedArticle;
  return data;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = use(params);

  return (
    <AuthGuard>
      <ArticleContent slug={slug} />
    </AuthGuard>
  );
}

function ArticleContent({ slug }: { slug: string }) {
  const { data: articles } = useQuery<CryptoNewsArticle[]>({
    queryKey: ["crypto-news"],
    queryFn: fetchCryptoNews,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  });

  const article = articles?.find((a) => a.article_id === slug);

  const {
    data: enhancedContent,
    isLoading: isEnhancing,
    error: enhanceError,
  } = useQuery<EnhancedArticle>({
    queryKey: ["enhanced-article", slug],
    queryFn: async () => {
      if (!article) {
        throw new Error("Article is unavailable");
      }
      return getEnhancedContent(article);
    },
    enabled: Boolean(article),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });

  const citationLookup = useMemo(() => {
    if (!enhancedContent) {
      return new Map<string, { index: number; domId: string }>();
    }
    return new Map(
      enhancedContent.sources.map((src, idx) => {
        const normalizedId = src.id.trim().toLowerCase();
        return [normalizedId, { index: idx + 1, domId: toDomId(src.id) }];
      })
    );
  }, [enhancedContent]);

  const renderParagraph = (paragraph: string) => {
    const keyRegistry = new Map<string, number>();
    const reserveKey = (value: string) => {
      const count = keyRegistry.get(value) ?? 0;
      keyRegistry.set(value, count + 1);
      return `${value}-${count}`;
    };

    return paragraph.split(INLINE_CITATION_PATTERN).map((segment, index) =>
      renderSegment({
        segment,
        index,
        enhanced: enhancedContent,
        lookup: citationLookup,
        reserveKey,
      })
    );
  };

  if (!article) {
    return (
      <main className="relative z-10 mx-auto h-screen w-full max-w-4xl overflow-scroll border bg-background pb-16">
        <div className="container mx-auto p-6 md:p-10">
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">Article not found.</p>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/feed">Back to Feed</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <BottomDock />
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto h-screen w-full max-w-4xl overflow-scroll border bg-background pb-16">
      <div className="container mx-auto p-6 md:p-10">
        <nav className="mb-8 flex items-center justify-between">
          <Button asChild size="sm" variant="ghost">
            <Link href="/feed">Back to Feed</Link>
          </Button>
          <Badge className="bg-primary text-primary-foreground">
            Premium Briefing
          </Badge>
        </nav>

        <article className="space-y-8">
          {article.image_url && (
            <div
              className="h-64 w-full overflow-hidden rounded-3xl border border-primary bg-secondary shadow-lg md:h-80"
              style={{
                backgroundImage: `url(${article.image_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}

          <header className="space-y-3">
            <h1 className="bg-linear-to-r from-primary to-primary/40 bg-clip-text font-bold text-3xl text-transparent leading-tight md:text-4xl">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-sm">
              {article.source_name && (
                <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                  {article.source_name}
                </span>
              )}
              {article.pubDate && (
                <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                  {formatDate(article.pubDate)}
                </span>
              )}
              {article.coin?.slice(0, 3).map((symbol) => (
                <span
                  className="rounded-full bg-primary px-3 py-1 text-primary-foreground"
                  key={symbol}
                >
                  #{symbol}
                </span>
              ))}
            </div>
          </header>

          {isEnhancing && (
            <Card className="border border-primary bg-secondary">
              <CardContent className="space-y-3 py-6">
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                <p className="text-center text-muted-foreground text-sm">
                  Curating premium analysis...
                </p>
              </CardContent>
            </Card>
          )}

          {enhanceError && (
            <Card className="border border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">
                  AI briefing unavailable
                </CardTitle>
                <CardDescription>
                  Showing the base article details instead.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>{article.description || "No summary provided."}</p>
              </CardContent>
            </Card>
          )}

          {enhancedContent && !isEnhancing && (
            <div className="space-y-8">
              <Card className="border border-primary bg-primary text-primary-foreground shadow-lg">
                <CardHeader>
                  <CardTitle>Executive Summary</CardTitle>
                  <CardDescription className="text-primary-foreground">
                    High-level insight curated by AI Elements intelligence.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{enhancedContent.summary}</p>
                </CardContent>
              </Card>

              <Card className="border border-secondary bg-secondary">
                <CardHeader>
                  <CardTitle>Key Takeaways</CardTitle>
                  <CardDescription>
                    The signals that matter right now.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {enhancedContent.keyTakeaways.map((takeaway) => (
                      <div
                        className="flex items-start gap-3 rounded-xl border border-accent bg-accent p-4 text-accent-foreground"
                        key={takeaway}
                      >
                        <p className="text-sm">{takeaway}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {enhancedContent.sections.map((section) => (
                <Card
                  className="border border-secondary bg-secondary shadow-sm"
                  key={section.heading}
                >
                  <CardHeader>
                    <CardTitle>{section.heading}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={`${section.heading}-p-${index}`}>
                        {renderParagraph(paragraph)}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              ))}

              <Card className="border border-secondary bg-secondary">
                <CardHeader>
                  <CardTitle>Sources</CardTitle>
                  <CardDescription>
                    Curated references backing this analysis.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground text-sm">
                  <ol className="space-y-3">
                    {enhancedContent.sources.map((source, index) => (
                      <li
                        className="flex items-start justify-between gap-4 rounded-xl border border-accent bg-accent p-4 text-accent-foreground"
                        id={toDomId(source.id)}
                        key={source.id}
                      >
                        <div>
                          <p className="font-medium">
                            [{index + 1}] {source.title}
                          </p>
                          <p className="text-xs">{source.url}</p>
                        </div>
                        <Button asChild size="sm" variant="ghost">
                          <a
                            href={source.url}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Open <ArrowUpRight className="ml-1 h-4 w-4" />
                          </a>
                        </Button>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {enhancedContent.quiz && (
                <Card className="border border-primary bg-primary/10">
                  <CardHeader>
                    <CardTitle>Test Your Clarity</CardTitle>
                    <CardDescription>
                      {enhancedContent.quiz.callToAction}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="text-muted-foreground text-sm md:max-w-xl">
                      Wrap the briefing with a rapid quiz and stack up to{" "}
                      {MAX_COINS_PER_QUIZ} coins onto your profile. Five
                      questions, instant rewards.
                    </p>
                    <Button asChild className="cursor-pointer" size="lg">
                      <Link href={`/quiz/${slug}`}>Earn Coins Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Separator />

          <footer className="flex flex-wrap items-center gap-3">
            <Button asChild size="sm" variant="secondary">
              <a href={article.link} rel="noopener noreferrer" target="_blank">
                View Original Source
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/feed">Back to Feed</Link>
            </Button>
          </footer>
        </article>
      </div>
      <BottomDock />
    </main>
  );
}

type InlineCitationProps = {
  href: string;
  index: number;
};

type RenderSegmentOptions = {
  segment: string;
  index: number;
  enhanced: EnhancedArticle | undefined;
  lookup: Map<string, { index: number; domId: string }>;
  reserveKey: (value: string) => string;
};

function renderSegment({
  segment,
  index,
  enhanced,
  lookup,
  reserveKey,
}: RenderSegmentOptions): ReactNode {
  const isMatchSegment = index % 3 === 1;
  const isCapturedValue = index % 3 === 2;

  if (isCapturedValue) {
    return null;
  }

  if (isMatchSegment && enhanced) {
    const citationId = segment.match(INLINE_CITATION_EXTRACT)?.[1]?.trim();
    if (!citationId) {
      return null;
    }
    const match = lookup.get(citationId.toLowerCase());
    if (!match) {
      return null;
    }
    return (
      <InlineCitation
        href={`#${match.domId}`}
        index={match.index}
        key={reserveKey(`cite-${citationId}`)}
      />
    );
  }

  const textValue = segment.length > 0 ? segment : "space";
  return (
    <span className="whitespace-pre-wrap" key={reserveKey(textValue)}>
      {segment}
    </span>
  );
}

function InlineCitation({ href, index }: InlineCitationProps) {
  return (
    <sup className="ml-1 align-super font-semibold text-primary text-xs">
      <a className="hover:underline" href={href}>
        [{index}]
      </a>
    </sup>
  );
}

function formatDate(pubDate: string) {
  const date = new Date(pubDate);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }
  return date.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDomId(value: string) {
  return `source-${value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}
