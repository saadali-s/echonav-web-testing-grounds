import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ClipboardList, RadioTower } from 'lucide-react';

export interface DashboardStats {
  mappedBuildings: { count: number; subtext: string };
  activeBeacons: { count: number; subtext: string };
  pendingTasks: { count: number; subtext: string };
}

export function StatCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card className="rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-t-xl">
          <CardTitle className="text-[11px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Mapped Buildings</CardTitle>
          <Building2 className="h-4 w-4 text-zinc-950 dark:text-zinc-100" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-black">{stats.mappedBuildings.count}</div>
          <p className="text-xs font-bold text-zinc-500 mt-1">{stats.mappedBuildings.subtext}</p>
        </CardContent>
      </Card>
      
      <Card className="rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-t-xl">
          <CardTitle className="text-[11px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Active Beacons</CardTitle>
          <RadioTower className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-black">{stats.activeBeacons.count}</div>
          <p className="text-xs font-bold text-zinc-500 mt-1">{stats.activeBeacons.subtext}</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-t-xl">
          <CardTitle className="text-[11px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Pending Tasks</CardTitle>
          <ClipboardList className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-3xl font-black">{stats.pendingTasks.count}</div>
          <p className="text-xs font-bold text-zinc-500 mt-1">{stats.pendingTasks.subtext}</p>
        </CardContent>
      </Card>
    </div>
  );
}