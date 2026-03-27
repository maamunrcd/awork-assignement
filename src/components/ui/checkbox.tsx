import * as React from "react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-lg border-2 border-slate-300 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 accent-primary checked:border-primary",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };
