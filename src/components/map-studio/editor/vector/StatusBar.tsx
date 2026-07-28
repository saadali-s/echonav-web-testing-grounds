export function StatusBar({ activeTool, nodeCount }: { activeTool: string; nodeCount: number }) {
  return (
    <div className="absolute bottom-4 left-4 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-lg px-4 py-2 text-[10px] font-black tracking-widest text-zinc-950 dark:text-zinc-100 dark:shadow-none uppercase z-50 pointer-events-none">
      Tool: {activeTool} <span className="mx-2 text-zinc-300 dark:text-zinc-700">|</span> Nodes: {nodeCount}
    </div>
  );
}