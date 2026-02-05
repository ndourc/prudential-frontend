"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import coreAPI from "@/service/core";
import type {
  AuditLog,
  BoardMember,
  ClientAssetMix,
  ClienteleProfile,
  FinancialStatement,
  LicensingBreach,
  MeetingLog,
  Notification,
  ProductOffering,
  SupervisoryIntervention,
  PaginatedResponse,
} from "@/types/core";

// Audit logs
export function useAuditLogs(page = 1) {
  return useQuery<PaginatedResponse<AuditLog> | AuditLog[]>({
    queryKey: ["auditlogs", page],
    queryFn: async () => coreAPI.listAuditLogs(page),
  });
}
export function useAuditLog(id?: string) {
  return useQuery({
    queryKey: ["auditlog", id],
    queryFn: async () => {
      if (!id) return null;
      return coreAPI.getAuditLog(id);
    },
    enabled: !!id,
  });
}

// Board members
export function useBoardMembers(page = 1) {
  return useQuery<PaginatedResponse<BoardMember> | BoardMember[]>({
    queryKey: ["board-members", page],
    queryFn: async () => coreAPI.listBoardMembers(page),
  });
}
export function useCreateBoardMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<BoardMember>) =>
      coreAPI.createBoardMember(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["board-members"] }),
  });
}
export function useUpdateBoardMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<BoardMember>;
    }) => coreAPI.updateBoardMember(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["board-members"] }),
  });
}
export function useDeleteBoardMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coreAPI.deleteBoardMember(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["board-members"] }),
  });
}

// Client asset mixes
export function useClientAssetMixes(page = 1) {
  return useQuery<PaginatedResponse<ClientAssetMix> | ClientAssetMix[]>({
    queryKey: ["client-asset-mixes", page],
    queryFn: async () => coreAPI.listClientAssetMixes(page),
  });
}
export function useClientAssetMix(id?: string) {
  return useQuery({
    queryKey: ["client-asset-mix", id],
    queryFn: async () => {
      if (!id) return null;
      return coreAPI.getClientAssetMix(id);
    },
    enabled: !!id,
  });
}
export function useCreateClientAssetMix() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ClientAssetMix>) =>
      coreAPI.createClientAssetMix(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client-asset-mixes"] }),
  });
}
export function useUpdateClientAssetMix() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ClientAssetMix>;
    }) => coreAPI.updateClientAssetMix(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client-asset-mixes"] }),
  });
}
export function useDeleteClientAssetMix() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coreAPI.deleteClientAssetMix(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client-asset-mixes"] }),
  });
}

// Clientele profiles
export function useClienteleProfiles(page = 1) {
  return useQuery<PaginatedResponse<ClienteleProfile> | ClienteleProfile[]>({
    queryKey: ["clientele-profiles", page],
    queryFn: async () => coreAPI.listClienteleProfiles(page),
  });
}
export function useClienteleProfile(id?: string) {
  return useQuery({
    queryKey: ["clientele-profile", id],
    queryFn: async () => {
      if (!id) return null;
      return coreAPI.getClienteleProfile(id);
    },
    enabled: !!id,
  });
}
export function useCreateClienteleProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ClienteleProfile>) =>
      coreAPI.createClienteleProfile(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clientele-profiles"] }),
  });
}
export function useUpdateClienteleProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ClienteleProfile>;
    }) => coreAPI.updateClienteleProfile(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clientele-profiles"] }),
  });
}
export function useDeleteClienteleProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coreAPI.deleteClienteleProfile(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clientele-profiles"] }),
  });
}

// Financial statements
export function useFinancialStatements(page = 1) {
  return useQuery<PaginatedResponse<FinancialStatement> | FinancialStatement[]>(
    {
      queryKey: ["financial-statements", page],
      queryFn: async () => coreAPI.listFinancialStatements(page),
    }
  );
}
export function useFinancialStatement(id?: string) {
  return useQuery({
    queryKey: ["financial-statement", id],
    queryFn: async () => {
      if (!id) return null;
      return coreAPI.getFinancialStatement(id);
    },
    enabled: !!id,
  });
}
export function useCreateFinancialStatement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<FinancialStatement>) =>
      coreAPI.createFinancialStatement(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["financial-statements"] }),
  });
}
export function useUpdateFinancialStatement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<FinancialStatement>;
    }) => coreAPI.updateFinancialStatement(id, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["financial-statements"] }),
  });
}
export function useDeleteFinancialStatement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coreAPI.deleteFinancialStatement(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["financial-statements"] }),
  });
}

// Licensing breaches
export function useLicensingBreaches(page = 1) {
  return useQuery<PaginatedResponse<LicensingBreach> | LicensingBreach[]>({
    queryKey: ["licensing-breaches", page],
    queryFn: async () => coreAPI.listLicensingBreaches(page),
  });
}
export function useLicensingBreach(id?: string) {
  return useQuery({
    queryKey: ["licensing-breach", id],
    queryFn: async () => {
      if (!id) return null;
      return coreAPI.getLicensingBreach(id);
    },
    enabled: !!id,
  });
}

// Meeting logs
export function useMeetingLogs(page = 1) {
  return useQuery<PaginatedResponse<MeetingLog> | MeetingLog[]>({
    queryKey: ["meeting-logs", page],
    queryFn: async () => coreAPI.listMeetingLogs(page),
  });
}
export function useMeetingLog(id?: string) {
  return useQuery({
    queryKey: ["meeting-log", id],
    queryFn: async () => {
      if (!id) return null;
      return coreAPI.getMeetingLog(id);
    },
    enabled: !!id,
  });
}

// Notifications
export function useNotifications(page = 1) {
  return useQuery<PaginatedResponse<Notification> | Notification[]>({
    queryKey: ["notifications", page],
    queryFn: async () => coreAPI.listNotifications(page),
  });
}
export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => coreAPI.markAllNotificationsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}
export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coreAPI.markNotificationRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// Product offerings
export function useProductOfferings(page = 1) {
  return useQuery<PaginatedResponse<ProductOffering> | ProductOffering[]>({
    queryKey: ["product-offerings", page],
    queryFn: async () => coreAPI.listProductOfferings(page),
  });
}
export function useProductOffering(id?: string) {
  return useQuery({
    queryKey: ["product-offering", id],
    queryFn: async () => {
      if (!id) return null;
      return coreAPI.getProductOffering(id);
    },
    enabled: !!id,
  });
}
export function useCreateProductOffering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<ProductOffering>) =>
      coreAPI.createProductOffering(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product-offerings"] }),
  });
}
export function useUpdateProductOffering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ProductOffering>;
    }) => coreAPI.updateProductOffering(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product-offerings"] }),
  });
}
export function useDeleteProductOffering() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coreAPI.deleteProductOffering(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product-offerings"] }),
  });
}

// Supervisory interventions
export function useSupervisoryInterventions(page = 1) {
  return useQuery<
    PaginatedResponse<SupervisoryIntervention> | SupervisoryIntervention[]
  >({
    queryKey: ["supervisory-interventions", page],
    queryFn: async () => coreAPI.listSupervisoryInterventions(page),
  });
}
export function useSupervisoryIntervention(id?: string) {
  return useQuery({
    queryKey: ["supervisory-intervention", id],
    queryFn: async () => {
      if (!id) return null;
      return coreAPI.getSupervisoryIntervention(id);
    },
    enabled: !!id,
  });
}

export default {};
