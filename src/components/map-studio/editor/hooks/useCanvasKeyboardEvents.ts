import { useEffect } from "react";
import { ToolMode } from "../Toolbelt";
import { EdgeData, NodeData } from "../vector/types";

interface UseCanvasKeyboardEventsProps {
  state: any; // The state object returned from useEditorState
  nodes: NodeData[];
  edges: EdgeData[];
  pushHistory: (n: NodeData[], e: EdgeData[]) => void;
  undo: () => void;
  redo: () => void;
}

export function useCanvasKeyboardEvents({ state, nodes, edges, pushHistory, undo, redo }: UseCanvasKeyboardEventsProps) {
  useEffect(() => {
    const handleDeleteSelection = () => {
      if (state.selection === "NODE" && state.selectedNodeIds.length > 0) {
        const newNodes = nodes.filter((n) => !state.selectedNodeIds.includes(n.id));
        const newEdges = edges.filter((e) => !state.selectedNodeIds.includes(e.source) && !state.selectedNodeIds.includes(e.target));
        pushHistory(newNodes, newEdges);
        state.clearSelection();
      } else if (state.selection === "EDGE" && state.selectedEdgeIds.length > 0) {
        const newEdges = edges.filter((e) => !state.selectedEdgeIds.includes(e.id));
        pushHistory(nodes, newEdges);
        state.clearSelection();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTypingInInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if (e.code === "Space" && target === document.body) {
        e.preventDefault();
        state.setIsSpacePressed(true);
      }
      
      if (!isTypingInInput) {
        if (e.code === "Delete" || e.code === "Backspace") {
          handleDeleteSelection();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") state.setIsSpacePressed(false);
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [state, nodes, edges, pushHistory, undo, redo]);
}