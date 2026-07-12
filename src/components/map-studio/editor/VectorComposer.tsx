"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { InspectorPanel } from "./InspectorPanel";
import { BlueprintLayer } from "./vector/BlueprintLayer";
import { EdgeLayer } from "./vector/EdgeLayer";
import { HistoryControls } from "./vector/HistoryControls";
import { NodeLayer } from "./vector/NodeLayer";
import { StatusBar } from "./vector/StatusBar";
import { VectorComposerProps } from "./vector/types";
import { ZoomControls } from "./vector/ZoomControls";

import { Ruler } from "lucide-react";
import { useEditorState } from "./hooks/useEditorState";
import { useHistory } from "./hooks/useHistory";
import { useViewport } from "./hooks/useViewport";

export function VectorComposer({ 
  activeTool: externalActiveTool, imageUrl, onSaveDb, onUpdateScale, onCalculateRoute,
  initialNodes = [], initialEdges = [], initialScale = ""
}: VectorComposerProps) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const hasHydrated = useRef(false);
  
  // Custom Hooks
  const { pan, setPan, scale, adjustZoomCentered, resetZoom, getLogicalCoords } = useViewport(containerRef);
  const { nodes, edges, pushHistory, undo, redo, canUndo, canRedo, resetHistory } = useHistory(initialNodes, initialEdges);
  const state = useEditorState(externalActiveTool);

  const isUncalibrated = initialScale === "" || initialScale === "0.05";
  const parsedScale = parseFloat(initialScale);

  // Enforce Scale Tool Lockout
  useEffect(() => {
    if (isUncalibrated && state.activeTool !== "SCALE") {
        state.setActiveTool("SCALE");
    } else if (!isUncalibrated && externalActiveTool !== state.activeTool) {
        state.setActiveTool(externalActiveTool);
    }
  }, [isUncalibrated, externalActiveTool, state.activeTool, state]);

  // Handle Tool Changes
  useEffect(() => {
    if (state.activeTool !== "SCALE") state.clearCalibration();
    if (state.activeTool !== "ROUTE") state.clearRouting();
  }, [state.activeTool, state]); 

  // STRICT HYDRATION
  useEffect(() => {
    if (initialNodes.length > 0 && !hasHydrated.current) {
      resetHistory(initialNodes, initialEdges);
      state.clearSelection();
      hasHydrated.current = true;
    }
  }, [initialNodes, initialEdges, resetHistory, state]);

  // Distance Calculations
  const calibrationPixelDistance = useMemo(() => {
    if (state.calibrationStart && state.calibrationEnd) {
      return Math.hypot(state.calibrationEnd.x - state.calibrationStart.x, state.calibrationEnd.y - state.calibrationStart.y);
    }
    return null;
  }, [state.calibrationStart, state.calibrationEnd]);

  // FIXED: Realtime Inspector Math
  const selectedEdgeDistance = useMemo(() => {
    if (state.selection === "EDGE" && state.selectedEdgeIds.length === 1) {
      const edge = edges.find(e => e.id === state.selectedEdgeIds[0]);
      if (edge) {
        const s = nodes.find(n => n.id === edge.source);
        const t = nodes.find(n => n.id === edge.target);
        if (s && t) {
          const pixels = Math.hypot(t.x - s.x, t.y - s.y);
          return isNaN(parsedScale) ? null : pixels * parsedScale;
        }
      }
    }
    return null;
  }, [state.selection, state.selectedEdgeIds, edges, nodes, parsedScale]);

  // Handlers
  const handleDeleteSelection = useCallback(() => {
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
  }, [state, nodes, edges, pushHistory]);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        state.setIsSpacePressed(true);
      }
      if (e.code === "Delete" || e.code === "Backspace") handleDeleteSelection();
      
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
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
  }, [handleDeleteSelection, undo, redo, state]);

  // Pointer Events
  const handlePointerDown = (e: React.PointerEvent) => {
    const logical = getLogicalCoords(e.clientX, e.clientY);

    if (e.button === 2) {
      state.setSelectionBox({ startX: logical.x, startY: logical.y, currentX: logical.x, currentY: logical.y });
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (e.button === 1 || state.isSpacePressed || (state.activeTool === "SELECT" && e.shiftKey) || state.activeTool === "PAN") {
      state.setIsPanning(true);
      state.setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (state.activeTool === "SCALE") {
      if (!state.calibrationStart || (state.calibrationStart && state.calibrationEnd)) {
        state.setCalibrationStart({ x: logical.x, y: logical.y });
        state.setCalibrationEnd(null);
        state.setCalibrationCurrent({ x: logical.x, y: logical.y });
      } else if (state.calibrationStart && !state.calibrationEnd) {
        state.setCalibrationEnd({ x: logical.x, y: logical.y });
        state.setCalibrationCurrent(null);
      }
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (isUncalibrated) return;

    const clickedNode = nodes.find((n) => {
      const dx = n.x - logical.x;
      const dy = n.y - 16 - logical.y;
      return Math.sqrt(dx * dx + dy * dy) < 24 / scale;
    });

    if (state.activeTool === "ROUTE") {
      if (clickedNode) {
        if (!state.routeStartNode || (state.routeStartNode && state.routeEndNode)) {
          state.setRouteStartNode(clickedNode.id);
          state.setRouteEndNode(null);
          state.setCalculatedRoute(null);
        } else if (state.routeStartNode && !state.routeEndNode && state.routeStartNode !== clickedNode.id) {
          state.setRouteEndNode(clickedNode.id);
          if (onCalculateRoute) {
            state.setIsCalculatingRoute(true);
            onCalculateRoute(state.routeStartNode, clickedNode.id)
              .then(res => state.setCalculatedRoute(res))
              .catch(err => console.error("Routing error:", err))
              .finally(() => state.setIsCalculatingRoute(false));
          }
        }
      }
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (clickedNode) {
      if (state.activeTool === "SELECT") {
        const newSelection = [clickedNode.id];
        state.setSelectedNodeIds(newSelection);
        state.setSelectedEdgeIds([]);
        state.setSelection("NODE");
        state.setDragStartNodes(nodes.filter((n) => newSelection.includes(n.id)).map((n) => ({ id: n.id, startX: n.x, startY: n.y })));
        state.setActiveDragNodes(nodes); 
        state.setDragStartPos({ x: logical.x, y: logical.y });
      } else if (state.activeTool === "EDGE") {
        state.setDraftEdge({ source: clickedNode.id, currentX: clickedNode.x, currentY: clickedNode.y });
      } else if (state.activeTool === "HAZARD") {
        pushHistory(nodes.map((n) => (n.id === clickedNode.id ? { ...n, isHazard: !n.isHazard } : n)), edges);
      }
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    if (state.activeTool === "NODE") {
      const newNode = { id: `n${Date.now()}`, x: logical.x, y: logical.y, label: `Node ${nodes.length + 1}` };
      pushHistory([...nodes, newNode], edges);
      state.setSelectedNodeIds([newNode.id]);
      state.setSelectedEdgeIds([]);
      state.setSelection("NODE");
    } else if (state.activeTool === "SELECT") {
      state.clearSelection();
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const logical = getLogicalCoords(e.clientX, e.clientY);
    if (state.isPanning) return setPan({ x: e.clientX - state.panStart.x, y: e.clientY - state.panStart.y });
    if (state.selectionBox) return state.setSelectionBox({ ...state.selectionBox, currentX: logical.x, currentY: logical.y });
    
    if (state.activeTool === "SCALE" && state.calibrationStart && !state.calibrationEnd) {
      state.setCalibrationCurrent({ x: logical.x, y: logical.y });
    }

    if (state.dragStartNodes && state.dragStartPos) {
      const deltaX = logical.x - state.dragStartPos.x;
      const deltaY = logical.y - state.dragStartPos.y;
      state.setActiveDragNodes(
        nodes.map((n) => {
          const startNode = state.dragStartNodes?.find((d) => d.id === n.id);
          return startNode ? { ...n, x: startNode.startX + deltaX, y: startNode.startY + deltaY } : n;
        })
      );
    }
    if (state.draftEdge) state.setDraftEdge({ ...state.draftEdge, currentX: logical.x, currentY: logical.y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    state.setIsPanning(false);
    if (state.selectionBox) {
      const minX = Math.min(state.selectionBox.startX, state.selectionBox.currentX);
      const maxX = Math.max(state.selectionBox.startX, state.selectionBox.currentX);
      const minY = Math.min(state.selectionBox.startY, state.selectionBox.currentY);
      const maxY = Math.max(state.selectionBox.startY, state.selectionBox.currentY);
      const insideNodes = nodes.filter((n) => n.x >= minX && n.x <= maxX && n.y >= minY && n.y <= maxY).map((n) => n.id);
      
      state.setSelectedNodeIds(insideNodes);
      state.setSelectedEdgeIds([]);
      state.setSelection(insideNodes.length > 0 ? "NODE" : null);
      state.setSelectionBox(null);
      return;
    }

    if (state.dragStartNodes && state.activeDragNodes) {
      pushHistory(state.activeDragNodes, edges);
      state.setDragStartNodes(null);
      state.setDragStartPos(null);
      state.setActiveDragNodes(null);
    }

    if (state.draftEdge) {
      const logical = getLogicalCoords(e.clientX, e.clientY);
      const dropTarget = nodes.find((n) => {
        const dx = n.x - logical.x;
        const dy = n.y - 16 - logical.y;
        return Math.sqrt(dx * dx + dy * dy) < 30 / scale;
      });

      if (dropTarget && dropTarget.id !== state.draftEdge.source) {
        const exists = edges.some((edge) => 
          (edge.source === state.draftEdge?.source && edge.target === dropTarget.id) || 
          (edge.target === state.draftEdge?.source && edge.source === dropTarget.id)
        );
        if (!exists) {
          const newEdges = [...edges, { id: `e${Date.now()}`, source: state.draftEdge.source, target: dropTarget.id }];
          pushHistory(nodes, newEdges);
          state.setSelectedEdgeIds([newEdges[newEdges.length - 1].id]);
          state.setSelectedNodeIds([]);
          state.setSelection("EDGE");
        }
      }
      state.setDraftEdge(null);
    }
  };

  const handleEdgeClick = (e: React.PointerEvent, edgeId: string) => {
    e.stopPropagation();
    if (state.activeTool === "HAZARD") {
      pushHistory(nodes, edges.map((ed) => (ed.id === edgeId ? { ...ed, isHazard: !ed.isHazard } : ed)));
    } else {
      state.setSelectedEdgeIds([edgeId]);
      state.setSelectedNodeIds([]);
      state.setSelection("EDGE");
    }
  };

  const handleSaveWrapper = async () => {
    pushHistory(nodes, edges);
    if (onSaveDb) {
      try {
        await onSaveDb(nodes, edges);
      } catch (err) {
        console.error("Save failed", err);
      }
    }
  };

  const handleResolveHazard = async (nodeId: string) => {
    const newNodes = nodes.map(n => n.id === nodeId ? { ...n, isHazard: false, hazardType: undefined } : n);
    pushHistory(newNodes, edges);
    
    if (onSaveDb) {
      try {
        await onSaveDb(newNodes, edges);
      } catch (err) {
        console.error("Resolve save failed", err);
      }
    }
  };

  const handleCalibrateWrapper = async (newScaleRatio: number) => {
    if (onUpdateScale) {
      try {
        await onUpdateScale(newScaleRatio);
      } catch (err) {
        console.error("Scale update failed", err);
      }
    }
    state.clearCalibration();
  };

  const displayNodes = state.activeDragNodes || nodes;

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {isUncalibrated && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-amber-950 px-6 py-3 rounded-xl border-2 border-zinc-950 shadow-[4px_4px_0px_0px_rgba(24,24,27,1)] flex items-center gap-3 font-black tracking-wide uppercase text-xs animate-bounce pointer-events-none">
           <Ruler className="h-5 w-5" />
           Calibration Required: Draw a line between two known points to establish real-world scale.
        </div>
      )}

      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-zinc-50 dark:bg-zinc-900 select-none outline-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
        tabIndex={0}
        style={{
          backgroundImage: `radial-gradient(circle, rgba(161, 161, 170, 0.4) 1.5px, transparent 1.5px)`,
          backgroundSize: `${24 * scale}px ${24 * scale}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      >
        <HistoryControls undo={undo} redo={redo} canUndo={canUndo} canRedo={canRedo} />
        <ZoomControls scale={scale} adjustZoomCentered={adjustZoomCentered} resetZoom={resetZoom} />
        <StatusBar activeTool={state.activeTool} nodeCount={nodes.length} />

        <div
          className="absolute inset-0 origin-top-left pointer-events-none"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
        >
          <BlueprintLayer imageUrl={imageUrl} />
          <EdgeLayer 
            nodes={displayNodes} 
            edges={edges} 
            selectedEdgeIds={state.selectedEdgeIds} 
            selection={state.selection} 
            draftEdge={state.draftEdge} 
            selectionBox={state.selectionBox} 
            scale={scale} 
            floorPlanScale={parsedScale} 
            onEdgeClick={handleEdgeClick} 
            calibrationStart={state.calibrationStart}
            calibrationEnd={state.calibrationEnd}
            calibrationCurrent={state.calibrationCurrent}
            calculatedRoute={state.calculatedRoute}
          />
          <NodeLayer nodes={displayNodes} selectedNodeIds={state.selectedNodeIds} />
        </div>
      </div>

      <InspectorPanel
        selectionType={state.selection}
        activeTool={state.activeTool}
        floorPlanScale={initialScale} 
        selectedNode={state.selectedNodeIds.length === 1 ? nodes.find((n) => n.id === state.selectedNodeIds[0]) : undefined}
        updateNode={(updates) => {
          if (state.selectedNodeIds.length === 1) {
             pushHistory(nodes.map((n) => n.id === state.selectedNodeIds[0] ? { ...n, ...updates } : n), edges);
          }
        }}
        onSave={handleSaveWrapper}
        onDelete={handleDeleteSelection}
        calibrationPixelDistance={calibrationPixelDistance}
        onCalibrate={handleCalibrateWrapper}
        edgeMeters={selectedEdgeDistance} 
        routeStartNode={state.routeStartNode}
        routeEndNode={state.routeEndNode}
        calculatedRoute={state.calculatedRoute}
        isCalculatingRoute={state.isCalculatingRoute}
        onResolveHazard={handleResolveHazard}
      />
    </div>
  );
}