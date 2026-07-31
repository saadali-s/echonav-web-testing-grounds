import { RouteResponse } from "@/lib/api/types";
import { useCallback, useState } from "react";
import { SelectionType } from "../InspectorPanel";
import { ToolMode } from "../Toolbelt";
import { NodeData } from "../vector/types";

export function useEditorState(initialTool: ToolMode = "SELECT") {
  const [activeTool, setActiveTool] = useState<ToolMode>(initialTool);
  const [selection, setSelection] = useState<SelectionType>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);

  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const [dragStartPos, setDragStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dragStartNodes, setDragStartNodes] = useState<
    { id: string; startX: number; startY: number }[] | null
  >(null);
  const [activeDragNodes, setActiveDragNodes] = useState<NodeData[] | null>(
    null,
  );

  const [draftEdge, setDraftEdge] = useState<{
    source: string;
    currentX: number;
    currentY: number;
  } | null>(null);
  const [selectionBox, setSelectionBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  const [calibrationStart, setCalibrationStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [calibrationEnd, setCalibrationEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [calibrationCurrent, setCalibrationCurrent] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [routeStartNode, setRouteStartNode] = useState<string | null>(null);
  const [routeEndNode, setRouteEndNode] = useState<string | null>(null);
  const [calculatedRoute, setCalculatedRoute] = useState<RouteResponse | null>(
    null,
  );
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  const clearSelection = useCallback(() => {
    setSelectedNodeIds([]);
    setSelectedEdgeIds([]);
    setSelection(null);
  }, []);

  const clearCalibration = useCallback(() => {
    setCalibrationStart(null);
    setCalibrationEnd(null);
    setCalibrationCurrent(null);
  }, []);

  const clearRouting = useCallback(() => {
    setRouteStartNode(null);
    setRouteEndNode(null);
    setCalculatedRoute(null);
  }, []);

  return {
    activeTool,
    setActiveTool,
    selection,
    setSelection,
    clearSelection,
    selectedNodeIds,
    setSelectedNodeIds,
    selectedEdgeIds,
    setSelectedEdgeIds,
    isSpacePressed,
    setIsSpacePressed,
    isPanning,
    setIsPanning,
    panStart,
    setPanStart,
    dragStartPos,
    setDragStartPos,
    dragStartNodes,
    setDragStartNodes,
    activeDragNodes,
    setActiveDragNodes,
    draftEdge,
    setDraftEdge,
    selectionBox,
    setSelectionBox,
    calibrationStart,
    setCalibrationStart,
    calibrationEnd,
    setCalibrationEnd,
    calibrationCurrent,
    setCalibrationCurrent,
    clearCalibration,
    routeStartNode,
    setRouteStartNode,
    routeEndNode,
    setRouteEndNode,
    calculatedRoute,
    setCalculatedRoute,
    isCalculatingRoute,
    setIsCalculatingRoute,
    clearRouting,
  };
}
