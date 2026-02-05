"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Building2,
  FileText,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  description?: string;
}

export default function CompanyNav() {
  const pathname = usePathname();
  const BASE_PATH = "/company";

  const navItems: NavItem[] = [
    {
      href: `${BASE_PATH}`,
      label: "Company Dashboard",
      icon: Building2,
      description: "Overview and Status",
    },
    {
      href: `${BASE_PATH}/registration`,
      label: "Offsite Profiling Form",
      icon: ClipboardList,
      description: "Annual submission of regulatory data",
    },
    // Future routes
    {
      href: `${BASE_PATH}/returns-history`,
      label: "Returns History",
      icon: FileText,
      description: "View past prudential returns",
    },
    {
      href: `${BASE_PATH}/compliance-status`,
      label: "Compliance Status",
      icon: CheckCircle2,
      description: "Monitor regulatory compliance score",
    },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== BASE_PATH && pathname?.startsWith(href));

  return (
    <div className="sticky top-6 space-y-4">
      {/* Company Module Header - Using Green Theme */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Company</h2>
            <p className="text-xs text-white/80">Regulatory Submissions</p>
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
                        ? "bg-green-500 text-white shadow-md"
                        : "hover:bg-green-50 text-foreground"
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
                          : "bg-green-100 group-hover:bg-green-200"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          active ? "text-white" : "text-green-700"
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

      {/* Footer Info Card - Example */}
      <Card className="p-4 bg-muted/50">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Next Submission Due</span>
            <span className="font-semibold text-green-600">30 Mar 2026</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Latest Compliance Score
            </span>
            <span className="font-semibold">92%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
