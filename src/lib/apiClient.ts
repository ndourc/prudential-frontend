import apiFetch from "./http";

const apiClient = {
    get: async <T = any>(url: string, config: RequestInit = {}) => {
        const data = await apiFetch(url, { ...config, method: "GET" });
        return { data: data as T };
    },
    post: async <T = any>(url: string, data?: any, config: RequestInit = {}) => {
        // If data is FormData, do not stringify
        const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined);
        const res = await apiFetch(url, { ...config, method: "POST", body });
        return { data: res as T };
    },
    put: async <T = any>(url: string, data?: any, config: RequestInit = {}) => {
        const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined);
        const res = await apiFetch(url, { ...config, method: "PUT", body });
        return { data: res as T };
    },
    patch: async <T = any>(url: string, data?: any, config: RequestInit = {}) => {
        const body = data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined);
        const res = await apiFetch(url, { ...config, method: "PATCH", body });
        return { data: res as T };
    },
    delete: async <T = any>(url: string, config: RequestInit = {}) => {
        const res = await apiFetch(url, { ...config, method: "DELETE" });
        return { data: res as T };
    },
};

export default apiClient;
