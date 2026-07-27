import { Button } from "@/components/ui/button";
import { Redo, Undo } from "lucide-react";

interface HistoryControlsProps {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function HistoryControls({ undo, redo, canUndo, canRedo }: HistoryControlsProps) {
  return (
    <div 
      className="absolute top-4 left-4 flex items-center gap-1 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl p-1 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none z-50 pointer-events-auto"
      onPointerDown={(e) => e.stopPropagation()} 
    >
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={undo} disabled={!canUndo}>
          <Undo className="h-4 w-4" />
      </Button>
      <div className="w-0.5 h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={redo} disabled={!canRedo}>
          <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}