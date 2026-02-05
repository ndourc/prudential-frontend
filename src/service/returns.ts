import apiFetch from "@/lib/http";

import { SMI } from "@/types/core";

export interface PrudentialReturn {
    id: string;
    smi: SMI;
    smi_id?: string;
    reporting_period: string;
    submission_date: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface IncomeStatement {
    id: string;
    prudential_return: string;
    revenue: string;
    operating_expenses: string;
    net_profit: string;
    created_at: string;
    updated_at: string;
}

export interface BalanceSheet {
    id: string;
    prudential_return: string;
    total_assets: string;
    total_liabilities: string;
    equity: string;
    created_at: string;
    updated_at: string;
}

export const returnsService = {
    // Prudential Returns
    getPrudentialReturns: (page = 1) =>
        apiFetch(`/api/returns/prudential-returns/?page=${page}`),

    getPrudentialReturn: (id: string) =>
        apiFetch(`/api/returns/prudential-returns/${id}/`),

    createPrudentialReturn: (data: Partial<PrudentialReturn>) =>
        apiFetch(`/api/returns/prudential-returns/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updatePrudentialReturn: (id: string, data: Partial<PrudentialReturn>) =>
        apiFetch(`/api/returns/prudential-returns/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    deletePrudentialReturn: (id: string) =>
        apiFetch(`/api/returns/prudential-returns/${id}/`, {
            method: "DELETE",
        }),

    // Income Statements
    getIncomeStatements: (page = 1) =>
        apiFetch(`/api/returns/income-statements/?page=${page}`),

    getIncomeStatement: (id: string) =>
        apiFetch(`/api/returns/income-statements/${id}/`),

    createIncomeStatement: (data: Partial<IncomeStatement>) =>
        apiFetch(`/api/returns/income-statements/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateIncomeStatement: (id: string, data: Partial<IncomeStatement>) =>
        apiFetch(`/api/returns/income-statements/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    // Balance Sheets
    getBalanceSheets: (page = 1) =>
        apiFetch(`/api/returns/balance-sheets/?page=${page}`),

    getBalanceSheet: (id: string) =>
        apiFetch(`/api/returns/balance-sheets/${id}/`),

    createBalanceSheet: (data: Partial<BalanceSheet>) =>
        apiFetch(`/api/returns/balance-sheets/`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateBalanceSheet: (id: string, data: Partial<BalanceSheet>) =>
        apiFetch(`/api/returns/balance-sheets/${id}/`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),
};
