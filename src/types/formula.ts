// Formula Management Types
export interface CalculationFormula {
    id: string;
    formula_type: string;
    formula_type_display: string;
    name: string;
    description: string;
    formula_expression: string;
    variables: Record<string, string>;
    weights: Record<string, number>;
    thresholds: Record<string, number>;
    is_active: boolean;
    version: number;
    created_by: string | null;
    updated_by: string | null;
    created_by_name?: string;
    updated_by_name?: string;
    created_at: string;
    updated_at: string;
    change_notes: string;
}

export interface CalculationComponent {
    name: string;
    value: number;
    weight: number;
    score?: number;
    contribution: number;
    impact_percentage: number;
    description: string;
}

export interface CalculationBreakdown {
    id: string;
    calculation_type: string;
    reference_id: string;
    formula: string | null;
    formula_name?: string;
    formula_type?: string;
    final_value: string;
    final_percentage: string | null;
    components: CalculationComponent[];
    calculated_at: string;
    calculated_by: string;
}

export interface CalculationBreakdownDetail extends Omit<CalculationBreakdown, 'formula'> {
    formula: CalculationFormula | null;
}
