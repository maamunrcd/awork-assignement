"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimeFieldProps {
  value?: unknown;
  onChange: (next: string | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: boolean;
  compact?: boolean;
}

/** HTML time input (HH:mm); value is "" or "HH:mm". */
export function TimeField({ value, onChange, onBlur, disabled, error, compact }: TimeFieldProps) {
  const str =
    value === null || value === undefined || value === ""
      ? ""
      : typeof value === "string"
        ? value.length >= 5
          ? value.slice(0, 5)
          : value
        : String(value);

  return (
    <div className="relative w-full">
      <Clock
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400",
          compact ? "h-3.5 w-3.5" : "h-4 w-4"
        )}
        aria-hidden
      />
      <input
        type="time"
        step={60}
        value={str}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={cn(
          "w-full rounded-xl border bg-white pl-10 pr-3 font-semibold text-slate-900 shadow-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-50",
          compact ? "h-9 rounded-lg py-1 text-xs" : "h-12 py-2 text-sm",
          error ? "border-destructive ring-destructive/20" : "border-slate-200 hover:border-slate-400 focus:border-primary"
        )}
      />
    </div>
  );
}
