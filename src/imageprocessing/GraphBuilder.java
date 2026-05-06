package imageprocessing;

import datastructures.AdjacencyListGraph;
import datastructures.INode;
import datastructures.Matrix;
import datastructures.MatrixException;
import datastructures.ArrayList;

public class GraphBuilder {

    public static AdjacencyListGraph<RegionData> buildVascularGraph(
            Matrix greenChannel, Matrix blockBinaryMask, int blockSize) {
        
        AdjacencyListGraph<RegionData> graph = new AdjacencyListGraph<>();
        int gridRows = greenChannel.numberRows() / blockSize;
        int gridCols = greenChannel.numberCols() / blockSize;
        
        @SuppressWarnings("unchecked")
        INode<RegionData>[][] nodeGrid = new INode[gridRows][gridCols];

        // PASS 1: Build nodes directly from the Block-Scaled Skeleton
        for (int r = 0; r < gridRows; r++) {
            for (int c = 0; c < gridCols; c++) {
                try {
                    if (blockBinaryMask.getElement(r, c) == 1.0) {
                        int centerY = Math.min(r * blockSize + (blockSize / 2), greenChannel.numberRows() - 1);
                        int centerX = Math.min(c * blockSize + (blockSize / 2), greenChannel.numberCols() - 1);
                        double minGreen = greenChannel.getElement(centerY, centerX);
                        
                        RegionData data = new RegionData(c, r, minGreen);
                        data.setVessel(true); 
                        nodeGrid[r][c] = graph.addNode(data);
                    }
                } catch (MatrixException e) {}
            }
        }

        // PASS 2: SMART 8-WAY NETWORKING
        for (int r = 0; r < gridRows; r++) {
            for (int c = 0; c < gridCols; c++) {
                INode<RegionData> currentNode = nodeGrid[r][c];
                if (currentNode == null) continue;

                if (c < gridCols - 1 && nodeGrid[r][c + 1] != null) {
                    graph.addEdge(currentNode, nodeGrid[r][c + 1], 1.0); 
                }
                if (r < gridRows - 1 && nodeGrid[r + 1][c] != null) {
                    graph.addEdge(currentNode, nodeGrid[r + 1][c], 1.0);
                }

                if (r < gridRows - 1 && c < gridCols - 1 && nodeGrid[r + 1][c + 1] != null) {
                    boolean rightEmpty = (nodeGrid[r][c + 1] == null);
                    boolean downEmpty = (nodeGrid[r + 1][c] == null);
                    if (rightEmpty && downEmpty) {
                        graph.addEdge(currentNode, nodeGrid[r + 1][c + 1], 1.414);
                    }
                }
                if (r < gridRows - 1 && c > 0 && nodeGrid[r + 1][c - 1] != null) {
                    boolean leftEmpty = (nodeGrid[r][c - 1] == null);
                    boolean downEmpty = (nodeGrid[r + 1][c] == null);
                    if (leftEmpty && downEmpty) {
                        graph.addEdge(currentNode, nodeGrid[r + 1][c - 1], 1.414);
                    }
                }
            }
        }
        return graph;
    }

    public static void mergeDiagnosticData(AdjacencyListGraph<RegionData> graph, INode<RegionData>[][] nodeGrid, ArrayList<RegionData> anomalies) {
        for (int i = 0; i < anomalies.size(); i++) {
            RegionData lesion = anomalies.get(i);
            int r = lesion.getGridY();
            int c = lesion.getGridX();

            if (nodeGrid[r][c] != null) {
                nodeGrid[r][c].getData().setAnomaly(true);
            } else {
                INode<RegionData> newNode = graph.addNode(lesion);
                nodeGrid[r][c] = newNode;
            }
        }
    }
}