"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers, Map, Plus, ArrowRight, UploadCloud, FileType2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface BuildingData {
  id: string;
  name: string;
  address: string;
}

const initialFloors = [
  { id: "floor-1", name: "Ground Floor", nodes: 156, edges: 210, status: "Active" },
  { id: "floor-2", name: "Floor 2", nodes: 42, edges: 68, status: "Active" },
];

// Added 'building' as a prop
export function BuildingMapsComposer({ building }: { building: BuildingData }) {
  const [floors] = useState(initialFloors);

  return (
    <div className="space-y-8">
      {/* Dynamic Sticky Header */}
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="h-5 w-5 text-zinc-500" />
            {/* Dynamic Building Name */}
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">
              {building?.name || "Building Detail"}
            </h1>
          </div>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
            Manage individual floor plans and maps for this location.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0 uppercase tracking-wider text-xs">
                <Plus className="h-4 w-4 mr-2" />
                ADD NEW MAP
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 border-2 border-zinc-950 dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-xl p-0 overflow-hidden">
              <DialogHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b-2 border-zinc-950 dark:border-zinc-800 p-6 pb-5">
                <DialogTitle className="font-black uppercase tracking-wider text-lg text-zinc-950 dark:text-zinc-100">
                  Add Floor Plan
                </DialogTitle>
                <DialogDescription className="font-bold text-zinc-500 text-xs mt-1">
                  Upload a floor plan specific to {building?.name || "this building"}.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 p-6">
                <div className="grid gap-2">
                  <Label htmlFor="label" className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">Floor Label</Label>
                  <Input id="label" placeholder="e.g., Ground Floor" className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none focus-visible:ring-0 font-medium" />
                </div>

                <div className="border-2 border-dashed border-zinc-950 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-zinc-50/50 dark:bg-zinc-900/50 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 group cursor-pointer">
                  <div className="h-12 w-12 rounded-lg border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-950 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">
                    <UploadCloud className="h-6 w-6 text-zinc-950 dark:text-zinc-100" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-100">Upload or drag and drop</p>
                  <p className="text-xs font-bold text-zinc-500 mt-1">.DWG, .PDF, or High-Res .PNG</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-950 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 px-3 py-1.5 rounded-md">
                    <FileType2 className="w-3.5 h-3.5" /> DWG auto-vectorization active
                  </div>
                </div>
              </div>

              <DialogFooter className="p-6 pt-0 border-t-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 mt-auto flex-row justify-end gap-3 sm:gap-0">
                <Button variant="outline" className="border-2 border-zinc-950 dark:border-zinc-700 font-bold uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">Cancel</Button>
                <Button className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white font-black uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none">Upload Floor Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        {floors.map((floor) => (
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

              <div className="flex items-center gap-4">
                <Button asChild variant="outline" className="border-2 border-zinc-950 dark:border-zinc-800 font-bold uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  {/* Updated URL to use dynamic building ID */}
                  <Link href={`/map-studio/${building?.id || 'unknown'}/${floor.id}`}>
                    Edit Canvas <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}