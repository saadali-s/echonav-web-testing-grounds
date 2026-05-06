package tasks;

import datastructures.IGraph;
import datastructures.INode;
import datastructures.List;
import datastructures.ArrayList;
import datastructures.MinHeap;
import imageprocessing.RegionData;

public class PathFinder {

    public static List<INode<RegionData>> calculateTortuosity(
            IGraph<RegionData> graph, INode<RegionData> startNode, INode<RegionData> endNode, 
            int gridRows, int gridCols) {
        
        double[][] distances = new double[gridRows][gridCols];
        @SuppressWarnings("unchecked")
        INode<RegionData>[][] previousNode = new INode[gridRows][gridCols];
        
        for (int r = 0; r < gridRows; r++) {
            for (int c = 0; c < gridCols; c++) {
                distances[r][c] = Double.MAX_VALUE;
                previousNode[r][c] = null;
            }
        }

        MinHeap<RegionData> pq = new MinHeap<>();
        RegionData startData = startNode.getData();
        distances[startData.getGridY()][startData.getGridX()] = 0.0;
        pq.insert(startNode, 0.0);

        while (!pq.isEmpty()) {
            MinHeap.HeapElement<RegionData> currentElement = pq.extractMin();
            INode<RegionData> currentNode = currentElement.node;
            RegionData currentData = currentNode.getData();
            
            int curX = currentData.getGridX();
            int curY = currentData.getGridY();

            if (currentNode.equals(endNode)) break;
            if (currentElement.priority > distances[curY][curX]) continue;

            List<INode<RegionData>> neighbors = graph.getNeighbors(currentNode);
            for (int i = 0; i < neighbors.size(); i++) {
                INode<RegionData> neighbor = neighbors.get(i);
                RegionData neighborData = neighbor.getData();
                
                if (!neighborData.isVessel()) continue; 

                int nX = neighborData.getGridX();
                int nY = neighborData.getGridY();

                double edgeWeight = graph.getEdgeWeight(currentNode, neighbor);
                double newPathDistance = distances[curY][curX] + edgeWeight;

                if (newPathDistance < distances[nY][nX]) {
                    distances[nY][nX] = newPathDistance;
                    previousNode[nY][nX] = currentNode;
                    pq.insert(neighbor, newPathDistance);
                }
            }
        }

        ArrayList<INode<RegionData>> finalPath = new ArrayList<>();
        INode<RegionData> step = endNode;
        
        while (step != null) {
            finalPath.add(0, step); 
            if (step.equals(startNode)) break; 
            RegionData stepData = step.getData();
            step = previousNode[stepData.getGridY()][stepData.getGridX()];
        }

        if (finalPath.size() <= 1 && !startNode.equals(endNode)) {
            return new ArrayList<>(); 
        }
        return finalPath;
    }

    public static double calculateGlobalChaos(IGraph<RegionData> graph, int gridRows, int gridCols, ArrayList<List<INode<RegionData>>> longestPathOut) {
        List<INode<RegionData>> nodes = graph.getNodes();
        if (nodes.size() < 2) return 1.0;

        double totalActual = 0.0;
        double totalEuclid = 0.0;
        int validPaths = 0;

        ArrayList<INode<RegionData>> endpoints = new ArrayList<>();
        for (int i = 0; i < nodes.size(); i++) {
            INode<RegionData> n = nodes.get(i);
            if (graph.getNeighbors(n).size() == 1) {
                endpoints.add(endpoints.size(), n);
            }
        }

        List<INode<RegionData>> longestPath = null;

        boolean[][] processedEnds = new boolean[gridRows][gridCols];

        for (int i = 0; i < endpoints.size(); i++) {
            INode<RegionData> startNode = endpoints.get(i);
            RegionData startData = startNode.getData();
            
            if (processedEnds[startData.getGridY()][startData.getGridX()]) continue;

            INode<RegionData> furthestNode = findFurthestNode(graph, startNode, gridRows, gridCols);
            
            if (furthestNode != null && !furthestNode.equals(startNode)) {
                RegionData furthestData = furthestNode.getData();
                
                processedEnds[startData.getGridY()][startData.getGridX()] = true;
                processedEnds[furthestData.getGridY()][furthestData.getGridX()] = true;

                double euclidLength = Math.sqrt(Math.pow(startData.getGridX() - furthestData.getGridX(), 2) 
                                              + Math.pow(startData.getGridY() - furthestData.getGridY(), 2));

                if (euclidLength > 10.0) {
                    List<INode<RegionData>> dijkstraPath = calculateTortuosity(graph, startNode, furthestNode, gridRows, gridCols);
                    
                    if (dijkstraPath.size() > 0) {
                        double actualPathLength = 0.0;
                        for (int k = 0; k < dijkstraPath.size() - 1; k++) {
                            RegionData n1 = dijkstraPath.get(k).getData();
                            RegionData n2 = dijkstraPath.get(k+1).getData();
                            actualPathLength += Math.sqrt(Math.pow(n1.getGridX() - n2.getGridX(), 2) 
                                                        + Math.pow(n1.getGridY() - n2.getGridY(), 2));
                        }

                        actualPathLength = Math.max(actualPathLength, euclidLength);

                        totalActual += actualPathLength;
                        totalEuclid += euclidLength;
                        validPaths++;
                        
                        if (longestPath == null || dijkstraPath.size() > longestPath.size()) {
                            longestPath = dijkstraPath;
                        }
                    }
                }
            }
        }

        if (longestPath != null && longestPathOut != null) {
            longestPathOut.add(0, longestPath);
        }

        if (validPaths == 0 || totalEuclid == 0) return 1.0;
        return totalActual / totalEuclid;
    }

    public static int countNeovascularLoops(IGraph<RegionData> graph, int gridRows, int gridCols) {
        List<INode<RegionData>> nodes = graph.getNodes();
        if (nodes.size() == 0) return 0;

        int V = nodes.size();
        int E_total = 0;
        
        for (int i = 0; i < nodes.size(); i++) {
            E_total += graph.getNeighbors(nodes.get(i)).size();
        }
        int E = E_total / 2;

        int C = 0;
        boolean[][] visited = new boolean[gridRows][gridCols];
        
        for (int i = 0; i < nodes.size(); i++) {
            RegionData d = nodes.get(i).getData();
            if (!visited[d.getGridY()][d.getGridX()]) {
                C++;
                ArrayList<INode<RegionData>> queue = new ArrayList<>();
                queue.add(queue.size(), nodes.get(i));
                visited[d.getGridY()][d.getGridX()] = true;
                
                while (!queue.isEmpty()) {
                    INode<RegionData> curr = queue.remove(0);
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
            }
        }

        int cycles = E - V + C;
        return Math.max(0, cycles);
    }

    private static INode<RegionData> findFurthestNode(IGraph<RegionData> graph, INode<RegionData> start, int gridRows, int gridCols) {
        ArrayList<INode<RegionData>> queue = new ArrayList<>();

        boolean[][] visited = new boolean[gridRows][gridCols];
        
        queue.add(queue.size(), start);
        visited[start.getData().getGridY()][start.getData().getGridX()] = true;
        INode<RegionData> furthest = start;

        while (!queue.isEmpty()) {
            INode<RegionData> current = queue.remove(0);
            furthest = current;
            
            List<INode<RegionData>> neighbors = graph.getNeighbors(current);
            for (int i = 0; i < neighbors.size(); i++) {
                INode<RegionData> n = neighbors.get(i);
                RegionData nd = n.getData();
                
                if (!visited[nd.getGridY()][nd.getGridX()]) {
                    visited[nd.getGridY()][nd.getGridX()] = true;
                    queue.add(queue.size(), n);
                }
            }
        }
        return furthest;
    }
}