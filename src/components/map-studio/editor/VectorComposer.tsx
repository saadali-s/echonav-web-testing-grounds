"use client";

import React, { useEffect, useMemo, useRef } from "react";
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
import { useCanvasKeyboardEvents } from "./hooks/useCanvasKeyboardEvents";
import { useCanvasPointerEvents } from "./hooks/useCanvasPointerEvents";

export function VectorComposer({
  activeTool: externalActiveTool,
  imageUrl,
  onSaveDb,
  onUpdateScale,
  onCalculateRoute,
  initialNodes = [],
  initialEdges = [],
  initialScale = "",
}: VectorComposerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasHydrated = useRef(false);

  const {
    pan,
    setPan,
    scale,
    adjustZoomCentered,
    resetZoom,
    getLogicalCoords,
  } = useViewport(containerRef);
  const {
    nodes,
    edges,
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useHistory(initialNodes, initialEdges);
  const state = useEditorState(externalActiveTool);

  const isUncalibrated = initialScale === "" || initialScale === "0.05";
  const parsedScale = parseFloat(initialScale);

  useEffect(() => {
    if (isUncalibrated && state.activeTool !== "SCALE") {
      state.setActiveTool("SCALE");
    } else if (!isUncalibrated && externalActiveTool !== state.activeTool) {
      state.setActiveTool(externalActiveTool);
    }
  }, [isUncalibrated, externalActiveTool, state.activeTool, state]);

  useEffect(() => {
    if (state.activeTool !== "SCALE") state.clearCalibration();
    if (state.activeTool !== "ROUTE") state.clearRouting();
  }, [state.activeTool, state]);

  useEffect(() => {
    if (initialNodes.length > 0 && !hasHydrated.current) {
      resetHistory(initialNodes, initialEdges);
      state.clearSelection();
      hasHydrated.current = true;
    }
  }, [initialNodes, initialEdges, resetHistory, state]);

  useCanvasKeyboardEvents({ state, nodes, edges, pushHistory, undo, redo });

  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleEdgeClick,
  } = useCanvasPointerEvents({
    state,
    nodes,
    edges,
    pan,
    setPan,
    scale,
    getLogicalCoords,
    pushHistory,
    isUncalibrated,
    onCalculateRoute,
  });

  const calibrationPixelDistance = useMemo(() => {
    if (state.calibrationStart && state.calibrationEnd) {
      return Math.hypot(
        state.calibrationEnd.x - state.calibrationStart.x,
        state.calibrationEnd.y - state.calibrationStart.y,
      );
    }
    return null;
  }, [state.calibrationStart, state.calibrationEnd]);

  const selectedEdgeDistance = useMemo(() => {
    if (state.selection === "EDGE" && state.selectedEdgeIds.length === 1) {
      const edge = edges.find((e) => e.id === state.selectedEdgeIds[0]);
      if (edge) {
        const s = nodes.find((n) => n.id === edge.source);
        const t = nodes.find((n) => n.id === edge.target);
        if (s && t) {
          const pixels = Math.hypot(t.x - s.x, t.y - s.y);
          return isNaN(parsedScale) ? null : pixels * parsedScale;
        }
      }
    }
    return null;
  }, [state.selection, state.selectedEdgeIds, edges, nodes, parsedScale]);

  const handleSaveWrapper = async () => {
    pushHistory(nodes, edges);
    if (onSaveDb) {
      try {
        const updatedGraph = await onSaveDb(nodes, edges);
        if (updatedGraph && updatedGraph.nodes) {
          const freshNodes = updatedGraph.nodes.map((n: any) => ({
            id: String(n.id),
            x: n.x,
            y: n.y,
            label: n.label || "",
            isHazard: n.isHazard || false,
            ttsVerbalGuidance: n.ttsVerbalGuidance,
            ttsAudioUrl: n.ttsAudioUrl,
          }));

          const freshEdges = updatedGraph.edges.map((e: any) => ({
            id: String(e.id),
            source: String(e.fromNodeId),
            target: String(e.toNodeId),
            isHazard: e.isHazard || false,
            weightM: e.weightM,
            distance: e.distance,
          }));

          resetHistory(freshNodes, freshEdges);
        }
        state.clearSelection();
      } catch (err) {
        console.error("Save failed", err);
      }
    }
  };

  const handleDeleteNodeAndSave = async (nodeId: string) => {
    const newNodes = nodes.filter((n) => n.id !== nodeId);
    const newEdges = edges.filter(
      (e) => e.source !== nodeId && e.target !== nodeId,
    );
    pushHistory(newNodes, newEdges);

    if (onSaveDb) {
      try {
        const updatedGraph = await onSaveDb(newNodes, newEdges);
        if (updatedGraph && updatedGraph.nodes) {
          const freshNodes = updatedGraph.nodes.map((n: any) => ({
            id: String(n.id),
            x: n.x,
            y: n.y,
            label: n.label || "",
            isHazard: n.isHazard || false,
            ttsVerbalGuidance: n.ttsVerbalGuidance,
            ttsAudioUrl: n.ttsAudioUrl,
          }));

          const freshEdges = updatedGraph.edges.map((e: any) => ({
            id: String(e.id),
            source: String(e.fromNodeId),
            target: String(e.toNodeId),
            isHazard: e.isHazard || false,
            weightM: e.weightM,
            distance: e.distance,
          }));

          resetHistory(freshNodes, freshEdges);
        }
        state.clearSelection();
      } catch (err) {
        console.error("Delete & Save failed", err);
      }
    } else {
      state.clearSelection();
    }
  };

  const handleResolveHazard = async (nodeId: string) => {
    const newNodes = nodes.map((n) =>
      n.id === nodeId ? { ...n, isHazard: false, hazardType: undefined } : n,
    );
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
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-amber-950 px-6 py-3 rounded-xl border-2 border-zinc-950  flex items-center gap-3 font-black tracking-wide uppercase text-xs animate-bounce pointer-events-none">
          <Ruler className="h-5 w-5" />
          Calibration Required: Draw a line between two known points to
          establish real-world scale.
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
        <HistoryControls
          undo={undo}
          redo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        <ZoomControls
          scale={scale}
          adjustZoomCentered={adjustZoomCentered}
          resetZoom={resetZoom}
        />
        <StatusBar activeTool={state.activeTool} nodeCount={nodes.length} />

        <div
          className="absolute inset-0 origin-top-left pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          }}
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
          <NodeLayer
            nodes={displayNodes}
            selectedNodeIds={state.selectedNodeIds}
            scale={scale}
          />
        </div>
      </div>

      <InspectorPanel
        selectionType={state.selection}
        activeTool={state.activeTool}
        floorPlanScale={initialScale}
        selectedNode={
          state.selectedNodeIds.length === 1
            ? nodes.find((n) => n.id === state.selectedNodeIds[0])
            : undefined
        }
        updateNode={(updates) => {
          if (state.selectedNodeIds.length === 1) {
            pushHistory(
              nodes.map((n) =>
                n.id === state.selectedNodeIds[0] ? { ...n, ...updates } : n,
              ),
              edges,
            );
          }
        }}
        onSave={handleSaveWrapper}
        onDelete={() => {
          const e = new KeyboardEvent("keydown", { code: "Delete" });
          window.dispatchEvent(e);
        }}
        onDeleteAndSave={handleDeleteNodeAndSave}
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
