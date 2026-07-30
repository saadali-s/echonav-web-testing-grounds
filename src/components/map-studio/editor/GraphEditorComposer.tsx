"use client";

import { Progress } from "@/components/ui/progress";
import {
  useGetSpatialGraph,
  useUpdateFloorPlan,
  useUpdateSpatialGraph,
} from "@/hooks/api/useMapStudio";
import { useCalculateRoute } from "@/hooks/api/useNavigation";
import { UpdateGraphRequest } from "@/lib/api/types";
import { useQueryClient } from "@tanstack/react-query";
import {
  Layers,
  Map,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { Toolbelt, ToolMode } from "./Toolbelt";
import { VectorComposer } from "./VectorComposer";
import { EdgeData, NodeData } from "./vector/types";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function GraphEditorComposer({ floorPlanId }: { floorPlanId: string }) {
  const [activeTool, setActiveTool] = useState<ToolMode>("SELECT");
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const lastMessageRef = useRef<string>("");
  if (alertMessage) {
    lastMessageRef.current = alertMessage;
  }
  const displayMsg = alertMessage || lastMessageRef.current;

  const idNum = Number(floorPlanId);
  const queryClient = useQueryClient();

  const { data: graphData, isLoading: isDbLoading } = useGetSpatialGraph(idNum);
  const updateSpatialGraphMutation = useUpdateSpatialGraph();
  const updateFloorPlanMutation = useUpdateFloorPlan();
  const calculateRouteMutation = useCalculateRoute();

  const imageUrl = graphData?.floorPlan?.floorPlanUrl;
  const floorName = graphData?.floorPlan?.name || "Loading Floor Plan...";
  const initialScale = graphData?.floorPlan?.scale
    ? String(graphData.floorPlan.scale)
    : "";

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

  const importedDataStr =
    typeof window !== "undefined"
      ? sessionStorage.getItem(`echonav_import_${idNum}`)
      : null;
  const importedData = useMemo(() => {
    if (importedDataStr) {
      try {
        return JSON.parse(importedDataStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [importedDataStr]);

  const handleSaveToDb = async (nodes: NodeData[], edges: EdgeData[]) => {
    try {
      const payload: UpdateGraphRequest = {
        nodes: nodes.map((n) => ({
          tempId: String(n.id),
          x: n.x,
          y: n.y,
          label: n.label,
          isHazard: n.isHazard || false,
          hazardType: n.hazardType,
          ttsVerbalGuidance: n.ttsVerbalGuidance,
          ttsAudioUrl: n.ttsAudioUrl,
        })),
        edges: edges.map((e) => ({
          tempId: String(e.id),
          source: String(e.source),
          target: String(e.target),
          isHazard: e.isHazard || false,
        })),
      };

      const result = await updateSpatialGraphMutation.mutateAsync({
        floorPlanId: idNum,
        data: payload,
      });

      sessionStorage.removeItem(`echonav_import_${idNum}`);
      setAlertMessage("Vector graph securely saved to database.");

      return result;
    } catch (error: unknown) {
      setAlertMessage(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
      return null;
    }
  };

  const initialNodes: NodeData[] = useMemo(() => {
    if (importedData && importedData.nodes) {
      return importedData.nodes.map((n: any) => ({
        id: String(n.tempId || ""),
        x: n.x || 0,
        y: n.y || 0,
        label: n.label || "",
        isHazard: n.isHazard || false,
        hazardType: n.hazardType,
        ttsVerbalGuidance: n.ttsVerbalGuidance,
        ttsAudioUrl: n.ttsAudioUrl,
      }));
    }
    const nodes = graphData?.nodes || [];
    return nodes.map((n) => ({
      id: String(n.id || ""),
      x: n.x || 0,
      y: n.y || 0,
      label: n.label || "",
      isHazard: n.isHazard || false,
      hazardType: n.hazardType,
      ttsVerbalGuidance: n.ttsVerbalGuidance,
      ttsAudioUrl: n.ttsAudioUrl,
    }));
  }, [graphData, importedData]);

  const initialEdges: EdgeData[] = useMemo(() => {
    if (importedData && importedData.edges) {
      return importedData.edges.map((e: any) => ({
        id: String(e.tempId || ""),
        source: String(e.source || ""),
        target: String(e.target || ""),
        isHazard: e.isHazard || false,
        weightM: e.weightM,
        distance: e.distance,
      }));
    }
    const edges = graphData?.edges || [];
    return edges.map((e) => ({
      id: String(e.id || ""),
      source: String(e.fromNodeId || ""),
      target: String(e.toNodeId || ""),
      isHazard: e.isHazard || false,
      weightM: e.weightM ?? undefined,
      distance: e.distance ?? undefined,
    }));
  }, [graphData, importedData]);

  const handleUpdateScale = async (newScale: number) => {
    try {
      await updateFloorPlanMutation.mutateAsync({
        floorPlanId: idNum,
        data: { scale: newScale },
      });
      await queryClient.invalidateQueries();
      setAlertMessage("Floor plan scale accurately calibrated.");
    } catch (error: unknown) {
      setAlertMessage(
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    }
  };

  const handleCalculateRoute = async (startId: string, endId: string) => {
    if (startId.startsWith("n") || endId.startsWith("n")) {
      setAlertMessage(
        "⚠️ Unsaved Nodes Detected!\n\nYou must click 'Save Properties' to save your new nodes before the routing engine can calculate a path.",
      );
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
      setAlertMessage("Failed to calculate route. Please try again.");
      return null;
    }
  };

  const isFullyLoading = isDbLoading || isProcessing;

  const isSuccess =
    displayMsg?.includes("securely") || displayMsg?.includes("accurately");
  const isWarning = displayMsg?.includes("⚠️");

  const alertConfig = isSuccess
    ? {
        icon: (
          <CheckCircle2
            className="h-6 w-6 text-emerald-600 dark:text-emerald-500"
            strokeWidth={2.5}
          />
        ),
        bg: "bg-emerald-100 dark:bg-emerald-950/50",
        border: "border-emerald-200 dark:border-emerald-900",
        title: "Success",
      }
    : isWarning
      ? {
          icon: (
            <AlertTriangle
              className="h-6 w-6 text-amber-600 dark:text-amber-500"
              strokeWidth={2.5}
            />
          ),
          bg: "bg-amber-100 dark:bg-amber-950/50",
          border: "border-amber-200 dark:border-amber-900",
          title: "Action Required",
        }
      : {
          icon: (
            <AlertCircle
              className="h-6 w-6 text-red-600 dark:text-red-500"
              strokeWidth={2.5}
            />
          ),
          bg: "bg-red-100 dark:bg-red-950/50",
          border: "border-red-200 dark:border-red-900",
          title: "System Alert",
        };

  return (
    <div className="h-full flex flex-col relative rounded-xl border-2 border-zinc-950 dark:border-zinc-800 overflow-hidden  dark:bg-zinc-950">
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
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 border-2 border-zinc-700 ">
            <Layers className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-2 uppercase">
            Fetching Vector Map
          </h2>
          <p className="text-sm font-bold text-zinc-400 mb-8 max-w-sm text-center">
            Pulling architectural data and preparing the spatial grid structure.
            Please wait.
          </p>
          <div className="w-full max-w-md space-y-2">
            <Progress
              value={progress}
              className="h-3 rounded-full bg-zinc-800 border-2 border-zinc-700"
            />
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

      <AlertDialog
        open={!!alertMessage}
        onOpenChange={(open) => !open && setAlertMessage(null)}
      >
        <AlertDialogContent className="border-2 border-zinc-950 dark:border-zinc-800  dark:shadow-none rounded-xl p-6 sm:max-w-[425px]">
          <AlertDialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <div
              className={`${alertConfig.bg} p-2.5 rounded-lg border-2 ${alertConfig.border} shrink-0`}
            >
              {alertConfig.icon}
            </div>

            <AlertDialogTitle className="font-black uppercase tracking-wider text-xl text-zinc-950 dark:text-zinc-100 m-0">
              {alertConfig.title}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="py-2">
            <AlertDialogDescription className="font-bold text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap text-sm leading-relaxed">
              <span className="text-zinc-950 dark:text-zinc-200">
                {displayMsg}
              </span>
            </AlertDialogDescription>
          </div>

          <AlertDialogFooter className="mt-2">
            <AlertDialogAction
              onClick={() => setAlertMessage(null)}
              className="bg-zinc-950 hover:bg-zinc-800 text-white font-black uppercase text-sm tracking-wider h-11 px-8 border-2 border-zinc-950 dark:border-zinc-800  dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none w-full sm:w-auto"
            >
              Acknowledge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
