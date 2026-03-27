import type { Task } from "@/types";

export type TaskFilters = {
  client: string[];
  region: string[];
  category: string[];
  status: string[];
  searchQuery: string;
};

export type SortKey = "priority" | "slaDeadline" | "revenueAtRisk";

/** Region filter: task matches if its region equals any selected value or lies under it in the dotted hierarchy. */
export function taskMatchesRegionFilter(taskRegion: string, selectedRegions: string[]): boolean {
  if (selectedRegions.length === 0) return true;
  return selectedRegions.some((r) => {
    if (taskRegion === r) return true;
    return taskRegion.startsWith(`${r}.`);
  });
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const search = filters.searchQuery.toLowerCase().trim();
  
  return tasks.filter((task) => {
    // Search filter (Req 1.4+ - Senior UX)
    if (search) {
      const matchSearch = 
        task.caseNumber.toLowerCase().includes(search) ||
        task.borrower.toLowerCase().includes(search) ||
        task.stepName.toLowerCase().includes(search) ||
        task.propertyAddress.toLowerCase().includes(search);
      
      if (!matchSearch) return false;
    }

    if (filters.client.length > 0 && !filters.client.includes(task.client)) return false;
    if (filters.status.length > 0 && !filters.status.includes(task.status)) return false;
    if (filters.category.length > 0 && !filters.category.includes(task.category)) return false;
    if (filters.region.length > 0 && !taskMatchesRegionFilter(task.region, filters.region)) return false;
    
    return true;
  });
}

export function sortTasks(tasks: Task[], sortBy: SortKey): Task[] {
  return [...tasks].sort((a, b) => {
    if (sortBy === "priority") return b.priority - a.priority;
    if (sortBy === "revenueAtRisk") return b.revenueAtRisk - a.revenueAtRisk;
    if (sortBy === "slaDeadline")
      return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
    return 0;
  });
}
