import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border bg-white px-4 py-2 text-sm font-semibold tracking-tight ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 transition-all shadow-sm",
          error ? "border-destructive ring-destructive/20" : "border-slate-200 hover:border-slate-400 focus:border-primary",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
