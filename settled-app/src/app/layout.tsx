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
            <main className="page-shell flex-1 pb-16 pt-8 lg:pb-24 lg:pt-12">
              {children}
            </main>
            <footer className="page-shell divider py-8">
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
