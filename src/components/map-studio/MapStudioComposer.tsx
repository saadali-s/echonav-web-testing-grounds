"use client";

import { useState } from "react";
import { CreateBuilding } from "@/components/map-studio/CreateBuilding";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { BuildingCard, BuildingData } from "./BuildingCard";

const initialBuildings: BuildingData[] = [
  { id: "b-1", name: "A Les", address: "123 University Rd, Johannesburg, 2092", privacy: "PUBLIC", stats: { ActiveFloorPlans : 2 }, health: "ONLINE", updatedAt: "2 hours ago" },
  { id: "b-2", name: "B Les", address: "45 Academic Ave, Johannesburg, 2092", privacy: "PUBLIC", stats: { ActiveFloorPlans : 2 }, health: "MAINTENANCE", updatedAt: "Yesterday" },
  { id: "b-3", name: "C Les", address: "78 Tech Blvd, Johannesburg, 2092", privacy: "PRIVATE", stats: { ActiveFloorPlans : 2 }, health: "ONLINE", updatedAt: "1 week ago" },
  { id: "b-4", name: "D Les", address: "10 Campus Walk, Johannesburg, 2092", privacy: "PUBLIC", stats: { ActiveFloorPlans : 2 }, health: "ONLINE", updatedAt: "3 days ago" },
  { id: "b-5", name: "Madibeng", address: "1 University Way, Johannesburg, 2092", privacy: "PRIVATE", stats: { ActiveFloorPlans : 2 }, health: "ONLINE", updatedAt: "2 weeks ago" },
];

export function MapStudioComposer() {
  const [buildings, setBuildings] = useState<BuildingData[]>(initialBuildings);

  // Temporary function to add a building to the local state
  const handleAddBuilding = (newBuilding: Omit<BuildingData, "id" | "stats" | "health" | "updatedAt">) => {
    const fullBuilding: BuildingData = {
      ...newBuilding,
      id: `b-${Math.random().toString(36).substr(2, 9)}`,
      stats: { ActiveFloorPlans: 0 },
      health: "ONLINE",
      updatedAt: "Just now",
    };
    setBuildings((prev) => [fullBuilding, ...prev]);
  };

  // Function to remove building from local state
  const handleDeleteBuilding = (id: string) => {
    setBuildings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">Map Studio Directory</h1>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">Manage architectural floor plans and spatial routing graphs.</p>
        </div>
        <CreateBuilding onAdd={handleAddBuilding} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
        {buildings.map((building) => (
          <BuildingCard 
            key={building.id} 
            building={building} 
            onDelete={handleDeleteBuilding} 
          />
        ))}
      </div>

      {/* Pagination remains UI-only for this demo */}
      <div className="pt-6 pb-8 flex justify-center border-t-2 border-zinc-200 dark:border-zinc-800">
        <Pagination>
          <PaginationContent className="gap-2">
            <PaginationItem><PaginationPrevious href="#" className="border-2 border-zinc-200 dark:border-zinc-800 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs uppercase tracking-wider h-9 px-3" /></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive className="border-2 border-zinc-950 dark:border-zinc-100 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold h-9 w-9">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationNext href="#" className="border-2 border-zinc-200 dark:border-zinc-800 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs uppercase tracking-wider h-9 px-3" /></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}