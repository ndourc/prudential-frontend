"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  Building2,
  History,
  Link2,
  Database,
  UsersRound,
  Shield,
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

export default function LicensingNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: "/licensing/directors",
      label: "Directors",
      icon: Users,
      description: "Manage company directors",
    },
    {
      href: "/licensing/institutional-profiles",
      label: "Institutional Profiles",
      icon: Building2,
      description: "Institution-level data",
    },
    {
      href: "/licensing/shareholders",
      label: "Shareholders",
      icon: UsersRound,
      description: "Shareholder management",
    },
    {
      href: "/licensing/license-history",
      label: "License History",
      icon: History,
      description: "Track license changes",
    },
    {
      href: "/licensing/portal-integration",
      label: "Portal Integration",
      icon: Link2,
      description: "External portal sync",
      badge: "Beta",
    },
    {
      href: "/licensing/portal-smi-data",
      label: "Portal SMI Data",
      icon: Database,
      description: "SMI data management",
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="sticky top-6 space-y-4">
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 p-6 text-primary-foreground">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Licensing</h2>
            <p className="text-xs text-primary-foreground/80">
              Management Portal
            </p>
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
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "hover:bg-accent text-foreground"
                    )}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-r-full" />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 p-1.5 rounded-md transition-colors",
                        active
                          ? "bg-primary-foreground/20"
                          : "bg-primary/10 group-hover:bg-primary/20"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          active ? "text-primary-foreground" : "text-primary"
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-medium text-sm truncate",
                            active ? "text-primary-foreground" : ""
                          )}
                        >
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-medium",
                              active
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : "bg-primary/10 text-primary"
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
                            active
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
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

      {/* Footer Info Card */}
      <Card className="p-4 bg-muted/50">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Active Licenses</span>
            <span className="font-semibold">142</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Pending Reviews</span>
            <span className="font-semibold text-amber-600">8</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total Directors</span>
            <span className="font-semibold">24</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
