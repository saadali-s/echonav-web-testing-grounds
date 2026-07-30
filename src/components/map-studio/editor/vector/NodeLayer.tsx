import { NodeData } from "./types";

interface NodeLayerProps {
  nodes: NodeData[];
  selectedNodeIds: string[];
  scale: number;
}

export function NodeLayer({ nodes, selectedNodeIds, scale }: NodeLayerProps) {
  return (
    <>
      {nodes.map((node) => {
        const isSelected = selectedNodeIds.includes(node.id);
        return (
          <div
            key={node.id}
            className="absolute pointer-events-none flex flex-col items-center"
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,

              transform: `translate(-50%, -100%) scale(${1 / scale})`,
              transformOrigin: "bottom center",
              zIndex: isSelected ? 50 : 10,
            }}
          >
            <div
              className={`mb-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md border-2 whitespace-nowrap transition-colors ${isSelected ? "bg-indigo-500 text-white border-indigo-700 " : "bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white border-zinc-950 dark:border-zinc-800  dark:shadow-none"}`}
            >
              {node.label}
            </div>

            <div
              className={`relative flex items-center justify-center transition-transform origin-bottom ${isSelected ? "scale-125" : "hover:scale-110"}`}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`drop-shadow-md ${node.isHazard ? "text-red-500 fill-red-100 dark:fill-red-950" : isSelected ? "text-indigo-600 fill-indigo-100 dark:fill-indigo-900" : "text-zinc-950 dark:text-zinc-100 fill-white dark:fill-zinc-900"}`}
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle
                  cx="12"
                  cy="10"
                  r="3"
                  className={
                    node.isHazard
                      ? "fill-red-500"
                      : isSelected
                        ? "fill-indigo-600"
                        : "fill-zinc-950 dark:fill-zinc-100"
                  }
                ></circle>
              </svg>
            </div>
          </div>
        );
      })}
    </>
  );
}
