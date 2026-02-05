import apiFetch from "@/lib/http";

import { SMI } from "@/types/core";

export interface Case {
    id: string;
    case_number: string;
    case_type: string;
    title: string;
    description: string;
    smi: SMI | null;
    smi_id?: string;
    status: string;
    priority: string;
    opened_date: string;
    due_date: string | null;
    resolved_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface CaseNote {
    id: string;
    case: string;
    author: number;
    note: string;
    created_at: string;
}

export interface Investigation {
    id: string;
    case: string;
    investigation_type: string;
    scope: string;
    methodology: string;
    preliminary_findings: string;
    final_findings: string;
    start_date: string;
    estimated_completion: string | null;
    actual_completion: string | null;
    created_at: string;
    updated_at: string;
}

export interface AdHocInspection {
    id: string;
    case: string;
    trigger_type: string;
    inspection_scope: string;
    areas_of_focus: string;
    immediate_findings: string;
    follow_up_required: boolean;
    follow_up_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface CaseAttachment {
    id: string;
    case: string;
    file_name: string;
    file_type: string;
    description: string;
    uploaded_by: number;
    uploaded_at: string;
}

export interface CaseTimeline {
    id: string;
    case: string;
    event_type: string;
    event_date: string;
    description: string;
    notes: string;
    created_at: string;
}

export const caseManagementService = {
    // Cases
    getCases: (page = 1) =>
        apiFetch(`/api/case-management/cases/?page=${page}`),

    getCase: (id: string) =>
        apiFetch(`/api/case-management/cases/${id}/`),

    createCase: (data: Partial<Case>) =>
        apiFetch(`/api/case-management/cases/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateCase: (id: string, data: Partial<Case>) =>
        apiFetch(`/api/case-management/cases/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    deleteCase: (id: string) =>
        apiFetch(`/api/case-management/cases/${id}/`, {
            method: "DELETE",
        }),

    // Case Notes
    getCaseNotes: (page = 1) =>
        apiFetch(`/api/case-management/case-notes/?page=${page}`),

    getCaseNote: (id: string) =>
        apiFetch(`/api/case-management/case-notes/${id}/`),

    createCaseNote: (data: Partial<CaseNote>) =>
        apiFetch(`/api/case-management/case-notes/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // Investigations
    getInvestigations: (page = 1) =>
        apiFetch(`/api/case-management/investigations/?page=${page}`),

    getInvestigation: (id: string) =>
        apiFetch(`/api/case-management/investigations/${id}/`),

    createInvestigation: (data: Partial<Investigation>) =>
        apiFetch(`/api/case-management/investigations/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateInvestigation: (id: string, data: Partial<Investigation>) =>
        apiFetch(`/api/case-management/investigations/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // Ad-hoc Inspections
    getAdHocInspections: (page = 1) =>
        apiFetch(`/api/case-management/ad-hoc-inspections/?page=${page}`),

    getAdHocInspection: (id: string) =>
        apiFetch(`/api/case-management/ad-hoc-inspections/${id}/`),

    createAdHocInspection: (data: Partial<AdHocInspection>) =>
        apiFetch(`/api/case-management/ad-hoc-inspections/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateAdHocInspection: (id: string, data: Partial<AdHocInspection>) =>
        apiFetch(`/api/case-management/ad-hoc-inspections/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // Attachments
    getAttachments: (page = 1) =>
        apiFetch(`/api/case-management/attachments/?page=${page}`),

    getAttachment: (id: string) =>
        apiFetch(`/api/case-management/attachments/${id}/`),

    uploadAttachment: (formData: FormData) =>
        apiFetch(`/api/case-management/attachments/`, {
            method: "POST",
            body: formData,
        }),

    // Timeline
    getTimeline: (page = 1) =>
        apiFetch(`/api/case-management/timeline/?page=${page}`),

    getTimelineEvent: (id: string) =>
        apiFetch(`/api/case-management/timeline/${id}/`),

    createTimelineEvent: (data: Partial<CaseTimeline>) =>
        apiFetch(`/api/case-management/timeline/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
