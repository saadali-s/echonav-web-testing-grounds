import {
  HardwareHealthChart,
  HardwareHealthData,
} from "@/components/dashboard/HardwareHealthChart";
import {
  FloorPlan,
  RecentMapsCarousel,
} from "@/components/dashboard/RecentMapsCarousel";
import { RoutingActivityChart } from "@/components/dashboard/RoutingActivityChart";
import { DashboardStats, StatCards } from "@/components/dashboard/StatCards";
import {
  SystemEvent,
  SystemEventsFeed,
} from "@/components/dashboard/SystemEventsFeed";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import Link from "next/link";

interface DashboardComposerProps {
  userName: string;
  stats: DashboardStats;
  recentPlans: FloorPlan[];
  healthData: HardwareHealthData;
  systemEvents: SystemEvent[];
}

export function DashboardComposer({
  userName,
  stats,
  recentPlans,
  healthData,
  systemEvents,
}: DashboardComposerProps) {
  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
            Welcome Back, {userName}
          </h1>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">
            Monitoring live health metrics for APK Campus.
          </p>
        </div>

        {/* Generate PIN Button */}
        <Button
          asChild
          className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0"
        >
          <Link href="/user-management">
            <KeyRound className="w-5 h-5 mr-2" />
            Invite A New User
          </Link>
        </Button>
      </div>

      {/* The 75% / 25% Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pb-8">
        {/* --- LEFT COLUMN (75%) --- */}
        <div className="xl:col-span-3 flex flex-col gap-6 min-w-0">
          <StatCards stats={stats} />

          <div className="h-100">
            <RoutingActivityChart />
          </div>

          <div>
            <RecentMapsCarousel plans={recentPlans} />
          </div>
        </div>

        {/* --- RIGHT COLUMN (25%) --- */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <HardwareHealthChart healthData={healthData} />

          <div className="flex-1 min-h-100">
            <SystemEventsFeed events={systemEvents} />
          </div>
        </div>
      </div>
    </div>
  );
}
