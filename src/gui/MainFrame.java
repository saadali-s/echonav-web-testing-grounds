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
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;

public class MainFrame extends JFrame {

    private MapPanel mapPanel;
    
    // Parallel Pipeline Matrices
    private Matrix greenChannelMatrix;
    private Matrix redChannelMatrix;
    private Matrix sobelEdgeMatrix;
    
    private AdjacencyListGraph<RegionData> vascularGraph;
    private INode<RegionData>[][] nodeGrid;
    
    private final int BLOCK_SIZE = 4; 
    private final double DARKNESS_THRESHOLD = 70.0; 
    private final double EDGE_THRESHOLD = 30.0;     

    private JLabel lblInstructions;
    private JLabel lblNodesExtracted, lblAnomaliesFound, lblTortuosityIndex;

    public MainFrame() {
        setTitle("RetinaGraph Diagnostics");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1350, 900);
        setLayout(new BorderLayout());
        getContentPane().setBackground(new Color(24, 24, 27));

        mapPanel = new MapPanel();
        JScrollPane scrollPane = new JScrollPane(mapPanel);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        scrollPane.getVerticalScrollBar().setUnitIncrement(16);
        add(scrollPane, BorderLayout.CENTER);

        // Sidebar
        JPanel sidebar = new JPanel();
        sidebar.setPreferredSize(new Dimension(360, getHeight()));
        sidebar.setBackground(new Color(9, 9, 11)); 
        sidebar.setLayout(new BoxLayout(sidebar, BoxLayout.Y_AXIS));
        sidebar.setBorder(new EmptyBorder(30, 25, 30, 25));

        JLabel title = new JLabel("RetinaGraph");
        title.setForeground(Color.WHITE);
        title.setFont(new Font("SansSerif", Font.BOLD, 26));
        title.setAlignmentX(Component.CENTER_ALIGNMENT);
        
        sidebar.add(title);
        sidebar.add(Box.createRigidArea(new Dimension(0, 20)));

        // Instruction Panel
        JPanel instructionPanel = new JPanel(new BorderLayout());
        instructionPanel.setBackground(new Color(30, 58, 138)); // Deep blue background
        instructionPanel.setBorder(new EmptyBorder(15, 15, 15, 15));
        instructionPanel.setMaximumSize(new Dimension(320, 80));
        
        lblInstructions = new JLabel("<html><b>Awaiting Input:</b><br>Load a Fundus Scan to begin.</html>");
        lblInstructions.setForeground(Color.WHITE);
        lblInstructions.setFont(new Font("SansSerif", Font.PLAIN, 13));
        instructionPanel.add(lblInstructions, BorderLayout.CENTER);
        
        sidebar.add(instructionPanel);
        sidebar.add(Box.createRigidArea(new Dimension(0, 30)));
        
        mapPanel.setInstructionHook(lblInstructions);

        JButton btnLoadImage = createModernButton("1. Load Fundus Scan", new Color(37, 99, 235));
        JButton btnExtractNetwork = createModernButton("2. Extract Network", new Color(16, 185, 129));
        JButton btnScanAnomalies = createModernButton("3. Auto-Scan Anomalies", new Color(245, 158, 11));
        JButton btnMeasureTortuosity = createModernButton("4. Measure Tortuosity", new Color(139, 92, 246));

        btnExtractNetwork.setEnabled(false);
        btnScanAnomalies.setEnabled(false);
        btnMeasureTortuosity.setEnabled(false);

        sidebar.add(btnLoadImage);
        sidebar.add(Box.createRigidArea(new Dimension(0, 15)));
        sidebar.add(btnExtractNetwork);
        sidebar.add(Box.createRigidArea(new Dimension(0, 15)));
        sidebar.add(btnScanAnomalies);
        sidebar.add(Box.createRigidArea(new Dimension(0, 15)));
        sidebar.add(btnMeasureTortuosity);
        sidebar.add(Box.createRigidArea(new Dimension(0, 40)));

        lblNodesExtracted = new JLabel("--");
        lblAnomaliesFound = new JLabel("--");
        lblTortuosityIndex = new JLabel("--");

        sidebar.add(createTelemetryCard("Vascular Nodes", lblNodesExtracted));
        sidebar.add(Box.createRigidArea(new Dimension(0, 12)));
        sidebar.add(createTelemetryCard("Identified Lesions", lblAnomaliesFound));
        sidebar.add(Box.createRigidArea(new Dimension(0, 12)));
        sidebar.add(createTelemetryCard("Dijkstra TI Score", lblTortuosityIndex));

        add(sidebar, BorderLayout.WEST);

        // --- BUTTON EVENTS (Parallel Execution) ---

        btnLoadImage.addActionListener(e -> {
            JFileChooser fileChooser = new JFileChooser();
            if (fileChooser.showOpenDialog(this) == JFileChooser.APPROVE_OPTION) {
                File file = fileChooser.getSelectedFile();
                try {
                    BufferedImage img = ImageIO.read(file);
                    mapPanel.setPreferredSize(new Dimension(img.getWidth(), img.getHeight()));
                    mapPanel.loadScan(img);
                    
                    // Run initial Optical Split
                    greenChannelMatrix = ImageToGraphConverter.extractGreenChannel(file.getAbsolutePath());
                    redChannelMatrix = ImageToGraphConverter.extractRedChannel(file.getAbsolutePath());
                    
                    lblInstructions.setText("<html><b>Image Loaded:</b><br>Extract the network to visualize vessels.</html>");
                    btnExtractNetwork.setEnabled(true);
                } catch (Exception ex) {}
            }
        });

        btnExtractNetwork.addActionListener(e -> {
            try {
                // Pipeline 1: Structural Extraction
                sobelEdgeMatrix = ImageToGraphConverter.applySobelEdgeDetection(greenChannelMatrix);
                vascularGraph = GraphBuilder.buildVascularGraph(
                    greenChannelMatrix, sobelEdgeMatrix, BLOCK_SIZE, EDGE_THRESHOLD, DARKNESS_THRESHOLD
                );
                
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
                
                lblInstructions.setText("<html><b>Network Ready:</b><br>Auto-Scan for lesions or click vessels to measure tortuosity.</html>");
                btnScanAnomalies.setEnabled(true);
                btnMeasureTortuosity.setEnabled(true);
            } catch (Exception ex) {}
        });

        btnScanAnomalies.addActionListener(e -> {
            // Pipeline 2: Anomaly Extraction (Parallel Math)
            ArrayList<RegionData> isolatedAnomalies = SimilarityDetector.scanForAnomalies(greenChannelMatrix, redChannelMatrix, BLOCK_SIZE);
            
            // The Merge
            GraphBuilder.mergeDiagnosticData(vascularGraph, nodeGrid, isolatedAnomalies);
            
            mapPanel.repaint(); 
            lblAnomaliesFound.setText(String.valueOf(isolatedAnomalies.size()));
            lblInstructions.setText("<html><b>Anomalies Found:</b><br>Lesions are marked in red.</html>");
        });

        btnMeasureTortuosity.addActionListener(e -> {
            INode<RegionData> start = mapPanel.getStartNode();
            INode<RegionData> end = mapPanel.getEndNode();
            
            if (start == null || end == null) return;

            int rows = greenChannelMatrix.numberRows() / BLOCK_SIZE;
            int cols = greenChannelMatrix.numberCols() / BLOCK_SIZE;
            
            List<INode<RegionData>> path = PathFinder.calculateTortuosity(vascularGraph, start, end, rows, cols);
            mapPanel.setActivePath(path);
            
            double actualPathLength = path.size(); 
            double euclid = Math.sqrt(Math.pow(end.getData().getGridX() - start.getData().getGridX(), 2) 
                                    + Math.pow(end.getData().getGridY() - start.getData().getGridY(), 2));
            double ti = actualPathLength / (euclid == 0 ? 1 : euclid);
            
            lblTortuosityIndex.setText(String.format("%.2f", ti));
            lblInstructions.setText("<html><b>Tortuosity Mapped:</b><br>Path rendered in cyan. Index calculated.</html>");
        });

        setLocationRelativeTo(null);
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
        btn.setMaximumSize(new Dimension(320, 45));
        btn.setAlignmentX(Component.CENTER_ALIGNMENT);
        btn.setForeground(Color.WHITE);
        btn.setFont(new Font("SansSerif", Font.BOLD, 14));
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
            new EmptyBorder(15, 20, 15, 20)
        ));
        card.setMaximumSize(new Dimension(320, 80));

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