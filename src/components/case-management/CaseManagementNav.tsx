"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderSearch, FileText, Search, Calendar, Paperclip, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
    { href: "/case-management", label: "Dashboard", icon: FolderSearch },
    { href: "/case-management/cases", label: "Cases", icon: FileText },
    { href: "/case-management/case-notes", label: "Case Notes", icon: FileText },
    { href: "/case-management/investigations", label: "Investigations", icon: Search },
    { href: "/case-management/ad-hoc-inspections", label: "Ad-hoc Inspections", icon: Calendar },
    { href: "/case-management/attachments", label: "Attachments", icon: Paperclip },
    { href: "/case-management/timeline", label: "Timeline", icon: Clock },
];

export default function CaseManagementNav() {
    const pathname = usePathname();

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-3 px-2">
                Case Management
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
                                    ? "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300"
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
