"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { apiClient } from "@/lib/api-client";
import { useT } from "@/context/LocaleContext";

interface Stats {
  total_verifications: number;
  high_risk_detected: number;
  attestations_anchored: number;
  synthetic_audio_found: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const { t } = useT();

  useEffect(() => {
    apiClient
      .getStats()
      .then(setStats)
      .catch(() => null);
  }, []);

  const items = stats
    ? [
        {
          label: t.dashboard.totalVerifications,
          value: stats.total_verifications.toLocaleString(),
          delta: t.dashboard.allTime,
        },
        {
          label: t.dashboard.highRisk,
          value: stats.high_risk_detected.toLocaleString(),
          delta: `${
            stats.total_verifications > 0
              ? Math.round(
                  (stats.high_risk_detected / stats.total_verifications) * 100,
                )
              : 0
          }% ${t.dashboard.ofTotal}`,
        },
        {
          label: t.dashboard.anchored,
          value: stats.attestations_anchored.toLocaleString(),
          delta: "Solana Devnet",
        },
        {
          label: t.dashboard.syntheticAudio,
          value: stats.synthetic_audio_found.toLocaleString(),
          delta: "ElevenLabs AI",
        },
      ]
    : [
        {
          label: t.dashboard.totalVerifications,
          value: "-",
          delta: t.dashboard.loading,
        },
        { label: t.dashboard.highRisk, value: "-", delta: t.dashboard.loading },
        { label: t.dashboard.anchored, value: "-", delta: t.dashboard.loading },
        {
          label: t.dashboard.syntheticAudio,
          value: "-",
          delta: t.dashboard.loading,
        },
      ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded overflow-hidden">
      {items.map((stat) => (
        <Card
          key={stat.label}
          className="rounded-none border-0 border-r border-border last:border-r-0"
        >
          <CardBody className="space-y-2">
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
              {stat.label}
            </p>
            <p className="font-display text-3xl font-extrabold text-gradient-signal">
              {stat.value}
            </p>
            <p className="text-xs text-text-muted">{stat.delta}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
