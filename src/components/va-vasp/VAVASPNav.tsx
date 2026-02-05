"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bitcoin, Coins, Briefcase, Shield, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    { href: "/va-vasp", label: "Dashboard", icon: Bitcoin },
    { href: "/va-vasp/virtual-assets", label: "Virtual Assets", icon: Coins },
    { href: "/va-vasp/vasp-services", label: "VASP Services", icon: Briefcase },
    { href: "/va-vasp/risk-assessments", label: "Risk Assessments", icon: Shield },
    { href: "/va-vasp/compliance", label: "Compliance", icon: FileCheck },
];

export default function VAVASPNav() {
    const pathname = usePathname();

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-3 px-2">
                VA/VASP Module
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
                                    ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300"
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
