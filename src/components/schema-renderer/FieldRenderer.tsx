"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Field } from "@/types";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DateField } from "@/components/ui/date-field";
import { TimeField } from "@/components/ui/time-field";
import { DynamicDataTable } from "./DynamicDataTable";

export function FieldRenderer({ field }: { field: Field }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  switch (field.type) {
    case "text":
    case "number":
    case "currency":
      return (
        <Input
          type={field.type === "currency" || field.type === "number" ? "number" : "text"}
          placeholder={field.placeholder}
          readOnly={field.readonly}
          {...register(field.key, { required: field.required })}
          error={!!errors[field.key]}
        />
      );

    case "date":
      return (
        <Controller
          name={field.key}
          control={control}
          rules={{ required: field.required }}
          render={({ field: f }) => (
            <DateField
              value={f.value}
              onChange={f.onChange}
              onBlur={f.onBlur}
              disabled={field.readonly}
              error={!!errors[field.key]}
              placeholder={field.placeholder || "Pick a date"}
            />
          )}
        />
      );

    case "time":
      return (
        <Controller
          name={field.key}
          control={control}
          rules={{ required: field.required }}
          render={({ field: f }) => (
            <TimeField
              value={f.value}
              onChange={f.onChange}
              onBlur={f.onBlur}
              disabled={field.readonly}
              error={!!errors[field.key]}
            />
          )}
        />
      );

    case "textarea":
      return (
        <Textarea
          placeholder={field.placeholder}
          readOnly={field.readonly}
          {...register(field.key, { required: field.required })}
          error={!!errors[field.key]}
        />
      );

    case "checkbox":
      return (
        <div className="flex min-h-10 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <Checkbox
            id={field.key}
            {...register(field.key, {
              validate: (v) => !field.required || v === true,
            })}
            disabled={field.readonly}
          />
          <label
            htmlFor={field.key}
            className="flex-1 cursor-pointer text-sm font-medium leading-snug text-slate-700 select-none"
          >
            {field.label}
            {field.required && (
              <span className="ml-1 text-destructive" aria-hidden>
                *
              </span>
            )}
          </label>
        </div>
      );

    case "select":
      return (
        <Select
          options={field.options || []}
          placeholder={field.placeholder || "Select option..."}
          disabled={field.readonly}
          {...register(field.key, { required: field.required })}
          error={!!errors[field.key]}
        />
      );

    case "table":
      return <DynamicDataTable field={field} />;

    default:
      return <div className="text-destructive text-xs">Unsupported field type: {field.type}</div>;
  }
}
