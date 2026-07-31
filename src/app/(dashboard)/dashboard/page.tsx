"use client";

import { DashboardComposer } from '@/components/dashboard/DashboardComposer';
import { useAuth } from '@/components/layout/auth-provider';
import { useGetDashboard } from '@/hooks/api/useDashboard';

export default function DashboardPage() {
  const { activeOrgId } = useAuth();
  const orgIdNum = activeOrgId ? Number(activeOrgId) : undefined;
  
  const { data: dashboardData, isLoading, isError } = useGetDashboard(orgIdNum);

  if (isLoading || !dashboardData) {
    return (
      <div className="flex h-full items-center justify-center animate-pulse text-zinc-500 font-bold uppercase tracking-widest text-sm">
        Fetching Live Telemetry...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center text-red-500 font-bold uppercase tracking-widest text-sm">
        Failed to load telemetry data.
      </div>
    );
  }

  return (
    <DashboardComposer 
      userName={dashboardData.userName}
      stats={dashboardData.stats}
      recentPlans={dashboardData.recentPlans.map(rp => ({ ...rp, id: String(rp.id) }))}
      healthData={dashboardData.healthData}
      systemEvents={dashboardData.systemEvents.map(evt => ({ ...evt, id: String(evt.id) }))}
      routingActivity={dashboardData.routingActivity}
    />
  );
}