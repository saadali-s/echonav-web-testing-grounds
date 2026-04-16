package imageprocessing;

import datastructures.AdjacencyListGraph;
import datastructures.INode;
import datastructures.Matrix;
import datastructures.MatrixException;
import datastructures.ArrayList;

public class GraphBuilder {

    public static AdjacencyListGraph<RegionData> buildVascularGraph(
            Matrix greenChannel, Matrix sobelEdges, 
            int blockSize, double edgeThreshold, double darknessThreshold) {
        
        AdjacencyListGraph<RegionData> graph = new AdjacencyListGraph<>();
        int gridRows = greenChannel.numberRows() / blockSize;
        int gridCols = greenChannel.numberCols() / blockSize;
        
        @SuppressWarnings("unchecked")
        INode<RegionData>[][] nodeGrid = new INode[gridRows][gridCols];

        // PASS 1: Dual-Layer Structural Filter (Min/Max Preservation)
        for (int r = 0; r < gridRows; r++) {
            for (int c = 0; c < gridCols; c++) {
                
                double minGreen = 255.0; 
                double maxSobel = 0.0;   
                double totalGreen = 0;
                int count = 0;
                
                for (int y = r * blockSize; y < (r + 1) * blockSize; y++) {
                    for (int x = c * blockSize; x < (c + 1) * blockSize; x++) {
                        try {
                            double g = greenChannel.getElement(y, x);
                            double s = sobelEdges.getElement(y, x);
                            
                            if (g < minGreen && g > 20.0) minGreen = g; 
                            if (s > maxSobel) maxSobel = s;
                            
                            totalGreen += g;
                            count++;
                        } catch (MatrixException e) {}
                    }
                }
                
                double avgGreen = totalGreen / count;
                boolean notVoid = avgGreen > 20.0;
                boolean isDark = minGreen <= darknessThreshold; 
                boolean hasEdges = maxSobel >= edgeThreshold;   

                if (notVoid && isDark && hasEdges) {
                    RegionData data = new RegionData(c, r, minGreen);
                    data.setGradientIntensity(maxSobel); 
                    data.setVessel(true); 
                    nodeGrid[r][c] = graph.addNode(data);
                }
            }
        }

        // PASS 2: Networking
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
            }
        }

        return graph;
    }

    /**
     * PIPELINE MERGE: Fuses the isolated lesions into the structural graph.
     */
    public static void mergeDiagnosticData(
            AdjacencyListGraph<RegionData> graph, 
            INode<RegionData>[][] nodeGrid, 
            ArrayList<RegionData> anomalies) {
        
        for (int i = 0; i < anomalies.size(); i++) {
            RegionData lesion = anomalies.get(i);
            int r = lesion.getGridY();
            int c = lesion.getGridX();

            if (nodeGrid[r][c] != null) {
                // Lesion sits directly on a structural vessel
                nodeGrid[r][c].getData().setAnomaly(true);
            } else {
                // Isolated lesion in the middle of tissue (No edges created)
                INode<RegionData> newNode = graph.addNode(lesion);
                nodeGrid[r][c] = newNode;
            }
        }
    }
}