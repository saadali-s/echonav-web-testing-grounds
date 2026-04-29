"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers, Map, Plus, ArrowRight, UploadCloud, FileType2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type PrivacyLevel = "PUBLIC" | "PRIVATE";
const initialFloors = [
  { id: "floor-1", name: "Ground Floor", nodes: 156, edges: 210, status: "Active", privacy: "PUBLIC" as PrivacyLevel },
  { id: "floor-2", name: "Floor 2 - Labs", nodes: 42, edges: 68, status: "Active", privacy: "PUBLIC" as PrivacyLevel },
];

export function BuildingMapsComposer() {
  const [buildingPrivacy, setBuildingPrivacy] = useState<PrivacyLevel>("PUBLIC");
  
  const [floors, setFloors] = useState(initialFloors);
  
  const [newMapPrivacy, setNewMapPrivacy] = useState<PrivacyLevel>("PUBLIC");

  const handleBuildingPrivacyChange = (isPublic: boolean) => {
    const newPrivacy: PrivacyLevel = isPublic ? "PUBLIC" : "PRIVATE";
    setBuildingPrivacy(newPrivacy);
    
    setFloors(prevFloors => 
      prevFloors.map(floor => ({ ...floor, privacy: newPrivacy }))
    );
  };

  const handleFloorPrivacyChange = (floorId: string, isPublic: boolean) => {
    const newPrivacy: PrivacyLevel = isPublic ? "PUBLIC" : "PRIVATE";
    setFloors(prevFloors => 
      prevFloors.map(floor => (floor.id === floorId ? { ...floor, privacy: newPrivacy } : floor))
    );
  };

  return (
    <div className="space-y-8">
      <div className="sticky -top-6 md:-top-14 z-40 bg-zinc-50 dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 -mt-6 md:-mt-8 -mx-6 md:-mx-8 px-6 md:px-8 pt-6 md:pt-8 pb-5 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="h-5 w-5 text-zinc-500" />
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-100 uppercase">Science Block</h1>
          </div>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">Manage individual floor plans and maps for this building.</p>
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
                <DialogTitle className="font-black uppercase tracking-wider text-lg text-zinc-950 dark:text-zinc-100">Add Floor Plan</DialogTitle>
                <DialogDescription className="font-bold text-zinc-500 text-xs mt-1">Upload a floor plan specific to the Science Block.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 p-6">
                <div className="grid gap-2">
                  <Label htmlFor="label" className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">Floor Label</Label>
                  <Input id="label" placeholder="e.g., Ground Floor" className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none focus-visible:ring-0 font-medium" />
                </div>

                <div className="grid gap-2">
                  <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">Map Privacy Level</Label>
                  <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-3 py-2.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none w-fit">
                    <span className={`text-[11px] font-black tracking-widest uppercase ${newMapPrivacy === "PUBLIC" ? "text-emerald-600" : "text-amber-600"}`}>
                      {newMapPrivacy}
                    </span>
                    <Switch
                      checked={newMapPrivacy === "PUBLIC"}
                      onCheckedChange={(checked) => setNewMapPrivacy(checked ? "PUBLIC" : "PRIVATE")}
                      className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-amber-500 border-2 border-zinc-950 m-0"
                    />
                  </div>
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

          <div className="flex items-center gap-2 bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-2 rounded-lg border-2 border-zinc-950/20 dark:border-zinc-700">
            <span className={`text-[10px] font-black tracking-widest uppercase ${buildingPrivacy === "PUBLIC" ? "text-emerald-600" : "text-amber-600"}`}>{buildingPrivacy}</span>
            <Switch 
              checked={buildingPrivacy === "PUBLIC"} 
              onCheckedChange={handleBuildingPrivacyChange} 
              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-amber-500 border-2 border-zinc-950 scale-75 m-0" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        {floors.map((floor) => (
          <Card key={floor.id} className="flex flex-col overflow-hidden rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 group">
            <CardContent className="p-6 flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex items-center justify-center border-2 border-zinc-950 dark:border-zinc-800"><Layers className="h-6 w-6 text-zinc-950 dark:text-zinc-100" /></div>
                <div>
                  <h3 className="font-black text-lg text-zinc-950 dark:text-zinc-100 uppercase tracking-tight">{floor.name}</h3>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">{floor.nodes} Nodes | {floor.edges} Edges</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-800">
                  <span className={`text-[10px] font-black tracking-widest uppercase ${floor.privacy === "PUBLIC" ? "text-emerald-600" : "text-amber-600"}`}>
                    {floor.privacy}
                  </span>
                  <Switch
                    checked={floor.privacy === "PUBLIC"}
                    onCheckedChange={(checked) => handleFloorPrivacyChange(floor.id, checked)}
                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-amber-500 border-2 border-zinc-950 scale-75 m-0"
                  />
                </div>
                
                <Button asChild variant="outline" className="border-2 border-zinc-950 dark:border-zinc-800 font-bold uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none hover:bg-zinc-100 dark:hover:bg-zinc-900">
                  <Link href={`/map-studio/building-1/${floor.id}`}>Edit Canvas <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}