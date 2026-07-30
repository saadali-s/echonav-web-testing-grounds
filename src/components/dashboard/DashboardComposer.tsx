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
import { ActivityChartDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import Link from "next/link";

interface DashboardComposerProps {
  userName: string;
  stats: DashboardStats;
  recentPlans: FloorPlan[];
  healthData: HardwareHealthData;
  systemEvents: SystemEvent[];
  routingActivity: ActivityChartDto[];
}

export function DashboardComposer({
  userName,
  stats,
  recentPlans,
  healthData,
  systemEvents,
  routingActivity,
}: DashboardComposerProps) {
  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
            Welcome Back, {userName}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pb-8">
        <div className="xl:col-span-3 flex flex-col gap-6 min-w-0">
          <StatCards stats={stats} />

          <div className="h-100">
            <RoutingActivityChart data={routingActivity} />
          </div>

          <div>
            <RecentMapsCarousel plans={recentPlans} />
          </div>
        </div>

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
