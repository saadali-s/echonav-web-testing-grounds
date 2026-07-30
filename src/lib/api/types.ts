export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface InviteUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  organisationId: number;
  generatedById: number;
  requiresConcierge: boolean;
}

export interface InviteUserResponse {
  pairingPin: string;
}

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
  password?: string; 
  country: string;
  address: string;
  contactNo: string;
}

export interface UpdateOrgRequest {
  orgName: string;
  contactNo: string;
  address: string;
  adminName: string; 
}

export interface OrganisationDto {
  id: number;
  orgName: string;
  adminName: string;
  orgEmail: string;
  slug: string;
  country: string;
  address: string;
  contactNo: string;
  createdAt: string;
  updatedAt: string;
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
  email: string;
  name: string;
  password?: string;
}

export interface BuildingDto {
  id: number;
  name: string;
  address: string;
  privacyLevel: "PUBLIC" | "PRIVATE";
}

export interface BuildingStatsDto {
  activeFloorPlans: number;
}

export interface FloorPlanStatsDto {
  nodeCount: number;
  edgeCount: number;
}

export interface RegisterBuildingRequest {
  name: string;
  address: string;
  privacyLevel: "PUBLIC" | "PRIVATE";
}

export interface UpdateBuildingPrivacyRequest {
  privacyLevel: "PUBLIC" | "PRIVATE";
}

export interface FloorPlanDto {
  id: number;
  buildingId: number | null;
  name: string;
  floorPlanUrl: string; 
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
  ttsVerbalGuidance?: string;
  ttsAudioUrl?: string;
  isHazard?: boolean;
  hazardType?: string;
  rssiBaseline?: number;
}

export interface EdgeDto {
  id: number;
  fromNodeId: number;
  toNodeId: number;
  weightM: number;
  distance: number;
  isHazard?: boolean;
}

export interface UpdateGraphRequest {
  nodes: {
    tempId: string;
    x: number;
    y: number;
    label: string;
    isHazard?: boolean;
    hazardType?: string;
    ttsVerbalGuidance?: string;
    ttsAudioUrl?: string;
  }[];
  edges: {
    tempId: string;
    source: string;
    target: string;
    isHazard?: boolean;
  }[];
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
  isHazard?: boolean;
  hazardType?: string; 
}

export interface NodeData { 
  id: string; 
  x: number; 
  y: number; 
  label: string;
  isHazard?: boolean; 
  hazardType?: string; 
}

export interface GraphEdgePayload {
  tempId: string;
  source: string;
  target: string;
}

export interface BeaconDto {
  id: number;
  nodeId: number | null;
  nodeLabel?: string | null; 
  uuid: string | null; 
  major: number | null;
  minor: number | null;
  calibratedRssiBaseline: number | null;
  status: string;
  linkedDate: string | null; 
}

export interface DeploymentTaskDto {
  id: number;
  nodeId: number | null;
  staffId: number | null;
  status: string; 
  timeAssigned: string | null; 
  timeCompleted: string | null; 
}

export interface CreateBatchTasksRequest {
  nodeIds: number[];
  staffId: number;
}

export interface LinkBeaconRequest {
  uuid: string; 
  nodeId: number;
}

export interface UpdateTaskRequest {
  status: string;
}

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

export interface StaffDto {
  id: number;
  email: string;
  role: string;
  status: string;
  joinedDate?: string;
}

export interface InviteStaffRequest {
  email: string;
  role: string;
  organisationId: number;
  invitedById: number;
}

export interface StaffInviteDto {
  id: number;
  email: string;
  role: string;
  status: string; 
  expirationDate: string;
}

export interface PairingPinDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  pinCode: string; 
  generatedBy: string;
  invitedDate: string;
}

export interface StatMetric {
  count: number;
  subtext: string;
}

export interface DashboardStatsDto {
  mappedBuildings: StatMetric;
  activeBeacons: StatMetric;
  pendingTasks: StatMetric;
}

export interface RecentPlanDto {
  id: number;
  name: string;
  building: string;
  updatedAt: string;
}

export interface CriticalBeaconDto {
  id: string;
  label: string;
  battery: string;
}

export interface HardwareHealthDto {
  total: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  criticalItems: CriticalBeaconDto[];
}

export interface SystemEventDto {
  id: number;
  status: 'ACTIVE' | 'RESOLVED';
  hazardType: string;
  nodeLabel: string;
  buildingName: string;
  floorPlanName: string;
  timestamp: string;
}

export interface DashboardResponseDto {
  userName: string;
  stats: DashboardStatsDto;
  recentPlans: RecentPlanDto[];
  healthData: HardwareHealthDto;
  systemEvents: SystemEventDto[];
  routingActivity: ActivityChartDto[];
}

export interface ActivityChartDto {
  date: string;
  users: number;
  hazards: number;
}