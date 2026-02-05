import React from "react";
import {
  Users,
  Building2,
  Link2,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function LicensingHome() {
  const modules = [
    {
      title: "Licensed SMIs",
      description: "View and manage licensed market intermediaries",
      icon: CheckCircle2,
      href: "/licensing/smis",
      color: "bg-emerald-50 dark:bg-emerald-950",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      count: "142",
    },
    {
      title: "Directors",
      description: "Manage company directors and their credentials",
      icon: Users,
      href: "/licensing/directors",
      color: "bg-blue-50 dark:bg-blue-950",
      iconColor: "text-blue-600 dark:text-blue-400",
      count: "24",
    },
    {
      title: "Institutional Profiles",
      description: "Manage institution-level data and configurations",
      icon: Building2,
      href: "/licensing/institutional-profiles",
      color: "bg-purple-50 dark:bg-purple-950",
      iconColor: "text-purple-600 dark:text-purple-400",
      count: "12",
    },
    {
      title: "Shareholders",
      description: "Manage major shareholders and beneficial owners",
      icon: Users,
      href: "/licensing/shareholders",
      color: "bg-amber-50 dark:bg-amber-950",
      iconColor: "text-amber-600 dark:text-amber-400",
      count: "18",
    },
    {
      title: "Licensing History",
      description: "Track license renewals and status changes",
      icon: Clock,
      href: "/licensing/license-history",
      color: "bg-orange-50 dark:bg-orange-950",
      iconColor: "text-orange-600 dark:text-orange-400",
      count: "340",
    },
    {
      title: "Portal Integrations",
      description: "Sync and manage external portal SMI data",
      icon: Link2,
      href: "/licensing/portal-integration",
      color: "bg-cyan-50 dark:bg-cyan-950",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      count: "8",
    },
    {
      title: "Portal SMI Data",
      description: "View raw data synced from external portals",
      icon: Link2,
      href: "/licensing/portal-smi-data",
      color: "bg-slate-50 dark:bg-slate-950",
      iconColor: "text-slate-600 dark:text-slate-400",
      count: "156",
    },
  ];

  const stats = [
    {
      label: "Active Licenses",
      value: "142",
      change: "+12%",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      label: "Pending Reviews",
      value: "8",
      change: "-3",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
    {
      label: "This Month",
      value: "37",
      change: "+24%",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Licensing Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your licensing operations and integrations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`text-sm font-medium mt-1 ${stat.color}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <a key={module.title} href={module.href} className="group block">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-5 h-full border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`w-6 h-6 ${module.iconColor}`} />
                    </div>
                    <span className="text-2xl font-bold text-slate-300 dark:text-slate-700">
                      {module.count}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {module.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {module.description}
                  </p>

                  <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all duration-300">
                    Open module
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {[
            {
              action: "New director added",
              time: "2 hours ago",
              user: "John Smith",
            },
            {
              action: "License renewed",
              time: "5 hours ago",
              user: "Acme Corp",
            },
            {
              action: "Portal sync completed",
              time: "1 day ago",
              user: "System",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activity.user}
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
