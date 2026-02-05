import type { components } from "@/types/openapi-types";

export type SMI = components["schemas"]["SMI"];
export type AuditLog = components["schemas"]["AuditLog"];
export type BoardMember = components["schemas"]["BoardMember"];
export type ClientAssetMix = components["schemas"]["ClientAssetMix"];
export type ClienteleProfile = components["schemas"]["ClienteleProfile"];
export type FinancialStatement = components["schemas"]["FinancialStatement"];
export type LicensingBreach = components["schemas"]["LicensingBreach"];
export type MeetingLog = components["schemas"]["MeetingLog"];
export type Notification = components["schemas"]["Notification"];
export type ProductOffering = components["schemas"]["ProductOffering"];
export type SupervisoryIntervention =
  components["schemas"]["SupervisoryIntervention"];

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export default {};
