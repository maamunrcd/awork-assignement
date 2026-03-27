/**
 * Core Task Interface
 */
export interface Task {
  id: string;
  caseNumber: string;
  stepName: string;
  category: string; 
  region: string;
  client: string;
  priority: number;
  slaDeadline: string;
  assignedRole: "processor" | "attorney";
  status: "pending" | "in-progress" | "completed";
  borrower: string;
  propertyAddress: string;
  milestoneAtRisk: string;
  revenueAtRisk: number;
  schemaRef: string;
}

/**
 * Task Schema Interfaces
 */
export interface TaskSchema {
  schemaRef: string;
  title: string;
  description: string;
  sections: Section[];
  actions: Action[];
  roleVisibility: Record<string, RoleRules>;
}

export interface Section {
  key: string;
  heading: string;
  fields: Field[];
}

export type FieldType = 
  | "text" 
  | "textarea" 
  | "select" 
  | "checkbox" 
  | "date" 
  | "time"
  | "number" 
  | "currency" 
  | "table";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  readonly?: boolean;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  visibleWhen?: {
    field: string;
    equals?: string | boolean;
    notEquals?: string | boolean;
  };
  columns?: Column[];
  editableColumns?: string[];
}

export interface Column {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "time" | "currency" | "checkbox" | "select";
  options?: string[];
}

export interface Action {
  key: string;
  label: string;
  variant: "primary" | "secondary" | "outline" | "destructive";
  requiresAllRequired?: boolean;
}

export interface RoleRules {
  hiddenFields: string[];
  hiddenSections?: string[];
  disabledActions: string[];
}

/**
 * User Interface
 */
export interface User {
  id: string;
  name: string;
  role: "processor" | "attorney";
  tenantId: string;
  region: string;
}
