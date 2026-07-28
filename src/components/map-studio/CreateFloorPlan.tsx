"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mapStudioActions } from "@/lib/actions/mapStudio";
import { FileText, Plus, UploadCloud, AlertCircle } from "lucide-react"; // <-- Added AlertCircle
import { useRef, useState } from "react";

// SHADCN IMPORTS
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CreateFloorPlanProps {
  buildingId: number;
  onUploadSuccess: () => void;
}

export function CreateFloorPlan({
  buildingId,
  onUploadSuccess,
}: CreateFloorPlanProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // NEW: Alert State
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const [newFloorLabel, setNewFloorLabel] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!newFloorLabel.trim() || !selectedFile) {
      setAlertMessage("Please provide both a label and a file."); // REPLACED NATIVE ALERT
      return;
    }

    setIsUploading(true);
    try {
      const res = await mapStudioActions.uploadFloorPlan(
        buildingId,
        newFloorLabel,
        selectedFile,
      );

      // If we just uploaded an .echonav file, catch the transient nodes before switching screens
      if (res.transientNodes || res.transientEdges) {
        sessionStorage.setItem(
          `echonav_import_${res.id}`,
          JSON.stringify({
            nodes: res.transientNodes || [],
            edges: res.transientEdges || [],
          }),
        );
      }

      onUploadSuccess();
      setOpen(false);
      setNewFloorLabel("");
      setSelectedFile(null);
    } catch (error: unknown) {
      if (error instanceof Error) setAlertMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setNewFloorLabel("");
            setSelectedFile(null);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6  dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0 uppercase tracking-wider text-xs">
            <Plus className="h-4 w-4 mr-2" />
            ADD NEW MAP
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-125 border-2 border-zinc-950 dark:border-zinc-800  dark:shadow-none rounded-xl p-0 overflow-hidden">
          <DialogHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b-2 border-zinc-950 dark:border-zinc-800 p-6 pb-5">
            <DialogTitle className="font-black uppercase tracking-wider text-lg text-zinc-950 dark:text-zinc-100">
              Add Floor Plan
            </DialogTitle>
            <DialogDescription className="font-bold text-zinc-500 text-xs mt-1">
              Upload a structural map specific to this building.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 p-6">
            <div className="grid gap-2">
              <Label
                htmlFor="floor-label"
                className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400"
              >
                Floor Label
              </Label>
              <Input
                id="floor-label"
                value={newFloorLabel}
                onChange={(e) => setNewFloorLabel(e.target.value)}
                placeholder="e.g., Ground Floor"
                className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg  dark:shadow-none focus-visible:ring-0 font-medium"
              />
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${selectedFile ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" : "border-zinc-950 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-900"}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".dwg,.svg,.pdf,.png,.echonav"
                onChange={handleFileSelect}
              />
              <div
                className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center mb-4 transition-transform  dark:shadow-none ${selectedFile ? "border-indigo-500 bg-indigo-500 text-white" : "border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 group-hover:scale-110"}`}
              >
                {selectedFile ? (
                  <FileText className="h-6 w-6" />
                ) : (
                  <UploadCloud className="h-6 w-6" />
                )}
              </div>
              <p className="text-sm font-black uppercase tracking-wider text-zinc-950 dark:text-zinc-100">
                {selectedFile ? "File Selected" : "Upload or drag and drop"}
              </p>
              <p className="text-xs font-bold mt-1 text-zinc-500">
                {selectedFile
                  ? selectedFile.name
                  : ".DWG, .SVG, .PDF, .PNG, or .ECHONAV"}
              </p>
            </div>
          </div>

          <DialogFooter className="p-6 pt-0 border-t-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 mt-auto flex-row justify-end gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-2 border-zinc-950 dark:border-zinc-700 font-bold uppercase text-[11px] tracking-wider h-10  dark:shadow-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !newFloorLabel.trim() || !selectedFile}
              className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white font-black uppercase text-[11px] tracking-wider h-10  dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Floor Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FINAL SHADCN ALERT DIALOG */}
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
    </>
  );
}
