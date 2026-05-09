import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

interface BadgeProps {
  label: string;
  variant?: "default" | "signal" | "risk";
  riskLevel?: RiskLevel;
}

export function Badge({ label, variant = "default", riskLevel }: BadgeProps) {
  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded tracking-wider uppercase";

  const variants = {
    default: "bg-panel border border-border text-text-secondary",
    signal: "bg-signal/10 border border-signal/30 text-signal",
    risk: "",
  };

  const riskStyles: Record<RiskLevel, string> = {
    low: "bg-verdict-low/10 border border-verdict-low/30 text-verdict-low",
    medium: "bg-verdict-medium/10 border border-verdict-medium/30 text-verdict-medium",
    high: "bg-verdict-high/10 border border-verdict-high/30 text-verdict-high",
    critical: "bg-verdict-critical/10 border border-verdict-critical/30 text-verdict-critical",
  };

  return (
    <span
      className={cn(
        base,
        variant === "risk" && riskLevel ? riskStyles[riskLevel] : variants[variant]
      )}
    >
      {variant === "risk" && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {label}
    </span>
  );
}