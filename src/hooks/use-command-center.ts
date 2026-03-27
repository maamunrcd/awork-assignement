import { create } from "zustand";
import { Task, User } from "@/types";

interface CommandCenterState {
  tasks: Task[];
  user: User | null;
  selectedTaskId: string | null;
  role: "processor" | "attorney";
  filters: {
    client: string[];
    region: string[];
    category: string[];
    status: string[];
    searchQuery: string;
  };
  sortBy: "priority" | "slaDeadline" | "revenueAtRisk";
  isSidebarOpen: boolean;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  setUser: (user: User) => void;
  setSelectedTaskId: (id: string | null) => void;
  setRole: (role: "processor" | "attorney") => void;
  setFilters: (filters: Partial<CommandCenterState["filters"]>) => void;
  setSortBy: (sortBy: CommandCenterState["sortBy"]) => void;
  resetFilters: () => void;
  toggleSidebar: () => void;
}

export const useCommandCenter = create<CommandCenterState>((set) => ({
  tasks: [],
  user: null,
  selectedTaskId: null,
  role: "processor",
  filters: {
    client: [],
    region: [],
    category: [],
    status: [],
    searchQuery: "",
  },
  sortBy: "priority",
  isSidebarOpen: true,

  setTasks: (tasks) => set({ tasks }),
  setUser: (user) => set({ user, role: user.role }),
  setSelectedTaskId: (id) => set({ selectedTaskId: id }),
  setRole: (role) => set({ role }),
  setFilters: (newFilters) => 
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set({
    filters: { client: [], region: [], category: [], status: [], searchQuery: "" }
  }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
