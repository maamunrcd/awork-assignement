/**
 * Dynamic task-step form definitions from `GET /api/task-schemas/:schemaRef`.
 * Renderer is driven by these shapes at runtime.
 */

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

export type ColumnFieldType =
  | "text"
  | "number"
  | "date"
  | "time"
  | "currency"
  | "checkbox"
  | "select";

export interface VisibleWhen {
  field: string;
  equals?: string | boolean;
  notEquals?: string | boolean;
}

export interface Column {
  key: string;
  label: string;
  type: ColumnFieldType;
  options?: string[];
}

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  readonly?: boolean;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  visibleWhen?: VisibleWhen;
  columns?: Column[];
  editableColumns?: string[];
}

export interface Section {
  key: string;
  heading: string;
  fields: Field[];
}

export type ActionVariant = "primary" | "secondary" | "outline" | "destructive";

export interface Action {
  key: string;
  label: string;
  variant: ActionVariant;
  requiresAllRequired?: boolean;
}

export interface RoleRules {
  hiddenFields: string[];
  hiddenSections?: string[];
  disabledActions: string[];
}

export interface TaskSchema {
  schemaRef: string;
  title: string;
  description: string;
  sections: Section[];
  actions: Action[];
  roleVisibility: Record<string, RoleRules>;
}
