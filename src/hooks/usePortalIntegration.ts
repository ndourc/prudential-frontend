"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import licensingAPI from "@/service/licensing";
import type { PortalIntegration } from "@/types/licensing";

export function usePortalIntegrations(page = 1) {
  return useQuery({
    queryKey: ["portal-integrations", page],
    queryFn: async () => licensingAPI.listPortalIntegrations(page),
  });
}

export function useTestPortalIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => licensingAPI.testPortalIntegration(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portal-integrations"] }),
  });
}

export function useSyncPortalIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => licensingAPI.syncPortalIntegration(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portal-integrations"] }),
  });
}
export function useCreatePortalIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PortalIntegration>) =>
      licensingAPI.createPortalIntegration(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portal-integrations"] }),
  });
}
export function useUpdatePortalIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PortalIntegration> }) =>
      licensingAPI.updatePortalIntegration(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portal-integrations"] }),
  });
}
export function useDeletePortalIntegration() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => licensingAPI.deletePortalIntegration(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portal-integrations"] }),
  });
}
