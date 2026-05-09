"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { truncateHash } from "@/lib/utils";
import { useT } from "@/context/LocaleContext";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

export function Header() {
  const { publicKey, connected } = useWallet();
  const { t, locale, toggleLocale } = useT();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-void/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-6 h-6 border border-signal rotate-45 group-hover:bg-signal/10 transition-colors" />
          <span className="font-display text-base font-bold tracking-widest uppercase text-text-primary">
            VeriMatChain<span className="text-signal">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/verify"
            className="text-xs font-mono text-text-muted tracking-widest uppercase hover:text-signal transition-colors"
          >
            {t.nav.verify}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-mono text-text-muted tracking-widest uppercase hover:text-signal transition-colors"
          >
            {t.nav.dashboard}
          </Link>
          <Link
            href="/docs"
            className="text-xs font-mono text-text-muted tracking-widest uppercase hover:text-signal transition-colors"
          >
            {t.nav.docs}
          </Link>
          <Link
            href="/copyright"
            className="text-xs font-mono text-text-muted tracking-widest uppercase hover:text-signal transition-colors"
          >
            {t.nav.copyright}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLocale}
            className="text-xs font-mono text-text-muted hover:text-signal transition-colors border border-border px-3 py-1.5 rounded hover:border-signal/40"
          >
            {locale === "en" ? "ES" : "EN"}
          </button>

          {connected && publicKey && (
            <span className="hidden md:flex items-center gap-2 text-xs font-mono text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-verdict-low animate-pulse" />
              {truncateHash(publicKey.toBase58(), 4)}
            </span>
          )}

          <WalletMultiButton
            style={{
              background: "transparent",
              border: "1px solid #1a2d42",
              color: "#7aa8cc",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "8px 16px",
              borderRadius: "2px",
              height: "auto",
            }}
          />
        </div>
      </div>
    </header>
  );
}
