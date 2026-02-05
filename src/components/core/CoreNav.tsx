"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  Sun,
  Database,
  ChartBar,
  FileText,
  Users,
  Clipboard,
  Activity,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  description?: string;
}

export default function CoreNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: "/core/smis",
      label: "SMIs",
      icon: Database,
      description: "Manage supervised market intermediaries",
    },
    {
      href: "/core/product-offerings",
      label: "Product Offerings",
      icon: ChartBar,
      description: "Products and services",
    },
    {
      href: "/core/notifications",
      label: "Notifications",
      icon: Sun,
      description: "System notifications & alerts",
    },
    {
      href: "/core/financial-statements",
      label: "Financial Statements",
      icon: FileText,
      description: "Financial statements and filings",
    },
    {
      href: "/core/board-members",
      label: "Board Members",
      icon: Users,
      description: "Board and governance",
    },
    {
      href: "/core/client-asset-mixes",
      label: "Client Asset Mixes",
      icon: Layers,
      description: "Allocation mix per SMI",
    },
    {
      href: "/core/clientele-profiles",
      label: "Clientele Profiles",
      icon: Database,
      description: "Clientele classification & details",
    },
    {
      href: "/core/audit-logs",
      label: "Audit Logs",
      icon: Activity,
      description: "System audit logs & trails",
    },
    {
      href: "/core/supervisory-interventions",
      label: "Interventions",
      icon: Clipboard,
      description: "Interventions & actions",
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="sticky top-6 space-y-4">
      <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-6 text-amber-900">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Core</h2>
            <p className="text-xs text-amber-900/80">Administration</p>
          </div>
        </div>
      </div>

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
                        ? "bg-amber-500 text-amber-50 shadow-md"
                        : "hover:bg-amber-50 text-amber-900"
                    )}
                  >
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-500 rounded-r-full" />
                    )}
                    <div
                      className={cn(
                        "flex-shrink-0 p-1.5 rounded-md transition-colors",
                        active ? "bg-amber-50" : "bg-amber-100"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          active ? "text-amber-600" : "text-amber-700"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-medium text-sm truncate",
                            active ? "text-amber-50" : "text-amber-900"
                          )}
                        >
                          {item.label}
                        </span>
                      </div>
                      {item.description && (
                        <p
                          className={cn(
                            "text-xs mt-0.5 truncate",
                            active
                              ? "text-amber-50/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </Card>
    </div>
  );
}
