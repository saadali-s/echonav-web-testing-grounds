package imageprocessing;

import datastructures.Matrix;
import datastructures.MatrixException;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;

public class ImageToGraphConverter {

    public static Matrix extractGreenChannel(String imagePath) {
        try {
            BufferedImage image = ImageIO.read(new File(imagePath));
            int width = image.getWidth();
            int height = image.getHeight();
            Matrix greenMatrix = new Matrix(height, width);

            for (int r = 0; r < height; r++) {
                for (int c = 0; c < width; c++) {
                    int pixel = image.getRGB(c, r);
                    double green = new Color(pixel, true).getGreen();
                    greenMatrix.setElement(r, c, green);
                }
            }
            return greenMatrix;
        } catch (IOException | MatrixException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static Matrix extractRedChannel(String imagePath) {
        try {
            BufferedImage image = ImageIO.read(new File(imagePath));
            int width = image.getWidth();
            int height = image.getHeight();
            Matrix redMatrix = new Matrix(height, width);

            for (int r = 0; r < height; r++) {
                for (int c = 0; c < width; c++) {
                    int pixel = image.getRGB(c, r);
                    double red = new Color(pixel, true).getRed();
                    redMatrix.setElement(r, c, red);
                }
            }
            return redMatrix;
        } catch (IOException | MatrixException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static Matrix applySauvolaThresholding(Matrix greenChannel) throws MatrixException {
        int height = greenChannel.numberRows();
        int width = greenChannel.numberCols();
        Matrix binaryMatrix = new Matrix(height, width);
        Matrix normalized = new Matrix(height, width);

        // 1. Geometric FOV Boundaries
        double centerX = width / 2.0;
        double centerY = height / 2.0;
        double maxRadius = Math.min(centerX, centerY) * 0.90;

        // 2. DYNAMIC CONTRAST STRETCHING
        double minG = 255.0;
        double maxG = 0.0;
        
        for (int r = 0; r < height; r++) {
            for (int c = 0; c < width; c++) {
                double distFromCenter = Math.sqrt(Math.pow(c - centerX, 2) + Math.pow(r - centerY, 2));
                if (distFromCenter <= maxRadius) {
                    double val = greenChannel.getElement(r, c);
                    if (val > 20.0) { // Ignore pitch black edges
                        if (val < minG) minG = val;
                        if (val > maxG) maxG = val;
                    }
                }
            }
        }
        
        if (maxG - minG < 1.0) maxG = minG + 1.0; 

        for (int r = 0; r < height; r++) {
            for (int c = 0; c < width; c++) {
                double distFromCenter = Math.sqrt(Math.pow(c - centerX, 2) + Math.pow(r - centerY, 2));
                if (distFromCenter > maxRadius) {
                    normalized.setElement(r, c, 0.0);
                } else {
                    double val = greenChannel.getElement(r, c);
                    if (val <= 20.0) {
                        normalized.setElement(r, c, 0.0);
                    } else {
                        double stretched = ((val - minG) / (maxG - minG)) * 255.0;
                        normalized.setElement(r, c, stretched);
                    }
                }
            }
        }

        // 3. Integral Images computed on the NORMALIZED matrix
        int W = 45; 
        
        // INCRESAED k: Normalized images have high contrast, so we demand stricter thresholding
        double k = 0.20; 
        double R = 128.0; 

        double[][] intSum = new double[height][width];
        double[][] intSqSum = new double[height][width];

        for (int r = 0; r < height; r++) {
            for (int c = 0; c < width; c++) {
                double val = normalized.getElement(r, c);
                
                double topSum = (r > 0) ? intSum[r - 1][c] : 0;
                double leftSum = (c > 0) ? intSum[r][c - 1] : 0;
                double topLeftSum = (r > 0 && c > 0) ? intSum[r - 1][c - 1] : 0;
                intSum[r][c] = val + topSum + leftSum - topLeftSum;

                double topSqSum = (r > 0) ? intSqSum[r - 1][c] : 0;
                double leftSqSum = (c > 0) ? intSqSum[r][c - 1] : 0;
                double topLeftSqSum = (r > 0 && c > 0) ? intSqSum[r - 1][c - 1] : 0;
                intSqSum[r][c] = (val * val) + topSqSum + leftSqSum - topLeftSqSum;
            }
        }

        int offset = W / 2;
        
        // 4. Final Thresholding
        for (int r = 0; r < height; r++) {
            for (int c = 0; c < width; c++) {
                
                double currentVal = normalized.getElement(r, c);
                if (currentVal == 0.0) { 
                    binaryMatrix.setElement(r, c, 0.0);
                    continue;
                }

                int r1 = Math.max(0, r - offset);
                int c1 = Math.max(0, c - offset);
                int r2 = Math.min(height - 1, r + offset);
                int c2 = Math.min(width - 1, c + offset);

                double area = (r2 - r1 + 1) * (c2 - c1 + 1);

                double topSum = (r1 > 0) ? intSum[r1 - 1][c2] : 0;
                double leftSum = (c1 > 0) ? intSum[r2][c1 - 1] : 0;
                double topLeftSum = (r1 > 0 && c1 > 0) ? intSum[r1 - 1][c1 - 1] : 0;
                double sum = intSum[r2][c2] - topSum - leftSum + topLeftSum;

                double topSqSum = (r1 > 0) ? intSqSum[r1 - 1][c2] : 0;
                double leftSqSum = (c1 > 0) ? intSqSum[r2][c1 - 1] : 0;
                double topLeftSqSum = (r1 > 0 && c1 > 0) ? intSqSum[r1 - 1][c1 - 1] : 0;
                double sqSum = intSqSum[r2][c2] - topSqSum - leftSqSum + topLeftSqSum;

                double mean = sum / area;
                double variance = (sqSum / area) - (mean * mean);
                double stdDev = Math.sqrt(Math.max(0, variance));

                // =========================================================
                // NOISE GATES (Recalibrated for 0-255 Stretched Matrix)
                // Stretching contrast also amplifies the noise variance.
                // We must use a stricter 15.0 gate to prevent spiderwebs.
                // =========================================================
                if (stdDev < 15.0) {
                    binaryMatrix.setElement(r, c, 0.0);
                    continue;
                }

                if (mean - currentVal < 15.0) {
                    binaryMatrix.setElement(r, c, 0.0);
                    continue;
                }

                double threshold = mean * (1.0 - k * (1.0 - (stdDev / R)));

                if (currentVal < threshold) {
                    binaryMatrix.setElement(r, c, 1.0); 
                } else {
                    binaryMatrix.setElement(r, c, 0.0); 
                }
            }
        }
        return binaryMatrix;
    }
    
    public static Matrix applyDilation(Matrix binaryMask) throws MatrixException {
        int rows = binaryMask.numberRows();
        int cols = binaryMask.numberCols();
        Matrix dilated = new Matrix(rows, cols);

        for (int r = 1; r < rows - 1; r++) {
            for (int c = 1; c < cols - 1; c++) {
                if (binaryMask.getElement(r, c) == 1.0) {
                    for (int dr = -1; dr <= 1; dr++) {
                        for (int dc = -1; dc <= 1; dc++) {
                            dilated.setElement(r + dr, c + dc, 1.0);
                        }
                    }
                }
            }
        }
        return dilated;
    }

    public static Matrix downscaleToBlocks(Matrix pixelMask, int blockSize) throws MatrixException {
        int rows = pixelMask.numberRows() / blockSize;
        int cols = pixelMask.numberCols() / blockSize;
        Matrix blockMask = new Matrix(rows, cols);
        
        for(int r = 0; r < rows; r++) {
            for(int c = 0; c < cols; c++) {
                int count = 0;
                for(int y = r * blockSize; y < (r + 1) * blockSize; y++) {
                    for(int x = c * blockSize; x < (c + 1) * blockSize; x++) {
                        if(pixelMask.getElement(y, x) == 1.0) count++;
                    }
                }
                if(count >= 4) {
                    blockMask.setElement(r, c, 1.0);
                } else {
                    blockMask.setElement(r, c, 0.0);
                }
            }
        }
        return blockMask;
    }

    public static Matrix applySkeletonization(Matrix binaryMask) throws MatrixException {
        System.out.println("> Executing Stage 2: Zhang-Suen Morphological Skeletonization...");
        int rows = binaryMask.numberRows();
        int cols = binaryMask.numberCols();
        Matrix thinned = new Matrix(rows, cols);
        
        for(int r=0; r<rows; r++) {
            for(int c=0; c<cols; c++) {
                thinned.setElement(r, c, binaryMask.getElement(r, c));
            }
        }
        
        boolean changing1 = true;
        boolean changing2 = true;
        
        datastructures.ArrayList<Integer> delR;
        datastructures.ArrayList<Integer> delC;
        
        while(changing1 || changing2) {
            changing1 = false;
            delR = new datastructures.ArrayList<>();
            delC = new datastructures.ArrayList<>();
            
            for(int r=1; r<rows-1; r++) {
                for(int c=1; c<cols-1; c++) {
                    if(thinned.getElement(r, c) == 1.0) {
                        double p2 = thinned.getElement(r-1, c);
                        double p3 = thinned.getElement(r-1, c+1);
                        double p4 = thinned.getElement(r, c+1);
                        double p5 = thinned.getElement(r+1, c+1);
                        double p6 = thinned.getElement(r+1, c);
                        double p7 = thinned.getElement(r+1, c-1);
                        double p8 = thinned.getElement(r, c-1);
                        double p9 = thinned.getElement(r-1, c-1);
                        
                        double B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
                        int A = 0;
                        if(p2 == 0 && p3 == 1) A++;
                        if(p3 == 0 && p4 == 1) A++;
                        if(p4 == 0 && p5 == 1) A++;
                        if(p5 == 0 && p6 == 1) A++;
                        if(p6 == 0 && p7 == 1) A++;
                        if(p7 == 0 && p8 == 1) A++;
                        if(p8 == 0 && p9 == 1) A++;
                        if(p9 == 0 && p2 == 1) A++;
                        
                        if(B >= 2 && B <= 6 && A == 1 && (p2 * p4 * p6 == 0) && (p4 * p6 * p8 == 0)) {
                            delR.add(delR.size(), r);
                            delC.add(delC.size(), c);
                            changing1 = true;
                        }
                    }
                }
            }
            for(int i=0; i<delR.size(); i++) {
                thinned.setElement(delR.get(i), delC.get(i), 0.0);
            }
            
            changing2 = false;
            delR = new datastructures.ArrayList<>();
            delC = new datastructures.ArrayList<>();
            
            for(int r=1; r<rows-1; r++) {
                for(int c=1; c<cols-1; c++) {
                    if(thinned.getElement(r, c) == 1.0) {
                        double p2 = thinned.getElement(r-1, c);
                        double p3 = thinned.getElement(r-1, c+1);
                        double p4 = thinned.getElement(r, c+1);
                        double p5 = thinned.getElement(r+1, c+1);
                        double p6 = thinned.getElement(r+1, c);
                        double p7 = thinned.getElement(r+1, c-1);
                        double p8 = thinned.getElement(r, c-1);
                        double p9 = thinned.getElement(r-1, c-1);
                        
                        double B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
                        int A = 0;
                        if(p2 == 0 && p3 == 1) A++;
                        if(p3 == 0 && p4 == 1) A++;
                        if(p4 == 0 && p5 == 1) A++;
                        if(p5 == 0 && p6 == 1) A++;
                        if(p6 == 0 && p7 == 1) A++;
                        if(p7 == 0 && p8 == 1) A++;
                        if(p8 == 0 && p9 == 1) A++;
                        if(p9 == 0 && p2 == 1) A++;
                        
                        if(B >= 2 && B <= 6 && A == 1 && (p2 * p4 * p8 == 0) && (p2 * p6 * p8 == 0)) {
                            delR.add(delR.size(), r);
                            delC.add(delC.size(), c);
                            changing2 = true;
                        }
                    }
                }
            }
            for(int i=0; i<delR.size(); i++) {
                thinned.setElement(delR.get(i), delC.get(i), 0.0);
            }
        }
        return thinned;
    }
    
    public static Matrix removeStaircaseArtifacts(Matrix thinnedMask) throws MatrixException {
        System.out.println("> Executing Stage 2.5: Topological Staircase & 2x2 Square Removal...");
        int rows = thinnedMask.numberRows();
        int cols = thinnedMask.numberCols();
        Matrix processed = new Matrix(rows, cols);
        
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                processed.setElement(r, c, thinnedMask.getElement(r, c));
            }
        }
        
        for (int r = 1; r < rows - 1; r++) {
            for (int c = 1; c < cols - 1; c++) {
                if (processed.getElement(r, c) == 1.0) {
                    
                    double p2 = processed.getElement(r - 1, c);    
                    double p3 = processed.getElement(r - 1, c + 1); 
                    double p4 = processed.getElement(r, c + 1);     
                    double p5 = processed.getElement(r + 1, c + 1); 
                    double p6 = processed.getElement(r + 1, c);     
                    double p7 = processed.getElement(r + 1, c - 1); 
                    double p8 = processed.getElement(r, c - 1);     
                    double p9 = processed.getElement(r - 1, c - 1); 
                    
                    double B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
                    if (B <= 1.0) continue; 
                    
                    int A = 0;
                    if (p2 == 0 && p3 == 1) A++;
                    if (p3 == 0 && p4 == 1) A++;
                    if (p4 == 0 && p5 == 1) A++;
                    if (p5 == 0 && p6 == 1) A++;
                    if (p6 == 0 && p7 == 1) A++;
                    if (p7 == 0 && p8 == 1) A++;
                    if (p8 == 0 && p9 == 1) A++;
                    if (p9 == 0 && p2 == 1) A++;
                    
                    if (A != 1) continue; 
                    
                    boolean isRedundant = false;
                    if (p2 == 1 && p4 == 1 && p3 == 1) isRedundant = true;
                    if (p4 == 1 && p6 == 1 && p5 == 1) isRedundant = true;
                    if (p6 == 1 && p8 == 1 && p7 == 1) isRedundant = true;
                    if (p8 == 1 && p2 == 1 && p9 == 1) isRedundant = true;
                    
                    if (isRedundant) {
                        processed.setElement(r, c, 0.0);
                    }
                }
            }
        }
        return processed;
    }
}