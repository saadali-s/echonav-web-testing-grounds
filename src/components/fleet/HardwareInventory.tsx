"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, RadioTower, Search } from "lucide-react";
import { useMemo, useState } from "react";

export interface InventoryItem {
  id: string;
  nodeLabel: string;
  beaconId: string | null | undefined;
  rssi: number | null | undefined;
  status: "ACTIVE" | "UNLINKED";
}

export function HardwareInventory({
  items,
  isLoading,
}: {
  items: InventoryItem[];
  isLoading?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "UNLINKED">("ALL");

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
      const matchSearch = !q || 
        item.nodeLabel.toLowerCase().includes(q) || 
        (item.beaconId && item.beaconId.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [items, search, statusFilter]);

  const activeCount = items.filter((i) => i.status === "ACTIVE").length;
  const unlinkedCount = items.filter((i) => i.status === "UNLINKED").length;

  return (
    <Card className="h-full flex flex-col rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
      
      {/* Header & Controls Area */}
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-emerald-300 dark:bg-emerald-900 pb-6 p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="font-black uppercase tracking-wider text-xl flex items-center gap-3 text-emerald-950 dark:text-emerald-100">
              <RadioTower className="h-6 w-6" />
              Hardware Databank
              {isLoading && <Loader2 className="h-5 w-5 animate-spin text-emerald-800 dark:text-emerald-200 ml-2" />}
            </CardTitle>
            
            {/* Summary Chips */}
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-white/50 dark:bg-zinc-950/50 border-2 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 px-3 py-1 font-black uppercase text-[10px] tracking-widest">
                Total: {items.length}
              </Badge>
              <Badge variant="outline" className="bg-emerald-100 dark:bg-emerald-800 border-2 border-emerald-950 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 px-3 py-1 font-black uppercase text-[10px] tracking-widest">
                Active: {activeCount}
              </Badge>
              <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 border-2 border-amber-900 dark:border-amber-600 text-amber-900 dark:text-amber-100 px-3 py-1 font-black uppercase text-[10px] tracking-widest">
                Unlinked: {unlinkedCount}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-950/50 dark:text-emerald-200/50" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Node Label or Beacon ID..."
                className="w-full rounded-lg border-2 border-emerald-950 dark:border-emerald-700 bg-white dark:bg-zinc-950 pl-10 pr-4 py-3 text-sm font-bold text-zinc-900 dark:text-zinc-100 placeholder:text-emerald-950/50 dark:placeholder:text-emerald-200/50 outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              {(["ALL", "ACTIVE", "UNLINKED"] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setStatusFilter(opt)}
                  className={`px-4 py-3 rounded-lg border-2 font-black uppercase text-[10px] tracking-widest transition-colors ${
                    statusFilter === opt
                      ? "bg-emerald-950 text-white border-emerald-950 dark:bg-emerald-100 dark:text-emerald-950"
                      : "bg-white dark:bg-zinc-950 text-emerald-950 dark:text-emerald-100 border-emerald-950/30 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-y-auto bg-white dark:bg-zinc-950">
        {isLoading ? (
          <div className="flex flex-col p-6 space-y-6">
            {[1, 2, 3, 4].map((skeleton) => (
              <div key={skeleton} className="flex justify-between items-center animate-pulse border-b-2 border-zinc-100 dark:border-zinc-800 pb-4">
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-20"></div>
                <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-32"></div>
                <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-zinc-50/50 dark:bg-zinc-950">
            <div className="w-16 h-16 rounded-xl border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center bg-white dark:bg-zinc-900 mb-4">
              <Search className="h-8 w-8 text-zinc-400 dark:text-zinc-600" />
            </div>
            <p className="font-black text-lg text-zinc-950 dark:text-zinc-100 uppercase tracking-tight">
              No Hardware Matches
            </p>
            <p className="text-xs font-bold text-zinc-500 mt-2 max-w-sm uppercase tracking-widest leading-relaxed">
              Adjust your search filters or map new nodes in the Studio.
            </p>
          </div>
        ) : (
          <div className="min-w-[800px]">
            <div className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-6 px-8 py-4 border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-[11px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider sticky top-0 z-10">
              <span>Node Label</span>
              <span>Status</span>
              <span>Physical Beacon ID</span>
              <span className="text-right">Calibrated RSSI</span>
            </div>
            <div className="flex flex-col">
              {filteredItems.map((item, index) => {
                const isLast = index === filteredItems.length - 1;
                const isActive = item.status === "ACTIVE";
                
                return (
                  <div
                    key={item.id}
                    className={`grid grid-cols-[2fr_1fr_2fr_1fr] gap-6 px-8 py-5 items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors ${!isLast ? "border-b border-zinc-200 dark:border-zinc-800" : ""}`}
                  >
                    <span className="font-black text-sm text-zinc-950 dark:text-zinc-100 uppercase">
                      {item.nodeLabel}
                    </span>
                    
                    <div>
                      <Badge 
                        variant="outline" 
                        className={`font-black text-[10px] uppercase tracking-wider border-2 flex items-center gap-1.5 w-fit ${
                          isActive 
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800" 
                            : "bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-700"
                        }`}
                      >
                        {isActive ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {item.status}
                      </Badge>
                    </div>

                    <div>
                      {item.beaconId ? (
                        <span className="font-mono text-xs font-black text-zinc-950 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none px-3 py-1.5 rounded-md inline-flex w-fit uppercase">
                          {item.beaconId}
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-black text-zinc-400 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-300 dark:border-zinc-700 px-3 py-1.5 rounded-md inline-flex w-fit uppercase">
                          PENDING LINK
                        </span>
                      )}
                    </div>

                    <span className={`text-lg font-black text-right ${isActive ? "text-emerald-600 dark:text-emerald-500" : "text-zinc-300 dark:text-zinc-700"}`}>
                      {item.rssi ? `${item.rssi} dBm` : "---"}
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