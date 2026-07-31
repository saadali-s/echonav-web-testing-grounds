import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Hand,
  MapPin,
  MousePointer2,
  Navigation,
  Route,
  Ruler,
} from "lucide-react";

export type ToolMode =
  | "SELECT"
  | "PAN"
  | "NODE"
  | "EDGE"
  | "HAZARD"
  | "SCALE"
  | "ROUTE";

export function Toolbelt({
  activeTool,
  setActiveTool,
}: {
  activeTool: ToolMode;
  setActiveTool: (t: ToolMode) => void;
}) {
  const router = useRouter();

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
      <div className="w-full flex justify-center border-b-2 border-zinc-800 pb-4 mb-2">
        <button
          onClick={() => router.back()}
          title="Go Back"
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white text-zinc-950  hover:bg-zinc-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      </div>

      {tools.map((t) => {
        const Icon = t.icon;
        const isActive = activeTool === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            title={t.label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isActive
                ? "bg-white text-zinc-950 "
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}
