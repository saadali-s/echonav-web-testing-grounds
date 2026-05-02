package tasks;

import datastructures.ArrayList;
import datastructures.Matrix;
import datastructures.MatrixException;
import datastructures.AdjacencyListGraph;
import datastructures.INode;
import datastructures.MinHeap;
import imageprocessing.RegionData;

public class SimilarityDetector {

    // Define the rigid constant for k in the k-NN clustering logic
    private static final int K_NEIGHBORS = 3;

    /**
     * Internal helper methodology to architect a synthetic diagnostic prototype node.
     * The gridX integer is co-opted as a formal class label: 
     * 0 = Healthy Tissue, 1 = Red Lesion Pathology, 2 = Bright Lesion Pathology
     * The F1 (Green) metric is stored in averageBrightness.
     * The F2 (Red) metric is stored in gradientIntensity.
     */
    private static INode<RegionData> createPrototype(AdjacencyListGraph<RegionData> graph, 
                                                     int classLabel, double f1Green, double f2Red, boolean isAnomaly) {
        RegionData protoData = new RegionData(classLabel, -1, f1Green);
        protoData.setGradientIntensity(f2Red);
        protoData.setAnomaly(isAnomaly);
        return graph.addNode(protoData);
    }

    public static ArrayList<RegionData> scanForAnomalies(Matrix greenChannel, Matrix redChannel, int blockSize) {
        ArrayList<RegionData> anomalies = new ArrayList<>();
        
        int gridRows = greenChannel.numberRows() / blockSize;
        int gridCols = greenChannel.numberCols() / blockSize;
        
        double[][] greenBlocks = new double[gridRows][gridCols];
        double[][] redBlocks = new double[gridRows][gridCols];
        
        for (int r = 0; r < gridRows; r++) {
            for (int c = 0; c < gridCols; c++) {
                double gSum = 0, rSum = 0;
                int count = 0;
                for (int y = r * blockSize; y < (r + 1) * blockSize; y++) {
                    for (int x = c * blockSize; x < (c + 1) * blockSize; x++) {
                        try {
                            gSum += greenChannel.getElement(y, x);
                            rSum += redChannel.getElement(y, x);
                            count++;
                        } catch (MatrixException e) { }
                    }
                }
                greenBlocks[r][c] = gSum / count;
                redBlocks[r][c] = rSum / count;
            }
        }

        double globalGreenSum = 0, globalRedSum = 0;
        int validBlocks = 0;
        int radius = 2;

        double centerX = gridCols / 2.0;
        double centerY = gridRows / 2.0;
        double maxRadius = Math.min(centerX, centerY) * 0.90;

        for (int r = radius; r < gridRows - radius; r++) {
            for (int c = radius; c < gridCols - radius; c++) {
                double dist = Math.sqrt(Math.pow(c - centerX, 2) + Math.pow(r - centerY, 2));
                if (dist < maxRadius && greenBlocks[r][c] > 35.0 && greenBlocks[r][c] < 170.0) {
                    globalGreenSum += greenBlocks[r][c];
                    globalRedSum += redBlocks[r][c];
                    validBlocks++;
                }
            }
        }

        double baseG = validBlocks > 0 ? globalGreenSum / validBlocks : 90.0;
        double baseR = validBlocks > 0 ? globalRedSum / validBlocks : 150.0;

        AdjacencyListGraph<RegionData> knnGraph = new AdjacencyListGraph<>();
        ArrayList<INode<RegionData>> prototypes = new ArrayList<>();
        double[] protoF3 = new double[8];

        // --- 4 HEALTHY PROTOTYPES (Class 0) ---
        prototypes.add(prototypes.size(), createPrototype(knnGraph, 0, baseG, baseR, false));
        protoF3[0] = 0.0;
        prototypes.add(prototypes.size(), createPrototype(knnGraph, 0, baseG + 10.0, baseR + 10.0, false));
        protoF3[1] = 0.0;
        prototypes.add(prototypes.size(), createPrototype(knnGraph, 0, baseG - 10.0, baseR - 10.0, false));
        protoF3[2] = 0.0;
        prototypes.add(prototypes.size(), createPrototype(knnGraph, 0, baseG + 20.0, baseR + 20.0, false));
        protoF3[3] = 0.0;

        // --- 2 RED LESION PROTOTYPES (Class 1) ---
        prototypes.add(prototypes.size(), createPrototype(knnGraph, 1, baseG - 40.0, baseR - 40.0, true));
        protoF3[4] = +35.0;
        prototypes.add(prototypes.size(), createPrototype(knnGraph, 1, baseG - 60.0, baseR - 60.0, true));
        protoF3[5] = +50.0;

        // --- 2 BRIGHT LESION PROTOTYPES (Class 2) ---
        prototypes.add(prototypes.size(), createPrototype(knnGraph, 2, baseG + 60.0, baseR + 60.0, true));
        protoF3[6] = -45.0;
        prototypes.add(prototypes.size(), createPrototype(knnGraph, 2, baseG + 80.0, baseR + 80.0, true));
        protoF3[7] = -60.0;

        MinHeap<RegionData> pq = new MinHeap<>();

        for (int r = radius; r < gridRows - radius; r++) {
            for (int c = radius; c < gridCols - radius; c++) {

                // GEOMETRIC FOV MASK: Kill edge artifacts
                double dist = Math.sqrt(Math.pow(c - centerX, 2) + Math.pow(r - centerY, 2));
                if (dist > maxRadius) continue;

                double currentGreen = greenBlocks[r][c];
                double currentRed = redBlocks[r][c];

                // MASKING: 35 prevents dark edge shadows. 170 prevents the bright Optic Disc from flagging as exudates.
                if (currentGreen < 35.0 || currentGreen > 170.0) continue;

                double localGreenSum = 0;
                int neighborCount = 0;

                for (int dy = -radius; dy <= radius; dy++) {
                    for (int dx = -radius; dx <= radius; dx++) {
                        if (dx == 0 && dy == 0) continue;
                        localGreenSum += greenBlocks[r + dy][c + dx];
                        neighborCount++;
                    }
                }

                double localGreenAvg = localGreenSum / neighborCount;
                double localContrast = localGreenAvg - currentGreen;

                for (int i = 0; i < prototypes.size(); i++) {
                    INode<RegionData> pNode = prototypes.get(i);
                    RegionData pData = pNode.getData();

                    double d1 = Math.pow(currentGreen - pData.getAverageBrightness(), 2);
                    double d2 = Math.pow(currentRed - pData.getGradientIntensity(), 2);
                    double d3 = Math.pow(localContrast - protoF3[i], 2);

                    double euclideanDistance = Math.sqrt(d1 + d2 + d3);
                    pq.insert(pNode, euclideanDistance);
                }

                int anomalyVotes = 0;
                int redVotes = 0;
                int brightVotes = 0;
                ArrayList<INode<RegionData>> nearestNeighbors = new ArrayList<>();

                for (int k = 0; k < K_NEIGHBORS; k++) {
                    MinHeap.HeapElement<RegionData> minElement = pq.extractMin();
                    if (minElement != null) {
                        nearestNeighbors.add(nearestNeighbors.size(), minElement.node);

                        // Extract the class label secretly stored in gridX during createPrototype
                        int classLabel = minElement.node.getData().getGridX();
                        if (classLabel == 1) {
                            redVotes++;
                        } else if (classLabel == 2) {
                            brightVotes++;
                        }
                    }
                }

                while (!pq.isEmpty()) {
                    pq.extractMin();
                }

                // If the majority of the 3 neighbors are anomalies (Red + Bright > 1)
                if ((redVotes + brightVotes) > (K_NEIGHBORS / 2)) {
                    RegionData lesion = new RegionData(c, r, currentGreen);
                    lesion.setAnomaly(true);

                    // Reusing the gradientIntensity field to store the specific anomaly type
                    // This prevents us from needing to alter the RegionData.java file.
                    if (redVotes >= brightVotes) {
                        lesion.setGradientIntensity(1.0); // 1.0 = Red Hemorrhage
                    } else {
                        lesion.setGradientIntensity(2.0); // 2.0 = Bright Exudate
                    }

                    INode<RegionData> blockNode = knnGraph.addNode(lesion);

                    for (int n = 0; n < nearestNeighbors.size(); n++) {
                        knnGraph.addEdge(blockNode, nearestNeighbors.get(n), 1.0);
                    }
                    anomalies.add(anomalies.size(), lesion);
                }
            }
        }

        System.out.println("k-NN Similarity Graph Generation Complete: Extracted " + anomalies.size() + " pathological lesions.");
        return anomalies;
    }
}