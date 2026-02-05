import apiFetch from "@/lib/http";

import { SMI } from "@/types/core";

export interface ComplianceIndex {
    id: string;
    smi: SMI;
    smi_id?: string; // For creation payload
    period: string;
    analysis_period: string;
    overall_compliance_score: number;
    regulatory_compliance: number;
    operational_compliance: number;
    financial_compliance: number;
    risk_calibration_score: number;
    final_compliance_score: number;
    total_responses?: number;
    total_yes?: number;
    total_no?: number;
    total_blank?: number;
    positive_weight?: number;
    negative_weight?: number;
    created_at: string;
    updated_at: string;
}

export interface ComplianceAssessment {
    id: string;
    smi: SMI;
    smi_id?: string;
    assessment_date: string;
    assessment_type: string;
    scope: string;
    findings: string;
    risk_rating: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface ComplianceRequirement {
    id: string;
    smi: SMI;
    smi_id?: string;
    requirement_type: string;
    title: string;
    description: string;
    priority: string;
    is_compliant: boolean;
    compliance_score: number;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface ComplianceViolation {
    id: string;
    smi: SMI;
    smi_id?: string;
    compliance_requirement: string;
    violation_type: string;
    severity: string;
    description: string;
    date_identified: string;
    investigation_status: string;
    created_at: string;
    updated_at: string;
}

export interface ComplianceReport {
    id: string;
    smi: SMI;
    smi_id?: string;
    report_type: string;
    title: string;
    period_start: string;
    period_end: string;
    report_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export const complianceService = {
    // Compliance Index
    getComplianceIndices: (page = 1) =>
        apiFetch(`/api/compliance/compliance-index/?page=${page}`),

    getComplianceIndex: (id: string) =>
        apiFetch(`/api/compliance/compliance-index/${id}/`),

    createComplianceIndex: (data: Partial<ComplianceIndex>) =>
        apiFetch(`/api/compliance/compliance-index/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateComplianceIndex: (id: string, data: Partial<ComplianceIndex>) =>
        apiFetch(`/api/compliance/compliance-index/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // Assessments
    getAssessments: (page = 1) =>
        apiFetch(`/api/compliance/assessments/?page=${page}`),

    getAssessment: (id: string) =>
        apiFetch(`/api/compliance/assessments/${id}/`),

    createAssessment: (data: Partial<ComplianceAssessment>) =>
        apiFetch(`/api/compliance/assessments/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateAssessment: (id: string, data: Partial<ComplianceAssessment>) =>
        apiFetch(`/api/compliance/assessments/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // Requirements
    getRequirements: (page = 1) =>
        apiFetch(`/api/compliance/requirements/?page=${page}`),

    getRequirement: (id: string) =>
        apiFetch(`/api/compliance/requirements/${id}/`),

    createRequirement: (data: Partial<ComplianceRequirement>) =>
        apiFetch(`/api/compliance/requirements/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateRequirement: (id: string, data: Partial<ComplianceRequirement>) =>
        apiFetch(`/api/compliance/requirements/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // Violations
    getViolations: (page = 1) =>
        apiFetch(`/api/compliance/violations/?page=${page}`),

    getViolation: (id: string) =>
        apiFetch(`/api/compliance/violations/${id}/`),

    createViolation: (data: Partial<ComplianceViolation>) =>
        apiFetch(`/api/compliance/violations/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateViolation: (id: string, data: Partial<ComplianceViolation>) =>
        apiFetch(`/api/compliance/violations/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // Reports
    getReports: (page = 1) =>
        apiFetch(`/api/compliance/reports/?page=${page}`),

    getReport: (id: string) =>
        apiFetch(`/api/compliance/reports/${id}/`),

    createReport: (data: Partial<ComplianceReport>) =>
        apiFetch(`/api/compliance/reports/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateReport: (id: string, data: Partial<ComplianceReport>) =>
        apiFetch(`/api/compliance/reports/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),
};
