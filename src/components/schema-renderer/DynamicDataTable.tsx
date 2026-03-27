"use client";

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Field, Column } from "@/types";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DateField } from "@/components/ui/date-field";
import { TimeField } from "@/components/ui/time-field";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

/**
 * Optimized min-widths for different column types to ensure
 * high-performance 'Senior-level' UI density without truncation.
 */
const GET_COL_MIN_WIDTH = (col: Column) => {
  if (col.key === "address" || col.key.toLowerCase().includes("address")) return "min-w-[280px]";
  if (col.key === "name" || col.key.toLowerCase().includes("name")) return "min-w-[200px]";
  
  switch (col.type) {
    case "date": return "min-w-[170px]";
    case "select": return "min-w-[150px]";
    case "currency": return "min-w-[130px]";
    case "time": return "min-w-[120px]";
    case "number": return "min-w-[90px]";
    case "checkbox": return "min-w-[80px]";
    default: return "min-w-[150px]";
  }
};

export function DynamicDataTable({ field }: { field: Field }) {
  const { control } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: field.key,
  });

  if (!field.columns) return null;

  return (
    <div className="w-full border border-slate-200/60 rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        <table className="w-full text-sm border-collapse table-auto">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/60">
              {field.columns.map((col: Column) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-r last:border-0 border-slate-200/40 whitespace-nowrap",
                    GET_COL_MIN_WIDTH(col)
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fields.map((row, rowIndex) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                {field.columns?.map((col: Column) => {
                  const isEditable = field.editableColumns?.includes(col.key);
                  return (
                    <td 
                      key={col.key} 
                      className={cn(
                        "px-6 py-4 border-r last:border-0 border-slate-200/20 align-top",
                        GET_COL_MIN_WIDTH(col)
                      )}
                    >
                      {isEditable ? (
                        <div className="animate-in fade-in slide-in-from-left-1 duration-300">
                          <InlineCellEditor col={col} name={`${field.key}.${rowIndex}.${col.key}`} />
                        </div>
                      ) : (
                        <div className="py-1">
                          <ReadOnlyCell col={col} value={(row as Record<string, unknown>)[col.key]} />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {fields.length === 0 && (
              <tr>
                <td colSpan={field.columns.length} className="px-6 py-16 text-center">
                  <p className="text-sm font-bold text-slate-300 italic uppercase tracking-[0.3em]">
                    No jurisdictional records found
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InlineCellEditor({ col, name }: { col: Column; name: string }) {
  const { register, control } = useFormContext();

  switch (col.type) {
    case "checkbox":
      return (
        <div className="flex items-center justify-center py-1">
          <Checkbox {...register(name)} />
        </div>
      );
    case "date":
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: f }) => (
            <DateField 
              compact 
              value={f.value} 
              onChange={f.onChange} 
              onBlur={f.onBlur} 
              placeholder="Select date" 
            />
          )}
        />
      );
    case "time":
      return (
        <Controller
          name={name}
          control={control}
          render={({ field: f }) => (
            <TimeField compact value={f.value} onChange={f.onChange} onBlur={f.onBlur} />
          )}
        />
      );
    case "select":
      return (
        <select
          {...register(name)}
          className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-700 focus:ring-4 focus:ring-primary/5 hover:border-slate-300 transition-all outline-none appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1rem'
          }}
        >
          {col.options?.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    default:
      return (
        <Input
          type={col.type === "number" ? "number" : "text"}
          className="h-10 py-1 px-4 text-xs font-bold bg-slate-50 border-slate-200 rounded-xl focus:ring-4 focus:ring-primary/5 transition-all"
          {...register(name)}
        />
      );
  }
}

function ReadOnlyCell({ col, value }: { col: Column; value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-200 font-black">—</span>;
  }

  switch (col.type) {
    case "currency":
      return <span className="font-mono font-black text-slate-900 tracking-tighter">{formatCurrency(Number(value))}</span>;
    case "date":
      return <span className="font-bold text-slate-600 whitespace-nowrap">{formatDate(String(value))}</span>;
    case "time":
      return <span className="font-mono font-bold text-slate-700 whitespace-nowrap">{String(value)}</span>;
    case "checkbox":
      return (
        <div className="flex justify-center">
          <div
            className={cn(
              "h-5 w-5 rounded-lg flex items-center justify-center border-2 transition-all shadow-sm",
              value ? "bg-primary border-primary" : "border-slate-200 bg-white"
            )}
          >
            {value && <div className="h-1.5 w-1.5 rounded-full bg-white animate-in zoom-in duration-300" />}
          </div>
        </div>
      );
    default:
      return <p className="font-bold text-slate-700 leading-relaxed max-w-[400px]">{String(value)}</p>;
  }
}
