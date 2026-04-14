import { FleetComposer } from '@/components/fleet/FleetComposer';
import { FleetService } from '@/lib/services/FleetService';
import { AuthService } from '@/lib/services/AuthService';
import { InventoryItem } from '@/components/fleet/HardwareInventory'; // Import the type

export default async function FleetPage() {
  const profile = await AuthService.getCurrentProfile();
  let initialInventory: InventoryItem[] = [];

  if (profile?.organization_id) {
    // 1. Fetch raw data
    const rawData = await FleetService.getVerifiedHardware(profile.organization_id);

    // 2. Format the data EXACTLY like your old API route did
    if (rawData) {
      initialInventory = rawData.map((row: any) => ({
        id: row.id,
        nodeLabel: row.nodes?.label || "Unassigned Node",
        beaconId: row.hardware_uuid
          ? row.hardware_uuid.substring(0, 8)
          : "UNKNOWN",
        rssi: row.calibrated_rssi_baseline || 0,
      }));
    }
  }

  // 3. Pass the perfectly formatted data down
  return <FleetComposer initialInventory={initialInventory} />;
}