import { defineChain } from "viem";

const rpcUrl =
  process.env.NEXT_PUBLIC_MONAD_RPC ?? "https://testnet-rpc.monad.xyz";
const explorerUrl =
  process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://testnet.monadvision.com";
const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "10143");

export const monadTestnet = defineChain({
  id: chainId,
  name: "Monad Testnet",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "MonadVision",
      url: explorerUrl,
    },
  },
  testnet: true,
});

export const EXPLORER_URL = explorerUrl;
