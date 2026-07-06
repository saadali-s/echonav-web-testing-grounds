"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NodeDto, RouteResponse } from "@/lib/api/types";
import { 
  Clock, MapPin, MousePointer2, Navigation, Route, Ruler, Zap, 
  Loader2, Play, Trash2, Mic 
} from "lucide-react";
import { useState, useEffect } from "react";
import { ToolMode } from "./Toolbelt";
import { NodeData } from "./vector/types";
import { useGenerateNodeTts, useDeleteNodeTts } from "@/hooks/api/useMapStudio";
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

function NodeInspector({ node, updateNode, onSave }: { node?: NodeData | any, updateNode?: (u: Partial<NodeData>) => void, onSave?: () => void }) {
  const [ttsInput, setTtsInput] = useState(node?.ttsVerbalGuidance || "");
  const generateMutation = useGenerateNodeTts();
  const deleteMutation = useDeleteNodeTts();

  useEffect(() => {
    setTtsInput(node?.ttsVerbalGuidance || "");
  }, [node]);

  const handleGenerate = () => {
    if (!node?.id) return;
    
    generateMutation.mutate({ nodeId: Number(node.id), text: ttsInput }, {
      onSuccess: (updatedNodeFromDb) => {
        if (updateNode) {
          updateNode({ ttsAudioUrl: updatedNodeFromDb.ttsAudioUrl });
        }
      }
    });
  };

  const handleDelete = () => {
    if (!node?.id) return;
    
    deleteMutation.mutate(Number(node.id), {
      onSuccess: () => {
        setTtsInput("");
        if (updateNode) {
           updateNode({ ttsVerbalGuidance: undefined, ttsAudioUrl: undefined });
        }
      }
    });
  };

  const isGenerating = generateMutation.isPending;
  const hasAudio = !!node?.ttsAudioUrl;
  const isInputDirty = ttsInput !== node?.ttsVerbalGuidance;
  
  // Bug 1 Fix Logic: Prevents generating audio if the node doesn't have a numeric DB ID yet
  const isNewNode = !node?.id || String(node.id).startsWith("n");

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
            className="text-sm font-bold bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl h-11 focus-visible:ring-0 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none" 
          />
        </div>
        
        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Verbal Guidance (TTS)</Label>
          <Textarea 
            value={ttsInput}
            onChange={(e) => {
              setTtsInput(e.target.value);
              // TYPE ASSERTION FIX: Force TS to accept the payload
              updateNode?.({ ttsVerbalGuidance: e.target.value } as any);
            }}
            placeholder="e.g., You are passing the Science Lab on your right." 
            className="resize-none h-24 text-sm font-medium bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl focus-visible:ring-0 dark:shadow-none p-3" 
          />
          
          {/* Prevent generating audio for an unsaved node */}
          {isNewNode ? (
            <div className="p-3 mt-2 border-2 border-amber-500 bg-amber-50 rounded-xl text-center">
               <p className="text-xs font-bold text-amber-700 mb-2">
                 Save properties to register this node before generating audio.
               </p>
               <Button onClick={onSave} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold">
                 Save Properties Now
               </Button>
            </div>
          ) : !hasAudio || isInputDirty ? (
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !ttsInput.trim()} 
              className="w-full mt-2 bg-zinc-950 text-white hover:bg-zinc-800"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isGenerating ? "Generating..." : "Generate Audio"}
            </Button>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <audio src={node.ttsAudioUrl} className="hidden" id={`audio-${node.id}`} />
              <Button 
                variant="secondary" 
                className="flex-1 border-2 border-zinc-950" 
                onClick={() => {
                  const audioEl = document.getElementById(`audio-${node.id}`) as HTMLAudioElement;
                  if (audioEl) audioEl.play();
                }}
              >
                <Play className="h-4 w-4 mr-2" /> Play Audio
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="border-2 border-zinc-950">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this verbal guidance audio? This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                      Delete
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
  selectionType, activeTool, selectedNode, updateNode, onSave, onDelete, calibrationPixelDistance, onCalibrate, edgeMeters, routeStartNode, routeEndNode, calculatedRoute, isCalculatingRoute 
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
        <NodeInspector node={selectedNode} updateNode={updateNode} onSave={onSave} />
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