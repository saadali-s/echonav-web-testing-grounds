import { MousePointer2 } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl border-2 border-zinc-950 dark:border-zinc-800 flex items-center justify-center mb-6 bg-zinc-50 dark:bg-zinc-900">
        <MousePointer2 className="h-8 w-8 text-zinc-950 dark:text-zinc-100" />
      </div>
      <h3 className="text-sm font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest mb-2">Nothing Selected</h3>
      <p className="text-xs font-bold text-zinc-500 leading-relaxed max-w-50">Click a node or edge to inspect.</p>
    </div>
  );
}