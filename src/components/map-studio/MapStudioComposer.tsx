"use client";

import { useAuth } from "@/components/layout/auth-provider";
import { CreateBuilding } from "@/components/map-studio/CreateBuilding";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useCreateBuilding, useDeleteBuilding, useGetBuildings } from "@/hooks/api/useMapStudio";
import { Map } from "lucide-react";
import { useState } from "react";
import { BuildingCard, BuildingData } from "./BuildingCard";

const BUILDINGS_PER_PAGE = 6;

export function MapStudioComposer() {
  const { activeOrgId } = useAuth();
  const orgIdNum = activeOrgId ? Number(activeOrgId) : undefined;

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // TanStack Hooks
  const { data: buildingsDto, isLoading, isError } = useGetBuildings(orgIdNum);
  const createBuildingMutation = useCreateBuilding();
  const deleteBuildingMutation = useDeleteBuilding();

  const mappedBuildings: BuildingData[] = (buildingsDto || []).map((b) => ({
    id: String(b.id),
    name: b.name || "Unnamed Building",
    address: b.address || "No Address Provided",
    privacy: (b.privacyLevel === "PRIVATE" ? "PRIVATE" : "PUBLIC"),
    stats: { ActiveFloorPlans: 0 }, 
    health: "ONLINE",
    updatedAt: "Just now",
  }));

  const totalPages = Math.max(1, Math.ceil(mappedBuildings.length / BUILDINGS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  
  const startIndex = (safeCurrentPage - 1) * BUILDINGS_PER_PAGE;
  const paginatedBuildings = mappedBuildings.slice(startIndex, startIndex + BUILDINGS_PER_PAGE);

  const handleAddBuilding = async (newBuilding: Omit<BuildingData, "id" | "stats" | "health" | "updatedAt">) => {
    if (!orgIdNum) return;
    try {
      await createBuildingMutation.mutateAsync({
        orgId: orgIdNum,
        data: {
          name: newBuilding.name,
          address: newBuilding.address,
          privacyLevel: newBuilding.privacy,
        }
      });
      setCurrentPage(1);
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const handleDeleteBuilding = async (id: string) => {
    if (!orgIdNum) return;
    try {
      await deleteBuildingMutation.mutateAsync({ buildingId: Number(id) });
    } catch (error: unknown) {
      if (error instanceof Error) alert(error.message);
    }
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

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="h-70 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-6 text-center border-2 border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl font-bold uppercase tracking-wider text-sm">
          Failed to load directory. Please check your connection.
        </div>
      )}

      {!isLoading && !isError && mappedBuildings.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 mt-8">
          <div className="h-16 w-16 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-2xl flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">
            <Map className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
          </div>
          <h3 className="text-lg font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-tight">No Buildings Found</h3>
          <p className="text-sm font-bold text-zinc-500 mt-2 max-w-md">Your organization hasn&apos;t registered any physical infrastructure yet. Click &quot;Add New Building&quot; to start mapping.</p>
        </div>
      )}

      {!isLoading && !isError && paginatedBuildings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
          {paginatedBuildings.map((building) => (
            <BuildingCard 
              key={building.id} 
              building={building} 
              onDelete={handleDeleteBuilding} 
            />
          ))}
        </div>
      )}

      {!isLoading && mappedBuildings.length > BUILDINGS_PER_PAGE && (
        <div className="pt-6 pb-8 flex justify-center border-t-2 border-zinc-200 dark:border-zinc-800">
          <Pagination>
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (safeCurrentPage > 1) setCurrentPage(p => p - 1);
                  }}
                  className={`border-2 border-zinc-200 dark:border-zinc-800 font-semibold text-xs uppercase tracking-wider h-9 px-3 ${safeCurrentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"}`} 
                />
              </PaginationItem>
              
              <PaginationItem>
                <div className="flex items-center justify-center border-2 border-zinc-950 dark:border-zinc-100 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold h-9 px-4 rounded-md text-sm">
                  {safeCurrentPage} / {totalPages}
                </div>
              </PaginationItem>
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    if (safeCurrentPage < totalPages) setCurrentPage(p => p + 1);
                  }}
                  className={`border-2 border-zinc-200 dark:border-zinc-800 font-semibold text-xs uppercase tracking-wider h-9 px-3 ${safeCurrentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"}`} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}