"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useT } from "@/context/LocaleContext";

export default function HomePage() {
  const { t } = useT();

  const features = [
    {
      label: t.home.featureAI,
      value: "Claude + LangGraph",
      desc: t.home.featureAIDesc,
    },
    {
      label: t.home.featureChain,
      value: "Solana Anchor",
      desc: t.home.featureChainDesc,
    },
    {
      label: t.home.featureAudio,
      value: "ElevenLabs Classifier",
      desc: t.home.featureAudioDesc,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">
        <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-32 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-signal/5 blur-3xl" />
            <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-amber/3 blur-3xl" />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 border border-signal/20 bg-signal/5 px-4 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse-signal" />
              <span className="text-xs font-mono text-signal tracking-widest uppercase">
                {t.home.badge}
              </span>
            </div>

            <h1 className="font-display text-6xl md:text-8xl font-extrabold leading-none tracking-tight">
              <span className="block text-text-primary">
                {t.home.headline1}
              </span>
              <span className="block text-gradient-signal">
                {t.home.headline2}
              </span>
            </h1>

            <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
              {t.home.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/verify"
                className="group relative px-8 py-3.5 bg-signal text-void font-display font-bold text-sm tracking-widest uppercase rounded transition-all duration-200 hover:bg-signal-dim glow-signal-strong"
              >
                {t.home.ctaVerify}
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-3.5 border border-border text-text-secondary font-mono text-sm tracking-wider uppercase rounded transition-all duration-200 hover:border-signal/40 hover:text-text-primary"
              >
                {t.home.ctaDashboard}
              </Link>
            </div>
          </div>

          <div className="relative z-10 mt-24 grid grid-cols-1 md:grid-cols-3 gap-px bg-border max-w-4xl w-full mx-auto rounded overflow-hidden">
            {features.map((item) => (
              <div key={item.label} className="bg-surface px-8 py-8 space-y-2">
                <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
                  {item.label}
                </p>
                <p className="font-display text-lg font-bold text-signal">
                  {item.value}
                </p>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
