import { ToolMode } from "../Toolbelt";

// Added the label property
export interface NodeData { id: string; x: number; y: number; isHazard?: boolean; label: string; }
export interface EdgeData { id: string; source: string; target: string; isHazard?: boolean; }

// Simplified props since VectorComposer will now manage its own Inspector panel
export interface VectorComposerProps {
  activeTool: ToolMode;
}