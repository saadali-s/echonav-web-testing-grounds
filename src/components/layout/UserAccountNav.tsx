"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/auth-provider";

export function UserAccountNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const displayName = user?.user_metadata?.display_name || "Admin";
  const userEmail = user?.email;

  // Extract initials for the avatar fallback
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Brutalist Avatar Button */}
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-lg border-2 border-zinc-950 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all overflow-hidden shrink-0 p-0 shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] dark:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Avatar className="h-full w-full rounded-none">
            <AvatarImage src="" alt={displayName} />
            <AvatarFallback className="bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-black text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* Brutalist Dropdown Content */}
      <DropdownMenuContent
        className="w-64 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none p-2 bg-white dark:bg-zinc-950"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-black uppercase tracking-wider leading-none text-zinc-950 dark:text-zinc-100">
              {displayName}
            </p>
            <p className="text-xs font-bold leading-none text-zinc-500">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800 my-1" />

        <DropdownMenuItem
          asChild
          className="cursor-pointer font-bold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800 p-3 transition-colors"
        >
          <Link href="/settings">
            <Settings className="mr-3 h-4 w-4 text-zinc-500" />
            <span>System Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer font-bold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800 p-3 transition-colors"
        >
          <Link href="#">
            <User className="mr-3 h-4 w-4 text-zinc-500" />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800 my-1" />

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:text-red-500 dark:focus:bg-red-950/30 cursor-pointer font-bold rounded-lg p-3 transition-colors"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
