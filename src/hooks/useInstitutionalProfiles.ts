"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import licensingAPI from "@/service/licensing";
import type {
  InstitutionalProfile,
  PaginatedResponse,
} from "@/types/licensing";

export function useInstitutionalProfiles(page = 1) {
  return useQuery<
    PaginatedResponse<InstitutionalProfile> | InstitutionalProfile[]
  >({
    queryKey: ["institutional-profiles", page],
    queryFn: async () => licensingAPI.listInstitutionalProfiles(page),
  });
}

export function useCreateInstitutionalProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<InstitutionalProfile>) =>
      licensingAPI.createInstitutionalProfile(payload),
    onSuccess: () => qc.invalidateQueries(["institutional-profiles"]),
  });
}

export function useInstitutionalProfile(id?: string) {
  return useQuery({
    queryKey: ["institutional-profile", id],
    queryFn: async () => {
      if (!id) return null;
      return licensingAPI.getInstitutionalProfile(id);
    },
    enabled: !!id,
  });
}

export function useUpdateInstitutionalProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<InstitutionalProfile>;
    }) => licensingAPI.updateInstitutionalProfile(id, payload),
    onSuccess: () => qc.invalidateQueries(["institutional-profiles"]),
  });
}

export function useDeleteInstitutionalProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => licensingAPI.deleteInstitutionalProfile(id),
    onSuccess: () => qc.invalidateQueries(["institutional-profiles"]),
  });
}
