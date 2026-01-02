# Clarity

A Web3 news portal that rewards users for reading and learning about cryptocurrency and blockchain technology. Clarity combines curated news with gamified learning through quizzes, allowing users to earn crypto tokens while staying informed about the latest trends in Web3, DeFi, and NFTs.

## What is Clarity?

Clarity is a read-to-earn platform that transforms how people consume Web3 news. Instead of just scrolling through content, users read articles, verify their knowledge through quick quizzes, and earn CLARITY tokens as rewards. The platform combines AI-powered news verification, transparent bias analysis, and community-driven content curation to combat misinformation during global crises.

## Key Features

- **Read to Earn**: Complete articles and take quizzes to earn CLARITY tokens instantly
- **Curated Web3 News**: Get the latest updates on DeFi trends, NFT mints, and blockchain developments
- **Gamified Learning**: Level up your profile, earn badges, and compete on leaderboards
- **AI-Powered Verification**: Community and AI verify projects to protect against scams
- **NFT Achievements**: Mint exclusive soulbound tokens for completing learning tracks
- **DAO Governance**: Use earned tokens to vote on news coverage and treasury management
- **Launchpad Access**: Top learners get early whitelist access to vetted projects and airdrops
- **Reward Multipliers**: Premium membership offers 2x rewards and exclusive benefits

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Web3**: wagmi, viem, Web3Auth for wallet integration
- **AI**: Perplexity AI SDK for content generation and verification
- **Database**: Neon (PostgreSQL)
- **3D Graphics**: Three.js with React Three Fiber
- **State Management**: TanStack Query
- **Code Quality**: Biome with Ultracite preset

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SatyamVyas04/clarity.git
cd clarity
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `pnpm dev` - Start the development server with Turbopack
- `pnpm build` - Build the production application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint checks

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/components` - Reusable React components (UI, navigation, auth, web3)
- `/lib` - Utility functions and hooks
- `/public` - Static assets

## License

Copyright 2025 Clarity. All rights reserved.
