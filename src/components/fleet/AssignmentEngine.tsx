"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Send, Users } from "lucide-react";
import { useState } from "react";

export interface UnassignedNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface AssignmentProps {
  nodes: UnassignedNode[];
  staff: { id: string; name: string }[];
}

export function AssignmentEngine({ nodes, staff }: AssignmentProps) {
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (id: string) => {
    const newSelected = new Set(selectedNodes);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedNodes(newSelected);
  };

  const toggleAll = () => {
    if (selectedNodes.size === nodes.length) setSelectedNodes(new Set());
    else setSelectedNodes(new Set(nodes.map(n => n.id)));
  };

  return (
    <Card className="h-full flex flex-col rounded-xl border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none bg-white dark:bg-zinc-950 overflow-hidden">
      <CardHeader className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="font-black uppercase tracking-wider text-sm text-zinc-950 dark:text-zinc-100">Virtual Node Browser</CardTitle>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Select unassigned nodes for deployment.</p>
          </div>
          <Select defaultValue="floor-2">
            <SelectTrigger className="w-full sm:w-55 bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-lg h-10">
              <SelectValue placeholder="Select Floor Plan" />
            </SelectTrigger>
            <SelectContent className="border-2 border-zinc-950 font-bold">
              <SelectItem value="floor-2" className="text-xs uppercase font-bold">Science Block - Floor 2</SelectItem>
              <SelectItem value="floor-1" className="text-xs uppercase font-bold">Library - Ground Floor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-y-auto">
        <div className="min-w-100">
          <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-5 py-3 border-b-2 border-zinc-950 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900 text-[11px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400 sticky top-0 z-10">
            <Checkbox 
              checked={selectedNodes.size === nodes.length && nodes.length > 0} 
              onCheckedChange={toggleAll}
              className="border-2 border-zinc-950 data-[state=checked]:bg-zinc-950" 
            />
            <span>Node Label</span>
            <span>Coordinates</span>
          </div>
          
          <div className="flex flex-col">
            {nodes.map((node, index) => {
              const isLast = index === nodes.length - 1;
              return (
                <label key={node.id} className={`grid grid-cols-[auto_1fr_auto] gap-4 px-5 py-4 items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors ${!isLast ? 'border-b-2 border-zinc-100 dark:border-zinc-800' : ''}`}>
                  <Checkbox 
                    checked={selectedNodes.has(node.id)} 
                    onCheckedChange={() => toggleNode(node.id)} 
                    className="border-2 border-zinc-950 data-[state=checked]:bg-zinc-950" 
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-white dark:bg-zinc-950 shrink-0">
                      <MapPin className="h-4 w-4 text-zinc-950 dark:text-zinc-100" />
                    </div>
                    <span className="text-sm font-black text-zinc-950 dark:text-zinc-100 uppercase">{node.label}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-bold bg-zinc-100 dark:bg-zinc-900 px-2 py-1 border-2 border-zinc-200 dark:border-zinc-800 rounded-md">X:{node.x} Y:{node.y}</span>
                </label>
              );
            })}
          </div>
        </div>
      </CardContent>

      <div className="p-5 border-t-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row gap-4 items-center shrink-0">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="w-10 h-10 rounded-lg border-2 border-zinc-950 bg-white dark:bg-zinc-950 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 text-zinc-950 dark:text-zinc-100" />
          </div>
          <Select>
            <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(24,24,27,1)] dark:shadow-none rounded-lg h-10">
              <SelectValue placeholder="Assign Technician..." />
            </SelectTrigger>
            <SelectContent className="border-2 border-zinc-950 font-bold">
              {staff.map(s => <SelectItem key={s.id} value={s.id} className="font-bold">{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button 
          disabled={selectedNodes.size === 0}
          className="w-full sm:w-auto bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-950 text-white rounded-lg font-black uppercase tracking-wider h-11 px-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] dark:shadow-none transition-transform active:translate-y-1 active:translate-x-1 active:shadow-none shrink-0"
        >
          <Send className="h-4 w-4 mr-2" />
          Create Tasks ({selectedNodes.size})
        </Button>
      </div>
    </Card>
  );
}