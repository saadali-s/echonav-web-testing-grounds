"use client";

import { Progress } from "@/components/ui/progress";
import { useGetSpatialGraph, useUpdateFloorPlan, useUpdateSpatialGraph } from "@/hooks/api/useMapStudio";
import { useCalculateRoute } from "@/hooks/api/useNavigation";
import { UpdateGraphRequest } from "@/lib/api/types";
import { useQueryClient } from "@tanstack/react-query";
import { Layers, Map } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Toolbelt, ToolMode } from "./Toolbelt";
import { VectorComposer } from "./VectorComposer";
import { EdgeData, NodeData } from "./vector/types";

export function GraphEditorComposer({ floorPlanId }: { floorPlanId: string }) {
  const [activeTool, setActiveTool] = useState<ToolMode>("SELECT");
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);

  const idNum = Number(floorPlanId);
  const queryClient = useQueryClient();

  const { data: graphData, isLoading: isDbLoading } = useGetSpatialGraph(idNum);
  const updateSpatialGraphMutation = useUpdateSpatialGraph();
  const updateFloorPlanMutation = useUpdateFloorPlan();
  const calculateRouteMutation = useCalculateRoute();

  const imageUrl = graphData?.floorPlan?.floorPlanUrl;
  const floorName = graphData?.floorPlan?.name || "Loading Floor Plan...";
  const initialScale = graphData?.floorPlan?.scale ? String(graphData.floorPlan.scale) : "";

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsProcessing(false), 500); 
          return 100;
        }
        return Math.min(oldProgress + Math.random() * 20, 100);
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  const handleSaveToDb = async (nodes: NodeData[], edges: EdgeData[]) => {
    try {
      const payload: UpdateGraphRequest = {
        nodes: nodes.map((n) => ({ 
          tempId: String(n.id), 
          x: n.x, 
          y: n.y, 
          label: n.label, 
          ttsVerbalGuidance: n.ttsVerbalGuidance || "",
          isHazard: n.isHazard || false,
          hazardType: n.hazardType || undefined
        })),
        edges: edges.map((e) => ({ 
          tempId: String(e.id), 
          source: String(e.source), 
          target: String(e.target), 
          isHazard: e.isHazard || false 
        }))
      };
      await updateSpatialGraphMutation.mutateAsync({ floorPlanId: idNum, data: payload });
      alert("Vector graph securely saved to database.");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };

  const initialNodes: NodeData[] = useMemo(() => {
    const nodes = graphData?.nodes || [];
    return nodes.map((n) => ({
      id: String(n.id || ""),
      x: n.x || 0,
      y: n.y || 0,
      label: n.label || "",
      ttsVerbalGuidance: n.ttsVerbalGuidance || "",
      isHazard: n.isHazard || false, 
      hazardType: n.hazardType || undefined
    }));
  }, [graphData]);

  const handleUpdateScale = async (newScale: number) => {
    try {
      await updateFloorPlanMutation.mutateAsync({ floorPlanId: idNum, data: { scale: newScale } });
    
      await queryClient.invalidateQueries(); 
      
      alert("Floor plan scale accurately calibrated.");
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };

  const handleCalculateRoute = async (startId: string, endId: string) => {
    if (startId.startsWith('n') || endId.startsWith('n')) {
      alert("⚠️ Unsaved Nodes Detected!\n\nYou must click 'Save Properties' to save your new nodes to the database before the routing engine can calculate a path.");
      return null;
    }

    try {
      return await calculateRouteMutation.mutateAsync({
        floorPlanId: idNum,
        startNodeId: Number(startId),
        endNodeId: Number(endId),
      });
    } catch (error) {
      console.error("Routing failed:", error);
      alert("Failed to calculate route. Please try again.");
      return null;
    }
  };

  const isFullyLoading = isDbLoading || isProcessing;

  const initialEdges: EdgeData[] = useMemo(() => {
    const edges = graphData?.edges || [];
    return edges.map((e) => ({
      id: String(e.id || ""),
      source: String(e.fromNodeId || ""),
      target: String(e.toNodeId || ""),
      isHazard: e.isHazard || false,
      weightM: e.weightM ?? undefined, 
      distance: e.distance ?? undefined
    }));
  }, [graphData]);

  return (
    <div className="h-full flex flex-col relative rounded-xl border-2 border-zinc-950 dark:border-zinc-800 overflow-hidden shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] dark:bg-zinc-950">
      <div className="h-14 border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Map className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          <span className="font-black uppercase tracking-wider text-sm text-zinc-950 dark:text-zinc-100">
            {floorName}
          </span>
        </div>
      </div>

      {isFullyLoading && (
        <div className="absolute inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 border-2 border-zinc-700 shadow-[4px_4px_0px_0px_rgba(63,63,70,1)]">
            <Layers className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-2 uppercase">Fetching Vector Map</h2>
          <p className="text-sm font-bold text-zinc-400 mb-8 max-w-sm text-center">
            Pulling architectural data and preparing the spatial grid structure. Please wait.
          </p>
          <div className="w-full max-w-md space-y-2">
            <Progress value={progress} className="h-3 rounded-full bg-zinc-800 border-2 border-zinc-700" />
            <div className="flex justify-between text-xs font-black text-zinc-500 tracking-widest">
              <span>INITIALIZING</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <Toolbelt activeTool={activeTool} setActiveTool={setActiveTool} />
        {!isFullyLoading && (
          <VectorComposer 
            activeTool={activeTool} 
            imageUrl={imageUrl} 
            onSaveDb={handleSaveToDb}
            onUpdateScale={handleUpdateScale}
            onCalculateRoute={handleCalculateRoute}
            initialNodes={initialNodes}
            initialEdges={initialEdges}
            initialScale={initialScale} 
          />
        )}
      </div>
    </div>
  );
}