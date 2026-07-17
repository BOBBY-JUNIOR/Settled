import { formatEther, parseEther, type Address } from "viem";

export function shortAddress(address: string, chars = 4): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 2 + chars)}…${address.slice(-chars)}`;
}

export function formatMon(wei: bigint, digits = 4): string {
  const value = Number(formatEther(wei));
  if (!Number.isFinite(value)) return formatEther(wei);
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function parseMonInput(input: string): bigint | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  try {
    return parseEther(trimmed);
  } catch {
    return null;
  }
}

export function bpsToPercent(bps: bigint | number): string {
  const n = typeof bps === "bigint" ? Number(bps) : bps;
  return `${(n / 100).toFixed(n % 100 === 0 ? 0 : 2)}%`;
}

export function percentToBps(percent: number): number {
  return Math.round(percent * 100);
}

export function shareAmount(total: bigint, bps: bigint | number): bigint {
  const share = typeof bps === "bigint" ? bps : BigInt(bps);
  return (total * share) / 10_000n;
}

export function isSameAddress(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

export type ParticipantDraft = {
  id: string;
  address: string;
  percent: string;
};

export function validateParticipants(
  participants: ParticipantDraft[]
): string | null {
  if (participants.length < 2 || participants.length > 5) {
    return "Bills need 2–5 participants.";
  }

  const seen = new Set<string>();
  let sum = 0;

  for (const p of participants) {
    const addr = p.address.trim();
    if (!addr) return "Every participant needs a wallet address.";
    if (!/^0x[a-fA-F0-9]{40}$/.test(addr)) {
      return `Invalid address: ${addr.slice(0, 12)}…`;
    }
    const key = addr.toLowerCase();
    if (seen.has(key)) return "Duplicate participant addresses are not allowed.";
    seen.add(key);

    const pct = Number(p.percent);
    if (!Number.isFinite(pct) || pct <= 0) {
      return "Each share must be greater than 0%.";
    }
    sum += pct;
  }

  // Allow tiny float noise (e.g. 33.33 * 3)
  if (Math.abs(sum - 100) > 0.02) {
    return `Shares must sum to 100% (currently ${sum.toFixed(2)}%).`;
  }

  return null;
}

export function draftsToContractArgs(participants: ParticipantDraft[]): {
  addresses: Address[];
  shares: bigint[];
} {
  const addresses = participants.map((p) => p.address.trim() as Address);
  // Convert percents to bps; fix rounding on the last share so sum is exactly 10000.
  const raw = participants.map((p) => percentToBps(Number(p.percent)));
  let sum = raw.reduce((a, b) => a + b, 0);
  if (sum !== 10_000 && raw.length > 0) {
    raw[raw.length - 1] += 10_000 - sum;
  }
  return {
    addresses,
    shares: raw.map((n) => BigInt(n)),
  };
}
