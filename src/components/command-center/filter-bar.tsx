"use client";

import { useMemo, useState, useEffect } from "react";
import { useCommandCenter } from "@/hooks/use-command-center";
import { Search, RotateCcw, XCircle, ChevronDown, Check, Filter, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

function sortedUniq(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function FilterBar() {
  const { tasks, filters, setFilters, resetFilters, sortBy, setSortBy, toggleSidebar } = useCommandCenter();
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);
  const [isOpExpanded, setIsOpExpanded] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ searchQuery: localSearch });
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, setFilters]);

  useEffect(() => {
    setLocalSearch(filters.searchQuery);
  }, [filters.searchQuery]);

  const clients = useMemo(() => sortedUniq(tasks.map((t) => t.client)), [tasks]);
  const regions = useMemo(() => sortedUniq(tasks.map((t) => t.region)), [tasks]);
  const categories = useMemo(() => sortedUniq(tasks.map((t) => t.category)), [tasks]);
  const statuses = useMemo(() => sortedUniq(tasks.map((t) => t.status)), [tasks]);

  const getCounts = (key: keyof Task) => {
    const map: Record<string, number> = {};
    tasks.forEach((t) => {
      const val = String(t[key as keyof typeof t]);
      map[val] = (map[val] || 0) + 1;
    });
    return map;
  };

  const clientCounts = useMemo(() => getCounts("client"), [tasks]);
  const regionCounts = useMemo(() => getCounts("region"), [tasks]);
  const categoryCounts = useMemo(() => getCounts("category"), [tasks]);
  const statusCounts = useMemo(() => getCounts("status"), [tasks]);

  const toggleFilter = (type: keyof typeof filters, value: string) => {
    if (type === "searchQuery") return;
    const current = filters[type];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setFilters({ [type]: next });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200/60 font-sans">
      {/* Sidebar Local Header & Toggle */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/40 bg-white shrink-0">
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800">Workspace Control</span>
        <button 
          onClick={toggleSidebar}
          className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100/50 text-slate-400 hover:text-primary hover:bg-white border border-transparent hover:border-slate-200 transition-all shadow-sm active:scale-95"
          title="Collapse Sidebar"
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Search Header - Now Collapsible as per User Request */}
      <div className="p-4 pt-6 space-y-4 shrink-0 bg-white/50">
        <button 
          onClick={() => setIsOpExpanded(!isOpExpanded)}
          className="flex items-center justify-between w-full px-2 text-[11px] font-black text-slate-400 uppercase tracking-widest group"
        >
          <div className="flex items-center gap-2">
             <div className="h-1 w-1 rounded-full bg-slate-300 group-hover:bg-primary transition-colors" />
             Operational Logic
          </div>
          <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", !isOpExpanded && "-rotate-90")} />
        </button>

        {isOpExpanded && (
          <div className="space-y-4 px-2 animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500">Pipeline Search</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="h-6 px-2 text-[9px] font-black uppercase text-slate-400 hover:text-primary gap-1"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>

            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors duration-300" />
              <input 
                type="text" 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search pipeline..." 
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-xs font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none shadow-sm" 
              />
              {localSearch && (
                <button 
                  onClick={() => setLocalSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Filter Areas - Moving from Chips to List Items for Desktop Professionalism */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-hide">
        
        <FilterListGroup 
          label="Counterparty" 
          values={clients} 
          selected={filters.client} 
          counts={clientCounts}
          onToggle={(v) => toggleFilter("client", v)} 
        />

        <FilterListGroup 
          label="Jurisdiction" 
          values={regions} 
          selected={filters.region} 
          counts={regionCounts}
          onToggle={(v) => toggleFilter("region", v)} 
        />

        <FilterListGroup 
          label="Taxonomy" 
          values={categories} 
          selected={filters.category} 
          counts={categoryCounts}
          onToggle={(v) => toggleFilter("category", v)} 
        />

        <FilterListGroup 
          label="Status Protocol" 
          values={statuses} 
          selected={filters.status} 
          counts={statusCounts}
          onToggle={(v) => toggleFilter("status", v)} 
        />

        {/* Sort Protocol - Clean vertical list */}
        <div className="space-y-4 pt-4 border-t border-slate-200/40">
          <p className="px-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
            Prioritization Logic
          </p>
          <div className="space-y-1">
             <SortItem active={sortBy === "priority"} onClick={() => setSortBy("priority")} label="Impact / Primary" />
             <SortItem active={sortBy === "slaDeadline"} onClick={() => setSortBy("slaDeadline")} label="Timeline Urgency" />
             <SortItem active={sortBy === "revenueAtRisk"} onClick={() => setSortBy("revenueAtRisk")} label="Financial Exposure" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SortItem({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all",
        active 
          ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10" 
          : "text-slate-500 hover:text-slate-900 hover:bg-white shadow-none"
      )}
    >
      {label}
      {active && <Check className="h-3 w-3 text-primary stroke-[4]" />}
    </button>
  );
}

function FilterListGroup({
  label,
  values,
  selected,
  onToggle,
  counts = {},
}: {
  label: string;
  values: string[];
  selected: string[];
  onToggle: (value: string) => void;
  counts?: Record<string, number>;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (values.length === 0) return null;

  return (
    <div className="space-y-3 px-2">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-[11px] font-black text-slate-400 uppercase tracking-widest group"
      >
        <div className="flex items-center gap-2">
           <div className="h-1 w-1 rounded-full bg-slate-300 group-hover:bg-primary transition-colors" />
           {label}
        </div>
        <ChevronDown className={cn("h-3 w-3 transition-transform duration-300", !isExpanded && "-rotate-90")} />
      </button>

      {isExpanded && (
        <div className="space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-300">
          {values.map((value) => {
            const isActive = selected.includes(value);
            const count = counts[value] || 0;
            return (
              <button
                key={value}
                onClick={() => onToggle(value)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold tracking-tight transition-all border border-transparent group/item",
                  isActive
                    ? "bg-white text-primary border-slate-200/60 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-4 w-4 rounded-md border-2 transition-all flex items-center justify-center shrink-0",
                    isActive ? "bg-primary border-primary" : "bg-white border-slate-200 group-hover/item:border-slate-300"
                  )}>
                    {isActive && <Check className="h-2.5 w-2.5 text-white stroke-[4]" />}
                  </div>
                  <span className="truncate">{value}</span>
                </div>
                {count > 0 && (
                  <span className={cn(
                    "ml-2 text-[9px] font-black py-0.5 px-1.5 rounded bg-slate-100 text-slate-400 group-hover/item:bg-slate-200 transition-colors",
                    isActive && "bg-primary/10 text-primary"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
