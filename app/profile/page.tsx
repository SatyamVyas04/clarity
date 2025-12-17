"use client";

import { formatUnits } from "viem";
import { useAccount, useBalance, useDisconnect, useEnsName } from "wagmi";
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
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName, isError: isEnsError } = useEnsName({ address });
  const {
    data: balance,
    isLoading: balanceLoading,
    isError: isBalanceError,
  } = useBalance({ address });

  const handleDisconnect = () => {
    try {
      disconnect();
    } catch {
      // Fail silently if disconnect throws, or handle error appropriately
    }
  };

  // AuthGuard ensures we're connected, but TypeScript needs the check
  if (!address) {
    return null;
  }

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const formattedBalance = balance
    ? `${Number(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}`
    : "0.0000 ETH";

  return (
    <main className="min-h-screen bg-background pb-28">
      <div className="container mx-auto flex max-w-2xl flex-col gap-6 p-6 md:p-10">
        <header className="space-y-2 text-center">
          <h1 className="font-bold text-3xl md:text-4xl">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your wallet and account settings
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Wallet Details</CardTitle>
            <CardDescription>
              Connected via {connector?.name ?? "Unknown"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-sm">
                Address
              </p>
              <p className="break-all font-mono text-sm">{address}</p>
            </div>

            {ensName && !isEnsError && (
              <div className="space-y-1">
                <p className="font-medium text-muted-foreground text-sm">
                  ENS Name
                </p>
                <p className="font-semibold text-lg">{ensName}</p>
              </div>
            )}

            <Separator />

            <div className="space-y-1">
              <p className="font-medium text-muted-foreground text-sm">
                Balance
              </p>
              <BalanceDisplay
                formattedBalance={formattedBalance}
                isError={isBalanceError}
                isLoading={balanceLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-medium text-muted-foreground text-sm">
                Display Name
              </p>
              <p className="mt-1 font-semibold">
                {ensName ?? shortenedAddress}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="font-medium text-muted-foreground text-sm">
                Network
              </p>
              <p className="mt-1 font-semibold">Ethereum Mainnet</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Actions here cannot be undone easily
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row">
            <Button
              className="flex-1 cursor-pointer"
              onClick={handleDisconnect}
              size="lg"
              variant="destructive"
            >
              Disconnect Wallet
            </Button>
            <Button
              className="flex-1 cursor-pointer"
              onClick={handleDisconnect}
              size="lg"
              variant="outline"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
      <BottomDock />
    </main>
  );
}

type BalanceDisplayProps = {
  isLoading: boolean;
  isError: boolean;
  formattedBalance: string;
};

function BalanceDisplay({
  isLoading,
  isError,
  formattedBalance,
}: BalanceDisplayProps) {
  if (isLoading) {
    return <div className="h-8 w-32 animate-pulse rounded bg-muted" />;
  }
  if (isError) {
    return <p className="text-destructive text-sm">Failed to load balance</p>;
  }
  return <p className="font-bold text-2xl">{formattedBalance}</p>;
}
