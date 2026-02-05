export const Roles = {
  ADMIN: "ADMIN",
  PRINCIPAL_OFFICER: "PRINCIPAL_OFFICER",
  ACCOUNTANT: "ACCOUNTANT",
  COMPLIANCE_OFFICER: "COMPLIANCE_OFFICER",
} as const;

export type Role = typeof Roles[keyof typeof Roles];

// Roles allowed to perform administrative compliance actions (create/update/delete)
export const ComplianceAdminRoles: Role[] = [Roles.ADMIN, Roles.COMPLIANCE_OFFICER];

// Roles allowed to create assessments specifically (same as Compliance admin by default)
export const AssessmentCreateRoles = ComplianceAdminRoles;

// Export a read-only list for UI use
export const AllRoles = Object.values(Roles);

// Runtime type guard for Role
export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (Object.values(Roles) as string[]).includes(value);
}
