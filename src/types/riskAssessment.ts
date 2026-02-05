import type { components } from "@/types/openapi-types";

// Base entity types from OpenAPI schema
export type RiskAssessment = components["schemas"]["RiskAssessment"];
export type RiskIndicator = components["schemas"]["RiskIndicator"];
export type StressTest = components["schemas"]["StressTest"];
export type RiskTrend = components["schemas"]["RiskTrend"];

// Utility type for paginated responses
export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// Dashboard/Summary response types (derived from OpenAPI operations/paths)
export type AssessmentDashboardSummary = RiskAssessment; // Assuming this returns a summary object similar to an assessment or an array of simplified ones.
export type IndustryRankingItem = {
  smi_id: string;
  smi_name: string;
  overall_risk_score: number;
  risk_level:
    | "LOW"
    | "MEDIUM_LOW"
    | "MEDIUM"
    | "MEDIUM_HIGH"
    | "HIGH"
    | "CRITICAL";
  fsi_score: number;
  trend: "up" | "down" | "flat";
  previous_overall_risk_score: number | null;
};
export type IndustryRankingResponse = PaginatedResponse<IndustryRankingItem>;

export default {};
