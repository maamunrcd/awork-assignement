"use client";

import * as React from "react";
import { format, isValid, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function parseValue(value: unknown): Date | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;
  const s = String(value);
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? parseISO(s) : new Date(s);
  return isValid(d) ? d : undefined;
}

function toStoredString(d: Date | undefined): string {
  if (!d || !isValid(d)) return "";
  return format(d, "yyyy-MM-dd");
}

export interface DateFieldProps {
  value?: unknown;
  onChange: (next: string | null) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: boolean;
  placeholder?: string;
  /** Smaller control for table cells */
  compact?: boolean;
}

export function DateField({
  value,
  onChange,
  onBlur,
  disabled,
  error,
  placeholder = "Pick a date",
  compact,
}: DateFieldProps) {
  const [open, setOpen] = React.useState(false);
  const selected = parseValue(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onBlur={onBlur}
          className={cn(
            "w-full justify-start text-left font-semibold whitespace-nowrap overflow-hidden",
            compact ? "h-10 rounded-xl px-3 text-xs" : "h-12 rounded-xl px-4 text-sm",
            !selected && "text-slate-400",
            error && "border-destructive ring-destructive/20"
          )}
        >
          <CalendarIcon className={cn("mr-2 shrink-0 opacity-60", compact ? "h-3.5 w-3.5" : "h-4 w-4")} />
          <span className="truncate">
            {selected ? format(selected, "PP") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            onChange(d ? toStoredString(d) : null);
            setOpen(false);
          }}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
