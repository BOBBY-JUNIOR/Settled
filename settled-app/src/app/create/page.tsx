"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { decodeEventLog, type Hash } from "viem";
import { MotionSection } from "@/components/MotionSection";
import { TxStatus } from "@/components/TxStatus";
import {
  BILL_SPLITTER_ABI,
  CONTRACT_ADDRESS,
  isContractConfigured,
} from "@/lib/contract";
import {
  draftsToContractArgs,
  parseMonInput,
  type ParticipantDraft,
  validateParticipants,
} from "@/lib/format";
import { monadTestnet } from "@/lib/chains";

let participantSeq = 0;

function newParticipant(partial?: Partial<ParticipantDraft>): ParticipantDraft {
  participantSeq += 1;
  return {
    id: partial?.id ?? `p-${participantSeq}`,
    address: "",
    percent: "",
    ...partial,
  };
}

export default function CreateBillPage() {
  const router = useRouter();
  const { address, isConnected, chainId } = useAccount();
  const configured = isContractConfigured();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [participants, setParticipants] = useState<ParticipantDraft[]>(() => [
    newParticipant({ id: "p-1", percent: "50" }),
    newParticipant({ id: "p-2", percent: "50" }),
  ]);
  const [formError, setFormError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const { writeContract, data: hash, isPending, error, reset } =
    useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (!address) return;
    setParticipants((prev) => {
      if (prev[0]?.address) return prev;
      const next = [...prev];
      next[0] = { ...next[0], address };
      return next;
    });
  }, [address]);

  useEffect(() => {
    if (!receipt || createdId) return;
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: BILL_SPLITTER_ABI,
          data: log.data,
          topics: log.topics,
        });
        if (decoded.eventName === "BillCreated") {
          const billId = (decoded.args as { billId: bigint }).billId;
          const id = billId.toString();
          setCreatedId(id);
          router.push(`/bill/${id}`);
          return;
        }
      } catch {
        // not our event
      }
    }
  }, [receipt, createdId, router]);

  const shareSum = useMemo(
    () =>
      participants.reduce((acc, p) => acc + (Number(p.percent) || 0), 0),
    [participants]
  );

  const updateParticipant = useCallback(
    (id: string, patch: Partial<ParticipantDraft>) => {
      setParticipants((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
      );
    },
    []
  );

  const addParticipant = () => {
    if (participants.length >= 5) return;
    setParticipants((prev) => [...prev, newParticipant({ percent: "0" })]);
  };

  const removeParticipant = (id: string) => {
    if (participants.length <= 2) return;
    setParticipants((prev) => prev.filter((p) => p.id !== id));
  };

  const splitEvenly = () => {
    const n = participants.length;
    const base = Math.floor(10000 / n) / 100;
    const values = Array.from({ length: n }, () => base);
    const sum = values.reduce((a, b) => a + b, 0);
    values[n - 1] = Math.round((100 - (sum - values[n - 1])) * 100) / 100;
    setParticipants((prev) =>
      prev.map((p, i) => ({ ...p, percent: String(values[i]) }))
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    reset();

    if (!configured) {
      setFormError("Contract address is not configured.");
      return;
    }
    if (!isConnected || !address) {
      setFormError("Connect your wallet to create a bill.");
      return;
    }
    if (chainId !== monadTestnet.id) {
      setFormError("Switch to Monad Testnet before creating a bill.");
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFormError("Add a title for the bill.");
      return;
    }

    const total = parseMonInput(amount);
    if (total === null || total <= 0n) {
      setFormError("Enter a valid total amount in MON.");
      return;
    }

    const participantError = validateParticipants(participants);
    if (participantError) {
      setFormError(participantError);
      return;
    }

    const { addresses, shares } = draftsToContractArgs(participants);

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: BILL_SPLITTER_ABI,
      functionName: "createBill",
      args: [trimmedTitle, total, addresses, shares],
    });
  };

  const sharesOk = Math.abs(shareSum - 100) < 0.05;

  return (
    <div className="page-shell page-grid items-start py-8 pb-16 lg:py-12 lg:pb-24">
      <div className="space-y-6 lg:sticky lg:top-24">
        <MotionSection index={0}>
          <Link
            href="/"
            className="font-mono text-xs text-muted transition-colors duration-200 ease-out hover:text-foreground"
          >
            ← Home
          </Link>
          <h1 className="mt-4 display text-[2.25rem] sm:text-4xl lg:text-5xl">
            Create a bill
          </h1>
          <p className="mt-3 lede max-w-sm">
            Stored onchain. Shares are permanent once confirmed.
          </p>
        </MotionSection>

        <MotionSection index={1} className="card space-y-4">
          <p className="font-mono text-[11px] uppercase tracking-wide text-subtle">
            Checklist
          </p>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <span className="font-mono text-accent">01</span>
              Connect wallet on Monad Testnet
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-accent">02</span>
              Title + total in MON
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-accent">03</span>
              2–5 wallets, shares sum to 100%
            </li>
          </ul>
        </MotionSection>

        {!configured && (
          <MotionSection index={2}>
            <div className="alert-warn">
              Set{" "}
              <code className="font-mono text-xs text-foreground">
                NEXT_PUBLIC_CONTRACT_ADDRESS
              </code>{" "}
              after deploy.
            </div>
          </MotionSection>
        )}
      </div>

      <MotionSection index={1}>
        <form onSubmit={onSubmit} className="card space-y-6">
          <div>
            <label htmlFor="title" className="field-label">
              Title
            </label>
            <input
              id="title"
              className="field-input"
              placeholder="March rent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="amount" className="field-label">
              Total amount (MON)
            </label>
            <input
              id="amount"
              className="field-input font-mono"
              placeholder="12"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoComplete="off"
            />
            <p className="field-hint">
              Settler deposits this full amount; contract pays out by share.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="field-label mb-0">Participants</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  onClick={splitEvenly}
                >
                  Split evenly
                </button>
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  onClick={addParticipant}
                  disabled={participants.length >= 5}
                >
                  + Add
                </button>
              </div>
            </div>

            {participants.map((p, index) => (
              <div
                key={p.id}
                className="grid grid-cols-[1fr_88px_auto] gap-2 sm:grid-cols-[1fr_100px_auto]"
              >
                <div>
                  {index === 0 && (
                    <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-subtle">
                      Wallet
                    </span>
                  )}
                  <input
                    className="field-input font-mono text-xs sm:text-sm"
                    placeholder="0x…"
                    value={p.address}
                    onChange={(e) =>
                      updateParticipant(p.id, { address: e.target.value })
                    }
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
                <div>
                  {index === 0 && (
                    <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-subtle">
                      Share %
                    </span>
                  )}
                  <input
                    className="field-input font-mono"
                    inputMode="decimal"
                    placeholder="50"
                    value={p.percent}
                    onChange={(e) =>
                      updateParticipant(p.id, { percent: e.target.value })
                    }
                    autoComplete="off"
                  />
                </div>
                <div className={index === 0 ? "pt-6" : ""}>
                  <button
                    type="button"
                    className="btn-ghost h-[42px] px-2 text-xs"
                    onClick={() => removeParticipant(p.id)}
                    disabled={participants.length <= 2}
                    aria-label="Remove participant"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <p
              className={`font-mono text-xs ${
                sharesOk ? "text-accent" : "text-muted"
              }`}
            >
              Shares total: {shareSum.toFixed(2)}%
              {!sharesOk ? " (must equal 100%)" : ""}
            </p>
          </div>

          {formError && <div className="alert-error">{formError}</div>}

          <TxStatus
            hash={hash as Hash | undefined}
            isPending={isPending}
            isConfirming={isConfirming}
            isSuccess={isSuccess}
            error={error}
            successLabel="Bill created — opening receipt…"
          />

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isPending || isConfirming || !configured}
          >
            {isPending
              ? "Confirm in wallet…"
              : isConfirming
                ? "Creating…"
                : "Create bill onchain"}
          </button>
        </form>
      </MotionSection>
    </div>
  );
}
