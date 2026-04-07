"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/components/layout/auth-provider";
import { useIsMobile } from "@/hooks/use-mobile";

// Restored components from the dashboard header
import { NotificationBell } from "../../components/layout/NotificationBell";
import { UserAccountNav } from "./UserAccountNav";

export function Header() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-white/10 bg-transparent backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* =========================================
            LOGGED IN VIEW (Dashboard Style)
            ========================================= */}
        {isLoggedIn ? (
          <>
            {/* LEFT: Mobile Trigger + Logo Link */}
            <div className="flex items-center gap-4">
              {isMobile && <SidebarTrigger className="md:hidden" />}
              
              {/* Logo - Same as logged out view */}
              <Link href="/" className="flex items-center" onClick={closeMenu}>
                <Image
                  src="EchonavLogo.svg"
                  alt="EchoNav Logo"
                  width={30}
                  height={20}
                  className="mr-2 dark:invert"
                />
                <span className="text-xl font-bold tracking-tight">EchoNav</span>
              </Link>
            </div>

            {/* RIGHT: Notifications, Theme, User Profile */}
            <div className="flex items-center gap-3 sm:gap-5">
              <NotificationBell />
              <ModeToggle />
              {/* Separator Line */}
              <div className="h-6 w-[2px] bg-border mx-1 hidden sm:block"></div>
              <UserAccountNav />
            </div>
          </>
        ) : (
          /* =========================================
             LOGGED OUT VIEW (Landing Page Style)
             ========================================= */
          <>
            {/* LEFT: Logo + Desktop Nav */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link href="/" className="flex items-center" onClick={closeMenu}>
                <Image
                  src="EchonavLogo.svg"
                  alt="EchoNav Logo"
                  width={30}
                  height={20}
                  className="mr-2 dark:invert"
                />
                <span className="text-xl font-bold tracking-tight">EchoNav</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {["Services", "Solutions", "About", "Contact"].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>

            {/* RIGHT: Actions */}
            <div className="flex items-center gap-3">
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Link href="/auth?tab=login">
                  <Button variant="outline">Log in</Button>
                </Link>
                <Link href="/auth?tab=signup">
                  <Button>Sign up</Button>
                </Link>
              </div>

              {/* Theme Toggle */}
              <ModeToggle />

              {/* Mobile Menu Toggle */}
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-accent transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* =========================================
          MOBILE DROPDOWN MENU (Logged out only)
          ========================================= */}
      {isMobileMenuOpen && isMobile && !isLoggedIn && (
        <div className="md:hidden border-t bg-background px-6 py-6 shadow-lg">
          <div className="flex flex-col space-y-5">
            <nav className="flex flex-col items-center gap-4">
              {["Services", "Solutions", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  onClick={closeMenu}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link href="/auth?tab=login" onClick={closeMenu}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link href="/auth?tab=signup" onClick={closeMenu}>
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}