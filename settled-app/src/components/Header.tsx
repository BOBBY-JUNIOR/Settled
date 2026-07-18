"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "./ConnectButton";

const links = [
  { href: "/receipts", label: "Receipts" },
  { href: "/create", label: "Create" },
] as const;

export function Header() {
  const pathname = usePathname();

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
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-2.5 py-1.5 text-sm transition-colors duration-200 ease-out sm:px-3 ${
                  active
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ConnectButton />
        </nav>
      </div>
    </header>
  );
}
