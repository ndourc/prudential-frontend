"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import riskAssessmentAPI from "@/service/riskAssessment";
import type {
  RiskAssessment,
  RiskIndicator,
  StressTest,
  RiskTrend,
  PaginatedResponse,
  IndustryRankingResponse,
} from "@/types/riskAssessment";

const QC_KEYS = {
  assessments: ["risk-assessments"],
  indicators: ["risk-indicators"],
  stressTests: ["stress-tests"],
  trends: ["risk-trends"],
  industryRanking: ["risk-industry-ranking"],
  indicatorAlerts: ["risk-indicator-alerts"],
};

// --- Risk Assessments ---

export function useAssessments(page = 1) {
  return useQuery<PaginatedResponse<RiskAssessment> | RiskAssessment[]>({
    queryKey: [...QC_KEYS.assessments, page],
    queryFn: () => riskAssessmentAPI.listAssessments(page),
  });
}

export function useAssessment(id?: string) {
  return useQuery<RiskAssessment | null>({
    queryKey: [...QC_KEYS.assessments, id],
    queryFn: async () => (id ? riskAssessmentAPI.getAssessment(id) : null),
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<RiskAssessment>) =>
      riskAssessmentAPI.createAssessment(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.assessments }),
  });
}

export function useUpdateAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<RiskAssessment>;
    }) => riskAssessmentAPI.updateAssessment(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.assessments }),
  });
}

export function useDeleteAssessment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => riskAssessmentAPI.deleteAssessment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.assessments }),
  });
}

export function useRecalculateAssessmentScores(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => riskAssessmentAPI.recalculateAssessmentScores(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: [...QC_KEYS.assessments, id] }),
  });
}

export function useAssessmentDashboardSummary() {
  return useQuery({
    queryKey: [...QC_KEYS.assessments, "summary"],
    queryFn: () => riskAssessmentAPI.getAssessmentDashboardSummary(),
  });
}

export function useIndustryRanking(page = 1) {
  return useQuery<IndustryRankingResponse>({
    queryKey: [...QC_KEYS.industryRanking, page],
    queryFn: () => riskAssessmentAPI.getIndustryRanking(page),
  });
}

// --- Risk Indicators ---

export function useIndicators(page = 1) {
  return useQuery<PaginatedResponse<RiskIndicator> | RiskIndicator[]>({
    queryKey: [...QC_KEYS.indicators, page],
    queryFn: () => riskAssessmentAPI.listIndicators(page),
  });
}

export function useIndicatorAlerts(page = 1) {
  return useQuery<PaginatedResponse<RiskIndicator> | RiskIndicator[]>({
    queryKey: [...QC_KEYS.indicatorAlerts, page],
    queryFn: () => riskAssessmentAPI.getIndicatorAlerts(page),
  });
}

export function useCreateIndicator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<RiskIndicator>) =>
      riskAssessmentAPI.createIndicator(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.indicators }),
  });
}

// --- Stress Tests ---

export function useStressTests(page = 1) {
  return useQuery<PaginatedResponse<StressTest> | StressTest[]>({
    queryKey: [...QC_KEYS.stressTests, page],
    queryFn: () => riskAssessmentAPI.listStressTests(page),
  });
}

export function useStressTestDashboardSummary() {
  return useQuery({
    queryKey: [...QC_KEYS.stressTests, "summary"],
    queryFn: () => riskAssessmentAPI.getStressTestDashboardSummary(),
  });
}

export function useCreateStressTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<StressTest>) =>
      riskAssessmentAPI.createStressTest(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.stressTests }),
  });
}

export function useUpdateStressTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<StressTest> }) =>
      riskAssessmentAPI.updateStressTest(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.stressTests }),
  });
}

export function useDeleteStressTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => riskAssessmentAPI.deleteStressTest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.stressTests }),
  });
}

// --- Risk Trends ---

export function useTrends(page = 1) {
  return useQuery<PaginatedResponse<RiskTrend> | RiskTrend[]>({
    queryKey: [...QC_KEYS.trends, page],
    queryFn: () => riskAssessmentAPI.listTrends(page),
  });
}

export function useTrendAnalysis(page = 1) {
  return useQuery<PaginatedResponse<RiskTrend> | RiskTrend[]>({
    queryKey: [...QC_KEYS.trends, "analysis", page],
    queryFn: () => riskAssessmentAPI.getTrendAnalysis(page),
  });
}

export function useCreateTrend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<RiskTrend>) =>
      riskAssessmentAPI.createTrend(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.trends }),
  });
}

export function useUpdateTrend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<RiskTrend> }) =>
      riskAssessmentAPI.updateTrend(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.trends }),
  });
}

export function useDeleteTrend() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => riskAssessmentAPI.deleteTrend(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.trends }),
  });
}

export default {};
