import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, MousePointer2, Route, Save } from "lucide-react";
import { NodeData } from "./vector/types";

export type SelectionType = "NODE" | "EDGE" | null;

interface InspectorProps {
  selectionType: SelectionType;
  selectedNode?: NodeData;
  updateNode?: (updates: Partial<NodeData>) => void;
  onSave?: () => void;
}

function EmptyState() {
  return (
    <div className="w-80 shrink-0 bg-white dark:bg-zinc-950 border-l-2 border-zinc-950 dark:border-zinc-800 flex flex-col items-center justify-center p-6 text-center z-10">
      <div className="w-16 h-16 rounded-2xl border-2 border-zinc-950 dark:border-zinc-800 flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-zinc-50 dark:bg-zinc-900">
        <MousePointer2 className="h-8 w-8 text-zinc-950 dark:text-zinc-100" />
      </div>
      <h3 className="text-sm font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest mb-2">Nothing Selected</h3>
      <p className="text-xs font-bold text-zinc-500 leading-relaxed max-w-50">
        Click a node or edge on the canvas to inspect and edit its properties.
      </p>
    </div>
  );
}

function NodeInspector({ node, updateNode, onSave }: { node?: NodeData, updateNode?: (u: Partial<NodeData>) => void, onSave?: () => void }) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-5 space-y-6 flex-1 overflow-y-auto">
        
        {/* Added Node Label Editor */}
        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Node Label (Name)</Label>
          <Input 
            value={node?.label || ""}
            onChange={(e) => updateNode?.({ label: e.target.value })}
            onBlur={onSave} // Saves to history stack when you click away
            placeholder="e.g., Lobby Entrance" 
            className="text-sm font-bold bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl h-11 focus-visible:ring-0 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all"
          />
        </div>

        <div className="h-0.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />

        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Verbal Guidance (TTS)</Label>
          <Textarea 
            placeholder="e.g., You are passing the Science Lab on your right." 
            className="resize-none h-24 text-sm font-medium bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all p-3"
          />
        </div>

        <div className="h-0.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />

        <div className="space-y-4">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Hardware Binding</Label>
          <div className="space-y-3">
            <Input placeholder="UUID" className="text-xs font-mono font-bold bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-lg h-11 focus-visible:ring-0 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all" />
            <div className="flex gap-3">
              <Input placeholder="Major" className="text-xs font-mono font-bold bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-lg h-11 focus-visible:ring-0 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all" />
              <Input placeholder="Minor" className="text-xs font-mono font-bold bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-lg h-11 focus-visible:ring-0 shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EdgeInspector() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-5 space-y-6 flex-1 overflow-y-auto">
        <div className="space-y-3">
          <Label className="text-[10px] font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Calculated Distance</Label>
          <div className="flex items-center gap-3">
            <Input readOnly value="14.2" className="text-xl font-black bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl w-28 h-14 text-center shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none focus-visible:ring-0" />
            <span className="text-sm font-black text-zinc-950 dark:text-zinc-100 uppercase tracking-widest">Meters</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InspectorPanel({ selectionType, selectedNode, updateNode, onSave }: InspectorProps) {
  if (!selectionType) return <EmptyState />;
  const isNode = selectionType === "NODE";

  return (
    <div className="w-80 shrink-0 bg-white dark:bg-zinc-950 border-l-2 border-zinc-950 dark:border-zinc-800 flex flex-col z-10">
      <div className="p-5 border-b-2 border-zinc-950 dark:border-zinc-800 flex items-center gap-4 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="w-12 h-12 rounded-xl border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none shrink-0">
          {isNode ? <MapPin className="h-5 w-5 text-zinc-950 dark:text-white" /> : <Route className="h-5 w-5 text-zinc-950 dark:text-white" />}
        </div>
        <div className="min-w-0">
          <h3 className="font-black text-sm text-zinc-950 dark:text-zinc-100 uppercase tracking-wider truncate">{isNode ? "Virtual Node" : "Walking Path"}</h3>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 truncate">ID: {selectedNode?.id || "E-993A-X1"}</p>
        </div>
      </div>

      {isNode ? <NodeInspector node={selectedNode} updateNode={updateNode} onSave={onSave} /> : <EdgeInspector />}

      <div className="p-5 border-t-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shrink-0">
        <Button onClick={onSave} className="w-full bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-black tracking-widest uppercase h-12 rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none gap-2">
          <Save className="h-4 w-4" /> Save Properties
        </Button>
      </div>
    </div>
  );
}