"use client";

import { useForm, FormProvider, useFormContext, useWatch } from "react-hook-form";
import { TaskSchema, Section, Field, Action } from "@/types";
import { useCommandCenter } from "@/hooks/use-command-center";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FieldRenderer } from "./FieldRenderer";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
import { isFieldVisibleForControllingValue } from "@/lib/field-visibility";

interface SchemaRendererProps {
  schema: TaskSchema;
  initialData: any;
  taskId: string;
}

export function SchemaRenderer({ schema, initialData, taskId }: SchemaRendererProps) {
  const { role, user } = useCommandCenter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastPayload, setLastPayload] = useState<any>(null);

  const methods = useForm({
    defaultValues: initialData || {},
    mode: "onChange",
    shouldUnregister: true, // Req 2.2.4 & 5.3: hidden fields don't block validation or enter payload
  });

  const onSubmit = (data: unknown, actionKey: string) => {
    const payload = {
      taskId,
      action: actionKey,
      formData: data,
      submittedAt: new Date().toISOString(),
      submittedBy: user?.id || "unknown",
    };

    console.log(payload);
    setLastPayload(payload);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div 
        role="status" 
        aria-live="polite"
        className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 fade-in duration-500"
      >
        <div className="h-24 w-24 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight text-center">Milestone Documented</h2>
        <p className="text-slate-500 max-w-md text-center font-medium leading-relaxed mb-10">
          The milestone <span className="text-slate-900 font-bold uppercase">{lastPayload?.action}</span> has been processed. 
          The system of record has been updated with the forensic payload.
        </p>
        <Button 
          variant="outline" 
          onClick={() => setIsSubmitted(false)}
          className="rounded-xl font-black border-slate-200 uppercase tracking-widest text-[10px] h-10 px-6 hover:bg-slate-50 gap-2"
        >
          <RefreshCw className="h-3 w-3" />
          Review Workflow
        </Button>
      </div>
    );
  }

  const roleRules = schema.roleVisibility[role] || { hiddenFields: [], hiddenSections: [], disabledActions: [] };

  return (
    <FormProvider {...methods}>
      <form className="space-y-16">
        {schema.sections
          .filter((section) => !roleRules.hiddenSections?.includes(section.key))
          .map((section, idx) => (
            <SectionComponent 
              key={section.key} 
              section={section} 
              hiddenFields={roleRules.hiddenFields}
              index={idx}
            />
          ))}

        {/* High-Impact Actions Console */}
        <div className="flex items-center justify-between p-8 rounded-[2rem] bg-slate-900 shadow-2xl shadow-slate-900/30 ring-1 ring-white/10 animate-in slide-in-from-bottom-8 duration-700 ease-out">
           <div className="flex flex-col">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Execution Protocol</span>
             <p className="text-xs font-bold text-white tracking-tight opacity-80 uppercase">Finalize current jurisdictional step</p>
           </div>
           
           <div className="flex items-center gap-4">
            {schema.actions.map((action) => (
              <ActionButton 
                key={action.key} 
                action={action} 
                roleRules={roleRules}
                onSubmit={(key) => methods.handleSubmit((data) => onSubmit(data, key))()}
              />
            ))}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

function SectionComponent({ section, hiddenFields, index }: { section: Section, hiddenFields: string[], index: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const visibleFields = section.fields.filter((f) => !hiddenFields.includes(f.key));
  
  if (visibleFields.length === 0) return null;

  return (
    <section 
      className={cn(
        "space-y-8 p-8 rounded-3xl border transition-all duration-500 ease-in-out relative group",
        isExpanded ? "bg-white border-slate-200/60 shadow-xl shadow-slate-200/30" : "bg-slate-50/50 border-transparent hover:bg-slate-50"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-6 cursor-pointer select-none"
      >
        <div className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all duration-500 shadow-sm",
          isExpanded ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 rotate-[360deg]" : "bg-white border border-slate-200 text-slate-400"
        )}>
          0{index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-black text-slate-900 tracking-[0.15em] uppercase">{section.heading}</h3>
            {!isExpanded && (
              <Badge variant="outline" className="text-[8px] font-black opacity-40 uppercase tracking-widest px-1.5 h-4 border-slate-200">
                {visibleFields.length} Fields
              </Badge>
            )}
          </div>
          <div className={cn("h-0.5 bg-primary/20 mt-2 transition-all duration-500", isExpanded ? "w-12" : "w-6 opacity-40")} />
        </div>
        
        <div className={cn(
          "h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center transition-transform duration-500 bg-white",
          !isExpanded && "-rotate-90 opacity-60"
        )}>
           <ArrowRight className="h-4 w-4 text-slate-400 rotate-90" />
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pl-2 animate-in fade-in slide-in-from-top-4 duration-500">
          {visibleFields.map((field) => (
            <FieldWrapper key={field.key} field={field} />
          ))}
        </div>
      )}
    </section>
  );
}

function FieldWrapper({ field }: { field: Field }) {
  const { control } = useFormContext();
  
  const controllingValue = useWatch({
    control,
    name: field.visibleWhen?.field || "_none_",
  });

  const isVisible = useMemo(
    () => isFieldVisibleForControllingValue(field, controllingValue),
    [field, controllingValue]
  );

  if (!isVisible) return null;

  const isCheckbox = field.type === "checkbox";

  return (
    <div className={cn("space-y-3 group", field.type === "table" || field.type === "textarea" ? "col-span-full" : "")}>
      {!isCheckbox && (
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2 group-focus-within:text-primary transition-colors">
            {field.label}
            {field.required && <span className="h-1 w-1 rounded-full bg-destructive/40" aria-hidden />}
          </label>
          {field.required && (
            <Badge
              variant="outline"
              className="text-[8px] h-4 px-1.5 border-slate-100 text-slate-400 bg-slate-50 uppercase font-black tracking-widest leading-none"
            >
              Mandatory
            </Badge>
          )}
        </div>
      )}
      <div className={cn("transition-all duration-300 transform group-focus-within:translate-x-1", isCheckbox && "translate-x-0")}>
        <FieldRenderer field={field} />
      </div>
    </div>
  );
}

function ActionButton({
  action,
  roleRules,
  onSubmit,
}: {
  action: Action;
  roleRules: { disabledActions: string[] };
  onSubmit: (key: string) => void;
}) {
  const {
    formState: { isValid },
  } = useFormContext();
  const isDisabledByRole = roleRules.disabledActions.includes(action.key);
  /** Req 6: only primary actions with requiresAllRequired are gated by validation. */
  const isBlockedByValidation = Boolean(action.requiresAllRequired) && !isValid;

  const btnVariant =
    action.variant === "primary"
      ? "primary"
      : action.variant === "secondary"
        ? "secondary"
        : action.variant;

  return (
    <Button
      type="button"
      variant={btnVariant as "primary" | "secondary" | "outline" | "destructive"}
      disabled={isDisabledByRole || isBlockedByValidation}
      onClick={() => onSubmit(action.key)}
      className={cn(
        "px-6 font-black uppercase tracking-widest h-12 rounded-xl border border-transparent transition-all",
        action.variant === "primary" ? "hover:scale-105 active:scale-95 shadow-xl shadow-accent/20" : "",
        (isDisabledByRole || isBlockedByValidation) && "opacity-40 grayscale"
      )}
    >
      {action.label}
      {action.variant === "primary" && <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
  );
}
