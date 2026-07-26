"use client";

import { useAuth } from "@/components/layout/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetOrganizationBeacons,
  useGetOrganizationTasks,
} from "@/hooks/api/useFleet";
import { useGetStaff } from "@/hooks/api/useStaff";
import { BeaconDto, DeploymentTaskDto } from "@/lib/api/types";
import { ArrowLeft, LayoutDashboard, RadioTower, Send } from "lucide-react";
import { useState } from "react";
import { AssignmentEngine } from "./AssignmentEngine";
import { HardwareInventory, InventoryItem } from "./HardwareInventory";
import { KanbanBoard, Task } from "./KanbanBoard";

type ViewState = "HUB" | "ASSIGN" | "BOARD" | "INVENTORY";

export function FleetComposer() {
  const { activeOrgId } = useAuth();
  const orgIdNum = activeOrgId ? Number(activeOrgId) : undefined;

  const { data: staffData = [], isLoading: staffLoading } = useGetStaff(orgIdNum);
  const { data: tasksData = [], isLoading: tasksLoading } = useGetOrganizationTasks(orgIdNum);
  const { data: beaconsData = [], isLoading: beaconsLoading } = useGetOrganizationBeacons(orgIdNum);

  const [activeView, setActiveView] = useState<ViewState>("HUB");

  const isLoading = staffLoading || tasksLoading || beaconsLoading;

  const staffOptions = staffData
    .filter(staff => staff.role === "TECHNICIAN")
    .map((staff) => ({
      id: String(staff.id),
      name: staff.email,
    }));

  const mappedTasks: Task[] = tasksData.map((task: DeploymentTaskDto) => {
    const assignedStaff = staffData.find((s) => s.id === task.staffId);
    return {
      id: String(task.id),
      status: task.status as "TO_DO" | "IN_PROGRESS" | "VERIFIED",
      nodeLabel: `Node ID: ${task.nodeId}`,
      staffName: assignedStaff ? assignedStaff.email : "Unknown Technician",
    };
  });

  // THE FIX: Prevent Ghost Tasks by excluding nodes that have ANY task or beacon history
  const taskNodeIds = tasksData.map((task: DeploymentTaskDto) => Number(task.nodeId));
  const inventoryNodeIds = beaconsData
    .filter((b: BeaconDto) => b.nodeId != null && b.status !== "UNLINKED")
    .map((b: BeaconDto) => Number(b.nodeId));
    
  const unavailableNodeIds = Array.from(new Set([...taskNodeIds, ...inventoryNodeIds]));

  const mappedInventory: InventoryItem[] = beaconsData.map((beacon: BeaconDto) => ({
    id: String(beacon.id),
    nodeLabel: beacon.nodeLabel || `Node ID: ${beacon.nodeId}`,
    beaconId: beacon.uuid,
    rssi: beacon.calibratedRssiBaseline,
    status: beacon.status as "ACTIVE" | "UNLINKED",
  }));

  const activeTasksCount = tasksData.filter((task: DeploymentTaskDto) => task.status === "TO_DO" || task.status === "IN_PROGRESS").length;
  const unlinkedBeaconsCount = mappedInventory.filter((i) => i.status === "UNLINKED").length;

  if (activeView !== "HUB") {
    return (
      <div className="flex flex-col h-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView("HUB")}
            className="flex items-center gap-2 font-black uppercase tracking-widest text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Hub
          </button>
        </div>
        <div className="flex-1 min-h-0">
          {activeView === "ASSIGN" && <AssignmentEngine staff={staffOptions} activeNodeIds={unavailableNodeIds} />}
          {activeView === "BOARD" && <KanbanBoard tasks={mappedTasks} />}
          {activeView === "INVENTORY" && <HardwareInventory items={mappedInventory} isLoading={isLoading} />}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex flex-col h-full animate-in fade-in duration-500">
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col px-6 md:px-8 pt-6 md:pt-8 pb-5 -mt-6 md:-mt-8 -mx-6 md:-mx-8">
        <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
          Fleet Operations Hub
        </h1>
        <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
          Command Center for Physical Deployments
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Active Tasks</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{activeTasksCount}</span>
          </div>
          <div className="bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Available Staff</span>
            <span className="text-2xl font-black text-zinc-950 dark:text-zinc-100">{staffOptions.length}</span>
          </div>
          <div className="bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total Hardware</span>
            <span className="text-2xl font-black text-zinc-950 dark:text-zinc-100">{mappedInventory.length}</span>
          </div>
          <div className="bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Pending Links</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{unlinkedBeaconsCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 pb-8">
        <Card onClick={() => setActiveView("ASSIGN")} className="group cursor-pointer rounded-2xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:hover:border-indigo-500 transition-all flex flex-col">
          <CardContent className="p-8 flex flex-col h-full justify-between gap-8">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 border-2 border-indigo-200 dark:border-indigo-900 flex items-center justify-center">
                <Send className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-wider text-xl text-zinc-950 dark:text-zinc-100">Assign Tasks</h3>
                <p className="text-sm font-bold text-zinc-500 mt-2">Filter maps, select unassigned nodes, and dispatch work orders to your field technicians.</p>
              </div>
            </div>
            <div className="flex items-center text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 group-hover:gap-3 transition-all gap-2">
              Open Workspace <ArrowLeft className="h-4 w-4 rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Card onClick={() => setActiveView("BOARD")} className="group cursor-pointer rounded-2xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:hover:border-amber-500 transition-all flex flex-col">
          <CardContent className="p-8 flex flex-col h-full justify-between gap-8">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-950/50 border-2 border-amber-200 dark:border-amber-900 flex items-center justify-center">
                <LayoutDashboard className="h-7 w-7 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-wider text-xl text-zinc-950 dark:text-zinc-100">Task Board</h3>
                <p className="text-sm font-bold text-zinc-500 mt-2">Monitor the live progress of all active, pending, and verified deployment tasks.</p>
              </div>
            </div>
            <div className="flex items-center text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 group-hover:gap-3 transition-all gap-2">
              Open Workspace <ArrowLeft className="h-4 w-4 rotate-180" />
            </div>
          </CardContent>
        </Card>

        <Card onClick={() => setActiveView("INVENTORY")} className="group cursor-pointer rounded-2xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:hover:border-emerald-500 transition-all flex flex-col">
          <CardContent className="p-8 flex flex-col h-full justify-between gap-8">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 border-2 border-emerald-200 dark:border-emerald-900 flex items-center justify-center">
                <RadioTower className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-black uppercase tracking-wider text-xl text-zinc-950 dark:text-zinc-100">Hardware Inventory</h3>
                <p className="text-sm font-bold text-zinc-500 mt-2">Manage physical beacons, view UUID linkages, and check calibrated RSSI signals.</p>
              </div>
            </div>
            <div className="flex items-center text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 group-hover:gap-3 transition-all gap-2">
              Open Workspace <ArrowLeft className="h-4 w-4 rotate-180" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}