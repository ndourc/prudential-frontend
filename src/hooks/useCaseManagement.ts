"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { caseManagementService, Case, CaseNote, AdHocInspection, CaseAttachment, CaseTimeline, Investigation } from "@/service/caseManagement";

const QC_KEYS = {
    cases: ["cases"],
    caseNotes: ["case-notes"],
    investigations: ["investigations"],
    adHocInspections: ["ad-hoc-inspections"],
    attachments: ["attachments"],
    timeline: ["timeline"],
};

// --- Cases ---
export function useCases(page = 1) {
    return useQuery({
        queryKey: [...QC_KEYS.cases, page],
        queryFn: () => caseManagementService.getCases(page),
    });
}

export function useCase(id: string) {
    return useQuery({
        queryKey: [...QC_KEYS.cases, id],
        queryFn: () => caseManagementService.getCase(id),
        enabled: !!id,
    });
}

export function useCreateCase() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Case>) => caseManagementService.createCase(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.cases }),
    });
}

export function useUpdateCase() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Case> }) =>
            caseManagementService.updateCase(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.cases }),
    });
}

export function useDeleteCase() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => caseManagementService.deleteCase(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.cases }),
    });
}

// --- Case Notes ---
export function useCaseNotes(page = 1) {
    return useQuery({
        queryKey: [...QC_KEYS.caseNotes, page],
        queryFn: () => caseManagementService.getCaseNotes(page),
    });
}

export function useCreateCaseNote() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<CaseNote>) => caseManagementService.createCaseNote(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.caseNotes }),
    });
}

// --- Investigations ---
export function useInvestigations(page = 1) {
    return useQuery({
        queryKey: [...QC_KEYS.investigations, page],
        queryFn: () => caseManagementService.getInvestigations(page),
    });
}
export function useCreateInvestigation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Investigation>) => caseManagementService.createInvestigation(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.investigations }),
    });
}

// --- Ad-Hoc Inspections ---
export function useAdHocInspections(page = 1) {
    return useQuery({
        queryKey: [...QC_KEYS.adHocInspections, page],
        queryFn: () => caseManagementService.getAdHocInspections(page),
    });
}

export function useCreateAdHocInspection() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<AdHocInspection>) =>
            caseManagementService.createAdHocInspection(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.adHocInspections }),
    });
}

// --- Attachments ---
export function useAttachments(page = 1) {
    return useQuery({
        queryKey: [...QC_KEYS.attachments, page],
        queryFn: () => caseManagementService.getAttachments(page),
    });
}

export function useUploadAttachment() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => caseManagementService.uploadAttachment(formData),
        onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.attachments }),
    });
}

// --- Timeline ---
export function useTimeline(page = 1) {
    return useQuery({
        queryKey: [...QC_KEYS.timeline, page],
        queryFn: () => caseManagementService.getTimeline(page),
    });
}

export function useCreateTimelineEvent() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<CaseTimeline>) =>
            caseManagementService.createTimelineEvent(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: QC_KEYS.timeline }),
    });
}
