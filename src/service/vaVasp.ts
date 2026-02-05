import apiFetch from "@/lib/http";

import { SMI } from "@/types/core";

export interface VAVASP {
    id: string;
    smi: SMI;
    smi_id?: string;
    analysis_date: string;
    is_va_issuer: boolean;
    is_vasp: boolean;
    va_types: string;
    va_risk_score: number;
    vasp_risk_score: number;
    overall_va_risk_score: number;
    securities_exposure: number;
    regulatory_compliance: number;
    risk_profile: string;
    recommendations: string;
    created_at: string;
    updated_at: string;
}

export interface VirtualAsset {
    id: string;
    va_vasp: string;
    asset_name: string;
    asset_type: string;
    asset_symbol: string;
    total_volume: string;
    market_value: string;
    risk_rating: string;
    created_at: string;
    updated_at: string;
}

export interface VASPService {
    id: string;
    va_vasp: string;
    service_type: string;
    service_name: string;
    description: string;
    is_active: boolean;
    compliance_status: string;
    created_at: string;
    updated_at: string;
}

export interface VARiskAssessment {
    id: string;
    va_vasp: string;
    assessment_date: string;
    risk_level: string;
    aml_risk_score: number;
    cybersecurity_score: number;
    operational_risk_score: number;
    overall_risk_score: number;
    created_at: string;
    updated_at: string;
}

export interface VASPCompliance {
    id: string;
    va_vasp_analysis: string;
    compliance_area: string;
    compliance_status: string;
    compliance_score?: number;
    requirements?: string;
    current_status?: string;
    gaps_identified?: string;
    remediation_plan?: string;
    assessment_date?: string | null;
    target_compliance_date?: string | null;
    actual_compliance_date?: string | null;
    follow_up_required?: boolean;
    follow_up_date?: string | null;
    follow_up_notes?: string;
    created_at: string;
    updated_at: string;
}

export const vaVaspService = {
    // VA/VASP Entities
    getVAVASPs: (page = 1) =>
        apiFetch(`/api/va-vasp/va-vasp/?page=${page}`),

    getVAVASP: (id: string) =>
        apiFetch(`/api/va-vasp/va-vasp/${id}/`),

    createVAVASP: (data: Partial<VAVASP>) =>
        apiFetch(`/api/va-vasp/va-vasp/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateVAVASP: (id: string, data: Partial<VAVASP>) =>
        apiFetch(`/api/va-vasp/va-vasp/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    deleteVAVASP: (id: string) =>
        apiFetch(`/api/va-vasp/va-vasp/${id}/`, {
            method: "DELETE",
        }),

    // Virtual Assets
    getVirtualAssets: (page = 1) =>
        apiFetch(`/api/va-vasp/virtual-assets/?page=${page}`),

    getVirtualAsset: (id: string) =>
        apiFetch(`/api/va-vasp/virtual-assets/${id}/`),

    createVirtualAsset: (data: Partial<VirtualAsset>) =>
        apiFetch(`/api/va-vasp/virtual-assets/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateVirtualAsset: (id: string, data: Partial<VirtualAsset>) =>
        apiFetch(`/api/va-vasp/virtual-assets/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // VASP Services
    getVASPServices: (page = 1) =>
        apiFetch(`/api/va-vasp/vasp-services/?page=${page}`),

    getVASPService: (id: string) =>
        apiFetch(`/api/va-vasp/vasp-services/${id}/`),

    createVASPService: (data: Partial<VASPService>) =>
        apiFetch(`/api/va-vasp/vasp-services/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateVASPService: (id: string, data: Partial<VASPService>) =>
        apiFetch(`/api/va-vasp/vasp-services/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // Risk Assessments
    getRiskAssessments: (page = 1) =>
        apiFetch(`/api/va-vasp/risk-assessments/?page=${page}`),

    getRiskAssessment: (id: string) =>
        apiFetch(`/api/va-vasp/risk-assessments/${id}/`),

    createRiskAssessment: (data: Partial<VARiskAssessment>) =>
        apiFetch(`/api/va-vasp/risk-assessments/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateRiskAssessment: (id: string, data: Partial<VARiskAssessment>) =>
        apiFetch(`/api/va-vasp/risk-assessments/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // Compliance
    getCompliance: (page = 1) =>
        apiFetch(`/api/va-vasp/compliance/?page=${page}`),

    getComplianceRecord: (id: string) =>
        apiFetch(`/api/va-vasp/compliance/${id}/`),

    createComplianceRecord: (data: Partial<VASPCompliance>) =>
        apiFetch(`/api/va-vasp/compliance/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateComplianceRecord: (id: string, data: Partial<VASPCompliance>) =>
        apiFetch(`/api/va-vasp/compliance/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),
};
