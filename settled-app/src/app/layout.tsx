import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { config } from "@/lib/wagmi";
import "./globals.css";

export const metadata: Metadata = {
  title: "Settled — onchain receipts for shared expenses",
  description:
    "Create a bill, everyone confirms, settle once. Permanent shared-expense receipts on Monad.",
};

// Wallet cookie hydration needs request headers — skip static prerender.
export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    config,
    headers().get("cookie")
  );

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className={`${GeistSans.className} min-h-screen bg-background text-foreground`}>
        <Providers initialState={initialState}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <footer className="page-shell border-t border-white/10 py-8">
              <p className="font-mono text-xs text-subtle">
                Settled · Spark · Monad Testnet
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
