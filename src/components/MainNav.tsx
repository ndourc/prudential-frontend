"use client";
import React from "react";
import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Layers,
  Link2,
  Building2,
  Shield,
  FileCheck2,
  FileSpreadsheet,
  FolderSearch,
  Bitcoin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const items = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/core", label: "Core", icon: Layers, theme: "amber" },
  { href: "/licensing", label: "Licensing", icon: Link2, theme: "blue" },
  { href: "/risk-assessment", label: "Risk", icon: Shield, theme: "red" },
  {
    href: "/compliance",
    label: "Compliance",
    icon: FileCheck2,
    theme: "green",
  },
  {
    href: "/returns",
    label: "Returns",
    icon: FileSpreadsheet,
    theme: "purple",
  },
  {
    href: "/case-management",
    label: "Cases",
    icon: FolderSearch,
    theme: "orange",
  },
  { href: "/va-vasp", label: "VA/VASP", icon: Bitcoin, theme: "cyan" },
  { href: "/admin/users", label: "Users", icon: Building2, theme: "slate" },
];

export default function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<{
    username?: string;
    role?: string;
  } | null>(null);

  React.useEffect(() => {
    // Basic check for auth token on mount
    const token = localStorage.getItem("token");
    if (token) {
      // In a real app, you might decode the token or fetch user details
      const role = localStorage.getItem("userRole") || "User";
      setUser({ username: "Admin", role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <NextImage
                src="/seczim.svg"
                alt="Seczim Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
             
            </Link>
            <nav
              aria-label="Main Navigation"
              className="hidden md:flex md:space-x-2"
            >
              {items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(item.href));

                let activeClasses =
                  "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400";

                if (item.theme === "amber") {
                  activeClasses =
                    "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400";
                } else if (item.theme === "blue") {
                  activeClasses =
                    "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
                } else if (item.theme === "red") {
                  activeClasses =
                    "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
                } else if (item.theme === "green") {
                  activeClasses =
                    "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400";
                } else if (item.theme === "purple") {
                  activeClasses =
                    "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400";
                } else if (item.theme === "orange") {
                  activeClasses =
                    "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400";
                } else if (item.theme === "cyan") {
                  activeClasses =
                    "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400";
                } else if (item.theme === "slate") {
                  activeClasses =
                    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition",
                      active
                        ? activeClasses
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt={user.username} />
                      <AvatarFallback>
                        {user.username?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="text-sm text-slate-600 dark:text-slate-300 hover:underline"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
