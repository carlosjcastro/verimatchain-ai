import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { HistoryTable } from "@/components/dashboard/HistoryTable";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your verification history and on-chain attestations.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-16 max-w-6xl mx-auto w-full space-y-12">
        <div className="space-y-2">
          <p className="text-xs font-mono text-signal uppercase tracking-widest">
            Analytics
          </p>
          <h1 className="font-display text-4xl font-extrabold text-text-primary">
            Dashboard
          </h1>
        </div>
        <StatsCards />
        <HistoryTable />
      </main>
    </div>
  );
}