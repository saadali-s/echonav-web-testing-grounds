package gui;

import datastructures.AdjacencyListGraph;
import datastructures.INode;
import datastructures.List;
import datastructures.Matrix;
import datastructures.ArrayList;
import imageprocessing.GraphBuilder;
import imageprocessing.ImageToGraphConverter;
import imageprocessing.RegionData;
import tasks.PathFinder;
import tasks.SimilarityDetector;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.text.DefaultCaret;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;

public class MainFrame extends JFrame {

    private MapPanel mapPanel;
    private JTextArea consoleOutput;
    
    private Matrix greenChannelMatrix;
    private Matrix redChannelMatrix;
    private Matrix binaryVesselMask;
    
    private AdjacencyListGraph<RegionData> vascularGraph;
    private INode<RegionData>[][] nodeGrid;
    
    private final int BLOCK_SIZE = 4; 

    private JLabel lblNodesExtracted, lblAnomaliesFound, lblTortuosityIndex, lblPdrCycles;
    private JButton btnLoadImage, btnExtractNetwork, btnScanAnomalies, btnMeasureTortuosity, btnBatchProcess, btnRunML;

    public MainFrame() {
        setTitle("RetinaGraph Diagnostics & ML Pipeline");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1400, 950);
        setLayout(new BorderLayout());
        getContentPane().setBackground(new Color(24, 24, 27));

        mapPanel = new MapPanel();
        JScrollPane scrollPane = new JScrollPane(mapPanel);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        add(scrollPane, BorderLayout.CENTER);

        setupSidebar();
        setupConsole();
        setupEventHandlers();

        setLocationRelativeTo(null);
    }

    private void setupSidebar() {
        JPanel sidebar = new JPanel();
        sidebar.setPreferredSize(new Dimension(360, getHeight()));
        sidebar.setBackground(new Color(9, 9, 11)); 
        sidebar.setLayout(new BoxLayout(sidebar, BoxLayout.Y_AXIS));
        sidebar.setBorder(new EmptyBorder(25, 25, 25, 25));

        JLabel title = new JLabel("RetinaGraph");
        title.setForeground(Color.WHITE);
        title.setFont(new Font("SansSerif", Font.BOLD, 26));
        title.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        sidebar.add(title);
        sidebar.add(Box.createRigidArea(new Dimension(0, 30)));

        btnLoadImage = createModernButton("1. Load Single Scan", new Color(37, 99, 235));
        btnExtractNetwork = createModernButton("2. Extract Network", new Color(16, 185, 129));
        btnScanAnomalies = createModernButton("3. k-NN Anomaly Scan", new Color(245, 158, 11));
        btnMeasureTortuosity = createModernButton("4. Auto-Measure Chaos", new Color(139, 92, 246));

        btnBatchProcess = createModernButton("5. Batch Extract to CSV", new Color(71, 85, 105));
        btnRunML = createModernButton("6. Execute Weka ML", new Color(225, 29, 72));

        btnExtractNetwork.setEnabled(false);
        btnScanAnomalies.setEnabled(false);
        btnMeasureTortuosity.setEnabled(false);
        btnBatchProcess.setEnabled(true); 
        btnRunML.setEnabled(false);

        sidebar.add(btnLoadImage);
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(btnExtractNetwork);
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(btnScanAnomalies);
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(btnMeasureTortuosity);
        
        sidebar.add(Box.createRigidArea(new Dimension(0, 20)));
        JLabel mlLabel = new JLabel("MACHINE LEARNING");
        mlLabel.setForeground(new Color(161, 161, 170));
        mlLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        sidebar.add(mlLabel);
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        
        sidebar.add(btnBatchProcess);
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(btnRunML);
        sidebar.add(Box.createRigidArea(new Dimension(0, 20)));

        lblNodesExtracted = new JLabel("--");
        lblAnomaliesFound = new JLabel("--");
        lblTortuosityIndex = new JLabel("--");
        lblPdrCycles = new JLabel("--");

        sidebar.add(createTelemetryCard("Vascular Nodes", lblNodesExtracted));
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(createTelemetryCard("Identified Lesions", lblAnomaliesFound));
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(createTelemetryCard("PDR Cycle Nets", lblPdrCycles));
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(createTelemetryCard("Dijkstra TI Score", lblTortuosityIndex));

        add(sidebar, BorderLayout.WEST);
    }

    private void setupConsole() {
        JPanel bottomPanel = new JPanel(new BorderLayout());
        bottomPanel.setPreferredSize(new Dimension(getWidth(), 150));
        bottomPanel.setBorder(new EmptyBorder(10, 10, 10, 10));
        bottomPanel.setBackground(new Color(9, 9, 11));

        consoleOutput = new JTextArea();
        consoleOutput.setEditable(false);
        consoleOutput.setBackground(new Color(24, 24, 27));
        consoleOutput.setForeground(new Color(16, 185, 129));
        consoleOutput.setFont(new Font("Consolas", Font.PLAIN, 13));
        
        DefaultCaret caret = (DefaultCaret)consoleOutput.getCaret();
        caret.setUpdatePolicy(DefaultCaret.ALWAYS_UPDATE);

        JScrollPane consoleScroll = new JScrollPane(consoleOutput);
        consoleScroll.setBorder(BorderFactory.createLineBorder(new Color(63, 63, 70)));
        bottomPanel.add(consoleScroll, BorderLayout.CENTER);

        add(bottomPanel, BorderLayout.SOUTH);
        logToConsole("System Initialized. Awaiting user input...");
    }

    public void logToConsole(String message) {
        SwingUtilities.invokeLater(() -> {
            consoleOutput.append("> " + message + "\n");
        });
    }

    private void setupEventHandlers() {
        btnLoadImage.addActionListener(e -> {
            FileDialog fileDialog = new FileDialog(this, "Select Fundus Scan", FileDialog.LOAD);
            fileDialog.setVisible(true);
            
            if (fileDialog.getFile() != null) {
                File file = new File(fileDialog.getDirectory(), fileDialog.getFile());
                try {
                    logToConsole("Loading Image: " + file.getName() + "...");
                    BufferedImage img = ImageIO.read(file);
                    mapPanel.setPreferredSize(new Dimension(img.getWidth(), img.getHeight()));
                    mapPanel.loadScan(img);
                    
                    greenChannelMatrix = ImageToGraphConverter.extractGreenChannel(file.getAbsolutePath());
                    redChannelMatrix = ImageToGraphConverter.extractRedChannel(file.getAbsolutePath());
                    
                    logToConsole("Matrix extraction complete.");
                    btnExtractNetwork.setEnabled(true);
                } catch (Exception ex) {
                    logToConsole("ERROR: Failed to load image.");
                }
            }
        });

        btnExtractNetwork.addActionListener(e -> {
            try {
                logToConsole("Executing Sauvola Thresholding...");
                Matrix rawMask = ImageToGraphConverter.applySauvolaThresholding(greenChannelMatrix);
                
                logToConsole("Bridging fragmented vessels (Morphological Dilation)...");
                Matrix healedMask = ImageToGraphConverter.applyDilation(rawMask);
                
                logToConsole("Downscaling to Blocks...");
                Matrix blockMask = ImageToGraphConverter.downscaleToBlocks(healedMask, BLOCK_SIZE);
                
                logToConsole("Executing Block-Level Skeletonization...");
                Matrix skeleton = ImageToGraphConverter.applySkeletonization(blockMask);
                
                // THE FIX: Route the skeleton through the topological sanitizer to remove 2x2 meshes
                binaryVesselMask = ImageToGraphConverter.removeStaircaseArtifacts(skeleton);
                
                logToConsole("Building Topological Graph...");
                vascularGraph = GraphBuilder.buildVascularGraph(greenChannelMatrix, binaryVesselMask, BLOCK_SIZE);
                
                int rows = greenChannelMatrix.numberRows() / BLOCK_SIZE;
                int cols = greenChannelMatrix.numberCols() / BLOCK_SIZE;
                nodeGrid = new INode[rows][cols];
                
                List<INode<RegionData>> nodes = vascularGraph.getNodes();
                for (int i = 0; i < nodes.size(); i++) {
                    INode<RegionData> n = nodes.get(i);
                    nodeGrid[n.getData().getGridY()][n.getData().getGridX()] = n;
                }
                
                mapPanel.setGraphData(vascularGraph, nodeGrid, rows, cols, BLOCK_SIZE);
                lblNodesExtracted.setText(String.valueOf(nodes.size()));
                
                logToConsole("Graph Topology Built. Total Nodes: " + nodes.size());
                btnScanAnomalies.setEnabled(true);
                btnMeasureTortuosity.setEnabled(true);
            } catch (Exception ex) {
                logToConsole("ERROR: Matrix operation failed.");
            }
        });

        btnScanAnomalies.addActionListener(e -> {
            logToConsole("Executing k-NN Graph Similarity search...");
            ArrayList<RegionData> isolatedAnomalies = SimilarityDetector.scanForAnomalies(greenChannelMatrix, redChannelMatrix, BLOCK_SIZE);
            
            GraphBuilder.mergeDiagnosticData(vascularGraph, nodeGrid, isolatedAnomalies);
            
            mapPanel.repaint(); 
            lblAnomaliesFound.setText(String.valueOf(isolatedAnomalies.size()));
            logToConsole("k-NN Search Complete. Isolated " + isolatedAnomalies.size() + " pathological lesions.");
        });

        btnMeasureTortuosity.addActionListener(e -> {
            if (vascularGraph == null || vascularGraph.getNodes().size() < 2) {
                logToConsole("ERROR: Not enough nodes in graph.");
                return;
            }
            
            logToConsole("Automating Chaos Measurement...");
            
            int rows = greenChannelMatrix.numberRows() / BLOCK_SIZE;
            int cols = greenChannelMatrix.numberCols() / BLOCK_SIZE;
            
            int pdrCycles = PathFinder.countNeovascularLoops(vascularGraph, rows, cols);
            lblPdrCycles.setText(String.valueOf(pdrCycles));
            logToConsole("Topological Euler Analysis: Found " + pdrCycles + " true vascular loops.");
            
            ArrayList<List<INode<RegionData>>> pathContainer = new ArrayList<>();
            double globalTI = PathFinder.calculateGlobalChaos(vascularGraph, rows, cols, pathContainer);
            
            lblTortuosityIndex.setText(String.format("%.2f", globalTI));
            
            if (pathContainer.size() > 0) {
                mapPanel.setActivePath(pathContainer.get(0));
            }
            
            logToConsole("Exhaustive Trace Complete. Global TI: " + String.format("%.2f", globalTI));
        });
        
        btnBatchProcess.addActionListener(e -> {
            logToConsole("Batch Processor must be run separately via pipeline.BatchProcessor main().");
        });
    }

    private JButton createModernButton(String text, Color color) {
        JButton btn = new JButton(text) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2.setColor(isEnabled() ? color : new Color(63, 63, 70));
                g2.fillRoundRect(0, 0, getWidth(), getHeight(), 10, 10);
                super.paintComponent(g2);
            }
        };
        btn.setMaximumSize(new Dimension(320, 40));
        btn.setAlignmentX(Component.CENTER_ALIGNMENT);
        btn.setForeground(Color.WHITE);
        btn.setFont(new Font("SansSerif", Font.BOLD, 13));
        btn.setFocusPainted(false);
        btn.setContentAreaFilled(false);
        btn.setBorderPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    private JPanel createTelemetryCard(String titleText, JLabel valueLabel) {
        JPanel card = new JPanel();
        card.setLayout(new BoxLayout(card, BoxLayout.Y_AXIS));
        card.setBackground(new Color(24, 24, 27)); 
        card.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(63, 63, 70), 1),
            new EmptyBorder(10, 15, 10, 15)
        ));
        card.setMaximumSize(new Dimension(320, 65));

        JLabel title = new JLabel(titleText.toUpperCase());
        title.setForeground(new Color(161, 161, 170));
        title.setFont(new Font("SansSerif", Font.BOLD, 11));

        valueLabel.setForeground(Color.WHITE);
        valueLabel.setFont(new Font("SansSerif", Font.BOLD, 22));

        card.add(title);
        card.add(Box.createRigidArea(new Dimension(0, 5)));
        card.add(valueLabel);
        return card;
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new MainFrame().setVisible(true));
    }
}