import Link from "next/link";
import { MotionSection } from "@/components/MotionSection";
import { isContractConfigured } from "@/lib/contract";

const steps = [
  {
    n: "01",
    title: "Create",
    body: "Title, total in MON, 2–5 wallets, custom split percentages.",
  },
  {
    n: "02",
    title: "Confirm",
    body: "Share the bill link. Each participant signs off onchain.",
  },
  {
    n: "03",
    title: "Settle",
    body: "Deposit once. Contract distributes by share and leaves a permanent receipt.",
  },
];

export default function HomePage() {
  const configured = isContractConfigured();

  return (
    <div className="page-grid items-start">
      {/* Hero / action column */}
      <div className="space-y-8 lg:sticky lg:top-24">
        <MotionSection index={0} className="space-y-6">
          <p className="eyebrow">Shared expenses · Monad</p>
          <h1 className="display">Get settled.</h1>
          <p className="lede max-w-md">
            Onchain receipts for shared expenses. Create a bill, everyone
            confirms, settle once.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href="/create" className="btn-primary">
              Create a bill
            </Link>
            <a
              href="https://faucet.monad.xyz"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Get testnet MON
            </a>
          </div>
        </MotionSection>

        <MotionSection index={1}>
          <p className="text-sm italic text-subtle">
            No bills yet. Create one before your roommate asks again.
          </p>
        </MotionSection>

        {!configured && (
          <MotionSection index={2}>
            <div className="alert-warn">
              Contract address is not set. Add{" "}
              <code className="font-mono text-xs text-foreground">
                NEXT_PUBLIC_CONTRACT_ADDRESS
              </code>{" "}
              in{" "}
              <code className="font-mono text-xs text-foreground">
                .env.local
              </code>{" "}
              after deploying{" "}
              <code className="font-mono text-xs text-foreground">
                BillSplitter
              </code>
              .
            </div>
          </MotionSection>
        )}
      </div>

      {/* Content column */}
      <div className="space-y-4">
        <MotionSection index={1} className="mb-2">
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
            How it works
          </h2>
        </MotionSection>

        {steps.map((step, i) => (
          <MotionSection key={step.n} index={i + 2}>
            <article className="card-interactive flex gap-5">
              <span className="font-mono text-sm text-accent">{step.n}</span>
              <div className="min-w-0 space-y-1">
                <h3 className="text-base font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            </article>
          </MotionSection>
        ))}

        <MotionSection index={5} className="pt-4">
          <div className="card grid gap-6 sm:grid-cols-3">
            {[
              { label: "Chain", value: "Monad" },
              { label: "Currency", value: "MON" },
              { label: "Scope", value: "MVP" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-mono text-[11px] uppercase tracking-wide text-subtle">
                  {stat.label}
                </p>
                <p className="mt-1 font-mono text-sm text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </MotionSection>
      </div>
    </div>
  );
}
