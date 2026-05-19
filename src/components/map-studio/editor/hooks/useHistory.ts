import { useCallback, useState } from "react";
import { EdgeData, NodeData } from "../vector/types";

export function useHistory(initialNodes: NodeData[], initialEdges: EdgeData[]) {
  const [history, setHistory] = useState<{ nodes: NodeData[]; edges: EdgeData[] }[]>([
    { nodes: initialNodes, edges: initialEdges }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback((newNodes: NodeData[], newEdges: EdgeData[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ nodes: newNodes, edges: newEdges });
      return newHistory;
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => { 
    if (historyIndex > 0) setHistoryIndex((prev) => prev - 1); 
  }, [historyIndex]);

  const redo = useCallback(() => { 
    if (historyIndex < history.length - 1) setHistoryIndex((prev) => prev + 1); 
  }, [historyIndex, history.length]);

  const resetHistory = useCallback((nodes: NodeData[], edges: EdgeData[]) => {
    setHistory([{ nodes, edges }]);
    setHistoryIndex(0);
  }, []);

  const currentHistory = history[historyIndex] || { nodes: [], edges: [] };

  return {
    nodes: currentHistory.nodes,
    edges: currentHistory.edges,
    pushHistory,
    undo,
    redo,
    resetHistory,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1
  };
}