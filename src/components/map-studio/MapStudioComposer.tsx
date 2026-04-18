import { CreateMapModal } from "@/components/map-studio/CreateMapModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MapCard, MapData } from "./MapCard";

// --- Mock Data ---
const mockMaps: MapData[] = [
  {
    id: "m-1",
    name: "Science Block - Floor 2",
    privacy: "PUBLIC",
    stats: { nodes: 42, edges: 68 },
    health: "ONLINE",
    updatedAt: "2 hours ago",
  },
  {
    id: "m-2",
    name: "Library - Ground Floor",
    privacy: "PUBLIC",
    stats: { nodes: 156, edges: 210 },
    health: "MAINTENANCE",
    updatedAt: "Yesterday",
  },
  {
    id: "m-3",
    name: "Engineering Wing - Lab 4",
    privacy: "PRIVATE",
    stats: { nodes: 12, edges: 11 },
    health: "ONLINE",
    updatedAt: "1 week ago",
  },
  {
    id: "m-4",
    name: "Student Center - Main",
    privacy: "PUBLIC",
    stats: { nodes: 88, edges: 112 },
    health: "ONLINE",
    updatedAt: "3 days ago",
  },
  {
    id: "m-5",
    name: "Admin Block - Exec Offices",
    privacy: "PRIVATE",
    stats: { nodes: 24, edges: 28 },
    health: "ONLINE",
    updatedAt: "2 weeks ago",
  },
];
// -----------------

export function MapStudioComposer() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
            Map Studio Directory
          </h1>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-1">
            Manage architectural floor plans and spatial routing graphs.
          </p>
        </div>
      </div>

      {/* Grid Layout (Removed flex-1 min-h-0 to prevent squishing) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
        {mockMaps.map((map) => (
          <MapCard key={map.id} map={map} />
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="pt-6 pb-8 flex justify-center border-t-2 border-zinc-200 dark:border-zinc-800">
        <Pagination>
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="border-2 border-zinc-200 dark:border-zinc-800 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs uppercase tracking-wider h-9 px-3"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive
                className="border-2 border-zinc-950 dark:border-zinc-100 bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold h-9 w-9"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#"
                className="border-2 border-zinc-200 dark:border-zinc-800 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 h-9 w-9"
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className="border-2 border-zinc-200 dark:border-zinc-800 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs uppercase tracking-wider h-9 px-3"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
