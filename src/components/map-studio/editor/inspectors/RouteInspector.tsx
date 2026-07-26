import { Label } from "@/components/ui/label";
import { NodeDto, RouteResponse } from "@/lib/api/types";
import { Clock, Zap } from "lucide-react";

export function RouteInspector({ start, end, route, isCalculating }: { start?: string | null, end?: string | null, route?: RouteResponse | null, isCalculating?: boolean }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="p-5 space-y-6">
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase text-zinc-500">Route Waypoints</Label>
          <div className="space-y-2">
            <div className={`p-3 border-2 rounded-xl text-sm font-bold truncate ${start ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'border-zinc-950 bg-zinc-100 dark:bg-zinc-900'}`}>
              <span className="text-[10px] uppercase opacity-70 block mb-0.5">Start</span>
              {start || "Click a starting node..."}
            </div>
            <div className={`p-3 border-2 rounded-xl text-sm font-bold truncate ${end ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' : 'border-zinc-950 bg-zinc-100 dark:bg-zinc-900'}`}>
              <span className="text-[10px] uppercase opacity-70 block mb-0.5">Destination</span>
              {end || "Click an ending node..."}
            </div>
          </div>
        </div>

        {isCalculating && (
          <div className="flex items-center justify-center p-4 border-2 border-dashed border-zinc-300 rounded-xl bg-zinc-50">
            <Zap className="h-5 w-5 text-purple-500 animate-bounce mr-2" />
            <span className="text-xs font-black uppercase tracking-wider text-purple-700">Running Dijkstra...</span>
          </div>
        )}

        {route && !isCalculating && route.status !== "NO_PATH_FOUND" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-purple-600 text-white p-3 rounded-xl border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Distance</div>
                  <div className="text-lg font-black">{route.totalDistanceMeters.toFixed(1)}m</div>
               </div>
               <div className="bg-zinc-950 text-white p-3 rounded-xl border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)]">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1 flex items-center"><Clock className="w-3 h-3 mr-1"/> ETA</div>
                  <div className="text-lg font-black">{Math.ceil(route.estimatedTimeSeconds)}s</div>
               </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label className="text-[10px] font-black uppercase text-zinc-500">Turn-by-Turn</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {route.path.map((step: NodeDto, idx: number) => (
                  <div key={idx} className="bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg text-xs font-bold flex gap-3">
                    <span className="bg-zinc-950 text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0">{idx + 1}</span>
                    <span className="mt-0.5">{step.ttsVerbalGuidance || `Proceed to ${step.label}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {route && route.status === "NO_PATH_FOUND" && (
            <div className="p-4 border-2 border-red-500 bg-red-50 text-red-700 rounded-xl text-xs font-bold uppercase tracking-wider text-center">
              No continuous path exists between these points.
            </div>
        )}
      </div>
    </div>
  );
}