"use client";

import React, { useState, useRef } from "react";
import { Plus } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { useGooglePlacesAutocomplete } from "@/hooks/AutoAddressGoogleMaps";
import { BuildingData } from "./BuildingCard";

interface CreateBuildingProps {
  onAdd: (building: Omit<BuildingData, "id" | "stats" | "health" | "updatedAt">) => void;
}

function BuildingForm({ onAdd, onClose }: { onAdd: any; onClose: () => void }) {
  const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateProv, setStateProv] = useState("");
  const [zip, setZip] = useState("");

  const streetInputRef = useRef<HTMLInputElement>(null);

  // Robust Google Autocomplete
  useGooglePlacesAutocomplete(streetInputRef, "", (details) => {
    setStreet(details.streetAddress);
    setCity(details.city);
    setStateProv(details.stateProvince);
    setZip(details.postalCode);
  });

  const handleRegister = () => {
    if (!name || !street) return;

    // Construct the display address for the card
    const fullAddress = `${street}${city ? `, ${city}` : ""}${zip ? `, ${zip}` : ""}`;
    
    onAdd({
      name,
      address: fullAddress,
      privacy,
    });
    onClose();
  };

  return (
    <>
      <div className="grid gap-6 p-6">
        <div className="grid gap-2">
          <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">
            Building Name
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Science Block"
            className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] focus-visible:ring-0 font-medium"
          />
        </div>

        <div className="grid gap-2">
          <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">
            Street Address
          </Label>
          <Input
            ref={streetInputRef}
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Search address..."
            className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] focus-visible:ring-0 font-medium"
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">City</Label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] focus-visible:ring-0 font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">State</Label>
            <Input
              value={stateProv}
              onChange={(e) => setStateProv(e.target.value)}
              className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] focus-visible:ring-0 font-medium"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">Zip</Label>
            <Input
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] focus-visible:ring-0 font-medium"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">
            Privacy Level
          </Label>
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-3 py-2.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] w-fit">
            <span className={`text-[11px] font-black tracking-widest uppercase ${privacy === "PUBLIC" ? "text-emerald-600" : "text-amber-600"}`}>
              {privacy}
            </span>
            <Switch
              checked={privacy === "PUBLIC"}
              onCheckedChange={(c) => setPrivacy(c ? "PUBLIC" : "PRIVATE")}
              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-amber-500 border-2 border-zinc-950 m-0"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="p-6 pt-0 border-t-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 mt-auto flex-row justify-end gap-3 sm:gap-0">
        <Button 
          type="button"
          onClick={handleRegister} 
          className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white font-black uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none"
        >
          Register Building
        </Button>
      </DialogFooter>
    </>
  );
}

export function CreateBuilding({ onAdd }: CreateBuildingProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0 uppercase tracking-wider text-xs">
          <Plus className="h-4 w-4 mr-2" />
          ADD NEW BUILDING
        </Button>
      </DialogTrigger>

      <DialogContent
        onFocusOutside={(e) => { if (e.target instanceof Element && e.target.closest(".pac-container")) e.preventDefault(); }}
        onInteractOutside={(e) => { if (e.target instanceof Element && e.target.closest(".pac-container")) e.preventDefault(); }}
        onPointerDownOutside={(e) => { if (e.target instanceof Element && e.target.closest(".pac-container")) e.preventDefault(); }}
        className="sm:max-w-[500px] border-2 border-zinc-950 dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-xl p-0 overflow-hidden"
      >
        <DialogHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b-2 border-zinc-950 dark:border-zinc-800 p-6 pb-5">
          <DialogTitle className="font-black uppercase tracking-wider text-lg">Add New Building</DialogTitle>
          <DialogDescription className="font-bold text-zinc-500 text-xs mt-1">
            Register a physical building profile.
          </DialogDescription>
        </DialogHeader>
        
        <BuildingForm onAdd={onAdd} onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}