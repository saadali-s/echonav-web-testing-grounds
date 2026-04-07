import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Hand, MapPin, MousePointer2, Route, Ruler, TriangleAlert } from "lucide-react";

// Added "PAN" to the ToolMode types
export type ToolMode = "SELECT" | "PAN" | "SCALE" | "NODE" | "EDGE" | "HAZARD";

interface ToolbeltProps {
  activeTool: ToolMode;
  setActiveTool: (tool: ToolMode) => void;
}

export function Toolbelt({ activeTool, setActiveTool }: ToolbeltProps) {
  const tools = [
    { id: "SELECT", icon: MousePointer2, label: "Select (V)", name: "Select" },
    { id: "PAN", icon: Hand, label: "Pan Canvas (H)", name: "Pan" }, // NEW TOOL
    { id: "SCALE", icon: Ruler, label: "Scale Ruler (S)", name: "Scale" },
    { id: "NODE", icon: MapPin, label: "Node Tool (N)", name: "Node" },
    { id: "EDGE", icon: Route, label: "Edge Tool (E)", name: "Edge" },
    { id: "HAZARD", icon: TriangleAlert, label: "Hazard Toggle (H)", name: "Hazard" },
  ] as const;

  return (
    <div className="w-16 shrink-0 bg-white dark:bg-zinc-950 border-r-2 border-zinc-950 dark:border-zinc-800 flex flex-col items-center py-4 gap-5 z-10 overflow-y-auto">
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;
        const Icon = tool.icon;
        
        return (
          <div key={tool.id} className="flex flex-col items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTool(tool.id)}
              title={tool.label}
              className={cn(
                "h-10 w-10 rounded-xl transition-all border-2",
                isActive 
                  ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-950 dark:border-zinc-700 text-zinc-950 dark:text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none" 
                  : "border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 dark:text-zinc-400 dark:hover:text-zinc-100"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-zinc-950 dark:text-white" : "")} />
            </Button>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-wider transition-colors",
              isActive ? "text-zinc-950 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-600"
            )}>
              {tool.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}