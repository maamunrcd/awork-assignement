import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  placeholder?: string;
  error?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, error, ...props }, ref) => {
    return (
      <div className="relative group">
        <select
          className={cn(
            "flex h-12 w-full appearance-none rounded-xl border bg-white px-4 py-2 text-sm font-semibold tracking-tight ring-offset-background transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
            error ? "border-destructive ring-destructive/20" : "border-slate-200 hover:border-slate-400 focus:border-primary",
            className
          )}
          ref={ref}
          {...props}
        >
          <option value="" disabled className="text-slate-300">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="font-medium text-slate-900">{opt}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 group-hover:text-primary transition-colors">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
