package pipeline;

import datastructures.Matrix;
import datastructures.ArrayList;
import datastructures.AdjacencyListGraph;
import datastructures.INode;
import datastructures.List;
import imageprocessing.ImageToGraphConverter;
import imageprocessing.RegionData;
import imageprocessing.GraphBuilder;
import tasks.SimilarityDetector;
import tasks.PathFinder;

import javax.swing.*;
import java.io.*;
import java.util.Locale;

public class BatchProcessor {

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {}

        JFileChooser folderChooser = new JFileChooser();
        folderChooser.setDialogTitle("1. Select the Kaggle 'train_images' FOLDER");
        folderChooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
        if (folderChooser.showOpenDialog(null) != JFileChooser.APPROVE_OPTION) return;
        File imagesFolder = folderChooser.getSelectedFile();

        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("2. Select the Kaggle 'train.csv' FILE");
        if (fileChooser.showOpenDialog(null) != JFileChooser.APPROVE_OPTION) return;
        File trainCsv = fileChooser.getSelectedFile();

        File outputFile = new File("training_features.csv");

        System.out.println("Starting Batch Extraction...");
        System.out.println("Reading from: " + imagesFolder.getAbsolutePath());
        System.out.println("Outputting to: " + outputFile.getAbsolutePath());

        try (BufferedReader br = new BufferedReader(new FileReader(trainCsv));
             FileWriter fw = new FileWriter(outputFile)) {

            // Write the headers ONCE at the top of the file
            fw.write("ImageID,VascularNodes,HemorrhageArea,ExudateArea,PDRCycles,TortuosityIndex,Diagnosis\n");

            String line;
            boolean isHeader = true;
            int count = 0;
            int blockSize = 4;

            while ((line = br.readLine()) != null) {
                if (isHeader) {
                    isHeader = false;
                    continue;
                }

                String[] columns = line.split(",");
                if (columns.length < 2) continue;

                String idCode = columns[0];
                String diagnosis = columns[1];

                File imgFile = new File(imagesFolder, idCode + ".png");
                if (!imgFile.exists()) {
                    imgFile = new File(imagesFolder, idCode + ".jpg");
                }

                if (!imgFile.exists()) {
                    System.out.println("Missing image: " + idCode);
                    continue;
                }

                count++;
                System.out.print("Processing " + count + "/3662: " + idCode + "... ");

                Matrix greenChannel = null;
                Matrix redChannel = null;
                Matrix binaryVesselMask = null;
                AdjacencyListGraph<RegionData> vascularGraph = null;
                ArrayList<RegionData> anomalies = null;

                try {
                    greenChannel = ImageToGraphConverter.extractGreenChannel(imgFile.getAbsolutePath());
                    redChannel = ImageToGraphConverter.extractRedChannel(imgFile.getAbsolutePath());

                    anomalies = SimilarityDetector.scanForAnomalies(greenChannel, redChannel, blockSize);

                    int hemorrhageArea = 0;
                    int exudateArea = 0;
                    for (int i = 0; i < anomalies.size(); i++) {
                        if (anomalies.get(i).getGradientIntensity() == 1.0) {
                            hemorrhageArea++;
                        } else {
                            exudateArea++;
                        }
                    }

                    Matrix rawMask = ImageToGraphConverter.applySauvolaThresholding(greenChannel);
                    Matrix healedMask = ImageToGraphConverter.applyDilation(rawMask);
                    Matrix blockMask = ImageToGraphConverter.downscaleToBlocks(healedMask, blockSize);
                    Matrix skeleton = ImageToGraphConverter.applySkeletonization(blockMask);
                    binaryVesselMask = ImageToGraphConverter.removeStaircaseArtifacts(skeleton);
                    
                    // 3. Topology Construction
                    vascularGraph = GraphBuilder.buildVascularGraph(greenChannel, binaryVesselMask, blockSize);
                    
                    int rows = greenChannel.numberRows() / blockSize;
                    int cols = greenChannel.numberCols() / blockSize;
                    
                    // Feature: Vascular Node Count
                    int vascularNodes = vascularGraph.getNodes().size();
                    int pdrCycles = PathFinder.countNeovascularLoops(vascularGraph, rows, cols);

                    ArrayList<List<INode<RegionData>>> dummyContainer = new ArrayList<>();
                    double chaosScore = PathFinder.calculateGlobalChaos(vascularGraph, rows, cols, dummyContainer);

                    fw.write(idCode + "," + vascularNodes + "," + hemorrhageArea + "," + exudateArea + "," + pdrCycles + "," + String.format(Locale.US,"%.4f", chaosScore) + "," + diagnosis + "\n");
                    System.out.println("OK");

                } catch (Exception ex) {
                    System.out.println("FAILED. Skipping image to protect model training.");
                } finally {
                    greenChannel = null;
                    redChannel = null;
                    binaryVesselMask = null;
                    vascularGraph = null;
                    anomalies = null;
                    System.gc();
                }
            }

            System.out.println("\n=======================================================");
            System.out.println("BATCH COMPLETE! Dataset saved to " + outputFile.getAbsolutePath());
            System.out.println("=======================================================");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}