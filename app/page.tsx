/** biome-ignore-all lint/suspicious/noArrayIndexKey: All ids are being used properly */
"use client";

import {
  BookOpen,
  Coins,
  Gamepad2,
  Rocket,
  Shield,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";
import CountUp from "@/components/bits/CountUp";
import Dither from "@/components/bits/dither";
import GlareHover from "@/components/bits/GlareHover";
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
      title: "Daily Alpha Drops",
      description:
        "Get the hottest Web3 news, DeFi trends, and NFT mints delivered instantly to your feed.",
    },
    {
      icon: <Coins className="h-5 w-5" />,
      title: "Read to Earn",
      description:
        "Don't just scroll. Complete articles, take a quick quiz, and earn $CLARITY tokens instantly.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Rug Pull Protection",
      description:
        "Our community and AI verify projects so you can ape in safely without fear of scams.",
    },
    {
      icon: <Gamepad2 className="h-5 w-5" />,
      title: "Gamified Learning",
      description:
        "Level up your profile, earn badges, and compete on leaderboards by mastering crypto concepts.",
    },
    {
      icon: <Rocket className="h-5 w-5" />,
      title: "Launchpad Access",
      description:
        "Top learners get early whitelist access to vetted projects and exclusive airdrops.",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "DAO Governance",
      description:
        "Use your earned tokens to vote on which news stories we cover and how the treasury is spent.",
    },
  ];

  const advancedFeatures = [
    {
      title: "Quiz & Earn",
      description:
        "Finish an article? Prove it. Answer 3 questions correctly to unlock the token reward for that post. It's that simple.",
    },
    {
      title: "NFT Achievements",
      description:
        "Mint exclusive soulbound tokens (SBTs) when you complete learning tracks like 'DeFi 101' or 'Layer 2 Scaling'.",
    },
    {
      title: "Weekly Leaderboards",
      description:
        "Compete against other readers. Top 100 users every week share a massive prize pool of stablecoins and partner tokens.",
    },
  ];

  const pricingPlans = [
    {
      name: "Explorer",
      price: "$0",
      description: "Start your journey into Web3.",
      features: [
        "Access to daily news",
        "Earn standard rewards",
        "Basic quizzes",
        "Community access",
        "Create personal profile",
      ],
      isPrimary: false,
    },
    {
      name: "Degen Mode",
      price: "$19",
      description: "Maximize your earning potential.",
      features: [
        "2x Reward Multiplier",
        "Exclusive Alpha channels",
        "Priority Whitelist access",
        "Ad-free experience",
        "Premium NFT badge",
        "Governance voting power",
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
        <header className="sticky top-4 z-50 mx-auto w-fit min-w-sm rounded-full border border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 md:min-w-2xl lg:min-w-3xl xl:min-w-4xl">
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
                  <Link href="/login">Connect Wallet</Link>
                </Button>
                <Button asChild className="rounded-full" size="sm">
                  <Link href="/signup">Join Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <Badge className="mx-auto w-fit" variant="secondary">
              Read News. Take Quizzes. Earn Crypto.
            </Badge>
            <h1 className="text-balance font-bold text-5xl tracking-tight sm:text-6xl lg:text-7xl">
              The Web3 News Portal That Pays You
            </h1>
            <p className="text-balance text-secondary-foreground text-sm sm:text-base">
              Stay ahead of the market with curated Web3 news. Verify your
              knowledge with quick quizzes at the end of every article and stack
              rewards instantly.
            </p>
            <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">Start Earning</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#features">How it works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-border border-b bg-muted/50 text-center">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            <div className="space-y-3">
              <p className="font-bold text-3xl text-primary sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                $
                <CountUp
                  className="count-up-text"
                  direction="up"
                  duration={1}
                  from={0}
                  separator=","
                  to={240}
                />
                k+
              </p>
              <p className="text-muted-foreground">
                Total rewards distributed to our community of readers this month
                alone. Knowledge literally pays off.
              </p>
            </div>
            <div className="space-y-3">
              <p className="font-bold text-3xl text-primary sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                <CountUp
                  className="count-up-text"
                  direction="up"
                  duration={1}
                  from={0}
                  separator=","
                  to={15}
                />
                k+
              </p>
              <p className="text-muted-foreground">
                Daily quizzes completed by users, proving that gamified
                education is the future of Web3 adoption.
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
                Level Up Your Portfolio
              </h2>
              <p className="text-muted-foreground">
                Everything you need to stay informed and earn while you learn
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <GlareHover
                  borderRadius="0px"
                  className="m-0 border-none p-0"
                  glareAngle={-30}
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareSize={300}
                  height="full"
                  key={idx}
                  playOnce={false}
                  transitionDuration={800}
                  width="full"
                >
                  <Card className="h-full w-full">
                    <CardHeader>
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded bg-linear-to-br from-primary to-primary/25 text-primary-foreground">
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
                </GlareHover>
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
                The Reward Loop
              </h2>
              <p className="text-muted-foreground">
                How we turn your attention into assets
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {advancedFeatures.map((feat, idx) => (
                <div
                  className="group relative p-4 outline outline-transparent hover:outline-border"
                  key={idx}
                >
                  <div className="absolute top-0 left-0 h-3 w-3 border-transparent border-t border-l transition-all group-hover:border-foreground" />
                  <div className="absolute top-0 right-0 h-3 w-3 border-transparent border-t border-r transition-all group-hover:border-foreground" />
                  <div className="absolute bottom-0 left-0 h-3 w-3 border-transparent border-b border-l transition-all group-hover:border-foreground" />
                  <div className="absolute right-0 bottom-0 h-3 w-3 border-transparent border-r border-b transition-all group-hover:border-foreground" />

                  <h3 className="flex items-center gap-2 font-semibold text-lg xl:text-xl">
                    <Trophy className="h-5 w-5 text-primary" />
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {feat.description}
                  </p>
                </div>
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
              <h2 className="font-bold text-3xl sm:text-4xl">Membership</h2>
              <p className="text-muted-foreground">
                Join for free or upgrade to boost your earning multiplier.
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
                          <Coins className="h-4 w-4 shrink-0 text-primary" />
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
                        {plan.isPrimary ? "Go Degen" : "Start Free"}
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
        <div className="mx-auto max-w-lg space-y-6 px-4 py-16 text-center sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28 xl:py-32">
          <h2 className="font-bold text-3xl sm:text-4xl">WAGMI.</h2>
          <p className="text-muted-foreground">
            Join thousands of learners earning crypto every day. Connect your
            wallet and start your first quest now.
          </p>
          <Button asChild size="lg">
            <Link href="/signup">Launch App</Link>
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
                Whitepaper
              </Link>
              <Link
                className="transition-colors hover:text-foreground"
                href="#"
              >
                Tokenomics
              </Link>
              <Link
                className="transition-colors hover:text-foreground"
                href="#"
              >
                Discord
              </Link>
              <ModeToggle />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
