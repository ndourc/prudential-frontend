"use client";

import { useEffect, useState } from "react";
import { PrudentialReturn, returnsService } from "@/service/returns";
import { coreAPI } from "@/service/core";
import { SMI } from "@/types/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

export default function PrudentialReturnsPage() {
  const [returns, setReturns] = useState<PrudentialReturn[]>([]);
  const [smis, setSmis] = useState<SMI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSmi, setSelectedSmi] = useState("");
  const [reportingPeriod, setReportingPeriod] = useState("");
  const [submissionDate, setSubmissionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [status, setStatus] = useState("DRAFT");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [returnsRes, smisRes] = await Promise.all([
        returnsService.getPrudentialReturns(),
        coreAPI.listSMIs(),
      ]);
      const returnsData = Array.isArray(returnsRes)
        ? returnsRes
        : returnsRes.results || [];
      const smisData = Array.isArray(smisRes) ? smisRes : smisRes.results || [];
      setReturns(returnsData);
      setSmis(smisData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Format reporting period from YYYY-MM to YYYY-MM-DD (first of month)
      const formattedPeriod = reportingPeriod ? `${reportingPeriod}-01` : "";

      await returnsService.createPrudentialReturn({
        smi_id: selectedSmi,
        reporting_period: formattedPeriod,
        submission_date: submissionDate,
        status,
      } as any);
      setShowForm(false);
      loadData();
      setSelectedSmi("");
      setReportingPeriod("");
    } catch (error: any) {
      console.error("Failed to create return:", error);
      alert(
        "Failed to create return: " +
          (error.payload ? JSON.stringify(error.payload) : error.message)
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
      case "approved":
        return "default";
      case "draft":
        return "secondary";
      case "under_review":
        return "warning";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-gray-50/50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Prudential Returns
          </h1>
          <p className="text-gray-500 mt-2">
            Submit and track prudential return filings.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "New Return"}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returns.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {returns.filter((r) => r.status === "SUBMITTED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {returns.filter((r) => r.status === "APPROVED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {returns.filter((r) => r.status === "DRAFT").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit New Prudential Return</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select SMI *
                  </label>
                  <select
                    required
                    value={selectedSmi}
                    onChange={(e) => setSelectedSmi(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Company...</option>
                    {smis.map((smi) => (
                      <option key={smi.id} value={smi.id}>
                        {smi.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporting Period *
                  </label>
                  <input
                    type="month"
                    required
                    value={reportingPeriod}
                    onChange={(e) => setReportingPeriod(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submission Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Return</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Prudential Returns ({returns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {returns.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">
                No returns found. Submit one to get started.
              </p>
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Company
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Reporting Period
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Submission Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {returns.map((ret) => (
                    <tr
                      key={ret.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {ret.smi?.company_name || "N/A"}
                      </td>
                      <td className="p-4 align-middle">
                        {ret.reporting_period}
                      </td>
                      <td className="p-4 align-middle">
                        {new Date(ret.submission_date).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={getStatusColor(ret.status) as any}>
                          {ret.status}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        {new Date(ret.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
