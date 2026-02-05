import { z } from "zod";

const boardMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position is required"),
  appointmentDate: z.string().min(1, "Appointment date is required"),
  qualifications: z
    .string()
    .min(10, "Qualifications must be at least 10 characters"),
  experience: z.string().min(10, "Experience must be at least 10 characters"),
  isPEP: z.boolean(),
});

const committeeSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Committee name is required"),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
  chairperson: z.string().min(2, "Chairperson name is required"),
  members: z.array(z.string()).min(1, "At least one member is required"),
  meetingsHeld: z.number().min(0, "Meetings held must be 0 or more"),
  meetingFrequency: z.string().min(1, "Meeting frequency is required"),
});

const productSchema = z.object({
  id: z.string(),
  productName: z.string().min(2, "Product name is required"),
  productType: z.string().min(2, "Product type is required"),
  launchDate: z.string().min(1, "Launch date is required"),
  income: z.number().min(0, "Income must be 0 or more"),
  concentrationPercentage: z.number().min(0).max(100),
});

const clientSchema = z.object({
  id: z.string(),
  clientName: z.string().min(2, "Client name is required"),
  clientType: z.string().min(2, "Client type is required"),
  onboardingDate: z.string().min(1, "Onboarding date is required"),
  income: z.number().min(0, "Income must be 0 or more"),
  concentrationPercentage: z.number().min(0).max(100),
});

const incomeItemSchema = z.object({
  id: z.string(),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(2, "Description is required"),
  amount: z.number().min(0, "Amount must be 0 or more"),
  isCore: z.boolean(),
});

const financialStatementSchema = z.object({
  periodStart: z.string().min(1, "Period start is required"),
  periodEnd: z.string().min(1, "Period end is required"),
  totalRevenue: z.number().min(0, "Total revenue must be 0 or more"),
  operatingCosts: z.number().min(0, "Operating costs must be 0 or more"),
  profitBeforeTax: z.number(),
  grossMargin: z.number().min(0).max(100),
  profitMargin: z.number(),
  incomeItems: z
    .array(incomeItemSchema)
    .min(1, "At least one income item is required"),
});

const assetSchema = z.object({
  id: z.string(),
  assetType: z.string().min(2, "Asset type is required"),
  category: z.string().min(2, "Category is required"),
  value: z.number().min(0, "Value must be 0 or more"),
  isCurrent: z.boolean(),
  acquisitionDate: z.string().optional(),
});

const liabilitySchema = z.object({
  id: z.string(),
  liabilityType: z.string().min(2, "Liability type is required"),
  category: z.string().min(2, "Category is required"),
  value: z.number().min(0, "Value must be 0 or more"),
  isCurrent: z.boolean(),
  dueDate: z.string().optional(),
});

const debtorSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Debtor name is required"),
  amount: z.number().min(0, "Amount must be 0 or more"),
  ageDays: z.number().min(0, "Age days must be 0 or more"),
});

const creditorSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Creditor name is required"),
  amount: z.number().min(0, "Amount must be 0 or more"),
  dueDate: z.string().min(1, "Due date is required"),
});

const relatedPartySchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Related party name is required"),
  relationship: z.string().min(2, "Relationship is required"),
  balance: z.number().min(0, "Balance must be 0 or more"),
  type: z.enum(["receivable", "payable"]),
});

const balanceSheetSchema = z.object({
  periodEnd: z.string().min(1, "Period end is required"),
  shareholdersFunds: z.number().min(0, "Shareholders funds must be 0 or more"),
  totalAssets: z.number().min(0, "Total assets must be 0 or more"),
  totalLiabilities: z.number().min(0, "Total liabilities must be 0 or more"),
  currentAssets: z.number().min(0, "Current assets must be 0 or more"),
  currentLiabilities: z
    .number()
    .min(0, "Current liabilities must be 0 or more"),
  workingCapital: z.number(),
  cashCover: z.number().min(0, "Cash cover must be 0 or more"),
  assets: z.array(assetSchema).min(1, "At least one asset is required"),
  liabilities: z
    .array(liabilitySchema)
    .min(1, "At least one liability is required"),
  debtors: z.array(debtorSchema),
  creditors: z.array(creditorSchema),
  relatedParties: z.array(relatedPartySchema),
});

const clientAssetSchema = z.object({
  id: z.string(),
  assetType: z.string().min(2, "Asset type is required"),
  value: z.number().min(0, "Value must be 0 or more"),
  concentrationPercentage: z.number().min(0).max(100),
});

const capitalPositionSchema = z.object({
  calculationDate: z.string().min(1, "Calculation date is required"),
  netCapital: z.number().min(0, "Net capital must be 0 or more"),
  requiredCapital: z.number().min(0, "Required capital must be 0 or more"),
  adjustedLiquidCapital: z
    .number()
    .min(0, "Adjusted liquid capital must be 0 or more"),
  isCompliant: z.boolean(),
  capitalAdequacyRatio: z.number().min(0),
});

export const offsiteFormSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  reportingPeriod: z.object({
    start: z.string().min(1, "Reporting period start is required"),
    end: z.string().min(1, "Reporting period end is required"),
  }),
  boardMembers: z
    .array(boardMemberSchema)
    .min(1, "At least one board member is required"),
  committees: z
    .array(committeeSchema)
    .min(1, "At least one committee is required"),
  products: z.array(productSchema).min(1, "At least one product is required"),
  clients: z.array(clientSchema).min(1, "At least one client is required"),
  financialStatement: financialStatementSchema,
  balanceSheet: balanceSheetSchema,
  clientAssets: z
    .array(clientAssetSchema)
    .min(1, "At least one client asset is required"),
  capitalPosition: capitalPositionSchema,
});

