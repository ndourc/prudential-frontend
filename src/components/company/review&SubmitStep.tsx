import { formatCurrency, formatDate } from "@/lib/company";
import { OffsiteFormData } from "@/types/company";
import { CheckCircle, Info } from "lucide-react";

interface ReviewSubmitStepProps {
  data: OffsiteFormData;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ data }) => {
  const totalProductIncome = data.products.reduce(
    (sum, p) => sum + p.income,
    0
  );
  const totalClientIncome = data.clients.reduce((sum, c) => sum + c.income, 0);
  const totalClientAssets = data.clientAssets.reduce(
    (sum, a) => sum + a.value,
    0
  );
  const coreIncome = data.financialStatement.incomeItems
    .filter((i) => i.isCore)
    .reduce((sum, i) => sum + i.amount, 0);
  const nonCoreIncome = data.financialStatement.incomeItems
    .filter((i) => !i.isCore)
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <CheckCircle className="w-7 h-7 mr-2 text-green-500" />
          Review Your Submission
        </h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Board Members</p>
            <p className="text-3xl font-bold text-blue-600">
              {data.boardMembers.length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Committees</p>
            <p className="text-3xl font-bold text-green-600">
              {data.committees.length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Products</p>
            <p className="text-3xl font-bold text-purple-600">
              {data.products.length}
            </p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Clients</p>
            <p className="text-3xl font-bold text-indigo-600">
              {data.clients.length}
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4">
          {/* Reporting Period */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Reporting Period
            </h3>
            <p className="text-sm text-gray-600">
              {(() => {
                const s = formatDate(data.reportingPeriod.start);
                const e = formatDate(data.reportingPeriod.end);
                if (!s && !e) return "Not specified";
                return `${s || "N/A"} to ${e || "N/A"}`;
              })()}
            </p>
          </div>

          {/* Financial Summary */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Financial Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Total Revenue</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(data.financialStatement.totalRevenue)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Operating Costs</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(data.financialStatement.operatingCosts)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Profit Before Tax</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(data.financialStatement.profitBeforeTax)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Gross Margin</p>
                <p className="font-semibold text-gray-800">
                  {data.financialStatement.grossMargin.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Core Income</p>
                <p className="font-semibold text-green-600">
                  {formatCurrency(coreIncome)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Non-Core Income</p>
                <p className="font-semibold text-orange-600">
                  {formatCurrency(nonCoreIncome)}
                </p>
              </div>
            </div>
          </div>

          {/* Balance Sheet Summary */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Balance Sheet Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Total Assets</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(data.balanceSheet.totalAssets)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Liabilities</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(data.balanceSheet.totalLiabilities)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Shareholders&lsquo; Funds</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(data.balanceSheet.shareholdersFunds)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Working Capital</p>
                <p
                  className={`font-semibold ${
                    data.balanceSheet.workingCapital >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(data.balanceSheet.workingCapital)}
                </p>
              </div>
            </div>
          </div>

          {/* Capital Position */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Capital Position
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Net Capital</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(data.capitalPosition.netCapital)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Required Capital</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(data.capitalPosition.requiredCapital)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Compliance Status</p>
                <p
                  className={`font-semibold ${
                    data.capitalPosition.isCompliant
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {data.capitalPosition.isCompliant
                    ? "COMPLIANT"
                    : "NON-COMPLIANT"}
                </p>
              </div>
            </div>
          </div>

          {/* Income Sources */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Income Analysis
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Total Product Income</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(totalProductIncome)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Client Income</p>
                <p className="font-semibold text-gray-800">
                  {formatCurrency(totalClientIncome)}
                </p>
              </div>
            </div>
          </div>

          {/* Client Assets */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Client Assets
            </h3>
            <div className="text-sm">
              <p className="text-gray-600">
                Total Client Assets Under Management
              </p>
              <p className="font-semibold text-gray-800">
                {formatCurrency(totalClientAssets)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {data.clientAssets.length} asset types tracked
              </p>
            </div>
          </div>

          {/* Supporting Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Supporting Documents
            </h3>
            <p className="text-sm text-gray-600">
              {data.supportingDocuments.length} file(s) uploaded
            </p>
            {data.supportingDocuments.length > 0 && (
              <div className="mt-2 space-y-1">
                {data.supportingDocuments.slice(0, 5).map((file, index) => (
                  <p key={index} className="text-xs text-gray-500">
                    • {file.name}
                  </p>
                ))}
                {data.supportingDocuments.length > 5 && (
                  <p className="text-xs text-gray-500">
                    ... and {data.supportingDocuments.length - 5} more
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <Info className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Before You Submit
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Verify all information is accurate and complete</li>
              <li>• Ensure all required supporting documents are uploaded</li>
              <li>• Check that financial calculations are correct</li>
              <li>• Confirm capital position reflects current status</li>
              <li>• Review board and committee information for accuracy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
