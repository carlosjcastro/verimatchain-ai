"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  colorClass?: string;
  showLabel?: boolean;
}

export function Progress({
  value,
  max = 1,
  className,
  colorClass = "bg-signal",
  showLabel = false,
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("relative", className)}>
      <div className="h-1 w-full bg-panel rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="absolute right-0 -top-5 text-xs font-mono text-text-muted">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}