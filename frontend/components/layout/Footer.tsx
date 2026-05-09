import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono text-text-muted">
          VeriMatChain AI - <a href="https://carlosjcastrog.com" target="_blank" rel="noopener noreferrer" className="hover:text-signal transition-colors">
            Carlos José Castro Galante
          </a>
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://explorer.solana.com?cluster=devnet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-text-muted hover:text-signal transition-colors tracking-wider uppercase"
          >
            Devnet Explorer
          </a>
          <a
            href="https://gateway.pinata.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-text-muted hover:text-signal transition-colors tracking-wider uppercase"
          >
            IPFS Gateway
          </a>
          <Link
            href="/docs"
            className="text-xs font-mono text-text-muted hover:text-signal transition-colors tracking-wider uppercase"
          >
            Docs
          </Link>
           <Link
            href="/copyright"
            className="text-xs font-mono text-text-muted hover:text-signal transition-colors tracking-wider uppercase"
          >
            Copyright
          </Link>
        </div>
      </div>
    </footer>
  );
}
