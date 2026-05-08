"use client";

import { Progress } from "@/components/ui/progress";
import { Layers, Map } from "lucide-react";
import { useEffect, useState } from "react";
import { Toolbelt, ToolMode } from "./Toolbelt";
import { VectorComposer } from "./VectorComposer";

export function GraphEditorComposer() {
  const [activeTool, setActiveTool] = useState<ToolMode>("SELECT");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500); 
          return 100;
        }
        return Math.min(oldProgress + Math.random() * 20, 100);
      });
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col relative rounded-xl border-2 border-zinc-950 dark:border-zinc-800 overflow-hidden shadow-[6px_6px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950">
      
      {/* Clean Top Bar for the Canvas */}
      <div className="h-14 border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Map className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          <span className="font-black uppercase tracking-wider text-sm text-zinc-950 dark:text-zinc-100">
            Science Block - Floor 2
          </span>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-50 bg-zinc-950 flex flex-col items-center justify-center p-6">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 border-2 border-zinc-700 shadow-[4px_4px_0px_0px_rgba(63,63,70,1)]">
            <Layers className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white mb-2 uppercase">Vectorizing Layers</h2>
          <p className="text-sm font-bold text-zinc-400 mb-8 max-w-sm text-center">
            Extracting pathways and establishing the spatial grid structure. Please wait.
          </p>
          <div className="w-full max-w-md space-y-2">
            <Progress value={progress} className="h-3 rounded-full bg-zinc-800 border-2 border-zinc-700" />
            <div className="flex justify-between text-xs font-black text-zinc-500 tracking-widest">
              <span>PROCESSING DWG</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <Toolbelt activeTool={activeTool} setActiveTool={setActiveTool} />
        <VectorComposer activeTool={activeTool} />
      </div>
    </div>
  );
} 