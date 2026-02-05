"use client";
import React from "react";
import { usePathname } from "next/navigation";
import LicensingNav from "@/components/licensing/LicensingNav";
import CoreNav from "./core/CoreNav";
import RiskNav from "./risk-assessment/RiskNav";

import ComplianceNav from "@/components/compliance/ComplianceNav";
import ReturnsNav from "@/components/returns/ReturnsNav";
import CaseManagementNav from "@/components/case-management/CaseManagementNav";
import VAVASPNav from "@/components/va-vasp/VAVASPNav";

export default function SectionSidebar() {
  const pathname = usePathname();

  if (!pathname) return null;

  if (pathname.startsWith("/core")) {
    return (
      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <CoreNav />
      </aside>
    );
  }

  if (pathname.startsWith("/licensing")) {
    return (
      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <LicensingNav />
      </aside>
    );
  }

  if (pathname.startsWith("/risk-assessment")) {
    return (
      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <RiskNav />
      </aside>
    );
  }

  if (pathname.startsWith("/compliance")) {
    return (
      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <ComplianceNav />
      </aside>
    );
  }

  if (pathname.startsWith("/returns")) {
    return (
      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <ReturnsNav />
      </aside>
    );
  }

  if (pathname.startsWith("/case-management")) {
    return (
      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <CaseManagementNav />
      </aside>
    );
  }

  if (pathname.startsWith("/va-vasp")) {
    return (
      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <VAVASPNav />
      </aside>
    );
  }

  // No sidebar for other pages (dashboard, company, etc.)
  return null;
}
