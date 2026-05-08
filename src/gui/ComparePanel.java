package gui;

import datastructures.AdjacencyListGraph;
import datastructures.ArrayList;
import datastructures.Matrix;
import imageprocessing.GraphBuilder;
import imageprocessing.ImageToGraphConverter;
import imageprocessing.RegionData;
import pipeline.RetinaClassifier;
import tasks.GraphMetrics;
import tasks.PathFinder;
import tasks.SimilarityDetector;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.io.File;

public class ComparePanel extends JPanel {

    private CardLayout cardLayout;
    private JPanel rootPanel;
    private RetinaClassifier wekaClassifier;

    private MapPanel mapPanel1;
    private MapPanel mapPanel2;
    private JLabel lblGrade1;
    private JLabel lblGrade2;
    private File scanFile1;
    private File scanFile2;
    private ComparisonChartPanel chartPanel;
    private final int BLOCK_SIZE = 4;

    public ComparePanel(CardLayout cardLayout, JPanel rootPanel, RetinaClassifier wekaClassifier) {
        this.cardLayout = cardLayout;
        this.rootPanel = rootPanel;
        this.wekaClassifier = wekaClassifier;

        setLayout(new BorderLayout());
        setBackground(new Color(24, 24, 27));

        JPanel header = new JPanel(new FlowLayout(FlowLayout.LEFT));
        header.setBackground(new Color(9, 9, 11));
        header.setBorder(new EmptyBorder(10, 10, 10, 10));
        JButton btnMainMenu = createModernButton("Main Menu", new Color(100, 116, 139));
        btnMainMenu.setPreferredSize(new Dimension(150, 40));
        btnMainMenu.addActionListener(e -> cardLayout.show(rootPanel, "MAIN"));
        header.add(btnMainMenu);

        JLabel title = new JLabel("  Retinal Scan Comparison");
        title.setForeground(Color.WHITE);
        title.setFont(new Font("SansSerif", Font.BOLD, 22));
        header.add(title);
        add(header, BorderLayout.NORTH);

        JPanel centerPanel = new JPanel(new GridLayout(1, 2, 20, 20));
        centerPanel.setBackground(new Color(24, 24, 27));
        centerPanel.setBorder(new EmptyBorder(20, 20, 20, 20));

        JPanel leftSide = new JPanel(new BorderLayout(0, 10));
        leftSide.setOpaque(false);
        mapPanel1 = new MapPanel();
        JButton btnUploadRetinalScan1 = createModernButton("Load Image 1", new Color(37, 99, 235));
        lblGrade1 = createGradeLabel("Scan 1 Grade: ");
        leftSide.add(mapPanel1, BorderLayout.CENTER);
        JPanel leftControls = new JPanel(new FlowLayout());
        leftControls.setOpaque(false);
        leftControls.add(btnUploadRetinalScan1);
        leftControls.add(lblGrade1);
        leftSide.add(leftControls, BorderLayout.SOUTH);

        JPanel rightSide = new JPanel(new BorderLayout(0, 10));
        rightSide.setOpaque(false);
        mapPanel2 = new MapPanel();
        JButton btnUploadRetinalScan2 = createModernButton("Load Image 2", new Color(37, 99, 235));
        lblGrade2 = createGradeLabel("Scan 2 Grade: ");
        rightSide.add(mapPanel2, BorderLayout.CENTER);
        JPanel rightControls = new JPanel(new FlowLayout());
        rightControls.setOpaque(false);
        rightControls.add(btnUploadRetinalScan2);
        rightControls.add(lblGrade2);
        rightSide.add(rightControls, BorderLayout.SOUTH);

        centerPanel.add(leftSide);
        centerPanel.add(rightSide);
        add(centerPanel, BorderLayout.CENTER);

        JPanel bottomPanel = new JPanel(new BorderLayout());
        bottomPanel.setBackground(new Color(9, 9, 11));
        bottomPanel.setBorder(new EmptyBorder(20, 20, 20, 20));

        JButton btnCompareTelemetry = createModernButton("Compare Telemetry & ML Diagnostics", new Color(139, 92, 246));
        btnCompareTelemetry.setPreferredSize(new Dimension(300, 50));

        JButton btnClearWorkspace = createModernButton("Clear Workspace", new Color(200, 24, 24));
        btnClearWorkspace.setPreferredSize(new Dimension(200, 50));

        JPanel actionPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 20, 0));
        actionPanel.setOpaque(false);
        actionPanel.add(btnCompareTelemetry);
        actionPanel.add(btnClearWorkspace);
        bottomPanel.add(actionPanel, BorderLayout.NORTH);

        chartPanel = new ComparisonChartPanel();
        chartPanel.setPreferredSize(new Dimension(getWidth(), 300));
        bottomPanel.add(chartPanel, BorderLayout.CENTER);

        add(bottomPanel, BorderLayout.SOUTH);

        btnUploadRetinalScan1.addActionListener(e -> scanFile1 = selectAndLoadImage(mapPanel1));
        btnUploadRetinalScan2.addActionListener(e -> scanFile2 = selectAndLoadImage(mapPanel2));

        btnClearWorkspace.addActionListener(e -> {
            scanFile1 = null;
            scanFile2 = null;
            mapPanel1.loadScan(null);
            mapPanel2.loadScan(null);
            lblGrade1.setText("Scan 1 Grade: ");
            lblGrade2.setText("Scan 2 Grade: ");
            chartPanel.updateData(null, null);
        });

        btnCompareTelemetry.addActionListener(e -> {
            if (scanFile1 == null || scanFile2 == null) {
                JOptionPane.showMessageDialog(this, "Please load both images first.");
                return;
            }
            btnCompareTelemetry.setText("Processing... Please wait.");
            btnCompareTelemetry.setEnabled(false);
            btnClearWorkspace.setEnabled(false);

            SwingWorker<Void, Void> worker = new SwingWorker<Void, Void>() {
                ImageMetrics metrics1, metrics2;
                @Override
                protected Void doInBackground() throws Exception {
                    metrics1 = analyzeFileSilently(scanFile1);
                    metrics2 = analyzeFileSilently(scanFile2);
                    return null;
                }
                @Override
                protected void done() {
                    try {
                        get();
                        lblGrade1.setText("Scan 1 Grade: " + metrics1.grade);
                        lblGrade2.setText("Scan 2 Grade: " + metrics2.grade);
                        chartPanel.updateData(metrics1, metrics2);
                    } catch (Exception ex) {
                        JOptionPane.showMessageDialog(ComparePanel.this, "Error processing images.");
                    } finally {
                        btnCompareTelemetry.setText("Compare Telemetry & ML Diagnostics");
                        btnCompareTelemetry.setEnabled(true);
                        btnClearWorkspace.setEnabled(true);
                    }
                }
            };
            worker.execute();
        });
    }

    private File selectAndLoadImage(MapPanel targetMap) {
        FileDialog dialog = new FileDialog((Frame) SwingUtilities.getWindowAncestor(this), "Select Fundus Scan", FileDialog.LOAD);
        dialog.setVisible(true);
        if (dialog.getFile() != null) {
            File file = new File(dialog.getDirectory(), dialog.getFile());
            try {
                targetMap.loadScan(ImageIO.read(file));
                return file;
            } catch (Exception ex) {
                return null;
            }
        }
        return null;
    }

    private JLabel createGradeLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setForeground(Color.WHITE);
        lbl.setFont(new Font("SansSerif", Font.BOLD, 16));
        return lbl;
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
        btn.setAlignmentX(Component.CENTER_ALIGNMENT);
        btn.setForeground(Color.WHITE);
        btn.setFont(new Font("SansSerif", Font.BOLD, 13));
        btn.setFocusPainted(false);
        btn.setContentAreaFilled(false);
        btn.setBorderPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        return btn;
    }

    private ImageMetrics analyzeFileSilently(File file) throws Exception {
        ImageMetrics metrics = new ImageMetrics();
        Matrix greenChannelMatrix = ImageToGraphConverter.extractGreenChannel(file.getAbsolutePath());
        Matrix redChannelMatrix = ImageToGraphConverter.extractRedChannel(file.getAbsolutePath());

        Matrix rawMask = ImageToGraphConverter.applySauvolaThresholding(greenChannelMatrix);
        metrics.vesselDensity = ImageToGraphConverter.calculateVesselDensity(rawMask).densityRatio;

        Matrix healedMask = ImageToGraphConverter.applyDilation(rawMask);
        Matrix blockMask = ImageToGraphConverter.downscaleToBlocks(healedMask, BLOCK_SIZE);
        Matrix skeleton = ImageToGraphConverter.applySkeletonization(blockMask);
        Matrix binaryVesselMask = ImageToGraphConverter.removeStaircaseArtifacts(skeleton);

        AdjacencyListGraph<RegionData> vascularGraph = GraphBuilder.buildVascularGraph(greenChannelMatrix, binaryVesselMask, BLOCK_SIZE);
        metrics.vascularNodes = vascularGraph.getNodes().size();

        ArrayList<RegionData> isolatedAnomalies = SimilarityDetector.scanForAnomalies(greenChannelMatrix, redChannelMatrix, BLOCK_SIZE);
        for(int i = 0; i < isolatedAnomalies.size(); i++) {
            if(isolatedAnomalies.get(i).getGradientIntensity() == 1.0) metrics.hemorrhages++;
            else metrics.exudates++;
        }

        int rows = greenChannelMatrix.numberRows() / BLOCK_SIZE;
        int cols = greenChannelMatrix.numberCols() / BLOCK_SIZE;
        metrics.endpoints = GraphMetrics.countEndpoints(vascularGraph);
        metrics.branchPoints = GraphMetrics.countBranchPoints(vascularGraph);
        metrics.largestNetwork = GraphMetrics.calculateLargestComponentSize(vascularGraph, rows, cols);
        metrics.neovascularLoops = PathFinder.countNeovascularLoops(vascularGraph, rows, cols);
        metrics.tortuosityScore = PathFinder.calculateGlobalChaos(vascularGraph, rows, cols, new ArrayList<>());

        if (wekaClassifier != null) {
            String resultIndex = wekaClassifier.predictDiagnosis(metrics.vascularNodes, metrics.hemorrhages, metrics.exudates, metrics.neovascularLoops, metrics.tortuosityScore, metrics.endpoints, metrics.branchPoints, metrics.largestNetwork, metrics.vesselDensity);
            try {
                metrics.grade = Integer.parseInt(resultIndex);
            } catch (Exception e) {}
        }
        return metrics;
    }

    class ImageMetrics {
        int vascularNodes, hemorrhages, exudates, neovascularLoops, endpoints, branchPoints, largestNetwork, grade;
        double tortuosityScore, vesselDensity;
    }

    class ComparisonChartPanel extends JPanel {
        private ImageMetrics metrics1, metrics2;
        private final String[] labels = {"Vascular Nodes", "Hemorrhages", "Exudates", "Neovascular Loops", "Tortuosity Score", "Endpoints", "Branch Points", "Largest Network", "Vessel Density"};

        public ComparisonChartPanel() {
            setBackground(new Color(24, 24, 27));
        }

        public void updateData(ImageMetrics img1, ImageMetrics img2) {
            this.metrics1 = img1;
            this.metrics2 = img2;
            repaint();
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            if (metrics1 == null || metrics2 == null) return;

            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            int width = getWidth();
            int height = getHeight();
            int padding = 40;
            int chartWidth = width - (padding * 2);
            int chartHeight = height - (padding * 2);

            g2.setColor(new Color(63, 63, 70));
            g2.drawLine(padding, height - padding, width - padding, height - padding);

            double[] v1 = {metrics1.vascularNodes, metrics1.hemorrhages, metrics1.exudates, metrics1.neovascularLoops, metrics1.tortuosityScore, metrics1.endpoints, metrics1.branchPoints, metrics1.largestNetwork, metrics1.vesselDensity * 100};
            double[] v2 = {metrics2.vascularNodes, metrics2.hemorrhages, metrics2.exudates, metrics2.neovascularLoops, metrics2.tortuosityScore, metrics2.endpoints, metrics2.branchPoints, metrics2.largestNetwork, metrics2.vesselDensity * 100};

            int sectionWidth = chartWidth / labels.length;
            int barWidth = Math.min(25, sectionWidth / 3);

            for (int i = 0; i < labels.length; i++) {
                double maxVal = Math.max(v1[i], v2[i]);
                if (maxVal == 0) maxVal = 1;

                int h1 = (int) ((v1[i] / maxVal) * chartHeight * 0.85);
                int h2 = (int) ((v2[i] / maxVal) * chartHeight * 0.85);

                int xCenter = padding + (i * sectionWidth) + (sectionWidth / 2);

                g2.setColor(new Color(37, 99, 235));
                g2.fillRect(xCenter - barWidth - 2, height - padding - h1, barWidth, h1);

                g2.setColor(new Color(51, 170, 24));
                g2.fillRect(xCenter + 2, height - padding - h2, barWidth, h2);

                g2.setColor(new Color(161, 161, 170));
                g2.setFont(new Font("SansSerif", Font.PLAIN, 11));
                FontMetrics fm = g2.getFontMetrics();
                int labelX = xCenter - (fm.stringWidth(labels[i]) / 2);
                g2.drawString(labels[i], labelX, height - padding + 20);

                g2.setFont(new Font("SansSerif", Font.BOLD, 10));
                g2.setColor(Color.WHITE);
                String s1 = (i==4||i==8) ? String.format("%.1f", v1[i]) : String.valueOf((int)v1[i]);
                String s2 = (i==4||i==8) ? String.format("%.1f", v2[i]) : String.valueOf((int)v2[i]);
                g2.drawString(s1, xCenter - barWidth - 2, height - padding - h1 - 5);
                g2.drawString(s2, xCenter + 2, height - padding - h2 - 5);
            }

            g2.setFont(new Font("SansSerif", Font.BOLD, 12));
            g2.setColor(new Color(37, 99, 235));
            g2.drawString("■ Image 1", width - 150, 20);
            g2.setColor(new Color(51, 170, 24));
            g2.drawString("■ Image 2", width - 70, 20);
        }
    }
}