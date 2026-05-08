"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioTower, Loader2 } from "lucide-react";

export interface InventoryItem {
  id: string;
  nodeLabel: string;
  beaconId: string;
  rssi: number;
}

export function HardwareInventory({
  items,
  isLoading,
}: {
  items: InventoryItem[];
  isLoading?: boolean;
}) {
  return (
    <Card className="relative h-full flex flex-col rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] text-zinc-950 dark:text-white pointer-events-none" />

      <CardHeader className="relative z-10 border-b-2 border-zinc-950 dark:border-zinc-800 bg-emerald-300 dark:bg-emerald-900 pb-4 p-5 rounded-t-lg">
        <CardTitle className="font-black uppercase tracking-wider text-sm flex items-center gap-2 text-emerald-1050 dark:text-emerald-100">
          <RadioTower className="h-5 w-5" />
          Verified Hardware Inventory
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-800 dark:text-emerald-200 ml-auto" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 flex-1 p-0 overflow-y-auto bg-white dark:bg-zinc-950">
        {isLoading ? (
          // --- THE SKELETON LOADER ---
          <div className="flex flex-col p-6 space-y-4">
            {[1, 2, 3].map((skeleton) => (
              <div
                key={skeleton}
                className="flex justify-between items-center animate-pulse border-b-2 border-zinc-100 dark:border-zinc-800 pb-4"
              >
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-24"></div>
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          // --- THE EMPTY STATE ---
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-950">
            <div className="w-16 h-16 rounded-xl border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center bg-white dark:bg-zinc-900 mb-4 rotate-3">
              <RadioTower className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
            </div>
            <p className="font-black text-lg text-zinc-950 dark:text-zinc-100 uppercase tracking-tight">
              Mapping in progress.
            </p>
            <p className="text-xs font-bold text-zinc-500 mt-2 max-w-sm uppercase tracking-widest leading-relaxed">
              Assign tasks to staff in the Deployment tab to begin populating
              your inventory.
            </p>
          </div>
        ) : (
          // --- THE ACTUAL DATA ---
          <div className="min-w-150">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-4 border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-[11px] font-black text-zinc-600 dark:text-zinc-400 uppercase tracking-wider sticky top-0">
              <span>Node Label</span>
              <span>Physical Beacon ID</span>
              <span className="text-right">Calibrated RSSI</span>
            </div>
            <div className="flex flex-col">
              {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-[1fr_1fr_auto] gap-4 px-6 py-5 items-center hover:bg-emerald-300/20 dark:hover:bg-emerald-950/20 transition-colors ${!isLast ? "border-b-2 border-zinc-100 dark:border-zinc-800" : ""}`}
                  >
                    <span className="font-black text-sm text-zinc-950 dark:text-zinc-100 uppercase">
                      {item.nodeLabel}
                    </span>
                    <div>
                      <span className="font-mono text-[11px] font-black text-zinc-950 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none px-2.5 py-1.5 rounded-md inline-flex w-fit uppercase">
                        {item.beaconId}
                      </span>
                    </div>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-500 text-right">
                      {item.rssi} dBm
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
