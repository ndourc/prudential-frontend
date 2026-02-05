export interface BoardMember {
  id: string;
  name: string;
  position: string;
  appointmentDate: string;
  qualifications: string;
  experience: string;
  isPEP: boolean;
}

export interface Committee {
  id: string;
  name: string;
  purpose: string;
  chairperson: string;
  members: string[];
  meetingsHeld: number;
  meetingFrequency: string;
}

export interface Product {
  id: string;
  productName: string;
  productType: string;
  launchDate: string;
  income: number;
  concentrationPercentage: number;
}

export interface Client {
  id: string;
  clientName: string;
  clientType: string;
  onboardingDate: string;
  income: number;
  concentrationPercentage: number;
}

export interface IncomeItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  isCore: boolean;
}

export interface FinancialStatement {
  periodStart: string;
  periodEnd: string;
  totalRevenue: number;
  operatingCosts: number;
  profitBeforeTax: number;
  grossMargin: number;
  profitMargin: number;
  incomeItems: IncomeItem[];
}

export interface Asset {
  id: string;
  assetType: string;
  category: string;
  value: number;
  isCurrent: boolean;
  acquisitionDate?: string;
}

export interface Liability {
  id: string;
  liabilityType: string;
  category: string;
  value: number;
  isCurrent: boolean;
  dueDate?: string;
}

export interface Debtor {
  id: string;
  name: string;
  amount: number;
  ageDays: number;
}

export interface Creditor {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface RelatedParty {
  id: string;
  name: string;
  relationship: string;
  balance: number;
  type: "receivable" | "payable";
}

export interface BalanceSheet {
  periodEnd: string;
  shareholdersFunds: number;
  totalAssets: number;
  totalLiabilities: number;
  currentAssets: number;
  currentLiabilities: number;
  workingCapital: number;
  cashCover: number;
  assets: Asset[];
  liabilities: Liability[];
  debtors: Debtor[];
  creditors: Creditor[];
  relatedParties: RelatedParty[];
}

export interface ClientAsset {
  id: string;
  assetType: string;
  value: number;
  concentrationPercentage: number;
}

export interface CapitalPosition {
  calculationDate: string;
  netCapital: number;
  requiredCapital: number;
  adjustedLiquidCapital: number;
  isCompliant: boolean;
  capitalAdequacyRatio: number;
}

export interface OffsiteFormData {
  companyId: string;
  reportingPeriod: {
    start: string;
    end: string;
  };
  boardMembers: BoardMember[];
  committees: Committee[];
  products: Product[];
  clients: Client[];
  financialStatement: FinancialStatement;
  balanceSheet: BalanceSheet;
  clientAssets: ClientAsset[];
  capitalPosition: CapitalPosition;
  supportingDocuments: File[];
}
