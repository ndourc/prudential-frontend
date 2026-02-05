import React from "react";
import {
  Building2,
  PieChart,
  Bell,
  FileText,
  Clipboard,
  Users,
  ArrowRight,
  Activity,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export default function CoreHome() {
  const modules = [
    {
      title: "SMIs",
      description: "Manage supervised market intermediaries",
      href: "/core/smis",
      icon: Building2,
      color: "bg-amber-50 dark:bg-amber-950",
      iconColor: "text-amber-600 dark:text-amber-400",
      count: "87",
    },
    {
      title: "Notifications",
      description: "System notifications & alerts",
      href: "/core/notifications",
      icon: Bell,
      color: "bg-amber-50 dark:bg-amber-950",
      iconColor: "text-amber-600 dark:text-amber-400",
      count: "23",
    },
    {
      title: "Product Offerings",
      description: "Products and services",
      href: "/core/product-offerings",
      icon: PieChart,
      color: "bg-amber-50 dark:bg-amber-950",
      iconColor: "text-amber-600 dark:text-amber-400",
      count: "156",
    },
    {
      title: "Financial Statements",
      description: "Manage financial statements",
      href: "/core/financial-statements",
      icon: FileText,
      color: "bg-amber-50 dark:bg-amber-950",
      iconColor: "text-amber-600 dark:text-amber-400",
      count: "342",
    },
    {
      title: "Board Members",
      description: "Board members & meetings",
      href: "/core/board-members",
      icon: Users,
      color: "bg-amber-50 dark:bg-amber-950",
      iconColor: "text-amber-600 dark:text-amber-400",
      count: "64",
    },
    {
      title: "Supervisory Interventions",
      description: "Interventions & actions",
      href: "/core/supervisory-interventions",
      icon: Clipboard,
      color: "bg-amber-50 dark:bg-amber-950",
      iconColor: "text-amber-600 dark:text-amber-400",
      count: "5",
    },
  ];

  const stats = [
    {
      label: "Active SMIs",
      value: "87",
      change: "+5",
      icon: Activity,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
    {
      label: "Pending Actions",
      value: "12",
      change: "-3",
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
    {
      label: "This Quarter",
      value: "156",
      change: "+18%",
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Core Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Administrative interface for core resources
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
          Core Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <a key={module.title} href={module.href} className="group block">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 p-5 h-full border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600">
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

                  <div className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all duration-300">
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
              action: "New SMI registered",
              time: "1 hour ago",
              user: "System",
            },
            {
              action: "Financial statement submitted",
              time: "3 hours ago",
              user: "ABC Limited",
            },
            {
              action: "Board meeting scheduled",
              time: "5 hours ago",
              user: "John Doe",
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
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
