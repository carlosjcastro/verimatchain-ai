"use client";

import { cn } from "@/lib/utils";
import { useT } from "@/context/LocaleContext";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const { t } = useT();

  const base =
    "inline-flex items-center justify-center font-mono tracking-wider uppercase transition-all duration-200 rounded disabled:opacity-40 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "bg-signal text-void font-bold hover:bg-signal-dim glow-signal active:scale-95",
    secondary:
      "border border-border bg-surface text-text-secondary hover:border-signal/40 hover:text-text-primary",
    ghost: "text-text-muted hover:text-text-primary hover:bg-panel",
    danger:
      "border border-verdict-critical/40 bg-verdict-critical/10 text-verdict-critical hover:bg-verdict-critical/20",
  };

  const sizes = {
    sm: "text-xs px-4 py-2",
    md: "text-xs px-6 py-3",
    lg: "text-sm px-8 py-4",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-3 w-3"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          {t.verify.btnVerifying}
        </span>
      ) : (
        children
      )}
    </button>
  );
}