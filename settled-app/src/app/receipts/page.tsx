"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAccount, useReadContract, useReadContracts } from "wagmi";
import type { Address } from "viem";
import { MotionSection } from "@/components/MotionSection";
import { StatusChip } from "@/components/StatusChip";
import {
  BILL_SPLITTER_ABI,
  CONTRACT_ADDRESS,
  isContractConfigured,
} from "@/lib/contract";
import { formatMon, isSameAddress, shortAddress } from "@/lib/format";

type Filter = "all" | "settled" | "open";

type BillRow = {
  id: string;
  creator: Address;
  title: string;
  totalAmount: bigint;
  participants: readonly Address[];
  settled: boolean;
  role: "creator" | "participant";
};

export default function ReceiptsPage() {
  const { address, isConnected } = useAccount();
  const configured = isContractConfigured();
  const [filter, setFilter] = useState<Filter>("all");

  const nextIdQuery = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: BILL_SPLITTER_ABI,
    functionName: "nextBillId",
    query: { enabled: configured, refetchInterval: 8_000 },
  });

  const nextId = nextIdQuery.data ?? 0n;
  const totalBills = Number(nextId);

  const billIds = useMemo(() => {
    if (!Number.isFinite(totalBills) || totalBills <= 0) return [] as bigint[];
    // Cap scan for safety; hackathon volume stays well under this.
    const limit = Math.min(totalBills, 200);
    const start = totalBills - limit;
    return Array.from({ length: limit }, (_, i) => BigInt(start + i)).reverse();
  }, [totalBills]);

  const billsQuery = useReadContracts({
    contracts: billIds.map((id) => ({
      address: CONTRACT_ADDRESS,
      abi: BILL_SPLITTER_ABI,
      functionName: "getBill" as const,
      args: [id] as const,
    })),
    query: {
      enabled: configured && billIds.length > 0,
      refetchInterval: 8_000,
    },
  });

  const rows = useMemo(() => {
    if (!address || !billsQuery.data) return [] as BillRow[];

    const out: BillRow[] = [];
    billsQuery.data.forEach((result, i) => {
      if (result.status !== "success" || !result.result) return;
      const [creator, title, totalAmount, participants, , settled] =
        result.result as [
          Address,
          string,
          bigint,
          readonly Address[],
          readonly bigint[],
          boolean,
        ];

      const isCreator = isSameAddress(creator, address);
      const isParticipant = participants.some((p) =>
        isSameAddress(p, address)
      );
      if (!isCreator && !isParticipant) return;

      out.push({
        id: billIds[i].toString(),
        creator,
        title,
        totalAmount,
        participants,
        settled,
        role: isCreator ? "creator" : "participant",
      });
    });
    return out;
  }, [address, billsQuery.data, billIds]);

  const filtered = useMemo(() => {
    if (filter === "settled") return rows.filter((r) => r.settled);
    if (filter === "open") return rows.filter((r) => !r.settled);
    return rows;
  }, [rows, filter]);

  const settledCount = rows.filter((r) => r.settled).length;
  const openCount = rows.length - settledCount;
  const loading =
    configured &&
    isConnected &&
    (nextIdQuery.isLoading || (billIds.length > 0 && billsQuery.isLoading));

  return (
    <div className="page-shell space-y-8 py-8 pb-16 lg:py-12 lg:pb-24">
      <MotionSection index={0} className="space-y-3">
        <p className="eyebrow">Receipts</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Your bills onchain
        </h1>
        <p className="lede max-w-xl">
          Open and settled bills where you are the creator or a participant.
          Tap any row for the full receipt.
        </p>
      </MotionSection>

      {!configured && (
        <MotionSection index={1}>
          <div className="alert-warn">
            Contract address is not configured. Set{" "}
            <code className="font-mono text-xs text-foreground">
              NEXT_PUBLIC_CONTRACT_ADDRESS
            </code>
            .
          </div>
        </MotionSection>
      )}

      {configured && !isConnected && (
        <MotionSection index={1} className="card max-w-lg space-y-3">
          <h2 className="text-lg font-medium text-foreground">
            Connect a wallet
          </h2>
          <p className="text-sm text-muted">
            Connect to see bills and settled receipts linked to your address.
          </p>
        </MotionSection>
      )}

      {configured && isConnected && (
        <>
          <MotionSection
            index={1}
            className="flex flex-wrap items-center gap-2"
          >
            {(
              [
                { id: "all", label: `All (${rows.length})` },
                { id: "settled", label: `Settled (${settledCount})` },
                { id: "open", label: `Open (${openCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={
                  filter === tab.id
                    ? "btn-primary"
                    : "btn-secondary"
                }
              >
                {tab.label}
              </button>
            ))}
          </MotionSection>

          <MotionSection index={2}>
            {loading ? (
              <div className="card">
                <p className="font-mono text-sm text-muted">
                  Loading bills from Monad…
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="card max-w-lg space-y-4">
                <h2 className="text-lg font-medium text-foreground">
                  {rows.length === 0
                    ? "No bills for this wallet yet"
                    : filter === "settled"
                      ? "No settled receipts yet"
                      : "No open bills"}
                </h2>
                <p className="text-sm text-muted">
                  {rows.length === 0
                    ? "Create a bill or open a share link where you are listed as a participant."
                    : "Try another filter, or create a new bill."}
                </p>
                <Link href="/create" className="btn-primary inline-flex">
                  Create a bill
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-white/10 overflow-hidden rounded-lg border border-white/10">
                {filtered.map((bill) => (
                  <li key={bill.id}>
                    <Link
                      href={`/bill/${bill.id}`}
                      className="flex flex-col gap-3 px-4 py-4 transition-colors duration-200 ease-out hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-base font-medium text-foreground">
                            {bill.title}
                          </span>
                          <StatusChip
                            label={bill.settled ? "Settled" : "Open"}
                            tone={bill.settled ? "success" : "pending"}
                          />
                          <StatusChip
                            label={
                              bill.role === "creator" ? "Creator" : "Participant"
                            }
                            tone="neutral"
                          />
                        </div>
                        <p className="font-mono text-xs text-subtle">
                          Bill #{bill.id} · {bill.participants.length} wallets ·
                          created by {shortAddress(bill.creator)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                        <p className="font-mono text-sm text-foreground">
                          {formatMon(bill.totalAmount)}{" "}
                          <span className="text-muted">MON</span>
                        </p>
                        <span className="font-mono text-xs text-accent">
                          {bill.settled ? "View receipt →" : "Open bill →"}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </MotionSection>
        </>
      )}
    </div>
  );
}
