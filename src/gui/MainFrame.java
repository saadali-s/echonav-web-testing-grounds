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
import tasks.GraphMetrics;
import pipeline.RetinaClassifier;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;

public class MainFrame extends JFrame {

    private CardLayout cardLayout;
    private JPanel rootPanel;
    private JPanel mainViewPanel;
    private ComparePanel compareViewPanel;

    private MapPanel mapPanel;
    private Matrix greenChannelMatrix;
    private Matrix redChannelMatrix;
    private Matrix binaryVesselMask;
    private AdjacencyListGraph<RegionData> vascularGraph;
    private INode<RegionData>[][] nodeGrid;
    private final int BLOCK_SIZE = 4;

    private int lastNodes = 0;
    private int lastLesions = 0;
    private int lastHemorrhages = 0;
    private int lastExudates = 0;
    private int lastCycles = 0;
    private double lastTI = 1.0;
    private int lastEndpoints = 0;
    private int lastBranchPoints = 0;
    private int lastLargestComponent = 0;
    private double lastVesselDensity = 0.0;

    private RetinaClassifier wekaClassifier;

    private JLabel lblVascularNodes, lblIdentifiedLesions, lblTortuosityScore, lblNeovascularLoops;
    private JButton btnUploadRetinalScan, btnClearWorkspace, btnIdentifyVascularNodes, btnIdentifyLesions, btnComputeVascularMetrics, btnExecuteMLClassification, btnCompareImages;

    private JLabel lblWekaVascularNodes, lblWekaHemorrhages, lblWekaExudates, lblWekaNeovascularLoops, lblWekaTortuosityScore, lblWekaEndpoints, lblWekaBranchPoints, lblWekaLargestNetwork, lblWekaVesselDensity;
    private GradeSliderPanel gradeSlider;

    public MainFrame() {
        setTitle("RetinaGraph Diagnostics & ML Pipeline");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1600, 1100);
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        getContentPane().setBackground(new Color(24, 24, 27));

        try {
            wekaClassifier = new RetinaClassifier("retina_model.model");
        } catch (Exception e) {
            System.out.println("Model not found yet or error loading.");
        }

        cardLayout = new CardLayout();
        rootPanel = new JPanel(cardLayout);

        buildMainView();

        compareViewPanel = new ComparePanel(cardLayout, rootPanel, wekaClassifier);

        rootPanel.add(mainViewPanel, "MAIN");
        rootPanel.add(compareViewPanel, "COMPARE");

        setContentPane(rootPanel);
        setLocationRelativeTo(null);
    }

    private void buildMainView() {
        mainViewPanel = new JPanel(new BorderLayout());
        mainViewPanel.setBackground(new Color(24, 24, 27));

        mapPanel = new MapPanel();
        mainViewPanel.add(mapPanel, BorderLayout.CENTER);

        setupSidebar();
        setupRightPanel();
        setupBottomPanel();
        setupEventHandlers();
    }

    private void setupSidebar() {
        JPanel sidebar = new JPanel();
        sidebar.setBackground(new Color(9, 9, 11));
        sidebar.setLayout(new BoxLayout(sidebar, BoxLayout.Y_AXIS));
        sidebar.setBorder(new EmptyBorder(25, 25, 25, 25));

        JLabel title = new JLabel("RetinaGraph");
        title.setForeground(Color.WHITE);
        title.setFont(new Font("SansSerif", Font.BOLD, 26));
        title.setAlignmentX(Component.CENTER_ALIGNMENT);

        sidebar.add(title);
        sidebar.add(Box.createRigidArea(new Dimension(0, 30)));

        btnUploadRetinalScan = createModernButton("1. Upload Retinal Scan", new Color(37, 99, 235));
        btnIdentifyVascularNodes = createModernButton("2. Identify Vascular Nodes", new Color(16, 185, 129));
        btnIdentifyLesions = createModernButton("3. Identify Lesions (k-NN)", new Color(245, 158, 11));
        btnComputeVascularMetrics = createModernButton("4. Compute Vascular Metrics", new Color(139, 92, 246));

        btnExecuteMLClassification = createModernButton("5. Execute ML Classification", new Color(225, 29, 72));
        btnClearWorkspace = createModernButton("Clear Workspace", new Color(200, 24, 24));
        btnCompareImages = createModernButton("Compare Images", new Color(34, 182, 182));

        btnIdentifyVascularNodes.setEnabled(false);
        btnIdentifyLesions.setEnabled(false);
        btnComputeVascularMetrics.setEnabled(false);
        btnExecuteMLClassification.setEnabled(false);

        sidebar.add(btnUploadRetinalScan);
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(btnIdentifyVascularNodes);
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(btnIdentifyLesions);
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(btnComputeVascularMetrics);

        sidebar.add(Box.createRigidArea(new Dimension(0, 20)));
        JLabel mlLabel = new JLabel("MACHINE LEARNING");
        mlLabel.setForeground(new Color(161, 161, 170));
        mlLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        sidebar.add(mlLabel);
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));

        sidebar.add(btnExecuteMLClassification);
        sidebar.add(Box.createRigidArea(new Dimension(0, 20)));

        lblVascularNodes = new JLabel("--");
        lblIdentifiedLesions = new JLabel("--");
        lblTortuosityScore = new JLabel("--");
        lblNeovascularLoops = new JLabel("--");

        sidebar.add(createTelemetryCard("Vascular Nodes", lblVascularNodes));
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(createTelemetryCard("Identified Lesions", lblIdentifiedLesions));
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(createTelemetryCard("Neovascular Loops", lblNeovascularLoops));
        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(createTelemetryCard("Tortuosity Score", lblTortuosityScore));

        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(btnClearWorkspace);

        sidebar.add(Box.createRigidArea(new Dimension(0, 10)));
        sidebar.add(btnCompareImages);

        mainViewPanel.add(sidebar, BorderLayout.WEST);
    }

    private void setupRightPanel() {
        JPanel rightPanel = new JPanel();
        rightPanel.setPreferredSize(new Dimension(320, getHeight()));
        rightPanel.setBackground(new Color(9, 9, 11));
        rightPanel.setLayout(new BoxLayout(rightPanel, BoxLayout.Y_AXIS));
        rightPanel.setBorder(new EmptyBorder(25, 25, 25, 25));

        JLabel title = new JLabel("Data Extractions");
        title.setForeground(Color.WHITE);
        title.setFont(new Font("SansSerif", Font.BOLD, 22));
        title.setAlignmentX(Component.CENTER_ALIGNMENT);

        rightPanel.add(title);
        rightPanel.add(Box.createRigidArea(new Dimension(0, 30)));

        lblWekaVascularNodes = createResultLabel("Vascular Nodes: --");
        lblWekaHemorrhages = createResultLabel("Hemorrhages: --");
        lblWekaExudates = createResultLabel("Exudates: --");
        lblWekaNeovascularLoops = createResultLabel("Neovascular Loops: --");
        lblWekaTortuosityScore = createResultLabel("Tortuosity Score: --");
        lblWekaEndpoints = createResultLabel("Endpoints: --");
        lblWekaBranchPoints = createResultLabel("Branch Points: --");
        lblWekaLargestNetwork = createResultLabel("Largest Network: --");
        lblWekaVesselDensity = createResultLabel("Vessel Density: --");

        rightPanel.add(lblWekaVascularNodes);
        rightPanel.add(Box.createRigidArea(new Dimension(0, 15)));
        rightPanel.add(lblWekaHemorrhages);
        rightPanel.add(Box.createRigidArea(new Dimension(0, 15)));
        rightPanel.add(lblWekaExudates);
        rightPanel.add(Box.createRigidArea(new Dimension(0, 15)));
        rightPanel.add(lblWekaNeovascularLoops);
        rightPanel.add(Box.createRigidArea(new Dimension(0, 15)));
        rightPanel.add(lblWekaTortuosityScore);
        rightPanel.add(Box.createRigidArea(new Dimension(0, 15)));
        rightPanel.add(lblWekaEndpoints);
        rightPanel.add(Box.createRigidArea(new Dimension(0, 15)));
        rightPanel.add(lblWekaBranchPoints);
        rightPanel.add(Box.createRigidArea(new Dimension(0, 15)));
        rightPanel.add(lblWekaLargestNetwork);
        rightPanel.add(Box.createRigidArea(new Dimension(0, 15)));
        rightPanel.add(lblWekaVesselDensity);

        mainViewPanel.add(rightPanel, BorderLayout.EAST);
    }

    private void setupBottomPanel() {
        gradeSlider = new GradeSliderPanel();
        gradeSlider.setPreferredSize(new Dimension(getWidth(), 120));
        mainViewPanel.add(gradeSlider, BorderLayout.SOUTH);
    }

    private JLabel createResultLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setForeground(new Color(161, 161, 170));
        lbl.setFont(new Font("Consolas", Font.PLAIN, 14));
        lbl.setAlignmentX(Component.CENTER_ALIGNMENT);
        return lbl;
    }

    public void logToConsole(String message) {
        System.out.println("LOG: " + message);
    }

    private void setupEventHandlers() {

        btnCompareImages.addActionListener(e -> {
            cardLayout.show(rootPanel, "COMPARE");
        });

        btnUploadRetinalScan.addActionListener(e -> {
            FileDialog fileDialog = new FileDialog(this, "Select Fundus Scan", FileDialog.LOAD);
            fileDialog.setVisible(true);

            if (fileDialog.getFile() != null) {
                File file = new File(fileDialog.getDirectory(), fileDialog.getFile());
                try {
                    logToConsole("Loading Image: " + file.getName() + "...");
                    BufferedImage img = ImageIO.read(file);
                    mapPanel.loadScan(img);

                    greenChannelMatrix = ImageToGraphConverter.extractGreenChannel(file.getAbsolutePath());
                    redChannelMatrix = ImageToGraphConverter.extractRedChannel(file.getAbsolutePath());

                    logToConsole("Matrix extraction complete.");
                    btnIdentifyVascularNodes.setEnabled(true);
                    btnIdentifyLesions.setEnabled(false);
                    btnComputeVascularMetrics.setEnabled(false);
                    btnExecuteMLClassification.setEnabled(false);
                } catch (Exception ex) {
                    logToConsole("ERROR: Failed to load image.");
                }
            }
        });

        btnIdentifyVascularNodes.addActionListener(e -> {
            try {
                Matrix rawMask = ImageToGraphConverter.applySauvolaThresholding(greenChannelMatrix);

                ImageToGraphConverter.DensityMetrics densityData = ImageToGraphConverter.calculateVesselDensity(rawMask);
                lastVesselDensity = densityData.densityRatio;

                Matrix healedMask = ImageToGraphConverter.applyDilation(rawMask);
                Matrix blockMask = ImageToGraphConverter.downscaleToBlocks(healedMask, BLOCK_SIZE);
                Matrix skeleton = ImageToGraphConverter.applySkeletonization(blockMask);

                binaryVesselMask = ImageToGraphConverter.removeStaircaseArtifacts(skeleton);

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

                lastNodes = nodes.size();
                lblVascularNodes.setText(String.valueOf(lastNodes));

                btnIdentifyLesions.setEnabled(true);
                btnComputeVascularMetrics.setEnabled(true);
            } catch (Exception ex) {
                logToConsole("ERROR: Matrix operation failed.");
            }
        });

        btnIdentifyLesions.addActionListener(e -> {
            ArrayList<RegionData> isolatedAnomalies = SimilarityDetector.scanForAnomalies(greenChannelMatrix, redChannelMatrix, BLOCK_SIZE);

            GraphBuilder.mergeDiagnosticData(vascularGraph, nodeGrid, isolatedAnomalies);
            mapPanel.repaint();

            lastLesions = isolatedAnomalies.size();
            lblIdentifiedLesions.setText(String.valueOf(lastLesions));

            lastHemorrhages = 0;
            lastExudates = 0;
            for (int i = 0; i < isolatedAnomalies.size(); i++) {
                if (isolatedAnomalies.get(i).getGradientIntensity() == 1.0) {
                    lastHemorrhages++;
                } else {
                    lastExudates++;
                }
            }
        });

        btnComputeVascularMetrics.addActionListener(e -> {
            if (vascularGraph == null || vascularGraph.getNodes().size() < 2) return;

            int rows = greenChannelMatrix.numberRows() / BLOCK_SIZE;
            int cols = greenChannelMatrix.numberCols() / BLOCK_SIZE;

            lastEndpoints = GraphMetrics.countEndpoints(vascularGraph);
            lastBranchPoints = GraphMetrics.countBranchPoints(vascularGraph);
            lastLargestComponent = GraphMetrics.calculateLargestComponentSize(vascularGraph, rows, cols);

            lastCycles = PathFinder.countNeovascularLoops(vascularGraph, rows, cols);
            lblNeovascularLoops.setText(String.valueOf(lastCycles));

            ArrayList<List<INode<RegionData>>> pathContainer = new ArrayList<>();
            lastTI = PathFinder.calculateGlobalChaos(vascularGraph, rows, cols, pathContainer);
            lblTortuosityScore.setText(String.format("%.2f", lastTI));

            if (pathContainer.size() > 0) {
                mapPanel.setActivePath(pathContainer.get(0));
            }

            btnExecuteMLClassification.setEnabled(true);
        });

        btnExecuteMLClassification.addActionListener(e -> {
            if (wekaClassifier == null) {
                wekaClassifier = new RetinaClassifier("retina_model.model");
            }

            String resultIndex = wekaClassifier.predictDiagnosis(
                    lastNodes, lastHemorrhages, lastExudates, lastCycles, lastTI,
                    lastEndpoints, lastBranchPoints, lastLargestComponent, lastVesselDensity
            );

            lblWekaVascularNodes.setText("Vascular Nodes: " + lastNodes);
            lblWekaHemorrhages.setText("Hemorrhages: " + lastHemorrhages);
            lblWekaExudates.setText("Exudates: " + lastExudates);
            lblWekaNeovascularLoops.setText("Neovascular Loops: " + lastCycles);
            lblWekaTortuosityScore.setText("Tortuosity Score: " + String.format("%.2f", lastTI));
            lblWekaEndpoints.setText("Endpoints: " + lastEndpoints);
            lblWekaBranchPoints.setText("Branch Points: " + lastBranchPoints);
            lblWekaLargestNetwork.setText("Largest Network: " + lastLargestComponent);
            lblWekaVesselDensity.setText("Vessel Density: " + String.format("%.2f%%", lastVesselDensity * 100));

            int gradeIndex = 0;
            try {
                gradeIndex = Integer.parseInt(resultIndex);
            } catch (Exception ex) {
                logToConsole("Error parsing grade: " + resultIndex);
            }
            gradeSlider.animateToGrade(gradeIndex);
        });

        btnClearWorkspace.addActionListener(e -> {
            mapPanel.loadScan(null);
            greenChannelMatrix = null;
            redChannelMatrix = null;
            binaryVesselMask = null;
            vascularGraph = null;
            nodeGrid = null;

            lastNodes = 0;
            lastLesions = 0;
            lastHemorrhages = 0;
            lastExudates = 0;
            lastCycles = 0;
            lastTI = 1.0;
            lastEndpoints = 0;
            lastBranchPoints = 0;
            lastLargestComponent = 0;
            lastVesselDensity = 0.0;

            lblVascularNodes.setText("--");
            lblIdentifiedLesions.setText("--");
            lblNeovascularLoops.setText("--");
            lblTortuosityScore.setText("--");

            lblWekaVascularNodes.setText("Vascular Nodes: --");
            lblWekaHemorrhages.setText("Hemorrhages: --");
            lblWekaExudates.setText("Exudates: --");
            lblWekaNeovascularLoops.setText("Neovascular Loops: --");
            lblWekaTortuosityScore.setText("Tortuosity Score: --");
            lblWekaEndpoints.setText("Endpoints: --");
            lblWekaBranchPoints.setText("Branch Points: --");
            lblWekaLargestNetwork.setText("Largest Network: --");
            lblWekaVesselDensity.setText("Vessel Density: --");

            gradeSlider.reset();

            btnIdentifyVascularNodes.setEnabled(false);
            btnIdentifyLesions.setEnabled(false);
            btnComputeVascularMetrics.setEnabled(false);
            btnExecuteMLClassification.setEnabled(false);
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
        card.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel title = new JLabel(titleText.toUpperCase());
        title.setForeground(new Color(161, 161, 170));
        title.setFont(new Font("SansSerif", Font.BOLD, 11));
        title.setAlignmentX(Component.CENTER_ALIGNMENT);
        title.setHorizontalAlignment(SwingConstants.CENTER);

        valueLabel.setForeground(Color.WHITE);
        valueLabel.setFont(new Font("SansSerif", Font.BOLD, 22));
        valueLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        valueLabel.setHorizontalAlignment(SwingConstants.CENTER);

        card.add(title);
        card.add(Box.createRigidArea(new Dimension(0, 5)));
        card.add(valueLabel);
        return card;
    }

    class GradeSliderPanel extends JPanel {
        private int targetGrade = -1;
        private double currentX = -1;
        private Timer timer;

        private final String[] labels = {"Grade 0: Normal", "Grade 1: Mild DR", "Grade 2: Moderate DR", "Grade 3: Severe DR", "Grade 4: Proliferative DR"};
        private final Color[] gradeColors = {
                new Color(16, 185, 129), new Color(132, 204, 22), new Color(234, 179, 8), new Color(249, 115, 22), new Color(225, 29, 72)
        };

        public GradeSliderPanel() {
            setBackground(new Color(9, 9, 11));
            setBorder(BorderFactory.createMatteBorder(1, 0, 0, 0, new Color(63, 63, 70)));
            timer = new Timer(16, e -> updateAnimation());
        }

        public void animateToGrade(int grade) {
            this.targetGrade = Math.max(0, Math.min(grade, 4));
            timer.start();
        }

        public void reset() {
            this.targetGrade = -1;
            this.currentX = -1;
            timer.stop();
            repaint();
        }

        private void updateAnimation() {
            if (targetGrade < 0) return;
            double targetX = getTargetXForGrade(targetGrade);
            if (currentX < 0) currentX = getTargetXForGrade(0);

            double dx = targetX - currentX;
            if (Math.abs(dx) < 1.0) {
                currentX = targetX;
                timer.stop();
            } else {
                currentX += dx * 0.1;
            }
            repaint();
        }

        private double getTargetXForGrade(int grade) {
            int padding = 60;
            int usableWidth = getWidth() - (padding * 2);
            int sectionWidth = usableWidth / 5;
            return padding + (grade * sectionWidth) + (sectionWidth / 2.0);
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            int padding = 60;
            int usableWidth = getWidth() - (padding * 2);
            if(usableWidth <= 0) return;

            int sectionWidth = usableWidth / 5;
            int trackHeight = 12;
            int trackY = (getHeight() / 2) - 10;

            for (int i = 0; i < 5; i++) {
                int startX = padding + (i * sectionWidth);
                g2.setColor(gradeColors[i]);
                g2.fillRoundRect(startX + 2, trackY, sectionWidth - 4, trackHeight, 10, 10);

                g2.setColor(i == targetGrade ? Color.WHITE : new Color(161, 161, 170));
                g2.setFont(new Font("SansSerif", Font.BOLD, 12));
                int textWidth = g2.getFontMetrics().stringWidth(labels[i]);
                g2.drawString(labels[i], startX + (sectionWidth / 2) - (textWidth / 2), trackY + trackHeight + 25);
            }

            if (currentX >= 0) {
                g2.setColor(Color.WHITE);
                int arrowSize = 14;
                int ax = (int) currentX;
                int ay = trackY - 5;
                g2.fillPolygon(new int[]{ax - arrowSize, ax + arrowSize, ax}, new int[]{ay - arrowSize - 5, ay - arrowSize - 5, ay}, 3);
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new MainFrame().setVisible(true));
    }
}