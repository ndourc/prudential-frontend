"use client";

import { useEffect, useState } from "react";
import { ComplianceRequirement, complianceService } from "@/service/compliance";
import { coreAPI } from "@/service/core";
import { SMI } from "@/types/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, XCircle } from "lucide-react";

export default function ComplianceRequirementsPage() {
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
  const [smis, setSmis] = useState<SMI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSmi, setSelectedSmi] = useState("");
  const [requirementType, setRequirementType] = useState("REGULATORY");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [requirementsRes, smisRes] = await Promise.all([
        complianceService.getRequirements(),
        coreAPI.listSMIs(),
      ]);
      const reqData = Array.isArray(requirementsRes)
        ? requirementsRes
        : requirementsRes.results || [];
      const smisData = Array.isArray(smisRes) ? smisRes : smisRes.results || [];
      setRequirements(reqData);
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
      await complianceService.createRequirement({
        smi_id: selectedSmi,
        requirement_type: requirementType,
        title,
        description,
        priority,
        due_date: dueDate || null,
        is_compliant: false,
        compliance_score: 0,
      } as any);
      setShowForm(false);
      loadData();
      // Reset form
      setSelectedSmi("");
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (error: any) {
      console.error("Failed to create requirement:", error);
      alert(
        "Failed to create requirement: " +
          (error.payload ? JSON.stringify(error.payload) : error.message)
      );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "low":
        return "secondary";
      case "medium":
        return "warning";
      case "high":
      case "critical":
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
            Compliance Requirements
          </h1>
          <p className="text-gray-500 mt-2">
            Monitor regulatory and operational compliance requirements.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "New Requirement"}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requirements
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requirements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {requirements.filter((r) => r.is_compliant).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {requirements.filter((r) => !r.is_compliant).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Priority
            </CardTitle>
            <Badge variant="destructive">!</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requirements.filter((r) => r.priority === "CRITICAL").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Requirement</CardTitle>
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
                    Requirement Type *
                  </label>
                  <select
                    value={requirementType}
                    onChange={(e) => setRequirementType(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="REGULATORY">Regulatory Requirement</option>
                    <option value="OPERATIONAL">Operational Requirement</option>
                    <option value="FINANCIAL">Financial Requirement</option>
                    <option value="REPORTING">Reporting Requirement</option>
                    <option value="TRAINING">Training Requirement</option>
                    <option value="DOCUMENTATION">
                      Documentation Requirement
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="CRITICAL">Critical Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., Annual AML Compliance Audit"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                  placeholder="Describe the requirement in detail..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Requirement</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Requirements ({requirements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {requirements.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle2 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">
                No requirements found. Create one to get started.
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
                      Title
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Priority
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Due Date
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Compliance
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {requirements.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {req.smi?.company_name || "N/A"}
                      </td>
                      <td className="p-4 align-middle max-w-md truncate font-medium">
                        {req.title}
                      </td>
                      <td className="p-4 align-middle">
                        {req.requirement_type}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={getPriorityColor(req.priority) as any}>
                          {req.priority}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        {req.due_date
                          ? new Date(req.due_date).toLocaleDateString()
                          : "No deadline"}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={req.is_compliant ? "default" : "destructive"}
                        >
                          {req.is_compliant ? "Compliant" : "Non-Compliant"}
                        </Badge>
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
