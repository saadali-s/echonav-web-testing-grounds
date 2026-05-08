import { FleetComposer } from '@/components/fleet/FleetComposer';

// Mock inventory placeholder data
const mockInventory = [
  { id: "inv1", nodeLabel: "Lobby Entry", beaconId: "B-1234", rssi: -65 },
  { id: "inv2", nodeLabel: "Stairwell B", beaconId: "B-5678", rssi: -72 },
  { id: "inv3", nodeLabel: "Cafeteria Gate", beaconId: "B-9012", rssi: -58 },
];

export default function FleetPage() {
  return <FleetComposer initialInventory={mockInventory} />;
}