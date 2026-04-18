import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ClipboardList, RadioTower } from "lucide-react";

export interface DashboardStats {
  mappedBuildings: { count: number; subtext: string };
  activeBeacons: { count: number; subtext: string };
  pendingTasks: { count: number; subtext: string };
}

const textureStyle = {
  backgroundImage:
    "repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent 8px)",
};

export function StatCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Card 1: Mapped Buildings (Indigo Pastel) */}
      <Card className="relative overflow-hidden rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950">
        <div
          className="absolute inset-0 opacity-[0.03] text-zinc-950 dark:text-white pointer-events-none"
          style={textureStyle}
        />
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-zinc-950 dark:border-zinc-800 bg-indigo-300 dark:bg-indigo-900 rounded-t-lg px-5 py-3">
          <CardTitle className="text-[11px] font-black uppercase tracking-wider text-indigo-1050 dark:text-indigo-100">
            Mapped Buildings
          </CardTitle>
          <Building2 className="h-4 w-4 text-indigo-950 dark:text-indigo-100" />
        </CardHeader>
        <CardContent className="relative z-10 pt-5 px-5 pb-5">
          <div className="text-3xl font-black text-zinc-950 dark:text-zinc-100">
            {stats.mappedBuildings.count}
          </div>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            {stats.mappedBuildings.subtext}
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Active Beacons (Emerald Pastel) */}
      <Card className="relative overflow-hidden rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950">
        <div
          className="absolute inset-0 opacity-[0.03] text-zinc-950 dark:text-white pointer-events-none"
          style={textureStyle}
        />
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-zinc-950 dark:border-zinc-800 bg-emerald-300 dark:bg-emerald-900 rounded-t-lg px-5 py-3">
          <CardTitle className="text-[11px] font-black uppercase tracking-wider text-emerald-1050 dark:text-emerald-100">
            Active Beacons
          </CardTitle>
          <RadioTower className="h-4 w-4 text-emerald-950 dark:text-emerald-100" />
        </CardHeader>
        <CardContent className="relative z-10 pt-5 px-5 pb-5">
          <div className="text-3xl font-black text-zinc-950 dark:text-zinc-100">
            {stats.activeBeacons.count}
          </div>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            {stats.activeBeacons.subtext}
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Pending Tasks (Amber Pastel) */}
      <Card className="relative overflow-hidden rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950">
        <div
          className="absolute inset-0 opacity-[0.03] text-zinc-950 dark:text-white pointer-events-none"
          style={textureStyle}
        />
        <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2 border-b-2 border-zinc-950 dark:border-zinc-800 bg-amber-300 dark:bg-amber-900 rounded-t-lg px-5 py-3">
          <CardTitle className="text-[11px] font-black uppercase tracking-wider text-amber-1050 dark:text-amber-100">
            Pending Tasks
          </CardTitle>
          <ClipboardList className="h-4 w-4 text-amber-950 dark:text-amber-100" />
        </CardHeader>
        <CardContent className="relative z-10 pt-5 px-5 pb-5">
          <div className="text-3xl font-black text-zinc-950 dark:text-zinc-100">
            {stats.pendingTasks.count}
          </div>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            {stats.pendingTasks.subtext}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
