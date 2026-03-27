"use client";

import { useCommandCenter } from "@/hooks/use-command-center";
import { User as UserIcon, Bell, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, role, setRole } = useCommandCenter();

  return (
    <header className="flex h-16 items-center justify-between bg-white shrink-0 border-b border-slate-200/50 z-50 shadow-[0_2px_15px_-10px_rgba(0,0,0,0.05)]">
      {/* Branding Column - Aligned 1:1 with Sidebar Rail */}
      <div className="flex items-center justify-center w-[64px] h-full border-r border-slate-200/40">
        <div className="bg-slate-900 p-2 rounded-xl shadow-lg shadow-slate-900/10 hover:scale-105 transition-transform cursor-pointer">
          <Shield className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between px-6">
        <div className="flex flex-col">
          <h1 className="text-base font-black text-slate-900 tracking-tighter uppercase flex items-center gap-2">
            Pearson Specter <span className="text-primary font-light">LITT</span>
          </h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
            Jurisdictional Command
          </p>
        </div>
      </div>

      <div className="flex items-center gap-8 h-full px-4">
        {/* Sleeker Role Switcher */}
        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/40">
          <RoleButton 
            active={role === "processor"} 
            onClick={() => setRole("processor")} 
            label="Processor" 
          />
          <RoleButton 
            active={role === "attorney"} 
            onClick={() => setRole("attorney")} 
            label="Attorney" 
          />
        </div>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-5">
          <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">
            <Bell className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-900 leading-none group-hover:text-primary transition-colors">{user?.name}</p>
              <p className="text-[9px] text-primary font-black uppercase tracking-wider mt-1.5 opacity-60">
                {user?.region} • {user?.role}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-900/10 group-hover:scale-105 transition-transform overflow-hidden relative">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <UserIcon className="h-5 w-5 text-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function RoleButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] rounded-lg transition-all duration-300",
        active 
          ? "bg-white text-primary shadow-sm ring-1 ring-slate-200/50" 
          : "text-slate-400 hover:text-slate-600"
      )}
    >
      {label}
    </button>
  );
}
