import { RouteResponse } from "@/lib/api/types";
import { ToolMode } from "../Toolbelt";

export interface NodeData {
  id: string;
  x: number;
  y: number;
  isHazard?: boolean;
  label: string;
  ttsVerbalGuidance?: string;
  ttsAudioUrl?: string;
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  isHazard?: boolean;
  weightM?: number;
  distance?: number;
}

export interface VectorComposerProps {
  activeTool: ToolMode;
  imageUrl?: string;
  onSaveDb?: (nodes: NodeData[], edges: EdgeData[]) => Promise<any>;
  onUpdateScale?: (scale: number) => Promise<void>;
  onCalculateRoute?: (
    startId: string,
    endId: string,
  ) => Promise<RouteResponse | null>;
  initialNodes?: NodeData[];
  initialEdges?: EdgeData[];
  initialScale?: string;
}
