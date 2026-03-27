import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(dateString));
}

/** Days until SLA from start of today → deadline (date-fns-style ceiling). */
export type SlaUrgency = "critical" | "warning" | "ok";

export function getSlaUrgency(daysRemaining: number): SlaUrgency {
  if (daysRemaining < 0 || daysRemaining <= 2) return "critical";
  if (daysRemaining <= 7) return "warning";
  return "ok";
}
