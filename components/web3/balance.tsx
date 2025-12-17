"use client";

import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Balance() {
  const { address } = useAccount();
  const { data, isLoading, error } = useBalance({ address });

  if (!address) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error: {error.message}</div>}
        {data && (
          <div className="font-bold text-2xl">
            {Number(formatUnits(data.value, data.decimals)).toFixed(4)}{" "}
            {data.symbol}
          </div>
        )}
        <div className="mt-2 break-all text-muted-foreground text-sm">
          {address}
        </div>
      </CardContent>
    </Card>
  );
}
