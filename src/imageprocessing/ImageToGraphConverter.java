package imageprocessing;

import datastructures.Matrix;
import datastructures.MatrixException;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;

public class ImageToGraphConverter {

    // --- PIPELINE 1 DATA: Structural Pigment --- //
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

    // --- PIPELINE 2 DATA: Anomaly Pigment --- //
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

    // --- STRUCTURAL MATH: Vessel Edge Detection --- //
    public static Matrix applySobelEdgeDetection(Matrix greenChannel) throws MatrixException {
        int height = greenChannel.numberRows();
        int width = greenChannel.numberCols();
        Matrix sobelMatrix = new Matrix(height, width);

        int[][] gx = {{-1, 0, 1}, {-2, 0, 2}, {-1, 0, 1}};
        int[][] gy = {{-1, -2, -1}, {0, 0, 0}, {1, 2, 1}};

        for (int r = 1; r < height - 1; r++) {
            for (int c = 1; c < width - 1; c++) {
                
                // VOID MASK: Ignore the black background completely
                if (greenChannel.getElement(r, c) < 20.0) {
                    sobelMatrix.setElement(r, c, 0.0);
                    continue;
                }

                double sumX = 0, sumY = 0;
                boolean touchingVoid = false;

                for (int i = -1; i <= 1; i++) {
                    for (int j = -1; j <= 1; j++) {
                        double pixelVal = greenChannel.getElement(r + i, c + j);
                        // THE RIM FIX: Stops the outer eyeball ring from becoming a vessel
                        if (pixelVal < 20.0) touchingVoid = true;
                        
                        sumX += pixelVal * gx[i + 1][j + 1];
                        sumY += pixelVal * gy[i + 1][j + 1];
                    }
                }

                if (touchingVoid) {
                    sobelMatrix.setElement(r, c, 0.0);
                } else {
                    double magnitude = Math.sqrt((sumX * sumX) + (sumY * sumY));
                    sobelMatrix.setElement(r, c, magnitude);
                }
            }
        }
        return sobelMatrix;
    }
}