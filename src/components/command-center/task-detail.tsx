"use client";

import { useCommandCenter } from "@/hooks/use-command-center";
import { useEffect, useState } from "react";
import { Loader2, FileText, CheckCircle2, ShieldCheck, Calendar, DollarSign, MapPin, User as UserIcon, Briefcase, Info } from "lucide-react";
import { TaskSchema, Task } from "@/types";
import { SchemaRenderer } from "@/components/schema-renderer/SchemaRenderer";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskDetail() {
  const { selectedTaskId, tasks } = useCommandCenter();
  const [schema, setSchema] = useState<TaskSchema | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  useEffect(() => {
    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!selectedTaskId || !task) return;

    async function loadTaskInfo(schemaRef: string, taskId: string) {
      setLoading(true);
      try {
        const [schemaRes, dataRes] = await Promise.all([
          fetch(`/api/task-schemas/${schemaRef}`),
          fetch(`/api/task-data/${taskId}`),
        ]);
        
        const schemaJson = await schemaRes.json();
        const dataJson = await dataRes.json();
        
        setSchema(schemaJson);
        setInitialData(dataJson);
      } catch (error) {
        console.error("Failed to load task details", error);
      } finally {
        setLoading(false);
      }
    }

    loadTaskInfo(task.schemaRef, selectedTaskId);
  }, [selectedTaskId, tasks]);

  if (!selectedTask) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-12 text-center bg-slate-50/20 animate-in fade-in duration-700">
        <div className="h-24 w-24 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center justify-center mb-10 overflow-hidden relative group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <FileText className="h-10 w-10 text-slate-100 group-hover:text-primary/20 transition-colors" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase">Workflow Inactive</h3>
        <p className="text-slate-400 max-w-sm text-xs leading-relaxed font-bold uppercase tracking-wider opacity-60">
           Select a localized pipeline order to initiate the foreclosure milestone protocol.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-white">
        <div className="p-8 border-b space-y-6">
           <Skeleton className="h-4 w-24 rounded-full" />
           <div className="space-y-3">
              <Skeleton className="h-10 w-2/3 rounded-xl" />
              <Skeleton className="h-4 w-3/4 opacity-70 rounded-full" />
           </div>
           <div className="flex gap-4 pt-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-32 rounded-xl" />
              ))}
           </div>
        </div>
        <div className="flex-1 p-8 space-y-10">
           <div className="space-y-6">
              <Skeleton className="h-8 w-48 rounded-xl" />
              <div className="grid grid-cols-2 gap-6">
                 {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-2xl" />
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (!schema) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700 ease-out">
      {/* Detail Header - More compact and high-performance */}
      <div className="px-8 py-6 border-b shrink-0 bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-3 min-w-0 flex-1 pr-12">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="h-5 bg-slate-50 text-slate-500 border-slate-200 px-2 py-0 font-black uppercase text-[9px] tracking-widest leading-none rounded-md">
                {selectedTask.category}
              </Badge>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest tabular-nums">
                CASE: {selectedTask.caseNumber}
              </span>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none truncate">
              {schema.title}
            </h2>
            <p className="text-[13px] text-slate-500 font-bold max-w-2xl truncate opacity-80">
              {schema.description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm shadow-emerald-500/5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest whitespace-nowrap">Regulatory Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg border border-slate-200/60">
               <MapPin className="h-3 w-3 text-slate-300" />
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{selectedTask.region}</span>
            </div>
          </div>
        </div>
        
        {/* Compact Stat Deck - More list-like and horizontal */}
        <div className="flex items-center gap-8 mt-6 pt-6 border-t border-slate-50">
           <StaticBox icon={UserIcon} label="Borrower" value={selectedTask.borrower} />
           <StaticBox icon={Briefcase} label="Entity" value={selectedTask.client} />
           <StaticBox icon={DollarSign} label="Exposure" value={formatCurrency(selectedTask.revenueAtRisk)} valueColor="text-primary" />
           <StaticBox icon={Info} label="Milestone" value={selectedTask.milestoneAtRisk} />
        </div>
      </div>

      {/* Dynamic Form Content */}
      <div className="flex-1 overflow-y-auto bg-white scroll-smooth scrollbar-hide">
        <div className="p-8 pb-16 w-full">
          <SchemaRenderer 
            schema={schema} 
            initialData={initialData} 
            taskId={selectedTaskId || ""}
          />
        </div>
      </div>
    </div>
  );
}

function StaticBox({ icon: Icon, label, value, valueColor }: any) {
  return (
    <div className="flex items-center gap-2.5 min-w-0 group">
      <div className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
        <Icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors" />
      </div>
      <div className="flex flex-col min-w-0 pr-4 border-r border-slate-100 last:border-0">
        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none mb-1">{label}</span>
        <span className={cn("text-[11px] font-black text-slate-900 truncate leading-none pt-0.5", valueColor)}>{value}</span>
      </div>
    </div>
  );
}
