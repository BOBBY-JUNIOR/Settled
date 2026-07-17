"use client";

import Link from "next/link";
import { ConnectButton } from "./ConnectButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="page-shell flex h-14 items-center justify-between gap-4">
        <Link href="/" className="group flex items-baseline gap-2.5">
          <span className="text-[15px] font-semibold tracking-tight text-foreground transition-colors duration-200 ease-out group-hover:text-white">
            Settled
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-subtle sm:inline">
            receipts
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/create"
            className="hidden text-sm text-muted transition-colors duration-200 ease-out hover:text-foreground sm:inline"
          >
            Create
          </Link>
          <ConnectButton />
        </nav>
      </div>
    </header>
  );
}
