/** Foreclosure case row in the command-center queue (matches mock API). */
export type TaskAssignedRole = "processor" | "attorney";
export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  id: string;
  caseNumber: string;
  stepName: string;
  category: string;
  region: string;
  client: string;
  priority: number;
  slaDeadline: string;
  assignedRole: TaskAssignedRole;
  status: TaskStatus;
  borrower: string;
  propertyAddress: string;
  milestoneAtRisk: string;
  revenueAtRisk: number;
  schemaRef: string;
}
