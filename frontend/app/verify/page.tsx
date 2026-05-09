"use client";

import { Header } from "@/components/layout/Header";
import { VerifyForm } from "@/components/verify/VerifyForm";
import { useT } from "@/context/LocaleContext";

export default function VerifyPage() {
  const { t } = useT();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-16 max-w-5xl mx-auto w-full">
        <div className="mb-12 space-y-2 opacity-0 animate-fade-in-up">
          <p className="text-xs font-mono text-signal uppercase tracking-widest">
            {t.verify.badge}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-text-primary">
            {t.verify.title}
          </h1>
          <p className="text-text-secondary text-base max-w-xl">
            {t.verify.subtitle}
          </p>
        </div>
        <VerifyForm />
      </main>
    </div>
  );
}
