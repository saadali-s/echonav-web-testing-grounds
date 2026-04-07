import { AdjacencyListGraph, Edge, Node } from '@/lib/models/Spatial';
import { createClient } from '@/lib/supabase/server';

// Strict typing for the final payload sent to the Expo mobile app
export interface FlightPlanStep {
  nodeId: string;
  label: string;
  x: number;
  y: number;
  instruction: string;
  distanceToNext: number;
}

export class PathfindingService {
  
  /**
   * Core Routing Engine: Executes Dijkstra's Algorithm
   */
  static async generateRoute(mapId: string, startNodeId: string, destinationNodeId: string): Promise<FlightPlanStep[]> {
    const supabase = await createClient();

    // 1. Fetch the live graph (this ensures we catch hazard updates instantly)
    const { data: nodesData, error: nodesError } = await supabase.from('nodes').select('*').eq('map_id', mapId);
    const { data: edgesData, error: edgesError } = await supabase.from('edges').select('*').eq('map_id', mapId);

    if (nodesError || edgesError || !nodesData || !edgesData) {
      throw new Error('Failed to fetch spatial graph.');
    }

    const nodes = nodesData as Node[];
    const edges = edgesData as Edge[];

    // 2. Filter out hazards (The Safety Protocol)
    const safeNodes = nodes.filter(n => !n.is_hazard);
    const safeNodeIds = new Set(safeNodes.map(n => n.id));

    // 3. Construct the Adjacency List (Bi-directional walking paths)
    const graph: AdjacencyListGraph = {};
    safeNodes.forEach(n => { graph[n.id] = []; });

    edges.forEach(edge => {
      // Ignore edges marked as hazards, or edges connected to hazard nodes
      if (edge.is_hazard) return;
      if (safeNodeIds.has(edge.from_node_id) && safeNodeIds.has(edge.to_node_id)) {
        // We push to both because walking paths are two-way
        graph[edge.from_node_id].push({ targetNodeId: edge.to_node_id, weight: edge.weight_m });
        graph[edge.to_node_id].push({ targetNodeId: edge.from_node_id, weight: edge.weight_m });
      }
    });

    // 4. Dijkstra's Algorithm (In-Memory Processing)
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisited = new Set<string>();

    safeNodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });
    
    distances[startNodeId] = 0;

    while (unvisited.size > 0) {
      // Find the unvisited node with the smallest known distance
      let currNodeId: string | null = null;
      let minDistance = Infinity;
      unvisited.forEach(id => {
        if (distances[id] < minDistance) {
          minDistance = distances[id];
          currNodeId = id;
        }
      });

      // If we can't reach any more nodes, or we hit the target, stop exploring
      if (!currNodeId || distances[currNodeId] === Infinity) break; 
      if (currNodeId === destinationNodeId) break; 

      unvisited.delete(currNodeId);

      // Evaluate neighbors
      const neighbors = graph[currNodeId] || [];
      for (const neighbor of neighbors) {
        if (!unvisited.has(neighbor.targetNodeId)) continue;

        const altDistance = distances[currNodeId] + neighbor.weight;
        if (altDistance < distances[neighbor.targetNodeId]) {
          distances[neighbor.targetNodeId] = altDistance;
          previous[neighbor.targetNodeId] = currNodeId;
        }
      }
    }

    // 5. Reconstruct the Path (Backtracking)
    const pathIds: string[] = [];
    let curr: string | null = destinationNodeId;
    
    // Check if a path actually exists
    if (previous[curr] !== null || curr === startNodeId) {
      while (curr) {
        pathIds.unshift(curr);
        curr = previous[curr];
      }
    }

    if (pathIds.length === 0 || pathIds[0] !== startNodeId) {
      throw new Error('No safe path found. Route blocked by hazards.');
    }

    // 6. Format the "Flight Plan" Array for the Expo Mobile App
    const flightPlan: FlightPlanStep[] = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    for (let i = 0; i < pathIds.length; i++) {
      const nodeId = pathIds[i];
      const node = nodeMap.get(nodeId)!;

      // Dynamic Text-To-Speech generation
      let instruction = node.tts_verbal_guidance || `Proceeding past ${node.label}`;
      if (i === pathIds.length - 1) {
        instruction = node.tts_verbal_guidance || `You have arrived at your destination: ${node.label}.`;
      } else if (i === 0) {
        instruction = `Starting route. ${node.tts_verbal_guidance || `Head towards ${nodeMap.get(pathIds[1])?.label}`}`;
      }

      // Calculate distance to the *next* node for the mobile app's proximity trigger
      let distanceToNext = 0;
      if (i < pathIds.length - 1) {
         const nextNodeId = pathIds[i + 1];
         const connectingEdge = edges.find(e =>
            (e.from_node_id === nodeId && e.to_node_id === nextNodeId) ||
            (e.to_node_id === nodeId && e.from_node_id === nextNodeId)
         );
         distanceToNext = connectingEdge ? connectingEdge.weight_m : 0;
      }

      flightPlan.push({
        nodeId: node.id,
        label: node.label,
        x: node.x,
        y: node.y,
        instruction,
        distanceToNext
      });
    }

    return flightPlan;
  }
}