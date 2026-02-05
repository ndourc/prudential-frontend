import apiFetch from "@/lib/http";
import type {
  Director,
  PaginatedResponse,
  InstitutionalProfile,
  Shareholder,
} from "@/types/licensing";

export const licensingAPI = {
  // Directors
  listDirectors: async (
    page = 1
  ): Promise<PaginatedResponse<Director> | Director[]> => {
    return await apiFetch(`/api/licensing/directors/?page=${page}`);
  },
  createDirector: async (data: Partial<Director>): Promise<Director> => {
    return await apiFetch(`/api/licensing/directors/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getDirector: async (id: string): Promise<Director> => {
    return await apiFetch(`/api/licensing/directors/${id}/`);
  },
  updateDirector: async (
    id: string,
    data: Partial<Director>
  ): Promise<Director> => {
    return await apiFetch(`/api/licensing/directors/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteDirector: async (id: string): Promise<void> => {
    return await apiFetch(`/api/licensing/directors/${id}/`, { method: "DELETE" });
  },

  // Institutional profiles
  listInstitutionalProfiles: async (
    page = 1
  ): Promise<
    PaginatedResponse<InstitutionalProfile> | InstitutionalProfile[]
  > => {
    return await apiFetch(`/api/licensing/institutional-profiles/?page=${page}`);
  },
  createInstitutionalProfile: async (
    data: Partial<InstitutionalProfile>
  ): Promise<InstitutionalProfile> => {
    return await apiFetch(`/api/licensing/institutional-profiles/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getInstitutionalProfile: async (
    id: string
  ): Promise<InstitutionalProfile> => {
    return await apiFetch(`/api/licensing/institutional-profiles/${id}/`);
  },
  updateInstitutionalProfile: async (
    id: string,
    data: Partial<InstitutionalProfile>
  ): Promise<InstitutionalProfile> => {
    return await apiFetch(`/api/licensing/institutional-profiles/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteInstitutionalProfile: async (id: string): Promise<void> => {
    return await apiFetch(`/api/licensing/institutional-profiles/${id}/`, {
      method: "DELETE",
    });
  },
  // Ltd: add more methods for institutional profiles when needed...

  // Shareholders
  listShareholders: async (
    page = 1
  ): Promise<PaginatedResponse<Shareholder> | Shareholder[]> => {
    return await apiFetch(`/api/licensing/shareholders/?page=${page}`);
  },
  createShareholder: async (
    data: Partial<Shareholder>
  ): Promise<Shareholder> => {
    return await apiFetch(`/api/licensing/shareholders/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getShareholder: async (id: string): Promise<Shareholder> => {
    return await apiFetch(`/api/licensing/shareholders/${id}/`);
  },
  updateShareholder: async (
    id: string,
    data: Partial<Shareholder>
  ): Promise<Shareholder> => {
    return await apiFetch(`/api/licensing/shareholders/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deleteShareholder: async (id: string): Promise<void> => {
    return await apiFetch(`/api/licensing/shareholders/${id}/`, {
      method: "DELETE",
    });
  },
  // Portal integration
  listPortalIntegrations: async (page = 1) => {
    return await apiFetch(`/api/licensing/portal-integration/?page=${page}`);
  },
  testPortalIntegration: async (id: string) => {
    return await apiFetch(
      `/api/licensing/portal-integration/${id}/test_connection/`,
      {
        method: "POST",
      }
    );
  },
  syncPortalIntegration: async (id: string) => {
    return await apiFetch(`/api/licensing/portal-integration/${id}/sync_data/`, {
      method: "POST",
    });
  },
  createPortalIntegration: async (data: Partial<any>) => {
    return await apiFetch(`/api/licensing/portal-integration/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updatePortalIntegration: async (id: string, data: Partial<any>) => {
    return await apiFetch(`/api/licensing/portal-integration/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  deletePortalIntegration: async (id: string) => {
    return await apiFetch(`/api/licensing/portal-integration/${id}/`, {
      method: "DELETE",
    });
  },

  // Portal SMI Data
  listPortalSMIData: async (page = 1) => {
    return await apiFetch(`/api/licensing/portal-smi-data/?page=${page}`);
  },

  // License history
  listLicenseHistory: async (page = 1) => {
    return await apiFetch(`/api/licensing/license-history/?page=${page}`);
  },
};

export default licensingAPI;
