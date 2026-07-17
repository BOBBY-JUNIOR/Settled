import { explorerTxUrl } from "@/lib/contract";

type TxStatusProps = {
  hash?: `0x${string}`;
  isPending?: boolean;
  isConfirming?: boolean;
  isSuccess?: boolean;
  error?: Error | null;
  successLabel?: string;
};

export function TxStatus({
  hash,
  isPending,
  isConfirming,
  isSuccess,
  error,
  successLabel = "Confirmed onchain",
}: TxStatusProps) {
  if (error) {
    return (
      <div className="alert-error">{shortenError(error.message)}</div>
    );
  }

  if (isPending) {
    return (
      <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-muted">
        Confirm in your wallet…
      </div>
    );
  }

  if (isConfirming && hash) {
    return (
      <div className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-muted">
        Waiting for confirmation…{" "}
        <a
          href={explorerTxUrl(hash)}
          target="_blank"
          rel="noreferrer"
          className="link-accent font-mono text-xs"
        >
          view tx
        </a>
      </div>
    );
  }

  if (isSuccess && hash) {
    return (
      <div className="alert-success">
        {successLabel}{" "}
        <a
          href={explorerTxUrl(hash)}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-accent underline-offset-2 hover:underline"
        >
          {hash.slice(0, 10)}…
        </a>
      </div>
    );
  }

  return null;
}

function shortenError(message: string): string {
  if (message.includes("User rejected") || message.includes("user rejected")) {
    return "Transaction rejected in wallet.";
  }
  if (message.length > 180) return `${message.slice(0, 180)}…`;
  return message;
}
