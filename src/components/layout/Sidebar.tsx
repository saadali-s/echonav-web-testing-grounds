"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Map,
  RadioTower,
  Settings,
  ShieldAlert,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/map-studio', label: 'Map Studio', icon: Map },
  { href: '/fleet', label: 'Fleet Management', icon: RadioTower },
  { href: '/staff', label: 'Staff Management', icon: Users },
  { href: '/accessibility', label: 'Accessibility Desk', icon: ShieldAlert },
];

export function Sidebar() {
  const pathname = usePathname();
  const [manualCollapsed, setManualCollapsed] = useState(false);

  const isAutoCollapsed = /\/map-studio\/[a-zA-Z0-9_-]+/.test(pathname);
  const isCollapsed = manualCollapsed || isAutoCollapsed;

  return (
    <div
      className={cn(
        'relative flex flex-col h-screen transition-all duration-300 ease-in-out shrink-0 bg-white dark:bg-zinc-950 border-r-2 border-zinc-950 dark:border-zinc-800',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => setManualCollapsed((prev) => !prev)}
        className="absolute -right-4 top-5 h-8 w-8 rounded-lg border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-900 z-50 hover:bg-zinc-100 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      <div className="h-16 flex items-center gap-2 px-4 border-b-2 border-zinc-950 dark:border-zinc-800 shrink-0 overflow-hidden">
        <Image
          src="/EchonavLogo.svg"
          alt="EchoNav Logo"
          width={40}
          height={40}
          className="block"
          priority
        />

        {!isCollapsed && (
          <span className="text-zinc-950 dark:text-zinc-100 font-black text-lg tracking-widest uppercase leading-none">
            EchoNav
          </span>
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        {navLinks.map((link) => {
          const isActive =
            link.href === '/map-studio'
              ? pathname === '/map-studio'
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              title={isCollapsed ? link.label : undefined}
              className={cn(
                'flex items-center px-3 h-11 text-sm font-bold transition-all border-2 rounded-lg',
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] dark:shadow-none translate-y-[-2px] translate-x-[-2px] dark:translate-y-0 dark:translate-x-0'
                  : 'border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 dark:text-zinc-400 dark:hover:text-zinc-100'
              )}
            >
              <link.icon
                className={cn(
                  'w-5 h-5 shrink-0',
                  isActive ? 'text-zinc-950 dark:text-white' : ''
                )}
              />
              {!isCollapsed && <span className="ml-3 truncate">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t-2 border-zinc-950 dark:border-zinc-800 overflow-hidden shrink-0 flex justify-center bg-zinc-50/50 dark:bg-zinc-900/50">
        {!isCollapsed ? (
          <Link
            href="/settings"
            className="w-full flex items-center justify-center px-3 h-10 border-2 border-transparent hover:border-zinc-950 dark:hover:border-zinc-700 rounded-lg text-sm font-bold text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-all hover:shadow-[3px_3px_0px_0px_rgba(24,24,27,1)] dark:hover:shadow-none hover:translate-y-[-2px] hover:translate-x-[-2px] hover:bg-white dark:hover:bg-zinc-950"
          >
            <Settings className="w-4 h-4 mr-3" />  Settings
          </Link>
        ) : (
          <Link
            href="/settings"
            title="System Settings"
            className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-zinc-800 border-2 border-transparent hover:border-zinc-950 dark:hover:border-zinc-700 transition-all hover:shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none"
          >
            <Settings className="w-5 h-5 text-zinc-500 hover:text-zinc-950 dark:hover:text-white" />
          </Link>
        )}
      </div>
    </div>
  );
}