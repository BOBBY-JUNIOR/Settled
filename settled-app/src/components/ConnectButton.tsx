"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { shortAddress } from "@/lib/format";
import { monadTestnet } from "@/lib/chains";

export function ConnectButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button type="button" className="btn-secondary" disabled>
        Connect
      </button>
    );
  }

  if (isConnected && address) {
    const wrongNetwork = chainId !== monadTestnet.id;

    if (wrongNetwork) {
      return (
        <button
          type="button"
          className="btn-primary"
          disabled={isSwitching}
          onClick={() => switchChain({ chainId: monadTestnet.id })}
        >
          {isSwitching ? "Switching…" : "Switch to Monad"}
        </button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span className="hidden rounded-md border border-white/10 px-2.5 py-1.5 font-mono text-xs text-muted sm:inline">
          {shortAddress(address)}
        </span>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    );
  }

  const connector = connectors[0];

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        className="btn-primary"
        disabled={isPending || !connector}
        onClick={() => connector && connect({ connector })}
      >
        {isPending ? "Connecting…" : "Connect"}
      </button>
      {error && (
        <p className="max-w-[200px] text-right text-xs text-red-400">
          {error.message}
        </p>
      )}
    </div>
  );
}
