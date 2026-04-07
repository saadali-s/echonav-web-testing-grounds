export type PrivacyLevel = 'PUBLIC' | 'PRIVATE';
export type MapStatus = 'DRAFT' | 'PUBLISHED';

export interface Building {
  id: string; // UUID
  organization_id: string; // UUID
  name: string;
  campus_name: string;
  privacy_level: PrivacyLevel;
  created_at: string;
  updated_at: string;
}

export interface BuildingMap {
  id: string; // UUID
  organization_id: string; // UUID
  building_id: string; // UUID
  name: string;
  scale_meters_per_pixel: number | null;
  svg_storage_path: string | null;
  status: MapStatus;
  created_at: string;
  updated_at: string;
}

export interface Node {
  id: string; // UUID
  map_id: string; // UUID
  label: string;
  x: number;
  y: number;
  tts_verbal_guidance: string | null;
  is_hazard: boolean;
  created_at: string;
}

export interface Edge {
  id: string; // UUID
  map_id: string; // UUID
  from_node_id: string; // UUID
  to_node_id: string; // UUID
  weight_m: number;
  is_hazard: boolean;
  created_at: string;
}

// A custom DTO specifically for Dijkstra's Algorithm
export interface AdjacencyListGraph {
  [nodeId: string]: {
    targetNodeId: string;
    weight: number;
  }[];
}