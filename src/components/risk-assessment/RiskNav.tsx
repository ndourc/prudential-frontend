"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Shield,
  ListChecks,
  AlertTriangle,
  Activity,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  badge?: string;
}

export default function RiskNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: "/risk-assessment",
      label: "Risk Dashboard",
      icon: Shield,
      description: "Summary and industry ranking",
    },
    {
      href: "/risk-assessment/assessments",
      label: "Assessments",
      icon: ListChecks,
      description: "Manage risk assessments (CRUD)",
    },
    {
      href: "/risk-assessment/indicators",
      label: "Indicators & Alerts",
      icon: AlertTriangle,
      description: "Manage risk indicators and thresholds",
    },
    {
      href: "/risk-assessment/stress-tests",
      label: "Stress Tests",
      icon: Activity,
      description: "Scenario testing and impacts",
    },
    {
      href: "/risk-assessment/trends",
      label: "Risk Trends",
      icon: BarChart3,
      description: "Historical score analysis",
    },
  ];

  const isActive = (href: string) =>
    pathname === href ||
    (href !== "/risk-assessment" && pathname?.startsWith(href));

  return (
    <div className="sticky top-6 space-y-4">
      {/* Risk Module Header - Using a distinct color for this module */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Risk Assessment</h2>
            <p className="text-xs text-white/80">Oversight & Analytics</p>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <Card className="overflow-hidden">
        <div className="p-3">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                      active
                        ? "bg-red-500 text-white shadow-md"
                        : "hover:bg-red-50 text-foreground"
                    )}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 p-1.5 rounded-md transition-colors",
                        active
                          ? "bg-white/20"
                          : "bg-red-100 group-hover:bg-red-200"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          active ? "text-white" : "text-red-700"
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-medium text-sm truncate",
                            active ? "text-white" : "text-foreground"
                          )}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-medium",
                              active
                                ? "bg-white/20 text-white"
                                : "bg-red-100 text-red-700"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p
                          className={cn(
                            "text-xs mt-0.5 truncate",
                            active ? "text-white/80" : "text-muted-foreground"
                          )}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 flex-shrink-0 transition-all duration-200",
                        active
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      )}
                    />
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </Card>

      {/* Footer Info Card - Example for Risk Summary */}
      <Card className="p-4 bg-muted/50">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">High Risk SMIs</span>
            <span className="font-semibold text-red-600">4</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Critical Indicators</span>
            <span className="font-semibold text-red-600">18</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Pending Assessments</span>
            <span className="font-semibold text-amber-600">12</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
