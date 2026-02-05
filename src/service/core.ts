import apiFetch from "@/lib/http";
import type {
  SMI,
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

export const coreAPI = {
  // SMIs
  listSMIs: async (page = 1): Promise<PaginatedResponse<SMI> | SMI[]> => {
    return await apiFetch(`/api/core/smis/?page=${page}`);
  },
  createSMI: async (data: Partial<SMI>): Promise<SMI> => {
    return await apiFetch(`/api/core/smis/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getSMI: async (id: string): Promise<SMI> => {
    return await apiFetch(`/api/core/smis/${id}/`);
  },
  updateSMI: async (id: string, data: Partial<SMI>): Promise<SMI> => {
    return await apiFetch(`/api/core/smis/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  patchSMI: async (id: string, data: Partial<SMI>): Promise<SMI> => {
    return await apiFetch(`/api/core/smis/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  deleteSMI: async (id: string): Promise<void> => {
    return await apiFetch(`/api/core/smis/${id}/`, { method: "DELETE" });
  },
  // SMI dashboard / summary
  getSMIDashboard: async () => {
    return await apiFetch(`/api/core/smis/dashboard/`);
  },
  getSMISummary: async () => {
    return await apiFetch(`/api/core/smis/summary/`);
  },
  getSMIFinancialSummary: async (id: string) => {
    return await apiFetch(`/api/core/smis/${id}/financial_summary/`);
  },
  getSMIRiskProfile: async (id: string) => {
    return await apiFetch(`/api/core/smis/${id}/risk_profile/`);
  },

  // Supervisory interventions
  listSupervisoryInterventions: async (
    page = 1
  ): Promise<
    PaginatedResponse<SupervisoryIntervention> | SupervisoryIntervention[]
  > => {
    return await apiFetch(`/api/core/supervisory-interventions/?page=${page}`);
  },
  createSupervisoryIntervention: async (
    data: Partial<SupervisoryIntervention>
  ) => {
    return await apiFetch(`/api/core/supervisory-interventions/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getSupervisoryIntervention: async (id: string) => {
    return await apiFetch(`/api/core/supervisory-interventions/${id}/`);
  },
  updateSupervisoryIntervention: async (
    id: string,
    data: Partial<SupervisoryIntervention>
  ) => {
    return await apiFetch(`/api/core/supervisory-interventions/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteSupervisoryIntervention: async (id: string) => {
    return await apiFetch(`/api/core/supervisory-interventions/${id}/`, {
      method: "DELETE",
    });
  },

  // Audit logs
  listAuditLogs: async (
    page = 1
  ): Promise<PaginatedResponse<AuditLog> | AuditLog[]> => {
    return await apiFetch(`/api/core/audit-logs/?page=${page}`);
  },
  getAuditLog: async (id: string): Promise<AuditLog> => {
    return await apiFetch(`/api/core/audit-logs/${id}/`);
  },

  // Board members
  listBoardMembers: async (
    page = 1
  ): Promise<PaginatedResponse<BoardMember> | BoardMember[]> => {
    return await apiFetch(`/api/core/board-members/?page=${page}`);
  },
  createBoardMember: async (data: Partial<BoardMember>) => {
    return await apiFetch(`/api/core/board-members/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getBoardMember: async (id: string) => {
    return await apiFetch(`/api/core/board-members/${id}/`);
  },
  updateBoardMember: async (id: string, data: Partial<BoardMember>) => {
    return await apiFetch(`/api/core/board-members/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteBoardMember: async (id: string) => {
    return await apiFetch(`/api/core/board-members/${id}/`, { method: "DELETE" });
  },

  // Client asset mixes
  listClientAssetMixes: async (
    page = 1
  ): Promise<PaginatedResponse<ClientAssetMix> | ClientAssetMix[]> => {
    return await apiFetch(`/api/core/client-asset-mixes/?page=${page}`);
  },
  createClientAssetMix: async (data: Partial<ClientAssetMix>) => {
    return await apiFetch(`/api/core/client-asset-mixes/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getClientAssetMix: async (id: string) => {
    return await apiFetch(`/api/core/client-asset-mixes/${id}/`);
  },
  updateClientAssetMix: async (id: string, data: Partial<ClientAssetMix>) => {
    return await apiFetch(`/api/core/client-asset-mixes/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteClientAssetMix: async (id: string) => {
    return await apiFetch(`/api/core/client-asset-mixes/${id}/`, {
      method: "DELETE",
    });
  },

  // Clientele profiles
  listClienteleProfiles: async (
    page = 1
  ): Promise<PaginatedResponse<ClienteleProfile> | ClienteleProfile[]> => {
    return await apiFetch(`/api/core/clientele-profiles/?page=${page}`);
  },
  createClienteleProfile: async (data: Partial<ClienteleProfile>) => {
    return await apiFetch(`/api/core/clientele-profiles/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getClienteleProfile: async (id: string) => {
    return await apiFetch(`/api/core/clientele-profiles/${id}/`);
  },
  updateClienteleProfile: async (
    id: string,
    data: Partial<ClienteleProfile>
  ) => {
    return await apiFetch(`/api/core/clientele-profiles/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteClienteleProfile: async (id: string) => {
    return await apiFetch(`/api/core/clientele-profiles/${id}/`, {
      method: "DELETE",
    });
  },

  // Financial statements
  listFinancialStatements: async (
    page = 1
  ): Promise<PaginatedResponse<FinancialStatement> | FinancialStatement[]> => {
    return await apiFetch(`/api/core/financial-statements/?page=${page}`);
  },
  createFinancialStatement: async (data: Partial<FinancialStatement>) => {
    return await apiFetch(`/api/core/financial-statements/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getFinancialStatement: async (id: string) => {
    return await apiFetch(`/api/core/financial-statements/${id}/`);
  },
  updateFinancialStatement: async (
    id: string,
    data: Partial<FinancialStatement>
  ) => {
    return await apiFetch(`/api/core/financial-statements/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteFinancialStatement: async (id: string) => {
    return await apiFetch(`/api/core/financial-statements/${id}/`, {
      method: "DELETE",
    });
  },

  // Licensing breaches
  listLicensingBreaches: async (
    page = 1
  ): Promise<PaginatedResponse<LicensingBreach> | LicensingBreach[]> => {
    return await apiFetch(`/api/core/licensing-breaches/?page=${page}`);
  },
  createLicensingBreach: async (data: Partial<LicensingBreach>) => {
    return await apiFetch(`/api/core/licensing-breaches/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getLicensingBreach: async (id: string) => {
    return await apiFetch(`/api/core/licensing-breaches/${id}/`);
  },
  updateLicensingBreach: async (id: string, data: Partial<LicensingBreach>) => {
    return await apiFetch(`/api/core/licensing-breaches/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteLicensingBreach: async (id: string) => {
    return await apiFetch(`/api/core/licensing-breaches/${id}/`, {
      method: "DELETE",
    });
  },

  // Meeting logs
  listMeetingLogs: async (
    page = 1
  ): Promise<PaginatedResponse<MeetingLog> | MeetingLog[]> => {
    return await apiFetch(`/api/core/meeting-logs/?page=${page}`);
  },
  createMeetingLog: async (data: Partial<MeetingLog>) => {
    return await apiFetch(`/api/core/meeting-logs/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getMeetingLog: async (id: string) => {
    return await apiFetch(`/api/core/meeting-logs/${id}/`);
  },
  updateMeetingLog: async (id: string, data: Partial<MeetingLog>) => {
    return await apiFetch(`/api/core/meeting-logs/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteMeetingLog: async (id: string) => {
    return await apiFetch(`/api/core/meeting-logs/${id}/`, { method: "DELETE" });
  },

  // Notifications
  listNotifications: async (
    page = 1
  ): Promise<PaginatedResponse<Notification> | Notification[]> => {
    return await apiFetch(`/api/core/notifications/?page=${page}`);
  },
  markAllNotificationsRead: async () => {
    return await apiFetch(`/api/core/notifications/mark_all_read/`, {
      method: "POST",
    });
  },
  getNotification: async (id: string) => {
    return await apiFetch(`/api/core/notifications/${id}/`);
  },
  markNotificationRead: async (id: string) => {
    return await apiFetch(`/api/core/notifications/${id}/mark_read/`, {
      method: "POST",
    });
  },

  // Product offerings
  listProductOfferings: async (
    page = 1
  ): Promise<PaginatedResponse<ProductOffering> | ProductOffering[]> => {
    return await apiFetch(`/api/core/product-offerings/?page=${page}`);
  },
  createProductOffering: async (data: Partial<ProductOffering>) => {
    return await apiFetch(`/api/core/product-offerings/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getProductOffering: async (id: string) => {
    return await apiFetch(`/api/core/product-offerings/${id}/`);
  },
  updateProductOffering: async (id: string, data: Partial<ProductOffering>) => {
    return await apiFetch(`/api/core/product-offerings/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteProductOffering: async (id: string) => {
    return await apiFetch(`/api/core/product-offerings/${id}/`, {
      method: "DELETE",
    });
  },
  getOffsiteProfile: async (smiId: string) => {
    return await apiFetch(`/api/core/offsite-profiling/${smiId}/`);
  },
};

export default coreAPI;
