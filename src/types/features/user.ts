export type UserRole = "processor" | "attorney";

/** Authenticated user from `GET /api/user`. */
export interface User {
  id: string;
  name: string;
  role: UserRole;
  tenantId: string;
  region: string;
}
