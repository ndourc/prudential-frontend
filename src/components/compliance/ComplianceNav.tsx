"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileCheck2, ClipboardList, FileText, AlertTriangle, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    { href: "/compliance", label: "Dashboard", icon: FileCheck2 },
    { href: "/compliance/compliance-index", label: "Compliance Index", icon: FileBarChart },
    { href: "/compliance/assessments", label: "Assessments", icon: ClipboardList },
    { href: "/compliance/requirements", label: "Requirements", icon: FileText },
    { href: "/compliance/violations", label: "Violations", icon: AlertTriangle },
    { href: "/compliance/reports", label: "Reports", icon: FileCheck2 },
];

export default function ComplianceNav() {
    const pathname = usePathname();

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 px-2">
                Compliance Module
            </h3>
            <nav className="space-y-1">
                {items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition",
                                active
                                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
