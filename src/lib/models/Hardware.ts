export type BeaconStatus = 'AVAILABLE' | 'BOUND' | 'MAINTENANCE';
export type TaskStatus = 'TO_DO' | 'IN_PROGRESS' | 'VERIFIED';

export interface Beacon {
  id: string; // UUID
  organization_id: string; // UUID
  hardware_uuid: string;
  major: number;
  minor: number;
  node_id: string | null; // UUID
  calibrated_rssi_baseline: number | null;
  status: BeaconStatus;
  created_at: string;
}

export interface DeploymentTask {
  id: string; // UUID
  organization_id: string; // UUID
  map_id: string; // UUID
  node_id: string; // UUID
  assigned_to_profile_id: string; // UUID
  status: TaskStatus;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}