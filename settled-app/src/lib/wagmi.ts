import { http, createConfig, createStorage, cookieStorage, injected } from "wagmi";
import { monadTestnet } from "./chains";

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [monadTestnet.id]: http(
      process.env.NEXT_PUBLIC_MONAD_RPC ?? "https://testnet-rpc.monad.xyz"
    ),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
