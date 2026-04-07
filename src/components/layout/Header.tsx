'use client';

import { usePathname } from 'next/navigation';
import { NotificationBell } from '../../components/layout/NotificationBell';
import { UserAccountNav } from './UserAccountNav';

export function Header() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentPage = pathSegments.length > 0 
    ? pathSegments[0].replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
    : 'Dashboard';

  return (
    <header className="h-16 bg-white dark:bg-zinc-950 border-b-2 border-zinc-950 dark:border-zinc-800 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
      
      {/* Brutalist Breadcrumbs */}
      <div className="flex items-center text-sm font-black uppercase tracking-widest">
        <span className="text-zinc-400 hidden md:inline">EchoNav</span>
        <span className="mx-2 text-zinc-300 dark:text-zinc-700 hidden md:inline">/</span>
        <span className="text-zinc-950 dark:text-zinc-100">{currentPage}</span>
      </div>

      <div className="flex items-center gap-5">
        
        {/* Restored Notification Bell Component */}
        <NotificationBell />

        {/* Separator Line */}
        <div className="h-8 w-[2px] bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block"></div>

        {/* User Dropdown Component */}
        <UserAccountNav />
        
      </div>
    </header>
  );
}