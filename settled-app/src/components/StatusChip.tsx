type StatusChipProps = {
  label: string;
  tone?: "neutral" | "pending" | "success" | "warning";
};

const toneClass: Record<NonNullable<StatusChipProps["tone"]>, string> = {
  neutral: "border-white/10 bg-white/[0.04] text-muted",
  pending: "border-white/15 bg-white/[0.04] text-foreground",
  success: "border-accent/30 bg-accent-muted text-accent",
  warning: "border-white/20 bg-white/[0.06] text-foreground",
};

export function StatusChip({ label, tone = "neutral" }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide ${toneClass[tone]}`}
    >
      {label}
    </span>
  );
}
