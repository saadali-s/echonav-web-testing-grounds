"use client";

import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  IdCard,
  LayoutDashboard,
  Map,
  RadioTower,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/map-studio", label: "Map Studio", icon: Map },
  { href: "/fleet", label: "Fleet Management", icon: RadioTower },
  { href: "/staff", label: "Staff Management", icon: IdCard },
  { href: "/user-management", label: "User Management", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const [manualCollapsed, setManualCollapsed] = useState(false);
  const { isLoggedIn } = useAuth();

  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/reset-password");

  if (!isLoggedIn || isPublicRoute) return null;

  const isAutoCollapsed = /\/map-studio\/[a-zA-Z0-9_-]+/.test(pathname);
  const isCollapsed = manualCollapsed || isAutoCollapsed;

  const isSettingsActive = pathname.startsWith("/settings");

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen transition-all duration-300 ease-in-out shrink-0 bg-background border-r border-chart-3",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "h-20 flex items-center border-b border-chart-3 shrink-0 overflow-hidden transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "justify-between px-6",
        )}
      >
        <div className="flex items-center gap-3">
          <div className="bg-black dark:bg-white p-1.5 rounded-lg shrink-0 flex items-center justify-center">
            <Image
              src="/EchoDash.svg"
              alt="EchoDash Logo"
              width={24}
              height={24}
              className="invert dark:invert-0"
              priority
            />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl tracking-tight whitespace-nowrap">
              EchoDash
            </span>
          )}
        </div>

        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-chart-3 mx-1" />
            <Button
              variant="default"
              size="icon"
              onClick={() => setManualCollapsed(true)}
              className="group h-8 w-8 rounded-lg transition-all duration-200 bg-primary text-primary-foreground hover:bg-chart-2 dark:hover:bg-chart-2"
            >
              <ChevronLeft className="h-4 w-4 transition-colors text-white dark:text-black group-hover:text-black dark:group-hover:text-black" />
            </Button>
          </div>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center py-4 border-b border-chart-3 shrink-0">
          <Button
            variant="default"
            size="icon"
            onClick={() => setManualCollapsed(false)}
            className="group h-8 w-8 rounded-lg transition-all duration-200 bg-primary text-primary-foreground hover:bg-chart-2 dark:hover:bg-chart-2"
          >
            <ChevronRight className="h-4 w-4 transition-colors text-white dark:text-black group-hover:text-white dark:group-hover:text-black" />
          </Button>
        </div>
      )}

      <nav
        className={cn(
          "flex-1 py-6 space-y-2 overflow-y-auto overflow-x-hidden transition-all duration-300",
          isCollapsed ? "px-2" : "px-4",
        )}
      >
        {navLinks.map((link) => {
          const isActive =
            link.href === "/map-studio"
              ? pathname === "/map-studio"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              title={isCollapsed ? link.label : undefined}
              className={cn(
                "group flex items-center rounded-xl transition-all duration-200 font-medium text-sm border",
                isCollapsed
                  ? "justify-center h-12 w-12 mx-auto gap-0"
                  : "gap-3 py-3 px-4",
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]"
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-primary hover:text-secondary hover:border-border/50",
              )}
            >
              <link.icon
                className={cn(
                  "w-4.5 h-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "" : "opacity-70 group-hover:opacity-100",
                )}
              />
              {!isCollapsed && <span className="truncate">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "border-t border-chart-3 bg-sidebar/50 shrink-0 transition-all duration-300",
          isCollapsed ? "p-2" : "p-4",
        )}
      >
        <Link
          href="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={cn(
            "group flex items-center rounded-xl transition-all duration-200 font-medium text-sm border",
            isCollapsed
              ? "justify-center h-12 w-12 mx-auto"
              : "gap-3 py-3 px-4 w-full",
            isSettingsActive
              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]"
              : "bg-transparent text-muted-foreground border-transparent hover:bg-primary hover:text-secondary hover:border-border/50",
          )}
        >
          <Settings
            size={18}
            className={cn(
              "shrink-0 transition-transform duration-200 group-hover:scale-110",
              isSettingsActive ? "" : "opacity-70 group-hover:opacity-100",
            )}
          />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </div>
    </div>
  );
}
