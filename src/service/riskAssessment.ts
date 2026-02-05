import apiFetch from "@/lib/http";
import type {
  RiskAssessment,
  RiskIndicator,
  StressTest,
  RiskTrend,
  PaginatedResponse,
  IndustryRankingResponse,
} from "@/types/riskAssessment";

export const riskAssessmentAPI = {
  // --- Risk Assessments (/api/risk-assessment/assessments/) ---
  listAssessments: async (
    page = 1
  ): Promise<PaginatedResponse<RiskAssessment> | RiskAssessment[]> => {
    return await apiFetch(`/api/risk-assessment/assessments/?page=${page}`);
  },
  createAssessment: async (
    data: Partial<RiskAssessment>
  ): Promise<RiskAssessment> => {
    return await apiFetch(`/api/risk-assessment/assessments/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getAssessment: async (id: string): Promise<RiskAssessment> => {
    return await apiFetch(`/api/risk-assessment/assessments/${id}/`);
  },
  updateAssessment: async (
    id: string,
    data: Partial<RiskAssessment>
  ): Promise<RiskAssessment> => {
    return await apiFetch(`/api/risk-assessment/assessments/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteAssessment: async (id: string): Promise<void> => {
    return await apiFetch(`/api/risk-assessment/assessments/${id}/`, {
      method: "DELETE",
    });
  },
  getAssessmentDashboardSummary: async () => {
    return await apiFetch(`/api/risk-assessment/assessments/dashboard_summary/`);
  },
  getIndustryRanking: async (page = 1): Promise<IndustryRankingResponse> => {
    // Note: The OpenAPI spec returns an array of custom ranking objects, but for consistency with other paginated methods, we'll wrap it in a PaginatedResponse structure.
    return await apiFetch(
      `/api/risk-assessment/assessments/industry_ranking/?page=${page}`
    );
  },
  recalculateAssessmentScores: async (id: string) => {
    return await apiFetch(
      `/api/risk-assessment/assessments/${id}/recalculate_scores/`,
      {
        method: "POST",
      }
    );
  },

  // --- Risk Indicators (/api/risk-assessment/indicators/) ---
  listIndicators: async (
    page = 1
  ): Promise<PaginatedResponse<RiskIndicator> | RiskIndicator[]> => {
    return await apiFetch(`/api/risk-assessment/indicators/?page=${page}`);
  },
  createIndicator: async (
    data: Partial<RiskIndicator>
  ): Promise<RiskIndicator> => {
    return await apiFetch(`/api/risk-assessment/indicators/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getIndicator: async (id: string): Promise<RiskIndicator> => {
    return await apiFetch(`/api/risk-assessment/indicators/${id}/`);
  },
  updateIndicator: async (
    id: string,
    data: Partial<RiskIndicator>
  ): Promise<RiskIndicator> => {
    return await apiFetch(`/api/risk-assessment/indicators/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteIndicator: async (id: string): Promise<void> => {
    return await apiFetch(`/api/risk-assessment/indicators/${id}/`, {
      method: "DELETE",
    });
  },
  getIndicatorAlerts: async (
    page = 1
  ): Promise<PaginatedResponse<RiskIndicator> | RiskIndicator[]> => {
    return await apiFetch(`/api/risk-assessment/indicators/alerts/?page=${page}`);
  },

  // --- Stress Tests (/api/risk-assessment/stress-tests/) ---
  listStressTests: async (
    page = 1
  ): Promise<PaginatedResponse<StressTest> | StressTest[]> => {
    return await apiFetch(`/api/risk-assessment/stress-tests/?page=${page}`);
  },
  createStressTest: async (
    data: Partial<StressTest>
  ): Promise<StressTest> => {
    return await apiFetch(`/api/risk-assessment/stress-tests/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getStressTest: async (id: string): Promise<StressTest> => {
    return await apiFetch(`/api/risk-assessment/stress-tests/${id}/`);
  },
  updateStressTest: async (
    id: string,
    data: Partial<StressTest>
  ): Promise<StressTest> => {
    return await apiFetch(`/api/risk-assessment/stress-tests/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteStressTest: async (id: string): Promise<void> => {
    return await apiFetch(`/api/risk-assessment/stress-tests/${id}/`, {
      method: "DELETE",
    });
  },
  getStressTestDashboardSummary: async () => {
    return await apiFetch(`/api/risk-assessment/stress-tests/dashboard_summary/`);
  },

  // --- Risk Trends (/api/risk-assessment/trends/) ---
  listTrends: async (
    page = 1
  ): Promise<PaginatedResponse<RiskTrend> | RiskTrend[]> => {
    return await apiFetch(`/api/risk-assessment/trends/?page=${page}`);
  },
  createTrend: async (
    data: Partial<RiskTrend>
  ): Promise<RiskTrend> => {
    return await apiFetch(`/api/risk-assessment/trends/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getTrend: async (id: string): Promise<RiskTrend> => {
    return await apiFetch(`/api/risk-assessment/trends/${id}/`);
  },
  updateTrend: async (
    id: string,
    data: Partial<RiskTrend>
  ): Promise<RiskTrend> => {
    return await apiFetch(`/api/risk-assessment/trends/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteTrend: async (id: string): Promise<void> => {
    return await apiFetch(`/api/risk-assessment/trends/${id}/`, {
      method: "DELETE",
    });
  },
  getTrendAnalysis: async (
    page = 1
  ): Promise<PaginatedResponse<RiskTrend> | RiskTrend[]> => {
    return await apiFetch(
      `/api/risk-assessment/trends/trend_analysis/?page=${page}`
    );
  },
};

export default riskAssessmentAPI;
