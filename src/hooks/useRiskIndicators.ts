import { useState, useCallback } from "react";
import type { RiskIndicator } from "@/types/riskAssessment";
import riskAssessmentAPI from "@/service/riskAssessment";

export const useRiskIndicators = () => {
  const [indicators, setIndicators] = useState<RiskIndicator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listIndicators = useCallback(
    async (smi_id?: string, indicator_type?: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await riskAssessmentAPI.listIndicators();
        const filtered = (Array.isArray(data) ? data : data?.results || []).filter(
          (ind) =>
            (!smi_id || ind.smi_id === smi_id) &&
            (!indicator_type || ind.indicator_type === indicator_type)
        );
        setIndicators(filtered);
        return filtered;
      } catch (e: any) {
        const msg = e.message || "Failed to fetch indicators";
        setError(msg);
        console.error(msg, e);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createIndicator = useCallback(
    async (data: Partial<RiskIndicator>) => {
      try {
        setLoading(true);
        setError(null);
        const created = await riskAssessmentAPI.createIndicator(data);
        setIndicators((prev) => [...prev, created]);
        return created;
      } catch (e: any) {
        const msg = e.message || "Failed to create indicator";
        setError(msg);
        console.error(msg, e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateIndicator = useCallback(
    async (id: string, data: Partial<RiskIndicator>) => {
      try {
        setLoading(true);
        setError(null);
        const updated = await riskAssessmentAPI.updateIndicator(id, data);
        setIndicators((prev) =>
          prev.map((ind) => (ind.id === id ? updated : ind))
        );
        return updated;
      } catch (e: any) {
        const msg = e.message || "Failed to update indicator";
        setError(msg);
        console.error(msg, e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteIndicator = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await riskAssessmentAPI.deleteIndicator(id);
        setIndicators((prev) => prev.filter((ind) => ind.id !== id));
      } catch (e: any) {
        const msg = e.message || "Failed to delete indicator";
        setError(msg);
        console.error(msg, e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refetch = useCallback(
    async (smi_id?: string, indicator_type?: string) => {
      return await listIndicators(smi_id, indicator_type);
    },
    [listIndicators]
  );

  return {
    indicators,
    loading,
    error,
    listIndicators,
    createIndicator,
    updateIndicator,
    deleteIndicator,
    refetch,
  };
};
