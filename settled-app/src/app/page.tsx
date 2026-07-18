import Link from "next/link";
import { MotionSection } from "@/components/MotionSection";
import { isContractConfigured } from "@/lib/contract";

const painPoints = [
  {
    title: "No paper trail",
    body: "Transaction hashes get buried in chat. Screenshots are not a receipt.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M9 15l6-6" />
        <path d="M15 15L9 9" />
      </svg>
    ),
  },
  {
    title: "Awkward follow-ups",
    body: "“Did you send it?” becomes a thread. Nobody wants to be the reminder person.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    ),
  },
  {
    title: "Manual split math",
    body: "Percentages agreed verbally, then recalculated in a notes app under pressure.",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M8 6h8M8 10h8M8 14h4M8 18h2" />
      </svg>
    ),
  },
];

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

const onchainFeatures = [
  {
    title: "Trustless settlement",
    body: "Funds move by the contract rules you already agreed to — not by who DMs first.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Shareable proof",
    body: "One link. Bill, splits, and settlement hash — forever on Monad.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    title: "Everyone signs off",
    body: "No settle until all listed wallets confirm the exact split onchain.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const sectionShell =
  "page-shell flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-24";

export default function HomePage() {
  const configured = isContractConfigured();

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <section
        className={`${sectionShell} border-b border-white/10`}
        aria-label="Hero"
      >
        <MotionSection mode="view" className="max-w-3xl space-y-8">
          <p className="eyebrow">Shared expenses · Monad</p>
          <h1 className="display max-w-2xl text-[2.5rem] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            Splitting a bill shouldn&apos;t need three reminder texts
          </h1>
          <p className="lede max-w-xl">
            Settled is onchain receipts for shared crypto expenses — create a
            bill, everyone confirms, settle once.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href="/create" className="btn-primary">
              Create a bill
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              How it works
            </a>
          </div>
          {!configured && (
            <div className="alert-warn max-w-xl">
              Contract address is not set. Add{" "}
              <code className="font-mono text-xs text-foreground">
                NEXT_PUBLIC_CONTRACT_ADDRESS
              </code>{" "}
              after deploying{" "}
              <code className="font-mono text-xs text-foreground">
                BillSplitter
              </code>
              .
            </div>
          )}
        </MotionSection>
      </section>

      {/* 2. THE PROBLEM */}
      <section
        id="problem"
        className={`${sectionShell} border-b border-white/10`}
        aria-label="The problem"
      >
        <MotionSection mode="view" className="mb-12 max-w-2xl space-y-3">
          <p className="eyebrow">The problem</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Crypto splits still run on trust and screenshots
          </h2>
          <p className="lede">
            The money moves. The agreement doesn&apos;t. That&apos;s what
            Settled fixes.
          </p>
        </MotionSection>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {painPoints.map((item, i) => (
            <MotionSection key={item.title} mode="view" index={i} delayStep={0.08}>
              <article className="card-interactive flex h-full flex-col gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-muted">
                  {item.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-medium text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </article>
            </MotionSection>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section
        id="how-it-works"
        className={`${sectionShell} border-b border-white/10 scroll-mt-14`}
        aria-label="How it works"
      >
        <MotionSection mode="view" className="mb-12 max-w-2xl space-y-3">
          <p className="eyebrow">How it works</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Three steps. One receipt.
          </h2>
          <p className="lede">
            Create the bill, get everyone onchain, settle in a single
            transaction.
          </p>
        </MotionSection>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {steps.map((step, i) => (
            <MotionSection key={step.n} mode="view" index={i} delayStep={0.08}>
              <article className="card-interactive flex h-full flex-col gap-4">
                <span className="font-mono text-sm text-accent">{step.n}</span>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              </article>
            </MotionSection>
          ))}
        </div>
      </section>

      {/* 4. WHY ONCHAIN */}
      <section
        id="why-onchain"
        className={`${sectionShell} border-b border-white/10`}
        aria-label="Why onchain"
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <MotionSection mode="view" className="space-y-4">
            <p className="eyebrow">Why onchain</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Trustless settlement for the bills that keep recurring
            </h2>
            <p className="lede max-w-md">
              Rent, utilities, group trips — the split is simple until someone
              loses the hash. Settled keeps the agreement and the proof on
              Monad, where neither side can rewrite history.
            </p>
          </MotionSection>

          <div className="space-y-3">
            {onchainFeatures.map((feature, i) => (
              <MotionSection
                key={feature.title}
                mode="view"
                index={i}
                delayStep={0.08}
              >
                <div className="card flex gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-accent">
                    {feature.icon}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-sm font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {feature.body}
                    </p>
                  </div>
                </div>
              </MotionSection>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section
        className={`${sectionShell}`}
        aria-label="Get started"
      >
        <MotionSection
          mode="view"
          className="mx-auto flex max-w-xl flex-col items-center space-y-6 text-center"
        >
          <p className="eyebrow">Get settled</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Create a bill before the next reminder text
          </h2>
          <p className="lede">
            One link. Everyone confirms. Settle once. Permanent proof.
          </p>
          <Link href="/create" className="btn-primary">
            Create a bill
          </Link>
          <p className="font-mono text-xs text-subtle">
            Monad Testnet · Spark hackathon
          </p>
        </MotionSection>
      </section>
    </div>
  );
}
