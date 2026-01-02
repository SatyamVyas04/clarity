import { WEB3AUTH_NETWORK, type Web3AuthOptions } from "@web3auth/modal";
import type { Web3AuthContextConfig } from "@web3auth/modal/react";

const clientId = process.env.WEB3AUTH_CLIENT_ID;

if (!clientId) {
  throw new Error(
    "WEB3AUTH_CLIENT_ID environment variable is required"
  );
}

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  ssr: true,
};

const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions,
};

export default web3AuthContextConfig;
