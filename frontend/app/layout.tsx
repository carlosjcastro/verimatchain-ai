import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/components/blockchain/WalletProvider";
import { LocaleProvider } from "@/context/LocaleContext";

export const metadata: Metadata = {
  title: {
    default: "VeriMatChain AI - Decentralized Information Integrity",
    template: "%s | VeriMatChain AI",
  },
  description:
    "Verify the authenticity of any content using AI analysis anchored permanently on the Solana blockchain. Detect disinformation, cognitive bias, and synthetic audio.",
  keywords: [
    "fact-check",
    "disinformation",
    "blockchain",
    "solana",
    "ai",
    "deepfake",
    "verimatchain",
  ],
  openGraph: {
    title: "VeriMatChain AI",
    description: "Decentralized truth verification powered by AI and Solana.",
    type: "website",
    siteName: "VeriMatChain AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "VeriMatChain AI",
    description: "Decentralized truth verification powered by AI and Solana.",
  },
  other: {
    "schema:type": "WebApplication",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "VeriMatChain AI",
              description:
                "Multimodal information integrity system powered by AI and Solana blockchain.",
              applicationCategory: "FactCheck",
              operatingSystem: "Any",
              url: "https://verimatchain.carlosjcastrog.com",
              offers: { "@type": "Offer", price: "0" },
            }),
          }}
        />
      </head>
      <body className="noise-overlay grid-background antialiased">
        <div className="scan-overlay" />
        <WalletProvider>
          <LocaleProvider>{children}</LocaleProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
