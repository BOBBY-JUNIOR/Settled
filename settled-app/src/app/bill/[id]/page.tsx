"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import type { Address, Hash } from "viem";
import { MotionSection } from "@/components/MotionSection";
import { StatusChip } from "@/components/StatusChip";
import { TxStatus } from "@/components/TxStatus";
import { monadTestnet } from "@/lib/chains";
import {
  BILL_SPLITTER_ABI,
  CONTRACT_ADDRESS,
  explorerAddressUrl,
  explorerTxUrl,
  isContractConfigured,
} from "@/lib/contract";
import {
  bpsToPercent,
  formatMon,
  isSameAddress,
  shareAmount,
  shortAddress,
} from "@/lib/format";

export default function BillDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const billId = useMemo(() => {
    if (!rawId || !/^\d+$/.test(rawId)) return null;
    try {
      return BigInt(rawId);
    } catch {
      return null;
    }
  }, [rawId]);

  const { address, isConnected, chainId } = useAccount();
  const configured = isContractConfigured();
  const [copied, setCopied] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [settleHash, setSettleHash] = useState<Hash | undefined>();
  const [confirmHash, setConfirmHash] = useState<Hash | undefined>();

  const billQuery = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BILL_SPLITTER_ABI,
    functionName: "getBill",
    args: billId !== null ? [billId] : undefined,
    query: {
      enabled: configured && billId !== null,
      refetchInterval: 5_000,
    },
  });

  const fullyConfirmedQuery = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BILL_SPLITTER_ABI,
    functionName: "isFullyConfirmed",
    args: billId !== null ? [billId] : undefined,
    query: {
      enabled: configured && billId !== null,
      refetchInterval: 5_000,
    },
  });

  const bill = billQuery.data;
  const participants = bill?.[3] as Address[] | undefined;
  const shares = bill?.[4] as readonly bigint[] | undefined;
  const settled = Boolean(bill?.[5]);
  const totalAmount = bill?.[2] as bigint | undefined;
  const title = bill?.[1] as string | undefined;
  const creator = bill?.[0] as Address | undefined;
  const fullyConfirmed = Boolean(fullyConfirmedQuery.data);

  const confirmReads = useReadContracts({
    contracts:
      billId !== null && participants
        ? participants.map((p) => ({
            address: CONTRACT_ADDRESS,
            abi: BILL_SPLITTER_ABI,
            functionName: "isConfirmed" as const,
            args: [billId, p] as const,
          }))
        : [],
    query: {
      enabled: Boolean(billId !== null && participants?.length),
      refetchInterval: 5_000,
    },
  });

  const confirmedMap = useMemo(() => {
    const map = new Map<string, boolean>();
    participants?.forEach((p, i) => {
      const result = confirmReads.data?.[i];
      map.set(p.toLowerCase(), Boolean(result?.result));
    });
    return map;
  }, [participants, confirmReads.data]);

  const isUserParticipant = useMemo(() => {
    if (!address || !participants) return false;
    return participants.some((p) => isSameAddress(p, address));
  }, [address, participants]);

  const userConfirmed = address
    ? Boolean(confirmedMap.get(address.toLowerCase()))
    : false;

  const {
    writeContract: writeConfirm,
    data: confirmWriteHash,
    isPending: isConfirmPending,
    error: confirmError,
    reset: resetConfirm,
  } = useWriteContract();

  const {
    writeContract: writeSettle,
    data: settleWriteHash,
    isPending: isSettlePending,
    error: settleError,
    reset: resetSettle,
  } = useWriteContract();

  useEffect(() => {
    if (confirmWriteHash) setConfirmHash(confirmWriteHash);
  }, [confirmWriteHash]);

  useEffect(() => {
    if (settleWriteHash) setSettleHash(settleWriteHash);
  }, [settleWriteHash]);

  const confirmReceipt = useWaitForTransactionReceipt({ hash: confirmHash });
  const settleReceipt = useWaitForTransactionReceipt({ hash: settleHash });

  useEffect(() => {
    if (confirmReceipt.isSuccess) {
      billQuery.refetch();
      fullyConfirmedQuery.refetch();
      confirmReads.refetch();
    }
  }, [confirmReceipt.isSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (settleReceipt.isSuccess) {
      billQuery.refetch();
      fullyConfirmedQuery.refetch();
    }
  }, [settleReceipt.isSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `/bill/${rawId ?? ""}`;

  const copyLink = useCallback(async () => {
    try {
      const url =
        typeof window !== "undefined" ? window.location.href : shareUrl;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setActionError("Could not copy link. Copy it from the address bar.");
    }
  }, [shareUrl]);

  const onConfirm = () => {
    setActionError(null);
    resetConfirm();
    if (!configured || billId === null) return;
    if (!isConnected) {
      setActionError("Connect your wallet to confirm.");
      return;
    }
    if (chainId !== monadTestnet.id) {
      setActionError("Switch to Monad Testnet.");
      return;
    }
    if (!isUserParticipant) {
      setActionError("Only listed participants can confirm this bill.");
      return;
    }
    if (userConfirmed) {
      setActionError("You already confirmed.");
      return;
    }
    if (settled) {
      setActionError("This bill is already settled.");
      return;
    }

    writeConfirm({
      address: CONTRACT_ADDRESS,
      abi: BILL_SPLITTER_ABI,
      functionName: "confirm",
      args: [billId],
    });
  };

  const onSettle = () => {
    setActionError(null);
    resetSettle();
    if (!configured || billId === null || totalAmount === undefined) return;
    if (!isConnected) {
      setActionError("Connect your wallet to settle.");
      return;
    }
    if (chainId !== monadTestnet.id) {
      setActionError("Switch to Monad Testnet.");
      return;
    }
    if (!fullyConfirmed) {
      setActionError("Everyone must confirm before settle.");
      return;
    }
    if (settled) {
      setActionError("Already settled.");
      return;
    }

    writeSettle({
      address: CONTRACT_ADDRESS,
      abi: BILL_SPLITTER_ABI,
      functionName: "settle",
      args: [billId],
      value: totalAmount,
    });
  };

  if (!rawId || billId === null) {
    return (
      <MotionSection index={0} className="card max-w-lg space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Invalid bill</h1>
        <p className="text-sm text-muted">Bill id must be a number.</p>
        <Link href="/" className="btn-secondary inline-flex">
          Home
        </Link>
      </MotionSection>
    );
  }

  if (!configured) {
    return (
      <MotionSection index={0} className="card max-w-lg space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Contract not configured
        </h1>
        <p className="text-sm text-muted">
          Set{" "}
          <code className="font-mono text-xs text-foreground">
            NEXT_PUBLIC_CONTRACT_ADDRESS
          </code>{" "}
          in{" "}
          <code className="font-mono text-xs text-foreground">.env.local</code>.
        </p>
      </MotionSection>
    );
  }

  if (billQuery.isLoading) {
    return (
      <MotionSection index={0} className="card max-w-lg">
        <p className="font-mono text-sm text-muted">Loading bill from chain…</p>
      </MotionSection>
    );
  }

  if (billQuery.isError || !bill) {
    return (
      <MotionSection index={0} className="card max-w-lg space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight">Bill not found</h1>
        <p className="text-sm text-muted">
          No bill with id{" "}
          <span className="font-mono text-foreground">{rawId}</span> on this
          contract.
        </p>
        <Link href="/create" className="btn-primary inline-flex">
          Create a bill
        </Link>
      </MotionSection>
    );
  }

  const confirmedCount = participants
    ? participants.filter((p) => confirmedMap.get(p.toLowerCase())).length
    : 0;

  let statusTone: "pending" | "success" | "warning" = "pending";
  let statusLabel = "Awaiting confirms";
  if (settled) {
    statusTone = "success";
    statusLabel = "Settled";
  } else if (fullyConfirmed) {
    statusTone = "warning";
    statusLabel = "Ready to settle";
  }

  return (
    <div className="page-grid items-start">
      {/* Summary column */}
      <div className="space-y-6 lg:sticky lg:top-24">
        <MotionSection index={0} className="space-y-4">
          <Link
            href="/"
            className="font-mono text-xs text-muted transition-colors duration-200 ease-out hover:text-foreground"
          >
            ← Home
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="display text-[2rem] sm:text-4xl lg:text-[2.75rem]">
                {title}
              </h1>
              <p className="mt-2 font-mono text-xs text-subtle">
                Bill #{rawId}
              </p>
            </div>
            <StatusChip label={statusLabel} tone={statusTone} />
          </div>
        </MotionSection>

        <MotionSection index={1} className="card space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-subtle">
                Total
              </p>
              <p className="mt-1 font-mono text-3xl tracking-tight text-foreground">
                {formatMon(totalAmount ?? 0n)}{" "}
                <span className="text-base text-muted">MON</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[11px] uppercase tracking-wide text-subtle">
                Created by
              </p>
              <a
                href={explorerAddressUrl(creator ?? "")}
                target="_blank"
                rel="noreferrer"
                className="link-accent mt-1 inline-block font-mono text-xs"
              >
                {shortAddress(creator ?? "")}
              </a>
            </div>
          </div>

          <div className="divider" />

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-secondary" onClick={copyLink}>
              {copied ? "Link copied" : "Copy share link"}
            </button>
            <span className="font-mono text-xs text-muted">
              {confirmedCount}/{participants?.length ?? 0} confirmed
            </span>
          </div>
        </MotionSection>
      </div>

      {/* Detail column */}
      <div className="space-y-4">
        <MotionSection index={2} className="card space-y-1">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
            Participants
          </h2>
          <ul className="divide-y divide-white/10">
            {participants?.map((p, i) => {
              const share = shares?.[i] ?? 0n;
              const confirmed = confirmedMap.get(p.toLowerCase());
              const you = isSameAddress(p, address);
              return (
                <li
                  key={p}
                  className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm text-foreground">
                      {shortAddress(p, 6)}
                      {you && (
                        <span className="ml-2 text-xs text-accent">(you)</span>
                      )}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted">
                      {bpsToPercent(share)} ·{" "}
                      {formatMon(shareAmount(totalAmount ?? 0n, share))} MON
                    </p>
                  </div>
                  <StatusChip
                    label={confirmed ? "Confirmed" : "Pending"}
                    tone={confirmed ? "success" : "pending"}
                  />
                </li>
              );
            })}
          </ul>
        </MotionSection>

        {!settled && (
          <MotionSection index={3} className="card space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
              Actions
            </h2>

            {isUserParticipant && !userConfirmed && (
              <div className="space-y-3">
                <p className="text-sm text-muted">
                  You are on this bill. Confirm to lock in the split.
                </p>
                <button
                  type="button"
                  className="btn-primary w-full"
                  onClick={onConfirm}
                  disabled={isConfirmPending || confirmReceipt.isLoading}
                >
                  {isConfirmPending || confirmReceipt.isLoading
                    ? "Confirming…"
                    : "Confirm bill"}
                </button>
                <TxStatus
                  hash={confirmHash}
                  isPending={isConfirmPending}
                  isConfirming={confirmReceipt.isLoading}
                  isSuccess={confirmReceipt.isSuccess}
                  error={confirmError}
                  successLabel="Confirmed"
                />
              </div>
            )}

            {isUserParticipant && userConfirmed && !fullyConfirmed && (
              <p className="text-sm text-muted">
                You&apos;re confirmed. Waiting on the others.
              </p>
            )}

            {!isUserParticipant && isConnected && (
              <p className="text-sm text-muted">
                Connected wallet is not a participant. You can still settle once
                everyone has confirmed (deposit the full total).
              </p>
            )}

            {fullyConfirmed && (
              <div className="space-y-3 border-t border-white/10 pt-4">
                <p className="text-sm text-muted">
                  All participants confirmed. Deposit{" "}
                  <span className="font-mono text-foreground">
                    {formatMon(totalAmount ?? 0n)} MON
                  </span>{" "}
                  to distribute shares in one transaction.
                </p>
                <button
                  type="button"
                  className="btn-primary w-full"
                  onClick={onSettle}
                  disabled={isSettlePending || settleReceipt.isLoading}
                >
                  {isSettlePending || settleReceipt.isLoading
                    ? "Settling…"
                    : `Settle · ${formatMon(totalAmount ?? 0n)} MON`}
                </button>
                <TxStatus
                  hash={settleHash}
                  isPending={isSettlePending}
                  isConfirming={settleReceipt.isLoading}
                  isSuccess={settleReceipt.isSuccess}
                  error={settleError}
                  successLabel="Settled — funds distributed"
                />
              </div>
            )}

            {actionError && <div className="alert-error">{actionError}</div>}
          </MotionSection>
        )}

        {(settled || settleReceipt.isSuccess) && (
          <MotionSection
            index={4}
            className="card space-y-4 border-accent/20"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
                Receipt
              </h2>
              <StatusChip label="Onchain forever" tone="success" />
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Bill</dt>
                <dd className="text-right font-medium">{title}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Total</dt>
                <dd className="font-mono">
                  {formatMon(totalAmount ?? 0n)} MON
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Bill id</dt>
                <dd className="font-mono">#{rawId}</dd>
              </div>
              {settleHash && (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Settle tx</dt>
                  <dd>
                    <a
                      href={explorerTxUrl(settleHash)}
                      target="_blank"
                      rel="noreferrer"
                      className="link-accent font-mono text-xs"
                    >
                      {shortAddress(settleHash, 6)}
                    </a>
                  </dd>
                </div>
              )}
              <div className="border-t border-white/10 pt-3">
                <dt className="mb-2 font-mono text-[11px] uppercase tracking-wide text-subtle">
                  Payouts
                </dt>
                <dd>
                  <ul className="space-y-2">
                    {participants?.map((p, i) => (
                      <li
                        key={p}
                        className="flex justify-between gap-3 font-mono text-xs"
                      >
                        <a
                          href={explorerAddressUrl(p)}
                          target="_blank"
                          rel="noreferrer"
                          className="link-accent"
                        >
                          {shortAddress(p, 5)}
                        </a>
                        <span className="text-foreground">
                          {formatMon(
                            shareAmount(totalAmount ?? 0n, shares?.[i] ?? 0n)
                          )}{" "}
                          MON
                        </span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <p className="text-xs text-subtle">
              Next month, when someone asks if you paid — send this link.
            </p>
          </MotionSection>
        )}
      </div>
    </div>
  );
}
