import { DashboardComposer } from '@/components/dashboard/DashboardComposer';
import { HardwareHealthData } from '@/components/dashboard/HardwareHealthChart';
import { SystemEvent } from '@/components/dashboard/SystemEventsFeed'; // Import this!
import { AuthService } from '@/lib/services/AuthService';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

function getTimeAgo(dateString: string) {
  const past = new Date(dateString);
  const diffMs = Date.now() - past.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
}

export default async function DashboardPage() {
  const profile = await AuthService.getCurrentProfile();
  if (!profile) redirect('/auth');

  const supabase = await createClient();

  // 1. Fetch Top Stat Cards
  const [
    { count: buildingCount },
    { count: activeBeacons },
    { count: pendingTasks }
  ] = await Promise.all([
    supabase.from('buildings').select('*', { count: 'exact', head: true }).eq('organization_id', profile.organization_id),
    supabase.from('beacons').select('*', { count: 'exact', head: true }).eq('organization_id', profile.organization_id).eq('status', 'BOUND'),
    supabase.from('deployment_tasks').select('*', { count: 'exact', head: true }).eq('organization_id', profile.organization_id).eq('status', 'TO_DO')
  ]);

  const realStats = {
    mappedBuildings: { count: buildingCount || 0, subtext: 'Campus facilities mapped' },
    activeBeacons: { count: activeBeacons || 0, subtext: 'Bound to graph nodes' },
    pendingTasks: { count: pendingTasks || 0, subtext: 'Awaiting field technician' }
  };

  // 2. Fetch Recent Maps
  const { data: recentMapsData } = await supabase
    .from('maps')
    .select(`
      id,
      name,
      updated_at,
      buildings ( name )
    `)
    .eq('organization_id', profile.organization_id)
    .order('updated_at', { ascending: false })
    .limit(5);

  const formattedPlans = (recentMapsData || []).map((map: any) => {
    const date = new Date(map.updated_at);
    const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    const buildingData = map.buildings;
    const buildingName = Array.isArray(buildingData) ? buildingData[0]?.name : buildingData?.name;

    return {
      id: map.id,
      name: map.name,
      building: buildingName || 'Unknown Building',
      updatedAt: formattedDate,
    };
  });

  // 3. Fetch Beacons and Calculate Hardware Health
  const { data: allBeacons } = await supabase
    .from('beacons')
    .select('id, hardware_uuid, battery_level')
    .eq('organization_id', profile.organization_id);

  const hardwareHealth: HardwareHealthData = {
    total: 0,
    healthyCount: 0,
    warningCount: 0,
    criticalCount: 0,
    criticalItems: []
  };

  if (allBeacons) {
    hardwareHealth.total = allBeacons.length;
    
    allBeacons.forEach(beacon => {
      const battery = beacon.battery_level ?? 100; 

      if (battery > 50) {
        hardwareHealth.healthyCount++;
      } else if (battery >= 15) {
        hardwareHealth.warningCount++;
      } else {
        hardwareHealth.criticalCount++;
        const shortUuid = beacon.hardware_uuid.split('-')[0] || beacon.hardware_uuid.substring(0, 8);
        hardwareHealth.criticalItems.push({
          id: beacon.id,
          label: `UUID-${shortUuid}`,
          battery: `${battery}%`
        });
      }
    });
  }

  // 4. Fetch the 10 most recent System Events!
  const { data: rawEvents } = await supabase
    .from('system_events')
    .select('*')
    .eq('organization_id', profile.organization_id)
    .order('created_at', { ascending: false })
    .limit(10);

  // Format them so the UI knows exactly how to render them
  const formattedEvents: SystemEvent[] = (rawEvents || []).map(event => ({
    id: event.id,
    type: event.type as SystemEvent['type'],
    title: event.title,
    description: event.description,
    timeAgo: getTimeAgo(event.created_at)
  }));

  // 5. Render the UI
  return (
    <DashboardComposer 
      userName={profile.display_name} 
      stats={realStats} 
      recentPlans={formattedPlans} 
      healthData={hardwareHealth} 
      systemEvents={formattedEvents} 
    />
  );
}