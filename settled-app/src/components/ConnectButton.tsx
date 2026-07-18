"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import type { Connector } from "wagmi";
import { shortAddress } from "@/lib/format";
import { monadTestnet } from "@/lib/chains";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      providers?: Array<{ isMetaMask?: boolean }>;
    };
  }
}

function hasInjectedProvider(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.ethereum);
}

function pickInjectedConnector(connectors: readonly Connector[]): Connector | undefined {
  return (
    connectors.find((c) => c.id === "injected") ??
    connectors.find((c) => c.type === "injected") ??
    connectors.find((c) => c.name.toLowerCase().includes("metaMask".toLowerCase())) ??
    connectors[0]
  );
}

async function ensureMonadNetwork(): Promise<void> {
  const ethereum = window.ethereum;
  if (!ethereum?.request) return;

  const chainIdHex = `0x${monadTestnet.id.toString(16)}`;
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  } catch (err) {
    const code = (err as { code?: number })?.code;
    // 4902 = chain not added
    if (code === 4902 || code === -32603) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: chainIdHex,
            chainName: monadTestnet.name,
            nativeCurrency: monadTestnet.nativeCurrency,
            rpcUrls: [monadTestnet.rpcUrls.default.http[0]],
            blockExplorerUrls: monadTestnet.blockExplorers?.default?.url
              ? [monadTestnet.blockExplorers.default.url]
              : [],
          },
        ],
      });
    } else {
      throw err;
    }
  }
}

export function ConnectButton() {
  const { address, isConnected, chainId } = useAccount();
  const { connectAsync, connectors, isPending, error, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const [mounted, setMounted] = useState(false);
  const [providerReady, setProviderReady] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMounted(true);
    setProviderReady(hasInjectedProvider());

    // Re-check after a short delay (extensions inject late)
    const t = window.setTimeout(() => {
      setProviderReady(hasInjectedProvider());
    }, 800);
    return () => window.clearTimeout(t);
  }, []);

  const connector = useMemo(
    () => pickInjectedConnector(connectors),
    [connectors]
  );

  const onConnect = useCallback(async () => {
    setLocalError(null);
    reset();

    if (!hasInjectedProvider()) {
      setLocalError("No wallet found. Install MetaMask, then refresh.");
      window.open("https://metamask.io/download/", "_blank", "noopener,noreferrer");
      return;
    }

    if (!connector) {
      setLocalError("Wallet connector unavailable. Refresh the page.");
      return;
    }

    setBusy(true);
    try {
      await connectAsync({
        connector,
        chainId: monadTestnet.id,
      });
      try {
        await ensureMonadNetwork();
      } catch {
        // connect succeeded; network switch can be done via UI button
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to connect";
      if (/provider not found/i.test(msg)) {
        setLocalError(
          "Wallet provider not found. Unlock MetaMask, allow this site, then refresh."
        );
      } else if (/rejected|denied/i.test(msg)) {
        setLocalError("Connection rejected in wallet.");
      } else {
        setLocalError(msg);
      }
    } finally {
      setBusy(false);
    }
  }, [connectAsync, connector, reset]);

  const onSwitch = useCallback(async () => {
    setLocalError(null);
    setBusy(true);
    try {
      await ensureMonadNetwork();
      await switchChainAsync({ chainId: monadTestnet.id });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not switch network";
      setLocalError(msg);
    } finally {
      setBusy(false);
    }
  }, [switchChainAsync]);

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
        <div className="flex flex-col items-end gap-1">
          <button
            type="button"
            className="btn-primary"
            disabled={isSwitching || busy}
            onClick={onSwitch}
          >
            {isSwitching || busy ? "Switching…" : "Switch to Monad"}
          </button>
          {(localError || error) && (
            <p className="max-w-[220px] text-right text-xs text-red-400">
              {localError ?? error?.message}
            </p>
          )}
        </div>
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

  const label = isPending || busy
    ? "Connecting…"
    : !providerReady
      ? "Install wallet"
      : "Connect";

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        className="btn-primary"
        disabled={isPending || busy}
        onClick={onConnect}
      >
        {label}
      </button>
      {(localError || error) && (
        <p className="max-w-[240px] text-right text-xs text-red-400">
          {localError ?? error?.message}
        </p>
      )}
      {!providerReady && !localError && (
        <p className="max-w-[240px] text-right text-xs text-muted">
          Needs a browser wallet (MetaMask).
        </p>
      )}
    </div>
  );
}
