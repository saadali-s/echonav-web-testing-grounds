"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Layers, Map, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock data for the floors inside this specific building
const mockFloors = [
  { id: "floor-1", name: "Ground Floor", nodes: 156, edges: 210, status: "Active" },
  { id: "floor-2", name: "Floor 2 - Labs", nodes: 42, edges: 68, status: "Active" },
];

export function BuildingMapsComposer() {
  const [mapPrivacy, setMapPrivacy] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="h-5 w-5 text-zinc-500" />
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
              Science Block
            </h1>
          </div>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
            Manage individual floor plans and maps for this building.
          </p>
        </div>
        
        {/* Actions (Moved from the Editor Canvas to here!) */}
        <div className="flex items-center gap-4">
          <Button className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0 uppercase tracking-wider text-xs">
            <Plus className="h-4 w-4 mr-2" />
            ADD NEW MAP
          </Button>

          <div className="flex items-center gap-2 bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-2 rounded-lg border-2 border-zinc-950/20 dark:border-zinc-700">
            <span className={`text-[10px] font-black tracking-widest uppercase ${mapPrivacy === "PUBLIC" ? "text-emerald-600" : "text-amber-600"}`}>
              {mapPrivacy}
            </span>
            <Switch 
              checked={mapPrivacy === "PUBLIC"}
              onCheckedChange={(checked) => setMapPrivacy(checked ? "PUBLIC" : "PRIVATE")}
              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-amber-500 border-2 border-zinc-950 scale-75 m-0"
            />
          </div>
        </div>
      </div>

      {/* List of Maps/Floors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        {mockFloors.map((floor) => (
          <Card key={floor.id} className="flex flex-col overflow-hidden rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 group">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex items-center justify-center border-2 border-zinc-950 dark:border-zinc-800">
                  <Layers className="h-6 w-6 text-zinc-950 dark:text-zinc-100" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-zinc-950 dark:text-zinc-100 uppercase tracking-tight">{floor.name}</h3>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">{floor.nodes} Nodes | {floor.edges} Edges</p>
                </div>
              </div>
              
              {/* This links to Step 3 (The actual canvas editor) */}
              <Button asChild variant="outline" className="border-2 border-zinc-950 dark:border-zinc-800 font-bold uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none hover:bg-zinc-100 dark:hover:bg-zinc-900">
                <Link href={`/map-studio/building-1/${floor.id}`}>
                  Edit Canvas <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}