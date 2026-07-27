import { RouteResponse } from "@/lib/api/types";
import { EdgeData, NodeData } from "../vector/types";

interface PointerEventsConfig {
  state: any;
  nodes: NodeData[];
  edges: EdgeData[];
  pan: { x: number; y: number };
  setPan: (pan: { x: number; y: number }) => void;
  scale: number;
  getLogicalCoords: (x: number, y: number) => { x: number; y: number };
  pushHistory: (n: NodeData[], e: EdgeData[]) => void;
  isUncalibrated: boolean;
  onCalculateRoute?: (startId: string, endId: string) => Promise<RouteResponse | null>;
}

export function useCanvasPointerEvents({
  state, nodes, edges, pan, setPan, scale, getLogicalCoords, pushHistory, isUncalibrated, onCalculateRoute
}: PointerEventsConfig) {

  const handlePointerDown = (e: React.PointerEvent) => {
    const logical = getLogicalCoords(e.clientX, e.clientY);

    // Right Click Box Selection
    if (e.button === 2) {
      state.setSelectionBox({ startX: logical.x, startY: logical.y, currentX: logical.x, currentY: logical.y });
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    // Panning
    if (e.button === 1 || state.isSpacePressed || (state.activeTool === "SELECT" && e.shiftKey) || state.activeTool === "PAN") {
      state.setIsPanning(true);
      state.setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    // Calibration
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

    // Node Interaction
    const clickedNode = nodes.find((n) => {
      const dx = n.x - logical.x;
      const dy = n.y - (16 / scale) - logical.y;
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
          const startNode = state.dragStartNodes?.find((d: { id: string; }) => d.id === n.id);
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
        const dy = n.y - (16 / scale) - logical.y;
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
    const logical = getLogicalCoords(e.clientX, e.clientY);

    const clickedNode = nodes.find((n) => {
      const dx = n.x - logical.x;
      const dy = n.y - (16 / scale) - logical.y;
      return Math.sqrt(dx * dx + dy * dy) < 24 / scale;
    });

    if (clickedNode) {
      return; 
    }

    e.stopPropagation();

    if (state.activeTool === "HAZARD") {
      pushHistory(nodes, edges.map((ed) => (ed.id === edgeId ? { ...ed, isHazard: !ed.isHazard } : ed)));
    } else {
      state.setSelectedEdgeIds([edgeId]);
      state.setSelectedNodeIds([]);
      state.setSelection("EDGE");
    }
  };

  return { handlePointerDown, handlePointerMove, handlePointerUp, handleEdgeClick };
}