"use client";

import { Button } from "@/components/ui/button";
import { useDeleteNode } from "@/hooks/api/useMapStudio";
import { RouteResponse } from "@/lib/api/types";
import { MapPin, Navigation, Route, Ruler } from "lucide-react";
import { ToolMode } from "./Toolbelt";
import { NodeData } from "./vector/types";

import { EdgeInspector } from "./inspectors/EdgeInspector";
import { EmptyState } from "./inspectors/EmptyState";
import { NodeInspector } from "./inspectors/NodeInspector";
import { RouteInspector } from "./inspectors/RouteInspector";
import { ScaleCalibration } from "./inspectors/ScaleCalibration";

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
  onDeleteAndSave?: (nodeId: string) => void;
  calibrationPixelDistance?: number | null;
  onCalibrate?: (scale: number) => void;
  edgeMeters?: number | null;
  routeStartNode?: string | null;
  routeEndNode?: string | null;
  calculatedRoute?: RouteResponse | null;
  isCalculatingRoute?: boolean;
  onResolveHazard?: (nodeId: string) => void;
}

export function InspectorPanel({
  selectionType,
  activeTool,
  selectedNode,
  updateNode,
  onSave,
  onDelete,
  onDeleteAndSave,
  calibrationPixelDistance,
  onCalibrate,
  edgeMeters,
  routeStartNode,
  routeEndNode,
  calculatedRoute,
  isCalculatingRoute,
  onResolveHazard,
}: InspectorProps) {
  const isScaling = activeTool === "SCALE";
  const isRouting = activeTool === "ROUTE";
  const isNode = selectionType === "NODE";
  const isEdge = selectionType === "EDGE";

  const deleteNodeMutation = useDeleteNode();

  const handleNodeDelete = () => {
    if (
      selectedNode?.id &&
      (typeof selectedNode.id === "number" ||
        !String(selectedNode.id).startsWith("n"))
    ) {
      deleteNodeMutation.mutate(Number(selectedNode.id));
    }

    if (onDeleteAndSave && selectedNode) {
      onDeleteAndSave(selectedNode.id);
    } else {
      onDelete();
    }
  };

  return (
    <div className="w-80 shrink-0 bg-white dark:bg-zinc-950 border-l-2 border-zinc-950 flex flex-col z-10">
      <div className="p-5 border-b-2 border-zinc-950 flex items-center gap-4 bg-zinc-50/50">
        <div className="w-12 h-12 rounded-xl border-2 border-zinc-950 bg-white flex items-center justify-center shrink-0">
          {isScaling ? (
            <Ruler className="h-5 w-5" />
          ) : isRouting ? (
            <Navigation className="h-5 w-5 text-purple-600" />
          ) : isNode ? (
            <MapPin className="h-5 w-5" />
          ) : (
            <Route className="h-5 w-5" />
          )}
        </div>
        <h3 className="font-black text-sm uppercase">
          {isScaling
            ? "Scale"
            : isRouting
              ? "Path Simulation"
              : isNode
                ? "Node"
                : "Path"}
        </h3>
      </div>

      {isScaling ? (
        <ScaleCalibration
          pixelDistance={calibrationPixelDistance}
          onCalibrate={onCalibrate}
        />
      ) : isRouting ? (
        <RouteInspector
          start={routeStartNode}
          end={routeEndNode}
          route={calculatedRoute}
          isCalculating={isCalculatingRoute}
        />
      ) : isNode ? (
        <NodeInspector
          node={selectedNode}
          updateNode={updateNode}
          onSave={onSave}
          onResolveHazard={onResolveHazard}
        />
      ) : isEdge ? (
        <EdgeInspector meters={edgeMeters} />
      ) : (
        <EmptyState />
      )}

      {(isNode || isEdge) && !isScaling && !isRouting && (
        <div className="p-5 border-t-2 border-zinc-950 bg-zinc-50 space-y-3 mt-auto">
          {isNode ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full border-2 border-zinc-950"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-2 border-zinc-950 dark:border-zinc-800 rounded-xl  dark:shadow-none">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-black uppercase tracking-tight">
                    Delete Node
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-bold text-zinc-500">
                    Are you sure you want to delete node?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-2 border-zinc-950 dark:border-zinc-800 font-bold uppercase text-[11px] tracking-wider h-10  dark:shadow-none">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleNodeDelete}
                    className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[11px] tracking-wider h-10 border-2 border-zinc-950  dark:shadow-none"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              variant="destructive"
              onClick={onDelete}
              className="w-full border-2 border-zinc-950"
            >
              Delete
            </Button>
          )}
          <Button
            onClick={onSave}
            className="w-full bg-zinc-950 text-white border-2 border-zinc-950"
          >
            Save Properties
          </Button>
        </div>
      )}
    </div>
  );
}
