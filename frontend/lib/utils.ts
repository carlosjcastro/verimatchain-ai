import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel } from "@/types";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatRiskScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

export function getRiskColor(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: "text-verdict-low",
    medium: "text-verdict-medium",
    high: "text-verdict-high",
    critical: "text-verdict-critical",
  };
  return map[level];
}

export function getRiskBgColor(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    low: "bg-verdict-low/10 border-verdict-low/30",
    medium: "bg-verdict-medium/10 border-verdict-medium/30",
    high: "bg-verdict-high/10 border-verdict-high/30",
    critical: "bg-verdict-critical/10 border-verdict-critical/30",
  };
  return map[level];
}

export function truncateHash(hash: string, chars = 8): string {
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}