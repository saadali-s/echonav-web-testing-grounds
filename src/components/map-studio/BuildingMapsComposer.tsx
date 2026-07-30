"use client";

import {
  ArrowRight,
  Layers,
  Map,
  Ruler,
  Trash2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { queryKeys } from "@/hooks/api/queryKeys";
import {
  useDeleteFloorPlan,
  useGetFloorPlans,
  useGetFloorPlanStats,
} from "@/hooks/api/useMapStudio";
import { useQueryClient } from "@tanstack/react-query";
import { CreateFloorPlan } from "./CreateFloorPlan";

const FLOORS_PER_PAGE = 6;

export interface FloorData {
  id: string;
  name: string;
  nodes: number;
  edges: number;
  status: "Active" | "Processing" | "Error";
  scale: number | null;
}

export function BuildingMapsComposer({ buildingId }: { buildingId: string }) {
  const queryClient = useQueryClient();
  const buildingIdNum = Number(buildingId);
  const [currentPage, setCurrentPage] = useState(1);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const {
    data: floorPlansDto,
    isLoading,
    isError,
  } = useGetFloorPlans(buildingIdNum);
  const deleteMutation = useDeleteFloorPlan();

  const mappedFloors: FloorData[] = (floorPlansDto || []).map((fp) => ({
    id: String(fp.id || ""),
    name: fp.name || "Unnamed Floor",
    nodes: 0,
    edges: 0,
    status: "Active",
    scale: fp.scale ?? null,
  }));

  const totalPages = Math.max(
    1,
    Math.ceil(mappedFloors.length / FLOORS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * FLOORS_PER_PAGE;
  const paginatedFloors = mappedFloors.slice(
    startIndex,
    startIndex + FLOORS_PER_PAGE,
  );

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.mapStudio.floorPlans(buildingIdNum),
    });
    setCurrentPage(1);
  };

  const handleDeleteFloor = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ floorPlanId: Number(id) });
    } catch (error: unknown) {
      if (error instanceof Error) setAlertMessage(error.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="h-5 w-5 text-zinc-500" />
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
              Building Directory
            </h1>
          </div>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
            Manage individual floor plans and maps for location #{buildingId}.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <CreateFloorPlan
            buildingId={buildingIdNum}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          {[1, 2].map((skeleton) => (
            <div
              key={skeleton}
              className="h-32 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-6 text-center border-2 border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl font-bold uppercase tracking-wider text-sm">
          Failed to load floor plans. Please check your connection.
        </div>
      )}

      {!isLoading && !isError && mappedFloors.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 mt-8">
          <div className="h-16 w-16 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-2xl flex items-center justify-center mb-4  dark:shadow-none">
            <Layers className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
          </div>
          <h3 className="text-lg font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-tight">
            No Floors Found
          </h3>
          <p className="text-sm font-bold text-zinc-500 mt-2 max-w-md">
            This building does not have any architectural maps registered yet.
          </p>
        </div>
      )}

      {!isLoading && !isError && paginatedFloors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
          {paginatedFloors.map((floor) => (
            <FloorPlanCard
              key={floor.id}
              buildingId={buildingId}
              floor={floor}
              onDelete={handleDeleteFloor}
            />
          ))}
        </div>
      )}

      <AlertDialog
        open={!!alertMessage}
        onOpenChange={(open) => !open && setAlertMessage(null)}
      >
        <AlertDialogContent className="border-2 border-zinc-950 dark:border-zinc-800  dark:shadow-none rounded-xl p-6 sm:max-w-[425px]">
          <AlertDialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="bg-red-100 dark:bg-red-950/50 p-2.5 rounded-lg border-2 border-red-200 dark:border-red-900 shrink-0">
              <AlertCircle
                className="h-6 w-6 text-red-600 dark:text-red-500"
                strokeWidth={2.5}
              />
            </div>
            <AlertDialogTitle className="font-black uppercase tracking-wider text-xl text-zinc-950 dark:text-zinc-100 m-0">
              System Alert
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="py-2">
            <AlertDialogDescription className="font-bold text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap text-sm leading-relaxed">
              <span className="text-zinc-950 dark:text-zinc-200">
                {alertMessage}
              </span>
              {"\n\nPlease verify your connection."}
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

interface FloorPlanCardProps {
  buildingId: string;
  floor: FloorData;
  onDelete: (id: string) => void;
}

function FloorPlanCard({ buildingId, floor, onDelete }: FloorPlanCardProps) {
  const { data: stats } = useGetFloorPlanStats(Number(floor.id));

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border-2 border-zinc-950 dark:border-zinc-800  bg-white dark:bg-zinc-950 group">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex items-center justify-center border-2 border-zinc-950 dark:border-zinc-800">
            <Layers className="h-6 w-6 text-zinc-950 dark:text-zinc-100" />
          </div>
          <div>
            <h3 className="font-black text-lg text-zinc-950 dark:text-zinc-100 uppercase tracking-tight">
              {floor.name}
            </h3>

            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
              {stats?.nodeCount || 0} Nodes | {stats?.edgeCount || 0} Edges
            </p>
            <div
              className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-wider ${floor.scale ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
            >
              <Ruler className="h-3 w-3" />
              {floor.scale
                ? `Scale: ${floor.scale.toFixed(4)}`
                : "Uncalibrated Scale"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="h-10 w-10 p-0 border-2 border-zinc-950 text-zinc-500 hover:text-red-600 "
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-2 border-zinc-950 rounded-xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-black uppercase">
                  Remove Floor Plan?
                </AlertDialogTitle>
                <AlertDialogDescription className="font-bold">
                  This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-2 border-zinc-950">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(floor.id)}
                  className="bg-red-600 border-2 border-zinc-950"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            asChild
            variant="outline"
            className="border-2 border-zinc-950 font-bold uppercase text-[11px] h-10 "
          >
            <Link href={`/map-studio/${buildingId}/${floor.id}`}>
              Edit Canvas <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
