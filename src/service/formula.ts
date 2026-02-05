import apiClient from "@/lib/apiClient";
import type { CalculationFormula, CalculationBreakdown, CalculationBreakdownDetail } from "@/types/formula";

const formulaAPI = {
    // Calculation Formulae
    listFormulae: async (page = 1) => {
        const response = await apiClient.get(`/api/core/calculation-formulae/?page=${page}`);
        return response.data;
    },

    getFormula: async (id: string) => {
        const response = await apiClient.get<CalculationFormula>(`/api/core/calculation-formulae/${id}/`);
        return response.data;
    },

    getFormulaByType: async (type: string) => {
        const response = await apiClient.get<CalculationFormula>(`/api/core/calculation-formulae/by_type/?type=${type}`);
        return response.data;
    },

    createFormula: async (data: Partial<CalculationFormula>) => {
        const response = await apiClient.post<CalculationFormula>("/api/core/calculation-formulae/", data);
        return response.data;
    },

    updateFormula: async (id: string, data: Partial<CalculationFormula>) => {
        const response = await apiClient.patch<CalculationFormula>(`/api/core/calculation-formulae/${id}/`, data);
        return response.data;
    },

    deleteFormula: async (id: string) => {
        await apiClient.delete(`/api/core/calculation-formulae/${id}/`);
    },

    activateFormula: async (id: string) => {
        const response = await apiClient.post(`/api/core/calculation-formulae/${id}/activate/`);
        return response.data;
    },

    duplicateFormula: async (id: string) => {
        const response = await apiClient.post<CalculationFormula>(`/api/core/calculation-formulae/${id}/duplicate/`);
        return response.data;
    },

    // Calculation Breakdowns
    listBreakdowns: async (page = 1) => {
        const response = await apiClient.get(`/api/core/calculation-breakdowns/?page=${page}`);
        return response.data;
    },

    getBreakdown: async (id: string) => {
        const response = await apiClient.get<CalculationBreakdownDetail>(`/api/core/calculation-breakdowns/${id}/`);
        return response.data;
    },

    getBreakdownByReference: async (referenceId: string, type?: string) => {
        let url = `/api/core/calculation-breakdowns/by_reference/?reference_id=${referenceId}`;
        if (type) {
            url += `&type=${type}`;
        }
        const response = await apiClient.get<CalculationBreakdownDetail>(url);
        return response.data;
    },

    getBreakdownsByType: async (type: string, page = 1) => {
        const response = await apiClient.get(`/api/core/calculation-breakdowns/by_type/?type=${type}&page=${page}`);
        return response.data;
    },
};

export default formulaAPI;
