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

public class BatchProcessor {

    public static void main(String[] args) {
        // Enforce system look and feel for the file choosers
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {}

        // 1. Select the train_images folder
        JFileChooser folderChooser = new JFileChooser();
        folderChooser.setDialogTitle("1. Select the Kaggle 'train_images' FOLDER");
        folderChooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
        if (folderChooser.showOpenDialog(null) != JFileChooser.APPROVE_OPTION) return;
        File imagesFolder = folderChooser.getSelectedFile();

        // 2. Select the train.csv file
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("2. Select the Kaggle 'train.csv' FILE");
        if (fileChooser.showOpenDialog(null) != JFileChooser.APPROVE_OPTION) return;
        File trainCsv = fileChooser.getSelectedFile();

        // 3. Setup the Output File in the Eclipse project root
        File outputFile = new File("training_features.csv");

        System.out.println("Starting Batch Extraction...");
        System.out.println("Reading from: " + imagesFolder.getAbsolutePath());
        System.out.println("Outputting to: " + outputFile.getAbsolutePath());

        try (BufferedReader br = new BufferedReader(new FileReader(trainCsv));
             FileWriter fw = new FileWriter(outputFile)) {

            // Write the FULL CSV Headers (4 Features + Kaggle Diagnosis)
            fw.write("ImageID,VascularNodes,LesionCount,PDRCycles,TortuosityIndex,Diagnosis\n");

            String line;
            boolean isHeader = true;
            int count = 0;
            int blockSize = 4;

            while ((line = br.readLine()) != null) {
                if (isHeader) {
                    isHeader = false;
                    continue; // Skip the Kaggle CSV header row
                }

                // Kaggle format: "0005cfc8afb6,0"
                String[] columns = line.split(",");
                if (columns.length < 2) continue;
                
                String idCode = columns[0];
                String diagnosis = columns[1];

                // APTOS 2019 dataset uses .png, but fallback to .jpg just in case
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
                    // --- FEATURE EXTRACTION PIPELINE ---
                    greenChannel = ImageToGraphConverter.extractGreenChannel(imgFile.getAbsolutePath());
                    redChannel = ImageToGraphConverter.extractRedChannel(imgFile.getAbsolutePath());

                    // 1. Lesion Count (k-NN)
                    anomalies = SimilarityDetector.scanForAnomalies(greenChannel, redChannel, blockSize);
                    int lesionCount = anomalies.size();

                    // 2. Vascular Skeletonization & Sanitization
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

                    // Feature: PDR Cycles (Euler Characteristic)
                    int pdrCycles = PathFinder.countNeovascularLoops(vascularGraph, rows, cols);

                    // Feature: Dijkstra Tortuosity Index (Exhaustive Trace)
                    ArrayList<List<INode<RegionData>>> dummyContainer = new ArrayList<>();
                    double chaosScore = PathFinder.calculateGlobalChaos(vascularGraph, rows, cols, dummyContainer);

                    // Write exactly to our dataset specification
                    fw.write(idCode + "," + vascularNodes + "," + lesionCount + "," + pdrCycles + "," + String.format("%.4f", chaosScore) + "," + diagnosis + "\n");
                    System.out.println("SUCCESS (Nodes: " + vascularNodes + ", Lesions: " + lesionCount + ", Cycles: " + pdrCycles + ", TI: " + String.format("%.2f", chaosScore) + ")");
                
                } catch (Exception ex) {
                    System.out.println("FAILED (Corrupted Image or Matrix Error). Defaulting to baseline.");
                    // In a fail state, output baseline metrics so Weka doesn't crash on nulls
                    fw.write(idCode + ",0,0,0,1.0000," + diagnosis + "\n");
                } finally {
                    // CRITICAL: Force Java to dump the massive image matrices and graphs from memory
                    // Without this, processing 3600 high-res images will cause a Heap Space OutOfMemoryError
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