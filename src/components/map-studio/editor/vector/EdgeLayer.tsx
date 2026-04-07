import { SelectionType } from "../InspectorPanel";
import { EdgeData, NodeData } from "./types";

interface EdgeLayerProps {
  nodes: NodeData[];
  edges: EdgeData[];
  selectedEdgeIds: string[];
  selection: SelectionType;
  draftEdge: { source: string; currentX: number; currentY: number } | null;
  selectionBox: { startX: number; startY: number; currentX: number; currentY: number } | null;
  scale: number;
  onEdgeClick: (e: React.PointerEvent, edgeId: string) => void;
}

export function EdgeLayer({ nodes, edges, selectedEdgeIds, selection, draftEdge, selectionBox, scale, onEdgeClick }: EdgeLayerProps) {
  return (
    <svg className="absolute inset-0 overflow-visible pointer-events-none">
      {edges.map(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (!source || !target) return null;
        
        const isSelected = selectedEdgeIds.includes(edge.id) && selection === "EDGE";
        const isHazard = edge.isHazard;
        
        return (
          <g key={edge.id} className="pointer-events-auto cursor-pointer" onPointerDown={(e) => onEdgeClick(e, edge.id)}>
            <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="transparent" strokeWidth={20} />
            <line 
                x1={source.x} y1={source.y} x2={target.x} y2={target.y} 
                stroke={isHazard ? "#ef4444" : isSelected ? "#6366f1" : "#10b981"} 
                strokeWidth={isSelected ? 6 : 4} 
                strokeDasharray={isHazard ? "8 8" : "none"}
                className="transition-colors hover:stroke-indigo-400" 
            />
          </g>
        );
      })}

      {draftEdge && (
          <line 
              x1={nodes.find(n => n.id === draftEdge.source)?.x || 0} 
              y1={nodes.find(n => n.id === draftEdge.source)?.y || 0} 
              x2={draftEdge.currentX} y2={draftEdge.currentY} 
              stroke="#10b981" strokeWidth={4} strokeDasharray="6 6" 
          />
      )}

      {selectionBox && (
          <rect 
              x={Math.min(selectionBox.startX, selectionBox.currentX)}
              y={Math.min(selectionBox.startY, selectionBox.currentY)}
              width={Math.abs(selectionBox.currentX - selectionBox.startX)}
              height={Math.abs(selectionBox.currentY - selectionBox.startY)}
              fill="rgba(99, 102, 241, 0.15)"
              stroke="#6366f1"
              strokeWidth={2 / scale}
              strokeDasharray={`${4 / scale} ${4 / scale}`}
          />
      )}
    </svg>
  );
}