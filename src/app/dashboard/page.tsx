import { DashboardClient } from "@/components/command-center/dashboard-client";
import { getInitialTasks, getInitialUser } from "@/lib/data/dashboard-data";

/** Server Component: load data here (or `export default async` + `await` when using a real database). */
export default function DashboardPage() {
  const user = getInitialUser();
  const tasks = getInitialTasks();

  return <DashboardClient user={user} tasks={tasks} />;
}
