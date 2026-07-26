"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
import { Activity, AlertTriangle, ArrowRight, Loader2, Map, MapPin, Shield, ShieldAlert, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
// THE FIX: Combined both hooks from alphas and Ticket-8
import { useUpdateBuildingPrivacy, useGetBuildingStats } from "@/hooks/api/useMapStudio";

// ============================================================================
// 1. ISOLATED PRIVACY TOGGLE COMPONENT (From alphas)
// ============================================================================

interface PrivacyToggleProps {
  buildingId: string;
  buildingName: string;
  currentPrivacy: "PUBLIC" | "PRIVATE";
  orgId: number;
}

export function PrivacyToggle({ buildingId, buildingName, currentPrivacy, orgId }: PrivacyToggleProps) {
  const [showDialog, setShowDialog] = useState(false);
  const { mutate, isPending } = useUpdateBuildingPrivacy();

  const targetPrivacy = currentPrivacy === "PUBLIC" ? "PRIVATE" : "PUBLIC";

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault(); 
    
    mutate(
      { buildingId: Number(buildingId), orgId, data: { privacyLevel: targetPrivacy } },
      {
        onSuccess: () => {
          setShowDialog(false);
        },
        onError: (error) => {
          alert(`Failed to update privacy: ${error instanceof Error ? error.message : "Unknown error"}`);
          setShowDialog(false); 
        }
      }
    );
  };

  const confirmButtonColor = targetPrivacy === "PUBLIC" 
    ? "bg-emerald-400 hover:bg-emerald-500 text-zinc-950" 
    : "bg-amber-400 hover:bg-amber-500 text-zinc-950";

  return (
    <>
      <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-800">
        <span className={`text-[10px] font-black tracking-widest uppercase ${currentPrivacy === "PUBLIC" ? "text-emerald-600" : "text-amber-600"}`}>
          {currentPrivacy}
        </span>
        <Switch
          checked={currentPrivacy === "PUBLIC"}
          disabled={isPending}
          onClick={(e) => {
            e.preventDefault();
            setShowDialog(true);
          }}
          className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-amber-500 border-2 border-zinc-950 scale-75 m-0 cursor-pointer"
        />
      </div>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="border-2 border-zinc-950 dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tight text-xl">Confirm Privacy Change</AlertDialogTitle>
            <AlertDialogDescription className="font-bold text-zinc-500">
              Are you sure you want to change the privacy level of <span className="text-zinc-950 dark:text-zinc-100">{buildingName}</span> to {targetPrivacy}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-4 mt-2">
            <AlertDialogCancel 
              disabled={isPending} 
              className="border-2 border-zinc-950 dark:border-zinc-800 font-black uppercase text-[11px] tracking-wider h-11 px-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none hover:bg-zinc-100 transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none"
            >
              Cancel
            </AlertDialogCancel>
            
            <Button
              disabled={isPending}
              onClick={handleConfirm}
              className={`border-2 border-zinc-950 font-black uppercase text-[11px] tracking-wider h-11 px-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none ${confirmButtonColor}`}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Confirm Change"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ============================================================================
// 2. MAIN BUILDING CARD COMPONENT
// ============================================================================

export interface BuildingData {
  id: string;
  name: string;
  address: string;
  privacy: "PUBLIC" | "PRIVATE";
  stats: { ActiveFloorPlans: number };
  health: "ONLINE" | "MAINTENANCE";
  updatedAt: string;
}

interface BuildingCardProps {
  building: BuildingData;
  orgId: number; 
  onDelete: (id: string) => void;
}

export function BuildingCard({ building, orgId, onDelete }: BuildingCardProps) {
  const isHealthy = building.health === "ONLINE";
  
  // THE FIX: Brought in the live stats from Ticket-8, while dropping the duplicate privacy state
  const { data: stats } = useGetBuildingStats(Number(building.id)); 

  return (
    <Card className="flex flex-col overflow-hidden rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 group transition-all">
      <div className="h-40 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col items-center justify-center border-b-2 border-zinc-950 dark:border-zinc-800 relative overflow-hidden">
        <Map className="h-12 w-12 text-zinc-950 dark:text-zinc-100 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
        
        {/* Confirm Delete Popup Wrapper */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-2 right-2 h-8 w-8 p-0 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-2 border-zinc-950 dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-black uppercase tracking-tight">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="font-bold text-zinc-500">
                This will permanently delete <span className="text-zinc-950 dark:text-zinc-100">{building.name}</span> and all associated floor plans. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="border-2 border-zinc-950 dark:border-zinc-800 font-bold uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(building.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[11px] tracking-wider h-10 border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none"
              >
                Delete Building
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Badge variant={building.privacy === "PUBLIC" ? "default" : "secondary"} className={`absolute top-3 left-3 text-[10px] font-black tracking-widest uppercase border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-md transition-colors ${building.privacy === "PRIVATE" ? "bg-amber-100 text-amber-900 hover:bg-amber-200" : ""}`}>
          {building.privacy === "PRIVATE" ? <ShieldAlert className="w-3 h-3 mr-1.5" /> : <Shield className="w-3 h-3 mr-1.5" />}
          {building.privacy}
        </Badge>
      </div>

      <CardContent className="p-5 flex-1 space-y-5">
        <div>
          <h3 className="font-black text-lg text-zinc-950 dark:text-zinc-100 uppercase truncate tracking-tight">{building.name}</h3>
          <div className="flex items-start gap-1.5 mt-1 text-zinc-500 dark:text-zinc-400">
            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p className="text-[11px] font-bold uppercase tracking-wide leading-tight">{building.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold text-zinc-950 dark:text-zinc-100 bg-white dark:bg-zinc-900 p-3 rounded-lg border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-zinc-500" />
            <span className="text-lg font-black">{stats?.activeFloorPlans || 0}</span> Floor Plans
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-wider">
            {isHealthy ? (
              <><span className="relative flex h-3.5 w-3.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-zinc-950"></span></span><span className="text-emerald-700 dark:text-emerald-500">Hardware Online</span></>
            ) : (
              <><div className="h-5 w-5 bg-amber-100 border-2 border-amber-900 text-amber-900 flex items-center justify-center rounded-md shrink-0"><AlertTriangle className="h-3 w-3" /></div><span className="text-amber-700 dark:text-amber-500">Maintenance</span></>
            )}
          </div>
          
          <PrivacyToggle 
            buildingId={building.id} 
            buildingName={building.name} 
            currentPrivacy={building.privacy}
            orgId={orgId} 
          />
          
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 mt-auto">
        <Button className="mt-5 w-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0" asChild>
          <Link href={`/map-studio/${building.id}`}>View Floor Plans <ArrowRight className="w-4 h-4 ml-2" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}