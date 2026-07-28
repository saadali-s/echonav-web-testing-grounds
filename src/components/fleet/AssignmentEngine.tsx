"use client";

import { useAuth } from "@/components/layout/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateTasks } from "@/hooks/api/useFleet";
import {
  useGetBuildings,
  useGetFloorPlans,
  useGetSpatialGraph,
} from "@/hooks/api/useMapStudio";
import { Loader2, Map, MapPin, Send, User, Users } from "lucide-react";
import { useState } from "react";

export interface UnassignedNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface AssignmentProps {
  nodes?: UnassignedNode[];
  staff: { id: string; name: string }[];
  activeNodeIds?: number[];
}

export function AssignmentEngine({
  staff,
  activeNodeIds = [],
}: AssignmentProps) {
  const { activeOrgId } = useAuth();
  const orgIdNum = activeOrgId ? Number(activeOrgId) : undefined;

  const { data: buildings } = useGetBuildings(orgIdNum);
  const firstBuildingId = buildings?.[0]?.id;
  const { data: floorPlans, isLoading: isFloorPlansLoading } =
    useGetFloorPlans(firstBuildingId);

  const [selectedFloorPlanId, setSelectedFloorPlanId] = useState<string>("");
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  const { data: graphData, isLoading: isGraphLoading } = useGetSpatialGraph(
    selectedFloorPlanId ? Number(selectedFloorPlanId) : undefined,
  );

  const createTasksMutation = useCreateTasks();

  const dynamicNodes: UnassignedNode[] = (graphData?.nodes || [])
    .filter((node) => !activeNodeIds.includes(Number(node.id)))
    .map((node) => ({
      id: String(node.id),
      label: node.label || `Node ${node.id}`,
      x: node.x,
      y: node.y,
    }));

  const handleFloorPlanChange = (val: string) => {
    setSelectedFloorPlanId(val);
    setSelectedNodes(new Set());
  };

  const toggleNode = (id: string) => {
    const newSelected = new Set(selectedNodes);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedNodes(newSelected);
  };

  const toggleAll = () => {
    if (selectedNodes.size === dynamicNodes.length && dynamicNodes.length > 0) {
      setSelectedNodes(new Set());
    } else {
      setSelectedNodes(new Set(dynamicNodes.map((n) => n.id)));
    }
  };

  const handleAssign = async () => {
    if (selectedNodes.size === 0 || !selectedStaffId) return;

    try {
      const nodeIds = Array.from(selectedNodes).map(Number);
      const staffId = Number(selectedStaffId);

      await createTasksMutation.mutateAsync({
        nodeIds,
        staffId,
      });

      setSelectedNodes(new Set());
      setSelectedStaffId("");
    } catch (error) {
      console.error(error);
      alert("Failed to dispatch tasks. Check console for details.");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <Send className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Assignment Workspace
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mt-1">
            Select location, pick nodes, and assign a technician.
          </p>
        </div>
      </div>

      {/* 3-Column Grid for step-by-step selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Column 1: Floor Plans */}
        <Card className="flex p-0 flex-col border-2 border-zinc-950 dark:border-zinc-800  dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
          <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 py-4">
            <CardTitle className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
              <Map className="h-4 w-4" /> Step 1: Location
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-2">
            {isFloorPlansLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500 m-auto mt-4" />
            )}
            {(!floorPlans || floorPlans.length === 0) &&
              !isFloorPlansLoading && (
                <div className="text-center p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  No Floor Plans Found
                </div>
              )}
            {floorPlans?.map((fp) => (
              <div
                key={fp.id}
                onClick={() => handleFloorPlanChange(String(fp.id))}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedFloorPlanId === String(fp.id)
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="font-black text-sm uppercase">{fp.name}</div>
                <div className="font-bold text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                  ID: {fp.id}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Column 2: Nodes */}
        <Card className="flex p-0 flex-col border-2 border-zinc-950 dark:border-zinc-800  dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
          <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Step 2: Nodes
              </CardTitle>
              <button
                onClick={toggleAll}
                disabled={dynamicNodes.length === 0}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors disabled:opacity-50"
              >
                {selectedNodes.size === dynamicNodes.length &&
                dynamicNodes.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-2">
            {!selectedFloorPlanId && (
              <div className="text-center p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg mt-4">
                Select a floor plan first
              </div>
            )}
            {isGraphLoading && selectedFloorPlanId && (
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500 m-auto mt-4" />
            )}
            {!isGraphLoading &&
              dynamicNodes.length === 0 &&
              selectedFloorPlanId && (
                <div className="text-center p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
                  No unassigned nodes available.
                </div>
              )}
            {dynamicNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => toggleNode(node.id)}
                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedNodes.has(node.id)
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedNodes.has(node.id)}
                    onCheckedChange={() => toggleNode(node.id)}
                    className="border-2 border-zinc-950 dark:border-zinc-700 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                  />
                  <div>
                    <div className="font-black text-sm uppercase">
                      {node.label}
                    </div>
                    <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                      ID: {node.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Column 3: Staff & Dispatch */}
        <Card className="flex p-0 flex-col border-2 border-zinc-950 dark:border-zinc-800  dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden relative">
          <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 py-4">
            <CardTitle className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
              <Users className="h-4 w-4" /> Step 3: Technician
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-2 pb-24">
            {staff.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedStaffId(s.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedStaffId === s.id
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <User className="h-5 w-5 opacity-70" />
                <span className="font-black text-sm uppercase break-all">
                  {s.name}
                </span>
              </div>
            ))}
          </CardContent>

          {/* Sticky Summary / Action Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-900 border-t-2 border-zinc-950 dark:border-zinc-800">
            <Button
              onClick={handleAssign}
              disabled={
                selectedNodes.size === 0 ||
                !selectedStaffId ||
                createTasksMutation.isPending
              }
              className="w-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-black h-12 tracking-widest uppercase text-xs  dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 disabled:active:translate-x-0 disabled:active:translate-y-0 disabled:active:"
            >
              {createTasksMutation.isPending
                ? "Dispatching..."
                : `Create ${selectedNodes.size} Task${selectedNodes.size !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
