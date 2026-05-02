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

function BuildingForm() {
  const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [buildingName, setBuildingName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const streetInputRef = useRef<HTMLInputElement>(null);

  useGooglePlacesAutocomplete(streetInputRef, "", (details) => {
    setStreetAddress(details.streetAddress);
    setCity(details.city);
    setStateProvince(details.stateProvince);
    setPostalCode(details.postalCode);
  });

  return (
    <>
      <div className="grid gap-6 p-6">
        <div className="grid gap-2">
          <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">
            Building Name
          </Label>
          <Input
            placeholder="e.g., Science Block"
            className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] focus-visible:ring-0 font-medium"
            value={buildingName}
            onChange={(e) => setBuildingName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">
            Street Address
          </Label>
          <Input
            ref={streetInputRef}
            placeholder="Search any global address..."
            className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] focus-visible:ring-0 font-medium"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">City</Label>
            <Input
              className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] focus-visible:ring-0 font-medium"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">State / Prov</Label>
            <Input
              className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] focus-visible:ring-0 font-medium"
              value={stateProvince}
              onChange={(e) => setStateProvince(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">Zip Code</Label>
            <Input
              className="border-2 border-zinc-950 dark:border-zinc-800 rounded-lg shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] focus-visible:ring-0 font-medium"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="font-black uppercase text-[11px] tracking-wider text-zinc-600 dark:text-zinc-400">
            Default Privacy Level
          </Label>
          <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 px-3 py-2.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-800 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] w-fit">
            <span className={`text-[11px] font-black tracking-widest uppercase ${privacy === "PUBLIC" ? "text-emerald-600" : "text-amber-600"}`}>
              {privacy}
            </span>
            <Switch
              checked={privacy === "PUBLIC"}
              onCheckedChange={(checked) => setPrivacy(checked ? "PUBLIC" : "PRIVATE")}
              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-amber-500 border-2 border-zinc-950 m-0"
            />
          </div>
        </div>
      </div>

      <DialogFooter className="p-6 pt-0 border-t-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 mt-auto flex-row justify-end gap-3 sm:gap-0">
        <Button variant="outline" className="border-2 border-zinc-950 dark:border-zinc-700 font-bold uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
          Cancel
        </Button>
        <Button className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white font-black uppercase text-[11px] tracking-wider h-10 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none">
          Register Building
        </Button>
      </DialogFooter>
    </>
  );
}

export function CreateBuilding() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-bold h-11 px-6 shrink-0 transition-transform active:translate-y-1">
          <Plus className="h-4 w-4 mr-3" />
          ADD NEW BUILDING
        </Button>
      </DialogTrigger>

      <DialogContent
        // Prevents focus from snapping back to Dialog and canceling the Google selection
        onFocusOutside={(e) => {
          if (e.target instanceof Element && e.target.closest(".pac-container")) {
            e.preventDefault();
          }
        }}
        // Prevents closing when clicking the dropdown
        onInteractOutside={(e) => {
          if (e.target instanceof Element && e.target.closest(".pac-container")) {
            e.preventDefault();
          }
        }}
        // Ensures the selection click reaches the dropdown items
        onPointerDownOutside={(e) => {
          if (e.target instanceof Element && e.target.closest(".pac-container")) {
            e.preventDefault();
          }
        }}
        className="sm:max-w-[500px] border-2 border-zinc-950 dark:border-zinc-800 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-xl p-0 overflow-hidden"
      >
        <DialogHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b-2 border-zinc-950 dark:border-zinc-800 p-6 pb-5">
          <DialogTitle className="font-black uppercase tracking-wider text-lg">Add New Building</DialogTitle>
          <DialogDescription className="font-bold text-zinc-500 text-xs mt-1">Register a physical building profile.</DialogDescription>
        </DialogHeader>
        <BuildingForm />
      </DialogContent>
    </Dialog>
  );
}