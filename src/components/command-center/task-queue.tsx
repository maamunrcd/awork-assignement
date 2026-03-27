"use client";

import { useCommandCenter } from "@/hooks/use-command-center";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, getSlaUrgency } from "@/lib/utils";
import type { Task } from "@/types";
import { Clock, AlertCircle, DollarSign, MapPin, ChevronRight, User, TrendingUp } from "lucide-react";
import { differenceInDays } from "date-fns";
import { filterTasks, sortTasks } from "@/lib/task-queue-logic";

export function TaskQueue() {
  const { tasks, selectedTaskId, setSelectedTaskId, filters, sortBy } = useCommandCenter();

  const sortedTasks = sortTasks(filterTasks(tasks, filters), sortBy);
  const visibleCount = sortedTasks.length;
  const totalCount = tasks.length;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white border-r border-slate-200/60 shadow-[inset_-1px_0_2px_rgba(0,0,0,0.02)]">
      {/* Refined Task Queue Header */}
      <div className="p-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Marketplace Pipeline</h2>
            <div className="flex items-center gap-1.5 mt-2">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                {visibleCount} ACTIVE ORDERS
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-slate-900 text-[10px] font-black text-white tabular-nums border border-slate-900 shadow-lg shadow-slate-900/10">
               {totalCount} Total
             </div>
          </div>
        </div>
      </div>
      
      {/* Task List - Improved Padding and Spacing */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30 scrollbar-hide">
        {sortedTasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            isSelected={selectedTaskId === task.id}
            onClick={() => setSelectedTaskId(task.id)}
          />
        ))}

        {sortedTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="h-20 w-20 rounded-[2rem] bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6">
              <AlertCircle className="h-8 w-8 text-slate-200" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Zero matches in pipeline</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  isSelected,
  onClick,
}: {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
}) {
  const daysRemaining = differenceInDays(new Date(task.slaDeadline), new Date());
  const urgency = getSlaUrgency(daysRemaining);
  const u = {
    critical: "bg-red-500",
    warning: "bg-amber-500",
    ok: "bg-emerald-500",
  }[urgency];

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex flex-col p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden",
        isSelected 
          ? "bg-white border-primary shadow-[0_12px_24px_-8px_rgba(15,23,42,0.15)] ring-1 ring-primary/10" 
          : "bg-white border-slate-200/50 hover:border-slate-300 hover:bg-white"
      )}
    >
      {/* Top Protocol Bar: IDs & Priority */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 uppercase font-black text-[11px] tracking-[0.1em]">
          <span className="text-primary">{task.caseNumber}</span>
          <span className="h-0.5 w-1 bg-slate-200 rounded-full" />
          <span className="text-slate-400">{task.client}</span>
        </div>
        <div className="h-6 px-2 rounded bg-slate-100 flex items-center justify-center text-[11px] font-black text-slate-500 font-mono tracking-tighter">
          P{task.priority}
        </div>
      </div>

      {/* Primary Context: Step & Subject */}
      <div className="mb-3">
        <h3 className="text-[15px] font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight leading-tight mb-1.5">
          {task.stepName}
        </h3>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <User className="h-3.5 w-3.5 text-slate-400 opacity-60" />
          <span className="truncate">{task.borrower}</span>
        </div>
      </div>

      {/* Peripheral Data: SLA & Value */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-2.5 overflow-hidden shrink-0">
          <div className={cn("h-2 w-2 rounded-full shadow-sm", u)} />
          <span className={cn(
            "text-[11px] font-black uppercase tracking-tight",
            daysRemaining < 0 ? "text-red-600 font-black" : "text-slate-400"
          )}>
            {daysRemaining < 0 ? "OVERDUE" : `${daysRemaining}d SLA`}
          </span>
        </div>
        
        <div className="flex items-center gap-1 font-black text-xs text-slate-900 tracking-tighter tabular-nums">
          <DollarSign className="h-3 w-3 text-emerald-500" />
          {formatCurrency(task.revenueAtRisk)}
        </div>
      </div>

      {isSelected && (
        <div className="absolute inset-y-0 left-0 w-1 bg-primary animate-in slide-in-from-left duration-300" />
      )}
    </div>
  );
}
