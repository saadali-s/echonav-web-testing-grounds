"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileType2, Plus, UploadCloud } from "lucide-react";
import { useState } from "react";

export function CreateMapModal() {
  const [certified, setCertified] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none gap-2">
          <Plus className="h-5 w-5" /> INITIALIZE NEW MAP
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 border-2 border-zinc-950 dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-xl p-0 overflow-hidden">
        <DialogHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b-2 border-zinc-950 dark:border-zinc-800 p-6 pb-5">
          <DialogTitle className="font-black uppercase tracking-wider text-lg text-zinc-950 dark:text-zinc-100">Initialize New Map</DialogTitle>
          <DialogDescription className="font-bold text-zinc-500 text-xs mt-1">
            Upload architectural floor plans to begin spatial vectorization.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 p-6">
          <div className="grid gap-2">
            <Label htmlFor="name" className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">Map Name</Label>
            <Input id="name" placeholder="e.g., Science Block - Floor 2" className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none focus-visible:ring-0 font-medium" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="privacy" className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">Privacy Level</Label>
            <Select defaultValue="public">
              <SelectTrigger className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none focus:ring-0 font-medium">
                <SelectValue placeholder="Select privacy level" />
              </SelectTrigger>
              <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">
                <SelectItem value="public" className="font-bold">Public (Visible in Student App)</SelectItem>
                <SelectItem value="private" className="font-bold">Private (Staff/Technicians Only)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Drag and Drop Zone */}
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

          {/* Technical Compliance */}
          <div className="flex items-start space-x-3 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border-2 border-amber-900 dark:border-amber-900 shadow-[2px_2px_0px_0px_rgba(120,53,15,1)] dark:shadow-none">
            <Checkbox 
              id="certified" 
              checked={certified} 
              onCheckedChange={(checked) => setCertified(checked as boolean)}
              className="mt-0.5 border-2 border-amber-900 data-[state=checked]:bg-amber-900"
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="certified" className="text-[11px] font-black uppercase tracking-wider text-amber-950 dark:text-amber-500 cursor-pointer">
                Technical Compliance Certification
              </Label>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-600/80 leading-relaxed">
                I certify that this is a certified architectural plan, drawn to scale, and accurately represents physical dimensions.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 border-t-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 mt-auto flex-row justify-end gap-3 sm:gap-0">
          <Button variant="outline" className="border-2 border-zinc-950 dark:border-zinc-700 font-bold uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none">Cancel</Button>
          <Button disabled={!certified} className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white font-black uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none disabled:opacity-50 transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none">
            Upload & Vectorize
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}