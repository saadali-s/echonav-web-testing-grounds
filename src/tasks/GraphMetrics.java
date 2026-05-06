package tasks;

import datastructures.IGraph;
import datastructures.INode;
import datastructures.List;
import datastructures.ArrayList;
import imageprocessing.RegionData;

public class GraphMetrics {

    // =========================================================================
    // 1. ENDPOINT COUNTER
    // =========================================================================
    // Healthy eyes have few endpoints. Fragmented, diseased eyes have many dead ends.
    public static int countEndpoints(IGraph<RegionData> graph) {
        List<INode<RegionData>> nodes = graph.getNodes();
        int count = 0;
        
        for (int i = 0; i < nodes.size(); i++) {
            // An endpoint is defined as a node with exactly 1 connection
            if (graph.getNeighbors(nodes.get(i)).size() == 1) {
                count++;
            }
        }
        return count;
    }

    // =========================================================================
    // 2. BRANCH POINT COUNTER
    // =========================================================================
    // Proliferative DR causes chaotic branching (neovascularization). 
    public static int countBranchPoints(IGraph<RegionData> graph) {
        List<INode<RegionData>> nodes = graph.getNodes();
        int count = 0;
        
        for (int i = 0; i < nodes.size(); i++) {
            // A branch point (bifurcation) is a node where the vessel splits (>2 connections)
            if (graph.getNeighbors(nodes.get(i)).size() > 2) {
                count++;
            }
        }
        return count;
    }

    // =========================================================================
    // 3. LARGEST CONNECTED COMPONENT (Network Fragmentation)
    // =========================================================================
    // A healthy vascular network is one massive connected tree. 
    // Disease causes it to shatter into small, disconnected fragments.
    public static int calculateLargestComponentSize(IGraph<RegionData> graph, int gridRows, int gridCols) {
        List<INode<RegionData>> nodes = graph.getNodes();
        if (nodes.size() == 0) return 0;

        // O(1) lookup to keep the BFS blazingly fast
        boolean[][] visited = new boolean[gridRows][gridCols];
        int largestSize = 0;

        for (int i = 0; i < nodes.size(); i++) {
            INode<RegionData> startNode = nodes.get(i);
            RegionData startData = startNode.getData();

            if (!visited[startData.getGridY()][startData.getGridX()]) {
                // We found a new, unvisited fragment. Let's measure it.
                int currentComponentSize = 0;
                ArrayList<INode<RegionData>> queue = new ArrayList<>();
                
                queue.add(queue.size(), startNode);
                visited[startData.getGridY()][startData.getGridX()] = true;

                // Standard BFS to traverse this specific component
                while (!queue.isEmpty()) {
                    INode<RegionData> curr = queue.remove(0);
                    currentComponentSize++;

                    List<INode<RegionData>> neighbors = graph.getNeighbors(curr);
                    for (int j = 0; j < neighbors.size(); j++) {
                        INode<RegionData> neighbor = neighbors.get(j);
                        RegionData nd = neighbor.getData();
                        
                        if (!visited[nd.getGridY()][nd.getGridX()]) {
                            visited[nd.getGridY()][nd.getGridX()] = true;
                            queue.add(queue.size(), neighbor);
                        }
                    }
                }

                // If this fragment is the biggest we've seen, record it
                if (currentComponentSize > largestSize) {
                    largestSize = currentComponentSize;
                }
            }
        }
        return largestSize;
    }
}