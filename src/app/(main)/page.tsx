"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  Layers,
  Link2,
  Building2,
  AlertCircle,
  Users,
  ArrowRight,
  Loader2,
  Briefcase,
  GitGraph,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSMIs } from "@/hooks/useCoreSMIs";
import { useDirectors } from "@/hooks/useDirectors";
import { useAssessments } from "@/hooks/useRiskAssessment";
import { useLicenseHistory } from "@/hooks/useLicenseHistory";

// Custom helper function to safely extract count or array length
const getCount = (data: any, isLoading: boolean): number | string => {
  if (isLoading) return "...";
  if (!data) return "N/A";
  if (typeof data === "number") return data;
  if (data.count !== undefined) return data.count;
  if (Array.isArray(data)) return data.length;
  if (Array.isArray(data.results)) return data.results.length;
  return "N/A";
};

// Utility function to get accent classes based on module theme
const getModuleTheme = (theme: "amber" | "primary" | "red" | "green") => {
  switch (theme) {
    case "amber":
      // Core Module
      return {
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950",
        hoverBg: "hover:bg-amber-100 dark:hover:bg-amber-900/50",
        hoverBorder: "hover:border-amber-500",
      };
    case "primary":
      // Licensing Module
      return {
        color: "text-primary dark:text-primary-foreground",
        bg: "bg-primary-50 dark:bg-primary/10",
        hoverBg: "hover:bg-primary/10 dark:hover:bg-primary/20",
        hoverBorder: "hover:border-primary",
      };
    case "red":
      // Risk Assessment Module
      return {
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950",
        hoverBg: "hover:bg-red-100 dark:hover:bg-red-900/50",
        hoverBorder: "hover:border-red-500",
      };
    case "green":
      // Company Profiling Module
      return {
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-950",
        hoverBg: "hover:bg-green-100 dark:hover:bg-green-900/50",
        hoverBorder: "hover:border-green-500",
      };
    default:
      return {
        color: "text-slate-600 dark:text-slate-400",
        bg: "bg-slate-50 dark:bg-slate-800",
        hoverBg: "hover:bg-slate-100 dark:hover:bg-slate-700",
        hoverBorder: "hover:border-slate-400",
      };
  }
};

// --- Dashboard Component ---
export default function DashboardHome() {
  // Fetching data for KPIs
  const { data: smisData, isLoading: isLoadingSMIs } = useSMIs(1);
  const { data: directorsData, isLoading: isLoadingDirectors } =
    useDirectors(1);
  const { data: assessmentsData, isLoading: isLoadingAssessments } =
    useAssessments(1);
  const { data: licensesData, isLoading: isLoadingLicenses } =
    useLicenseHistory(1);

  // KPI Calculations
  const totalSMIs = getCount(smisData, isLoadingSMIs);
  const totalDirectors = getCount(directorsData, isLoadingDirectors);
  const totalAssessments = getCount(assessmentsData, isLoadingAssessments);

  // Derived Metrics based on available data for illustration
  const pendingLicenseReviews = useMemo(() => {
    if (isLoadingLicenses || !licensesData || !licensesData.results)
      return "...";
    // Simplified status check
    return (licensesData.results as any[]).filter(
      (l) => l.status === "PENDING" || l.status === "UNDER_REVIEW"
    ).length;
  }, [licensesData, isLoadingLicenses]);

  const highRiskCount = useMemo(() => {
    if (isLoadingAssessments || !assessmentsData || !assessmentsData.results)
      return "...";
    // Count assessments flagged as HIGH or CRITICAL
    return (assessmentsData.results as any[]).filter(
      (a) => a.risk_level === "HIGH" || a.risk_level === "CRITICAL"
    ).length;
  }, [assessmentsData, isLoadingAssessments]);

  const isLoading =
    isLoadingSMIs ||
    isLoadingDirectors ||
    isLoadingAssessments ||
    isLoadingLicenses;

  const stats = [
    {
      label: "Total SMIs",
      value: totalSMIs,
      icon: Briefcase,
      theme: "amber",
      gradient:
        "from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900",
    },
    {
      label: "Total Directors",
      value: totalDirectors,
      icon: Users,
      theme: "primary",
      gradient:
        "from-primary-50 to-primary-100 dark:from-primary/10 dark:to-primary/20",
    },
    {
      label: "High Risk SMIs",
      value: highRiskCount,
      icon: Shield,
      theme: "red",
      gradient: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
    },
    {
      label: "Pending License Reviews",
      value: pendingLicenseReviews,
      icon: Clock,
      theme: "amber",
      gradient:
        "from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700",
    },
  ];

  const modules = [
    {
      title: "Core Module",
      description:
        "Manage SMIs, Products, Financial Filings, and Supervisory Interventions.",
      href: "/core",
      icon: Layers,
      theme: "amber",
    },
    {
      title: "Licensing Module",
      description:
        "Manage Directors, Shareholders, License History, and Portal Data Integration.",
      href: "/licensing",
      icon: Link2,
      theme: "primary",
    },
    {
      title: "Risk Assessment",
      description:
        "Perform institutional risk assessments, monitor indicators, stress tests, and trends.",
      href: "/risk-assessment",
      icon: Shield,
      theme: "red",
    },
    {
      title: "Company Profiling",
      description:
        "Offsite Institutional Data Submission and Management (Annual Prudential Returns).",
      href: "/company/registration",
      icon: Building2,
      theme: "green",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Prudential Regulatory Dashboard
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">
          Central hub for monitoring market intermediaries and regulatory
          oversight.
        </p>
      </div>

      {/* Stats Grid - With Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const theme = getModuleTheme(stat.theme as any);

          return (
            <Card
              key={stat.label}
              className={cn(
                "border border-slate-200 dark:border-slate-700 shadow-sm transition-all overflow-hidden",
                stat.gradient ? `bg-gradient-to-br ${stat.gradient}` : "",
                theme.hoverBorder
              )}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-bold text-slate-900 dark:text-white mt-1">
                      {isLoading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        stat.value
                      )}
                    </p>
                  </div>
                  <div className={cn("p-4 rounded-xl flex-shrink-0", theme.bg)}>
                    <Icon className={cn("w-6 h-6", theme.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modules Grid (Quick Access) - Cleaner Hover Effect */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6">
          Regulatory Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const theme = getModuleTheme(module.theme as any);

            return (
              <Link
                key={module.title}
                href={module.href}
                className="group block h-full"
              >
                <Card
                  className={cn(
                    "h-full border border-slate-200 dark:border-slate-700 shadow-md transition-all duration-300 hover:shadow-xl",
                    theme.hoverBorder,
                    theme.hoverBg // Use the defined hover background
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-300",
                          theme.bg
                        )}
                      >
                        <Icon className={cn("w-6 h-6", theme.color)} />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {module.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 min-h-[40px]">
                      {module.description}
                    </p>

                    <div
                      className={cn(
                        "flex items-center text-sm font-bold group-hover:gap-2 transition-all duration-300",
                        theme.color
                      )}
                    >
                      Go to Module
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* System Insights & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <GitGraph className="w-6 h-6 mr-2 text-green-600" />
            System-Wide Activity Feed
          </h2>
          <div className="space-y-4">
            {/* Simulated recent activity items */}
            {[
              {
                type: "RISK",
                message:
                  "CRITICAL alert triggered on Liquidity Ratio for SMI XYZ.",
                time: "5 minutes ago",
                theme: "red",
              },
              {
                type: "CORE",
                message: "New Financial Statement filed by ABC Corp (Q3 2025).",
                time: "1 hour ago",
                theme: "amber",
              },
              {
                type: "LICENSING",
                message: "Director approval requested for Jane Doe.",
                time: "1 day ago",
                theme: "primary",
              },
              {
                type: "AUDIT",
                message: "New Supervisory Intervention initiated for SMI 005.",
                time: "2 days ago",
                theme: "red",
              },
            ].map((activity, index) => {
              const theme = getModuleTheme(activity.theme as any);
              return (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        theme.color.replace("text-", "bg-")
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.type} Activity
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-red-600" />
            Risk Highlights
          </h2>
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg border border-red-200">
              <p className="font-semibold text-red-600">High Risk Count</p>
              <p className="text-3xl font-bold mt-1">{highRiskCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                SMIs flagged with High or Critical risk levels.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200">
              <p className="font-semibold text-amber-600">
                Pending License Reviews
              </p>
              <p className="text-3xl font-bold mt-1">{pendingLicenseReviews}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Licenses in 'PENDING' or 'UNDER_REVIEW' status.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
