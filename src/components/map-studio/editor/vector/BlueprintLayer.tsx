export function BlueprintLayer() {
  return (
    <svg className="absolute inset-0 opacity-20 dark:opacity-40 overflow-visible pointer-events-none">
        <path d="M 100 100 L 700 100 L 700 500 L 400 500 L 400 300 L 100 300 Z" fill="none" stroke="currentColor" strokeWidth="4" className="text-zinc-950 dark:text-white" />
        <line x1="400" y1="100" x2="400" y2="300" stroke="currentColor" strokeWidth="2" className="text-zinc-950 dark:text-white" />
        <line x1="550" y1="100" x2="550" y2="500" stroke="currentColor" strokeWidth="2" className="text-zinc-950 dark:text-white" />
        <text x="250" y="200" fill="currentColor" className="text-zinc-950 dark:text-white font-black text-2xl tracking-widest opacity-50">LOBBY</text>
        <text x="475" y="200" fill="currentColor" className="text-zinc-950 dark:text-white font-black text-xl tracking-widest opacity-50">LAB 1</text>
        <text x="625" y="300" fill="currentColor" className="text-zinc-950 dark:text-white font-black text-xl tracking-widest opacity-50" transform="rotate(90 625 300)">CORRIDOR</text>
    </svg>
  );
}