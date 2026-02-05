"use client";
import {
  calculateCAR,
  calculateGrossMargin,
  calculateProfitMargin,
  calculateWorkingCapital,
} from "@/lib/company";
import { OffsiteFormData } from "@/types/company";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Package,
  Save,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiFetch from "@/lib/http";
import StepIndicator from "./stepIndicator";
import BoardCommitteesStep from "./boardCommitStep";
import ProductsClientsStep from "./productClientStep";
import FinancialStatementsStep from "./financialStatementStep";
import BalanceSheetStep from "./balanceSheetStep";
import DocumentUploadStep from "./documentUploadStep";
import ReviewSubmitStep from "./review&SubmitStep";
import ClientAssetsCapitalStep from "./modals/clientCapitalStep";

interface OffsiteProfilingFormProps {
  initialData?: OffsiteFormData | null;
  smiId?: string;
}

const OffsiteProfilingForm: React.FC<OffsiteProfilingFormProps> = ({ initialData, smiId }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastPayload, setLastPayload] = useState<string | null>(null);
  const [lastResponseRaw, setLastResponseRaw] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [tempSmiId, setTempSmiId] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (smiId) {
      setFormData(prev => ({ ...prev, companyId: smiId }));
    } else {
      // Initialize companyId from localStorage
      const storedSmiId = localStorage.getItem("smiId");
      if (storedSmiId) {
        setFormData(prev => ({ ...prev, companyId: storedSmiId }));
      }
    }
  }, [initialData, smiId]);

  const [formData, setFormData] = useState<OffsiteFormData>({
    companyId: "", // Will be set from localStorage
    reportingPeriod: {
      start: "",
      end: "",
    },
    boardMembers: [],
    committees: [],
    products: [],
    clients: [],
    financialStatement: {
      periodStart: "",
      periodEnd: "",
      totalRevenue: 0,
      operatingCosts: 0,
      profitBeforeTax: 0,
      grossMargin: 0,
      profitMargin: 0,
      incomeItems: [],
    },
    balanceSheet: {
      periodEnd: "",
      shareholdersFunds: 0,
      totalAssets: 0,
      totalLiabilities: 0,
      currentAssets: 0,
      currentLiabilities: 0,
      workingCapital: 0,
      cashCover: 0,
      assets: [],
      liabilities: [],
      debtors: [],
      creditors: [],
      relatedParties: [],
    },
    clientAssets: [],
    capitalPosition: {
      calculationDate: "",
      netCapital: 0,
      requiredCapital: 0,
      adjustedLiquidCapital: 0,
      isCompliant: false,
      capitalAdequacyRatio: 0,
    },
    supportingDocuments: [],
  });

  const steps = [
    { id: 1, title: "Board & Committees", icon: Users },
    { id: 2, title: "Products & Clients", icon: Package },
    { id: 3, title: "Financial Statements", icon: FileText },
    { id: 4, title: "Balance Sheet", icon: FileSpreadsheet },
    { id: 5, title: "Assets & Capital", icon: TrendingUp },
    { id: 6, title: "Documents", icon: Upload },
    { id: 7, title: "Review & Submit", icon: CheckCircle },
  ];

  const validateStep = (step: number): boolean => {
    setValidationErrors({});

    try {
      switch (step) {
        case 1:
          // Ensure companyId (SMI id) is set and valid before proceeding
          if (!formData.companyId) {
            setValidationErrors({ companyId: "Company ID is required. Enter the SMI ID from the admin." });
            return false;
          }
          if (!isValidUUID(formData.companyId)) {
            setValidationErrors({ companyId: "Company ID must be a valid UUID." });
            return false;
          }
          if (formData.boardMembers.length === 0) {
            setValidationErrors({
              boardMembers: "At least one board member is required",
            });
            return false;
          }
          if (formData.committees.length === 0) {
            setValidationErrors({
              committees: "At least one committee is required",
            });
            return false;
          }
          break;
        case 2:
          if (formData.products.length === 0) {
            setValidationErrors({
              products: "At least one product is required",
            });
            return false;
          }
          if (formData.clients.length === 0) {
            setValidationErrors({ clients: "At least one client is required" });
            return false;
          }
          break;
        case 3:
          if (
            !formData.financialStatement.periodStart ||
            !formData.financialStatement.periodEnd
          ) {
            setValidationErrors({
              periodStart: "Reporting period is required",
            });
            return false;
          }
          if (formData.financialStatement.incomeItems.length === 0) {
            setValidationErrors({
              incomeItems: "At least one income item is required",
            });
            return false;
          }
          break;
        case 4:
          if (formData.balanceSheet.assets.length === 0) {
            setValidationErrors({ assets: "At least one asset is required" });
            return false;
          }
          if (formData.balanceSheet.liabilities.length === 0) {
            setValidationErrors({
              liabilities: "At least one liability is required",
            });
            return false;
          }
          break;
        case 5:
          if (formData.clientAssets.length === 0) {
            setValidationErrors({
              clientAssets: "At least one client asset type is required",
            });
            return false;
          }
          if (!formData.capitalPosition.calculationDate) {
            setValidationErrors({
              capitalPosition: {
                calculationDate: "Calculation date is required",
              },
            });
            return false;
          }
          break;
      }
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  };

  const handleSetCompanyId = () => {
    if (!tempSmiId) {
      setSubmitError("Please enter the SMI ID provided by the admin.");
      return;
    }
    if (!isValidUUID(tempSmiId)) {
      setSubmitError("The SMI ID you entered is not a valid UUID.");
      return;
    }
    setFormData(prev => ({ ...prev, companyId: tempSmiId }));
    try {
      localStorage.setItem("smiId", tempSmiId);
    } catch {}
    setSubmitError(null);
  };

  const handleClearCompanyId = () => {
    setFormData(prev => ({ ...prev, companyId: "" }));
    try {
      localStorage.removeItem("smiId");
    } catch {}
    setTempSmiId("");
  };

  const isValidUUID = (v: string) => {
    if (!v || typeof v !== "string") return false;
    const re = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return re.test(v);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prepareDataForBackend = () => {
    // Calculate working capital
    const workingCapital = calculateWorkingCapital(
      formData.balanceSheet.currentAssets,
      formData.balanceSheet.currentLiabilities
    );

    // Calculate CAR
    const car = calculateCAR(
      formData.capitalPosition.netCapital,
      formData.capitalPosition.requiredCapital
    );

    // Determine compliance
    const isCompliant =
      formData.capitalPosition.netCapital >=
      formData.capitalPosition.requiredCapital;

    // Calculate margins
    const grossMargin = calculateGrossMargin(
      formData.financialStatement.totalRevenue,
      formData.financialStatement.operatingCosts
    );
    const profitMargin = calculateProfitMargin(
      formData.financialStatement.profitBeforeTax,
      formData.financialStatement.totalRevenue
    );

    return {
      companyId: formData.companyId,
      reportingPeriod: formData.reportingPeriod,
      boardMembers: formData.boardMembers,
      committees: formData.committees,
      products: formData.products,
      clients: formData.clients,
      financialStatement: {
        ...formData.financialStatement,
        grossMargin,
        profitMargin,
      },
      balanceSheet: {
        ...formData.balanceSheet,
        workingCapital,
      },
      clientAssets: formData.clientAssets,
      capitalPosition: {
        ...formData.capitalPosition,
        capitalAdequacyRatio: car,
        isCompliant,
      },
      metadata: {
        submittedAt: new Date().toISOString(),
        totalBoardMembers: formData.boardMembers.length,
        totalCommittees: formData.committees.length,
        totalProducts: formData.products.length,
        totalClients: formData.clients.length,
        totalIncomeItems: formData.financialStatement.incomeItems.length,
        totalAssets: formData.balanceSheet.assets.length,
        totalLiabilities: formData.balanceSheet.liabilities.length,
        totalClientAssetTypes: formData.clientAssets.length,
        totalDocuments: formData.supportingDocuments.length,
      },
    };
  };

  // Sanitize payload: remove empty-string date fields and normalize date formats
  const sanitizePayload = (payload: any) => {
    const isDateKey = (k: string) => /(^start$|^end$|date|Date|periodEnd|periodStart|period)/i.test(k);
    const normalizeDate = (v: any) => {
      if (v == null) return null;
      if (typeof v !== "string") return v;
      // Replace smart quotes and similar characters and trim
      const cleaned = v.replace(/[“”‘’‚‛„”]/g, '').trim();
      // Normalize unicode hyphen variations to ASCII hyphen
      const normalized = cleaned.replace(/[‑–—−]/g, '-');
      // If empty after cleaning, return null
      if (!normalized) return null;
      // Validate YYYY-MM-DD
      const re = /^\d{4}-\d{2}-\d{2}$/;
      return re.test(normalized) ? normalized : null;
    };

    const walk = (obj: any) => {
      if (Array.isArray(obj)) {
        return obj.map(walk).filter((v) => v !== undefined && v !== null);
      }
      if (obj && typeof obj === 'object') {
        const out: any = {};
        for (const [k, v] of Object.entries(obj)) {
          if (v === "") continue; // drop empty strings
          if (isDateKey(k)) {
            const d = normalizeDate(v);
            if (d) out[k] = d;
            // drop invalid/empty dates
            continue;
          }
          if (Array.isArray(v) || (v && typeof v === 'object')) {
            const nested = walk(v);
            if (nested !== undefined && nested !== null && (Array.isArray(nested) ? nested.length > 0 : Object.keys(nested).length > 0)) {
              out[k] = nested;
            }
            continue;
          }
          // strip out weird unicode quotes from strings
          if (typeof v === 'string') {
            out[k] = v.replace(/[“”‘’‚‛„”]/g, '').trim();
          } else {
            out[k] = v;
          }
        }
        return out;
      }
      return obj;
    };

    return walk(payload);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    // Ensure we have a valid company UUID before sending to backend
    if (!isValidUUID(formData.companyId)) {
      setSubmitError("companyId is not a valid UUID. Please select your company from the SMI selector.");
      try {
        setLastPayload(JSON.stringify({ companyId: formData.companyId }, null, 2));
      } catch {
        setLastPayload(String(formData.companyId));
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for backend and sanitize dates/strings
      const backendData = prepareDataForBackend();
      const sanitized = sanitizePayload(backendData);

      // Create FormData for file upload if files are present, otherwise JSON
      // Currently backend expects JSON for data, files handling might need adjustment if using FormData for everything
      // The backend view expects JSON body for OffsiteProfilingSerializer

      // For now, let's send JSON as the backend serializer expects it. 
      // File upload logic in backend needs to be separate or part of a multipart request.
      // The current backend implementation uses OffsiteProfilingSerializer which expects JSON data structure.
      // If we want to support file uploads, we need to adjust the backend to handle multipart/form-data and parse the JSON field.

      // Assuming for now we send JSON data first.

      console.log("Submitting data:", backendData);
      // Capture the payload being sent for debugging (shown on error)
      try {
        setLastPayload(JSON.stringify(sanitized, null, 2));
      } catch (e) {
        setLastPayload(String(sanitized));
      }

      try {
        const result = await apiFetch("/api/core/offsite-profiling/", {
          method: "POST",
          body: JSON.stringify(sanitized),
        });

        // apiFetch returns parsed JSON, or an object with __raw when server returned non-JSON
        if (result && (result as any).__raw) {
          setLastResponseRaw((result as any).__raw);
        } else {
          try {
            setLastResponseRaw(JSON.stringify(result, null, 2));
          } catch {
            setLastResponseRaw(String(result));
          }
        }

        console.log("Submission successful:", result);
        setSubmitSuccess(true);
      } catch (err: any) {
        // apiFetch attaches a payload (parsed or { __raw }) on errors
        const payload = err && (err.payload || err.response || null);
        if (payload && payload.__raw) setLastResponseRaw(payload.__raw);
        else if (payload) {
          try {
            setLastResponseRaw(JSON.stringify(payload, null, 2));
          } catch {
            setLastResponseRaw(String(payload));
          }
        }

        throw err;
      }

      // Redirect after successful submission
      setTimeout(() => {
        router.push("/company/registration/success");
      }, 2000);
    } catch (error: any) {
      console.error("Submission error:", error);
      // Surface the payload alongside the error to aid debugging when backend gives no useful response
      const errMsg = error && error.message ? error.message : "Failed to submit form. Please try again.";
      setSubmitError(errMsg);
      // keep lastPayload visible in UI
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save draft functionality
  const handleSaveDraft = () => {
    const draftData = prepareDataForBackend();
    localStorage.setItem("offsite_profiling_draft", JSON.stringify(draftData));
    alert("Draft saved successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Institutional Profiling
        </h1>
        <p className="text-gray-600">
          Complete all sections to submit your institutional profile for offsite
          supervision
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Form Content */}
      <form onSubmit={(e) => e.preventDefault()}>
        {currentStep === 1 && (
          <>
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-100 rounded">
              {!formData.companyId ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">SMI ID (enter the ID provided by admin)</label>
                  <input
                    value={tempSmiId}
                    onChange={(e) => setTempSmiId(e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="w-full p-2 border rounded"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSetCompanyId}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Set Company
                    </button>
                    <p className="text-xs text-gray-600">If you don't have an SMI ID, contact your administrator.</p>
                  </div>
                  {validationErrors && (validationErrors as any).companyId && (
                    <p className="text-xs text-red-600">{(validationErrors as any).companyId}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-700">Using SMI ID:</p>
                    <p className="font-mono text-sm text-gray-800">{formData.companyId}</p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleClearCompanyId}
                      className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 text-sm"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>

            <BoardCommitteesStep
              data={{
                boardMembers: formData.boardMembers,
                committees: formData.committees,
              }}
              onChange={(data) => setFormData({ ...formData, ...data })}
              errors={validationErrors}
            />
          </>
        )}

        {currentStep === 2 && (
          <ProductsClientsStep
            data={{
              products: formData.products,
              clients: formData.clients,
            }}
            onChange={(data) => setFormData({ ...formData, ...data })}
            errors={validationErrors}
          />
        )}

        {currentStep === 3 && (
          <FinancialStatementsStep
            data={formData.financialStatement}
            onChange={(financialStatement) =>
              setFormData({ ...formData, financialStatement })
            }
            errors={validationErrors}
          />
        )}

        {currentStep === 4 && (
          <BalanceSheetStep
            data={formData.balanceSheet}
            onChange={(balanceSheet) =>
              setFormData({ ...formData, balanceSheet })
            }
            errors={validationErrors}
          />
        )}

        {currentStep === 5 && (
          <ClientAssetsCapitalStep
            data={{
              clientAssets: formData.clientAssets,
              capitalPosition: formData.capitalPosition,
            }}
            onChange={(data) => setFormData({ ...formData, ...data })}
            errors={validationErrors}
          />
        )}

        {currentStep === 6 && (
          <DocumentUploadStep
            files={formData.supportingDocuments}
            onChange={(supportingDocuments) =>
              setFormData({ ...formData, supportingDocuments })
            }
            errors={validationErrors}
          />
        )}

        {currentStep === 7 && <ReviewSubmitStep data={formData} />}

        {/* Navigation Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center px-6 py-3 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Draft
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex items-center px-6 py-3 text-white rounded-lg transition-colors ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Profile
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {submitError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Submission Error
                </p>
                <p className="text-sm text-red-700 mt-1">{submitError}</p>
                {lastPayload && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-800">Last Request Payload (JSON):</p>
                    <pre className="mt-1 max-h-48 overflow-auto text-xs bg-gray-50 p-2 rounded border text-gray-700">{lastPayload}</pre>
                  </div>
                )}
                {lastResponseRaw && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-800">Last Response (raw):</p>
                    <pre className="mt-1 max-h-48 overflow-auto text-xs bg-gray-50 p-2 rounded border text-gray-700">{lastResponseRaw}</pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Success Modal */}
      {submitSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Submission Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your offsite institutional profile has been submitted
              successfully. You will be redirected shortly.
            </p>
            <div className="animate-pulse">
              <div className="h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffsiteProfilingForm;
