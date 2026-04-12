"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignmentEngine, UnassignedNode } from "./AssignmentEngine";
import { HardwareInventory, InventoryItem } from "./HardwareInventory";
import { KanbanBoard, Task } from "./KanbanBoard";
import { useAuth } from "../layout/auth-provider";

// --- Mock Data ---
const mockNodes: UnassignedNode[] = [
  { id: "n1", label: "Lab 202 Entry", x: 450, y: 120 },
  { id: "n2", label: "Science Wing Stairwell", x: 800, y: 120 },
  { id: "n3", label: "Auditorium Doors", x: 450, y: 600 },
];

const mockStaff = [
  { id: "s1", name: "Sarah Jenkins" },
  { id: "s2", name: "Michael Chen" },
];

const mockTasks: Task[] = [
  {
    id: "t1",
    status: "TO_DO",
    nodeLabel: "Cafe Entrance",
    staffName: "Michael Chen",
  },
  {
    id: "t2",
    status: "IN_PROGRESS",
    nodeLabel: "Library Main Gate",
    staffName: "Sarah Jenkins",
  },
  {
    id: "t3",
    status: "VERIFIED",
    nodeLabel: "Admin Corridor",
    staffName: "Sarah Jenkins",
  },
];
// -----------------

export function FleetComposer() {
  // 1. Pull the activeOrgId straight from your new provider
  const { user, activeOrgId } = useAuth();

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 2. Wait until BOTH the user and their Org ID have loaded
    if (!user || !activeOrgId) return;

    const fetchInventory = async () => {
      try {
        setIsLoading(true);

        // 3. Pass it to your API perfectly
        const response = await fetch(
          `/api/fleet/Hardware-inventory?organizationId=${activeOrgId}`,
        );

        if (!response.ok) throw new Error("Failed to fetch");

        const rawData = await response.json();

        const formattedData: InventoryItem[] = rawData.map((row: any) => ({
          id: row.id,
          nodeLabel: row.nodes?.label || "Unassigned Node",
          beaconId: row.hardware_uuid
            ? row.hardware_uuid.substring(0, 8)
            : "UNKNOWN",
          rssi: row.calibrated_rssi_baseline || 0,
        }));

        setInventory(formattedData);
      } catch (error) {
        console.error("Error loading inventory:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [user, activeOrgId]); // <-- Re-run if activeOrgId changes

  return (
    <div className="space-y-8 flex flex-col h-full">
      <div className="shrink-0 border-b-2 border-zinc-950 dark:border-zinc-800 pb-5">
        <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
          Fleet Management
        </h1>
        <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">
          Deploy, monitor, and inventory your physical beacon hardware.
        </p>
      </div>

      <Tabs defaultValue="deployment" className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full sm:w-auto inline-flex shrink-0 self-start border-2 border-zinc-950 dark:border-zinc-800 rounded-lg p-1 h-auto shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950">
          <TabsTrigger
            value="deployment"
            className="px-6 py-2.5 font-black uppercase text-xs tracking-wider data-[state=active]:bg-zinc-950 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-100 dark:data-[state=active]:text-zinc-950 rounded-md transition-all"
          >
            Task Deployment
          </TabsTrigger>
          <TabsTrigger
            value="inventory"
            className="px-6 py-2.5 font-black uppercase text-xs tracking-wider data-[state=active]:bg-zinc-950 data-[state=active]:text-white dark:data-[state=active]:bg-zinc-100 dark:data-[state=active]:text-zinc-950 rounded-md transition-all"
          >
            Hardware Inventory
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deployment" className="flex-1 mt-6 min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full pb-8">
            <AssignmentEngine nodes={mockNodes} staff={mockStaff} />
            <KanbanBoard tasks={mockTasks} />
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="flex-1 mt-6 min-h-0 pb-8">
          <HardwareInventory items={inventory} isLoading={isLoading}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
