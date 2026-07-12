"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { NodeDto, RouteResponse } from "@/lib/api/types";
import { CheckCircle2, Clock, MapPin, MousePointer2, Navigation, Route, Ruler, Zap } from "lucide-react";
import { useState } from "react";
import { ToolMode } from "./Toolbelt";
import { NodeData } from "./vector/types";

export type SelectionType = "NODE" | "EDGE" | null;

interface InspectorProps {
  selectionType: SelectionType;
  activeTool: ToolMode;
  selectedNode?: NodeData;
  floorPlanScale: string;
  updateNode?: (updates: Partial<NodeData>) => void;
  onSave?: () => void;
  onDelete: () => void;
  calibrationPixelDistance?: number | null;
  onCalibrate?: (scale: number) => void;
  edgeMeters?: number | null;
  routeStartNode?: string | null;
  routeEndNode?: string | null;
  calculatedRoute?: RouteResponse | null;
  isCalculatingRoute?: boolean;
  onResolveHazard?: (nodeId: string) => void;
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl border-2 border-zinc-950 dark:border-zinc-800 flex items-center justify-center mb-6 bg-zinc-50 dark:bg-zinc-900">
        <MousePointer2 className="h-8 w-8 text-zinc-950 dark:text-zinc-100" />
      </div>
      <h3 className="text-sm font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest mb-2">Nothing Selected</h3>
      <p className="text-xs font-bold text-zinc-500 leading-relaxed max-w-50">Click a node or edge to inspect.</p>
    </div>
  );
}

function RouteInspector({ start, end, route, isCalculating }: { start?: string | null, end?: string | null, route?: RouteResponse | null, isCalculating?: boolean }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="p-5 space-y-6">
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase text-zinc-500">Route Waypoints</Label>
          <div className="space-y-2">
            <div className={`p-3 border-2 rounded-xl text-sm font-bold truncate ${start ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'border-zinc-950 bg-zinc-100 dark:bg-zinc-900'}`}>
              <span className="text-[10px] uppercase opacity-70 block mb-0.5">Start</span>
              {start || "Click a starting node..."}
            </div>
            <div className={`p-3 border-2 rounded-xl text-sm font-bold truncate ${end ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'border-zinc-950 bg-zinc-100 dark:bg-zinc-900'}`}>
              <span className="text-[10px] uppercase opacity-70 block mb-0.5">Destination</span>
              {end || "Click an ending node..."}
            </div>
          </div>
        </div>

        {isCalculating && (
          <div className="flex items-center justify-center p-4 border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50">
            <Zap className="h-5 w-5 text-purple-500 animate-bounce mr-2" />
            <span className="text-xs font-black uppercase tracking-wider text-purple-700">Running Dijkstra...</span>
          </div>
        )}

        {route && !isCalculating && route.status !== "NO_PATH_FOUND" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-purple-600 text-white p-3 rounded-xl border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Distance</div>
                  <div className="text-lg font-black">{route.totalDistanceMeters.toFixed(1)}m</div>
               </div>
               <div className="bg-zinc-950 text-white p-3 rounded-xl border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1 flex items-center"><Clock className="w-3 h-3 mr-1"/> ETA</div>
                  <div className="text-lg font-black">{Math.ceil(route.estimatedTimeSeconds)}s</div>
               </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label className="text-[10px] font-black uppercase text-zinc-500">Turn-by-Turn</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {route.path.map((step: NodeDto, idx: number) => (
                  <div key={idx} className="bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg text-xs font-bold flex gap-3">
                    <span className="bg-zinc-950 text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0">{idx + 1}</span>
                    <span className="mt-0.5">{step.ttsVerbalGuidance || `Proceed to ${step.label}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {route && route.status === "NO_PATH_FOUND" && (
            <div className="p-4 border-2 border-red-500 bg-red-50 text-red-700 rounded-xl text-xs font-bold uppercase tracking-wider text-center">
              No continuous path exists between these points.
            </div>
        )}
      </div>
    </div>
  );
}

function ScaleCalibration({ pixelDistance, onCalibrate }: { pixelDistance?: number | null; onCalibrate?: (s: number) => void; }) {
  const [meters, setMeters] = useState("");
  const handleCalibrate = () => {
    if (!pixelDistance || !meters) return;
    const parsedMeters = parseFloat(meters);
    if (isNaN(parsedMeters) || parsedMeters <= 0) return;
    onCalibrate?.(parsedMeters / pixelDistance);
  };
  return (
    <div className="p-5 space-y-6">
      <div className="space-y-3">
        <Label className="text-[10px] font-black uppercase">Raw Pixel Distance</Label>
        <div className="text-xl font-black bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-950 p-3 text-center rounded-xl">
          {pixelDistance ? `${pixelDistance.toFixed(2)} px` : "Draw a line..."}
        </div>
      </div>
      <div className="space-y-3">
        <Label className="text-[10px] font-black uppercase">Real-World Distance (Meters)</Label>
        <Input type="number" value={meters} onChange={(e) => setMeters(e.target.value)} placeholder="e.g., 1.5" className="text-center font-bold border-2 border-zinc-950 rounded-xl h-12" />
      </div>
      <Button onClick={handleCalibrate} disabled={!pixelDistance || !meters} className="w-full bg-indigo-600 text-white font-black uppercase h-12 rounded-xl border-2 border-zinc-950">Calibrate</Button>
    </div>
  );
}

function NodeInspector({ node, updateNode, onSave, onResolveHazard }: { node?: NodeData, updateNode?: (u: Partial<NodeData>) => void, onSave?: () => void, onResolveHazard?: (id: string) => void }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="p-5 space-y-6">
        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Node Label (Name)</Label>
          <Input value={node?.label || ""} onChange={(e) => updateNode?.({ label: e.target.value })} onBlur={onSave} placeholder="e.g., C les 101" className="text-sm font-bold bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl h-11 focus-visible:ring-0 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none" />
        </div>
        
        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Verbal Guidance (TTS)</Label>
          <Input value={node?.ttsVerbalGuidance || ""} onChange={(e) => updateNode?.({ ttsVerbalGuidance: e.target.value })} onBlur={onSave} placeholder="e.g., Science building entrance" className="text-sm font-bold bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl h-11 focus-visible:ring-0 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none" />
        </div>

        <div className="pt-4 border-t-2 border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Mark as Hazard</Label>
            <Switch 
              checked={node?.isHazard || false} 
              onCheckedChange={(c) => updateNode?.({ isHazard: c, hazardType: c ? node?.hazardType || "Fire" : undefined })} 
              className="data-[state=checked]:bg-rose-500 border-2 border-zinc-950 m-0"
            />
          </div>

          {node?.isHazard && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-3">
                <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Hazard Type</Label>
                <Select value={node?.hazardType || "Fire"} onValueChange={(val) => updateNode?.({ hazardType: val })}>
                  <SelectTrigger className="h-11 rounded-xl border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-bold shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-zinc-950 rounded-xl font-bold">
                    <SelectItem value="Fire">Fire</SelectItem>
                    <SelectItem value="Spill">Spill</SelectItem>
                    <SelectItem value="Obstruction">Obstruction</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full h-11 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-bold shadow-[2px_2px_0px_0px_rgba(16,185,129,1)] dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Resolve Hazard
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-2 border-zinc-950 dark:border-zinc-800 rounded-xl shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-black uppercase tracking-tight">Resolve Hazard?</AlertDialogTitle>
                    <AlertDialogDescription className="font-bold text-zinc-500">
                      Are you sure this hazard has been resolved? This will clear the hazard from the map and update the system logs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-2 border-zinc-950 dark:border-zinc-800 font-bold uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => {
                        if (node?.id) onResolveHazard?.(node.id);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 dark:text-black text-white font-black uppercase text-[11px] tracking-wider h-10 border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none"
                    >
                      Confirm & Resolve
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EdgeInspector({ meters }: { meters?: number | null }) {
  return (
    <div className="p-5 space-y-6">
      <div className="space-y-3">
        <Label className="text-[10px] font-black uppercase tracking-widest">Calculated Distance</Label>
        <div className="flex items-center gap-3">
          <Input readOnly value={meters ? meters.toFixed(2) : "--"} className="text-xl font-black bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 rounded-xl w-28 h-14 text-center" />
          <span className="text-sm font-black uppercase tracking-widest">Meters</span>
        </div>
      </div>
    </div>
  );
}

export function InspectorPanel({ 
  selectionType, activeTool, selectedNode, updateNode, onSave, onDelete, calibrationPixelDistance, onCalibrate, edgeMeters, routeStartNode, routeEndNode, calculatedRoute, isCalculatingRoute, onResolveHazard
}: InspectorProps) {
  const isScaling = activeTool === "SCALE";
  const isRouting = activeTool === "ROUTE";
  const isNode = selectionType === "NODE";
  const isEdge = selectionType === "EDGE";

  return (
    <div className="w-80 shrink-0 bg-white dark:bg-zinc-950 border-l-2 border-zinc-950 flex flex-col z-10">
      <div className="p-5 border-b-2 border-zinc-950 flex items-center gap-4 bg-zinc-50/50">
        <div className="w-12 h-12 rounded-xl border-2 border-zinc-950 bg-white flex items-center justify-center shrink-0">
          {isScaling ? <Ruler className="h-5 w-5" /> : isRouting ? <Navigation className="h-5 w-5 text-purple-600" /> : isNode ? <MapPin className="h-5 w-5" /> : <Route className="h-5 w-5" />}
        </div>
        <h3 className="font-black text-sm uppercase">{isScaling ? "Scale" : isRouting ? "Path Simulation" : isNode ? "Node" : "Path"}</h3>
      </div>

      {isScaling ? (
        <ScaleCalibration pixelDistance={calibrationPixelDistance} onCalibrate={onCalibrate} />
      ) : isRouting ? (
        <RouteInspector start={routeStartNode} end={routeEndNode} route={calculatedRoute} isCalculating={isCalculatingRoute} />
      ) : isNode ? (
        <NodeInspector node={selectedNode} updateNode={updateNode} onSave={onSave} onResolveHazard={onResolveHazard} />
      ) : isEdge ? (
        <EdgeInspector meters={edgeMeters} />
      ) : (
        <EmptyState />
      )}

      {(isNode || isEdge) && !isScaling && !isRouting && (
        <div className="p-5 border-t-2 border-zinc-950 bg-zinc-50 space-y-3 mt-auto">
          <Button variant="destructive" onClick={onDelete} className="w-full border-2 border-zinc-950">Delete</Button>
          <Button onClick={onSave} className="w-full bg-zinc-950 text-white border-2 border-zinc-950">Save Properties</Button>
        </div>
      )}
    </div>
  );
}