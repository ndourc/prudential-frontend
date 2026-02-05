import type { components } from "@/types/openapi-types";

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Director = components["schemas"]["Director"];

export type InstitutionalProfile =
  components["schemas"]["InstitutionalProfile"];

export type PortalIntegration =
  components["schemas"]["LicensingPortalIntegration"];

export type PortalSMIData = components["schemas"]["PortalSMIData"];

export type LicenseHistory = components["schemas"]["LicenseHistory"];

export type Shareholder = components["schemas"]["Shareholder"];
