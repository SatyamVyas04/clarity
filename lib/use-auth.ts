"use client";

import { useWeb3Auth } from "@web3auth/modal/react";
import { useAccount } from "wagmi";

export type AuthStatus =
  | "initializing" // Web3Auth is still loading
  | "connecting" // Actively connecting to wallet
  | "connected" // Fully authenticated
  | "disconnected"; // Not authenticated

export type UseAuthReturn = {
  /** Current authentication status */
  status: AuthStatus;
  /** Whether the auth system is still initializing */
  isInitializing: boolean;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether we're in a loading state (initializing or connecting) */
  isLoading: boolean;
  /** Wallet address if connected */
  address: `0x${string}` | undefined;
};

/**
 * Custom hook that combines Web3Auth initialization state with wagmi connection status.
 * This prevents race conditions on page refresh by waiting for Web3Auth to finish
 * rehydrating from cookies before making auth decisions.
 */
export function useAuth(): UseAuthReturn {
  const { isInitialized, isInitializing: web3AuthInitializing } = useWeb3Auth();
  const { status: wagmiStatus, address } = useAccount();

  // Determine the combined auth status
  let status: AuthStatus;

  // If Web3Auth hasn't initialized yet, we're still in the initializing phase
  if (!isInitialized || web3AuthInitializing) {
    status = "initializing";
  } else if (wagmiStatus === "connecting" || wagmiStatus === "reconnecting") {
    status = "connecting";
  } else if (wagmiStatus === "connected") {
    status = "connected";
  } else {
    status = "disconnected";
  }

  return {
    status,
    isInitializing: !isInitialized || web3AuthInitializing,
    isAuthenticated: status === "connected",
    isLoading: status === "initializing" || status === "connecting",
    address,
  };
}
