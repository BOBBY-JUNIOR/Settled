import { http, createConfig, createStorage, cookieStorage, injected } from "wagmi";
import { monadTestnet } from "./chains";

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [
    injected({
      shimDisconnect: true,
      // Wait for MetaMask / other wallets that inject after page load
      unstable_shimAsyncInject: 2_500,
    }),
  ],
  transports: {
    [monadTestnet.id]: http(
      process.env.NEXT_PUBLIC_MONAD_RPC ?? "https://testnet-rpc.monad.xyz"
    ),
  },
  ssr: true,
  multiInjectedProviderDiscovery: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
