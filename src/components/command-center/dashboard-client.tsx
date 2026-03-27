"use client";

import { useRef } from "react";
import { useCommandCenter } from "@/hooks/use-command-center";
import type { Task, User } from "@/types";
import { TaskQueue } from "@/components/command-center/task-queue";
import { TaskDetail } from "@/components/command-center/task-detail";
import { Header } from "@/components/command-center/header";
import { FilterBar } from "@/components/command-center/filter-bar";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

type DashboardClientProps = {
  user: User;
  tasks: Task[];
};

/**
 * Client boundary: Zustand, filters, selection, and task detail fetching stay here.
 * Initial user + tasks are loaded on the server and synced once before paint via the store.
 */
export function DashboardClient({ user, tasks }: DashboardClientProps) {
  const { isSidebarOpen, toggleSidebar } = useCommandCenter();
  const bootstrapped = useRef(false);
  if (!bootstrapped.current) {
    useCommandCenter.getState().setUser(user);
    useCommandCenter.getState().setTasks(tasks);
    bootstrapped.current = true;
  }

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden font-sans antialiased text-slate-900 group">
      <Header />
      <main className="flex flex-1 overflow-hidden relative">
        
        {/* Column 1: Filter Logic / Sidebar (Professional Rail Architecture) */}
        <div className={cn(
          "bg-white flex flex-col shrink-0 border-r border-slate-200 transition-all duration-500 ease-in-out relative z-40 overflow-hidden",
          isSidebarOpen ? "w-[300px]" : "w-[64px]"
        )}>
          {/* Rail Header / Internal Overlay Logic */}
          {!isSidebarOpen && (
            <div className="absolute inset-x-0 top-0 h-16 flex items-center justify-center bg-white border-b border-slate-200/40">
              <button 
                onClick={toggleSidebar}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:scale-110 active:scale-95 transition-all outline-none"
                title="Expand Workspace Filters"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className={cn(
            "h-full transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <div className="min-w-[300px] h-full">
              <FilterBar />
           </div>
          </div>
        </div>

        {/* Column 2: Task Queue */}
        <section className="w-[420px] flex flex-col border-r bg-slate-50/50 shrink-0">
          <TaskQueue />
        </section>

        {/* Column 3: Task Detail */}
        <section className="flex-1 flex flex-col overflow-hidden bg-white">
          <TaskDetail />
        </section>
      </main>
    </div>
  );
}
