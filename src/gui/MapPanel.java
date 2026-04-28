package gui;

import datastructures.IGraph;
import datastructures.INode;
import datastructures.List;
import imageprocessing.RegionData;

import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;

public class MapPanel extends JPanel {

    private IGraph<RegionData> graph;
    private List<INode<RegionData>> activePath;
    private INode<RegionData>[][] nodeGrid;
    private BufferedImage baseImage;
    private double scaleFactor = 1.0;
    private int gridRows, gridCols, blockSize;

    public MapPanel() {
        setBackground(new Color(24, 24, 27)); 
    }

    // Kept for backward compatibility if MainFrame still calls it with null
    public void setInstructionHook(JLabel label) {
        // No-op: Automated pipeline no longer requires UI instructions for clicks
    }

    public void loadScan(BufferedImage image) {
        this.baseImage = image;
        this.graph = null;
        this.nodeGrid = null;
        this.activePath = null;
        repaint();
    }

    public void setGraphData(IGraph<RegionData> graph, INode<RegionData>[][] nodeGrid, int rows, int cols, int size) {
        this.graph = graph;
        this.nodeGrid = nodeGrid;
        this.gridRows = rows;
        this.gridCols = cols;
        this.blockSize = size;
        this.activePath = null;
        repaint();
    }

    public void setActivePath(List<INode<RegionData>> path) {
        this.activePath = path;
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g;
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        if (baseImage != null) {
            // Calculate how much we need to shrink the image to fit the panel
            double scaleX = (double) getWidth() / baseImage.getWidth();
            double scaleY = (double) getHeight() / baseImage.getHeight();
            scaleFactor = Math.min(scaleX, scaleY);
            if (scaleFactor > 1.0) scaleFactor = 1.0; // Prevent zooming in on small images
            
            // Shrink the entire canvas
            g2d.scale(scaleFactor, scaleFactor);
            g2d.drawImage(baseImage, 0, 0, null);
        }
        if (graph == null || nodeGrid == null) return;

        // 1. Draw Vessels and Anomalies
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.5f)); 
        for (int r = 0; r < gridRows; r++) {
            for (int c = 0; c < gridCols; c++) {
                INode<RegionData> node = nodeGrid[r][c];
                if (node == null) continue;

                int x = c * blockSize;
                int y = r * blockSize;

                if (node.getData().isAnomaly()) {
                    g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.9f));
                    g2d.setColor(new Color(239, 68, 68)); // Crimson
                    g2d.fillOval(x - (blockSize/2), y - (blockSize/2), blockSize * 2, blockSize * 2); 
                    g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 0.5f));
                } else if (node.getData().isVessel()) {
                    g2d.setColor(new Color(16, 185, 129)); // Teal
                    g2d.fillRect(x, y, blockSize, blockSize);
                }
            }
        }

        // 2. Draw Dijkstra Path (Automated)
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, 1.0f));
        if (activePath != null && activePath.size() > 0) {
            g2d.setColor(new Color(56, 189, 248)); // Neon Cyan
            g2d.setStroke(new BasicStroke(3));
            for (int i = 0; i < activePath.size() - 1; i++) {
                RegionData d1 = activePath.get(i).getData();
                RegionData d2 = activePath.get(i+1).getData();
                g2d.drawLine(d1.getGridX() * blockSize + (blockSize/2), d1.getGridY() * blockSize + (blockSize/2),
                             d2.getGridX() * blockSize + (blockSize/2), d2.getGridY() * blockSize + (blockSize/2));
            }
        }
    }
}