import { AlertTriangle, Hand, MapPin, MousePointer2, Navigation, Route, Ruler } from "lucide-react";

export type ToolMode = "SELECT" | "PAN" | "NODE" | "EDGE" | "HAZARD" | "SCALE" | "ROUTE";

export function Toolbelt({ activeTool, setActiveTool }: { activeTool: ToolMode, setActiveTool: (t: ToolMode) => void }) {
  const tools = [
    { id: "SELECT", icon: MousePointer2, label: "Select (V)" },
    { id: "PAN", icon: Hand, label: "Pan (Space)" },
    { id: "NODE", icon: MapPin, label: "Add Node (N)" },
    { id: "EDGE", icon: Route, label: "Connect (E)" },
    { id: "HAZARD", icon: AlertTriangle, label: "Toggle Hazard (H)" },
    { id: "SCALE", icon: Ruler, label: "Calibrate Scale (C)" },
    { id: "ROUTE", icon: Navigation, label: "Simulate Route (R)" },
  ] as const;

  return (
    <div className="w-16 bg-zinc-950 flex flex-col items-center py-4 gap-2 border-r-2 border-zinc-800 z-20 shrink-0">
      {tools.map((t) => {
        const Icon = t.icon;
        const isActive = activeTool === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            title={t.label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isActive ? "bg-white text-zinc-950 shadow-[2px_2px_0px_0px_rgba(161,161,170,1)]" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}