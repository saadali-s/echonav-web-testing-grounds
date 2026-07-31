import { Button } from "@/components/ui/button";
import { Maximize, ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  scale: number;
  adjustZoomCentered: (factor: number) => void;
  resetZoom: () => void;
}

export function ZoomControls({
  scale,
  adjustZoomCentered,
  resetZoom,
}: ZoomControlsProps) {
  return (
    <div
      className="absolute top-4 right-4 flex items-center gap-1 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl p-1  dark:shadow-none z-50 pointer-events-auto"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        onClick={() => adjustZoomCentered(0.8)}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="text-[10px] font-black w-12 text-center text-zinc-950 dark:text-white">
        {Math.round(scale * 100)}%
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        onClick={() => adjustZoomCentered(1.2)}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <div className="w-0.5 h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
        onClick={resetZoom}
      >
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
}
