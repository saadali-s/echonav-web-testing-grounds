import { HardwareHealthChart } from '@/components/dashboard/HardwareHealthChart';
import { FloorPlan, RecentMapsCarousel } from '@/components/dashboard/RecentMapsCarousel';
import { RoutingActivityChart } from '@/components/dashboard/RoutingActivityChart';
import { DashboardStats, StatCards } from '@/components/dashboard/StatCards';
import { SystemEvent, SystemEventsFeed } from '@/components/dashboard/SystemEventsFeed';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';
import Link from 'next/link';

// --- Mock Data ---
const mockStats: DashboardStats = { mappedBuildings: { count: 4, subtext: '+1 added this month' }, activeBeacons: { count: 142, subtext: '98.5% online' }, pendingTasks: { count: 12, subtext: 'Requiring field calibration' }};
const mockEvents: SystemEvent[] = [{ id: 'evt-1', type: 'HAZARD', title: 'Wet Floor Hazard Flagged', description: 'Science Block - Level 2 (Node C4) was marked as an inactive hazard by Admin. Rerouting active.', timeAgo: '12 mins ago' }, { id: 'evt-2', type: 'CALIBRATION', title: 'Hardware Calibrated', description: 'Technician Sarah verified beacon UUID-8X92 at Library Entrance.', timeAgo: '1 hour ago' }];
const mockRecentPlans: FloorPlan[] = [{ id: 'map-1', name: 'Science Block - Floor 2', building: 'APK Campus', updatedAt: '2 hours ago' }, { id: 'map-2', name: 'Library - Ground Floor', building: 'APK Campus', updatedAt: 'Yesterday' }];
// -----------------

export function DashboardComposer() {
  return (
    <div className="flex flex-col min-h-full">
      
      {/* THE FIX: 
          -top-6 md:-top-8 forces the sticky anchor to ignore the parent's padding and hit the roof.
          -mt-6 md:-mt-8 and -mx-6 md:-mx-8 pull the element physically into the padding space.
          pt-6 md:pt-8 restores the top breathing room inside the header. 
      */}
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">Welcome Back,</h1>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">Monitoring live health metrics for APK Campus.</p>
        </div>

        {/* Generate PIN Button */}
        <Button asChild className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0">
          <Link href="/accessibility">
            <KeyRound className="w-5 h-5 mr-2" />
            GENERATE STUDENT PIN
          </Link>
        </Button>
      </div>

      {/* The 75% / 25% Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 pb-8">
        
        {/* --- LEFT COLUMN (75%) --- */}
        <div className="xl:col-span-3 flex flex-col gap-6 min-w-0">
          <StatCards stats={mockStats} />
          
          <div className="h-[400px]">
            <RoutingActivityChart />
          </div>
          
          <div>
            <RecentMapsCarousel plans={mockRecentPlans} />
          </div>
        </div>

        {/* --- RIGHT COLUMN (25%) --- */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <HardwareHealthChart />
          
          <div className="flex-1 min-h-[400px]">
            <SystemEventsFeed events={mockEvents} />
          </div>
        </div>
        
      </div>
    </div>
  );
}