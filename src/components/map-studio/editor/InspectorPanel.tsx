"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, MousePointer2, Route, Save, Trash2, Ruler } from "lucide-react";
import { NodeData } from "./vector/types";
import { ToolMode } from "./Toolbelt";

export type SelectionType = "NODE" | "EDGE" | null;

interface InspectorProps {
  selectionType: SelectionType;
  activeTool: ToolMode;
  selectedNode?: NodeData;
  floorPlanScale: string;
  updateNode?: (updates: Partial<NodeData>) => void;
  onSave?: () => void;
  onDelete: () => void;
  onFloorPlanScaleChange: (value: string) => void;
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl border-2 border-zinc-950 dark:border-zinc-800 flex items-center justify-center mb-6 dark:shadow-none bg-zinc-50 dark:bg-zinc-900">
        <MousePointer2 className="h-8 w-8 text-zinc-950 dark:text-zinc-100" />
      </div>
      <h3 className="text-sm font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest mb-2">Nothing Selected</h3>
      <p className="text-xs font-bold text-zinc-500 leading-relaxed max-w-50">
        Click a node or edge on the canvas to inspect and edit its properties.
      </p>
    </div>
  );
}

function ScaleCalibration({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="p-5 space-y-6">
        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">
            Floor Plan Scale Ratio
          </Label>
          <div className="relative group">
            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input 
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g., 1:100" 
              className="pl-10 text-sm font-bold bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl h-12 focus-visible:ring-0 dark:shadow-none transition-all"
            />
          </div>
          <p className="text-[10px] font-bold text-zinc-500 leading-tight">
            Set the ratio of canvas units to real-world meters for accurate distance calculation.
          </p>
        </div>
      </div>
    </div>
  );
}

function NodeInspector({ node, updateNode, onSave }: { node?: NodeData, updateNode?: (u: Partial<NodeData>) => void, onSave?: () => void }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="p-5 space-y-6">
        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Node Label (Name)</Label>
          <Input 
            value={node?.label || ""}
            onChange={(e) => updateNode?.({ label: e.target.value })}
            onBlur={onSave}
            placeholder="e.g., Lobby Entrance" 
            className="text-sm font-bold bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl h-11 focus-visible:ring-0 -[2px_2px_0px_0px_rgba(24,24shadow,27,1)] dark:shadow-none"
          />
        </div>
        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Verbal Guidance (TTS)</Label>
          <Textarea 
            placeholder="e.g., You are passing the Science Lab on your right." 
            className="resize-none h-24 text-sm font-medium bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl focus-visible:ring-0 dark:shadow-none p-3"
          />
        </div>
        <div className="space-y-4">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Hardware Binding</Label>
          <div className="space-y-3">
            <Input placeholder="UUID" className="text-xs font-mono font-bold bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-lg h-11 focus-visible:ring-0 dark:shadow-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EdgeInspector() {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="p-5 space-y-6">
        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Calculated Distance</Label>
          <div className="flex items-center gap-3">
            <Input readOnly value="14.2" className="text-xl font-black bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl w-28 h-14 text-center dark:shadow-none focus-visible:ring-0" />
            <span className="text-sm font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Meters</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InspectorPanel({ 
  selectionType, 
  activeTool, 
  selectedNode, 
  floorPlanScale, 
  updateNode, 
  onSave, 
  onDelete, 
  onFloorPlanScaleChange 
}: InspectorProps) {
  
  const isScaling = activeTool === "SCALE";
  const isNode = selectionType === "NODE";
  const isEdge = selectionType === "EDGE";

  return (
    <div className="w-80 shrink-0 bg-white dark:bg-zinc-950 border-l-2 border-zinc-950 dark:border-zinc-800 flex flex-col z-10">
      {/* Header */}
      <div className="p-5 border-b-2 border-zinc-950 dark:border-zinc-800 flex items-center gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="w-12 h-12 rounded-xl border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center dark:shadow-none shrink-0">
          {isScaling ? <Ruler className="h-5 w-5" /> : isNode ? <MapPin className="h-5 w-5" /> : <Route className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-sm uppercase tracking-wider truncate">
            {isScaling ? "Scale Calibration" : isNode ? "Virtual Node" : isEdge ? "Walking Path" : "Inspector"}
          </h3>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 truncate">
            {isScaling ? "Spatial Reference" : `ID: ${selectedNode?.id || "Path Segment"}`}
          </p>
        </div>
      </div>

      {/* Content */}
      {isScaling ? (
        <ScaleCalibration value={floorPlanScale} onChange={onFloorPlanScaleChange} />
      ) : isNode ? (
        <NodeInspector node={selectedNode} updateNode={updateNode} onSave={onSave} />
      ) : isEdge ? (
        <EdgeInspector />
      ) : (
        <EmptyState />
      )}

      {/* Action Footer */}
      {(isNode || isEdge || isScaling) && (
        <div className="p-5 border-t-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shrink-0 space-y-3">
          {/* Delete Button (Only for Nodes and Edges) */}
          {(isNode || isEdge) && !isScaling && (
            <Button 
              variant="destructive" 
              onClick={onDelete}
              className="w-full h-12 rounded-xl border-2 border-zinc-950 font-black uppercase text-[10px] tracking-widest transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none gap-2"
            >
              <Trash2 className="h-4 w-4" /> Delete {isNode ? "Node" : "Edge"}
            </Button>
          )}
          
          {/* Save Button (Always visible if Scaling, Node, or Edge) */}
          <Button 
            onClick={onSave} 
            className="w-full h-12 rounded-xl border-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black uppercase text-[10px] tracking-widest dark:shadow-none transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none gap-2"
          >
            <Save className="h-4 w-4" /> Save Properties
          </Button>
        </div>
      )}
    </div>
  );
}