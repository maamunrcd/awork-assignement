import userData from "@/lib/data/user.json";
import tasksData from "@/lib/data/tasks.json";
import taskValues from "@/lib/data/task-data.json";
import type { Task, User } from "@/types";

/** Single source of truth for dashboard bootstrap (server components + `/api/user`). */
export function getInitialUser(): User {
  return userData as User;
}

/** Same ordering as `GET /api/tasks` — priority highest first. */
export function getInitialTasks(): Task[] {
  return [...tasksData].sort((a, b) => b.priority - a.priority) as Task[];
}

/** Returns pre-populated field values for a specific task. */
export function getTaskData(taskId: string): any {
  return (taskValues as Record<string, any>)[taskId] || null;
}
