import { NodeDto, RouteResponse } from "@/lib/api/types";
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
  floorPlanScale: number; // FIXED: Injecting parsed real-world scale
  onEdgeClick: (e: React.PointerEvent, edgeId: string) => void;
  calibrationStart?: { x: number; y: number } | null;
  calibrationEnd?: { x: number; y: number } | null;
  calibrationCurrent?: { x: number; y: number } | null;
  calculatedRoute?: RouteResponse | null;
}

export function EdgeLayer({ 
  nodes, edges, selectedEdgeIds, selection, draftEdge, selectionBox, scale, floorPlanScale, onEdgeClick,
  calibrationStart, calibrationEnd, calibrationCurrent, calculatedRoute
}: EdgeLayerProps) {
  return (
    <svg className="absolute inset-0 overflow-visible pointer-events-none">
      {edges.map(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (!source || !target) return null;
        
        const isSelected = selectedEdgeIds.includes(edge.id) && selection === "EDGE";
        const isHazard = edge.isHazard;
        
        // FIXED: Realtime Thick-Client Mathematics for smooth dragging UX
        const pixelDistance = Math.hypot(target.x - source.x, target.y - source.y);
        const realtimeWeightM = !isNaN(floorPlanScale) ? (pixelDistance * floorPlanScale) : null;
        const displayWeight = realtimeWeightM ? `${realtimeWeightM.toFixed(1)}m` : 'Uncalibrated';
        
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
            {/* Realtime Label Rendering */}
            <text 
                x={(source.x + target.x) / 2} 
                y={(source.y + target.y) / 2 - (6 / scale)} 
                fontSize={12 / scale} 
                fontWeight="900" 
                textAnchor="middle" 
                fill="#18181b" 
                stroke="#ffffff" 
                strokeWidth={3 / scale} 
                paintOrder="stroke" 
                className="pointer-events-none select-none transition-all"
            >
                {displayWeight}
            </text>
          </g>
        );
      })}

     {calculatedRoute && calculatedRoute.path && calculatedRoute.path.length > 0 && (
    <polyline

        points={calculatedRoute.path.map((step: NodeDto) => `${step.x},${step.y}`).join(" ")}
        fill="none"
        stroke="#a855f7"
        strokeWidth={8 / scale}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
        style={{ filter: "drop-shadow(0px 0px 8px rgba(168,85,247,0.8))" }}
    />
)}

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

      {calibrationStart && (calibrationCurrent || calibrationEnd) && (
          <g className="pointer-events-none">
            <line x1={calibrationStart.x} y1={calibrationStart.y} x2={(calibrationEnd || calibrationCurrent)!.x} y2={(calibrationEnd || calibrationCurrent)!.y} stroke="#0ea5e9" strokeWidth={4 / scale} strokeDasharray={`${8 / scale} ${8 / scale}`} />
            <circle cx={calibrationStart.x} cy={calibrationStart.y} r={8 / scale} fill="none" stroke="#0ea5e9" strokeWidth={2 / scale} />
            <circle cx={calibrationStart.x} cy={calibrationStart.y} r={2 / scale} fill="#0ea5e9" />
            <circle cx={(calibrationEnd || calibrationCurrent)!.x} cy={(calibrationEnd || calibrationCurrent)!.y} r={8 / scale} fill="none" stroke="#0ea5e9" strokeWidth={2 / scale} />
            <circle cx={(calibrationEnd || calibrationCurrent)!.x} cy={(calibrationEnd || calibrationCurrent)!.y} r={2 / scale} fill="#0ea5e9" />
          </g>
      )}
    </svg>
  );
}