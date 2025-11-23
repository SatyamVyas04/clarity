import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type React from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clarity - Verified Crisis Intelligence",
  description:
    "AI-powered news verification with transparent bias analysis, contextual summaries, and real-time market correlations. Combat misinformation during global crises.",
  keywords: [
    "misinformation detection",
    "AI fact-checking",
    "news verification",
    "crisis intelligence",
    "bias detection",
  ],
  authors: [{ name: "Clarity" }],
  openGraph: {
    type: "website",
    url: "https://clarity.news",
    title: "Clarity - Verified Crisis Intelligence",
    description:
      "AI-powered news verification with transparent bias analysis and market-aware alerts.",
    siteName: "Clarity",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clarity - Verified Crisis Intelligence",
    description:
      "Combat misinformation with AI-powered verification and transparent insights.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", geist.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
