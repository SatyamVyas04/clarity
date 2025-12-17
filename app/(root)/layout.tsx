"use client";

import Dither from "@/components/bits/dither";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span>
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
      {children}
    </span>
  );
}
