// ============================================================================
// ECHONAV DOMAIN TYPES
// Single Source of Truth for Frontend/Backend Data Contracts
// ============================================================================

// --- USER MANAGEMENT DOMAIN ---

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  // Based on Phase 1, the backend returns the raw NavigatingUser entity/DTO
}

export interface InviteUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  organisationId: number;
  generatedById: number;
}

export interface InviteUserResponse {
  pairingPin: string;
}

// --- AUTH DOMAIN ---

export interface LoginResponse {
  token: string;
  role: string;
  organisationId: number | null;
  userId: number;
}

export interface RegisterOrgRequest {
  orgName: string;
  adminName: string;
  email: string;
  password?: string; // Optional on frontend if handling via separate state, but required by backend
  country: string;
  address: string;
  contactNo: string;
}

export interface UpdateOrgRequest {
  orgName: string;
  contactNo: string;
  address: string;
}

export interface MobileSignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface PairingRequest {
  email: string;
  pairingPin: string;
}

export interface ActivateInviteRequest {
  password?: string;
}

// --- MAP STUDIO DOMAIN ---

export interface BuildingDto {
  id: number;
  name: string;
  address: string;
  privacyLevel: "PUBLIC" | "PRIVATE";
}

export interface RegisterBuildingRequest {
  name: string;
  address: string;
  privacyLevel: "PUBLIC" | "PRIVATE";
}

export interface FloorPlanDto {
  id: number;
  buildingId: number | null;
  name: string;
  floorPlanUrl: string; // Updated from legacy floorPlanDWG
  scale: number | null;
  access: "PUBLIC" | "PRIVATE";
}

export interface UpdateFloorPlanRequest {
  name?: string;
  scale?: number;
}

export interface NodeDto {
  id: number;
  label: string;
  x: number;
  y: number;
  ttsVerbalGuidance: string;
  isHazard?: boolean; // <-- NEW
}

export interface EdgeDto {
  id: number;
  fromNodeId: number;
  toNodeId: number;
  weightM: number;
  distance: number;
  isHazard?: boolean; // <-- NEW
}

export interface UpdateGraphRequest {
  nodes: { tempId: string; x: number; y: number; label: string; isHazard?: boolean }[]; // <-- NEW
  edges: { tempId: string; source: string; target: string; isHazard?: boolean }[]; // <-- NEW
}
export interface GraphDto {
  floorPlan: FloorPlanDto;
  nodes: NodeDto[];
  edges: EdgeDto[];
}

export interface GraphNodePayload {
  tempId: string;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdgePayload {
  tempId: string;
  source: string;
  target: string;
}



// --- FLEET DOMAIN ---

export interface BeaconDto {
  id: number;
  nodeId: number | null;
  nodeLabel?: string | null; // <-- FIX: Added to sync with backend Phase 1 update
  uuid: string | null; // Mapped from Java UUID
  major: number | null;
  minor: number | null;
  calibratedRssiBaseline: number | null;
  status: string; // e.g., "ACTIVE", "UNLINKED"
  linkedDate: string | null; // Mapped from ZonedDateTime
}

export interface DeploymentTaskDto {
  id: number;
  nodeId: number | null;
  staffId: number | null;
  status: string; // e.g., "TO_DO", "IN_PROGRESS", "VERIFIED"
  timeAssigned: string | null; // Mapped from ZonedDateTime
  timeCompleted: string | null; // Mapped from ZonedDateTime
}

export interface CreateBatchTasksRequest {
  nodeIds: number[];
  staffId: number;
}

export interface LinkBeaconRequest {
  uuid: string; // Mapped from Java UUID
  nodeId: number;
}

export interface UpdateTaskRequest {
  status: string;
}

// --- NAVIGATION DOMAIN ---

export interface RouteRequest {
  floorPlanId: number;
  startNodeId: number;
  endNodeId: number;
}



export interface RouteResponse {
  path: NodeDto[];
  totalDistanceMeters: number;
  estimatedTimeSeconds: number;
  status: "SUCCESS" | "NO_PATH_FOUND";
}

// --- STAFF DOMAIN ---

export interface StaffDto {
  id: number;
  name: string; // Maps to your backend's displayName
  email: string;
  role: "ADMIN" | "TECHNICIAN";
  status: "PENDING" | "ACTIVE";
  joinedDate?: string; 
  inviteCode?: string;
  expirationDate?: string; 
}

export interface InviteStaffRequest {
  name: string;
  email: string;
  role: "ADMIN" | "TECHNICIAN";
  organisationId: number;
  invitedById: number;
}


export interface PairingPinDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  pinCode: string; // The concealed ****** pin
  generatedBy: string;
  invitedDate: string;
}
export interface BackendInviteResponse {
  id: number;
  email: string;
  inviteCode: string;
  status: string;
  organisationId: number;
  invitedById: number;
}