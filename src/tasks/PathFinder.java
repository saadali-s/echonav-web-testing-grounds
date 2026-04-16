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
}