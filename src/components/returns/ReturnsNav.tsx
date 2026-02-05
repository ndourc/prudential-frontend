"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileSpreadsheet, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    { href: "/returns", label: "Dashboard", icon: FileSpreadsheet },
    { href: "/returns/prudential-returns", label: "Prudential Returns", icon: FileText },
    { href: "/returns/income-statements", label: "Income Statements", icon: BarChart3 },
    { href: "/returns/balance-sheets", label: "Balance Sheets", icon: FileSpreadsheet },
];

export default function ReturnsNav() {
    const pathname = usePathname();

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3 px-2">
                Returns Module
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
                                    ? "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
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
