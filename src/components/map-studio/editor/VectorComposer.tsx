"use client";

import { useEffect, useRef, useState } from "react";
import { InspectorPanel, SelectionType } from "./InspectorPanel";
import { BlueprintLayer } from "./vector/BlueprintLayer";
import { EdgeLayer } from "./vector/EdgeLayer";
import { HistoryControls } from "./vector/HistoryControls";
import { NodeLayer } from "./vector/NodeLayer";
import { StatusBar } from "./vector/StatusBar";
import { EdgeData, NodeData, VectorComposerProps } from "./vector/types";
import { ZoomControls } from "./vector/ZoomControls";

export function VectorComposer({ activeTool }: VectorComposerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // START EMPTY
  const [history, setHistory] = useState<{nodes: NodeData[], edges: EdgeData[]}[]>([{ nodes: [], edges: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  
  const [selection, setSelection] = useState<SelectionType>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);
  
  const [pan, setPan] = useState({ x: 100, y: 100 });
  const [scale, setScale] = useState(1);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState<{x: number, y: number} | null>(null);
  const [dragStartNodes, setDragStartNodes] = useState<{id: string, startX: number, startY: number}[] | null>(null);
  const [draftEdge, setDraftEdge] = useState<{ source: string; currentX: number; currentY: number } | null>(null);
  const [selectionBox, setSelectionBox] = useState<{startX: number, startY: number, currentX: number, currentY: number} | null>(null);

  const panRef = useRef(pan);
  const scaleRef = useRef(scale);
  useEffect(() => { panRef.current = pan; }, [pan]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);

  useEffect(() => {
    setNodes(history[historyIndex].nodes);
    setEdges(history[historyIndex].edges);
  }, [historyIndex, history]);

  const pushHistory = (newNodes: NodeData[], newEdges: EdgeData[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: newNodes, edges: newEdges });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => { if (historyIndex > 0) setHistoryIndex(historyIndex - 1); };
  const redo = () => { if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1); };

  const getLogicalCoords = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: (clientX - rect.left - pan.x) / scale, y: (clientY - rect.top - pan.y) / scale };
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { 
        if (e.code === 'Space' && e.target === document.body) { e.preventDefault(); setIsSpacePressed(true); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo(); }
    };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.code === 'Space') setIsSpacePressed(false); };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [historyIndex, history.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); 
      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = Math.max(0.1, Math.min(scaleRef.current * zoomFactor, 5));
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setScale(newScale);
        setPan({ 
            x: x - (x - panRef.current.x) * (newScale / scaleRef.current), 
            y: y - (y - panRef.current.y) * (newScale / scaleRef.current) 
        });
      } else {
        setPan(prev => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
      }
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    const logical = getLogicalCoords(e.clientX, e.clientY);

    if (e.button === 2) {
        setSelectionBox({ startX: logical.x, startY: logical.y, currentX: logical.x, currentY: logical.y });
        e.currentTarget.setPointerCapture(e.pointerId);
        return;
    }

    if (e.button === 1 || isSpacePressed || (activeTool === "SELECT" && e.shiftKey) || activeTool === "PAN") {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    const clickedNode = nodes.find(n => {
        const dx = n.x - logical.x;
        // The visual center of the pin head is approx 16px above the tip
        const dy = (n.y - 16) - logical.y; 
        return Math.sqrt(dx*dx + dy*dy) < 24 / scale;
    });

    if (clickedNode) {
      if (activeTool === "SELECT") {
        let newSelection = [...selectedNodeIds];
        if (!newSelection.includes(clickedNode.id)) {
            newSelection = [clickedNode.id];
            setSelectedNodeIds(newSelection);
            setSelectedEdgeIds([]);
            setSelection("NODE");
        }
        setDragStartNodes(nodes.filter(n => newSelection.includes(n.id)).map(n => ({ id: n.id, startX: n.x, startY: n.y })));
        setDragStartPos({ x: logical.x, y: logical.y });
      } else if (activeTool === "EDGE") {
        setDraftEdge({ source: clickedNode.id, currentX: clickedNode.x, currentY: clickedNode.y });
      } else if (activeTool === "HAZARD") {
        pushHistory(nodes.map(n => n.id === clickedNode.id ? { ...n, isHazard: !n.isHazard } : n), edges);
      }
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (activeTool === "NODE") {
      const newNode = { id: `n${Date.now()}`, x: logical.x, y: logical.y, label: `Node ${nodes.length + 1}` };
      pushHistory([...nodes, newNode], edges);
      setSelectedNodeIds([newNode.id]);
      setSelectedEdgeIds([]);
      setSelection("NODE");
    } else if (activeTool === "SELECT") {
      setSelectedNodeIds([]);
      setSelectedEdgeIds([]);
      setSelection(null);
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const logical = getLogicalCoords(e.clientX, e.clientY);
    if (isPanning) return setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    if (selectionBox) return setSelectionBox({ ...selectionBox, currentX: logical.x, currentY: logical.y });
    
    if (dragStartNodes && dragStartPos) {
      const deltaX = logical.x - dragStartPos.x;
      const deltaY = logical.y - dragStartPos.y;
      setNodes(nodes.map(n => {
        const startNode = dragStartNodes.find(d => d.id === n.id);
        return startNode ? { ...n, x: startNode.startX + deltaX, y: startNode.startY + deltaY } : n;
      }));
    }
    if (draftEdge) setDraftEdge({ ...draftEdge, currentX: logical.x, currentY: logical.y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPanning(false);

    if (selectionBox) {
        const minX = Math.min(selectionBox.startX, selectionBox.currentX);
        const maxX = Math.max(selectionBox.startX, selectionBox.currentX);
        const minY = Math.min(selectionBox.startY, selectionBox.currentY);
        const maxY = Math.max(selectionBox.startY, selectionBox.currentY);
        const insideNodes = nodes.filter(n => n.x >= minX && n.x <= maxX && n.y >= minY && n.y <= maxY).map(n => n.id);
        
        setSelectedNodeIds(insideNodes);
        setSelectedEdgeIds([]);
        setSelection(insideNodes.length === 1 ? "NODE" : null);
        setSelectionBox(null);
        return;
    }

    if (dragStartNodes) {
        if (dragStartPos && (Math.abs(getLogicalCoords(e.clientX, e.clientY).x - dragStartPos.x) > 1)) {
            pushHistory(nodes, edges);
        }
        setDragStartNodes(null);
        setDragStartPos(null);
    }

    if (draftEdge) {
      const logical = getLogicalCoords(e.clientX, e.clientY);
      const dropTarget = nodes.find(n => {
          const dx = n.x - logical.x;
          const dy = (n.y - 16) - logical.y; 
          return Math.sqrt(dx*dx + dy*dy) < 30 / scale;
      });
      
      if (dropTarget && dropTarget.id !== draftEdge.source) {
        const exists = edges.some(edge => 
            (edge.source === draftEdge.source && edge.target === dropTarget.id) ||
            (edge.target === draftEdge.source && edge.source === dropTarget.id)
        );
        if (!exists) {
            const newEdges = [...edges, { id: `e${Date.now()}`, source: draftEdge.source, target: dropTarget.id }];
            pushHistory(nodes, newEdges);
            setSelectedEdgeIds([newEdges[newEdges.length - 1].id]);
            setSelectedNodeIds([]);
            setSelection("EDGE");
        }
      }
      setDraftEdge(null);
    }
  };

  const handleEdgeClick = (e: React.PointerEvent, edgeId: string) => {
    e.stopPropagation(); 
    if (activeTool === "HAZARD") {
        pushHistory(nodes, edges.map(ed => ed.id === edgeId ? { ...ed, isHazard: !ed.isHazard } : ed));
    } else {
        setSelectedEdgeIds([edgeId]); 
        setSelectedNodeIds([]);
        setSelection("EDGE"); 
    }
  };

  const adjustZoomCentered = (factor: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newScale = Math.max(0.1, Math.min(scale * factor, 5));
    setPan({ 
        x: (rect.width / 2) - ((rect.width / 2) - pan.x) * (newScale / scale), 
        y: (rect.height / 2) - ((rect.height / 2) - pan.y) * (newScale / scale) 
    });
    setScale(newScale);
  };

  let cursorStyle = "cursor-default";
  if (isSpacePressed || isPanning || activeTool === "PAN") cursorStyle = isPanning ? "cursor-grabbing" : "cursor-grab";
  else if (selectionBox) cursorStyle = "cursor-crosshair";
  else if (activeTool === "NODE") cursorStyle = "cursor-crosshair";
  else if (activeTool === "EDGE") cursorStyle = "cursor-cell";
  else if (activeTool === "HAZARD") cursorStyle = "cursor-no-drop";

  return (
    <div className="flex flex-1 overflow-hidden">
      
      {/* Interactive Vector Canvas */}
      <div
        ref={containerRef}
        className={`flex-1 relative overflow-hidden bg-zinc-50 dark:bg-zinc-900 ${cursorStyle} select-none outline-none`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()} 
        tabIndex={0}
        style={{
          backgroundImage: `radial-gradient(circle, rgba(161, 161, 170, 0.4) 1.5px, transparent 1.5px)`,
          backgroundSize: `${24 * scale}px ${24 * scale}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      >
        <HistoryControls undo={undo} redo={redo} canUndo={historyIndex > 0} canRedo={historyIndex < history.length - 1} />
        <ZoomControls scale={scale} adjustZoomCentered={adjustZoomCentered} resetZoom={() => { setScale(1); setPan({x: 100, y: 100}); }} />
        <StatusBar activeTool={activeTool} nodeCount={nodes.length} />

        <div className="absolute inset-0 origin-top-left pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}>
          <BlueprintLayer />
          <EdgeLayer nodes={nodes} edges={edges} selectedEdgeIds={selectedEdgeIds} selection={selection} draftEdge={draftEdge} selectionBox={selectionBox} scale={scale} onEdgeClick={handleEdgeClick} />
          <NodeLayer nodes={nodes} selectedNodeIds={selectedNodeIds} />
        </div>
      </div>

      {/* Inspector Panel directly integrated for state sharing */}
      <InspectorPanel 
        selectionType={selection} 
        selectedNode={selectedNodeIds.length === 1 ? nodes.find(n => n.id === selectedNodeIds[0]) : undefined}
        updateNode={(updates) => {
            if (selectedNodeIds.length === 1) {
                setNodes(nodes.map(n => n.id === selectedNodeIds[0] ? { ...n, ...updates } : n));
            }
        }}
        onSave={() => pushHistory(nodes, edges)}
      />
    </div>
  );
}