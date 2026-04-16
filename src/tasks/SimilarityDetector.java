package tasks;

import datastructures.ArrayList;
import datastructures.Matrix;
import datastructures.MatrixException;
import imageprocessing.RegionData;

public class SimilarityDetector {

    /**
     * PIPELINE 2: Pigmental Anomaly Detection
     * Operates entirely independently of the vascular structure.
     * Uses Red/Green multi-channel intensity and local contrast windows to isolate lesions.
     */
    public static ArrayList<RegionData> scanForAnomalies(Matrix greenChannel, Matrix redChannel, int blockSize) {
        ArrayList<RegionData> anomalies = new ArrayList<>();
        
        int gridRows = greenChannel.numberRows() / blockSize;
        int gridCols = greenChannel.numberCols() / blockSize;
        
        // 1. First pass: calculate block averages to build a low-res map
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
                        } catch (MatrixException e) {}
                    }
                }
                greenBlocks[r][c] = gSum / count;
                redBlocks[r][c] = rSum / count;
            }
        }

        // 2. Second pass: Local Contrast Heuristic (5x5 Window)
        int radius = 2; // Scans the surrounding 5x5 blocks
        
        for (int r = radius; r < gridRows - radius; r++) {
            for (int c = radius; c < gridCols - radius; c++) {
                
                double currentGreen = greenBlocks[r][c];
                double currentRed = redBlocks[r][c];
                
                // VOID MASK: Ignore the black area outside the eye
                if (currentGreen < 20.0) continue;
                
                // OPTIC DISC MASK: Ignore the massive bright blowout where the nerve enters
                if (currentRed > 220.0 && currentGreen > 200.0) continue;

                // Calculate the local neighborhood average (lighting baseline)
                double localGreenSum = 0;
                int neighborCount = 0;
                for (int dy = -radius; dy <= radius; dy++) {
                    for (int dx = -radius; dx <= radius; dx++) {
                        if (dx == 0 && dy == 0) continue; // Skip the center block
                        localGreenSum += greenBlocks[r + dy][c + dx];
                        neighborCount++;
                    }
                }
                double localGreenAvg = localGreenSum / neighborCount;
                
                // HEURISTIC 1: Microaneurysms / Hemorrhages (Red/Dark Lesions)
                // A sharp drop in contrast compared to the local neighborhood.
                boolean isDarkLesion = (localGreenAvg - currentGreen) > 25.0; 
                
                // HEURISTIC 2: Hard Exudates (Bright Lesions)
                // Lipid deposits are significantly brighter than the surrounding retina.
                boolean isBrightLesion = (currentGreen - localGreenAvg) > 35.0 && currentRed > 150.0;
                
                if (isDarkLesion || isBrightLesion) {
                    RegionData lesion = new RegionData(c, r, currentGreen);
                    lesion.setAnomaly(true);
                    anomalies.add(anomalies.size(), lesion);
                }
            }
        }
        
        System.out.println("Pigmental Pipeline Complete: Found " + anomalies.size() + " isolated lesions.");
        return anomalies;
    }
}