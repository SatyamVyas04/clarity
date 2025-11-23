/** biome-ignore-all lint/suspicious/noArrayIndexKey: All ids are being used properly */
"use client";

import {
  BookOpen,
  Brain,
  CheckCircle2,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Dither from "@/components/sections/dither";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Real-time Aggregation",
      description:
        "Gathers the latest global updates and trends from multiple trusted sources instantly.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Automated Verification",
      description:
        "Cross-references news stories to detect credibility and filter misinformation in seconds.",
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: "Personalized Curation",
      description:
        "Learns your preferences to recommend articles and topics aligned with your interests.",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "Smart Summaries",
      description:
        "AI-powered contextual briefs tailored for different audiences and expertise levels.",
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Market Correlation",
      description:
        "Real-time tracking of how news events move markets and impact financial sectors.",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "Bias Detection",
      description:
        "AI-powered political bias analysis reveals media perspective and helps form balanced opinions.",
    },
  ];

  const advancedFeatures = [
    {
      title: "Smart Summaries",
      description:
        "Get the essence of complex stories in digestible formats. Our AI distills breaking news into clear, actionable insights for everyone.",
    },
    {
      title: "Bias Indicators",
      description:
        "Transparency matters. Our bias indicator reveals whether articles lean left or right, helping you understand the perspective.",
    },
    {
      title: "Market Impact",
      description:
        "See how breaking news moves markets. Track stock impacts, sector trends, and investment implications instantly.",
    },
  ];

  const architectureHighlights = [
    {
      title: "~2 seconds",
      subtitle: "Real-time Processing",
      description:
        "Lightning-fast hoax news detection. News aggregation, credibility verification, and bias analysis all happen in parallel.",
    },
    {
      title: "5 tech layers",
      subtitle: "Core Stack",
      description:
        "Integrated architecture spanning frontend, backend, AI/ML, APIs, and databases with Next.js, Node.js, and more.",
    },
    {
      title: "3 LLM integrations",
      subtitle: "AI Models",
      description:
        "Multi-model approach for news aggregation, bias detection, and summarization including Perplexity and Gemini.",
    },
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      description: "Everything you need to stay informed.",
      features: [
        "Real-time news aggregation",
        "Credibility badges & debunked alerts",
        "Bias indicators",
        "Up to 50 stories/day",
        "Basic summaries",
      ],
      isPrimary: false,
    },
    {
      name: "Pro",
      price: "$9.99",
      description: "Advanced intelligence for power users.",
      features: [
        "Everything in Free",
        "AI-powered summaries",
        "Market correlations",
        "Priority alerts",
        "Unlimited stories",
        "Bias scoring integration",
      ],
      isPrimary: true,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative flex h-screen flex-col overflow-hidden border-border border-b bg-transparent">
        {/* Overlay */}
        <div className="absolute inset-0 z-0 opacity-50 invert-100 dark:invert-0">
          <Dither
            colorNum={5}
            disableAnimation={false}
            enableMouseInteraction={false}
            mouseRadius={0.2}
            waveAmplitude={0.425}
            waveColor={[0.3, 0.3, 0.3]}
            waveFrequency={2}
            waveSpeed={0.05}
          />
        </div>

        {/* Header */}
        <header className="sticky top-4 z-50 mx-auto w-fit min-w-sm rounded-full border-border border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 md:min-w-2xl lg:min-w-3xl xl:min-w-4xl">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <Link className="flex items-center gap-2" href="/">
                <span className="font-semibold">Clarity</span>
              </Link>

              <div className="flex items-center gap-2">
                <Button
                  asChild
                  className="rounded-full"
                  size="sm"
                  variant="ghost"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="rounded-full" size="sm">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <Badge className="mx-auto w-fit" variant="secondary">
              Combat misinformation with AI
            </Badge>
            <h1 className="text-balance font-bold text-5xl tracking-tight sm:text-6xl lg:text-7xl">
              Verified intelligence during crisis
            </h1>
            <p className="text-balance text-secondary-foreground text-sm sm:text-base">
              Real-time fact-checking, transparent bias detection, and
              actionable summaries. Clarity cuts through noise to deliver
              trustworthy information when it matters most.
            </p>
            <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">Start free beta</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#features">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-border border-b bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            <div className="space-y-3">
              <p className="font-bold text-3xl text-primary sm:text-4xl">86%</p>
              <p className="text-muted-foreground">
                of internet users have encountered misinformation online,
                leading to widespread confusion and reduced trust in legitimate
                news sources.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-3xl text-primary sm:text-4xl">64%</p>
              <p className="text-muted-foreground">
                of people struggle to differentiate between verified news and
                false information during major global events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-border border-b" id="features">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="space-y-12">
            <div className="space-y-2 text-center">
              <h2 className="font-bold text-3xl sm:text-4xl">
                Core capabilities
              </h2>
              <p className="text-muted-foreground">
                Everything you need to stay informed and make better decisions
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-linear-to-br from-primary to-primary/80 text-primary-foreground">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Intelligence */}
      <section className="border-border border-b bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="space-y-12">
            <div className="space-y-2 text-center">
              <h2 className="font-bold text-3xl sm:text-4xl">
                Advanced intelligence
              </h2>
              <p className="text-muted-foreground">
                Powerful features for informed decision-making
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {advancedFeatures.map((feat, idx) => (
                <div className="space-y-3" key={idx}>
                  <h3 className="font-semibold text-lg">{feat.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="border-border border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="space-y-12">
            <div className="space-y-2 text-center">
              <h2 className="font-bold text-3xl sm:text-4xl">
                Powerful system architecture
              </h2>
              <p className="text-muted-foreground">
                Built for speed and accuracy
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {architectureHighlights.map((highlight, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle>{highlight.title}</CardTitle>
                    <CardDescription>{highlight.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-border border-b bg-muted/50" id="pricing">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="space-y-12">
            <div className="space-y-2 text-center">
              <h2 className="font-bold text-3xl sm:text-4xl">Simple pricing</h2>
              <p className="text-muted-foreground">
                Choose the plan that fits your needs. Upgrade anytime.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {pricingPlans.map((plan) => (
                <Card
                  className={plan.isPrimary ? "border-2 border-primary" : ""}
                  key={plan.name}
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="font-bold text-4xl">{plan.price}</span>
                      {plan.price !== "$0" && (
                        <span className="text-muted-foreground text-sm">
                          /month
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature, idx) => (
                        <li className="flex items-center gap-2" key={idx}>
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className="w-full"
                      variant={plan.isPrimary ? "default" : "outline"}
                    >
                      <Link href="/signup">
                        {plan.isPrimary ? "Get Pro" : "Start free"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-border border-b">
        <div className="mx-auto max-w-lg space-y-6 px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-bold text-3xl sm:text-4xl">
            Ready to bring clarity?
          </h2>
          <p className="text-muted-foreground">
            Join thousands staying informed during crises. Get started free - no
            credit card required.
          </p>
          <Button asChild size="lg">
            <Link href="/signup">Start your free trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-border border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-muted-foreground text-sm sm:flex-row">
            <span>© 2025 Clarity. All rights reserved.</span>
            <div className="flex items-center gap-6">
              <Link
                className="transition-colors hover:text-foreground"
                href="#"
              >
                Privacy
              </Link>
              <Link
                className="transition-colors hover:text-foreground"
                href="#"
              >
                Terms
              </Link>
              <Link
                className="transition-colors hover:text-foreground"
                href="#"
              >
                Contact
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
