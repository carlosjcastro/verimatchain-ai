"use client";

import { formatRiskScore, getRiskColor } from "@/lib/utils";
import { useT } from "@/context/LocaleContext";
import type { RiskLevel } from "@/types";

interface RiskScoreProps {
  score: number;
  level: RiskLevel;
}

export function RiskScore({ score, level }: RiskScoreProps) {
  const { t } = useT();

  const levelLabels: Record<RiskLevel, string> = {
    low: t.result.riskLow,
    medium: t.result.riskMedium,
    high: t.result.riskHigh,
    critical: t.result.riskCritical,
  };

  const levelDesc: Record<RiskLevel, string> = {
    low: t.result.riskDescLow,
    medium: t.result.riskDescMedium,
    high: t.result.riskDescHigh,
    critical: t.result.riskDescCritical,
  };

  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference * (1 - score);

  const strokeColors: Record<RiskLevel, string> = {
    low: "#22c55e",
    medium: "#f59e0b",
    high: "#f97316",
    critical: "#ef4444",
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#1a2d42"
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={strokeColors[level]}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-display text-3xl font-extrabold ${getRiskColor(level)}`}
          >
            {formatRiskScore(score)}
          </span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className={`font-display font-bold text-sm ${getRiskColor(level)}`}>
          {levelLabels[level]}
        </p>
        <p className="text-xs text-text-muted max-w-xs">{levelDesc[level]}</p>
      </div>
    </div>
  );
}
