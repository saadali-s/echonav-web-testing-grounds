"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Info, TriangleAlert } from "lucide-react";
import { useState } from "react";

// Mock data for UI review
const mockNotifications = [
  {
    id: "1",
    type: "error",
    title: "Hardware Failure",
    message: "Beacon UUID-8X92 has gone offline.",
  },
  {
    id: "2",
    type: "warning",
    title: "Calibration Pending",
    message: "Task assigned to Michael Chen is overdue.",
  },
  {
    id: "3",
    type: "info",
    title: "New Map Vectorized",
    message: "Science Block Floor 2 is ready.",
  },
];

export function NotificationBell() {
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const notifications = mockNotifications;

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return (
          <TriangleAlert className="h-5 w-5 text-amber-600 dark:text-amber-500" />
        );
      case "error":
        return (
          <TriangleAlert className="h-5 w-5 text-red-600 dark:text-red-500" />
        );
      default:
        return (
          <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        );
    }
  };

  const notificationList = (
    <div className="flex flex-col max-h-[60vh] overflow-y-auto bg-white dark:bg-zinc-950">
      {notifications.length === 0 ? (
        <div className="p-8 text-center space-y-2">
          <Bell className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm font-bold text-zinc-500">
            You&apos;re all caught up!
          </p>
        </div>
      ) : (
        notifications.map((notification, index) => {
          const isLast = index === notifications.length - 1;
          return (
            <div
              key={notification.id}
              className={`p-4 flex gap-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50 ${!isLast ? "border-b-2 border-zinc-100 dark:border-zinc-800" : ""}`}
            >
              <div
                className={`mt-0.5 w-8 h-8 shrink-0 rounded-lg border-2 flex items-center justify-center ${notification.type === "error" ? "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900" : notification.type === "warning" ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900" : "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900"}`}
              >
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <p className="text-sm font-black text-zinc-950 dark:text-zinc-100 truncate">
                  {notification.title}
                </p>
                <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                  {notification.message}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  // THE FIX: Changed to rounded-xl for a softer box, removed the outer span wrapper
  const triggerButton = (
    <Button
      variant="ghost"
      size="icon"
      className="relative h-10 w-10 rounded-xl border-2 border-zinc-950 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-950 dark:text-white transition-all dark:shadow-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shrink-0"
    >
      <Bell className="h-5 w-5" />

      {notifications.length > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white border-2 border-white dark:border-zinc-950 shadow-sm">
            {notifications.length}
          </span>
        </span>
      )}
    </Button>
  );

  return (
    <>
      {/* --- DESKTOP VIEW (Popover) --- */}
      <div className="hidden md:block">
        <Popover open={isDesktopOpen} onOpenChange={setIsDesktopOpen}>
          <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
          {/* THE FIX: Changed to rounded-2xl for maximum softness on the tray */}
          <PopoverContent
            className="w-80 p-0 rounded-2xl border-2 border-zinc-950 dark:border-zinc-800 dark:shadow-none overflow-hidden mt-2"
            align="end"
          >
            <div className="px-4 py-3 font-black uppercase tracking-wider text-sm border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100">
              Notifications
            </div>
            {notificationList}
          </PopoverContent>
        </Popover>
      </div>

      {/* --- MOBILE VIEW (Dialog) --- */}
      <div className="md:hidden">
        <Dialog open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <DialogTrigger asChild>{triggerButton}</DialogTrigger>
          <DialogContent className="w-[90%] rounded-2xl p-0 gap-0 overflow-hidden border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950">
            <DialogHeader className="px-4 py-4 border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-left">
              <DialogTitle className="font-black uppercase tracking-wider text-sm text-zinc-950 dark:text-zinc-100">
                Notifications
              </DialogTitle>
            </DialogHeader>
            {notificationList}
            <div className="p-3 border-t-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <Button
                variant="ghost"
                className="w-full font-bold text-zinc-950 dark:text-zinc-100 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 dark:shadow-none hover:bg-zinc-100 rounded-xl"
                onClick={() => setIsMobileOpen(false)}
              >
                Close Menu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
