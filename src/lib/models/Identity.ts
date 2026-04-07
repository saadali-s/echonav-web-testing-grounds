export type OrgStatus = 'ACTIVE' | 'INACTIVE';
export type ProfileRole = 'ADMIN' | 'TECHNICIAN';
export type ProfileStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_ACTIVATION';
export type DeviceStatus = 'ACTIVE' | 'REVOKED';
export type PinStatus = 'ACTIVE' | 'CONSUMED' | 'EXPIRED';

export interface Organization {
  id: string; // UUID
  name: string;
  slug: string;
  default_region: string;
  status: OrgStatus;
  created_at: string;
  updated_at: string;
}

export interface OrgSetting {
  organization_id: string; // UUID (Foreign Key)
  institution_name: string;
  contact_department: string | null;
  default_server_region: string;
  max_pin_ttl_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string; // UUID (Foreign Key to auth.users)
  organization_id: string; // UUID
  email: string;
  display_name: string;
  role: ProfileRole;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
}

export interface PairedDevice {
  id: string; // UUID
  organization_id: string; // UUID
  device_model: string | null;
  app_installation_id: string;
  device_secret_hash: string;
  status: DeviceStatus;
  paired_at: string;
  last_seen_at: string | null;
  created_at: string;
}

export interface PairingPin {
  id: string; // UUID
  organization_id: string; // UUID
  generated_by_profile_id: string; // UUID
  pin_hash: string;
  status: PinStatus;
  expires_at: string;
  consumed_at: string | null;
  consumed_by_device_id: string | null; // UUID
  attempt_count: number;
  created_at: string;
}